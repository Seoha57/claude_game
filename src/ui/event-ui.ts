import { el } from './dom';
import { t } from '../i18n';
import { getRun, setScreen } from '../state';
import type { EventEffect, EventChoice } from '../content/events';
import { applyEventEffects, canPickEventChoice, eventFor } from '../run/rules';
import { playSfx } from '../audio';
import { recordCard, recordRelic } from '../codex';
import { EVENT_SVG, ic } from './art';

// 이벤트 해결 상태를 모듈 레벨에 보존. 선택 도중 외부 render()
// (예: 백그라운드 sync) 가 발생해도 선택지가 다시 떠서 효과가
// 중복 적용되는 것을 방지한다. 노드별로 고유 키 사용.
let resolvedEventKey: string | null = null;
let resolvedEventText: string | null = null;

export function renderEvent(): HTMLElement {
  const run = getRun();
  const eventDef = eventFor(run);

  const eventKey = `${run.seed}_${run.chapter}_${run.currentNodeId}`;
  // 이미 해결된 이벤트면 결과 화면부터 시작
  let resultText: string | null = resolvedEventKey === eventKey ? resolvedEventText : null;

  const wrapper = el('div', { class: `event-screen mood-${eventDef.mood ?? 'mystic'}` });
  const rebuild = () => {
    while (wrapper.firstChild) wrapper.removeChild(wrapper.firstChild);
    appendContent();
  };

  const appendContent = () => {
    // Hero section with SVG art + title
    const hero = el('div', { class: 'event-hero' });
    const eventIcon = el('div', { class: 'event-emoji' });
    const eventSvg = EVENT_SVG[eventDef.id];
    if (eventSvg) eventIcon.innerHTML = eventSvg;
    else eventIcon.textContent = eventDef.emoji;
    hero.appendChild(eventIcon);
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
        }, t('지도로 돌아가기')),
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
    return !canPickEventChoice(run, choice);
  }

  function applyEffects(effects: EventEffect[]): void {
    const gains = applyEventEffects(run, effects);
    for (const name of gains.sfx) playSfx(name as Parameters<typeof playSfx>[0]);
    if (gains.relicId) recordRelic(gains.relicId);
    for (const id of gains.cardIds) recordCard(id);
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
    case 'heal':           label = `${ic('heart')} +${e.amount}`;           cls += ' gain'; break;
    case 'lose_hp':        label = `${ic('heart_broken')} -${e.amount}`;    cls += ' cost'; break;
    case 'gold':           label = `${ic('gold')} +${e.amount}`;            cls += ' gain'; break;
    case 'lose_gold':      label = `${ic('gold')} -${e.amount}`;            cls += ' cost'; break;
    case 'max_hp':         label = e.amount >= 0 ? `${ic('heart')} ${t('최대')} +${e.amount}` : `${ic('heart_broken')} ${t('최대')} ${e.amount}`;
                           cls += e.amount >= 0 ? ' gain' : ' cost'; break;
    case 'add_card':       label = `${ic('card')} ${t('카드')} (${e.rarity})`;      cls += ' gain'; break;
    case 'add_potion':     label = `${ic('potion_small')} ${t('물약')}`;            cls += ' gain'; break;
    case 'add_random_relic': label = `${ic('gem')} ${t('유물')}`;                   cls += ' gain'; break;
    case 'upgrade_random': label = `${ic('star')} ${t('강화')} ×${e.count}`;        cls += ' gain'; break;
    case 'add_curse':      label = `${ic('poison')} ${t('저주')} ×${e.count}`;      cls += ' cost'; break;
    case 'add_blessing':   label = `${ic('sparkle')} ${t('축복')} ×${e.count}`;     cls += ' gain'; break;
    default: return null;
  }
  const chip = el('span', { class: cls });
  chip.innerHTML = label;
  return chip;
}
