import { markDirty } from './sync/sync';

const STORAGE_KEY = 'dod_ascension';

export interface AscensionModifiers {
  enemyHpMult: number;      // multiplier on enemy max HP
  enemyStrBonus: number;    // flat strength added to each enemy at combat start
  cursesInDeck: number;     // Wound cards added to starting deck
  shopPriceMult: number;    // multiplier on all shop prices
  startingHpPenalty: number; // subtracted from starting HP (not below 1)
  restHealMult: number;     // multiplier on rest heal amount (base 0.30)
}

// 단계별 제약 (누적):
// A1  적 HP +5%
// A2  시작 덱에 상처 1장 + 상점가 +10%
// A3  적 HP +5% (누적 +10%)
// A4  시작 HP -4
// A5  적 HP +5% (누적 +15%)
// A6  적 시작 힘 +1
// A7  적 HP +5% (누적 +20%)
// A8  상처 1장 더 (총 2장) + 휴식 회복 30% → 20%
// A9  적 힘 +1 더 (총 +2)
// A10 적 HP +10% (누적 +30%)
//
// 간격을 고르게 맞춘 배치다. 재보면 제약마다 무게가 다르다 (500판 기준
// 승률 변화): 적 HP +5%와 상처·상점가·휴식 같은 가벼운 것들이 각각 -4.5%p와
// -2%p, 적 힘 +1이 -5.5%p다. 예전에는 무거운 것만 연달아 오고(A1·A3) 가벼운
// 것만 연달아 와서(A4·A7·A8) 단계 간격이 -1.7%p에서 -8.9%p까지 널뛰었다.
// 지금은 무거운 것 하나와 가벼운 것들을 번갈아 놓는다.
//
// A10의 최종 난이도(HP +30%, 힘 +2, 상처 2장)는 건드리지 않았다 — 사다리
// 꼭대기는 그대로 두고 올라가는 길만 고르게 깔았다.
export function getModifiers(level: number): AscensionModifiers {
  const l = Math.max(0, Math.min(10, level));
  let enemyHpMult = 1;
  if (l >= 1) enemyHpMult += 0.05;
  if (l >= 3) enemyHpMult += 0.05;
  if (l >= 5) enemyHpMult += 0.05;
  if (l >= 7) enemyHpMult += 0.05;
  if (l >= 10) enemyHpMult += 0.10;

  const enemyStrBonus = (l >= 6 ? 1 : 0) + (l >= 9 ? 1 : 0);

  const cursesInDeck = (l >= 2 ? 1 : 0) + (l >= 8 ? 1 : 0);

  const shopPriceMult = l >= 2 ? 1.10 : 1;

  const startingHpPenalty = l >= 4 ? 4 : 0;

  const restHealMult = l >= 8 ? 0.20 : 0.30;

  return { enemyHpMult, enemyStrBonus, cursesInDeck, shopPriceMult, startingHpPenalty, restHealMult };
}

export function getUnlockedMax(): number {
  try {
    const v = localStorage.getItem(STORAGE_KEY);
    return v !== null ? Math.min(10, Math.max(0, parseInt(v, 10) || 0)) : 0;
  } catch {
    return 0;
  }
}

export function unlockNextAscension(): void {
  const cur = getUnlockedMax();
  if (cur < 10) {
    try {
      localStorage.setItem(STORAGE_KEY, String(cur + 1));
    } catch {
      // ignore storage errors
    }
    markDirty();
  }
}
