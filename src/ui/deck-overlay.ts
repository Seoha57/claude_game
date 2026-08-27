import { el } from './dom';
import { getEffectiveDef } from '../content/cards';
import { cardFlavor } from '../content/lore';
import type { CardInstance } from '../types';

export interface CardListOptions {
  title?: string;
  emptyText?: string;
  shuffleHint?: boolean; // For draw pile, hint that order is shuffled
}

export function openDeckOverlay(deck: CardInstance[], options: CardListOptions = {}): void {
  const title = options.title ?? '덱 보기';

  const overlay = el('div', {
    class: 'card-list-overlay',
    style: {
      position: 'fixed', inset: '0', background: 'rgba(0,0,0,0.78)',
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      justifyContent: 'flex-start', padding: '32px 16px', zIndex: '100',
      overflowY: 'auto',
    },
    onClick: (e: MouseEvent) => { if (e.target === overlay) overlay.remove(); },
  });

  const header = el('div', {
    style: { display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px', width: '100%', maxWidth: '900px' },
  });
  header.appendChild(el('h2', { style: { margin: '0', color: 'var(--accent)' } }, `${title} (${deck.length}장)`));
  header.appendChild(el('button', { onClick: () => overlay.remove() }, '닫기 (Esc)'));
  overlay.appendChild(header);

  if (options.shuffleHint) {
    overlay.appendChild(
      el('div', { style: { color: 'var(--muted)', fontSize: '12px', marginBottom: '12px' } },
        '⚠ 드로우 순서는 매번 섞입니다. 어떤 카드가 들어있는지만 표시합니다.'),
    );
  }

  if (deck.length === 0) {
    overlay.appendChild(
      el('div', { style: { color: 'var(--muted)', marginTop: '32px' } },
        options.emptyText ?? '비어있습니다.'),
    );
  } else {
    const grid = el('div', {
      style: { display: 'flex', flexWrap: 'wrap', gap: '10px', justifyContent: 'center', maxWidth: '900px' },
    });

    // Sort: curses last, then by type (attack/skill/power), then by cost asc
    const sorted = [...deck].sort((a, b) => {
      const da = getEffectiveDef(a);
      const db = getEffectiveDef(b);
      const ca = isCurseLike(da.id) ? 1 : 0;
      const cb = isCurseLike(db.id) ? 1 : 0;
      if (ca !== cb) return ca - cb;
      const order = { attack: 0, skill: 1, power: 2 } as const;
      const oa = order[da.type] ?? 3;
      const ob = order[db.type] ?? 3;
      if (oa !== ob) return oa - ob;
      return da.cost - db.cost;
    });

    for (const card of sorted) {
      const def = getEffectiveDef(card);
      const curse = isCurseLike(def.id);
      const lvl = card.upgraded ?? 0;
      const upgradeLabel = lvl >= 2 ? '★★ 이중 강화' : lvl === 1 ? '★ 강화됨' : null;
      const outline = lvl >= 2 ? '2px solid var(--gold, #f5c542)' : lvl === 1 ? '2px solid var(--good)' : 'none';
      const flavor = cardFlavor(card.defId);
      grid.appendChild(
        el('div',
          {
            class: `card ${def.type} rarity-${def.rarity} ${curse ? 'curse' : ''} ${lvl >= 2 ? 'upgraded upgraded-plus' : lvl === 1 ? 'upgraded' : ''}`,
            style: { cursor: 'default', outline },
          },
          el('div', { class: 'card-cost' }, String(def.cost)),
          el('div', { class: 'card-name' }, def.name),
          el('div', { class: 'card-desc' }, def.description),
          ...(flavor ? [el('div', { class: 'card-flavor' }, flavor)] : []),
          el('div', { class: 'card-type' }, upgradeLabel ?? (curse ? '저주' : typeLabel(def.type))),
        ),
      );
    }

    overlay.appendChild(grid);
  }

  // Esc to close
  const onKey = (e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      overlay.remove();
      window.removeEventListener('keydown', onKey);
    }
  };
  window.addEventListener('keydown', onKey);

  document.body.appendChild(overlay);
}

const CURSE_IDS = new Set(['wound', 'decay', 'parasite', 'doubt']);
export function isCurseLike(id: string): boolean {
  return CURSE_IDS.has(id);
}

function typeLabel(t: string): string {
  if (t === 'attack') return '공격';
  if (t === 'skill') return '방어';
  return '효과';
}
