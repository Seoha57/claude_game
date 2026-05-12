import { el } from './dom';
import { getRun, setScreen } from '../state';
import { rollBlessings, type NeowBlessing } from '../content/neow';
import { showChapterIntro } from './splash-overlay';
import { makeRng } from '../rng';
import { playSfx } from '../audio';
import { recordRelic } from '../codex';

export function renderNeowBlessing(): HTMLElement {
  const run = getRun();
  // Use the run seed so blessings are stable for "save/resume" semantics
  // (even though we transition to map immediately after picking).
  const rng = makeRng(run.seed ^ 0x9e3779b1);
  const choices = rollBlessings(rng, 4);

  const wrapper = el('div', { class: 'neow-screen' });

  wrapper.appendChild(el('div', { class: 'neow-emoji' }, '🌟'));
  wrapper.appendChild(el('h1', { class: 'neow-title' }, '네오의 축복'));
  wrapper.appendChild(
    el('div', { class: 'neow-flavor' },
      '오랜 여정의 시작, 신비한 존재가 당신에게 한 가지 축복을 내린다.'),
  );

  const grid = el('div', { class: 'neow-grid' });
  for (const b of choices) {
    grid.appendChild(buildBlessingCard(b));
  }
  wrapper.appendChild(grid);

  // Refuse option
  wrapper.appendChild(
    el('button', {
      class: 'neow-refuse',
      onClick: () => {
        playSfx('click');
        proceed();
      },
    }, '거절한다 (보너스 없이 시작)'),
  );

  return wrapper;

  function buildBlessingCard(b: NeowBlessing): HTMLElement {
    return el('div', {
      class: `neow-card tone-${b.tone}`,
      onClick: () => {
        const p = getRun().player;
        // Track existing relics to detect newly-added ones (for codex)
        const before = new Set(p.relics);
        b.apply(p, rng);
        // Record any new relics granted by the blessing
        for (const id of p.relics) {
          if (!before.has(id)) recordRelic(id);
        }
        playSfx(b.tone === 'risky' ? 'relic' : 'upgrade');
        proceed();
      },
    },
      el('div', { class: 'neow-card-emoji' }, b.emoji),
      el('div', { class: 'neow-card-title' }, b.title),
      el('div', { class: 'neow-card-desc' }, b.description),
    );
  }

  function proceed(): void {
    setScreen('map');
    showChapterIntro(1);
  }
}
