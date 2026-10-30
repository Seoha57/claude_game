import { describe, it, expect, beforeEach } from 'vitest';
import { getModifiers } from './ascension';
import { getMastery } from './stats';
import { TITLES, getSelectedTitle, setSelectedTitle, getEarnedCount } from './titles';
import { recordEnemyKills, getEnemyKills, getCodexCounts, recordCards, recordRelic } from './codex';
import { startNewRun, getRun, makeCard, countCardCopies, canAddCard } from './state';

beforeEach(() => localStorage.clear());

describe('등반 보정치', () => {
  it('A0은 아무 페널티도 없다', () => {
    const m = getModifiers(0);
    expect(m).toEqual({
      enemyHpMult: 1, enemyStrBonus: 0, cursesInDeck: 0,
      shopPriceMult: 1, startingHpPenalty: 0, restHealMult: 0.30,
    });
  });

  it('A10에서 적 HP +30%, 힘 +2, 상처 2장이 된다', () => {
    const m = getModifiers(10);
    expect(m.enemyHpMult).toBeCloseTo(1.30);
    expect(m.enemyStrBonus).toBe(2);
    expect(m.cursesInDeck).toBe(2);
  });

  it('단계가 오를수록 적이 약해지는 구간이 없다', () => {
    for (let l = 1; l <= 10; l++) {
      const prev = getModifiers(l - 1);
      const cur = getModifiers(l);
      expect(cur.enemyHpMult, `A${l}`).toBeGreaterThanOrEqual(prev.enemyHpMult);
      expect(cur.enemyStrBonus, `A${l}`).toBeGreaterThanOrEqual(prev.enemyStrBonus);
      expect(cur.cursesInDeck, `A${l}`).toBeGreaterThanOrEqual(prev.cursesInDeck);
      expect(cur.startingHpPenalty, `A${l}`).toBeGreaterThanOrEqual(prev.startingHpPenalty);
      expect(cur.restHealMult, `A${l}`).toBeLessThanOrEqual(prev.restHealMult);
    }
  });

  it('적 힘은 A6부터 붙는다 (A2에 몰려 있던 것을 옮겼다)', () => {
    expect(getModifiers(5).enemyStrBonus).toBe(0);
    expect(getModifiers(6).enemyStrBonus).toBe(1);
    expect(getModifiers(9).enemyStrBonus).toBe(2);
  });

  it('범위를 벗어난 값도 0~10으로 고정된다', () => {
    expect(getModifiers(-5)).toEqual(getModifiers(0));
    expect(getModifiers(99)).toEqual(getModifiers(10));
  });
});

describe('숙련도', () => {
  const setStats = (wins: number, trueWins: number, bestAscension: number) => {
    const empty = { runs: 0, wins: 0, trueWins: 0, losses: 0, bestAscension: -1 };
    const per: Record<string, unknown> = {};
    for (const c of ['swordmaster', 'gunner', 'fighter', 'magician', 'priest',
      'thief', 'summoner', 'engineer', 'gambler', 'blood_mage']) per[c] = { ...empty };
    per.swordmaster = { runs: 20, wins, trueWins, losses: 0, bestAscension };
    localStorage.setItem('dod_stats', JSON.stringify({
      version: 1, totalRuns: 20, totalWins: wins, totalTrueWins: trueWins, totalLosses: 0, perCharacter: per,
    }));
  };

  it('전적이 없으면 미숙련(Lv.0)', () => {
    const m = getMastery('swordmaster');
    expect(m.level).toBe(0);
    expect(m.points).toBe(0);
    expect(m.nextAt).toBe(1);
  });

  it('점수 = 일반 엔딩 1 + 진엔딩 2 + 최고 등반 단계(+1)', () => {
    setStats(3, 2, 4);           // 3 + 4 + 5
    expect(getMastery('swordmaster').points).toBe(12);
  });

  it('레벨 경계에서 정확히 올라간다', () => {
    for (const [points, level] of [[0, 0], [1, 1], [2, 1], [3, 2], [5, 2], [6, 3], [10, 4], [15, 5], [99, 5]] as const) {
      setStats(points, 0, -1);
      expect(getMastery('swordmaster').level, `${points}점`).toBe(level);
    }
  });

  it('최대 레벨이면 다음 목표가 없다', () => {
    setStats(20, 0, -1);
    expect(getMastery('swordmaster').nextAt).toBeNull();
  });

  it('한 캐릭터의 전적이 다른 캐릭터에 새지 않는다', () => {
    setStats(10, 0, -1);
    expect(getMastery('swordmaster').level).toBeGreaterThan(0);
    expect(getMastery('gunner').level).toBe(0);
  });
});

describe('칭호', () => {
  it('아무것도 없으면 하나도 못 얻는다', () => {
    expect(getEarnedCount()).toBe(0);
    expect(getSelectedTitle()).toBeNull();
  });

  it('업적 수로 얻는 칭호가 임계값에서 열린다', () => {
    const ids = Array.from({ length: 8 }, (_, i) => `ach_${i}`);
    localStorage.setItem('dod_achievements', JSON.stringify({ version: 1, unlocked: ids }));
    const earned = TITLES.filter((t) => t.check()).map((t) => t.id);
    expect(earned).toContain('beginner');   // 3개
    expect(earned).toContain('veteran');    // 8개
    expect(earned).not.toContain('conqueror'); // 15개
  });

  it('못 얻은 칭호는 장착해도 무시된다', () => {
    setSelectedTitle('legend');
    expect(getSelectedTitle()).toBeNull();
  });

  it('얻은 칭호는 장착되고 유지된다', () => {
    localStorage.setItem('dod_achievements', JSON.stringify({ version: 1, unlocked: ['a', 'b', 'c'] }));
    setSelectedTitle('beginner');
    expect(getSelectedTitle()?.id).toBe('beginner');
    setSelectedTitle(null);
    expect(getSelectedTitle()).toBeNull();
  });

  it('id가 겹치지 않는다', () => {
    expect(new Set(TITLES.map((t) => t.id)).size).toBe(TITLES.length);
  });
});

describe('도감', () => {
  it('처치 횟수가 누적된다', () => {
    recordEnemyKills(['jaw_worm', 'cultist']);
    recordEnemyKills(['jaw_worm']);
    expect(getEnemyKills()).toEqual({ jaw_worm: 2, cultist: 1 });
    expect(getCodexCounts().enemies).toBe(2);
  });

  it('빈 배열은 아무 일도 하지 않는다', () => {
    recordEnemyKills([]);
    expect(getCodexCounts().enemies).toBe(0);
  });

  it('적 기록이 카드·유물 기록을 건드리지 않는다', () => {
    recordCards(['strike', 'defend']);
    recordRelic('burning_blood');
    recordEnemyKills(['jaw_worm']);
    const c = getCodexCounts();
    expect(c).toEqual({ cards: 2, relics: 1, enemies: 1 });
  });

  it('예전 저장본(enemies 없음)도 읽힌다', () => {
    localStorage.setItem('dod_codex', JSON.stringify({ version: 1, cards: ['strike'], relics: [] }));
    expect(getCodexCounts()).toEqual({ cards: 1, relics: 0, enemies: 0 });
    recordEnemyKills(['cultist']);
    expect(getCodexCounts().enemies).toBe(1);
  });
});

describe('덱 구성 규칙', () => {
  it('추가 카드는 3장까지만 넣을 수 있다', () => {
    startNewRun(1, 0, 'swordmaster');
    const deck = getRun().player.deck;
    expect(countCardCopies(deck, 'cleave')).toBe(0);

    for (let i = 0; i < 3; i++) {
      expect(canAddCard(deck, 'cleave'), `${i}장일 때`).toBe(true);
      deck.push(makeCard('cleave'));
    }
    expect(canAddCard(deck, 'cleave')).toBe(false);
    expect(canAddCard(deck, 'thunderclap'), '다른 카드는 영향받지 않는다').toBe(true);
  });

  it('시작 덱은 상한(3장)을 넘겨 들어간다 — 보상으로 더 못 넣을 뿐', () => {
    startNewRun(1, 0, 'swordmaster');
    const deck = getRun().player.deck;
    expect(countCardCopies(deck, 'strike')).toBe(5);
    expect(canAddCard(deck, 'strike')).toBe(false);
  });

  it('덱에 없는 카드는 0장으로 센다', () => {
    startNewRun(1, 0, 'swordmaster');
    expect(countCardCopies(getRun().player.deck, 'v_drain')).toBe(0);
  });

  it('등반 단계만큼 상처가 시작 덱에 섞인다', () => {
    for (const [asc, wounds] of [[0, 0], [2, 1], [7, 1], [8, 2], [10, 2]] as const) {
      startNewRun(1, asc, 'swordmaster');
      expect(countCardCopies(getRun().player.deck, 'wound'), `A${asc}`).toBe(wounds);
    }
  });
});
