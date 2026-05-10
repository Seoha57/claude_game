import type { CharacterClass } from './types';

const STORAGE_KEY = 'dungeoncard_stats';
const STATS_VERSION = 1;

export interface CharStats {
  runs: number;
  wins: number;       // normal ending (chapter 3 clear)
  trueWins: number;   // true ending (chapter 4 clear)
  losses: number;
  bestAscension: number; // highest ascension cleared with this character
}

export interface AggregateStats {
  version: number;
  totalRuns: number;
  totalWins: number;
  totalTrueWins: number;
  totalLosses: number;
  perCharacter: Record<CharacterClass, CharStats>;
}

const EMPTY_CHAR: CharStats = {
  runs: 0,
  wins: 0,
  trueWins: 0,
  losses: 0,
  bestAscension: -1, // -1 means none yet
};

function emptyStats(): AggregateStats {
  return {
    version: STATS_VERSION,
    totalRuns: 0,
    totalWins: 0,
    totalTrueWins: 0,
    totalLosses: 0,
    perCharacter: {
      swordmaster: { ...EMPTY_CHAR },
      gunner: { ...EMPTY_CHAR },
      fighter: { ...EMPTY_CHAR },
      magician: { ...EMPTY_CHAR },
    },
  };
}

export function loadStats(): AggregateStats {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return emptyStats();
    const data = JSON.parse(raw) as AggregateStats;
    if (data.version !== STATS_VERSION) return emptyStats();
    // Ensure all chars present (for any future schema additions)
    const fresh = emptyStats();
    for (const k of Object.keys(fresh.perCharacter) as CharacterClass[]) {
      if (data.perCharacter[k]) fresh.perCharacter[k] = { ...EMPTY_CHAR, ...data.perCharacter[k] };
    }
    return {
      ...fresh,
      totalRuns: data.totalRuns ?? 0,
      totalWins: data.totalWins ?? 0,
      totalTrueWins: data.totalTrueWins ?? 0,
      totalLosses: data.totalLosses ?? 0,
    };
  } catch {
    return emptyStats();
  }
}

function saveStats(s: AggregateStats): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(s));
  } catch {
    /* ignore */
  }
}

export function recordRunStart(cls: CharacterClass): void {
  const s = loadStats();
  s.totalRuns += 1;
  s.perCharacter[cls].runs += 1;
  saveStats(s);
}

export function recordWin(cls: CharacterClass, ascension: number): void {
  const s = loadStats();
  s.totalWins += 1;
  s.perCharacter[cls].wins += 1;
  if (ascension > s.perCharacter[cls].bestAscension) {
    s.perCharacter[cls].bestAscension = ascension;
  }
  saveStats(s);
}

export function recordTrueWin(cls: CharacterClass, ascension: number): void {
  const s = loadStats();
  s.totalTrueWins += 1;
  s.perCharacter[cls].trueWins += 1;
  if (ascension > s.perCharacter[cls].bestAscension) {
    s.perCharacter[cls].bestAscension = ascension;
  }
  saveStats(s);
}

export function recordLoss(cls: CharacterClass): void {
  const s = loadStats();
  s.totalLosses += 1;
  s.perCharacter[cls].losses += 1;
  saveStats(s);
}

export function resetStats(): void {
  try { localStorage.removeItem(STORAGE_KEY); } catch { /* ignore */ }
}
