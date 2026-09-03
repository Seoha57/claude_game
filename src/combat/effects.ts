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
import { getRunOrNull } from '../state';
import { playSfx } from '../audio';
import { checkRitual } from '../achievements';

// Apply raw damage to a combatant, accounting for block. Returns hp damage dealt (post-block).
export function dealDamage(
  state: CombatState,
  attacker: { statuses: any; hp?: number },
  target: { hp: number; block: number; statuses: any; maxHp: number },
  rawAmount: number,
  fromAttack: boolean,
): number {
  // 죽은 공격자는 더 이상 데미지를 줄 수 없음 (가시로 막타 후 남은 다단 히트 차단)
  if (attacker.hp !== undefined && attacker.hp <= 0) return 0;

  let dmg = rawAmount;
  if (fromAttack) {
    dmg = modifiedAttackDamage(rawAmount, attacker as any, target as any);
  }
  const absorbed = Math.min(target.block, dmg);
  target.block -= absorbed;
  const hpDmg = dmg - absorbed;
  target.hp = Math.max(0, target.hp - hpDmg);

  // 가시: 공격을 받기만 하면 발동 (블록으로 전부 막혀도 반사됨, STS 동작)
  if (fromAttack) {
    const thorns = getStatus((target as any).statuses, 'thorns');
    if (thorns > 0) {
      // 반사 데미지는 공격자의 블록을 먼저 깎고, 남으면 HP
      const a = attacker as any;
      const ab = Math.min(a.block ?? 0, thorns);
      if (a.block !== undefined) a.block -= ab;
      if (a.hp !== undefined) a.hp = Math.max(0, a.hp - (thorns - ab));
    }
  }

  // Phase transition: if target is an enemy and just crossed half HP, fire onHalfHp
  maybeTriggerPhase(state, target as Partial<Enemy>);
  return hpDmg;
}

// 적이 HP 절반 이하로 떨어지면 onHalfHp 페이즈 전환을 한 번 발동.
// 직접 데미지(도트/유물)에서도 호출되도록 export.
export function maybeTriggerPhase(state: CombatState, t: Partial<Enemy>): void {
  if (t.defId === undefined || t.hp === undefined || t.maxHp === undefined) return;
  if (t.hp <= 0 || t.phaseTriggered) return;
  if (t.hp <= t.maxHp / 2) {
    const def = ENEMY_DEFS[t.defId];
    if (def?.onHalfHp) {
      t.phaseTriggered = true;
      const flavor = def.onHalfHp(state, t as Enemy);
      state.log.push(`⚡ ${def.name}: ${flavor}`);
      playSfx('boss_phase');
    }
  }
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
        // 시그니처(독니): 매 턴 첫 공격 시 적에게 중독 부여
        if (state.flags.firstAttackThisTurn && getRunOrNull()?.player.relics.includes('venom_fang')) {
          applyStatus(tgt, 'poison', 2);
          log('독니 → 중독 +2');
        }
        const modified = modifyAttackAmount(state, effect.amount);
        const hpDmg = dealDamage(state, source, tgt, modified, true);
        log(`${nameOf(source, state)} → ${nameOf(tgt, state)}: ${hpDmg} 데미지`);
        state.flags.firstAttackThisTurn = false;
        onAttackAfter(state, log);
      }
      return;
    }
    case 'damage_all': {
      const isFirst = state.flags.firstAttackThisTurn;
      state.flags.firstAttackThisTurn = false;
      for (const e of state.enemies) {
        if (e.hp <= 0) continue;
        if (isFirst && getRunOrNull()?.player.relics.includes('venom_fang')) {
          applyStatus(e, 'poison', 2);
          log('독니 → 중독 +2');
        }
        const modified = modifyAttackAmount(state, effect.amount);
        const hpDmg = dealDamage(state, source, e, modified, true);
        log(`전체 → ${nameOf(e, state)}: ${hpDmg} 데미지`);
        onAttackAfter(state, log);
      }
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
      playStatusSfx(effect.status, true);
      if (effect.status === 'ritual') {
        checkRitual(getStatus((source as any).statuses, 'ritual'));
      }
      return;
    }
    case 'apply_enemy': {
      const tgt = targetEnemy ?? state.enemies.find((e) => e.hp > 0) ?? null;
      if (!tgt) return;
      applyEnemyStatus(tgt, effect.status, effect.amount, log);
      playStatusSfx(effect.status, false);
      return;
    }
    case 'apply_all': {
      for (const e of state.enemies) {
        if (e.hp <= 0) continue;
        applyEnemyStatus(e, effect.status, effect.amount, log);
      }
      log(`모든 적에게 ${statusName(effect.status)} +${effect.amount}`);
      playStatusSfx(effect.status, false);
      return;
    }
    case 'heal': {
      player.hp = Math.min(player.maxHp, player.hp + effect.amount);
      log(`회복 +${effect.amount}`);
      onHealTrigger(state, log);
      return;
    }
    case 'lose_hp': {
      player.hp = Math.max(0, player.hp - effect.amount);
      log(`HP -${effect.amount}`);
      return;
    }
    case 'exhaust_random_hand': {
      const eligible = player.hand.filter((c) => c.defId !== 'parasite');
      if (eligible.length === 0) return;
      const pick = eligible[Math.floor(state.rng() * eligible.length)];
      const idx = player.hand.indexOf(pick);
      player.hand.splice(idx, 1);
      player.exhaust.push(pick);
      log(`무작위 카드 소멸`);
      triggerOnExhaust(state, log);
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
    case 'conditional': {
      if (evalCondition(state, effect.condition)) {
        for (const inner of effect.then) {
          applyEffect(state, inner, source, targetEnemy, log);
        }
      }
      return;
    }
    case 'damage_per_attack': {
      const count = state.flags.attackCount ?? 0;
      const amount = effect.amount * count;
      if (amount <= 0) return;
      applyEffect(state, { kind: 'damage', amount }, source, targetEnemy, log);
      return;
    }
    case 'damage_per_card_this_turn': {
      const count = state.flags.cardsPlayedThisTurn ?? 0;
      const amount = effect.amount * count;
      if (amount <= 0) return;
      applyEffect(state, { kind: 'damage', amount }, source, targetEnemy, log);
      return;
    }
  }
}

function evalCondition(state: CombatState, cond: import('../types').EffectCondition): boolean {
  switch (cond.kind) {
    case 'nth_or_more':
      return (state.flags.cardsPlayedThisTurn ?? 0) >= cond.n;
    case 'first_this_turn':
      return (state.flags.cardsPlayedThisTurn ?? 0) === 1;
    case 'after_type':
      // playCard ensures lastPlayedType holds the PREVIOUS card's type while effects run.
      return state.flags.lastPlayedType === cond.type;
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

// 적에게 상태이상 적용. 보스는 빙결 저항:
// 1) 최대 1턴만 빙결  2) 해제 후 2턴간 면역
function applyEnemyStatus(e: Enemy, status: any, amount: number, log: (s: string) => void): void {
  const def = ENEMY_DEFS[e.defId];
  if (status === 'freeze' && def?.isBoss && amount > 0) {
    if ((e.freezeImmuneTurns ?? 0) > 0) {
      log(`${def.name} 빙결 면역 — ${e.freezeImmuneTurns}턴 남음`);
      return;
    }
    const cur = getStatus(e.statuses, 'freeze');
    const allowed = Math.max(0, 1 - cur);
    if (allowed <= 0) {
      log(`${def.name} 빙결 저항 — 더 얼지 않음`);
      return;
    }
    applyStatus(e, 'freeze', allowed);
    log(`${def.name} 빙결 +${allowed} (보스 저항)`);
    return;
  }
  applyStatus(e, status, amount);
  log(`${ENEMY_DEFS[e.defId]?.name ?? e.defId} ${statusName(status)} +${amount}`);
}

// 상태이상 적용 시 알맞은 SFX 재생.
// onSelf=true: 플레이어가 본인에게 (버프), false: 적에게 (디버프)
function playStatusSfx(statusKey: string, onSelf: boolean): void {
  if (statusKey === 'burn') return playSfx('burn_apply');
  if (statusKey === 'freeze') return playSfx('freeze_apply');
  if (statusKey === 'poison') return playSfx('poison_apply');
  // 본인 적용은 보통 버프, 적 적용은 디버프
  if (onSelf) playSfx('buff_apply');
  else playSfx('debuff_apply');
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
  // 카드가 손패에 없으면(이미 사용됨) 효과를 적용하지 않는다.
  // 빠른 더블클릭으로 분리된 옛 DOM 엘리먼트가 핸들러를 재발동해도
  // 효과/에너지가 중복 적용되는 것을 막는다.
  if (idx < 0) return;
  p.hand.splice(idx, 1);

  // Snapshot alive enemies before effects for on_kill scaling detection
  const beforeAlive = state.enemies.filter((e) => e.hp > 0).length;

  // ── 원소 공명 (마법사) — 방어 카드 사용 시 드로우 (턴당 1회) ──
  const run = getRunOrNull();
  if (run?.player.relics.includes('elemental_resonance')
      && def.type === 'skill' && !state.flags.resonanceUsedThisTurn) {
    state.flags.resonanceUsedThisTurn = true;
    drawCards(state, 1);
    log(`원소 공명 → 카드 +1`);
  }

  // 정령 계약서 (정령술사) — power 카드 사용 시 방어도 +3
  if (run?.player.relics.includes('spirit_contract') && def.type === 'power') {
    p.block += 3;
    log(`정령 계약서 → 방어도 +3`);
  }

  // Track cards played this turn for 일심
  state.flags.cardsPlayedThisTurn = (state.flags.cardsPlayedThisTurn ?? 0) + 1;
  if (run?.player.relics.includes('one_mind_belt')
      && (state.flags.cardsPlayedThisTurn ?? 0) >= 3
      && !state.flags.fighterProcThisTurn) {
    applyStatus(p, 'strength', 1);
    state.flags.fighterProcThisTurn = true;
    log(`일심 → 힘 +1`);
  }

  // 효과를 적용하기 전에 lastPlayedType는 "직전 카드 타입" (이 카드 적용 전 상태) 유지.
  // 콤보 조건 (after_type)이 정확히 평가되도록 함.
  for (const e of def.effects) {
    applyEffect(state, e, p, targetEnemy, log);
  }
  // 효과 적용 끝난 후에야 lastPlayedType을 이 카드 타입으로 갱신
  state.flags.lastPlayedType = def.type;

  // movement
  if (def.exhaust) {
    p.exhaust.push(card);
    triggerOnExhaust(state, log);
  } else {
    p.discard.push(card);
  }

  // Permanent scaling — bonusDamage persists across combats
  if (def.scaling) {
    if (def.scaling.kind === 'on_play') {
      card.bonusDamage = (card.bonusDamage ?? 0) + def.scaling.amount;
      log(`${def.name}: 영구 데미지 +${def.scaling.amount}`);
    } else if (def.scaling.kind === 'on_kill') {
      const afterAlive = state.enemies.filter((e) => e.hp > 0).length;
      if (afterAlive < beforeAlive) {
        card.bonusDamage = (card.bonusDamage ?? 0) + def.scaling.amount;
        log(`${def.name}: 처치! 영구 데미지 +${def.scaling.amount}`);
      }
    }
  }
}

// Fire on-exhaust passive effects (powers like 속박 해방, 확산탄, 용의 분노, 인형의 숲)
function triggerOnExhaust(state: CombatState, log: (s: string) => void): void {
  const p = state.player;
  const str = getStatus(p.statuses, 'on_exhaust_str');
  if (str > 0) {
    applyStatus(p, 'strength', str);
    log(`소멸의 힘 → 힘 +${str}`);
  }
  const draw = getStatus(p.statuses, 'on_exhaust_draw');
  if (draw > 0) {
    drawCards(state, draw);
    log(`소멸 드로우 → ${draw}장 드로우`);
  }
  const block = getStatus(p.statuses, 'on_exhaust_block');
  if (block > 0) {
    p.block += block;
    log(`소멸 방어 → 방어도 +${block}`);
  }
  const energy = getStatus(p.statuses, 'on_exhaust_energy');
  if (energy > 0) {
    p.energy += energy;
    log(`소멸 에너지 → 에너지 +${energy}`);
  }
}

// ── Signature relic hooks ─────────────────────────────────────────
// 데미지 카드가 적에 적용되기 직전 호출. 보너스/배수를 모두 처리한 최종 데미지를 리턴.
// 카운터(검혼/탄창/pen_nib)는 이 시점에 증가시킨다.
export function modifyAttackAmount(state: CombatState, base: number): number {
  const run = getRunOrNull();
  if (!run) return base;
  state.flags.attackCount = (state.flags.attackCount ?? 0) + 1;
  const ac = state.flags.attackCount;
  let amount = base;
  // 검혼: 5번째 공격마다 +6
  if (run.player.relics.includes('gwihon_charm') && ac % 5 === 0) {
    amount += 6;
  }
  // 탄창(사수): 3번째 공격마다 +5 데미지
  if (run.player.relics.includes('gunner_magazine') && ac % 3 === 0) {
    amount += 5;
  }
  // 펜촉: 10번째 공격마다 2배 (검혼/탄창 보너스도 같이 2배가 됨)
  if (run.player.relics.includes('pen_nib') && ac % 10 === 0) {
    amount *= 2;
  }
  return amount;
}

// 데미지 적용 후 호출 — 드로우 등 후속 트리거
export function onAttackAfter(state: CombatState, log: (s: string) => void): void {
  const run = getRunOrNull();
  if (!run) return;
  const ac = state.flags.attackCount ?? 0;
  if (run.player.relics.includes('gwihon_charm') && ac % 5 === 0) {
    log('검혼 발동!');
  }
  if (run.player.relics.includes('gunner_magazine') && ac % 3 === 0) {
    drawCards(state, 1);
    log('탄창 → 카드 +1');
  }
  if (run.player.relics.includes('pen_nib') && ac % 10 === 0) {
    log('펜촉 → 데미지 2배!');
  }
}

// 회복(heal) 또는 재생(regen) 발동 시 호출 (성직자 신성한 인장)
export function onHealTrigger(state: CombatState, log: (s: string) => void): void {
  const run = getRunOrNull();
  if (!run) return;
  if (run.player.relics.includes('holy_seal')) {
    state.player.block += 3;
    log('신성한 인장 → 방어도 +3');
  }
}

