// 헤드리스 전투 시뮬레이터
//
// 실제 전투 엔진(combat.ts / effects.ts)을 그대로 돌린다. UI는 건드리지 않고,
// UI가 하던 일(에너지 차감, 타겟 선택, 승리 판정)만 여기서 대신한다.
//
// 보상·포션·유물 획득은 재현하지 않는다. 즉 모든 캐릭터가 시작 덱 그대로
// 싸우므로, 시작 덱과 시작 유물의 균형을 비교하는 용도다.

import { startNewRun, getRun } from '../state';
import { startCombat, endPlayerTurn } from '../combat/combat';
import { playCard } from '../combat/effects';
import { getEffectiveDef } from '../content/cards';
import {
  EASY_ENCOUNTERS,
  NORMAL_ENCOUNTERS,
  ELITE_ENCOUNTERS,
  BOSS_ENCOUNTERS,
} from '../content/enemies';
import type { CardInstance, CharacterClass, CombatState, Enemy, Player } from '../types';

const CURSE_IDS = new Set(['wound', 'decay', 'parasite', 'doubt']);
const MAX_TURNS = 80;

export type CombatResult = 'won' | 'lost' | 'timeout';

/** 적 의도에서 이번 턴 들어올 데미지를 추정한다. */
function incomingDamage(state: CombatState): number {
  let total = 0;
  for (const e of state.enemies) {
    if (e.hp <= 0) continue;
    const it = e.intent;
    if (it?.kind === 'attack' && it.damage) total += it.damage * (it.hits ?? 1);
  }
  return total;
}

function isDefensive(card: CardInstance): boolean {
  return getEffectiveDef(card).effects.some((e) => e.kind === 'block' || e.kind === 'block_dice');
}

function isOffensive(card: CardInstance): boolean {
  return getEffectiveDef(card).effects.some((e) =>
    e.kind === 'damage' || e.kind === 'damage_all' || e.kind === 'lifesteal'
    || e.kind === 'lifesteal_all' || e.kind === 'damage_dice' || e.kind === 'damage_all_dice');
}

/**
 * 카드 우선순위. 맞을 데미지를 못 막겠으면 방어, 아니면 공격.
 * 사람처럼 잘 두지는 않지만 모든 캐릭터에 같은 기준을 적용하므로 비교에는 쓸 만하다.
 */
function scoreCard(card: CardInstance, state: CombatState): number {
  const def = getEffectiveDef(card);
  if (CURSE_IDS.has(def.id)) return -1;
  const unblocked = incomingDamage(state) - state.player.block;
  const needsBlock = unblocked > 0;
  let score = 10;
  if (def.type === 'power') score += 30;           // 파워는 빨리 깔수록 이득
  if (isDefensive(card)) score += needsBlock ? 40 : 2;
  if (isOffensive(card)) score += needsBlock ? 15 : 35;
  if (def.effects.some((e) => e.kind === 'draw' || e.kind === 'energy')) score += 12;
  score -= def.cost * 3;
  return score;
}

/** 가장 체력이 적은 생존 적 — 빨리 죽일수록 맞는 횟수가 준다. */
function pickTarget(state: CombatState): Enemy | null {
  const alive = state.enemies.filter((e) => e.hp > 0);
  if (alive.length === 0) return null;
  return alive.reduce((a, b) => (a.hp <= b.hp ? a : b));
}

function playTurn(state: CombatState): void {
  // 더 낼 카드가 없을 때까지 반복
  for (let guard = 0; guard < 40; guard++) {
    if (state.phase !== 'player') return;
    const playable = state.player.hand
      .filter((c) => {
        const def = getEffectiveDef(c);
        return !CURSE_IDS.has(def.id) && def.cost >= 0 && state.player.energy >= def.cost;
      })
      .sort((a, b) => scoreCard(b, state) - scoreCard(a, state));
    if (playable.length === 0) return;

    const card = playable[0];
    const def = getEffectiveDef(card);
    const target = def.target === 'enemy' ? pickTarget(state) : null;
    if (def.target === 'enemy' && !target) return;

    state.player.energy -= def.cost;
    playCard(state, card, target, () => { /* 로그 무시 */ });

    if (state.enemies.every((e) => e.hp <= 0)) { state.phase = 'won'; return; }
    if (state.player.hp <= 0) { state.phase = 'lost'; return; }
  }
}

export interface CombatStats {
  result: CombatResult;
  turns: number;
  /** 적 전체 HP 중 깎아낸 비율 (0~1). 졌을 때 얼마나 근접했는지 보는 연속 지표. */
  enemyDamagePct: number;
}

/** 전투 하나를 끝까지 돌린다. player는 그 자리에서 변경된다. */
export function simulateCombatStats(player: Player, enemyIds: string[], seed: number): CombatStats {
  const state = startCombat(player, enemyIds, seed);
  const totalEnemyHp = state.enemies.reduce((s, e) => s + e.hp, 0);
  let turns = 0;
  for (; turns < MAX_TURNS; turns++) {
    if (state.phase !== 'player') break;
    playTurn(state);
    if (state.phase !== 'player') break;
    endPlayerTurn(state);
  }
  const left = state.enemies.reduce((s, e) => s + Math.max(0, e.hp), 0);
  const result: CombatResult = state.phase === 'won' ? 'won'
    : (state.phase === 'lost' || player.hp <= 0) ? 'lost' : 'timeout';
  return {
    result,
    turns,
    enemyDamagePct: totalEnemyHp > 0 ? (totalEnemyHp - left) / totalEnemyHp : 1,
  };
}

export function simulateCombat(player: Player, enemyIds: string[], seed: number): CombatResult {
  return simulateCombatStats(player, enemyIds, seed).result;
}

function pick<T>(table: T[], seed: number): T {
  return table[Math.abs(seed) % table.length];
}

export interface FightOutcome {
  result: CombatResult;
  hpLeft: number;
  maxHp: number;
  /** 갠틀릿에서만 의미 있음 — 돌파한 전투 수 */
  cleared?: number;
}

/** 시작 덱 그대로 챕터 1 보스와 단판 승부. */
export function simulateBossFight(cls: CharacterClass, seed: number, ascension = 0): FightOutcome {
  startNewRun(seed, ascension, cls);
  const player = getRun().player;
  const boss = pick(BOSS_ENCOUNTERS, seed);
  const result = simulateCombat(player, boss, seed);
  return { result, hpLeft: Math.max(0, player.hp), maxHp: player.maxHp };
}

/** 쉬움 3 → 보통 2 → 엘리트 1 → 보스 1. 중간 회복 없음. */
export function simulateGauntlet(cls: CharacterClass, seed: number, ascension = 0): FightOutcome {
  startNewRun(seed, ascension, cls);
  const player = getRun().player;
  const fights: string[][] = [
    pick(EASY_ENCOUNTERS, seed), pick(EASY_ENCOUNTERS, seed + 1), pick(EASY_ENCOUNTERS, seed + 2),
    pick(NORMAL_ENCOUNTERS, seed + 3), pick(NORMAL_ENCOUNTERS, seed + 4),
    pick(ELITE_ENCOUNTERS, seed + 5),
    pick(BOSS_ENCOUNTERS, seed + 6),
  ];
  for (let i = 0; i < fights.length; i++) {
    const r = simulateCombat(player, fights[i], seed + i * 31);
    if (r !== 'won') {
      return { result: r, hpLeft: Math.max(0, player.hp), maxHp: player.maxHp, cleared: i };
    }
  }
  return { result: 'won', hpLeft: Math.max(0, player.hp), maxHp: player.maxHp, cleared: fights.length };
}

/** 갠틀릿에서 돌파한 전투 수 (0~7). 승률이 전부 0이라 이쪽이 변별력이 있다. */
export const GAUNTLET_LENGTH = 7;

/** 한 전투만 떼어서 본다 — 시작 덱으로 이 난이도를 어떻게 넘기는지. */
function singleFight(cls: CharacterClass, table: string[][], seed: number, ascension: number) {
  startNewRun(seed, ascension, cls);
  const player = getRun().player;
  const stats = simulateCombatStats(player, pick(table, seed), seed);
  return { ...stats, hpLeftPct: Math.max(0, player.hp) / player.maxHp };
}

export interface ClassReport {
  cls: CharacterClass;
  runs: number;
  easyWinRate: number;
  normalWinRate: number;
  eliteWinRate: number;
  /** 쉬움 전투를 이기고 남은 평균 HP 비율 — 같은 승률이어도 손해가 다르다. */
  easyHpLeftPct: number;
  /** 보스 HP를 평균 몇 % 깎는가. 시작 덱으로는 거의 못 이기므로 이쪽이 변별력이 있다. */
  bossDamagePct: number;
  gauntletWinRate: number;
  /** 갠틀릿에서 평균 몇 전투까지 갔나 (최대 7) */
  gauntletCleared: number;
  timeouts: number;
}

export function reportClass(cls: CharacterClass, runs: number, ascension = 0): ClassReport {
  let easy = 0, normal = 0, elite = 0, gauntlet = 0, timeouts = 0;
  let easyHpSum = 0, bossDmgSum = 0, clearedSum = 0;
  for (let i = 0; i < runs; i++) {
    const seed = 1000 + i * 7919;

    const e = singleFight(cls, EASY_ENCOUNTERS, seed, ascension);
    if (e.result === 'won') { easy++; easyHpSum += e.hpLeftPct; }
    if (e.result === 'timeout') timeouts++;

    const n = singleFight(cls, NORMAL_ENCOUNTERS, seed + 1, ascension);
    if (n.result === 'won') normal++;
    if (n.result === 'timeout') timeouts++;

    const el = singleFight(cls, ELITE_ENCOUNTERS, seed + 2, ascension);
    if (el.result === 'won') elite++;
    if (el.result === 'timeout') timeouts++;

    const b = singleFight(cls, BOSS_ENCOUNTERS, seed + 3, ascension);
    bossDmgSum += b.enemyDamagePct;
    if (b.result === 'timeout') timeouts++;

    const g = simulateGauntlet(cls, seed, ascension);
    if (g.result === 'won') gauntlet++;
    if (g.result === 'timeout') timeouts++;
    clearedSum += g.cleared ?? 0;
  }
  return {
    cls,
    runs,
    easyWinRate: easy / runs,
    normalWinRate: normal / runs,
    eliteWinRate: elite / runs,
    easyHpLeftPct: easy > 0 ? easyHpSum / easy : 0,
    bossDamagePct: bossDmgSum / runs,
    gauntletWinRate: gauntlet / runs,
    gauntletCleared: clearedSum / runs,
    timeouts,
  };
}

export const ALL_CLASSES: CharacterClass[] = [
  'swordmaster', 'gunner', 'fighter', 'magician', 'priest',
  'thief', 'summoner', 'engineer', 'gambler', 'blood_mage',
];
