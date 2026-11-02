// 런 전체 밸런스 리포트 — 맵을 실제로 걸어서 챕터 3 보스까지 간다.
//
//   npm run sim:run          # 기본 100판
//   npm run sim:run -- 300   # 판수 지정
//   npm run sim:run -- 100 5 # 판수 + 등반 단계
//
// 전투만 보는 `npm run sim`과 달리 보상·모닥불·상점·유물·포션 드랍까지 태운다.
// 여기 승률이 실제 플레이에 가장 가깝다. (이벤트 노드와 포션 사용은 빠져 있어
// 실제보다 약간 낮게 나온다 — 둘 다 플레이어에게 이득인 쪽이다.)

import { pad, pct, CLASS_NAME } from './shim';

const { reportRuns } = await import('../src/sim/run-sim');
const { ALL_CLASSES } = await import('../src/sim/simulator');

const runs = Number(process.argv[2] ?? 100);
const ascension = Number(process.argv[3] ?? 0);

console.log(`\n런 전체 · 캐릭터당 ${runs}판 · 등반 A${ascension}\n`);
console.log(`${pad('캐릭터', 12)}  ${'승률'.padStart(6)}  ${'도달'.padStart(6)}  ${'노드'.padStart(6)}  ${'잔여HP'.padStart(6)}  ${'덱'.padStart(5)}  ${'유물'.padStart(5)}`);
console.log('─'.repeat(64));

const rows = ALL_CLASSES.map((cls) => reportRuns(cls, runs, ascension))
  .sort((a, b) => b.winRate - a.winRate);

for (const r of rows) {
  console.log(
    `${pad(CLASS_NAME[r.cls] ?? r.cls, 12)}  ${pct(r.winRate).padStart(6)}`
    + `  ${('ch' + r.avgChapter.toFixed(1)).padStart(6)}  ${r.avgNodes.toFixed(1).padStart(6)}`
    + `  ${pct(r.avgHpLeftPct).padStart(6)}  ${r.avgDeckSize.toFixed(1).padStart(5)}  ${r.avgRelics.toFixed(1).padStart(5)}`,
  );
}

console.log('─'.repeat(64));
const wr = rows.map((r) => r.winRate);
console.log(`승률 편차 — ${pct(Math.max(...wr) - Math.min(...wr))} (최고 ${CLASS_NAME[rows[0].cls]} ${pct(wr[0])}, 최저 ${CLASS_NAME[rows[rows.length - 1].cls]} ${pct(wr[wr.length - 1])})`);

console.log('\n런을 끝낸 적 (캐릭터별 최다):');
for (const r of rows) console.log(`  ${pad(CLASS_NAME[r.cls] ?? r.cls, 12)} ${r.topKiller}`);

const totalTimeouts = rows.reduce((s, r) => s + r.timeouts, 0);
if (totalTimeouts > 0) {
  console.log(`\n※ 타임아웃 ${totalTimeouts}건 — AI가 80턴 안에 못 끝낸 전투.`);
}
console.log();
