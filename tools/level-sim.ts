// 등반 단계 하나를 직업별로 잰다. asc-sim은 11단계를 전부 돌려서 판수를 올릴 수
// 없는데, 직업 비교는 판수가 모자라면 아무 말도 못 한다 (아래 주의 참고).
//
//   npm run sim:level -- 2000 10     # A10, 직업당 2000판
//   npm run sim:level -- 2000 0      # A0
//
// 주의 — 직업 비교는 2000판 아래로는 하지 말 것. 승률 10% 근처에서 600판의
// 표준오차가 1.2%p다. 2026-11-11에 600판으로 "A10 제약을 HP 쪽으로 몰면
// 편차가 3.1 → 2.5배로 준다"는 결과를 얻었는데, 2000판에서 다시 재니 기준보다
// 오히려 나빴다. 전부 잡음이었다.
import { pad, pct, CLASS_NAME } from './shim';

const { reportRuns } = await import('../src/sim/run-sim');
const { ALL_CLASSES } = await import('../src/sim/simulator');

const runs = Number(process.argv[2] ?? 2000);
const lvl = Number(process.argv[3] ?? 10);

const rows = ALL_CLASSES
  .map((cls) => ({ cls, r: reportRuns(cls, runs, lvl) }))
  .sort((a, b) => a.r.winRate - b.r.winRate);

console.log(`\nA${lvl} · 직업당 ${runs}판\n`);
console.log(pad('캐릭터', 12) + '승률'.padStart(8) + 'ch1통과'.padStart(10) + '  챕터  주요 사인');
console.log('─'.repeat(60));
for (const { cls, r } of rows) {
  console.log(pad(CLASS_NAME[cls] ?? cls, 12) + pct(r.winRate).padStart(8)
    + pct(r.clearedCh1).padStart(10) + `  ${r.avgChapter.toFixed(2)}  ${r.topKiller}`);
}
console.log('─'.repeat(60));
const ws = rows.map((r) => r.r.winRate);
console.log(`평균 ${pct(ws.reduce((a, b) => a + b, 0) / ws.length)}`
  + `  편차 ${((Math.max(...ws) - Math.min(...ws)) * 100).toFixed(1)}%p`
  + `  배율 ${(Math.max(...ws) / Math.min(...ws)).toFixed(1)}x\n`);
