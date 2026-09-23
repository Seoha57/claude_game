import { el } from './dom';
import { setScreen } from '../state';
import { CARD_DEFS } from '../content/cards';
import { RELIC_DEFS, SYNERGY_SETS } from '../content/relics';
import { getSeenCards, getSeenRelics, resetCodex } from '../codex';
import { isCurseLike } from './deck-overlay';
import type { CardDef, RelicDef } from '../types';
import { isCardUnlocked, isRelicUnlocked, cardUnlockReq, relicUnlockReq, reqLabel } from '../unlocks';
import { kwDesc } from './keywords';
import { ic } from './art';
import { t } from '../i18n';

type Tab = 'cards' | 'relics';
type CardFilter = 'all' | 'swordmaster' | 'gunner' | 'fighter' | 'magician' | 'priest' | 'thief' | 'summoner' | 'engineer' | 'gambler';
type RarityFilter = 'all' | 'starter' | 'common' | 'uncommon' | 'rare' | 'boss';

const RARITY_LABEL: Record<string, string> = {
  starter: '시작', common: '커먼', uncommon: '언커먼', rare: '레어', elite: '엘리트', boss: '보스',
};
const RARITY_COLOR: Record<string, string> = {
  starter: '#888', common: '#888', uncommon: '#5599dd', rare: '#d4aa44', elite: '#ff55aa', boss: '#ff8030',
};

export function renderCodex(): HTMLElement {
  const wrapper = el('div', { class: 'codex-screen' });
  let tab: Tab = 'cards';
  let cardFilter: CardFilter = 'all';
  let rarityFilter: RarityFilter = 'all';
  let searchText = '';

  const rebuild = () => {
    wrapper.innerHTML = '';
    appendContent();
  };

  const appendContent = () => {
    const codexTitle = el('h1', { style: { color: 'var(--accent)', margin: '0' } });
    codexTitle.innerHTML = `${ic('card')} ${t('도감')}`;
    wrapper.appendChild(codexTitle);
    wrapper.appendChild(
      el('div', { style: { color: 'var(--muted)', fontSize: '12px', marginBottom: '4px', textAlign: 'center' } },
        t('발견한 카드와 유물을 모두 모아보세요. 미발견 항목은 ???로 표시됩니다.')),
    );

    // Search bar
    const searchRow = el('div', { class: 'codex-search-row' });
    const searchInput = el('input', {
      type: 'text',
      class: 'codex-search',
      placeholder: t('카드/유물 이름 검색...'),
      value: searchText,
      onInput: (e: Event) => {
        searchText = (e.target as HTMLInputElement).value;
        rebuild();
      },
    }) as HTMLInputElement;
    searchRow.appendChild(searchInput);
    if (searchText) {
      searchRow.appendChild(el('button', {
        class: 'codex-search-clear',
        onClick: () => { searchText = ''; rebuild(); },
      }, '✕'));
    }
    wrapper.appendChild(searchRow);

    // Tabs
    const tabRow = el('div', { class: 'codex-tabs' });
    const cardTab = el('button', {
      class: tab === 'cards' ? 'codex-tab active' : 'codex-tab',
      onClick: () => { tab = 'cards'; rebuild(); },
    });
    cardTab.innerHTML = `${ic('card')} ${t('카드')}`;
    tabRow.appendChild(cardTab);
    const relicTab = el('button', {
      class: tab === 'relics' ? 'codex-tab active' : 'codex-tab',
      onClick: () => { tab = 'relics'; rebuild(); },
    });
    relicTab.innerHTML = `${ic('gem')} ${t('유물')}`;
    tabRow.appendChild(relicTab);
    wrapper.appendChild(tabRow);

    if (tab === 'cards') {
      appendCardsTab();
    } else {
      appendRelicsTab();
    }

    // Footer
    const footer = el('div', { style: { display: 'flex', gap: '10px', marginTop: '20px' } });
    footer.appendChild(el('button', { onClick: () => setScreen('title') }, t('← 제목으로')));
    footer.appendChild(el('button', {
      style: { background: 'transparent', color: 'var(--bad)', border: '1px solid var(--bad)' },
      onClick: () => {
        if (confirm(t('도감을 초기화합니다. 발견 기록이 모두 사라집니다. 계속할까요?'))) {
          resetCodex();
          rebuild();
        }
      },
    }, t('도감 초기화')));
    wrapper.appendChild(footer);

    // Restore focus to search if it was active
    if (searchText) {
      requestAnimationFrame(() => {
        const input = wrapper.querySelector('.codex-search') as HTMLInputElement | null;
        if (input) { input.focus(); input.selectionStart = input.selectionEnd = searchText.length; }
      });
    }
  };

  const appendCardsTab = () => {
    // Class filter row
    const filterRow = el('div', { class: 'codex-filter-row' });
    const filters: { key: CardFilter; label: string }[] = [
      { key: 'all', label: t('전체') },
      { key: 'swordmaster', label: t('검사') },
      { key: 'gunner', label: t('총잡이') },
      { key: 'fighter', label: t('격투가') },
      { key: 'magician', label: t('마법사') },
      { key: 'priest', label: t('성직자') },
      { key: 'thief', label: t('도적') },
      { key: 'summoner', label: t('정령술사') },
      { key: 'engineer', label: t('공학자') },
      { key: 'gambler', label: t('갬블러') },
    ];
    for (const f of filters) {
      filterRow.appendChild(el('button', {
        class: cardFilter === f.key ? 'codex-filter active' : 'codex-filter',
        onClick: () => { cardFilter = f.key; rebuild(); },
      }, f.label));
    }
    wrapper.appendChild(filterRow);

    // Rarity filter row
    const rarityRow = el('div', { class: 'codex-filter-row' });
    const rarities: { key: RarityFilter; label: string }[] = [
      { key: 'all', label: t('전체') },
      { key: 'starter', label: t('스타터') },
      { key: 'common', label: t('커먼') },
      { key: 'uncommon', label: t('언커먼') },
      { key: 'rare', label: t('레어') },
    ];
    for (const r of rarities) {
      rarityRow.appendChild(el('button', {
        class: rarityFilter === r.key ? 'codex-filter active' : 'codex-filter',
        onClick: () => { rarityFilter = r.key; rebuild(); },
      }, r.label));
    }
    wrapper.appendChild(rarityRow);

    const allCards = Object.values(CARD_DEFS).filter((c) => !isCurseLike(c.id));
    let filtered = allCards.filter((c) => {
      if (cardFilter === 'all') return true;
      if (cardFilter === 'gunner') return c.id.startsWith('g_');
      if (cardFilter === 'fighter') return c.id.startsWith('f_');
      if (cardFilter === 'magician') return c.id.startsWith('m_');
      if (cardFilter === 'priest') return c.id.startsWith('p_');
      if (cardFilter === 'thief') return c.id.startsWith('t_');
      if (cardFilter === 'summoner') return c.id.startsWith('s_');
      if (cardFilter === 'engineer') return c.id.startsWith('n_');
      if (cardFilter === 'gambler') return c.id.startsWith('b_');
      return !c.id.startsWith('g_') && !c.id.startsWith('f_') && !c.id.startsWith('m_') && !c.id.startsWith('p_') && !c.id.startsWith('t_') && !c.id.startsWith('s_') && !c.id.startsWith('n_') && !c.id.startsWith('b_');
    });

    if (rarityFilter !== 'all') {
      filtered = filtered.filter((c) => c.rarity === rarityFilter);
    }

    if (searchText) {
      const q = searchText.toLowerCase();
      filtered = filtered.filter((c) =>
        c.name.toLowerCase().includes(q) || c.description.toLowerCase().includes(q) || c.id.toLowerCase().includes(q));
    }

    const seen = getSeenCards();
    const seenInFilter = filtered.filter((c) => seen.has(c.id)).length;
    const unlockedInFilter = filtered.filter((c) => isCardUnlocked(c)).length;

    const cardStats = el('div', { class: 'codex-stats' });
    cardStats.innerHTML = `${t('발견')} ${seenInFilter} / ${filtered.length}  ·  ${ic('unlock')} ${unlockedInFilter} / ${filtered.length}`;
    wrapper.appendChild(cardStats);

    const rarityOrder: Record<string, number> = { starter: 0, common: 1, uncommon: 2, rare: 3 };
    const typeOrder: Record<string, number> = { attack: 0, skill: 1, power: 2 };
    const sorted = [...filtered].sort((a, b) => {
      const tp = (typeOrder[a.type] ?? 9) - (typeOrder[b.type] ?? 9);
      if (tp !== 0) return tp;
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
    let filtered = allRelics;

    // Rarity filter for relics
    const rarityRow = el('div', { class: 'codex-filter-row' });
    const rarities: { key: RarityFilter; label: string }[] = [
      { key: 'all', label: t('전체') },
      { key: 'common', label: t('커먼') },
      { key: 'uncommon', label: t('언커먼') },
      { key: 'rare', label: t('레어') },
      { key: 'boss', label: t('보스') },
    ];
    for (const r of rarities) {
      rarityRow.appendChild(el('button', {
        class: rarityFilter === r.key ? 'codex-filter active' : 'codex-filter',
        onClick: () => { rarityFilter = r.key; rebuild(); },
      }, r.label));
    }
    wrapper.appendChild(rarityRow);

    if (rarityFilter !== 'all') {
      filtered = filtered.filter((r) => r.rarity === rarityFilter);
    }

    if (searchText) {
      const q = searchText.toLowerCase();
      filtered = filtered.filter((r) =>
        r.name.toLowerCase().includes(q) || r.description.toLowerCase().includes(q));
    }

    const seen = getSeenRelics();
    const seenCount = filtered.filter((r) => seen.has(r.id)).length;
    const unlockedCount = filtered.filter((r) => isRelicUnlocked(r)).length;

    const relicStats = el('div', { class: 'codex-stats' });
    relicStats.innerHTML = `${t('발견')} ${seenCount} / ${filtered.length}  ·  ${ic('unlock')} ${unlockedCount} / ${filtered.length}`;
    wrapper.appendChild(relicStats);

    const rarityOrder: Record<string, number> = { starter: 0, common: 1, uncommon: 2, rare: 3, boss: 4 };
    const sorted = [...filtered].sort((a, b) => {
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
      el('div', { class: 'card-desc' }, unlocked ? t('미발견') : lockText),
      (() => { const d = el('div', { class: 'card-type' }); d.innerHTML = unlocked ? '???' : ic('lock'); return d; })(),
    );
  }
  return el('div', { class: cls, style: { cursor: 'default' } },
    el('div', { class: 'card-cost' }, def.cost < 0 ? 'X' : String(def.cost)),
    el('div', { class: 'card-name' }, def.name),
    el('div', { class: 'card-desc' }, kwDesc(def.description)),
    (() => { const d = el('div', { class: 'card-type' }); d.innerHTML = unlocked ? typeLabel(def.type) : ic('lock'); return d; })(),
  );
}

function renderRelicSlot(def: RelicDef, isSeen: boolean): HTMLElement {
  const rarityColor = RARITY_COLOR[def.rarity] ?? '#888';
  const unlocked = isRelicUnlocked(def);
  const lockText = unlocked ? '' : reqLabel(relicUnlockReq(def));
  const cls = `codex-relic-slot ${isSeen ? '' : 'unseen'} ${unlocked ? '' : 'locked'}`;
  if (!isSeen) {
    return el('div', { class: cls },
      (() => { const d = el('div', { class: 'codex-relic-name' }); d.innerHTML = unlocked ? '???' : ic('lock'); return d; })(),
      el('div', { class: 'codex-relic-desc' }, unlocked ? t('미발견') : lockText),
      el('div', { class: 'codex-relic-rarity', style: { color: rarityColor } },
        t(RARITY_LABEL[def.rarity] ?? def.rarity)),
    );
  }
  const synInfo = SYNERGY_SETS.filter((s) => s.relics.includes(def.id))
    .map((s) => {
      const partner = s.relics.find((r) => r !== def.id)!;
      const partnerDef = RELIC_DEFS[partner];
      return `${ic('lightning')} ${partnerDef?.name ?? partner} → ${s.name}`;
    }).join('\n');
  const desc = unlocked
    ? (synInfo ? `${def.description}\n${synInfo}` : def.description)
    : lockText;
  return el('div', { class: cls },
    (() => { const d = el('div', { class: 'codex-relic-name' }); d.innerHTML = unlocked ? def.name : `${ic('lock')} ???`; return d; })(),
    (() => { const d = el('div', { class: 'codex-relic-desc', style: { whiteSpace: 'pre-line' } }); d.innerHTML = desc; return d; })(),
    el('div', { class: 'codex-relic-rarity', style: { color: rarityColor } },
      t(RARITY_LABEL[def.rarity] ?? def.rarity)),
  );
}

function typeLabel(tp: string): string {
  return tp === 'attack' ? t('공격') : tp === 'skill' ? t('방어') : t('효과');
}
