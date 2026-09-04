import { el } from './dom';

const STORAGE_KEY = 'dod_tutorial_done';

interface TutorialStep {
  target: string;   // CSS selector to highlight
  title: string;
  text: string;
  position: 'top' | 'bottom';
}

const STEPS: TutorialStep[] = [
  {
    target: '.energy-orb',
    title: '에너지',
    text: '카드를 사용하려면 에너지가 필요합니다. 매 턴 시작 시 회복됩니다.',
    position: 'bottom',
  },
  {
    target: '.hand-cards',
    title: '카드 사용',
    text: '카드를 클릭하면 사용합니다. 빨간색은 공격, 파란색은 방어, 보라색은 특수 효과입니다.',
    position: 'top',
  },
  {
    target: '.hp-bar',
    title: '체력과 방어도',
    text: '방어도(🛡)는 적의 공격을 먼저 흡수합니다. 단, 매 턴 시작 시 0으로 초기화됩니다.',
    position: 'bottom',
  },
  {
    target: '.end-turn-btn',
    title: '턴 종료',
    text: '카드를 다 사용했으면 턴 종료를 누르세요. 적이 행동한 뒤 새 턴이 시작됩니다.',
    position: 'top',
  },
];

export function isTutorialDone(): boolean {
  try { return localStorage.getItem(STORAGE_KEY) === '1'; } catch { return true; }
}

function markDone(): void {
  try { localStorage.setItem(STORAGE_KEY, '1'); } catch { /* noop */ }
}

export function showTutorialOverlay(): void {
  if (isTutorialDone()) return;
  let step = 0;

  const overlay = el('div', { class: 'tutorial-overlay' });
  const tooltip = el('div', { class: 'tutorial-tooltip' });
  const titleEl = el('div', { class: 'tutorial-title' });
  const textEl = el('div', { class: 'tutorial-text' });
  const progress = el('div', { class: 'tutorial-progress' });
  const nextBtn = el('button', { class: 'tutorial-next' });
  const skipBtn = el('button', {
    class: 'tutorial-skip',
    onClick: () => { markDone(); overlay.remove(); },
  }, '건너뛰기');

  tooltip.appendChild(titleEl);
  tooltip.appendChild(textEl);
  tooltip.appendChild(progress);
  const btnRow = el('div', { class: 'tutorial-btn-row' }, skipBtn, nextBtn);
  tooltip.appendChild(btnRow);
  overlay.appendChild(tooltip);

  function render(): void {
    const s = STEPS[step];
    titleEl.textContent = s.title;
    textEl.textContent = s.text;
    progress.textContent = `${step + 1} / ${STEPS.length}`;
    nextBtn.textContent = step < STEPS.length - 1 ? '다음' : '시작하기';
    nextBtn.onclick = () => {
      if (step < STEPS.length - 1) { step++; render(); }
      else { markDone(); overlay.remove(); }
    };

    // Remove previous highlight
    document.querySelectorAll('.tutorial-highlight').forEach((e) => e.classList.remove('tutorial-highlight'));

    // Highlight target element
    const targetEl = document.querySelector(s.target);
    if (targetEl) {
      targetEl.classList.add('tutorial-highlight');
      const rect = targetEl.getBoundingClientRect();
      tooltip.style.left = `${Math.max(8, Math.min(rect.left + rect.width / 2 - 140, window.innerWidth - 296))}px`;
      if (s.position === 'bottom') {
        tooltip.style.top = `${rect.bottom + 12}px`;
        tooltip.style.bottom = '';
      } else {
        tooltip.style.top = '';
        tooltip.style.bottom = `${window.innerHeight - rect.top + 12}px`;
      }
    }
  }

  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) { /* clicking backdrop does nothing, force reading */ }
  });

  document.getElementById('app')!.appendChild(overlay);
  requestAnimationFrame(render);
}
