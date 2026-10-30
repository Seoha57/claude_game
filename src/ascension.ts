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

// Per-level penalties (cumulative):
// A1  enemy HP +5%
// A2  +1 Wound in starting deck
// A3  enemy HP +5% more (total +10%)
// A4  shop prices +10%
// A5  starting HP -4
// A6  enemy start strength +1
// A7  rest heal 30% → 20% of maxHp
// A8  +1 more Wound (total 2)
// A9  enemy strength +1 more (total +2)
// A10 enemy HP +20% more (total +30%)
//
// 적 힘 +1은 단계 하나가 주는 부담이 가장 크다. 원래 A2에 있어서 초반이
// 급격히 꺾이고 A3~A5는 거의 평평했다 (시뮬 기준 레벨당 -0.28 → -0.02전투).
// 그래서 A6으로 옮기고 HP 증가를 앞으로 당겨 간격을 고르게 했다.
// A10의 최종 난이도(HP +30%, 힘 +2, 상처 2장)는 그대로다.
export function getModifiers(level: number): AscensionModifiers {
  const l = Math.max(0, Math.min(10, level));
  let enemyHpMult = 1;
  if (l >= 1) enemyHpMult += 0.05;
  if (l >= 3) enemyHpMult += 0.05;
  if (l >= 10) enemyHpMult += 0.20;

  const enemyStrBonus = (l >= 6 ? 1 : 0) + (l >= 9 ? 1 : 0);

  const cursesInDeck = (l >= 2 ? 1 : 0) + (l >= 8 ? 1 : 0);

  const shopPriceMult = l >= 4 ? 1.10 : 1;

  const startingHpPenalty = l >= 5 ? 4 : 0;

  const restHealMult = l >= 7 ? 0.20 : 0.30;

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
