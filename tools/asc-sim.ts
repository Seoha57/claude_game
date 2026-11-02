// 등반 단계별 난이도 곡선 — A0부터 최고 단계까지 전 직업을 돌린다.
//
//   npm run sim:asc           # 기본 200판 × 10직업 × 11단계
//   npm run sim:asc -- 400
//
// 보는 법: 단계 하나가 승률을 몇 %p 깎는지(Δ)가 고르면 사다리가 고른 것이다.
// 어떤 칸만 뚝 떨어지면 그 단계의 제약이 혼자 무겁다는 뜻이다.

import { pad, pct, CLASS_NAME } from './shim';

const { reportRuns } = await import('../src/sim/run-sim');
const { ALL_CLASSES } = await import('../src/sim/simulator');
const { getModifiers } = await import('../src/ascension');

const runs = Number(process.argv[2] ?? 200);

// 제약이 더 늘지 않는 지점까지만 잰다 (지금은 A10에서 멈춘다).
const MAX = (() => {
  const key = (l: number) => JSON.stringify(getModifiers(l));
  let top = 0;
  for (let l = 1; l <= 30; l++) if (key(l) !== key(l - 1)) top = l;
  return top;
})();

const levels = Array.from({ length: MAX + 1 }, (_, i) => i);

console.log(`\n등반 곡선 · 캐릭터당 단계별 ${runs}판 · A0~A${MAX}\n`);
console.log(`${pad('캐릭터', 12)}${levels.map((l) => `A${l}`.padStart(7)).join('')}`);
console.log('─'.repeat(12 + 7 * levels.length));

const table = ALL_CLASSES.map((cls) => ({
  cls,
  row: levels.map((l) => reportRuns(cls, runs, l).winRate),
}));

for (const { cls, row } of table) {
  console.log(pad(CLASS_NAME[cls] ?? cls, 12) + row.map((v) => pct(v).padStart(7)).join(''));
}

console.log('─'.repeat(12 + 7 * levels.length));
const avg = levels.map((_, i) => table.reduce((s, t) => s + t.row[i], 0) / table.length);
console.log(pad('평균', 12) + avg.map((v) => pct(v).padStart(7)).join(''));
console.log(pad('Δ', 12) + avg.map((v, i) => (i === 0 ? '' : `${((v - avg[i - 1]) * 100).toFixed(1)}`).padStart(7)).join(''));

console.log(`\n단계별 제약:`);
for (const l of levels.slice(1)) {
  const a = getModifiers(l - 1), b = getModifiers(l);
  const diff = (Object.keys(b) as (keyof typeof b)[])
    .filter((k) => a[k] !== b[k])
    .map((k) => `${k} ${a[k]} → ${b[k]}`);
  if (diff.length) console.log(`  A${l}  ${diff.join(', ')}`);
}
console.log();
