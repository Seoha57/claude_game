import { el } from './dom';
import { t } from '../i18n';
import { showMiniTutorial } from './tutorial-overlay';
import { getRun, makeCard, setScreen, rerender, canAddCard } from '../state';
import { CARD_DEFS } from '../content/cards';
import { kwDesc } from './keywords';

import { RELIC_DEFS } from '../content/relics';
import { rollReward, rerollRewardCards } from '../run/rules';
import { nodeById } from '../map/map';
import { playSfx } from '../audio';
import { recordCards, recordRelic } from '../codex';

const REROLL_COSTS = [10, 15, 25, 40, 60];

interface RewardChoiceUI {
  cardChoices: string[];
  gold: number;
  relicId: string | null;
  picked: boolean;
  rerollCount: number;
}

let cachedReward: RewardChoiceUI | null = null;
let lastRewardKey: string | null = null;

function rerollCards(): void {
  if (!cachedReward) return;
  const run = getRun();
  const cost = REROLL_COSTS[Math.min(cachedReward.rerollCount, REROLL_COSTS.length - 1)];
  if (run.player.gold < cost) return;
  run.player.gold -= cost;
  cachedReward.rerollCount++;

  const cur = run.currentNodeId ? nodeById(run.map, run.currentNodeId) : null;
  cachedReward.cardChoices = rerollRewardCards(run, cur?.kind === 'elite', cachedReward.rerollCount);
  cachedReward.picked = false;
  recordCards(cachedReward.cardChoices);
  rerender();
}

function ensureReward(): RewardChoiceUI {
  const run = getRun();
  // 노드 ID(n_5_0)는 런/챕터 간 반복되므로 seed+chapter+floor를 합쳐
  // 고유 캐시 키를 만든다. (이전: 노드 ID만 → 새 런에서 stale 보상 노출)
  const key = `${run.seed}_${run.chapter}_${run.currentNodeId}`;
  if (cachedReward && lastRewardKey === key) return cachedReward;
  lastRewardKey = key;
  const cur = run.currentNodeId ? nodeById(run.map, run.currentNodeId) : null;
  const { cardChoices: choices, gold, relicId } = rollReward(run, cur?.kind === 'elite');

  cachedReward = { cardChoices: choices, gold, relicId, picked: false, rerollCount: 0 };
  // Codex: shown card choices + relic option
  recordCards(choices);
  if (relicId) recordRelic(relicId);
  return cachedReward;
}

export function renderReward(): HTMLElement {
  const run = getRun();
  const reward = ensureReward();

  const cardsRow = el('div', { class: 'reward-cards' });
  const deckDefIds = new Set(run.player.deck.map((c) => c.defId));
  for (const id of reward.cardChoices) {
    const def = CARD_DEFS[id];
    const atMax = !canAddCard(run.player.deck, def.id);
    const inDeck = deckDefIds.has(id);
    const deckCount = inDeck ? run.player.deck.filter((c) => c.defId === id).length : 0;
    const flipContainer = el('div', { class: 'card-flip-container' });
    const cardEl = el(
      'div',
      {
        class: `card ${def.type} rarity-${def.rarity} ${atMax ? 'disabled' : ''}`,
        style: atMax ? { cursor: 'default' } : {},
        onClick: () => {
          if (reward.picked || atMax) return;
          reward.picked = true;
          run.player.deck.push(makeCard(def.id));
          close();
        },
      },
      el('div', { class: 'card-cost' }, def.cost < 0 ? 'X' : String(def.cost)),
      el('div', { class: 'card-name' }, def.name),
      el('div', { class: 'card-desc' }, kwDesc(def.description)),
      el('div', { class: 'card-type' }, typeLabel(def.type)),
      ...(atMax ? [el('div', { style: { color: 'var(--bad)', fontSize: '11px', marginTop: '4px' } }, t('최대 보유'))] : []),
      ...(inDeck && !atMax ? [el('div', { style: { color: 'var(--muted)', fontSize: '11px', marginTop: '4px' } }, `${t('덱에')} ${deckCount}${t('장 보유')}`)] : []),
    );
    flipContainer.appendChild(cardEl);
    cardsRow.appendChild(flipContainer);
  }

  // gold is auto-added on entry
  if (!(reward as any)._goldGiven) {
    run.player.gold += reward.gold;
    (reward as any)._goldGiven = true;
  }

  const relicEl = reward.relicId
    ? (() => {
        const def = RELIC_DEFS[reward.relicId!];
        return el(
          'button',
          {
            onClick: () => {
              if (!run.player.relics.includes(def.id)) {
                run.player.relics.push(def.id);
                playSfx('relic');
                flashRelicAcquire();
              }
              (reward as any)._relicTaken = true;
              close();
            },
            disabled: (reward as any)._relicTaken ? true : undefined,
          },
          `${t('유물 획득')}: ${def.name} — ${def.description}`,
        );
      })()
    : null;

  requestAnimationFrame(() => {
    showMiniTutorial('dod_tut_reward', [
      {
        target: '.reward-cards',
        title: t('보상 카드'),
        text: t('3장 중 1장을 선택해 덱에 추가하세요. 필요 없다면 건너뛰기도 전략입니다!'),
        position: 'top',
      },
    ]);
  });

  return el(
    'div',
    { class: 'reward-screen' },
    el('h2', {}, t('보상')),
    el('div', { style: { color: 'var(--accent)' } }, `${t('골드')} +${reward.gold} (${t('자동 획득')})`),
    relicEl ?? el('div'),
    el('div', { style: { color: 'var(--muted)', fontSize: '13px' } }, t('카드 1장 선택 또는 건너뛰기')),
    cardsRow,
    (() => {
      const cost = REROLL_COSTS[Math.min(reward.rerollCount, REROLL_COSTS.length - 1)];
      const canAfford = run.player.gold >= cost;
      return el('div', { style: { display: 'flex', alignItems: 'center', gap: '10px', justifyContent: 'center' } },
        el('button', {
          style: {
            background: 'transparent',
            color: canAfford ? 'var(--accent)' : 'var(--muted)',
            border: `1px solid ${canAfford ? 'var(--accent)' : 'var(--border)'}`,
            fontSize: '13px', padding: '8px 16px',
            cursor: canAfford ? 'pointer' : 'default',
            opacity: canAfford ? '1' : '0.5',
          },
          onClick: () => { if (!reward.picked && canAfford) rerollCards(); },
        }, `🔄 ${t('카드 리롤')} (${cost}G)`),
        el('span', { style: { color: 'var(--muted)', fontSize: '12px' } }, `${t('보유')}: ${run.player.gold}G`),
      );
    })(),
    el(
      'button',
      {
        onClick: () => {
          reward.picked = true;
          close();
        },
      },
      t('건너뛰기'),
    ),
  );
}

function flashRelicAcquire(): void {
  const flash = document.createElement('div');
  flash.className = 'relic-flash';
  document.body.appendChild(flash);
  flash.addEventListener('animationend', () => flash.remove());
}

function close(): void {
  cachedReward = null;
  lastRewardKey = null;
  setScreen('map');
}

function typeLabel(tp: string): string {
  if (tp === 'attack') return t('공격');
  if (tp === 'skill') return t('방어');
  return t('효과');
}
