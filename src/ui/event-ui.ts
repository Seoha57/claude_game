import { el } from './dom';
import { getRun, setScreen, makeCard, canAddCard } from '../state';
import { EVENT_DEFS } from '../content/events';
import type { EventEffect, EventChoice } from '../content/events';
import { POTION_LIST } from '../content/potions';
import { isCardUnlocked, isRelicUnlocked } from '../unlocks';
import { makeRng, pick, shuffle } from '../rng';
import { PICKABLE_RELICS } from '../content/relics';
import { playSfx } from '../audio';
import { recordCard, recordRelic } from '../codex';
import {
  COMMON_CARDS,
  UNCOMMON_CARDS,
  RARE_CARDS,
  GUNNER_COMMON_CARDS,
  GUNNER_UNCOMMON_CARDS,
  GUNNER_RARE_CARDS,
  FIGHTER_COMMON_CARDS,
  FIGHTER_UNCOMMON_CARDS,
  FIGHTER_RARE_CARDS,
  MAGICIAN_COMMON_CARDS,
  MAGICIAN_UNCOMMON_CARDS,
  MAGICIAN_RARE_CARDS,
  PRIEST_COMMON_CARDS,
  PRIEST_UNCOMMON_CARDS,
  PRIEST_RARE_CARDS,
  THIEF_COMMON_CARDS,
  THIEF_UNCOMMON_CARDS,
  THIEF_RARE_CARDS,
  canUpgrade,
} from '../content/cards';

// 이벤트 해결 상태를 모듈 레벨에 보존. 선택 도중 외부 render()
// (예: 백그라운드 sync) 가 발생해도 선택지가 다시 떠서 효과가
// 중복 적용되는 것을 방지한다. 노드별로 고유 키 사용.
let resolvedEventKey: string | null = null;
let resolvedEventText: string | null = null;

export function renderEvent(): HTMLElement {
  const run = getRun();
  const rng = makeRng(run.seed * 53 + run.floor * 17);
  const eventDef = pick(rng, EVENT_DEFS);

  const eventKey = `${run.seed}_${run.chapter}_${run.currentNodeId}`;
  // 이미 해결된 이벤트면 결과 화면부터 시작
  let resultText: string | null = resolvedEventKey === eventKey ? resolvedEventText : null;

  const wrapper = el('div', { class: `event-screen mood-${eventDef.mood ?? 'mystic'}` });
  const rebuild = () => {
    while (wrapper.firstChild) wrapper.removeChild(wrapper.firstChild);
    appendContent();
  };

  const appendContent = () => {
    // Hero section with emoji + title
    const hero = el('div', { class: 'event-hero' });
    hero.appendChild(el('div', { class: 'event-emoji' }, eventDef.emoji));
    hero.appendChild(el('h2', { class: 'event-title' }, eventDef.title));
    wrapper.appendChild(hero);

    // Description in a flavor panel
    wrapper.appendChild(
      el('div', { class: 'event-description' }, eventDef.description),
    );

    if (resultText !== null) {
      wrapper.appendChild(
        el('div', { class: 'event-result' }, resultText),
      );
      wrapper.appendChild(
        el('button', {
          class: 'event-continue',
          onClick: () => setScreen('map'),
        }, '지도로 돌아가기'),
      );
      return;
    }

    const choicesEl = el('div', { class: 'event-choices' });
    for (const choice of eventDef.choices) {
      choicesEl.appendChild(buildChoiceButton(choice));
    }
    wrapper.appendChild(choicesEl);
  };

  function buildChoiceButton(choice: EventChoice): HTMLElement {
    const disabled = isChoiceDisabled(choice);
    const tone = choiceTone(choice);
    const btn = el(
      'button',
      {
        class: `event-choice tone-${tone} ${disabled ? 'disabled' : ''}`,
        disabled: disabled ? true : undefined,
        onClick: () => {
          if (disabled) return;
          // 이미 해결된 이벤트면 재적용 방지
          if (resolvedEventKey === eventKey) return;
          applyEffects(choice.effects);
          resultText = choice.result;
          resolvedEventKey = eventKey;
          resolvedEventText = choice.result;
          rebuild();
        },
      },
      el('div', { class: 'choice-label' }, choice.label),
    );

    // Effect preview chips
    const chips = renderEffectChips(choice.effects);
    if (chips) btn.appendChild(chips);

    return btn;
  }

  function isChoiceDisabled(choice: EventChoice): boolean {
    if (!choice.condition) return false;
    const cond = choice.condition;
    if (cond.kind === 'min_gold') {
      return run.player.gold < cond.amount;
    }
    return false;
  }

  function applyEffects(effects: EventEffect[]): void {
    for (const effect of effects) {
      switch (effect.kind) {
        case 'heal':
          run.player.hp = Math.min(run.player.maxHp, run.player.hp + effect.amount);
          break;
        case 'lose_hp':
          run.player.hp = Math.max(1, run.player.hp - effect.amount);
          break;
        case 'gold':
          run.player.gold += effect.amount;
          playSfx('gold');
          break;
        case 'lose_gold':
          run.player.gold = Math.max(0, run.player.gold - effect.amount);
          break;
        case 'add_curse': {
          const cursePool = ['wound', 'decay', 'parasite', 'doubt'];
          for (let i = 0; i < effect.count; i++) {
            const id = cursePool[Math.floor(rng() * cursePool.length)];
            run.player.deck.push(makeCard(id));
          }
          break;
        }
        case 'upgrade_random': {
          // Prefer fresh (non-upgraded) cards; if none, upgrade + cards to ++.
          const fresh = run.player.deck.filter((c) => canUpgrade(c) && !c.upgraded);
          const plus = run.player.deck.filter((c) => canUpgrade(c) && c.upgraded === 1);
          const pool = fresh.length > 0 ? fresh : plus;
          const toUpgrade = shuffle(rng, pool.slice()).slice(0, effect.count);
          for (const card of toUpgrade) {
            card.upgraded = (card.upgraded ?? 0) + 1;
          }
          if (toUpgrade.length > 0) playSfx('upgrade');
          break;
        }
        case 'add_random_relic': {
          const ignoreLocks = !!run.dailyConfig;
          const allowed = ignoreLocks ? PICKABLE_RELICS : PICKABLE_RELICS.filter((r) => isRelicUnlocked(r));
          const source = allowed.length > 0 ? allowed : PICKABLE_RELICS;
          const unowned = source.filter((r) => !run.player.relics.includes(r.id));
          if (unowned.length > 0) {
            const chosen = pick(rng, unowned);
            run.player.relics.push(chosen.id);
            recordRelic(chosen.id);
            playSfx('relic');
          }
          break;
        }
        case 'add_card': {
          const pool = poolFor(effect.rarity).filter((c) => canAddCard(run.player.deck, c.id));
          if (pool.length > 0) {
            const chosen = pick(rng, pool);
            run.player.deck.push(makeCard(chosen.id));
            recordCard(chosen.id);
          }
          break;
        }
        case 'add_potion': {
          if (run.player.potions.length < 3) {
            const chosen = pick(rng, POTION_LIST);
            run.player.potions.push(chosen.id);
            playSfx('potion');
          }
          break;
        }
        case 'max_hp': {
          run.player.maxHp = Math.max(1, run.player.maxHp + effect.amount);
          run.player.hp = Math.max(1, Math.min(run.player.maxHp, run.player.hp + effect.amount));
          break;
        }
        case 'add_blessing': {
          const blessings = ['divine_strike', 'divine_shield', 'miracle'];
          for (let i = 0; i < effect.count; i++) {
            const available = blessings.filter((b) => canAddCard(run.player.deck, b));
            if (available.length === 0) break;
            const id = available[Math.floor(rng() * available.length)];
            run.player.deck.push(makeCard(id));
          }
          playSfx('upgrade');
          break;
        }
      }
    }
  }

  function poolFor(rarity: 'common' | 'uncommon' | 'rare'): { id: string }[] {
    const cls = run.characterClass;
    const ignoreLocks = !!run.dailyConfig;
    let pool: any[];
    if (cls === 'gunner') {
      pool = rarity === 'common' ? GUNNER_COMMON_CARDS : rarity === 'uncommon' ? GUNNER_UNCOMMON_CARDS : GUNNER_RARE_CARDS;
    } else if (cls === 'fighter') {
      pool = rarity === 'common' ? FIGHTER_COMMON_CARDS : rarity === 'uncommon' ? FIGHTER_UNCOMMON_CARDS : FIGHTER_RARE_CARDS;
    } else if (cls === 'magician') {
      pool = rarity === 'common' ? MAGICIAN_COMMON_CARDS : rarity === 'uncommon' ? MAGICIAN_UNCOMMON_CARDS : MAGICIAN_RARE_CARDS;
    } else if (cls === 'priest') {
      pool = rarity === 'common' ? PRIEST_COMMON_CARDS : rarity === 'uncommon' ? PRIEST_UNCOMMON_CARDS : PRIEST_RARE_CARDS;
    } else if (cls === 'thief') {
      pool = rarity === 'common' ? THIEF_COMMON_CARDS : rarity === 'uncommon' ? THIEF_UNCOMMON_CARDS : THIEF_RARE_CARDS;
    } else {
      pool = rarity === 'common' ? COMMON_CARDS : rarity === 'uncommon' ? UNCOMMON_CARDS : RARE_CARDS;
    }
    if (ignoreLocks) return pool;
    const filtered = pool.filter((c) => isCardUnlocked(c));
    return filtered.length > 0 ? filtered : pool;
  }

  appendContent();
  return wrapper;
}

// ── Choice helpers ──────────────────────────────────────────────

type ChoiceTone = 'positive' | 'risky' | 'neutral';

function choiceTone(choice: EventChoice): ChoiceTone {
  if (choice.effects.length === 0) return 'neutral';
  let hasCost = false;
  let hasGain = false;
  for (const e of choice.effects) {
    if (e.kind === 'lose_hp' || e.kind === 'lose_gold' || e.kind === 'add_curse') hasCost = true;
    if (e.kind === 'max_hp' && e.amount < 0) hasCost = true;
    if (e.kind === 'heal' || e.kind === 'gold' || e.kind === 'add_random_relic'
        || e.kind === 'add_card' || e.kind === 'add_potion'
        || e.kind === 'upgrade_random') hasGain = true;
    if (e.kind === 'max_hp' && e.amount > 0) hasGain = true;
  }
  if (hasCost && hasGain) return 'risky';
  if (hasCost) return 'risky';
  if (hasGain) return 'positive';
  return 'neutral';
}

function renderEffectChips(effects: EventEffect[]): HTMLElement | null {
  if (effects.length === 0) return null;
  const row = el('div', { class: 'effect-chips' });
  for (const e of effects) {
    const chip = effectChip(e);
    if (chip) row.appendChild(chip);
  }
  return row;
}

function effectChip(e: EventEffect): HTMLElement | null {
  let label = '';
  let cls = 'chip';
  switch (e.kind) {
    case 'heal':           label = `❤ +${e.amount}`;        cls += ' gain'; break;
    case 'lose_hp':        label = `💔 -${e.amount}`;       cls += ' cost'; break;
    case 'gold':           label = `💰 +${e.amount}`;       cls += ' gain'; break;
    case 'lose_gold':      label = `💰 -${e.amount}`;       cls += ' cost'; break;
    case 'max_hp':         label = e.amount >= 0 ? `❤ 최대 +${e.amount}` : `💔 최대 ${e.amount}`;
                           cls += e.amount >= 0 ? ' gain' : ' cost'; break;
    case 'add_card':       label = `🃏 카드 (${e.rarity})`;  cls += ' gain'; break;
    case 'add_potion':     label = `🧪 물약`;                cls += ' gain'; break;
    case 'add_random_relic': label = `💎 유물`;              cls += ' gain'; break;
    case 'upgrade_random': label = `✦ 강화 ×${e.count}`;    cls += ' gain'; break;
    case 'add_curse':      label = `☠ 저주 ×${e.count}`;    cls += ' cost'; break;
    case 'add_blessing':   label = `✨ 축복 ×${e.count}`;   cls += ' gain'; break;
    default: return null;
  }
  return el('span', { class: cls }, label);
}
