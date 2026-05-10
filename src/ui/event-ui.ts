import { el } from './dom';
import { getRun, setScreen, makeCard } from '../state';
import { EVENT_DEFS } from '../content/events';
import type { EventEffect, EventChoice } from '../content/events';
import { POTION_LIST } from '../content/potions';
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
  canUpgrade,
} from '../content/cards';

export function renderEvent(): HTMLElement {
  const run = getRun();
  const rng = makeRng(run.seed * 53 + run.floor * 17);
  const eventDef = pick(rng, EVENT_DEFS);

  let resultText: string | null = null;

  const wrapper = el('div', { class: 'end-screen' });
  const rebuild = () => {
    while (wrapper.firstChild) wrapper.removeChild(wrapper.firstChild);
    appendContent();
  };

  const appendContent = () => {
    wrapper.appendChild(el('h2', { style: { color: 'var(--accent)', margin: '0 0 8px 0' } }, eventDef.title));
    wrapper.appendChild(
      el('div', {
        style: {
          color: 'var(--text)',
          fontSize: '14px',
          maxWidth: '480px',
          textAlign: 'center',
          lineHeight: '1.6',
          marginBottom: '24px',
        },
      }, eventDef.description),
    );

    if (resultText !== null) {
      wrapper.appendChild(
        el('div', {
          style: {
            color: 'var(--good)',
            fontSize: '14px',
            maxWidth: '480px',
            textAlign: 'center',
            lineHeight: '1.6',
            marginBottom: '20px',
            padding: '12px 20px',
            background: 'var(--panel)',
            border: '1px solid var(--border)',
            borderRadius: '8px',
          },
        }, resultText),
      );
      wrapper.appendChild(
        el('button', {
          onClick: () => setScreen('map'),
        }, '지도로 돌아가기'),
      );
      return;
    }

    const choicesEl = el('div', {
      style: { display: 'flex', flexDirection: 'column', gap: '10px', width: '100%', maxWidth: '480px' },
    });

    for (const choice of eventDef.choices) {
      const disabled = isChoiceDisabled(choice);
      const btn = el(
        'button',
        {
          disabled: disabled ? true : undefined,
          style: {
            width: '100%',
            textAlign: 'left',
            padding: '12px 16px',
            opacity: disabled ? '0.4' : '1',
          },
          onClick: () => {
            if (disabled) return;
            applyEffects(choice.effects);
            resultText = choice.result;
            rebuild();
          },
        },
        choice.label,
      );
      choicesEl.appendChild(btn);
    }

    wrapper.appendChild(choicesEl);
  };

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
          break;
        case 'lose_gold':
          run.player.gold = Math.max(0, run.player.gold - effect.amount);
          break;
        case 'add_curse': {
          for (let i = 0; i < effect.count; i++) {
            run.player.deck.push(makeCard('wound'));
          }
          break;
        }
        case 'upgrade_random': {
          const upgradeable = run.player.deck.filter((c) => canUpgrade(c));
          const toUpgrade = shuffle(rng, upgradeable.slice()).slice(0, effect.count);
          for (const card of toUpgrade) {
            card.upgraded = true;
          }
          break;
        }
        case 'add_random_relic': {
          const unowned = PICKABLE_RELICS.filter((r) => !run.player.relics.includes(r.id));
          if (unowned.length > 0) {
            const chosen = pick(rng, unowned);
            run.player.relics.push(chosen.id);
            recordRelic(chosen.id);
            playSfx('relic');
          }
          break;
        }
        case 'add_card': {
          let pool: { id: string }[];
          const cls = run.characterClass;
          if (cls === 'gunner') {
            pool =
              effect.rarity === 'common' ? GUNNER_COMMON_CARDS :
              effect.rarity === 'uncommon' ? GUNNER_UNCOMMON_CARDS :
              GUNNER_RARE_CARDS;
          } else if (cls === 'fighter') {
            pool =
              effect.rarity === 'common' ? FIGHTER_COMMON_CARDS :
              effect.rarity === 'uncommon' ? FIGHTER_UNCOMMON_CARDS :
              FIGHTER_RARE_CARDS;
          } else if (cls === 'magician') {
            pool =
              effect.rarity === 'common' ? MAGICIAN_COMMON_CARDS :
              effect.rarity === 'uncommon' ? MAGICIAN_UNCOMMON_CARDS :
              MAGICIAN_RARE_CARDS;
          } else {
            pool =
              effect.rarity === 'common' ? COMMON_CARDS :
              effect.rarity === 'uncommon' ? UNCOMMON_CARDS :
              RARE_CARDS;
          }
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
          }
          break;
        }
        case 'max_hp': {
          run.player.maxHp = Math.max(1, run.player.maxHp + effect.amount);
          run.player.hp = Math.max(1, Math.min(run.player.maxHp, run.player.hp + effect.amount));
          break;
        }
      }
    }
  }

  appendContent();
  return wrapper;
}
