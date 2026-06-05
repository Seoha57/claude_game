import type { CombatState, Enemy, Player } from '../types';
import { ENEMY_DEFS } from '../content/enemies';
import { drawCards, shuffle, maybeTriggerPhase } from './effects';
import { applyStatus, getStatus } from './statuses';
import { makeRng, randInt, uid } from '../rng';
import { getModifiers } from '../ascension';
import { getRunOrNull } from '../state';
import { checkBurnKill } from '../achievements';
import { getEffectiveDef } from '../content/cards';

const PLAYER_DRAW = 5;

export function startCombat(player: Player, enemyDefIds: string[], seed: number): CombatState {
  const rng = makeRng(seed);
  const enemies: Enemy[] = enemyDefIds.map((id) => spawnEnemy(id, rng));

  // Reset combat-only fields
  player.block = 0;
  player.energy = player.maxEnergy;
  player.statuses = {};
  player.draw = shuffle(rng, player.deck.slice());
  player.hand = [];
  player.discard = [];
  player.exhaust = [];

  const state: CombatState = {
    player,
    enemies,
    turn: 0,
    phase: 'start',
    log: [],
    rng,
    flags: {},
  };

  // Decide initial intents
  for (const e of enemies) {
    e.intent = ENEMY_DEFS[e.defId].decideIntent(state, e, 0);
  }

  // Apply relic-driven combat-start hooks (kept simple — handled elsewhere if added)
  beginPlayerTurn(state);
  return state;
}

export function spawnEnemy(defId: string, rng: () => number): Enemy {
  const def = ENEMY_DEFS[defId];
  const run = getRunOrNull();
  const mods = getModifiers(run?.ascension ?? 0);
  const baseHp = randInt(rng, def.hpRange[0], def.hpRange[1]);
  // 데일리 제약: 적 HP 배율
  const dailyMult = run?.dailyConfig?.enemyHpMult ?? 1;
  const hp = Math.round(baseHp * mods.enemyHpMult * dailyMult);
  const enemy: Enemy = {
    uid: uid(),
    defId,
    hp,
    maxHp: hp,
    block: 0,
    statuses: {},
    intent: { kind: 'unknown' },
    turn: 0,
  };
  if (mods.enemyStrBonus > 0) {
    applyStatus(enemy, 'strength', mods.enemyStrBonus);
  }
  return enemy;
}

export function beginPlayerTurn(state: CombatState): void {
  state.turn += 1;
  state.phase = 'player';
  const p = state.player;
  p.block = 0;
  p.energy = p.maxEnergy;
  state.flags.firstAttackThisTurn = true;
  // Reset per-turn signature counters
  state.flags.cardsPlayedThisTurn = 0;
  state.flags.fighterProcThisTurn = false;

  // Innate cards — on turn 1 only, pull all innates from draw pile to hand
  // up to hand cap (10). Then normal draw fills the rest.
  if (state.turn === 1) {
    const innates: typeof p.draw = [];
    const rest: typeof p.draw = [];
    for (const c of p.draw) {
      const def = getEffectiveDef(c);
      if (def.innate) innates.push(c);
      else rest.push(c);
    }
    p.draw = rest;
    for (const c of innates) {
      if (p.hand.length >= 10) break;
      p.hand.push(c);
    }
  }

  // Per-turn relic effects
  const run = getRunOrNull();
  if (run) {
    if (run.player.relics.includes('demon_seal')) applyStatus(p, 'strength', 1);
    if (run.player.relics.includes('mage_orb')) {
      const alive = state.enemies.filter((e) => e.hp > 0);
      if (alive.length > 0) {
        const target = alive[Math.floor(state.rng() * alive.length)];
        // Direct damage (non-attack, no strength/vuln scaling)
        const absorbed = Math.min(target.block, 3);
        target.block -= absorbed;
        target.hp = Math.max(0, target.hp - (3 - absorbed));
        state.log.push(`마탑의 결정 → ${target.defId}에게 3 데미지`);
      }
    }
    if (run.player.relics.includes('storm_core')) {
      const alive = state.enemies.filter((e) => e.hp > 0);
      if (alive.length > 0) {
        const target = alive[Math.floor(state.rng() * alive.length)];
        const absorbed = Math.min(target.block, 6);
        target.block -= absorbed;
        target.hp = Math.max(0, target.hp - (6 - absorbed));
        state.log.push(`폭풍의 핵 → ${target.defId}에게 6 데미지`);
      }
    }
    if (run.player.relics.includes('storm_banner')) p.block += 4;
  }

  // Start-of-turn statuses for player
  applyStartOfTurnStatuses(p, state, '플레이어');

  // 데일리 제약: 손패 ±N
  const drawCount = Math.max(1, PLAYER_DRAW + (run?.dailyConfig?.handDrawDelta ?? 0));
  drawCards(state, drawCount);
  if (run?.player.relics.includes('hourglass')) drawCards(state, 1);
  if (run?.player.relics.includes('eternal_hourglass')) drawCards(state, 2);
}

function applyStartOfTurnStatuses(c: any, state: CombatState, name: string): void {
  const poison = getStatus(c.statuses, 'poison');
  if (poison > 0) {
    c.hp = Math.max(0, c.hp - poison);
    applyStatus(c, 'poison', -1);
    state.log.push(`${name} 중독 ${poison} 데미지`);
    // 도트로 보스가 절반 HP를 넘겼을 수 있으니 페이즈 전환 체크
    if (c !== state.player) maybeTriggerPhase(state, c);
  }
}

export function endPlayerTurn(state: CombatState): void {
  const p = state.player;
  // End-of-turn hand handling:
  // - retain: stays in hand
  // - ethereal (and not retain): exhausts
  // - others: discard
  const retained: typeof p.hand = [];
  for (const c of p.hand) {
    const def = getEffectiveDef(c);
    if (def.retain) {
      retained.push(c);
    } else if (def.ethereal) {
      p.exhaust.push(c);
    } else {
      p.discard.push(c);
    }
  }
  p.hand = retained;

  // Player end-of-turn statuses
  endOfTurnStatuses(p, state, '플레이어');
  if (p.hp <= 0) {
    state.phase = 'lost';
    return;
  }

  state.phase = 'enemy_act';
  for (const e of state.enemies) {
    if (e.hp <= 0) continue;
    e.block = 0;
    const enemyName = ENEMY_DEFS[e.defId]?.name ?? e.defId;
    applyStartOfTurnStatuses(e, state, enemyName);
    if (e.hp <= 0) continue;
    // Freeze — skip enemy action, consume one stack
    const frozen = getStatus(e.statuses, 'freeze');
    if (frozen > 0) {
      state.log.push(`${enemyName} 빙결 — 행동 불가`);
      applyStatus(e, 'freeze', -1);
    } else {
      ENEMY_DEFS[e.defId].act(state, e);
      if (state.player.hp <= 0) {
        state.phase = 'lost';
        return;
      }
    }
    // 적이 자기 공격 중 가시 등으로 죽었으면 턴종료 상태처리(재생 부활 등) 스킵
    if (e.hp <= 0) continue;
    endOfTurnStatuses(e, state, enemyName);
    e.turn += 1;
    e.intent = ENEMY_DEFS[e.defId].decideIntent(state, e, e.turn);
  }

  // Check victory
  if (state.enemies.every((e) => e.hp <= 0)) {
    state.phase = 'won';
    return;
  }

  beginPlayerTurn(state);
}

function endOfTurnStatuses(c: any, state: CombatState, name: string): void {
  const regen = getStatus(c.statuses, 'regen');
  // 죽은 대상은 재생으로 부활하지 않는다
  if (regen > 0 && c.hp > 0) {
    if (c.maxHp !== undefined) {
      c.hp = Math.min(c.maxHp, c.hp + regen);
      state.log.push(`${name} 재생 ${regen} 회복`);
      // 프리스트 신성한 인장: 재생이 발동할 때마다 방어도 +3
      if (c === state.player) {
        const run = getRunOrNull();
        if (run?.player.relics.includes('holy_seal')) {
          c.block += 3;
          state.log.push('신성한 인장 → 방어도 +3');
        }
      }
    }
    applyStatus(c, 'regen', -1);
  }
  const ritual = getStatus(c.statuses, 'ritual');
  if (ritual > 0) {
    applyStatus(c, 'strength', ritual);
    state.log.push(`${name} 의식: 힘 +${ritual}`);
  }
  const metal = getStatus(c.statuses, 'metallicize');
  if (metal > 0) {
    c.block += metal;
  }
  // Burn — direct damage at end of turn (block doesn't absorb), then decay
  const burn = getStatus(c.statuses, 'burn');
  if (burn > 0) {
    const wasAlive = c.hp > 0;
    c.hp = Math.max(0, c.hp - burn);
    state.log.push(`${name} 화상 ${burn} 데미지`);
    applyStatus(c, 'burn', -1);
    // Achievement: enemy killed by burn (c is enemy if it's not the player object)
    if (wasAlive && c.hp <= 0 && c !== state.player) {
      checkBurnKill();
    }
    // 도트로 보스가 절반 HP를 넘겼을 수 있으니 페이즈 전환 체크
    if (c !== state.player) maybeTriggerPhase(state, c);
  }
  // decay debuffs/buffs that decay
  for (const k of ['vulnerable', 'weak', 'frail'] as const) {
    if (getStatus(c.statuses, k) > 0) applyStatus(c, k, -1);
  }
}

export function canPlayCard(state: CombatState, costAfterMods: number): boolean {
  return state.player.energy >= costAfterMods;
}
