import { el } from './dom';
import { getEffectiveDef } from '../content/cards';
import { cardFlavor } from '../content/lore';
import type { CardInstance } from '../types';

export interface CardListOptions {
  title?: string;
  emptyText?: string;
  shuffleHint?: boolean;
  showFilter?: boolean;
}

type FilterType = 'all' | 'attack' | 'skill' | 'power' | 'curse';
type SortType = 'type' | 'cost' | 'name';

export function openDeckOverlay(deck: CardInstance[], options: CardListOptions = {}): void {
  const title = options.title ?? '덱 보기';
  const showFilter = options.showFilter !== false;

  let currentFilter: FilterType = 'all';
  let currentSort: SortType = 'type';

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

  // Filter + Sort controls
  let controlsEl: HTMLElement | null = null;
  if (showFilter && deck.length > 0) {
    controlsEl = el('div', {
      style: {
        display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '14px',
        width: '100%', maxWidth: '900px', alignItems: 'center',
      },
    });
    overlay.appendChild(controlsEl);
  }

  const grid = el('div', {
    style: { display: 'flex', flexWrap: 'wrap', gap: '10px', justifyContent: 'center', maxWidth: '900px' },
  });
  overlay.appendChild(grid);

  function countByType(type: FilterType): number {
    if (type === 'all') return deck.length;
    if (type === 'curse') return deck.filter((c) => isCurseLike(getEffectiveDef(c).id)).length;
    return deck.filter((c) => {
      const def = getEffectiveDef(c);
      return !isCurseLike(def.id) && def.type === type;
    }).length;
  }

  function renderControls(): void {
    if (!controlsEl) return;
    controlsEl.innerHTML = '';

    const filters: { key: FilterType; label: string }[] = [
      { key: 'all', label: '전체' },
      { key: 'attack', label: '공격' },
      { key: 'skill', label: '방어' },
      { key: 'power', label: '효과' },
      { key: 'curse', label: '저주' },
    ];

    for (const f of filters) {
      const count = countByType(f.key);
      if (f.key !== 'all' && count === 0) continue;
      const active = currentFilter === f.key;
      controlsEl.appendChild(el('button', {
        style: {
          fontSize: '12px', padding: '4px 10px', borderRadius: '12px',
          background: active ? 'var(--accent)' : 'rgba(255,255,255,0.08)',
          color: active ? 'white' : 'var(--muted)',
          border: 'none', cursor: 'pointer',
        },
        onClick: () => { currentFilter = f.key; renderControls(); renderGrid(); },
      }, `${f.label} ${count}`));
    }

    // Separator
    controlsEl.appendChild(el('span', { style: { width: '1px', height: '16px', background: 'var(--border)', margin: '0 4px' } }));

    const sorts: { key: SortType; label: string }[] = [
      { key: 'type', label: '타입순' },
      { key: 'cost', label: '코스트순' },
      { key: 'name', label: '이름순' },
    ];

    for (const s of sorts) {
      const active = currentSort === s.key;
      controlsEl.appendChild(el('button', {
        style: {
          fontSize: '12px', padding: '4px 10px', borderRadius: '12px',
          background: active ? 'var(--accent-2, var(--accent))' : 'rgba(255,255,255,0.08)',
          color: active ? 'white' : 'var(--muted)',
          border: 'none', cursor: 'pointer',
        },
        onClick: () => { currentSort = s.key; renderControls(); renderGrid(); },
      }, s.label));
    }
  }

  function renderGrid(): void {
    grid.innerHTML = '';

    let filtered = [...deck];
    if (currentFilter === 'curse') {
      filtered = filtered.filter((c) => isCurseLike(getEffectiveDef(c).id));
    } else if (currentFilter !== 'all') {
      filtered = filtered.filter((c) => {
        const def = getEffectiveDef(c);
        return !isCurseLike(def.id) && def.type === currentFilter;
      });
    }

    filtered.sort((a, b) => {
      const da = getEffectiveDef(a);
      const db = getEffectiveDef(b);

      if (currentSort === 'cost') {
        if (da.cost !== db.cost) return da.cost - db.cost;
        return da.name.localeCompare(db.name, 'ko');
      }
      if (currentSort === 'name') {
        return da.name.localeCompare(db.name, 'ko');
      }
      // type sort (default)
      const ca = isCurseLike(da.id) ? 1 : 0;
      const cb = isCurseLike(db.id) ? 1 : 0;
      if (ca !== cb) return ca - cb;
      const order = { attack: 0, skill: 1, power: 2 } as const;
      const oa = order[da.type] ?? 3;
      const ob = order[db.type] ?? 3;
      if (oa !== ob) return oa - ob;
      return da.cost - db.cost;
    });

    if (filtered.length === 0) {
      grid.appendChild(
        el('div', { style: { color: 'var(--muted)', marginTop: '32px' } },
          options.emptyText ?? '비어있습니다.'),
      );
      return;
    }

    for (const card of filtered) {
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
  }

  if (deck.length === 0) {
    grid.appendChild(
      el('div', { style: { color: 'var(--muted)', marginTop: '32px' } },
        options.emptyText ?? '비어있습니다.'),
    );
  } else {
    renderControls();
    renderGrid();
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
