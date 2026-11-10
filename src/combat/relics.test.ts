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

  it('정령술사는 등불 2 + 정령 계약서 2로 턴마다 4 회복한다', () => {
    const s = fight('summoner');
    s.player.hp = s.player.maxHp - 10;
    const before = s.player.hp;
    beginPlayerTurn(s);
    expect(s.player.hp - before).toBe(4);
  });

  it('최대 HP를 넘겨 회복하지 않는다', () => {
    const s = fight('swordmaster');
    s.player.hp = s.player.maxHp;
    beginPlayerTurn(s);
    expect(s.player.hp).toBe(s.player.maxHp);
  });
});

describe('독니 (도적 시그니처)', () => {
  it('매 턴 첫 공격에만 중독 5를 얹는다', () => {
    const s = fight('thief');
    beginPlayerTurn(s);
    const enemy = s.enemies[0];
    const slicer = s.player.hand.find((c) => c.defId === 't_slicer')
      ?? (s.player.hand.push(makeCard('t_slicer')), s.player.hand[s.player.hand.length - 1]);
    playCard(s, slicer, enemy, () => {});
    expect(getStatus(enemy.statuses, 'poison')).toBe(5);

    const second = makeCard('t_slicer');
    s.player.hand.push(second);
    playCard(s, second, enemy, () => {});
    expect(getStatus(enemy.statuses, 'poison'), '같은 턴 두 번째 공격은 안 얹는다').toBe(5);
  });
});

describe('혈술의 핵 (혈술사 시그니처)', () => {
  it('HP를 잃는 카드를 내면 방어도 +3을 준다 (드로우는 고단계에서 너무 세서 뺐다)', () => {
    const s = fight('blood_mage');
    s.player.block = 0;
    const strike = s.player.hand.find((c) => c.defId === 'v_blood_strike')
      ?? s.player.draw.find((c) => c.defId === 'v_blood_strike')!;
    if (!s.player.hand.includes(strike)) s.player.hand.push(strike);
    const handBefore = s.player.hand.length;

    playCard(s, strike, s.enemies[0], () => {});

    expect(s.player.block).toBe(3);
    // 낸 카드만 손에서 빠진다 (뽑지 않는다)
    expect(s.player.hand.length).toBe(handBefore - 1);
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

describe('탄창 (총잡이 시그니처)', () => {
  // 원래 3번째 공격마다 +5 데미지였다. 평평해서 적 HP가 불어나는 무한 던전·고단계에서
  // 값이 떨어졌다 — 힘으로 바꾸면 짧은 전투에서는 약간 약하고 긴 전투에서 쌓인다.
  it('공격 카드 3장마다 힘이 1씩 쌓인다', () => {
    const s = fight('gunner');
    beginPlayerTurn(s);
    const shoot = () => {
      const card = makeCard('g_rising_shot');
      s.player.hand.push(card);
      s.player.energy = 9;
      playCard(s, card, s.enemies[0], () => { /* 로그 무시 */ });
    };

    shoot(); shoot();
    expect(getStatus(s.player.statuses, 'strength')).toBe(0);
    shoot();
    expect(getStatus(s.player.statuses, 'strength'), '3장째에 +1').toBe(1);
    shoot(); shoot(); shoot();
    expect(getStatus(s.player.statuses, 'strength'), '6장째에 +1 더').toBe(2);
  });
});

describe('새 유물 (2026-11-10)', () => {
  /** 시작 유물 외에 유물을 끼운 전투를 만든다. */
  function fightWith(extra: string[], enemies = ['jaw_worm']): CombatState {
    startNewRun(1, 0, 'swordmaster');
    const run = getRun();
    run.player.relics.push(...extra);
    return startCombat(run.player, enemies, 1);
  }

  it('보복의 갑주는 전투 시작 시 가시를 준다', () => {
    const s = fightWith(['thorn_mail']);
    expect(getStatus(s.player.statuses, 'thorns')).toBe(4);
  });

  it('못 박힌 방패는 방어도와 가시를 같이 준다', () => {
    const s = fightWith(['spiked_shield']);
    expect(s.player.block).toBe(6);
    expect(getStatus(s.player.statuses, 'thorns')).toBe(2);
  });

  it('불씨 돌은 모든 적에게 화상을 건다', () => {
    const s = fightWith(['ember_stone'], ['jaw_worm', 'jaw_worm']);
    for (const e of s.enemies) expect(getStatus(e.statuses, 'burn')).toBe(3);
  });

  it('광전사의 가면은 전투 시작 시 힘을 준다', () => {
    const s = fightWith(['berserk_mask']);
    expect(getStatus(s.player.statuses, 'strength')).toBe(3);
  });

  it('전투 시작 방어도 유물이 1턴째에 살아 있다 (지워지던 버그)', () => {
    for (const [relic, amount] of [['anchor', 10], ['dragon_scale', 20], ['sturdy_boots', 8], ['golden_chip', 12]] as const) {
      expect(fightWith([relic]).player.block, relic).toBe(amount);
    }
  });

  it('영원한 불꽃은 턴마다 2 회복한다', () => {
    const s = fightWith(['eternal_flame']);
    s.player.hp = s.player.maxHp - 10;
    const before = s.player.hp;
    beginPlayerTurn(s);
    expect(s.player.hp - before, '불타는 피 2 + 영원한 불꽃 2').toBe(4);
  });

  it('전투 나팔은 공격 5장마다 힘 +1', () => {
    const s = fightWith(['battle_horn']);
    beginPlayerTurn(s);
    const shoot = () => {
      const card = makeCard('strike');
      s.player.hand.push(card);
      s.player.energy = 9;
      playCard(s, card, s.enemies[0], () => { /* 로그 무시 */ });
    };
    for (let i = 0; i < 4; i++) shoot();
    expect(getStatus(s.player.statuses, 'strength')).toBe(0);
    shoot();
    expect(getStatus(s.player.statuses, 'strength')).toBe(1);
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

describe('램프형 시그니처 (2026-11-10)', () => {
  // 600런에서 "A0만 오른다"고 읽고 한 번 되돌렸던 변경이다. 1,200런으로 다시
  // 재보니 A10에서도 올랐다 (격투가 6.8 → 7.8%, 마법사 7.8 → 9.5%).
  it('투혼은 5턴째부터 매 턴 힘이 쌓인다', () => {
    startNewRun(1, 0, 'fighter');
    const s = startCombat(getRun().player, ['jaw_worm'], 1);
    expect(getStatus(s.player.statuses, 'strength'), '전투 시작 +1').toBe(1);
    for (let turn = 2; turn <= 4; turn++) beginPlayerTurn(s);
    expect(getStatus(s.player.statuses, 'strength'), '4턴까지는 그대로').toBe(1);
    beginPlayerTurn(s);
    expect(getStatus(s.player.statuses, 'strength'), '5턴째 +1').toBe(2);
    beginPlayerTurn(s);
    expect(getStatus(s.player.statuses, 'strength')).toBe(3);
  });

  it('마탑의 결정은 4턴째부터 데미지가 커진다', () => {
    startNewRun(1, 0, 'magician');
    const run = getRun();
    const s = startCombat(run.player, ['jaw_worm'], 1);
    const dmg = () => {
      const before = s.enemies[0].hp;
      beginPlayerTurn(s);
      return before - s.enemies[0].hp;
    };
    // startCombat이 1턴을 이미 돌렸으므로 여기서부터 2·3·4·5턴
    expect(dmg(), '2턴').toBe(4);
    expect(dmg(), '3턴').toBe(4);
    expect(dmg(), '4턴').toBe(5);
    expect(dmg(), '5턴').toBe(6);
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
    expect(ehp - s.enemies[0].hp, '적을 안 때렸다').toBe(4);
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
