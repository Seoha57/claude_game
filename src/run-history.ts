// ─────────────────────────────────────────────────────────────────
// 런 히스토리 — 지난 플레이 기록 보관
// 최근 N개 런의 결과/디테일 저장. 로컬 + sync.
// ─────────────────────────────────────────────────────────────────

import type { CharacterClass } from './types';
import { markDirty } from './sync/sync';

const STORAGE_KEY = 'dod_history';
const STORAGE_VERSION = 1;
const MAX_ENTRIES = 30;

export type RunOutcome = 'won' | 'true_won' | 'lost';

export interface RunHistoryEntry {
  id: string;             // unique
  timestamp: number;
  characterClass: CharacterClass;
  outcome: RunOutcome;
  chapter: number;
  floor: number;
  ascension: number;
  deckSize: number;
  gold: number;
  killerName?: string;    // 패배 시 누구에게 죽었는지
  daily?: boolean;        // 데일리 챌린지였는지
}

interface HistoryStore {
  version: number;
  entries: RunHistoryEntry[];
}

function load(): HistoryStore {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { version: STORAGE_VERSION, entries: [] };
    const data = JSON.parse(raw) as HistoryStore;
    if (data.version !== STORAGE_VERSION) return { version: STORAGE_VERSION, entries: [] };
    return { version: STORAGE_VERSION, entries: Array.isArray(data.entries) ? data.entries : [] };
  } catch {
    return { version: STORAGE_VERSION, entries: [] };
  }
}

function persist(s: HistoryStore): void {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(s)); } catch { /* ignore */ }
  markDirty();
}

export function recordRunHistory(entry: Omit<RunHistoryEntry, 'id'>): void {
  const s = load();
  const full: RunHistoryEntry = {
    ...entry,
    id: `${entry.timestamp}_${Math.random().toString(36).slice(2, 8)}`,
  };
  s.entries.unshift(full);
  // 최근 MAX_ENTRIES개만 유지
  if (s.entries.length > MAX_ENTRIES) s.entries = s.entries.slice(0, MAX_ENTRIES);
  persist(s);
}

export function getRunHistory(): RunHistoryEntry[] {
  return load().entries;
}

export function clearRunHistory(): void {
  persist({ version: STORAGE_VERSION, entries: [] });
}
