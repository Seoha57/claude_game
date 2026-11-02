import { describe, it, expect, beforeEach } from 'vitest';
import { startNewRun, getRun, makeCard } from '../state';
import { startCombat, beginPlayerTurn, endPlayerTurn } from './combat';
import { playCard } from './effects';
import { applyStatus, getStatus } from './statuses';
import { GOLEM_THORNS_CAP, ENEMY_DEFS } from '../content/enemies';
import type { CombatState } from '../types';

beforeEach(() => localStorage.clear());

/** 해당 캐릭터로 런을 시작하고 전투에 들어간다. (시작 유물은 캐릭터마다 고정) */
function fight(cls: Parameters<typeof startNewRun>[2], enemies = ['jaw_worm']): CombatState {
  startNewRun(1, 0, cls);
  return startCombat(getRun().player, enemies, 1);
}

describe('매 턴 회복 유물', () => {
  it('불타는 피(검사)는 턴마다 2 회복한다', () => {
    const s = fight('swordmaster');
    s.player.hp = s.player.maxHp - 10;
    const before = s.player.hp;
    beginPlayerTurn(s);
    expect(s.player.hp - before).toBe(2);
  });

  it('피의 성배(혈술사)는 1만 회복한다 — 흡혈과 중첩되지 않도록', () => {
    const s = fight('blood_mage');
    s.player.hp = s.player.maxHp - 10;
    const before = s.player.hp;
    beginPlayerTurn(s);
    expect(s.player.hp - before).toBe(1);
  });

  it.each(['gunner', 'thief'] as const)(
    '%s의 시그니처 유물도 턴마다 2 회복한다 — 지속력이 없어 최하위였다',
    (cls) => {
      const s = fight(cls);
      s.player.hp = s.player.maxHp - 10;
      const before = s.player.hp;
      beginPlayerTurn(s);
      expect(s.player.hp - before).toBe(2);
    },
  );

  it('최대 HP를 넘겨 회복하지 않는다', () => {
    const s = fight('swordmaster');
    s.player.hp = s.player.maxHp;
    beginPlayerTurn(s);
    expect(s.player.hp).toBe(s.player.maxHp);
  });
});

describe('혈술의 핵 (혈술사 시그니처)', () => {
  it('HP를 잃는 카드를 내면 방어도 +3과 드로우 1을 준다', () => {
    const s = fight('blood_mage');
    s.player.block = 0;
    const strike = s.player.hand.find((c) => c.defId === 'v_blood_strike')
      ?? s.player.draw.find((c) => c.defId === 'v_blood_strike')!;
    if (!s.player.hand.includes(strike)) s.player.hand.push(strike);
    const handBefore = s.player.hand.length;

    playCard(s, strike, s.enemies[0], () => {});

    expect(s.player.block).toBe(3);
    // 카드 한 장을 내고 한 장을 뽑으므로 손패 수는 그대로
    expect(s.player.hand.length).toBe(handBefore);
  });

  it('턴당 한 번만 발동한다', () => {
    const s = fight('blood_mage');
    s.player.block = 0;
    const strikes = [...s.player.hand, ...s.player.draw].filter((c) => c.defId === 'v_blood_strike').slice(0, 2);
    expect(strikes.length).toBe(2);
    for (const c of strikes) if (!s.player.hand.includes(c)) s.player.hand.push(c);

    playCard(s, strikes[0], s.enemies[0], () => {});
    playCard(s, strikes[1], s.enemies[0], () => {});

    expect(s.player.block).toBe(3);  // 두 번째는 방어도를 주지 않는다
  });
});

describe('구슬 주머니 (총잡이 시작 유물)', () => {
  it('매 턴 적에게 취약을 걸어 끊기지 않게 한다', () => {
    const s = fight('gunner');
    expect(getStatus(s.enemies[0].statuses, 'vulnerable')).toBeGreaterThan(0);
    endPlayerTurn(s);   // 턴이 끝나면 취약이 1 깎이지만 다음 턴에 다시 붙는다
    expect(getStatus(s.enemies[0].statuses, 'vulnerable')).toBeGreaterThan(0);
  });
});

describe('성배 (성직자 시작 유물)', () => {
  it('재생이 소모돼도 매 턴 3으로 되돌아온다', () => {
    const s = fight('priest');
    expect(getStatus(s.player.statuses, 'regen')).toBe(3);
    endPlayerTurn(s);
    expect(getStatus(s.player.statuses, 'regen')).toBe(3);
  });
});

describe('상태이상 감소', () => {
  it('재생은 턴마다 1씩 줄어든다', () => {
    const s = fight('swordmaster');   // 재생을 유지시키는 유물이 없는 캐릭터
    applyStatus(s.player, 'regen', 3);
    endPlayerTurn(s);
    expect(getStatus(s.player.statuses, 'regen')).toBe(2);
  });

  it('취약·약화는 턴이 끝나면 줄어든다', () => {
    const s = fight('swordmaster');
    applyStatus(s.player, 'weak', 2);
    applyStatus(s.enemies[0], 'vulnerable', 2);
    endPlayerTurn(s);
    expect(getStatus(s.player.statuses, 'weak')).toBe(1);
    expect(getStatus(s.enemies[0].statuses, 'vulnerable')).toBe(1);
  });

  it('힘은 줄어들지 않는다', () => {
    const s = fight('swordmaster');
    applyStatus(s.player, 'strength', 3);
    endPlayerTurn(s);
    expect(getStatus(s.player.statuses, 'strength')).toBe(3);
  });
});

describe('시작 유물', () => {
  it('모든 캐릭터가 기본 유물과 시그니처 유물을 들고 시작한다', () => {
    const classes = ['swordmaster', 'gunner', 'fighter', 'magician', 'priest',
      'thief', 'summoner', 'engineer', 'gambler', 'blood_mage'] as const;
    const seen = new Set<string>();
    for (const cls of classes) {
      startNewRun(1, 0, cls);
      const relics = getRun().player.relics;
      expect(relics.length, cls).toBe(2);
      expect(new Set(relics).size, `${cls} 유물이 중복`).toBe(2);
      relics.forEach((r) => seen.add(r));
    }
    // 캐릭터마다 다른 유물 조합을 가진다
    expect(seen.size).toBe(classes.length * 2);
  });
});

describe('마법사 시작 유물', () => {
  it('마탑의 결정은 턴마다 적을 때리고 HP를 돌려준다', () => {
    startNewRun(1, 0, 'magician');
    const run = getRun();
    run.player.hp = run.player.maxHp - 20;
    const s = startCombat(run.player, ['jaw_worm'], 1);
    const hp = s.player.hp;
    const ehp = s.enemies[0].hp;
    beginPlayerTurn(s);
    expect(ehp - s.enemies[0].hp, '적을 안 때렸다').toBe(3);
    expect(s.player.hp - hp, '회복이 안 됐다').toBe(2);
  });

  it('회복은 최대 HP를 넘지 않는다', () => {
    startNewRun(1, 0, 'magician');
    const run = getRun();
    const s = startCombat(run.player, ['jaw_worm'], 1);
    beginPlayerTurn(s);
    expect(s.player.hp).toBe(s.player.maxHp);
  });

  it('원소 공명은 방어 카드에 드로우와 방어도를 준다 (턴당 1회)', () => {
    startNewRun(1, 0, 'magician');
    const run = getRun();
    const s = startCombat(run.player, ['jaw_worm'], 1);
    const shield = s.player.hand.find((c) => c.defId === 'm_aura_shield')
      ?? (() => { const c = makeCard('m_aura_shield'); s.player.hand.push(c); return c; })();

    const hand = s.player.hand.length;
    const block = s.player.block;
    playCard(s, shield, null, () => {});
    // 마력 방벽 5 + 공명 3, 그리고 낸 카드 1장이 빠지고 1장을 뽑는다
    expect(s.player.block).toBe(block + 8);
    expect(s.player.hand.length).toBe(hand - 1 + 1);

    // 같은 턴에 한 번 더 내면 공명은 안 붙는다
    const second = s.player.hand.find((c) => c.defId === 'm_aura_shield');
    if (second) {
      const b2 = s.player.block;
      playCard(s, second, null, () => {});
      expect(s.player.block).toBe(b2 + 5);
    }
  });

  it('시작 덱에 광역 카드가 있다', () => {
    startNewRun(1, 0, 'magician');
    expect(getRun().player.deck.some((c) => c.defId === 'm_petal')).toBe(true);
  });
});

describe('흑요암 골렘 가시', () => {
  it('상한을 넘겨 쌓이지 않는다', () => {
    startNewRun(1, 0, 'swordmaster');
    const run = getRun();
    const s = startCombat(run.player, ['obsidian_golem'], 1);
    const golem = s.enemies[0];

    for (let turn = 0; turn < 20; turn++) {
      if (s.phase !== 'player') break;
      golem.hp = golem.maxHp;          // 반피 각성을 배제하고 쌓이는 것만 본다
      endPlayerTurn(s);
      expect(getStatus(golem.statuses, 'thorns'), `${turn}턴`).toBeLessThanOrEqual(GOLEM_THORNS_CAP);
    }
  });

  it('각성하면 상한 위로 한 번 더 붙는다', () => {
    startNewRun(1, 0, 'swordmaster');
    const run = getRun();
    const s = startCombat(run.player, ['obsidian_golem'], 1);
    const golem = s.enemies[0];
    applyStatus(golem, 'thorns', GOLEM_THORNS_CAP);
    ENEMY_DEFS.obsidian_golem.onHalfHp!(s, golem);
    expect(getStatus(golem.statuses, 'thorns')).toBeGreaterThan(GOLEM_THORNS_CAP);
  });

  it('가시가 상한에 닿으면 버프 대신 방어를 한다', () => {
    startNewRun(1, 0, 'swordmaster');
    const run = getRun();
    const s = startCombat(run.player, ['obsidian_golem'], 1);
    const golem = s.enemies[0];
    applyStatus(golem, 'thorns', GOLEM_THORNS_CAP);
    // turn 0은 원래 가시 버프 턴이다
    const intent = ENEMY_DEFS.obsidian_golem.decideIntent!(s, golem, 0);
    expect(intent.kind).toBe('block');
  });
});
