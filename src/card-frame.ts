const STORAGE_KEY = 'dod_card_frame';

export type CardFrame = 'default' | 'silver' | 'gold' | 'diamond';

export interface FrameDef {
  id: CardFrame;
  name: string;
  emoji: string;
  unlockLabel: string;
  check: () => boolean;
}

export const FRAMES: FrameDef[] = [
  { id: 'default', name: '기본', emoji: '🃏', unlockLabel: '', check: () => true },
  { id: 'silver', name: '은빛', emoji: '🥈', unlockLabel: '5승 달성', check: () => { try { const s = JSON.parse(localStorage.getItem('dod_stats') ?? '{}'); return (s.totalWins ?? 0) + (s.totalTrueWins ?? 0) >= 5; } catch { return false; } } },
  { id: 'gold', name: '황금', emoji: '🥇', unlockLabel: '도감 50%', check: () => { try { const c = JSON.parse(localStorage.getItem('dod_codex') ?? '{}'); return ((c.cards?.length ?? 0) + (c.relics?.length ?? 0)) >= 62; } catch { return false; } } },
  { id: 'diamond', name: '다이아', emoji: '💎', unlockLabel: '업적 15개', check: () => { try { const a = JSON.parse(localStorage.getItem('dod_achievements') ?? '{}'); return (a.unlocked?.length ?? 0) >= 15; } catch { return false; } } },
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
