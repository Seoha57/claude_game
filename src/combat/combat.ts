import type { CombatState, Enemy, Player } from '../types';
import { ENEMY_DEFS } from '../content/enemies';
import { drawCards, shuffle } from './effects';
import { applyStatus, getStatus } from './statuses';
import { makeRng, randInt, uid } from '../rng';
import { getModifiers } from '../ascension';
import { getRunOrNull } from '../state';

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
  const hp = Math.round(baseHp * mods.enemyHpMult);
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
  }

  // Start-of-turn statuses for player
  applyStartOfTurnStatuses(p, state, '플레이어');

  drawCards(state, PLAYER_DRAW);
  if (run?.player.relics.includes('hourglass')) drawCards(state, 1);
}

function applyStartOfTurnStatuses(c: any, state: CombatState, name: string): void {
  const poison = getStatus(c.statuses, 'poison');
  if (poison > 0) {
    c.hp = Math.max(0, c.hp - poison);
    applyStatus(c, 'poison', -1);
    state.log.push(`${name} 중독 ${poison} 데미지`);
  }
}

export function endPlayerTurn(state: CombatState): void {
  const p = state.player;
  // Discard hand
  for (const c of p.hand) p.discard.push(c);
  p.hand = [];

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
    ENEMY_DEFS[e.defId].act(state, e);
    if (state.player.hp <= 0) {
      state.phase = 'lost';
      return;
    }
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
  if (regen > 0) {
    if (c.maxHp !== undefined) {
      c.hp = Math.min(c.maxHp, c.hp + regen);
      state.log.push(`${name} 재생 ${regen} 회복`);
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
  // decay debuffs/buffs that decay
  for (const k of ['vulnerable', 'weak', 'frail'] as const) {
    if (getStatus(c.statuses, k) > 0) applyStatus(c, k, -1);
  }
}

export function canPlayCard(state: CombatState, costAfterMods: number): boolean {
  return state.player.energy >= costAfterMods;
}
