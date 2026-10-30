import { describe, it, expect } from 'vitest';
import { simulateBossFight, simulateGauntlet, ALL_CLASSES } from './simulator';
import { startNewRun, getRun } from '../state';
import { startCombat } from '../combat/combat';
import { playCard, modifyAttackAmount } from '../combat/effects';
import { modifiedAttackDamage } from '../combat/statuses';
import { getEffectiveDef } from '../content/cards';
import { applyStatus } from '../combat/statuses';

describe('시뮬레이터', () => {
  it('모든 캐릭터가 보스전을 끝까지 돌린다 (무한 루프/크래시 없음)', () => {
    for (const cls of ALL_CLASSES) {
      const r = simulateBossFight(cls, 12345);
      expect(['won', 'lost']).toContain(r.result); // timeout이면 AI가 멈춘 것
      expect(r.hpLeft).toBeLessThanOrEqual(r.maxHp);
    }
  });

  it('갠틀릿도 끝까지 돌아간다', () => {
    const r = simulateGauntlet('swordmaster', 999);
    expect(['won', 'lost']).toContain(r.result);
  });

  it('같은 시드는 같은 결과를 낸다', () => {
    const a = simulateBossFight('priest', 4242);
    const b = simulateBossFight('priest', 4242);
    expect(b).toEqual(a);
  });
});

describe('데미지 계산', () => {
  it('힘이 흡혈 데미지에도 붙는다', () => {
    startNewRun(1, 0, 'blood_mage');
    const player = getRun().player;
    const state = startCombat(player, ['jaw_worm'], 1);
    applyStatus(state.player, 'strength', 5);
    const enemy = state.enemies[0];
    const before = enemy.hp;
    const drain = state.player.hand.find((c) => c.defId === 'v_drain')
      ?? { uid: 'x', defId: 'v_drain', upgraded: 0 } as any;
    state.player.hand.push(drain);
    playCard(state, drain, enemy, () => {});
    // 흡혈 5 + 힘 5 = 10
    expect(before - enemy.hp).toBe(10);
  });

  it('약화는 데미지를 0.75배로 깎는다', () => {
    startNewRun(2, 0, 'swordmaster');
    const player = getRun().player;
    const state = startCombat(player, ['jaw_worm'], 2);
    applyStatus(state.player, 'weak', 2);
    const dmg = modifiedAttackDamage(6, state.player, state.enemies[0]);
    expect(dmg).toBe(4); // floor(6 * 0.75)
  });

  it('취약은 데미지를 1.5배로 올린다', () => {
    startNewRun(3, 0, 'swordmaster');
    const player = getRun().player;
    const state = startCombat(player, ['jaw_worm'], 3);
    applyStatus(state.enemies[0], 'vulnerable', 2);
    const dmg = modifiedAttackDamage(6, state.player, state.enemies[0]);
    expect(dmg).toBe(9);
  });

  it('검혼은 5번째 공격마다 +6 (미리보기와 실제가 같은 함수를 쓴다)', () => {
    startNewRun(4, 0, 'swordmaster'); // 시그니처 유물 = 검혼
    const player = getRun().player;
    const state = startCombat(player, ['jaw_worm'], 4);
    expect(modifyAttackAmount(state, 6, 5)).toBe(12);  // 5번째
    expect(modifyAttackAmount(state, 6, 4)).toBe(6);   // 4번째는 보너스 없음
  });
});

describe('시작 덱', () => {
  it('모든 캐릭터가 10장으로 시작한다', () => {
    for (const cls of ALL_CLASSES) {
      startNewRun(7, 0, cls);
      expect(getRun().player.deck.length, cls).toBe(10);
    }
  });

  it('시작 유물 2개(기본 + 시그니처)를 들고 시작한다', () => {
    for (const cls of ALL_CLASSES) {
      startNewRun(8, 0, cls);
      const relics = getRun().player.relics;
      expect(relics.length, cls).toBe(2);
      expect(getEffectiveDef).toBeTypeOf('function');
    }
  });
});
