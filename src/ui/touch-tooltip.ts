const CLS = 'tooltip-active';

function clearAll(): void {
  document.querySelectorAll(`.${CLS}`).forEach((el) => el.classList.remove(CLS));
}

export function initTouchTooltip(): void {
  if (!('ontouchstart' in window)) return;

  document.addEventListener('touchstart', (e) => {
    const target = (e.target as HTMLElement).closest?.('[data-tooltip]');
    if (target) {
      const wasActive = target.classList.contains(CLS);
      clearAll();
      if (!wasActive) target.classList.add(CLS);
    } else {
      clearAll();
    }
  }, { passive: true });
}
