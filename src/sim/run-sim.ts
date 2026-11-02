// 런 전체 시뮬레이터 — 맵을 실제로 걸어간다.
//
// simulator.ts는 전투만 본다 (시작 덱 고정, 중간 회복 없음). 그래서 승률이 전
// 캐릭터 0으로 깔려 "몇 전투까지 버텼나"로 간접 측정할 수밖에 없었다.
// 여기서는 run/rules.ts의 진짜 규칙으로 보상·모닥불·상점·유물·포션 드랍까지
// 태워서 챕터 3 보스까지 간다. 즉 이 파일이 내는 승률이 실제 플레이에 가깝다.
//
// 사람보다 못 두는 것: 선택지 하나하나의 판단(아래 정책 함수들). 모든 캐릭터에
// 같은 기준을 쓰므로 직업 간 비교와 변경 전후 비교에는 쓸 만하다.

import { startNewRun, getRun, makeCard, startNextChapter, canAddCard } from '../state';
import { CARD_DEFS, canUpgrade } from '../content/cards';
import { startNode, nextNodes } from '../map/map';
import {
  encounterFor, combatSeedFor, rollReward, restHealAmount,
  buildShopItems, applyVictoryRewards, chapterClearHeal, bossRelicChoices,
  applyBossRelicOnPickup, eventFor, canPickEventChoice, applyEventEffects,
  neowChoices, applyNeowBlessing,
} from '../run/rules';
import type { EventChoice, EventEffect } from '../content/events';
import { simulateCombat } from './simulator';
import type { CardInstance, CharacterClass, MapNode, RunState } from '../types';

const LAST_CHAPTER = 3;
const RARITY_RANK: Record<string, number> = { common: 1, uncommon: 2, rare: 3 };

export interface RunOutcome {
  result: 'won' | 'lost' | 'timeout';
  /** 쓰러진 챕터 (이겼으면 LAST_CHAPTER) */
  chapter: number;
  /** 밟은 노드 수 — 같은 패배라도 얼마나 갔는지 */
  nodesCleared: number;
  /** 마지막으로 싸운 적 */
  killedBy: string[];
  hpLeftPct: number;
  deckSize: number;
  relics: number;
  gold: number;
}

// ── 선택 정책 ──
// 사람만큼 잘 두지는 않지만 모든 캐릭터에 같은 기준을 쓰므로 비교에는 쓸 만하다.

/** 다음에 밟을 노드. HP가 아쉬우면 모닥불, 넉넉하면 엘리트(유물)를 노린다. */
function chooseNode(run: RunState, options: MapNode[]): MapNode {
  const hpPct = run.player.hp / run.player.maxHp;
  const weight = (n: MapNode): number => {
    switch (n.kind) {
      case 'rest':   return hpPct < 0.6 ? 100 : 20;
      case 'elite':  return hpPct > 0.75 ? 70 : 5;
      case 'shop':   return run.player.gold >= 150 ? 60 : 25;
      case 'reward': return 55;
      case 'combat': return 40;
      case 'event':  return 30;
      default:       return 10;
    }
  };
  return options.reduce((a, b) => (weight(a) >= weight(b) ? a : b));
}

/** 보상 카드 3장 중 하나. 등급이 높고 싼 쪽. */
function chooseCard(run: RunState, choices: string[]): string | null {
  const usable = choices
    .map((id) => CARD_DEFS[id])
    .filter((def) => def && canAddCard(run.player.deck, def.id));
  if (usable.length === 0) return null;
  return usable.reduce((a, b) => {
    const ra = RARITY_RANK[a.rarity] ?? 0;
    const rb = RARITY_RANK[b.rarity] ?? 0;
    if (ra !== rb) return ra > rb ? a : b;
    return a.cost <= b.cost ? a : b;
  }).id;
}

/** 강화할 카드 — 아직 안 올린 것 중 비싼 쪽(대개 더 세다). */
function chooseUpgrade(deck: CardInstance[]): CardInstance | null {
  const up = deck.filter((c) => canUpgrade(c));
  if (up.length === 0) return null;
  return up.reduce((a, b) => {
    const la = a.upgraded ?? 0;
    const lb = b.upgraded ?? 0;
    if (la !== lb) return la < lb ? a : b;
    return (CARD_DEFS[a.defId]?.cost ?? 0) >= (CARD_DEFS[b.defId]?.cost ?? 0) ? a : b;
  });
}

// ── 노드 처리 ──

function doRest(run: RunState): void {
  const heal = restHealAmount(run);
  // 반피 밑이면 회복, 아니면 강화 — 강화가 장기적으로 더 이득이다.
  if (run.player.hp / run.player.maxHp < 0.6) {
    run.player.hp = Math.min(run.player.maxHp, run.player.hp + heal);
    return;
  }
  const card = chooseUpgrade(run.player.deck);
  if (card) card.upgraded = (card.upgraded ?? 0) + 1;
  else run.player.hp = Math.min(run.player.maxHp, run.player.hp + heal);
}

function takeReward(run: RunState, isElite: boolean): void {
  const reward = rollReward(run, isElite);
  run.player.gold += reward.gold;
  const cardId = chooseCard(run, reward.cardChoices);
  if (cardId) run.player.deck.push(makeCard(cardId));
  if (reward.relicId && !run.player.relics.includes(reward.relicId)) {
    run.player.relics.push(reward.relicId);
  }
}

function doShop(run: RunState): void {
  // 유물 > 카드 > 저주 제거 순으로, 돈 되는 만큼 산다.
  const items = buildShopItems(run);
  const order = { relic: 0, card: 1, removal: 2, potion: 3 } as const;
  for (const item of items.slice().sort((a, b) => order[a.kind] - order[b.kind])) {
    if (run.player.gold < item.price) continue;
    if (item.kind === 'relic' && item.id) {
      if (run.player.relics.includes(item.id)) continue;
      run.player.gold -= item.price;
      run.player.relics.push(item.id);
    } else if (item.kind === 'card' && item.id) {
      if (!canAddCard(run.player.deck, item.id)) continue;
      run.player.gold -= item.price;
      run.player.deck.push(makeCard(item.id));
    } else if (item.kind === 'removal') {
      const idx = run.player.deck.findIndex((c) => c.defId === 'wound');
      if (idx < 0) continue;
      run.player.gold -= item.price;
      run.player.deck.splice(idx, 1);
    } else if (item.kind === 'potion' && item.id) {
      if (run.player.potions.length >= 3) continue;
      run.player.gold -= item.price;
      run.player.potions.push(item.id);
    }
  }
}

/** 챕터 클리어 — 25% 회복 + 보스 유물 1개. 런 전체에서 가장 큰 파워 스파이크다. */
function clearChapter(run: RunState, cleared: number): void {
  run.player.hp = Math.min(run.player.maxHp, run.player.hp + chapterClearHeal(run));
  const choices = bossRelicChoices(run, cleared);
  if (choices.length === 0) return;
  // 집는 순간 손해 보는 것(저주·최대HP 감소)은 피하고, 아니면 첫 번째
  const safe = choices.find((r) => r.id !== 'doom_ring' && r.id !== 'energy_core') ?? choices[0];
  run.player.relics.push(safe.id);
  applyBossRelicOnPickup(run, safe.id, () => run.player.deck.push(makeCard('wound')));
}

/** 한 런을 끝까지 돌린다. 챕터 3 보스를 잡으면 'won'. */
// ── 네오의 축복 ──

// 축복은 네 개 중 하나를 고른다. 사람은 덱을 보고 고르지만, 여기서는 고정 선호를
// 쓴다 — 모든 직업에 같은 기준이라 비교에는 영향이 없다.
// (에너지 +1이 압도적이고, 그 다음이 보스 유물이다.)
const NEOW_PREFERENCE = ['energy_blessing', 'dark_pact', 'relic_blessing',
  'health_blessing', 'upgrade_blessing', 'potion_blessing', 'wealth_blessing'];

function takeNeowBlessing(run: RunState): void {
  const choices = neowChoices(run);
  const best = choices.reduce((a, b) =>
    (NEOW_PREFERENCE.indexOf(a.id) <= NEOW_PREFERENCE.indexOf(b.id) ? a : b));
  applyNeowBlessing(run, best);
}

// ── 이벤트 ──

/**
 * 선택지 하나의 값어치. HP는 비율로 본다 — 62짜리 정령술사와 80짜리 격투가에게
 * "HP -8"의 무게가 다르다. 소지금은 쓸 데가 상점뿐이라 싸게 친다.
 */
function scoreEventEffect(run: RunState, e: EventEffect): number {
  const maxHp = run.player.maxHp;
  switch (e.kind) {
    case 'heal':             return Math.min(e.amount, maxHp - run.player.hp) * (100 / maxHp);
    case 'lose_hp':          return -e.amount * (100 / maxHp) * (run.player.hp <= e.amount + 10 ? 6 : 2);
    case 'max_hp':           return e.amount * (150 / maxHp);
    case 'gold':             return e.amount * 0.08;
    case 'lose_gold':        return run.player.gold < e.amount ? -100 : -e.amount * 0.08;
    case 'add_random_relic': return 25;
    case 'add_card':         return e.rarity === 'rare' ? 14 : e.rarity === 'uncommon' ? 9 : 5;
    case 'add_blessing':     return e.count * 8;
    case 'upgrade_random':   return e.count * 7;
    case 'add_potion':       return run.player.potions.length < 3 ? 4 : 0;
    case 'add_curse':        return -e.count * 12;
    default:                 return 0;
  }
}

function scoreEventChoice(run: RunState, choice: EventChoice): number {
  return choice.effects.reduce((sum, e) => sum + scoreEventEffect(run, e), 0);
}

/** 이벤트 노드 — 점수가 가장 높은 선택지를 고른다. 전부 손해면 그냥 지나간다. */
function doEvent(run: RunState): void {
  const ev = eventFor(run);
  const pickable = ev.choices.filter((c) => canPickEventChoice(run, c));
  if (pickable.length === 0) return;
  const best = pickable.reduce((a, b) => (scoreEventChoice(run, a) >= scoreEventChoice(run, b) ? a : b));
  if (scoreEventChoice(run, best) <= 0) return;
  applyEventEffects(run, best.effects);
}

export function simulateRun(cls: CharacterClass, seed: number, ascension = 0): RunOutcome {
  startNewRun(seed, ascension, cls);
  const run = getRun();
  takeNeowBlessing(run);
  let nodesCleared = 0;
  let killedBy: string[] = [];

  const outcome = (result: RunOutcome['result']): RunOutcome => ({
    result,
    chapter: run.chapter,
    nodesCleared,
    killedBy,
    hpLeftPct: Math.max(0, run.player.hp) / run.player.maxHp,
    deckSize: run.player.deck.length,
    relics: run.player.relics.length,
    gold: run.player.gold,
  });

  for (let chapter = 1; chapter <= LAST_CHAPTER; chapter++) {
    let node = startNode(run.map);
    run.currentNodeId = node.id;

    // 맵은 13층짜리라 넉넉히 잡아도 이 안에서 끝난다
    for (let step = 0; step < 40; step++) {
      const options = nextNodes(run.map, node);
      if (options.length === 0) break;

      node = chooseNode(run, options);
      node.visited = true;
      run.currentNodeId = node.id;
      run.floor = node.y;
      nodesCleared++;

      if (node.kind === 'combat' || node.kind === 'elite' || node.kind === 'boss') {
        const enemyIds = encounterFor(run, node);
        run.combatEnemyDefIds = enemyIds.slice();
        killedBy = enemyIds;
        const result = simulateCombat(run.player, enemyIds, combatSeedFor(run, node));
        if (result !== 'won') return outcome(result === 'lost' ? 'lost' : 'timeout');
        applyVictoryRewards(run, node);
        takeReward(run, node.kind === 'elite');
      } else if (node.kind === 'rest') {
        doRest(run);
      } else if (node.kind === 'reward') {
        takeReward(run, false);
      } else if (node.kind === 'shop') {
        doShop(run);
      } else if (node.kind === 'event') {
        doEvent(run);
      }

      if (node.kind === 'boss') break;
    }

    if (chapter < LAST_CHAPTER) {
      clearChapter(run, chapter);
      startNextChapter();
    }
  }

  return outcome('won');
}

export interface RunReport {
  cls: CharacterClass;
  runs: number;
  ascension: number;
  winRate: number;
  /** 진 런이 평균 몇 번째 챕터에서 끝났나 */
  avgChapter: number;
  avgNodes: number;
  /** 이긴 런 기준 — 끝났을 때 남은 HP 비율 */
  avgHpLeftPct: number;
  avgDeckSize: number;
  avgRelics: number;
  timeouts: number;
  /** 가장 자주 런을 끝낸 적 */
  topKiller: string;
}

export function reportRuns(cls: CharacterClass, runs: number, ascension = 0): RunReport {
  let wins = 0, timeouts = 0;
  let chapterSum = 0, nodeSum = 0, hpSum = 0, deckSum = 0, relicSum = 0;
  const killers = new Map<string, number>();

  for (let i = 0; i < runs; i++) {
    const o = simulateRun(cls, 1000 + i * 7919, ascension);
    if (o.result === 'won') { wins++; hpSum += o.hpLeftPct; }
    else {
      if (o.result === 'timeout') timeouts++;
      const key = o.killedBy.join('+') || '?';
      killers.set(key, (killers.get(key) ?? 0) + 1);
    }
    chapterSum += o.chapter;
    nodeSum += o.nodesCleared;
    deckSum += o.deckSize;
    relicSum += o.relics;
  }

  const top = [...killers.entries()].sort((a, b) => b[1] - a[1])[0];
  return {
    cls,
    runs,
    ascension,
    winRate: wins / runs,
    avgChapter: chapterSum / runs,
    avgNodes: nodeSum / runs,
    avgHpLeftPct: wins > 0 ? hpSum / wins : 0,
    avgDeckSize: deckSum / runs,
    avgRelics: relicSum / runs,
    timeouts,
    topKiller: top ? `${top[0]} (${top[1]})` : '-',
  };
}
