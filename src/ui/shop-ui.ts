import { el } from './dom';
import { t } from '../i18n';
import { kwDesc } from './keywords';
import { getRun, makeCard, setScreen, canAddCard } from '../state';
import { CARD_DEFS, getEffectiveDef } from '../content/cards';
import { RELIC_DEFS } from '../content/relics';
import { POTION_DEFS } from '../content/potions';
import { playSfx } from '../audio';
import { recordCard, recordRelic } from '../codex';
import { buildShopItems, type ShopItem } from '../run/rules';
import { RELIC_SVG, POTION_SVG, ic } from './art';

const POTION_SELL_PRICE = 25; // 구매가의 절반 이하

let shopItems: ShopItem[] | null = null;
let lastShopKey: string | null = null;

/** 상점 진열 + 본 물건을 도감에 적는다. 진열 규칙 자체는 run/rules.ts에 있다. */
function buildShop(): ShopItem[] {
  const items = buildShopItems(getRun());
  for (const item of items) {
    if (item.kind === 'card' && item.id) recordCard(item.id);
    if (item.kind === 'relic' && item.id) recordRelic(item.id);
  }
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
  const shopTitle = el('h2', {});
  shopTitle.innerHTML = `${ic('cart')} ${t('상점')}`;
  wrapper.appendChild(shopTitle);
  const goldLabel = el('div', { style: { color: 'var(--accent)', marginBottom: '8px' } });
  goldLabel.innerHTML = `${ic('gold')} ${t('보유 골드')}: ${run.player.gold}`;
  wrapper.appendChild(goldLabel);

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
    } else if (item.kind === 'potion' && item.id) {
      itemRow.appendChild(renderPotionItem(item, run, rebuild));
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
      (() => { const d = el('div', { style: { fontWeight: 'bold' } }); d.innerHTML = `${ic('trash')} ${t('카드 제거 서비스')}`; return d; })(),
      el('div', { style: { color: 'var(--muted)', fontSize: '13px' } }, t('덱에서 카드 1장을 영구 삭제합니다.')),
      el(
        'button',
        {
          disabled: removalItem.sold || !canAfford || !hasDeck ? true : undefined,
          onClick: () => {
            removalState = 'picking';
            rebuild();
          },
        },
        removalItem.sold ? t('이용 완료') : `${removalItem.price} ${t('골드')}`,
      ),
    ),
  );

  // 포션 되팔기 — 보유 포션을 절반 이하 가격에 판매
  if (run.player.potions.length > 0) {
    const sellRow = el('div', { style: { marginBottom: '20px', width: '90%', maxWidth: '480px' } });
    const sellLabel = el('div', { style: { color: 'var(--muted)', fontSize: '13px', marginBottom: '6px', textAlign: 'center' } });
    sellLabel.innerHTML = `${ic('gold')} ${t('물약 되팔기')} (${t('개당')} ${POTION_SELL_PRICE}${t('골드')})`;
    sellRow.appendChild(sellLabel);
    const potRow = el('div', { style: { display: 'flex', gap: '8px', flexWrap: 'wrap', justifyContent: 'center' } });
    run.player.potions.forEach((pid) => {
      const pdef = POTION_DEFS[pid];
      if (!pdef) return;
      potRow.appendChild(
        el('button', {
          style: { fontSize: '12px', padding: '6px 10px' },
          title: pdef.description,
          onClick: () => {
            // id 기준으로 해당 종류 1개 제거 (더블클릭 시에도 같은 종류만 안전 제거)
            const i = run.player.potions.indexOf(pid);
            if (i < 0) return;
            run.player.potions.splice(i, 1);
            run.player.gold += POTION_SELL_PRICE;
            playSfx('gold');
            rebuild();
          },
        }, `${pdef.name} → +${POTION_SELL_PRICE}`),
      );
    });
    sellRow.appendChild(potRow);
    wrapper.appendChild(sellRow);
  }

  wrapper.appendChild(
    el('button', { onClick: () => { shopItems = null; setScreen('map'); } }, t('상점 나가기')),
  );
}

function renderCardItem(item: ShopItem, run: ReturnType<typeof getRun>, rebuild: () => void): HTMLElement {
  const def = CARD_DEFS[item.id!];
  const canAfford = run.player.gold >= item.price;

  const atMax = !canAddCard(run.player.deck, def.id);
  const blocked = item.sold || !canAfford || atMax;

  return el(
    'div',
    { style: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' } },
    el(
      'div',
      {
        class: `card ${def.type} rarity-${def.rarity} ${blocked ? 'disabled' : ''}`,
        style: { cursor: blocked ? 'default' : 'pointer' },
        onClick: () => {
          if (item.sold || run.player.gold < item.price || !canAddCard(run.player.deck, def.id)) return;
          run.player.gold -= item.price;
          run.player.deck.push(makeCard(def.id));
          item.sold = true;
          playSfx('shop_buy');
          rebuild();
        },
      },
      el('div', { class: 'card-cost' }, def.cost < 0 ? 'X' : String(def.cost)),
      el('div', { class: 'card-name' }, def.name),
      el('div', { class: 'card-desc' }, kwDesc(def.description)),
      el('div', { class: 'card-type' }, typeLabel(def.type)),
    ),
    item.sold
      ? el('div', { style: { color: 'var(--muted)', fontSize: '13px' } }, t('판매 완료'))
      : atMax
        ? el('div', { style: { color: 'var(--bad)', fontSize: '13px' } }, t('최대 보유'))
        : (() => { const d = el('div', { style: { color: canAfford ? 'var(--accent)' : 'var(--bad)', fontWeight: 'bold' } }); d.innerHTML = `${ic('gold')} ${item.price}`; return d; })(),
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
    (() => { const ri = el('div', { style: { width: '32px', height: '32px' } }); const rs = RELIC_SVG[item.id!]; ri.innerHTML = rs || ic('gem'); return ri; })(),
    el('div', { style: { fontWeight: 'bold' } }, def.name),
    el('div', { style: { fontSize: '12px', color: 'var(--muted)', textAlign: 'center' } }, kwDesc(def.description)),
    item.sold || alreadyOwned
      ? el('div', { style: { color: 'var(--muted)', fontSize: '13px' } }, alreadyOwned ? t('이미 보유') : t('판매 완료'))
      : (() => { const b = el('button', {
            disabled: !canAfford ? true : undefined,
            onClick: () => {
              if (item.sold || run.player.gold < item.price) return;
              run.player.gold -= item.price;
              run.player.relics.push(def.id);
              playSfx('relic');
              item.sold = true;
              rebuild();
            },
          }); b.innerHTML = `${ic('gold')} ${item.price}`; return b; })(),
  );
}

function renderPotionItem(item: ShopItem, run: ReturnType<typeof getRun>, rebuild: () => void): HTMLElement {
  const def = POTION_DEFS[item.id!];
  const canAfford = run.player.gold >= item.price;
  const potionsFull = run.player.potions.length >= 3;
  const blocked = item.sold || potionsFull;

  return el(
    'div',
    {
      style: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '8px',
        padding: '16px',
        border: `1px solid ${blocked ? 'var(--border)' : 'var(--accent)'}`,
        borderRadius: '8px',
        minWidth: '160px',
        opacity: blocked ? '0.5' : '1',
      },
    },
    (() => { const pi = el('div', { style: { width: '28px', height: '28px' } }); const ps = POTION_SVG[item.id!]; pi.innerHTML = ps || ic('potion_small'); return pi; })(),
    el('div', { style: { fontWeight: 'bold' } }, def.name),
    el('div', { style: { fontSize: '12px', color: 'var(--muted)', textAlign: 'center' } }, kwDesc(def.description)),
    item.sold
      ? el('div', { style: { color: 'var(--muted)', fontSize: '13px' } }, t('판매 완료'))
      : potionsFull
        ? el('div', { style: { color: 'var(--muted)', fontSize: '13px' } }, t('물약 가득 (최대 3)'))
        : (() => { const b = el('button', {
              disabled: !canAfford ? true : undefined,
              onClick: () => {
                if (item.sold || run.player.potions.length >= 3 || run.player.gold < item.price) return;
                run.player.gold -= item.price;
                run.player.potions.push(def.id);
                playSfx('potion');
                item.sold = true;
                rebuild();
              },
            }); b.innerHTML = `${ic('gold')} ${item.price}`; return b; })(),
  );
}

function appendRemovalPicker(wrapper: HTMLElement, run: ReturnType<typeof getRun>, rebuild: () => void): void {
  wrapper.appendChild(
    el('div', { style: { color: 'var(--muted)', marginBottom: '12px' } }, t('제거할 카드를 선택하세요')),
  );

  const cardRow = el('div', {
    style: { display: 'flex', flexWrap: 'wrap', gap: '10px', justifyContent: 'center', maxWidth: '800px', maxHeight: '380px', overflowY: 'auto', padding: '8px' },
  });

  for (const card of run.player.deck) {
    const def = getEffectiveDef(card);
    const upgraded = (card.upgraded ?? 0) >= 1;
    const upgradedPlus = (card.upgraded ?? 0) >= 2;
    cardRow.appendChild(
      el(
        'div',
        {
          class: `card ${def.type} rarity-${def.rarity} ${upgraded ? 'upgraded' : ''} ${upgradedPlus ? 'upgraded-plus' : ''}`,
          style: { cursor: 'pointer' },
          onClick: () => {
            const removal = shopItems!.find((i) => i.kind === 'removal')!;
            if (removal.sold || removalState !== 'picking') return;
            const idx = run.player.deck.findIndex((c) => c.uid === card.uid);
            if (idx < 0) return;
            if (run.player.gold < removal.price) return;
            run.player.gold -= removal.price;
            run.player.deck.splice(idx, 1);
            removal.sold = true;
            removalState = 'none';
            rebuild();
          },
        },
        el('div', { class: 'card-cost' }, def.cost < 0 ? 'X' : String(def.cost)),
        el('div', { class: 'card-name' }, def.name),
        el('div', { class: 'card-desc' }, kwDesc(def.description)),
        el('div', { class: 'card-type' }, typeLabel(def.type)),
      ),
    );
  }

  wrapper.appendChild(cardRow);
  wrapper.appendChild(
    el('button', { style: { marginTop: '16px' }, onClick: () => { removalState = 'none'; rebuild(); } }, t('← 취소')),
  );
}

function typeLabel(tp: string): string {
  if (tp === 'attack') return t('공격');
  if (tp === 'skill') return t('방어');
  return t('효과');
}
