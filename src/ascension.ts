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
// A2  enemy start strength +1
// A3  +1 Wound in starting deck
// A4  shop prices +10%
// A5  starting HP -4
// A6  enemy HP +10% more (total +15%)
// A7  rest heal 30% → 20% of maxHp
// A8  +1 more Wound (total 2)
// A9  enemy strength +1 more (total +2)
// A10 enemy HP +15% more (total +30%)
export function getModifiers(level: number): AscensionModifiers {
  const l = Math.max(0, Math.min(10, level));
  let enemyHpMult = 1;
  if (l >= 1) enemyHpMult += 0.05;
  if (l >= 6) enemyHpMult += 0.10;
  if (l >= 10) enemyHpMult += 0.15;

  const enemyStrBonus = (l >= 2 ? 1 : 0) + (l >= 9 ? 1 : 0);

  const cursesInDeck = (l >= 3 ? 1 : 0) + (l >= 8 ? 1 : 0);

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
