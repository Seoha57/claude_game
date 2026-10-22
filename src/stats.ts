import type { CharacterClass } from './types';
import { markDirty } from './sync/sync';
import { t } from './i18n';

const STORAGE_KEY = 'dod_stats';
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
      priest: { ...EMPTY_CHAR },
      thief: { ...EMPTY_CHAR },
      summoner: { ...EMPTY_CHAR },
      engineer: { ...EMPTY_CHAR },
      gambler: { ...EMPTY_CHAR },
      blood_mage: { ...EMPTY_CHAR },
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
  markDirty();
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

// ── 캐릭터 숙련도 ──
// 저장을 늘리지 않고 기존 전적에서 파생한다.
// 숙련 점수 = 일반 엔딩 1점 + 진엔딩 2점 + 최고 등반 단계(+1)

export interface Mastery {
  level: number;        // 0 ~ 5
  points: number;
  title: string;        // 레벨 명칭
  nextAt: number | null; // 다음 레벨 필요 점수 (최대 레벨이면 null)
}

const MASTERY_TIERS: { at: number; title: string }[] = [
  { at: 1,  title: t('수련생') },
  { at: 3,  title: t('숙련자') },
  { at: 6,  title: t('달인') },
  { at: 10, title: t('명인') },
  { at: 15, title: t('전설') },
];

export function getMastery(cls: CharacterClass): Mastery {
  const c = loadStats().perCharacter[cls];
  const points = c.wins + c.trueWins * 2 + Math.max(0, c.bestAscension + 1);
  let level = 0;
  let title = t('미숙련');
  for (const tier of MASTERY_TIERS) {
    if (points >= tier.at) { level += 1; title = tier.title; }
  }
  const nextAt = level >= MASTERY_TIERS.length ? null : MASTERY_TIERS[level].at;
  return { level, points, title, nextAt };
}
