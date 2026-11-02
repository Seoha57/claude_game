import { el } from './dom';
import { t } from '../i18n';
import { getRun, setScreen } from '../state';
import { type NeowBlessing } from '../content/neow';
import { applyNeowBlessing, neowChoices } from '../run/rules';
import { showChapterIntro } from './splash-overlay';
import { playSfx } from '../audio';
import { recordRelic } from '../codex';
import { NEOW_SVG } from './art';

const BLESSING_SVG_KEY: Record<string, string> = {
  health_blessing: 'heal',
  wealth_blessing: 'gold',
  relic_blessing: 'relic',
  upgrade_blessing: 'power',
  potion_blessing: 'potion',
  energy_blessing: 'energy',
  dark_pact: 'curse',
};

export function renderNeowBlessing(): HTMLElement {
  const run = getRun();
  const choices = neowChoices(run);

  const wrapper = el('div', { class: 'neow-screen' });

  const neowIcon = el('div', { class: 'neow-emoji' });
  neowIcon.innerHTML = NEOW_SVG.neow;
  wrapper.appendChild(neowIcon);
  wrapper.appendChild(el('h1', { class: 'neow-title' }, t('네오의 축복')));
  wrapper.appendChild(
    el('div', { class: 'neow-flavor' },
      t('오랜 여정의 시작, 신비한 존재가 당신에게 한 가지 축복을 내린다.')),
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
    }, t('거절한다 (보너스 없이 시작)')),
  );

  return wrapper;

  function buildBlessingCard(b: NeowBlessing): HTMLElement {
    return el('div', {
      class: `neow-card tone-${b.tone}`,
      onClick: () => {
        for (const id of applyNeowBlessing(getRun(), b)) recordRelic(id);
        playSfx(b.tone === 'risky' ? 'relic' : 'upgrade');
        proceed();
      },
    },
      (() => { const ic = el('div', { class: 'neow-card-emoji' }); const sk = BLESSING_SVG_KEY[b.id]; const sv = sk ? NEOW_SVG[sk] : undefined; if (sv) ic.innerHTML = sv; else ic.textContent = b.emoji; return ic; })(),
      el('div', { class: 'neow-card-title' }, b.title),
      el('div', { class: 'neow-card-desc' }, b.description),
    );
  }

  function proceed(): void {
    setScreen('map');
    showChapterIntro(1);
  }
}
