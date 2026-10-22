// 칭호 — 수집하고 하나를 골라 장착한다.
// 획득 여부는 기존 기록(업적/도감/전적/등반)에서 파생하므로 저장은 "선택한 칭호" 하나뿐이다.

import { t } from './i18n';
import { getMastery } from './stats';
import type { CharacterClass } from './types';

const STORAGE_KEY = 'dod_title';

export interface TitleDef {
  id: string;
  name: string;
  emoji: string;
  condition: string;
  check: () => boolean;
}

function readAchCount(): number {
  try {
    const d = JSON.parse(localStorage.getItem('dod_achievements') ?? '{}');
    return Array.isArray(d.unlocked) ? d.unlocked.length : 0;
  } catch { return 0; }
}
function readCodex(): { cards: number; relics: number; enemies: number } {
  try {
    const d = JSON.parse(localStorage.getItem('dod_codex') ?? '{}');
    return {
      cards: Array.isArray(d.cards) ? d.cards.length : 0,
      relics: Array.isArray(d.relics) ? d.relics.length : 0,
      enemies: (d.enemies && typeof d.enemies === 'object') ? Object.keys(d.enemies).length : 0,
    };
  } catch { return { cards: 0, relics: 0, enemies: 0 }; }
}
function readTrueWins(): number {
  try {
    const d = JSON.parse(localStorage.getItem('dod_stats') ?? '{}');
    return d.totalTrueWins ?? 0;
  } catch { return 0; }
}
function readAscension(): number {
  try { return parseInt(localStorage.getItem('dod_ascension') ?? '0', 10) || 0; } catch { return 0; }
}
function readEndlessBest(): number {
  try { return parseInt(localStorage.getItem('dod_endless_best') ?? '0', 10) || 0; } catch { return 0; }
}

const ALL_CLASSES: CharacterClass[] = [
  'swordmaster', 'gunner', 'fighter', 'magician', 'priest',
  'thief', 'summoner', 'engineer', 'gambler', 'blood_mage',
];

function masteryLevels(): number[] {
  return ALL_CLASSES.map((c) => {
    try { return getMastery(c).level; } catch { return 0; }
  });
}

export const TITLES: TitleDef[] = [
  { id: 'beginner',   name: t('초보 모험가'),  emoji: '🌱', condition: t('업적 3개'),        check: () => readAchCount() >= 3 },
  { id: 'veteran',    name: t('숙련된 전사'),  emoji: '⚔️', condition: t('업적 8개'),        check: () => readAchCount() >= 8 },
  { id: 'conqueror',  name: t('던전 정복자'),  emoji: '🔥', condition: t('업적 15개'),       check: () => readAchCount() >= 15 },
  { id: 'legend',     name: t('전설의 영웅'),  emoji: '👑', condition: t('업적 22개'),       check: () => readAchCount() >= 22 },
  { id: 'hunter',     name: t('사냥꾼'),       emoji: '🏹', condition: t('적 30종 처치'),    check: () => readCodex().enemies >= 30 },
  { id: 'naturalist', name: t('박물학자'),     emoji: '📕', condition: t('적 53종 처치'),    check: () => readCodex().enemies >= 53 },
  { id: 'collector',  name: t('수집가'),       emoji: '💎', condition: t('카드·유물 93종'),  check: () => { const c = readCodex(); return c.cards + c.relics >= 93; } },
  { id: 'ace',        name: t('일인자'),       emoji: '🥇', condition: t('숙련도 Lv.5 달성'), check: () => masteryLevels().some((l) => l >= 5) },
  { id: 'allrounder', name: t('만상의 달인'),  emoji: '🎭', condition: t('전 캐릭터 Lv.3'),  check: () => masteryLevels().every((l) => l >= 3) },
  { id: 'truth',      name: t('심연의 정복자'), emoji: '✨', condition: t('진엔딩 달성'),     check: () => readTrueWins() >= 1 },
  { id: 'climber',    name: t('등반가'),       emoji: '🧗', condition: t('등반 A5 해금'),    check: () => readAscension() >= 5 },
  { id: 'unbroken',   name: t('불굴'),         emoji: '🛡️', condition: t('등반 A10 해금'),   check: () => readAscension() >= 10 },
  { id: 'endless',    name: t('무한의 끝'),    emoji: '♾️', condition: t('무한 웨이브 20'),  check: () => readEndlessBest() >= 20 },
];

export function isTitleEarned(id: string): boolean {
  return TITLES.find((x) => x.id === id)?.check() ?? false;
}

export function getEarnedCount(): number {
  return TITLES.filter((x) => x.check()).length;
}

/** 장착한 칭호. 미선택이거나 아직 못 얻었으면 null. */
export function getSelectedTitle(): TitleDef | null {
  let id: string | null = null;
  try { id = localStorage.getItem(STORAGE_KEY); } catch { /* ignore */ }
  if (!id) return null;
  const def = TITLES.find((x) => x.id === id);
  return def && def.check() ? def : null;
}

export function setSelectedTitle(id: string | null): void {
  try {
    if (id) localStorage.setItem(STORAGE_KEY, id);
    else localStorage.removeItem(STORAGE_KEY);
  } catch { /* ignore */ }
}
