import { el } from './dom';
import { setScreen } from '../state';
import { CARD_DEFS } from '../content/cards';
import { RELIC_DEFS } from '../content/relics';
import { getSeenCards, getSeenRelics, resetCodex } from '../codex';
import { isCurseLike } from './deck-overlay';
import type { CardDef, RelicDef } from '../types';
import { isCardUnlocked, isRelicUnlocked, cardUnlockReq, relicUnlockReq, reqLabel } from '../unlocks';

type Tab = 'cards' | 'relics';
type CardFilter = 'all' | 'swordmaster' | 'gunner' | 'fighter' | 'magician' | 'priest';

const RARITY_LABEL: Record<string, string> = {
  starter: '시작', common: '커먼', uncommon: '언커먼', rare: '레어', boss: '보스',
};
const RARITY_COLOR: Record<string, string> = {
  starter: '#888', common: '#888', uncommon: '#5599dd', rare: '#d4aa44', boss: '#ff8030',
};

export function renderCodex(): HTMLElement {
  const wrapper = el('div', { class: 'codex-screen' });
  let tab: Tab = 'cards';
  let cardFilter: CardFilter = 'all';

  const rebuild = () => {
    wrapper.innerHTML = '';
    appendContent();
  };

  const appendContent = () => {
    wrapper.appendChild(el('h1', { style: { color: 'var(--accent)', margin: '0' } }, '📖 도감'));
    wrapper.appendChild(
      el('div', { style: { color: 'var(--muted)', fontSize: '12px', marginBottom: '4px' } },
        '발견한 카드와 유물을 모두 모아보세요. 미발견 항목은 ???로 표시됩니다.'),
    );

    // Tabs
    const tabRow = el('div', { class: 'codex-tabs' });
    tabRow.appendChild(el('button', {
      class: tab === 'cards' ? 'codex-tab active' : 'codex-tab',
      onClick: () => { tab = 'cards'; rebuild(); },
    }, '🃏 카드'));
    tabRow.appendChild(el('button', {
      class: tab === 'relics' ? 'codex-tab active' : 'codex-tab',
      onClick: () => { tab = 'relics'; rebuild(); },
    }, '💎 유물'));
    wrapper.appendChild(tabRow);

    if (tab === 'cards') {
      appendCardsTab();
    } else {
      appendRelicsTab();
    }

    // Footer
    const footer = el('div', { style: { display: 'flex', gap: '10px', marginTop: '20px' } });
    footer.appendChild(el('button', { onClick: () => setScreen('title') }, '← 제목으로'));
    footer.appendChild(el('button', {
      style: { background: 'transparent', color: 'var(--bad)', border: '1px solid var(--bad)' },
      onClick: () => {
        if (confirm('도감을 초기화합니다. 발견 기록이 모두 사라집니다. 계속할까요?')) {
          resetCodex();
          rebuild();
        }
      },
    }, '도감 초기화'));
    wrapper.appendChild(footer);
  };

  const appendCardsTab = () => {
    const filterRow = el('div', { class: 'codex-filter-row' });
    const filters: { key: CardFilter; label: string }[] = [
      { key: 'all', label: '전체' },
      { key: 'swordmaster', label: '귀검사' },
      { key: 'gunner', label: '거너' },
      { key: 'fighter', label: '격투가' },
      { key: 'magician', label: '마법사' },
      { key: 'priest', label: '프리스트' },
    ];
    for (const f of filters) {
      filterRow.appendChild(el('button', {
        class: cardFilter === f.key ? 'codex-filter active' : 'codex-filter',
        onClick: () => { cardFilter = f.key; rebuild(); },
      }, f.label));
    }
    wrapper.appendChild(filterRow);

    const allCards = Object.values(CARD_DEFS).filter((c) => !isCurseLike(c.id));
    const filtered = allCards.filter((c) => {
      if (cardFilter === 'all') return true;
      if (cardFilter === 'gunner') return c.id.startsWith('g_');
      if (cardFilter === 'fighter') return c.id.startsWith('f_');
      if (cardFilter === 'magician') return c.id.startsWith('m_');
      if (cardFilter === 'priest') return c.id.startsWith('p_');
      // swordmaster: cards with no character prefix
      return !c.id.startsWith('g_') && !c.id.startsWith('f_') && !c.id.startsWith('m_') && !c.id.startsWith('p_');
    });

    const seen = getSeenCards();
    const seenInFilter = filtered.filter((c) => seen.has(c.id)).length;
    const unlockedInFilter = filtered.filter((c) => isCardUnlocked(c)).length;

    wrapper.appendChild(el('div', { class: 'codex-stats' },
      `발견 ${seenInFilter} / ${filtered.length}  ·  🔓 ${unlockedInFilter} / ${filtered.length}`));

    // Sort: by type (attack/skill/power), then rarity, then cost
    const rarityOrder: Record<string, number> = { starter: 0, common: 1, uncommon: 2, rare: 3 };
    const typeOrder: Record<string, number> = { attack: 0, skill: 1, power: 2 };
    const sorted = [...filtered].sort((a, b) => {
      const t = (typeOrder[a.type] ?? 9) - (typeOrder[b.type] ?? 9);
      if (t !== 0) return t;
      const r = (rarityOrder[a.rarity] ?? 9) - (rarityOrder[b.rarity] ?? 9);
      if (r !== 0) return r;
      return a.cost - b.cost;
    });

    const grid = el('div', { class: 'codex-card-grid' });
    for (const def of sorted) {
      grid.appendChild(renderCardSlot(def, seen.has(def.id)));
    }
    wrapper.appendChild(grid);
  };

  const appendRelicsTab = () => {
    const allRelics = Object.values(RELIC_DEFS);
    const seen = getSeenRelics();
    const seenCount = allRelics.filter((r) => seen.has(r.id)).length;
    const unlockedCount = allRelics.filter((r) => isRelicUnlocked(r)).length;

    wrapper.appendChild(el('div', { class: 'codex-stats' },
      `발견 ${seenCount} / ${allRelics.length}  ·  🔓 ${unlockedCount} / ${allRelics.length}`));

    const rarityOrder: Record<string, number> = { starter: 0, common: 1, uncommon: 2, rare: 3, boss: 4 };
    const sorted = [...allRelics].sort((a, b) => {
      const r = (rarityOrder[a.rarity] ?? 9) - (rarityOrder[b.rarity] ?? 9);
      if (r !== 0) return r;
      return a.name.localeCompare(b.name);
    });

    const grid = el('div', { class: 'codex-relic-grid' });
    for (const def of sorted) {
      grid.appendChild(renderRelicSlot(def, seen.has(def.id)));
    }
    wrapper.appendChild(grid);
  };

  appendContent();
  return wrapper;
}

function renderCardSlot(def: CardDef, isSeen: boolean): HTMLElement {
  const unlocked = isCardUnlocked(def);
  const lockText = unlocked ? '' : reqLabel(cardUnlockReq(def));
  const cls = `card ${def.type} rarity-${def.rarity} codex-card-slot ${isSeen ? '' : 'unseen'} ${unlocked ? '' : 'locked'}`;
  if (!isSeen) {
    return el('div', { class: cls, style: { cursor: 'default' } },
      el('div', { class: 'card-cost' }, '?'),
      el('div', { class: 'card-name' }, '???'),
      el('div', { class: 'card-desc' }, unlocked ? '미발견' : lockText),
      el('div', { class: 'card-type' }, unlocked ? '???' : '🔒'),
    );
  }
  return el('div', { class: cls, style: { cursor: 'default' } },
    el('div', { class: 'card-cost' }, String(def.cost)),
    el('div', { class: 'card-name' }, def.name),
    el('div', { class: 'card-desc' }, unlocked ? def.description : lockText),
    el('div', { class: 'card-type' }, unlocked ? typeLabel(def.type) : '🔒'),
  );
}

function renderRelicSlot(def: RelicDef, isSeen: boolean): HTMLElement {
  const rarityColor = RARITY_COLOR[def.rarity] ?? '#888';
  const unlocked = isRelicUnlocked(def);
  const lockText = unlocked ? '' : reqLabel(relicUnlockReq(def));
  const cls = `codex-relic-slot ${isSeen ? '' : 'unseen'} ${unlocked ? '' : 'locked'}`;
  if (!isSeen) {
    return el('div', { class: cls },
      el('div', { class: 'codex-relic-name' }, unlocked ? '???' : '🔒'),
      el('div', { class: 'codex-relic-desc' }, unlocked ? '미발견' : lockText),
      el('div', { class: 'codex-relic-rarity', style: { color: rarityColor } },
        RARITY_LABEL[def.rarity] ?? def.rarity),
    );
  }
  return el('div', { class: cls },
    el('div', { class: 'codex-relic-name' }, unlocked ? def.name : '🔒 ???'),
    el('div', { class: 'codex-relic-desc' }, unlocked ? def.description : lockText),
    el('div', { class: 'codex-relic-rarity', style: { color: rarityColor } },
      RARITY_LABEL[def.rarity] ?? def.rarity),
  );
}

function typeLabel(t: string): string {
  return t === 'attack' ? '공격' : t === 'skill' ? '스킬' : '파워';
}
