// 무한 던전 생존 곡선 — 게임을 깬 덱으로 몇 웨이브까지 버티나.
//
//   npm run sim:endless          # 기본 100판
//   npm run sim:endless -- 300   # 판수 지정
//   npm run sim:endless -- 100 5 # 판수 + 등반 단계
//
// 무한 던전은 클리어한 런에서 이어지므로, 여기 쓰는 판수는 "돌린 런"이고
// 그중 이긴 런만 웨이브로 이어진다. 승률이 절반쯤이니 표본은 그 절반이다.
//
// 웨이브 규칙: 적 HP ×(1 + 0.12·웨이브), 3웨이브마다 힘 +1,
// 5의 배수는 엘리트, 10의 배수는 보스, 그 바로 다음은 휴식(최대 HP 30% 회복).

import { pad, pct, CLASS_NAME } from './shim';

const { reportEndless, ENDLESS_MILESTONES } = await import('../src/sim/run-sim');
const { ALL_CLASSES } = await import('../src/sim/simulator');

const runs = Number(process.argv[2] ?? 100);
const ascension = Number(process.argv[3] ?? 0);

console.log(`\n무한 던전 · 캐릭터당 ${runs}런 · 등반 A${ascension}\n`);
const head = ENDLESS_MILESTONES.map((m) => `W${m}`.padStart(6)).join('');
console.log(`${pad('캐릭터', 12)}  ${'표본'.padStart(5)}  ${'평균'.padStart(6)}  ${'중앙'.padStart(5)}  ${'최고'.padStart(5)}  ${'점수'.padStart(7)}  ${head}`);
const width = 54 + ENDLESS_MILESTONES.length * 6;
console.log('─'.repeat(width));

const rows = ALL_CLASSES.map((cls) => reportEndless(cls, runs, ascension))
  .sort((a, b) => b.avgWave - a.avgWave);

for (const r of rows) {
  console.log(
    `${pad(CLASS_NAME[r.cls] ?? r.cls, 12)}  ${String(r.wins).padStart(5)}`
    + `  ${r.avgWave.toFixed(1).padStart(6)}  ${String(r.medianWave).padStart(5)}  ${String(r.maxWave).padStart(5)}`
    + `  ${Math.round(r.avgScore).toLocaleString().padStart(7)}`
    + `  ${r.reach.map((v) => pct(v).padStart(6)).join('')}`,
  );
}

console.log('─'.repeat(width));
const measured = rows.filter((r) => r.wins > 0);
if (measured.length > 0) {
  const avg = measured.map((r) => r.avgWave);
  console.log(`평균 웨이브 편차 — ${(Math.max(...avg) - Math.min(...avg)).toFixed(1)}웨이브`
    + ` (최고 ${CLASS_NAME[measured[0].cls]} ${avg[0].toFixed(1)}, 최저 ${CLASS_NAME[measured[measured.length - 1].cls]} ${avg[avg.length - 1].toFixed(1)})`);
}
const thin = rows.filter((r) => r.wins < 20);
if (thin.length > 0) {
  console.log(`※ 표본 20런 미만 — ${thin.map((r) => CLASS_NAME[r.cls]).join(', ')}. 판수를 늘려야 읽을 만하다.`);
}
console.log();
