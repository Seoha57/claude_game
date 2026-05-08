import type {
  CardInstance,
  CombatState,
  Effect,
  Enemy,
  Player,
} from '../types';
import { modifiedAttackDamage, modifiedBlockGain, applyStatus, getStatus, STATUS_INFO } from './statuses';
import { getEffectiveDef } from '../content/cards';
import { ENEMY_DEFS } from '../content/enemies';

// Apply raw damage to a combatant, accounting for block. Returns hp damage dealt (post-block).
export function dealDamage(
  _state: CombatState,
  attacker: { statuses: any },
  target: { hp: number; block: number; statuses: any; maxHp: number },
  rawAmount: number,
  fromAttack: boolean,
): number {
  let dmg = rawAmount;
  if (fromAttack) {
    dmg = modifiedAttackDamage(rawAmount, attacker as any, target as any);
  }
  const absorbed = Math.min(target.block, dmg);
  target.block -= absorbed;
  const hpDmg = dmg - absorbed;
  target.hp = Math.max(0, target.hp - hpDmg);

  // thorns: only triggers on attacks
  if (fromAttack && hpDmg > 0) {
    const thorns = getStatus((target as any).statuses, 'thorns');
    if (thorns > 0) {
      // reflect to attacker (no further mods)
      const a = attacker as any;
      const ab = Math.min(a.block ?? 0, thorns);
      if (a.block !== undefined) a.block -= ab;
      a.hp = Math.max(0, a.hp - (thorns - ab));
    }
  }
  return hpDmg;
}

export function gainBlock(c: { block: number; statuses: any }, base: number): void {
  c.block += modifiedBlockGain(base, c as any);
}

export function applyEffect(
  state: CombatState,
  effect: Effect,
  source: Player | Enemy,
  targetEnemy: Enemy | null,
  log: (s: string) => void,
): void {
  const player = state.player;
  switch (effect.kind) {
    case 'damage': {
      const times = effect.times ?? 1;
      const tgt = targetEnemy ?? state.enemies.find((e) => e.hp > 0) ?? null;
      if (!tgt) return;
      for (let i = 0; i < times; i++) {
        if (tgt.hp <= 0) break;
        const hpDmg = dealDamage(state, source, tgt, effect.amount, true);
        log(`${nameOf(source, state)} → ${nameOf(tgt, state)}: ${hpDmg} 데미지`);
        state.flags.firstAttackThisTurn = false;
      }
      return;
    }
    case 'damage_all': {
      for (const e of state.enemies) {
        if (e.hp <= 0) continue;
        const hpDmg = dealDamage(state, source, e, effect.amount, true);
        log(`전체 → ${nameOf(e, state)}: ${hpDmg} 데미지`);
      }
      state.flags.firstAttackThisTurn = false;
      return;
    }
    case 'block': {
      gainBlock(source as any, effect.amount);
      log(`${nameOf(source, state)} 방어도 +${effect.amount}`);
      return;
    }
    case 'draw': {
      drawCards(state, effect.amount);
      log(`${effect.amount}장 드로우`);
      return;
    }
    case 'energy': {
      player.energy += effect.amount;
      log(`에너지 +${effect.amount}`);
      return;
    }
    case 'apply_self': {
      applyStatus(source as any, effect.status, effect.amount);
      log(`${nameOf(source, state)} ${statusName(effect.status)} +${effect.amount}`);
      return;
    }
    case 'apply_enemy': {
      const tgt = targetEnemy ?? state.enemies.find((e) => e.hp > 0) ?? null;
      if (!tgt) return;
      applyStatus(tgt, effect.status, effect.amount);
      log(`${nameOf(tgt, state)} ${statusName(effect.status)} +${effect.amount}`);
      return;
    }
    case 'apply_all': {
      for (const e of state.enemies) {
        if (e.hp <= 0) continue;
        applyStatus(e, effect.status, effect.amount);
      }
      log(`모든 적에게 ${statusName(effect.status)} +${effect.amount}`);
      return;
    }
    case 'heal': {
      player.hp = Math.min(player.maxHp, player.hp + effect.amount);
      log(`회복 +${effect.amount}`);
      return;
    }
    case 'lose_hp': {
      player.hp = Math.max(0, player.hp - effect.amount);
      log(`HP -${effect.amount}`);
      return;
    }
    case 'exhaust_random_hand': {
      if (player.hand.length === 0) return;
      const idx = Math.floor(state.rng() * player.hand.length);
      const [c] = player.hand.splice(idx, 1);
      player.exhaust.push(c);
      log(`무작위 카드 소멸`);
      return;
    }
    case 'discard_random': {
      for (let i = 0; i < effect.amount; i++) {
        if (player.hand.length === 0) break;
        const idx = Math.floor(state.rng() * player.hand.length);
        const [c] = player.hand.splice(idx, 1);
        player.discard.push(c);
      }
      log(`${effect.amount}장 무작위 버림`);
      return;
    }
    case 'block_all_enemies_attack_lose':
      return;
  }
}

function nameOf(c: Player | Enemy, _state: CombatState): string {
  if ((c as Player).deck !== undefined) return '플레이어';
  const e = c as Enemy;
  return ENEMY_DEFS[e.defId]?.name ?? e.defId;
}

function statusName(key: string): string {
  return (STATUS_INFO as any)[key]?.name ?? key;
}

export function drawCards(state: CombatState, n: number): void {
  const p = state.player;
  for (let i = 0; i < n; i++) {
    if (p.hand.length >= 10) return;
    if (p.draw.length === 0) {
      if (p.discard.length === 0) return;
      p.draw = shuffle(state.rng, p.discard);
      p.discard = [];
    }
    const c = p.draw.pop();
    if (c) p.hand.push(c);
  }
}

export function shuffle<T>(rng: () => number, arr: T[]): T[] {
  const out = arr.slice();
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

// Resolve a played card (effects + post-play movement)
export function playCard(
  state: CombatState,
  card: CardInstance,
  targetEnemy: Enemy | null,
  log: (s: string) => void,
): void {
  const def = getEffectiveDef(card);
  if (!def) return;
  const p = state.player;
  // remove from hand first
  const idx = p.hand.findIndex((c) => c.uid === card.uid);
  if (idx >= 0) p.hand.splice(idx, 1);

  for (const e of def.effects) {
    applyEffect(state, e, p, targetEnemy, log);
  }

  // movement
  if (def.exhaust) p.exhaust.push(card);
  else p.discard.push(card);
}
