import { el } from './dom';
import { getRun, makeCard, setScreen } from '../state';
import { COMMON_CARDS, UNCOMMON_CARDS, RARE_CARDS, CARD_DEFS, GUNNER_COMMON_CARDS, GUNNER_UNCOMMON_CARDS, GUNNER_RARE_CARDS, FIGHTER_COMMON_CARDS, FIGHTER_UNCOMMON_CARDS, FIGHTER_RARE_CARDS, MAGICIAN_COMMON_CARDS, MAGICIAN_UNCOMMON_CARDS, MAGICIAN_RARE_CARDS, PRIEST_COMMON_CARDS, PRIEST_UNCOMMON_CARDS, PRIEST_RARE_CARDS, THIEF_COMMON_CARDS, THIEF_UNCOMMON_CARDS, THIEF_RARE_CARDS } from '../content/cards';
import { isCardUnlocked, isRelicUnlocked } from '../unlocks';
import type { CardDef } from '../types';

function filterUnlocked(pool: CardDef[], ignoreLocks: boolean): CardDef[] {
  if (ignoreLocks) return pool;
  const out = pool.filter((c) => isCardUnlocked(c));
  return out.length > 0 ? out : pool; // 모두 잠겨있을 때 fallback
}
import { PICKABLE_RELICS, ELITE_RELICS, RELIC_DEFS } from '../content/relics';
import { nodeById } from '../map/map';
import { makeRng, pick, shuffle } from '../rng';
import { playSfx } from '../audio';
import { recordCards, recordRelic } from '../codex';

interface RewardChoiceUI {
  cardChoices: string[];
  gold: number;
  relicId: string | null;
  picked: boolean;
}

let cachedReward: RewardChoiceUI | null = null;
let lastRewardKey: string | null = null;

function ensureReward(): RewardChoiceUI {
  const run = getRun();
  // 노드 ID(n_5_0)는 런/챕터 간 반복되므로 seed+chapter+floor를 합쳐
  // 고유 캐시 키를 만든다. (이전: 노드 ID만 → 새 런에서 stale 보상 노출)
  const key = `${run.seed}_${run.chapter}_${run.currentNodeId}`;
  if (cachedReward && lastRewardKey === key) return cachedReward;
  lastRewardKey = key;
  const cur = run.currentNodeId ? nodeById(run.map, run.currentNodeId) : null;
  const isElite = cur?.kind === 'elite';
  const rng = makeRng(run.seed * 7 + (run.floor + 1) * 91);

  const cc = run.characterClass;
  // 데일리 챌린지는 잠금 무시 — 모두 같은 풀
  const ignoreLocks = !!run.dailyConfig;
  const commonPool   = filterUnlocked(
    cc === 'gunner'  ? GUNNER_COMMON_CARDS
    : cc === 'fighter' ? FIGHTER_COMMON_CARDS
    : cc === 'magician'? MAGICIAN_COMMON_CARDS
    : cc === 'priest' ? PRIEST_COMMON_CARDS
    : cc === 'thief' ? THIEF_COMMON_CARDS
    : COMMON_CARDS,
    ignoreLocks,
  );
  const uncommonPool = filterUnlocked(
    cc === 'gunner'  ? GUNNER_UNCOMMON_CARDS
    : cc === 'fighter' ? FIGHTER_UNCOMMON_CARDS
    : cc === 'magician'? MAGICIAN_UNCOMMON_CARDS
    : cc === 'priest' ? PRIEST_UNCOMMON_CARDS
    : cc === 'thief' ? THIEF_UNCOMMON_CARDS
    : UNCOMMON_CARDS,
    ignoreLocks,
  );
  const rarePool     = filterUnlocked(
    cc === 'gunner'  ? GUNNER_RARE_CARDS
    : cc === 'fighter' ? FIGHTER_RARE_CARDS
    : cc === 'magician'? MAGICIAN_RARE_CARDS
    : cc === 'priest' ? PRIEST_RARE_CARDS
    : cc === 'thief' ? THIEF_RARE_CARDS
    : RARE_CARDS,
    ignoreLocks,
  );

  // pool: 60% common, 35% uncommon, 5% rare on regular; elite shifts toward rare
  const choices: string[] = [];
  for (let i = 0; i < 3; i++) {
    const r = rng();
    let pool = commonPool;
    if (isElite) {
      if (r < 0.4) pool = commonPool;
      else if (r < 0.85) pool = uncommonPool;
      else pool = rarePool;
    } else {
      if (r < 0.6) pool = commonPool;
      else if (r < 0.95) pool = uncommonPool;
      else pool = rarePool;
    }
    const tries = shuffle(rng, pool.slice());
    let picked = tries[0]?.id;
    for (const c of tries) {
      if (!choices.includes(c.id)) {
        picked = c.id;
        break;
      }
    }
    if (picked) choices.push(picked);
  }

  const gold = isElite ? 25 + Math.floor(rng() * 10) : 10 + Math.floor(rng() * 10);
  let relicId: string | null = null;
  if (isElite) {
    const classRelics = ELITE_RELICS.filter((r) => !r.forClass || r.forClass === run.characterClass);
    const unowned = classRelics.filter((r) => !run.player.relics.includes(r.id));
    if (unowned.length > 0) {
      relicId = pick(rng, unowned).id;
    } else {
      const unlockedRelics = ignoreLocks ? PICKABLE_RELICS : PICKABLE_RELICS.filter((r) => isRelicUnlocked(r));
      const pool = unlockedRelics.length > 0 ? unlockedRelics : PICKABLE_RELICS;
      const fallback = pool.filter((r) => !run.player.relics.includes(r.id));
      if (fallback.length > 0) relicId = pick(rng, fallback).id;
    }
  }

  cachedReward = { cardChoices: choices, gold, relicId, picked: false };
  // Codex: shown card choices + relic option
  recordCards(choices);
  if (relicId) recordRelic(relicId);
  return cachedReward;
}

export function renderReward(): HTMLElement {
  const run = getRun();
  const reward = ensureReward();

  const cardsRow = el('div', { class: 'reward-cards' });
  for (const id of reward.cardChoices) {
    const def = CARD_DEFS[id];
    cardsRow.appendChild(
      el(
        'div',
        {
          class: `card ${def.type} rarity-${def.rarity}`,
          onClick: () => {
            if (reward.picked) return;
            reward.picked = true;
            run.player.deck.push(makeCard(def.id));
            close();
          },
        },
        el('div', { class: 'card-cost' }, String(def.cost)),
        el('div', { class: 'card-name' }, def.name),
        el('div', { class: 'card-desc' }, def.description),
        el('div', { class: 'card-type' }, typeLabel(def.type)),
      ),
    );
  }

  const goldBtn = el(
    'button',
    {
      onClick: () => {
        if (!reward.picked) {
          run.player.gold += reward.gold;
        }
      },
      style: { fontSize: '14px' },
    },
    `골드 +${reward.gold} 받기`,
  );
  // gold is auto-added on entry — simpler: do it here
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
              }
              (reward as any)._relicTaken = true;
              close();
            },
            disabled: (reward as any)._relicTaken ? true : undefined,
          },
          `유물 획득: ${def.name} — ${def.description}`,
        );
      })()
    : null;

  return el(
    'div',
    { class: 'reward-screen' },
    el('h2', {}, '보상'),
    el('div', { style: { color: 'var(--accent)' } }, `골드 +${reward.gold} (자동 획득)`),
    relicEl ?? el('div'),
    el('div', { style: { color: 'var(--muted)', fontSize: '13px' } }, '카드 1장 선택 또는 건너뛰기'),
    cardsRow,
    el(
      'button',
      {
        onClick: () => {
          reward.picked = true;
          close();
        },
      },
      '건너뛰기',
    ),
    // Hidden — keep var used
    el('div', { style: { display: 'none' } }, goldBtn),
  );
}

function close(): void {
  cachedReward = null;
  lastRewardKey = null;
  setScreen('map');
}

function typeLabel(t: string): string {
  if (t === 'attack') return '공격';
  if (t === 'skill') return '스킬';
  return '파워';
}
