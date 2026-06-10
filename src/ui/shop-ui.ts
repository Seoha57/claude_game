import { el } from './dom';
import { getRun, makeCard, setScreen } from '../state';
import { COMMON_CARDS, UNCOMMON_CARDS, RARE_CARDS, CARD_DEFS, GUNNER_COMMON_CARDS, GUNNER_UNCOMMON_CARDS, GUNNER_RARE_CARDS, FIGHTER_COMMON_CARDS, FIGHTER_UNCOMMON_CARDS, FIGHTER_RARE_CARDS, MAGICIAN_COMMON_CARDS, MAGICIAN_UNCOMMON_CARDS, MAGICIAN_RARE_CARDS, PRIEST_COMMON_CARDS, PRIEST_UNCOMMON_CARDS, PRIEST_RARE_CARDS, THIEF_COMMON_CARDS, THIEF_UNCOMMON_CARDS, THIEF_RARE_CARDS } from '../content/cards';
import { PICKABLE_RELICS, RELIC_DEFS } from '../content/relics';
import { makeRng, shuffle } from '../rng';
import { getModifiers } from '../ascension';
import { playSfx } from '../audio';
import { recordCard, recordRelic } from '../codex';
import { isCardUnlocked, isRelicUnlocked } from '../unlocks';

const BASE_CARD_PRICE: Record<string, number> = { common: 50, uncommon: 75, rare: 125 };
const BASE_RELIC_PRICE = 150;
const BASE_REMOVAL_PRICE = 75;

function scaledPrice(base: number, mult: number): number {
  return Math.round(base * mult);
}

interface ShopItem {
  kind: 'card' | 'relic' | 'removal';
  id?: string;
  price: number;
  sold: boolean;
}

let shopItems: ShopItem[] | null = null;
let lastShopKey: string | null = null;

function buildShop(): ShopItem[] {
  const run = getRun();
  const rng = makeRng(run.seed * 13 + run.floor * 37 + 1);
  const mult = getModifiers(run.ascension).shopPriceMult;

  const items: ShopItem[] = [];
  const cc = run.characterClass;
  const ignoreLocks = !!run.dailyConfig;
  const unlockFilter = <T extends { id: string; rarity?: any }>(pool: T[]) => {
    if (ignoreLocks) return pool;
    const out = pool.filter((c) => isCardUnlocked(c as any));
    return out.length > 0 ? out : pool;
  };

  // 3 cards: 1 common, 1 uncommon, 1 rare (floor-weighted)
  const pools =
    cc === 'gunner'   ? [GUNNER_COMMON_CARDS,   GUNNER_UNCOMMON_CARDS,   GUNNER_RARE_CARDS] :
    cc === 'fighter'  ? [FIGHTER_COMMON_CARDS,  FIGHTER_UNCOMMON_CARDS,  FIGHTER_RARE_CARDS] :
    cc === 'magician' ? [MAGICIAN_COMMON_CARDS, MAGICIAN_UNCOMMON_CARDS, MAGICIAN_RARE_CARDS] :
    cc === 'priest'   ? [PRIEST_COMMON_CARDS,   PRIEST_UNCOMMON_CARDS,   PRIEST_RARE_CARDS] :
    cc === 'thief'    ? [THIEF_COMMON_CARDS,    THIEF_UNCOMMON_CARDS,    THIEF_RARE_CARDS] :
                        [COMMON_CARDS,          UNCOMMON_CARDS,          RARE_CARDS];
  const picked = new Set<string>();
  for (const pool of pools.map(unlockFilter)) {
    const candidates = shuffle(rng, pool.slice());
    const card = candidates.find((c) => !picked.has(c.id));
    if (card) {
      picked.add(card.id);
      items.push({ kind: 'card', id: card.id, price: scaledPrice(BASE_CARD_PRICE[card.rarity] ?? 50, mult), sold: false });
      recordCard(card.id);
    }
  }

  // 1 relic
  const relicSource = ignoreLocks ? PICKABLE_RELICS : PICKABLE_RELICS.filter((r) => isRelicUnlocked(r));
  const relicPool = relicSource.length > 0 ? relicSource : PICKABLE_RELICS;
  const relicCandidates = shuffle(rng, relicPool.slice());
  const relic = relicCandidates.find((r) => !run.player.relics.includes(r.id));
  if (relic) {
    items.push({ kind: 'relic', id: relic.id, price: scaledPrice(BASE_RELIC_PRICE, mult), sold: false });
    recordRelic(relic.id);
  }

  // card removal service
  items.push({ kind: 'removal', price: scaledPrice(BASE_REMOVAL_PRICE, mult), sold: false });

  return items;
}

type RemovalState = 'none' | 'picking';
let removalState: RemovalState = 'none';

export function renderShop(): HTMLElement {
  const run = getRun();

  // 노드 ID는 런/챕터 간 반복되므로 seed+chapter 포함한 고유 키 사용
  const shopKey = `${run.seed}_${run.chapter}_${run.currentNodeId}`;
  if (!shopItems || lastShopKey !== shopKey) {
    shopItems = buildShop();
    lastShopKey = shopKey;
    removalState = 'none';
  }

  const wrapper = el('div', { class: 'reward-screen' });
  const rebuild = () => {
    wrapper.innerHTML = '';
    appendShopContent(wrapper, run, rebuild);
  };
  appendShopContent(wrapper, run, rebuild);
  return wrapper;
}

function appendShopContent(wrapper: HTMLElement, run: ReturnType<typeof getRun>, rebuild: () => void): void {
  wrapper.appendChild(el('h2', {}, '🛒 상점'));
  wrapper.appendChild(
    el('div', { style: { color: 'var(--accent)', marginBottom: '8px' } }, `💰 보유 골드: ${run.player.gold}`),
  );

  if (removalState === 'picking') {
    appendRemovalPicker(wrapper, run, rebuild);
    return;
  }

  // Cards + Relic row
  const itemRow = el('div', { style: { display: 'flex', gap: '16px', flexWrap: 'wrap', justifyContent: 'center', marginBottom: '24px' } });
  for (const item of shopItems!) {
    if (item.kind === 'card' && item.id) {
      itemRow.appendChild(renderCardItem(item, run, rebuild));
    } else if (item.kind === 'relic' && item.id) {
      itemRow.appendChild(renderRelicItem(item, run, rebuild));
    }
  }
  wrapper.appendChild(itemRow);

  // Removal service
  const removalItem = shopItems!.find((i) => i.kind === 'removal')!;
  const canAfford = run.player.gold >= removalItem.price;
  const hasDeck = run.player.deck.length > 1; // 마지막 카드는 제거 불가 (빈 덱 방지)
  wrapper.appendChild(
    el(
      'div',
      { style: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', padding: '16px', border: '1px solid var(--border)', borderRadius: '8px', marginBottom: '24px' } },
      el('div', { style: { fontWeight: 'bold' } }, '🗑 카드 제거 서비스'),
      el('div', { style: { color: 'var(--muted)', fontSize: '13px' } }, '덱에서 카드 1장을 영구 삭제합니다.'),
      el(
        'button',
        {
          disabled: removalItem.sold || !canAfford || !hasDeck ? true : undefined,
          onClick: () => {
            removalState = 'picking';
            rebuild();
          },
        },
        removalItem.sold ? '이용 완료' : `${removalItem.price} 골드`,
      ),
    ),
  );

  wrapper.appendChild(
    el('button', { onClick: () => { shopItems = null; setScreen('map'); } }, '상점 나가기'),
  );
}

function renderCardItem(item: ShopItem, run: ReturnType<typeof getRun>, rebuild: () => void): HTMLElement {
  const def = CARD_DEFS[item.id!];
  const canAfford = run.player.gold >= item.price;

  return el(
    'div',
    { style: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' } },
    el(
      'div',
      {
        class: `card ${def.type} rarity-${def.rarity} ${item.sold || !canAfford ? 'disabled' : ''}`,
        style: { cursor: item.sold || !canAfford ? 'default' : 'pointer' },
        onClick: () => {
          // 클릭 시점의 라이브 골드/판매 상태로 재확인 (더블클릭/stale 방어)
          if (item.sold || run.player.gold < item.price) return;
          run.player.gold -= item.price;
          run.player.deck.push(makeCard(def.id));
          item.sold = true;
          rebuild();
        },
      },
      el('div', { class: 'card-cost' }, String(def.cost)),
      el('div', { class: 'card-name' }, def.name),
      el('div', { class: 'card-desc' }, def.description),
      el('div', { class: 'card-type' }, typeLabel(def.type)),
    ),
    item.sold
      ? el('div', { style: { color: 'var(--muted)', fontSize: '13px' } }, '판매 완료')
      : el(
          'div',
          { style: { color: canAfford ? 'var(--accent)' : 'var(--bad)', fontWeight: 'bold' } },
          `💰 ${item.price}`,
        ),
  );
}

function renderRelicItem(item: ShopItem, run: ReturnType<typeof getRun>, rebuild: () => void): HTMLElement {
  const def = RELIC_DEFS[item.id!];
  const canAfford = run.player.gold >= item.price;
  const alreadyOwned = run.player.relics.includes(def.id);

  return el(
    'div',
    {
      style: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '8px',
        padding: '16px',
        border: `1px solid ${item.sold || alreadyOwned ? 'var(--border)' : 'var(--accent)'}`,
        borderRadius: '8px',
        minWidth: '160px',
        opacity: item.sold || alreadyOwned ? '0.5' : '1',
      },
    },
    el('div', { style: { fontSize: '13px', color: 'var(--muted)' } }, '유물'),
    el('div', { style: { fontWeight: 'bold' } }, def.name),
    el('div', { style: { fontSize: '12px', color: 'var(--muted)', textAlign: 'center' } }, def.description),
    item.sold || alreadyOwned
      ? el('div', { style: { color: 'var(--muted)', fontSize: '13px' } }, alreadyOwned ? '이미 보유' : '판매 완료')
      : el(
          'button',
          {
            disabled: !canAfford ? true : undefined,
            onClick: () => {
              if (item.sold || run.player.gold < item.price) return;
              run.player.gold -= item.price;
              run.player.relics.push(def.id);
              playSfx('relic');
              item.sold = true;
              rebuild();
            },
          },
          `💰 ${item.price}`,
        ),
  );
}

function appendRemovalPicker(wrapper: HTMLElement, run: ReturnType<typeof getRun>, rebuild: () => void): void {
  wrapper.appendChild(
    el('div', { style: { color: 'var(--muted)', marginBottom: '12px' } }, '제거할 카드를 선택하세요'),
  );

  const cardRow = el('div', {
    style: { display: 'flex', flexWrap: 'wrap', gap: '10px', justifyContent: 'center', maxWidth: '800px', maxHeight: '380px', overflowY: 'auto', padding: '8px' },
  });

  for (const card of run.player.deck) {
    const def = CARD_DEFS[card.defId];
    cardRow.appendChild(
      el(
        'div',
        {
          class: `card ${def.type} rarity-${def.rarity}`,
          style: { cursor: 'pointer' },
          onClick: () => {
            const removal = shopItems!.find((i) => i.kind === 'removal')!;
            // 더블클릭/stale 방어: 이미 사용했거나, 픽 모드가 아니거나,
            // 카드가 덱에 없으면(이미 제거됨) 무시
            if (removal.sold || removalState !== 'picking') return;
            const idx = run.player.deck.findIndex((c) => c.uid === card.uid);
            if (idx < 0) return;
            run.player.gold -= removal.price;
            run.player.deck.splice(idx, 1);
            removal.sold = true;
            removalState = 'none';
            rebuild();
          },
        },
        el('div', { class: 'card-cost' }, String(def.cost)),
        el('div', { class: 'card-name' }, def.name),
        el('div', { class: 'card-desc' }, def.description),
        el('div', { class: 'card-type' }, typeLabel(def.type)),
      ),
    );
  }

  wrapper.appendChild(cardRow);
  wrapper.appendChild(
    el('button', { style: { marginTop: '16px' }, onClick: () => { removalState = 'none'; rebuild(); } }, '← 취소'),
  );
}

function typeLabel(t: string): string {
  if (t === 'attack') return '공격';
  if (t === 'skill') return '스킬';
  return '파워';
}
