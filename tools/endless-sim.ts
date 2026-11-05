// 무한 던전 생존 곡선 — 게임을 깬 덱으로 몇 웨이브까지 버티나.
//
//   npm run sim:endless          # 기본 100판
//   npm run sim:endless -- 300   # 판수 지정
//   npm run sim:endless -- 100 5 # 판수 + 등반 단계
//
// 무한 던전은 클리어한 런에서 이어지므로, 여기 쓰는 판수는 "돌린 런"이고
// 그중 이긴 런만 웨이브로 이어진다. 승률이 절반쯤이니 표본은 그 절반이다.
//
// 웨이브 규칙: 적 HP ×(1.3 + 0.07·웨이브), 3웨이브마다 힘 +1,
// 5의 배수는 엘리트, 10의 배수는 보스, 그 바로 다음은 휴식(최대 HP 30% 회복).
//
// 곡선을 고치며 재본 것 (80런×10직업 = 표본 386, 사망 웨이브 분포로 봤다):
//   - 원래 전체 사망의 46%가 웨이브 20 하나에 몰려 있었다. 도달한 런 기준 60%.
//   - 힘 보너스를 floor(w/3)→floor(w/5)로 늦춤: 60% → 57.5%. 거의 효과 없음.
//   - HP 배수를 0.12→0.08로 낮춤: 60% → 53%. 이것도 원인이 아니다.
//   - 보스 표에서 챕터 3 보스를 W20→W30으로 미룸: 60% → 32%. 이게 원인이었다.
//     게임을 깬 덱이 챕터 3 보스를 3.4배 HP로 만나는 구간이었다.
//
// 직업 격차를 재본 것 (2026-11-05, 150런):
//   벽을 없애니 편차가 8.1 → 12.5웨이브로 오히려 드러났다. 원인은 흡혈이다.
//   흡혈은 "입힌 데미지만큼" 회복하는데, 무한 던전의 힘 보상이 데미지를 올리니
//   혈술사에게는 그게 곧 회복 증가다. 다른 직업은 데미지만 오른다.
//   흡혈 회복을 카드 수치까지로 막으면 혈술사만 32.1 → 27.9로 내려가고 나머지
//   아홉 줄은 한 칸도 안 움직였다 (편차 8.3). 원인 확인.
//
//   다만 A0가 같이 깎인다 — 무한 던전은 이긴 덱에서 이어지므로 둘이 묶여 있다.
//     변경            A0 혈술사   무한 혈술사   무한 편차
//     없음(기준)        51.8%        32.1       12.5
//     흡혈 전면 차단    ~37%         27.9        8.3
//     흡혈 절반만       46.0%        30.2       10.6
//     흡혈 절반+HP 78   51.2%        32.5       12.9   ← HP로 갚으면 도로 올라간다
//     힘 보상 제거      51.8%        30.6       11.5   ← A0 무관하지만 효과가 작다
//   최대 HP도 무한 던전에서는 불어난다 (휴식 회복이 최대 HP의 30%). A0를 HP로
//   갚는 수법이 여기서는 안 통한다.
//
//   효과가 없던 것: 휴식 회복 30%→50% (총잡이 20.1 → 20.2), 보상 AI가 회복을
//   더 일찍 집게 하기 (20.1 → 20.5), 적 힘 성장 늦추기 (편차 12.5 → 15.1로 악화
//   — 쉬워지면 강한 직업이 더 멀리 간다).
//
//   같은 웨이브·만피로 세우면 격차가 작다 (W20 승률 69~93%). 두 가지가 섞여
//   있었다: 격투가는 만피면 84%를 이기는데 실제로는 HP 45%로 들어가 죽고
//   (소모전), 총잡이는 만피에서도 41%뿐이었다 (순수 화력).
//
//   총잡이는 2026-11-05에 고쳤다. 질 때 적 HP를 78.6% 깎는데 격투가(84% 승)도
//   79.9%였다 — 턴 수도 같은 7.1턴이라, 데미지가 아니라 같은 시간에 더 자주
//   죽는 게 문제였다. 탄창의 "3번째 공격마다 +5 데미지"가 평평해서 적 HP가
//   불어나면 값이 떨어진다. 힘 +1로 바꾸니 짧은 전투에서는 오히려 약간 약하고
//   긴 전투에서 쌓인다 (총잡이는 다단히트가 많아 힘을 잘 받는다):
//     W20 단판 41.4% → 58.1%,  무한 평균 19.6 → 20.4웨이브
//     A0 52.0% → 51.8% (제자리),  A10 5.5% → 7.2%,  두 편차 모두 그대로
//   A0를 안 건드리고 고단계만 올리려면 이렇게 "전투가 길수록 값이 커지는"
//   지렛대를 써야 한다. 평평한 수치를 올리면 A0가 같이 올라간다.
//
//   - 초반(W1~9)은 어떤 수를 써도 아무도 안 죽는다. 일반 적 구성을 한 단계
//     올려도, 휴식 회복을 30%→15%로 깎아도 분포가 그대로였다. 게임을 깬 덱이
//     일반 전투를 압도해서 그렇다 — 모드의 성격을 바꾸지 않으면 안 움직인다.

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
