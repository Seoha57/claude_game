import { t } from '../i18n';

const CLS = 'tooltip-active';

function clearAll(): void {
  document.querySelectorAll(`.${CLS}`).forEach((el) => el.classList.remove(CLS));
}

function dismissCardDetail(): void {
  document.querySelector('.card-detail-popup')?.remove();
}

function showCardDetail(cardEl: HTMLElement): void {
  dismissCardDetail();
  const name = cardEl.querySelector('.card-name')?.textContent ?? '';
  const desc = cardEl.querySelector('.card-desc')?.innerHTML ?? '';
  const type = cardEl.querySelector('.card-type')?.textContent ?? '';
  const cost = cardEl.querySelector('.card-cost')?.textContent ?? '';

  const popup = document.createElement('div');
  popup.className = 'card-detail-popup';
  popup.innerHTML = `
    <div class="card-detail-inner">
      <div class="card-detail-cost">${cost}</div>
      <div class="card-detail-name">${name}</div>
      <div class="card-detail-type">${type}</div>
      <div class="card-detail-desc">${desc}</div>
      <div class="card-detail-hint">${t('탭하여 닫기')}</div>
    </div>
  `;
  popup.addEventListener('click', dismissCardDetail);
  document.body.appendChild(popup);
}

export function initTouchTooltip(): void {
  if (!('ontouchstart' in window)) return;

  let longPressTimer: number | null = null;
  let longPressTarget: HTMLElement | null = null;

  document.addEventListener('touchstart', (e) => {
    const target = (e.target as HTMLElement).closest?.('[data-tooltip]');
    if (target) {
      const wasActive = target.classList.contains(CLS);
      clearAll();
      if (!wasActive) target.classList.add(CLS);
    } else {
      clearAll();
    }

    // Card long-press detection
    const cardEl = (e.target as HTMLElement).closest?.('.card') as HTMLElement | null;
    if (cardEl && cardEl.closest('.hand-cards')) {
      longPressTarget = cardEl;
      longPressTimer = window.setTimeout(() => {
        if (longPressTarget === cardEl) {
          showCardDetail(cardEl);
          longPressTarget = null;
        }
      }, 500);
    }
  }, { passive: true });

  document.addEventListener('touchmove', () => {
    if (longPressTimer) { clearTimeout(longPressTimer); longPressTimer = null; longPressTarget = null; }
  }, { passive: true });

  document.addEventListener('touchend', () => {
    if (longPressTimer) { clearTimeout(longPressTimer); longPressTimer = null; longPressTarget = null; }
  }, { passive: true });
}
