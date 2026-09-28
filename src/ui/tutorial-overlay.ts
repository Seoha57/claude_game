import { el } from './dom';
import { t } from '../i18n';
import { playSfx } from '../audio';

const COMBAT_KEY = 'dod_tut_combat';

interface TutorialStep {
  target: string;
  title: string;
  text: string;
  position: 'top' | 'bottom';
  action?: string;
}

function combatSteps(): TutorialStep[] {
  return [
    {
      target: '.energy-orb',
      title: t('에너지'),
      text: t('카드를 사용하려면 에너지가 필요합니다. 매 턴 시작 시 회복됩니다.'),
      position: 'bottom',
    },
    {
      target: '.hand-cards',
      title: t('카드 사용'),
      text: t('카드를 클릭하면 사용합니다. 빨간색은 공격, 파란색은 방어, 보라색은 특수 효과입니다.'),
      position: 'top',
    },
    {
      target: '.hand-cards',
      title: t('카드 타게팅'),
      text: t('공격 카드를 클릭하면 카드가 위로 떠오릅니다. 그 다음 공격할 적을 클릭하세요! 적이 1마리면 자동 발동됩니다.'),
      position: 'top',
    },
    {
      target: '.enemies',
      title: t('적 의도 & 데미지 미리보기'),
      text: t('적 머리 위의 아이콘이 다음 행동 예고입니다. 카드 선택 시 적에게 들어갈 데미지가 숫자로 표시됩니다!'),
      position: 'bottom',
    },
    {
      target: '.hp-bar',
      title: t('체력과 방어도'),
      text: t('방어도는 적의 공격을 먼저 흡수합니다. 단, 매 턴 시작 시 0으로 초기화됩니다.'),
      position: 'bottom',
    },
    {
      target: '.end-turn-btn',
      title: t('턴 종료'),
      text: t('카드를 다 사용했으면 턴 종료를 눌러보세요!'),
      position: 'top',
      action: '.end-turn-btn',
    },
  ];
}

export function isTutorialDone(): boolean {
  try { return localStorage.getItem(COMBAT_KEY) === '1'; } catch { return true; }
}

function isKeyDone(key: string): boolean {
  try { return localStorage.getItem(key) === '1'; } catch { return true; }
}

function markKey(key: string): void {
  try { localStorage.setItem(key, '1'); } catch { /* noop */ }
}

export function showTutorialOverlay(): void {
  if (isTutorialDone()) return;
  showGuide(combatSteps(), COMBAT_KEY);
}

export function showMiniTutorial(key: string, steps: TutorialStep[]): void {
  if (isKeyDone(key)) return;
  showGuide(steps, key);
}

function showGuide(steps: TutorialStep[], storageKey: string): void {
  let step = 0;
  let actionCleanup: (() => void) | null = null;

  const overlay = el('div', { class: 'tutorial-overlay' });
  const tooltip = el('div', { class: 'tutorial-tooltip' });
  const titleEl = el('div', { class: 'tutorial-title' });
  const textEl = el('div', { class: 'tutorial-text' });
  const dotsEl = el('div', { class: 'tutorial-dots' });
  const actionHint = el('div', { class: 'tutorial-action-hint' }, t('직접 클릭해보세요!'));
  const nextBtn = el('button', { class: 'tutorial-next' });
  const skipBtn = el('button', {
    class: 'tutorial-skip',
    onClick: () => finish(),
  }, t('건너뛰기'));
  const btnRow = el('div', { class: 'tutorial-btn-row' }, skipBtn, nextBtn);

  tooltip.appendChild(titleEl);
  tooltip.appendChild(textEl);
  tooltip.appendChild(dotsEl);
  tooltip.appendChild(btnRow);
  tooltip.appendChild(actionHint);
  overlay.appendChild(tooltip);

  function finish(): void {
    if (actionCleanup) { actionCleanup(); actionCleanup = null; }
    markKey(storageKey);
    document.querySelectorAll('.tutorial-highlight').forEach((e) => e.classList.remove('tutorial-highlight'));
    overlay.remove();
  }

  function render(): void {
    if (actionCleanup) { actionCleanup(); actionCleanup = null; }
    const s = steps[step];
    titleEl.textContent = s.title;
    textEl.textContent = s.text;

    // Dot indicators
    dotsEl.innerHTML = '';
    if (steps.length > 1) {
      for (let i = 0; i < steps.length; i++) {
        dotsEl.appendChild(el('span', { class: `tutorial-dot${i === step ? ' active' : ''}` }));
      }
    }

    // Arrow direction
    tooltip.setAttribute('data-pos', s.position);

    // Interactive vs next button
    const isAction = !!s.action;
    btnRow.style.display = isAction ? 'none' : '';
    actionHint.style.display = isAction ? '' : 'none';

    if (isAction) {
      overlay.classList.add('tutorial-passthrough');
      const actionTarget = document.querySelector(s.action!);
      if (actionTarget) {
        const handler = () => { playSfx('click'); finish(); };
        actionTarget.addEventListener('click', handler, { once: true });
        actionCleanup = () => actionTarget.removeEventListener('click', handler);
      }
    } else {
      overlay.classList.remove('tutorial-passthrough');
      nextBtn.textContent = step < steps.length - 1 ? t('다음') : t('시작하기');
      nextBtn.onclick = () => {
        playSfx('click');
        if (step < steps.length - 1) { step++; render(); }
        else finish();
      };
    }

    // Remove previous highlight
    document.querySelectorAll('.tutorial-highlight').forEach((e) => e.classList.remove('tutorial-highlight'));

    // Highlight and position
    const targetEl = document.querySelector(s.target);
    if (targetEl) {
      targetEl.classList.add('tutorial-highlight');
      const rect = targetEl.getBoundingClientRect();
      const tooltipLeft = Math.max(8, Math.min(rect.left + rect.width / 2 - 140, window.innerWidth - 296));
      tooltip.style.left = `${tooltipLeft}px`;

      // Arrow horizontal position
      const arrowLeft = rect.left + rect.width / 2 - tooltipLeft;
      tooltip.style.setProperty('--arrow-left', `${Math.max(16, Math.min(arrowLeft, 264))}px`);

      if (s.position === 'bottom') {
        tooltip.style.top = `${rect.bottom + 16}px`;
        tooltip.style.bottom = '';
      } else {
        tooltip.style.top = '';
        tooltip.style.bottom = `${window.innerHeight - rect.top + 16}px`;
      }
    }

    // Re-trigger entrance animation
    tooltip.style.animation = 'none';
    requestAnimationFrame(() => { tooltip.style.animation = ''; });
  }

  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) { /* backdrop click ignored */ }
  });

  document.getElementById('app')!.appendChild(overlay);
  requestAnimationFrame(render);
}
