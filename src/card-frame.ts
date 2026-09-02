const STORAGE_KEY = 'dod_card_frame';

export type CardFrame = 'default' | 'silver' | 'gold' | 'diamond' | 'ruby' | 'sapphire' | 'emerald' | 'amethyst' | 'obsidian';

export interface FrameDef {
  id: CardFrame;
  name: string;
  emoji: string;
  unlockLabel: string;
  check: () => boolean;
}

function readStats(): any {
  try { return JSON.parse(localStorage.getItem('dod_stats') ?? '{}'); } catch { return {}; }
}
function readAch(): any {
  try { return JSON.parse(localStorage.getItem('dod_achievements') ?? '{}'); } catch { return {}; }
}
function readCodex(): any {
  try { return JSON.parse(localStorage.getItem('dod_codex') ?? '{}'); } catch { return {}; }
}
function readEndless(): number {
  try {
    const raw = localStorage.getItem('dod_endless_best');
    return raw ? parseInt(raw, 10) || 0 : 0;
  } catch { return 0; }
}

export const FRAMES: FrameDef[] = [
  { id: 'default', name: '기본', emoji: '🃏', unlockLabel: '', check: () => true },
  { id: 'silver', name: '은빛', emoji: '🥈', unlockLabel: '5승 달성', check: () => { const s = readStats(); return (s.totalWins ?? 0) + (s.totalTrueWins ?? 0) >= 5; } },
  { id: 'gold', name: '황금', emoji: '🥇', unlockLabel: '도감 50%', check: () => { const c = readCodex(); return ((c.cards?.length ?? 0) + (c.relics?.length ?? 0)) >= 62; } },
  { id: 'diamond', name: '다이아', emoji: '💎', unlockLabel: '업적 15개', check: () => (readAch().unlocked?.length ?? 0) >= 15 },
  { id: 'ruby', name: '루비', emoji: '🔴', unlockLabel: '진엔딩 달성', check: () => (readStats().totalTrueWins ?? 0) >= 1 },
  { id: 'sapphire', name: '사파이어', emoji: '🔵', unlockLabel: '무한 웨이브 20', check: () => readEndless() >= 20 },
  { id: 'emerald', name: '에메랄드', emoji: '🟢', unlockLabel: '7캐릭 클리어', check: () => { const a = readAch(); return (a.unlocked ?? []).includes('all_classes_win'); } },
  { id: 'amethyst', name: '자수정', emoji: '🟣', unlockLabel: '등반 A5 클리어', check: () => { const a = readAch(); return (a.unlocked ?? []).includes('asc5'); } },
  { id: 'obsidian', name: '흑요석', emoji: '⚫', unlockLabel: '업적 22개', check: () => (readAch().unlocked?.length ?? 0) >= 22 },
];

export function getCardFrame(): CardFrame {
  try {
    const v = localStorage.getItem(STORAGE_KEY) as CardFrame | null;
    if (v && FRAMES.some((f) => f.id === v)) return v;
  } catch { /* ignore */ }
  return 'default';
}

export function setCardFrame(frame: CardFrame): void {
  try { localStorage.setItem(STORAGE_KEY, frame); } catch { /* ignore */ }
}
