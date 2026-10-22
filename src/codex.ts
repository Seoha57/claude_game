// Persistent "discovered cards / relics" codex.

import { checkCodexCards, checkCodexRelics, checkCodexEnemies } from './achievements';
import { markDirty } from './sync/sync';

const STORAGE_KEY = 'dod_codex';
const CODEX_VERSION = 1;

interface CodexData {
  version: number;
  cards: string[];   // card def ids ever seen
  relics: string[];  // relic ids ever seen
  enemies: Record<string, number>;  // enemy def id → 처치 횟수
}

function emptyData(): CodexData {
  return { version: CODEX_VERSION, cards: [], relics: [], enemies: {} };
}

function load(): CodexData {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return emptyData();
    const data = JSON.parse(raw) as CodexData;
    if (data.version !== CODEX_VERSION) return emptyData();
    return {
      version: CODEX_VERSION,
      cards: Array.isArray(data.cards) ? data.cards : [],
      relics: Array.isArray(data.relics) ? data.relics : [],
      enemies: (data.enemies && typeof data.enemies === 'object') ? data.enemies : {},
    };
  } catch {
    return emptyData();
  }
}

function persist(data: CodexData): void {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(data)); } catch { /* ignore */ }
  markDirty();
}

export function recordCard(id: string): void {
  const d = load();
  if (!d.cards.includes(id)) {
    d.cards.push(id);
    persist(d);
    checkCodexCards(d.cards.length);
  }
}

export function recordCards(ids: string[]): void {
  const d = load();
  let changed = false;
  for (const id of ids) {
    if (!d.cards.includes(id)) { d.cards.push(id); changed = true; }
  }
  if (changed) {
    persist(d);
    checkCodexCards(d.cards.length);
  }
}

export function recordRelic(id: string): void {
  const d = load();
  if (!d.relics.includes(id)) {
    d.relics.push(id);
    persist(d);
    checkCodexRelics(d.relics.length);
  }
}

export function recordRelics(ids: string[]): void {
  const d = load();
  let changed = false;
  for (const id of ids) {
    if (!d.relics.includes(id)) { d.relics.push(id); changed = true; }
  }
  if (changed) {
    persist(d);
    checkCodexRelics(d.relics.length);
  }
}

export function recordEnemyKills(ids: string[]): void {
  if (ids.length === 0) return;
  const d = load();
  for (const id of ids) d.enemies[id] = (d.enemies[id] ?? 0) + 1;
  persist(d);
  checkCodexEnemies(Object.keys(d.enemies).length);
}

export function getEnemyKills(): Record<string, number> {
  return load().enemies;
}

export function getSeenCards(): Set<string> {
  return new Set(load().cards);
}

export function getSeenRelics(): Set<string> {
  return new Set(load().relics);
}

export function getCodexCounts(): { cards: number; relics: number; enemies: number } {
  const d = load();
  return { cards: d.cards.length, relics: d.relics.length, enemies: Object.keys(d.enemies).length };
}

export function resetCodex(): void {
  try { localStorage.removeItem(STORAGE_KEY); } catch { /* ignore */ }
}
