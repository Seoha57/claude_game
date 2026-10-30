// 캐릭터별 밸런스 리포트.
//
//   npm run sim            # 기본 200판
//   npm run sim -- 500     # 판수 지정
//   npm run sim -- 200 5   # 판수 + 등반 단계
//
// 주의: 보상·포션·유물 획득은 재현하지 않는다. 모두 시작 덱으로만 싸우므로
//       "시작 덱 + 시작 유물"의 균형을 보는 지표다. 실제 런의 승률이 아니다.
//       보스는 시작 덱으로 거의 못 잡으므로 승률 대신 "보스 HP를 몇 % 깎았나"로 본다.

// 게임 코드가 localStorage를 직접 만지므로, node에서 돌리려면 최소한의 대역이 필요하다.
// (전부 try/catch로 감싸여 있긴 하지만, 없으면 매 호출이 예외로 빠져 느려진다)
const mem = new Map<string, string>();
(globalThis as any).localStorage ??= {
  getItem: (k: string) => mem.get(k) ?? null,
  setItem: (k: string, v: string) => { mem.set(k, String(v)); },
  removeItem: (k: string) => { mem.delete(k); },
  clear: () => mem.clear(),
};
(globalThis as any).window ??= { addEventListener() {}, dispatchEvent() { return true; } };

const { reportClass, ALL_CLASSES } = await import('../src/sim/simulator');

const runs = Number(process.argv[2] ?? 200);
const ascension = Number(process.argv[3] ?? 0);

const pct = (v: number) => `${(v * 100).toFixed(1)}%`;
const CLASS_NAME: Record<string, string> = {
  swordmaster: '검사', gunner: '총잡이', fighter: '격투가', magician: '마법사', priest: '성직자',
  thief: '도적', summoner: '정령술사', engineer: '공학자', gambler: '갬블러', blood_mage: '혈술사',
};
const pad = (s: string, n: number) => {
  // 한글은 터미널에서 두 칸을 먹는다
  const width = [...s].reduce((w, ch) => w + (ch.charCodeAt(0) > 0x1100 ? 2 : 1), 0);
  return s + ' '.repeat(Math.max(0, n - width));
};

console.log(`\n시작 덱 기준 · 캐릭터당 ${runs}판 · 등반 A${ascension}\n`);
console.log(`${pad('캐릭터', 12)}  ${'쉬움'.padStart(6)}  ${'잔여HP'.padStart(6)}  ${'보통'.padStart(6)}  ${'엘리트'.padStart(6)}  ${'보스딜'.padStart(6)}  ${'돌파'.padStart(6)}`);
console.log('─'.repeat(66));

const rows = ALL_CLASSES.map((cls) => reportClass(cls, runs, ascension))
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
