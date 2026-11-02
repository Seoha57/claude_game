import { describe, it, expect, beforeEach } from 'vitest';
import { startNewRun, getRun } from '../state';
import { startCombat } from '../combat/combat';
import { getStatus } from '../combat/statuses';
import {
  cardPools, rollReward, rerollRewardCards, restHealAmount, buildShopItems,
  encounterFor, combatSeedFor, applyVictoryRewards, chapterClearHeal,
  bossRelicChoices, applyBossRelicOnPickup, usePotion,
} from './rules';
import { nodeById } from '../map/map';
import { CARD_DEFS } from '../content/cards';
import type { MapNode } from '../types';

beforeEach(() => localStorage.clear());

const node = (kind: MapNode['kind'], y = 5, x = 0): MapNode =>
  ({ id: `n_${y}_${x}`, kind, x, y, next: [], visited: false });

describe('카드 풀', () => {
  it('직업마다 다른 풀을 쓴다', () => {
    startNewRun(1, 0, 'blood_mage');
    const blood = cardPools(getRun()).common.map((c) => c.id);
    startNewRun(1, 0, 'gunner');
    const gunner = cardPools(getRun()).common.map((c) => c.id);
    expect(blood).not.toEqual(gunner);
    expect(blood.some((id) => gunner.includes(id)), '직업 풀이 섞이면 안 된다').toBe(false);
  });

  it('등급별로 비어 있지 않다', () => {
    startNewRun(1, 0, 'swordmaster');
    const p = cardPools(getRun());
    for (const [name, pool] of Object.entries(p)) expect(pool.length, name).toBeGreaterThan(0);
  });
});

describe('보상', () => {
  it('카드 3장을 주고 서로 겹치지 않는다', () => {
    startNewRun(1, 0, 'swordmaster');
    const r = rollReward(getRun(), false);
    expect(r.cardChoices).toHaveLength(3);
    expect(new Set(r.cardChoices).size).toBe(3);
    for (const id of r.cardChoices) expect(CARD_DEFS[id], id).toBeTruthy();
  });

  it('같은 런·같은 층이면 늘 같은 보상이다', () => {
    startNewRun(42, 0, 'swordmaster');
    getRun().floor = 4;
    const a = rollReward(getRun(), false);
    const b = rollReward(getRun(), false);
    expect(a).toEqual(b);
  });

  it('층이 다르면 보상도 다르다', () => {
    startNewRun(42, 0, 'swordmaster');
    const run = getRun();
    run.floor = 2;
    const a = rollReward(run, false);
    run.floor = 7;
    const b = rollReward(run, false);
    expect(a).not.toEqual(b);
  });

  it('엘리트는 골드를 더 주고 유물을 준다', () => {
    startNewRun(1, 0, 'swordmaster');
    const normal = rollReward(getRun(), false);
    const elite = rollReward(getRun(), true);
    expect(normal.relicId).toBeNull();
    expect(elite.relicId).toBeTruthy();
    expect(elite.gold).toBeGreaterThanOrEqual(25);
    expect(normal.gold).toBeLessThan(25);
  });

  it('엘리트 유물은 이미 가진 것을 주지 않는다', () => {
    startNewRun(1, 0, 'swordmaster');
    const run = getRun();
    const first = rollReward(run, true).relicId!;
    run.player.relics.push(first);
    expect(rollReward(run, true).relicId).not.toBe(first);
  });

  it('리롤하면 다른 카드가 나온다', () => {
    startNewRun(1, 0, 'swordmaster');
    const run = getRun();
    const first = rollReward(run, false).cardChoices;
    expect(rerollRewardCards(run, false, 1)).not.toEqual(first);
  });
});

describe('모닥불', () => {
  it('최대 HP의 30%를 회복한다 (A0)', () => {
    startNewRun(1, 0, 'swordmaster');
    const run = getRun();
    expect(restHealAmount(run)).toBe(Math.floor(run.player.maxHp * 0.30));
  });

  it('등반 단계가 오르면 회복량이 줄어든다', () => {
    startNewRun(1, 0, 'swordmaster');
    const low = restHealAmount(getRun());
    startNewRun(1, 10, 'swordmaster');
    expect(restHealAmount(getRun())).toBeLessThan(low);
  });
});

describe('상점', () => {
  it('카드 3장 + 유물 2개 + 포션 2개 + 제거 서비스를 낸다', () => {
    startNewRun(1, 0, 'swordmaster');
    const items = buildShopItems(getRun());
    const count = (k: string) => items.filter((i) => i.kind === k).length;
    expect(count('card')).toBe(3);
    expect(count('relic')).toBe(2);
    expect(count('potion')).toBe(2);
    expect(count('removal')).toBe(1);
  });

  it('진열 카드는 서로 다르고 등급별 가격이 붙는다', () => {
    startNewRun(1, 0, 'swordmaster');
    const cards = buildShopItems(getRun()).filter((i) => i.kind === 'card');
    expect(new Set(cards.map((c) => c.id)).size).toBe(3);
    for (const c of cards) expect(c.price).toBeGreaterThan(0);
  });

  it('이미 가진 유물은 진열되지 않는다', () => {
    startNewRun(1, 0, 'swordmaster');
    const run = getRun();
    const relic = buildShopItems(run).find((i) => i.kind === 'relic')!.id!;
    run.player.relics.push(relic);
    expect(buildShopItems(run).some((i) => i.id === relic)).toBe(false);
  });

  it('등반 단계가 오르면 가격이 오른다', () => {
    startNewRun(1, 0, 'swordmaster');
    const cheap = buildShopItems(getRun()).find((i) => i.kind === 'removal')!.price;
    startNewRun(1, 10, 'swordmaster');
    expect(buildShopItems(getRun()).find((i) => i.kind === 'removal')!.price).toBeGreaterThan(cheap);
  });
});

describe('노드 진입', () => {
  it('챕터 1 아래층은 쉬운 적, 보스 노드는 보스가 나온다', () => {
    startNewRun(1, 0, 'swordmaster');
    const run = getRun();
    const easy = encounterFor(run, node('combat', 2));
    const boss = encounterFor(run, node('boss', 12));
    expect(easy.length).toBeGreaterThan(0);
    expect(boss).toHaveLength(1);
    expect(['hexaghost', 'mad_butcher', 'obsidian_golem']).toContain(boss[0]);
  });

  it('같은 노드는 늘 같은 적 조합이다', () => {
    startNewRun(7, 0, 'swordmaster');
    const n = node('elite', 6, 2);
    expect(encounterFor(getRun(), n)).toEqual(encounterFor(getRun(), n));
    expect(combatSeedFor(getRun(), n)).toBe(combatSeedFor(getRun(), n));
  });

  it('챕터가 오르면 다른 적이 나온다', () => {
    startNewRun(7, 0, 'swordmaster');
    const run = getRun();
    const n = node('combat', 6);
    const ch1 = encounterFor(run, n);
    run.chapter = 3;
    expect(encounterFor(run, n)).not.toEqual(ch1);
  });
});

describe('전투 승리 보상', () => {
  it('유물이 회복·골드를 준다', () => {
    startNewRun(1, 0, 'swordmaster');
    const run = getRun();
    run.player.relics.push('blood_vial', 'rich_seal');
    run.player.hp = run.player.maxHp - 20;
    const gold = run.player.gold;
    applyVictoryRewards(run, node('combat'));
    expect(run.player.hp).toBe(run.player.maxHp - 16);
    expect(run.player.gold).toBe(gold + 8);
  });

  it('회복은 최대 HP를 넘지 않는다', () => {
    startNewRun(1, 0, 'swordmaster');
    const run = getRun();
    run.player.relics.push('herb_pouch');
    applyVictoryRewards(run, node('combat'));
    expect(run.player.hp).toBe(run.player.maxHp);
  });

  it('포션은 3개를 넘게 쌓이지 않는다', () => {
    startNewRun(1, 0, 'swordmaster');
    const run = getRun();
    run.player.potions = ['health_potion', 'health_potion', 'health_potion'];
    applyVictoryRewards(run, node('elite'));
    expect(run.player.potions).toHaveLength(3);
  });
});

describe('챕터 클리어', () => {
  it('최대 HP의 25%를 회복한다', () => {
    startNewRun(1, 0, 'swordmaster');
    expect(chapterClearHeal(getRun())).toBe(Math.ceil(getRun().player.maxHp * 0.25));
  });

  it('보스 유물 후보 3개는 아직 없는 것만 준다', () => {
    startNewRun(1, 0, 'swordmaster');
    const run = getRun();
    const choices = bossRelicChoices(run, 1);
    expect(choices).toHaveLength(3);
    run.player.relics.push(choices[0].id);
    expect(bossRelicChoices(run, 1).some((r) => r.id === choices[0].id)).toBe(false);
  });

  it('전사의 심장은 최대 HP를 올린다', () => {
    startNewRun(1, 0, 'swordmaster');
    const run = getRun();
    const max = run.player.maxHp;
    applyBossRelicOnPickup(run, 'warriors_heart', () => {});
    expect(run.player.maxHp).toBe(max + 20);
  });

  it('파멸의 반지는 에너지를 주고 상처 2장을 넣는다', () => {
    startNewRun(1, 0, 'swordmaster');
    const run = getRun();
    const energy = run.player.maxEnergy;
    let wounds = 0;
    applyBossRelicOnPickup(run, 'doom_ring', () => { wounds++; });
    expect(run.player.maxEnergy).toBe(energy + 1);
    expect(wounds).toBe(2);
  });
});

describe('포션', () => {
  it('쓰면 가방에서 빠진다', () => {
    startNewRun(1, 0, 'swordmaster');
    const run = getRun();
    run.player.potions = ['block_potion'];
    const s = startCombat(run.player, ['jaw_worm'], 1);
    const block = s.player.block;
    expect(usePotion(s, run, 'block_potion', null)).toBe(true);
    expect(s.player.block).toBe(block + 15);
    expect(run.player.potions).toHaveLength(0);
  });

  it('없는 포션은 쓸 수 없다', () => {
    startNewRun(1, 0, 'swordmaster');
    const run = getRun();
    run.player.potions = [];
    const s = startCombat(run.player, ['jaw_worm'], 1);
    expect(usePotion(s, run, 'health_potion', null)).toBe(false);
  });

  it('적 대상 포션은 타겟이 없으면 쓰이지 않는다', () => {
    startNewRun(1, 0, 'swordmaster');
    const run = getRun();
    run.player.potions = ['fire_potion'];
    const s = startCombat(run.player, ['jaw_worm'], 1);
    expect(usePotion(s, run, 'fire_potion', null)).toBe(false);
    expect(run.player.potions, '실패했으면 포션도 그대로여야 한다').toHaveLength(1);

    const e = s.enemies[0];
    const hp = e.hp;
    expect(usePotion(s, run, 'fire_potion', e)).toBe(true);
    expect(hp - e.hp).toBe(20);
  });

  it('독 물약은 중독을 쌓는다', () => {
    startNewRun(1, 0, 'swordmaster');
    const run = getRun();
    run.player.potions = ['poison_potion'];
    const s = startCombat(run.player, ['jaw_worm'], 1);
    usePotion(s, run, 'poison_potion', s.enemies[0]);
    expect(getStatus(s.enemies[0].statuses, 'poison')).toBe(8);
  });
});

describe('UI와 같은 규칙을 쓴다', () => {
  it('맵이 만든 전투 노드는 규칙이 정한 적과 짝이 맞는다', () => {
    startNewRun(99, 0, 'swordmaster');
    const run = getRun();
    const combatNode = run.map.find((n) => n.kind === 'combat' || n.kind === 'elite');
    expect(combatNode, '전투 노드가 하나도 없는 맵은 말이 안 된다').toBeTruthy();
    const ids = encounterFor(run, nodeById(run.map, combatNode!.id));
    expect(ids.length).toBeGreaterThan(0);
  });
});
