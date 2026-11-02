// 캐릭터별 밸런스 리포트.
//
//   npm run sim            # 기본 200판
//   npm run sim -- 500     # 판수 지정
//   npm run sim -- 200 5   # 판수 + 등반 단계
//
// 주의: 보상·포션·유물 획득은 재현하지 않는다. 모두 시작 덱으로만 싸우므로
//       "시작 덱 + 시작 유물"의 균형을 보는 지표다. 실제 런의 승률이 아니다.
//       보스는 시작 덱으로 거의 못 잡으므로 승률 대신 "보스 HP를 몇 % 깎았나"로 본다.

import { pad, pct, CLASS_NAME } from './shim';

const { reportClass, ALL_CLASSES } = await import('../src/sim/simulator');

const runs = Number(process.argv[2] ?? 200);
const ascension = Number(process.argv[3] ?? 0);
const boost = Number(process.argv[4] ?? 0);  // 자기 직업 풀에서 덱에 추가할 카드 수


console.log(`\n${boost ? `획득 카드 ${boost}장 포함` : "시작 덱 기준"} · 캐릭터당 ${runs}판 · 등반 A${ascension}\n`);
console.log(`${pad('캐릭터', 12)}  ${'쉬움'.padStart(6)}  ${'잔여HP'.padStart(6)}  ${'보통'.padStart(6)}  ${'엘리트'.padStart(6)}  ${'보스딜'.padStart(6)}  ${'돌파'.padStart(6)}`);
console.log('─'.repeat(66));

const rows = ALL_CLASSES.map((cls) => reportClass(cls, runs, ascension, boost))
  .sort((a, b) => b.eliteWinRate - a.eliteWinRate);

for (const r of rows) {
  console.log(
    `${pad(CLASS_NAME[r.cls] ?? r.cls, 12)}  ${pct(r.easyWinRate).padStart(6)}  ${pct(r.easyHpLeftPct).padStart(6)}`
    + `  ${pct(r.normalWinRate).padStart(6)}  ${pct(r.eliteWinRate).padStart(6)}`
    + `  ${pct(r.bossDamagePct).padStart(6)}  ${(r.gauntletCleared.toFixed(1) + '/7').padStart(6)}`,
  );
}

console.log('─'.repeat(66));
const spread = (key: keyof (typeof rows)[0]) => {
  const vals = rows.map((r) => r[key] as number);
  return Math.max(...vals) - Math.min(...vals);
};
console.log(`편차 — 보통 ${pct(spread('normalWinRate'))} · 보스딜 ${pct(spread('bossDamagePct'))}`);
console.log('※ AI는 모든 캐릭터에 같은 기준(막아야 하면 방어, 아니면 공격)을 쓴다.');
console.log('   소환·스케일링처럼 턴을 쌓아야 하는 캐릭터는 실제보다 낮게 나온다.');
console.log('   (갬블러 주사위는 턴당 1회 고정 굴림이라 AI가 불리할 게 없다)');
const totalTimeouts = rows.reduce((s, r) => s + r.timeouts, 0);
if (totalTimeouts > 0) {
  console.log(`※ 타임아웃 ${totalTimeouts}건 — AI가 80턴 안에 못 끝낸 전투. 많으면 지표를 믿기 어렵다.`);
}
console.log();
