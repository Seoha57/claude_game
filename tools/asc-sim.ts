// 등반 단계별 난이도 곡선 — A0부터 최고 단계까지 전 직업을 돌린다.
//
//   npm run sim:asc           # 기본 200판 × 10직업 × 11단계
//   npm run sim:asc -- 400
//
// 보는 법: 단계 하나가 승률을 몇 %p 깎는지(Δ)가 고르면 사다리가 고른 것이다.
// 어떤 칸만 뚝 떨어지면 그 단계의 제약이 혼자 무겁다는 뜻이다.
//
// 고단계의 직업 격차(A10에서 혈술사 21.8% vs 검사 3.4%)는 사다리 문제가
// 아니다. 2026-11-02에 세 가지를 재봤고 전부 안 통했다:
//  - 제약 하나씩 떼어내기: 적 힘·적 HP를 빼면 두 직업이 비슷하게(+9~13%p)
//    올라간다. 특정 제약이 한쪽만 때리는 게 아니다.
//  - 전역 회복 감소(healMult)를 A10에 넣기: 격차는 18.4 → 15.4%p로 줄지만
//    약한 직업도 회복에 기대고 있어서 바닥이 같이 내려간다.
//  - 약한 직업에 스케일링 주기(검혼 5→4타, 일심 3→2장, 불타는 피 힘 +1):
//    A0이 A10보다 3배 더 오른다 (검사 A0 +7.6%p, A10 +2.2%p).
// A10에서는 모든 직업이 챕터 1~2에서 끝나서(ch1.2~1.8), 승패를 가르는 건
// 초반 소모전을 버티는 힘이다.
//
// 그 뒤로 두 가지가 통했다 (A10 편차 18.4 → 11.7%p):
//  - 얇은 시작 덱 네 직업 보강 + 시작 HP로 A0 상쇄.
//  - 복리로 불어나는 효과(매 턴 공짜 드로우) 제거 — A10만 4배로 깎인다.
// 반대로 바닥을 올리는 건 아직 안 통한다. 복리 버프는 A10을 상대적으로 더
// 올리지만(검사 검혼에 힘 +1: A10 +63%, A0 +15%), 절대값으로는 A0이 더
// 올라서 HP로 상쇄하면 둘 다 제자리가 된다 (검사 +힘 & HP 72→66:
// A10 4.8 → 6.3%, A0 49.8 → 54.0%).
// 지금 손잡이로는 A10 편차 ~12%p가 바닥으로 보인다.
//
// 2026-11-11에 그 바닥을 뚫었다. 두 가지가 있었다.
//
// (1) 측정이 오염돼 있었다. startNewRun의 도감 보상은 발견 수 93개를 넘으면
//     최대 에너지를 +1 준다. 도감은 런 중에 쌓이고 reportRuns가 지우지 않아서,
//     열 직업을 한 번에 돌리면 먼저 잰 직업은 3에너지, 나중에 잰 직업은
//     4에너지로 돌았다 — 혈술사 A0이 혼자 재면 50.3%, 아홉 직업 뒤에 재면
//     53.1%. 지금은 reportRuns가 도감을 빈 상태로 고정한다. 이 전까지의
//     "A0 편차 2.9%"도 이 오염을 탄 숫자였고, 고치고 재니 4.5%p다.
// (2) 직업 파워로는 A10만 움직일 수 없다. 2000~5000판으로 네 갈래를 쟀는데
//     손잡이마다 A10:A0 교환비가 똑같이 0.6이었다 (찌르기 코스트, 가드 방어도,
//     시작 HP, 피의 광기 상한). A0을 HP로 되돌리면 A10도 같이 돌아온다.
//     A10 제약의 모양을 바꾸는 것(적 힘을 HP로 환산)도 2000판에서 기준보다
//     나빴다. 그래서 단계에 비례하는 직업별 시작 HP 보정을 넣었다 (state.ts의
//     ascHpAdjMap) — A0을 전혀 건드리지 않는 유일한 손잡이다.
//     결과: A10 편차 10.5 → 2.9%p, 배율 2.8 → 1.3배, 평균 10.6 → 10.4%
//     (5000판). A5는 5.6%p.
// 직업 비교는 `npm run sim:level -- 2000 10`으로 잰다. 200판으로는 아무 말도
// 할 수 없다.

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
