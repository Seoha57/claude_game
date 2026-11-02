// 게임 코드가 브라우저 전역을 직접 만지므로, node에서 돌리려면 최소한의 대역이 필요하다.
// (전부 try/catch로 감싸여 있긴 하지만, 없으면 매 호출이 예외로 빠져 느려진다)
function memStore() {
  const mem = new Map<string, string>();
  return {
    getItem: (k: string) => mem.get(k) ?? null,
    setItem: (k: string, v: string) => { mem.set(k, String(v)); },
    removeItem: (k: string) => { mem.delete(k); },
    clear: () => mem.clear(),
  };
}

(globalThis as any).localStorage ??= memStore();
(globalThis as any).sessionStorage ??= memStore();
(globalThis as any).window ??= { addEventListener() {}, dispatchEvent() { return true; } };

/** 한글은 터미널에서 두 칸을 먹는다. */
export function pad(s: string, n: number): string {
  const width = [...s].reduce((w, ch) => w + (ch.charCodeAt(0) > 0x1100 ? 2 : 1), 0);
  return s + ' '.repeat(Math.max(0, n - width));
}

export const pct = (v: number) => `${(v * 100).toFixed(1)}%`;

export const CLASS_NAME: Record<string, string> = {
  swordmaster: '검사', gunner: '총잡이', fighter: '격투가', magician: '마법사', priest: '성직자',
  thief: '도적', summoner: '정령술사', engineer: '공학자', gambler: '갬블러', blood_mage: '혈술사',
};
