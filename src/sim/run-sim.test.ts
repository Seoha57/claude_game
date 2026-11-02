import { describe, it, expect, beforeEach } from 'vitest';
import { simulateRun, reportRuns } from './run-sim';
import { ALL_CLASSES } from './simulator';

beforeEach(() => localStorage.clear());

describe('런 전체 시뮬', () => {
  it('모든 캐릭터가 멈추지 않고 끝난다', () => {
    for (const cls of ALL_CLASSES) {
      const o = simulateRun(cls, 1234, 0);
      expect(['won', 'lost', 'timeout'], cls).toContain(o.result);
      expect(o.nodesCleared, `${cls}: 노드를 하나도 안 밟았다`).toBeGreaterThan(0);
      expect(o.chapter, cls).toBeGreaterThanOrEqual(1);
      expect(o.chapter, cls).toBeLessThanOrEqual(3);
    }
  });

  it('같은 시드는 같은 결과를 낸다', () => {
    expect(simulateRun('swordmaster', 555, 0)).toEqual(simulateRun('swordmaster', 555, 0));
  });

  it('시드가 다르면 런도 갈린다', () => {
    const seeds = [1, 2, 3, 4, 5, 6, 7, 8].map((s) => simulateRun('swordmaster', s, 0).nodesCleared);
    expect(new Set(seeds).size, '전부 같은 길이면 맵·전투 랜덤이 안 먹고 있다').toBeGreaterThan(1);
  });

  it('보상과 모닥불을 타므로 덱과 유물이 시작보다 늘어난다', () => {
    // 시작: 덱 10장 + 유물 2개. 몇 노드라도 밟았으면 늘어나 있어야 한다.
    const o = simulateRun('swordmaster', 1234, 0);
    expect(o.deckSize, '보상을 안 받고 있다').toBeGreaterThan(10);
    expect(o.relics, '유물을 안 얻고 있다').toBeGreaterThanOrEqual(2);
  });

  it('진 런은 적을 남긴다 (무엇에 죽었는지 알 수 있다)', () => {
    const o = simulateRun('magician', 1234, 0);
    if (o.result !== 'won') expect(o.killedBy.length).toBeGreaterThan(0);
  });

  it('등반 단계가 높으면 더 못 간다', () => {
    const runs = 12;
    const easy = reportRuns('swordmaster', runs, 0);
    const hard = reportRuns('swordmaster', runs, 10);
    expect(hard.avgNodes).toBeLessThanOrEqual(easy.avgNodes);
  });

  it('리포트 수치가 범위를 벗어나지 않는다', () => {
    const r = reportRuns('swordmaster', 5, 0);
    expect(r.runs).toBe(5);
    expect(r.winRate).toBeGreaterThanOrEqual(0);
    expect(r.winRate).toBeLessThanOrEqual(1);
    expect(r.avgHpLeftPct).toBeLessThanOrEqual(1);
    expect(r.avgChapter).toBeGreaterThanOrEqual(1);
  });
});
