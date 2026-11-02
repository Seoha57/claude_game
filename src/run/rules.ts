// 런 진행 규칙 — 전투 밖에서 벌어지는 일들.
//
// 원래 reward-ui / shop-ui / rest-ui / map-ui / combat-ui 안에 흩어져 있었다.
// DOM과 섞여 있어서 시뮬레이터가 쓸 수 없었고, 그래서 시뮬은 보상·상점·모닥불을
// 아예 재현하지 않았다 (시작 덱으로만 싸웠다). 여기로 끄집어내서 UI와 시뮬이
// 같은 함수를 부른다 — 시뮬 숫자가 실제 게임과 어긋나지 않는다.
//
// 규칙만 둔다. 도감 기록·효과음·리렌더 같은 부수효과는 UI 쪽에 남겨둔다.

import {
  COMMON_CARDS, UNCOMMON_CARDS, RARE_CARDS,
  GUNNER_COMMON_CARDS, GUNNER_UNCOMMON_CARDS, GUNNER_RARE_CARDS,
  FIGHTER_COMMON_CARDS, FIGHTER_UNCOMMON_CARDS, FIGHTER_RARE_CARDS,
  MAGICIAN_COMMON_CARDS, MAGICIAN_UNCOMMON_CARDS, MAGICIAN_RARE_CARDS,
  PRIEST_COMMON_CARDS, PRIEST_UNCOMMON_CARDS, PRIEST_RARE_CARDS,
  THIEF_COMMON_CARDS, THIEF_UNCOMMON_CARDS, THIEF_RARE_CARDS,
  SUMMONER_COMMON_CARDS, SUMMONER_UNCOMMON_CARDS, SUMMONER_RARE_CARDS,
  ENGINEER_COMMON_CARDS, ENGINEER_UNCOMMON_CARDS, ENGINEER_RARE_CARDS,
  GAMBLER_COMMON_CARDS, GAMBLER_UNCOMMON_CARDS, GAMBLER_RARE_CARDS,
  BLOOD_MAGE_COMMON_CARDS, BLOOD_MAGE_UNCOMMON_CARDS, BLOOD_MAGE_RARE_CARDS,
} from '../content/cards';
import { PICKABLE_RELICS, ELITE_RELICS, BOSS_RELICS, getActiveSynergies } from '../content/relics';
import { POTION_LIST, POTION_DEFS } from '../content/potions';
import { isCardUnlocked, isRelicUnlocked } from '../unlocks';
import { getModifiers } from '../ascension';
import { makeRng, pick, shuffle } from '../rng';
import {
  EASY_ENCOUNTERS, NORMAL_ENCOUNTERS, ELITE_ENCOUNTERS, BOSS_ENCOUNTERS,
  CH2_NORMAL_ENCOUNTERS, CH2_ELITE_ENCOUNTERS, CH2_BOSS_ENCOUNTERS,
  CH3_NORMAL_ENCOUNTERS, CH3_ELITE_ENCOUNTERS, CH3_BOSS_ENCOUNTERS,
  CH4_NORMAL_ENCOUNTERS, CH4_ELITE_ENCOUNTERS, CH4_BOSS_ENCOUNTERS,
  pickEncounter,
} from '../content/enemies';
import { applyStatus } from '../combat/statuses';
import type { CardDef, CombatState, Enemy, MapNode, RelicDef, RunState } from '../types';

// ── 카드 풀 ──

export interface CardPools {
  common: CardDef[];
  uncommon: CardDef[];
  rare: CardDef[];
}

const CLASS_POOLS: Record<string, CardDef[][]> = {
  gunner:     [GUNNER_COMMON_CARDS,     GUNNER_UNCOMMON_CARDS,     GUNNER_RARE_CARDS],
  fighter:    [FIGHTER_COMMON_CARDS,    FIGHTER_UNCOMMON_CARDS,    FIGHTER_RARE_CARDS],
  magician:   [MAGICIAN_COMMON_CARDS,   MAGICIAN_UNCOMMON_CARDS,   MAGICIAN_RARE_CARDS],
  priest:     [PRIEST_COMMON_CARDS,     PRIEST_UNCOMMON_CARDS,     PRIEST_RARE_CARDS],
  thief:      [THIEF_COMMON_CARDS,      THIEF_UNCOMMON_CARDS,      THIEF_RARE_CARDS],
  summoner:   [SUMMONER_COMMON_CARDS,   SUMMONER_UNCOMMON_CARDS,   SUMMONER_RARE_CARDS],
  engineer:   [ENGINEER_COMMON_CARDS,   ENGINEER_UNCOMMON_CARDS,   ENGINEER_RARE_CARDS],
  gambler:    [GAMBLER_COMMON_CARDS,    GAMBLER_UNCOMMON_CARDS,    GAMBLER_RARE_CARDS],
  blood_mage: [BLOOD_MAGE_COMMON_CARDS, BLOOD_MAGE_UNCOMMON_CARDS, BLOOD_MAGE_RARE_CARDS],
};

function filterUnlocked(pool: CardDef[], ignoreLocks: boolean): CardDef[] {
  if (ignoreLocks) return pool;
  const out = pool.filter((c) => isCardUnlocked(c));
  return out.length > 0 ? out : pool;
}

/** 이 직업이 보상·상점에서 만날 카드 풀. 데일리는 잠금을 무시한다. */
export function cardPools(run: RunState): CardPools {
  const [c, u, r] = CLASS_POOLS[run.characterClass] ?? [COMMON_CARDS, UNCOMMON_CARDS, RARE_CARDS];
  const ignoreLocks = !!run.dailyConfig;
  return {
    common: filterUnlocked(c, ignoreLocks),
    uncommon: filterUnlocked(u, ignoreLocks),
    rare: filterUnlocked(r, ignoreLocks),
  };
}

// ── 보상 ──

/** 보상 카드 3장. 엘리트는 희귀 쪽으로 기운다. */
export function rollRewardCards(rng: () => number, isElite: boolean, pools: CardPools): string[] {
  const choices: string[] = [];
  for (let i = 0; i < 3; i++) {
    const r = rng();
    let pool = pools.common;
    if (isElite) {
      if (r < 0.4) pool = pools.common;
      else if (r < 0.85) pool = pools.uncommon;
      else pool = pools.rare;
    } else {
      if (r < 0.6) pool = pools.common;
      else if (r < 0.95) pool = pools.uncommon;
      else pool = pools.rare;
    }
    const tries = shuffle(rng, pool.slice());
    let picked = tries[0]?.id;
    for (const c of tries) {
      if (!choices.includes(c.id)) { picked = c.id; break; }
    }
    if (picked) choices.push(picked);
  }
  return choices;
}

export interface RolledReward {
  cardChoices: string[];
  gold: number;
  relicId: string | null;
}

/** 보상 노드/전투 승리 보상. 같은 런·같은 층이면 항상 같은 값이 나온다. */
export function rollReward(run: RunState, isElite: boolean): RolledReward {
  const rng = makeRng(run.seed * 7 + (run.floor + 1) * 91);
  const cardChoices = rollRewardCards(rng, isElite, cardPools(run));
  const gold = isElite ? 25 + Math.floor(rng() * 10) : 10 + Math.floor(rng() * 10);
  return { cardChoices, gold, relicId: isElite ? rollEliteRelic(run, rng) : null };
}

/** 리롤한 보상 카드 (가격은 UI의 REROLL_COSTS가 본다). */
export function rerollRewardCards(run: RunState, isElite: boolean, rerollCount: number): string[] {
  const rng = makeRng(run.seed * 13 + run.floor * 47 + rerollCount * 311);
  return rollRewardCards(rng, isElite, cardPools(run));
}

function rollEliteRelic(run: RunState, rng: () => number): string | null {
  const classRelics = ELITE_RELICS.filter((r) => !r.forClass || r.forClass === run.characterClass);
  const unowned = classRelics.filter((r) => !run.player.relics.includes(r.id));
  if (unowned.length > 0) return pick(rng, unowned).id;

  const ignoreLocks = !!run.dailyConfig;
  const unlocked = ignoreLocks ? PICKABLE_RELICS : PICKABLE_RELICS.filter((r) => isRelicUnlocked(r));
  const pool = unlocked.length > 0 ? unlocked : PICKABLE_RELICS;
  const fallback = pool.filter((r) => !run.player.relics.includes(r.id));
  return fallback.length > 0 ? pick(rng, fallback).id : null;
}

// ── 모닥불 ──

/** 휴식으로 회복되는 HP. 등반 단계가 오르면 줄어든다. */
export function restHealAmount(run: RunState): number {
  return Math.floor(run.player.maxHp * getModifiers(run.ascension).restHealMult);
}

// ── 상점 ──

const BASE_CARD_PRICE: Record<string, number> = { common: 40, uncommon: 60, rare: 110 };
const BASE_RELIC_PRICE = 150;
const BASE_REMOVAL_PRICE = 75;
const BASE_POTION_PRICE = 55;

export interface ShopItem {
  kind: 'card' | 'relic' | 'removal' | 'potion';
  id?: string;
  price: number;
  sold: boolean;
}

/** 카드 3장(등급별 1장) + 유물 2개 + 포션 2개 + 카드 제거 서비스. */
export function buildShopItems(run: RunState): ShopItem[] {
  const rng = makeRng(run.seed * 13 + run.floor * 37 + 1);
  const mult = getModifiers(run.ascension).shopPriceMult;
  const price = (base: number) => Math.round(base * mult);
  const items: ShopItem[] = [];

  const pools = cardPools(run);
  const picked = new Set<string>();
  for (const pool of [pools.common, pools.uncommon, pools.rare]) {
    const card = shuffle(rng, pool.slice()).find((c) => !picked.has(c.id));
    if (card) {
      picked.add(card.id);
      items.push({ kind: 'card', id: card.id, price: price(BASE_CARD_PRICE[card.rarity] ?? 50), sold: false });
    }
  }

  const ignoreLocks = !!run.dailyConfig;
  const relicSource = ignoreLocks ? PICKABLE_RELICS : PICKABLE_RELICS.filter((r) => isRelicUnlocked(r));
  const relicPool = (relicSource.length > 0 ? relicSource : PICKABLE_RELICS)
    .filter((r) => !run.player.relics.includes(r.id));
  for (const relic of shuffle(rng, relicPool.slice()).slice(0, 2)) {
    items.push({ kind: 'relic', id: relic.id, price: price(BASE_RELIC_PRICE), sold: false });
  }

  for (const pot of shuffle(rng, POTION_LIST.slice()).slice(0, 2)) {
    items.push({ kind: 'potion', id: pot.id, price: price(BASE_POTION_PRICE), sold: false });
  }

  items.push({ kind: 'removal', price: price(BASE_REMOVAL_PRICE), sold: false });
  return items;
}

// ── 노드 진입 ──

/** 이 노드에서 만날 적. 같은 런·같은 좌표면 항상 같은 조합이 나온다. */
export function encounterFor(run: RunState, node: MapNode): string[] {
  const rng = makeRng(run.seed + node.y * 31 + node.x);
  const ch = run.chapter;
  let table =
    ch === 4 ? CH4_NORMAL_ENCOUNTERS :
    ch === 3 ? CH3_NORMAL_ENCOUNTERS :
    ch === 2 ? CH2_NORMAL_ENCOUNTERS :
    NORMAL_ENCOUNTERS;
  if (node.kind === 'elite')
    table = ch === 4 ? CH4_ELITE_ENCOUNTERS : ch === 3 ? CH3_ELITE_ENCOUNTERS : ch === 2 ? CH2_ELITE_ENCOUNTERS : ELITE_ENCOUNTERS;
  else if (node.kind === 'boss')
    table = ch === 4 ? CH4_BOSS_ENCOUNTERS : ch === 3 ? CH3_BOSS_ENCOUNTERS : ch === 2 ? CH2_BOSS_ENCOUNTERS : BOSS_ENCOUNTERS;
  else if (ch === 1 && node.y <= 3) table = EASY_ENCOUNTERS;
  return pickEncounter(rng, table);
}

/** 전투 시드 — 같은 노드를 다시 들어가도 같은 전투가 된다. */
export function combatSeedFor(run: RunState, node: MapNode): number {
  return run.seed + node.y * 17 + node.x * 7;
}

// ── 전투 승리 후 ──

/** 승리 시 유물이 주는 회복·골드, 그리고 포션 드랍. 도감 기록은 호출하는 쪽에서 한다. */
export function applyVictoryRewards(run: RunState, node: MapNode | null): void {
  const p = run.player;
  const heal = (n: number) => { p.hp = Math.min(p.maxHp, p.hp + n); };

  if (p.relics.includes('blood_vial')) heal(4);
  if (p.relics.includes('herb_pouch')) heal(5);
  if (p.relics.includes('meat_on_the_bone') && p.hp / p.maxHp <= 0.5) heal(12);
  if (p.relics.includes('rich_seal')) p.gold += 8;
  if (p.relics.includes('trophy_necklace')) { heal(8); p.gold += 12; }
  for (const syn of getActiveSynergies(p.relics)) {
    if (syn.timing === 'combat_end' && syn.id === 'undying') heal(10);
  }

  if (p.potions.length < 3) {
    const isElite = node?.kind === 'elite' || !!run.endless;
    const rng = makeRng(run.seed * 71 + (run.endless?.wave ?? run.floor) * 13);
    if (rng() < (isElite ? 0.5 : 0.3)) p.potions.push(pick(rng, POTION_LIST).id);
  }
}

// ── 챕터 클리어 ──

/** 챕터를 깨면 최대 HP의 25%를 회복한다. */
export function chapterClearHeal(run: RunState): number {
  return Math.ceil(run.player.maxHp * 0.25);
}

/** 보스 유물 후보 3개 — 아직 없는 것 중에서. */
export function bossRelicChoices(run: RunState, clearedChapter: number): RelicDef[] {
  const rng = makeRng(run.seed * 31 + clearedChapter * 77);
  return shuffle(rng, BOSS_RELICS.slice())
    .filter((r) => !run.player.relics.includes(r.id))
    .slice(0, 3);
}

/** 보스 유물 중 집는 순간 스탯을 바꾸는 것들. */
export function applyBossRelicOnPickup(run: RunState, id: string, addWound: () => void): void {
  const p = run.player;
  switch (id) {
    case 'energy_core':
      p.maxEnergy += 1;
      p.maxHp = Math.max(1, p.maxHp - 6);
      p.hp = Math.min(p.hp, p.maxHp);
      break;
    case 'warriors_heart':
      p.maxHp += 20;
      p.hp = Math.min(p.maxHp, p.hp + 20);
      break;
    case 'doom_ring':
      p.maxEnergy += 1;
      addWound();
      addWound();
      break;
  }
}

// ── 포션 ──

/**
 * 포션을 쓴다. 가방에서 빼고 효과를 적용한다 — 효과음·리렌더는 호출하는 쪽 몫.
 * 적 대상 포션은 target이 필요하다. 쓸 수 없으면 false.
 */
export function usePotion(
  state: CombatState, run: RunState, potionId: string, target: Enemy | null,
): boolean {
  const idx = run.player.potions.indexOf(potionId);
  if (idx < 0) return false;
  const def = POTION_DEFS[potionId];
  if (!def) return false;
  if (def.target === 'enemy' && !target) return false;
  run.player.potions.splice(idx, 1);

  switch (potionId) {
    case 'health_potion':
      run.player.hp = Math.min(run.player.maxHp, run.player.hp + 20);
      break;
    case 'strength_potion':
      applyStatus(state.player, 'strength', 5);
      break;
    case 'block_potion':
      state.player.block += 15;
      break;
    case 'energy_potion':
      state.player.energy = Math.min(state.player.energy + 2, state.player.maxEnergy + 2);
      break;
    case 'weak_potion':
      for (const e of state.enemies) if (e.hp > 0) applyStatus(e, 'weak', 3);
      break;
    case 'vulnerable_potion':
      for (const e of state.enemies) if (e.hp > 0) applyStatus(e, 'vulnerable', 3);
      break;
    case 'poison_potion':
      applyStatus(target!, 'poison', 8);
      break;
    case 'fire_potion': {
      const dmg = Math.max(0, 20 - target!.block);
      target!.block = Math.max(0, target!.block - 20);
      target!.hp = Math.max(0, target!.hp - dmg);
      break;
    }
    case 'burn_potion':
      applyStatus(target!, 'burn', 5);
      break;
    case 'freeze_potion':
      applyStatus(target!, 'freeze', 1);
      applyStatus(target!, 'weak', 2);
      break;
  }
  return true;
}
