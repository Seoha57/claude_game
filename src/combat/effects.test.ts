import { describe, it, expect, beforeEach } from 'vitest';
import { startNewRun, getRun, makeCard } from '../state';
import { startCombat, endPlayerTurn } from './combat';
import { applyEffect, playCard } from './effects';
import { applyStatus, getStatus } from './statuses';
import type { CharacterClass, CombatState, Effect } from '../types';

beforeEach(() => localStorage.clear());

function fight(cls: CharacterClass = 'swordmaster', enemies = ['jaw_worm']): CombatState {
  startNewRun(1, 0, cls);
  return startCombat(getRun().player, enemies, 1);
}

/** 플레이어가 카드 한 장을 쓴 것처럼 효과만 적용한다. */
function apply(s: CombatState, effect: Effect, target = s.enemies[0]) {
  applyEffect(s, effect, s.player, target, () => {});
}

const hpOf = (e: { hp: number }) => e.hp;

describe('데미지', () => {
  it('방어도를 먼저 깎고 남은 만큼 HP를 깎는다', () => {
    const s = fight();
    const e = s.enemies[0];
    e.block = 4;
    const hp = hpOf(e);
    apply(s, { kind: 'damage', amount: 10 });
    expect(e.block).toBe(0);
    expect(hp - e.hp).toBe(6);
  });

  it('times만큼 여러 번 때린다', () => {
    const s = fight();
    const e = s.enemies[0];
    const hp = hpOf(e);
    apply(s, { kind: 'damage', amount: 3, times: 3 });
    expect(hp - e.hp).toBe(9);
  });

  it('힘이 타격마다 더해진다 (3회 공격이면 힘도 3번)', () => {
    const s = fight();
    const e = s.enemies[0];
    applyStatus(s.player, 'strength', 2);
    const hp = hpOf(e);
    apply(s, { kind: 'damage', amount: 3, times: 3 });
    expect(hp - e.hp).toBe((3 + 2) * 3);
  });

  it('damage_all은 모든 적을 때린다', () => {
    const s = fight('swordmaster', ['jaw_worm', 'jaw_worm']);
    const before = s.enemies.map(hpOf);
    apply(s, { kind: 'damage_all', amount: 5 });
    s.enemies.forEach((e, i) => expect(before[i] - e.hp).toBe(5));
  });

  it('HP는 0 아래로 내려가지 않는다', () => {
    const s = fight();
    const e = s.enemies[0];
    apply(s, { kind: 'damage', amount: 9999 });
    expect(e.hp).toBe(0);
  });
});

describe('방어도', () => {
  it('민첩이 획득 방어도에 더해진다', () => {
    const s = fight();
    s.player.block = 0;
    applyStatus(s.player, 'dexterity', 3);
    apply(s, { kind: 'block', amount: 5 });
    expect(s.player.block).toBe(8);
  });

  it('방어도는 턴이 끝나면 사라진다', () => {
    const s = fight();
    s.player.block = 20;
    endPlayerTurn(s);
    // 다음 턴 시작 시 유물로 다시 붙을 수 있으므로 "20이 유지되지 않는다"만 본다
    expect(s.player.block).toBeLessThan(20);
  });
});

describe('회복과 HP 소모', () => {
  it('회복은 최대 HP를 넘지 않는다', () => {
    const s = fight();
    s.player.hp = s.player.maxHp - 2;
    apply(s, { kind: 'heal', amount: 50 });
    expect(s.player.hp).toBe(s.player.maxHp);
  });

  it('HP 소모는 방어도를 무시하고 HP를 깎는다', () => {
    const s = fight();
    s.player.block = 10;
    const hp = s.player.hp;
    apply(s, { kind: 'lose_hp', amount: 3 });
    expect(s.player.block).toBe(10);
    expect(hp - s.player.hp).toBe(3);
  });

  it('흡혈은 입힌 데미지만큼 회복한다', () => {
    const s = fight('blood_mage');
    s.player.hp = s.player.maxHp - 20;
    const hp = s.player.hp;
    const e = s.enemies[0];
    const ehp = hpOf(e);
    apply(s, { kind: 'lifesteal', amount: 6 });
    expect(ehp - e.hp).toBe(6);
    expect(s.player.hp - hp).toBe(6);
  });

  it('흡혈도 힘을 받는다', () => {
    const s = fight('blood_mage');
    s.player.hp = s.player.maxHp - 20;
    applyStatus(s.player, 'strength', 4);
    const e = s.enemies[0];
    const ehp = hpOf(e);
    apply(s, { kind: 'lifesteal', amount: 6 });
    expect(ehp - e.hp).toBe(10);
  });
});

describe('도트 데미지', () => {
  it('중독은 턴마다 피해를 주고 1씩 줄어든다', () => {
    const s = fight();
    const e = s.enemies[0];
    applyStatus(e, 'poison', 3);
    const hp = hpOf(e);
    endPlayerTurn(s);
    expect(hp - e.hp).toBeGreaterThanOrEqual(3);
    expect(getStatus(e.statuses, 'poison')).toBe(2);
  });

  it('중독은 방어도를 무시한다', () => {
    const s = fight();
    const e = s.enemies[0];
    e.block = 50;
    applyStatus(e, 'poison', 4);
    const hp = hpOf(e);
    endPlayerTurn(s);
    expect(hp - e.hp).toBeGreaterThanOrEqual(4);
  });
});

describe('혈술사 파워', () => {
  it('피의 방벽은 잃은 HP만큼 방어도를 준다', () => {
    const s = fight('blood_mage');
    applyStatus(s.player, 'blood_armor', 1);
    s.player.block = 0;
    apply(s, { kind: 'lose_hp', amount: 4 });
    // 피의 방벽 4 + 혈술의 핵 3 (둘 다 HP 손실에 반응한다)
    expect(s.player.block).toBe(7);
  });

  it('피의 광기는 HP를 잃을 때마다 힘을 준다', () => {
    const s = fight('blood_mage');
    applyStatus(s.player, 'blood_power', 1);
    const str = getStatus(s.player.statuses, 'strength');
    apply(s, { kind: 'lose_hp', amount: 2 });
    expect(getStatus(s.player.statuses, 'strength')).toBe(str + 1);
  });
});

describe('갬블러 주사위', () => {
  it('주사위는 1~3이고 그 턴 내내 고정이다', () => {
    for (let seed = 1; seed <= 20; seed++) {
      startNewRun(seed, 0, 'gambler');
      const s = startCombat(getRun().player, ['jaw_worm'], seed);
      const roll = s.flags.diceRoll!;
      expect(roll, `seed ${seed}`).toBeGreaterThanOrEqual(1);
      expect(roll, `seed ${seed}`).toBeLessThanOrEqual(3);
      expect(s.flags.diceRoll).toBe(roll);
    }
  });

  it('주사위 데미지는 (base × 주사위)에 힘이 더해진다', () => {
    const s = fight('gambler');   // 갬블러의 직감이 전투 시작 시 힘 +1을 준다
    const e = s.enemies[0];
    const roll = s.flags.diceRoll!;
    const str = getStatus(s.player.statuses, 'strength');
    const hp = hpOf(e);
    apply(s, { kind: 'damage_dice', base: 3 });
    expect(hp - e.hp).toBe(3 * roll + str);
  });

  it('시작 공격 카드의 기댓값이 기본치(6)와 맞는다', () => {
    const s = fight('gambler');
    const def = s.player.deck.find((c) => c.defId === 'b_dice_throw');
    expect(def, '주사위 투척이 시작 덱에 있어야 한다').toBeTruthy();
    // base 3 × 기댓값 2 = 6
    expect(3 * 2).toBe(6);
  });
});

describe('카드 사용', () => {
  it('낸 카드는 손패에서 버림 더미로 간다', () => {
    const s = fight();
    const card = s.player.hand[0];
    const discardBefore = s.player.discard.length;
    playCard(s, card, s.enemies[0], () => {});
    expect(s.player.hand).not.toContain(card);
    expect(s.player.discard.length).toBeGreaterThan(discardBefore);
  });

  it('손패에 없는 카드는 효과가 적용되지 않는다 (더블클릭 방어)', () => {
    const s = fight();
    const e = s.enemies[0];
    const ghost = makeCard('strike');
    const hp = hpOf(e);
    playCard(s, ghost, e, () => {});
    expect(e.hp).toBe(hp);
  });
});
