import { el } from './dom';
import type { AchievementDef } from '../achievements';
import { playSfx } from '../audio';
import { ic } from './art';

export function showAchievementToast(def: AchievementDef): void {
  const toast = el('div', { class: 'achievement-toast' });
  toast.appendChild(el('div', { class: 'toast-emoji' }, def.emoji));
  const content = el(
    'div',
    { class: 'toast-content' },
    (() => { const d = el('div', { class: 'toast-label' }); d.innerHTML = `${ic('medal')} 도전과제 달성!`; return d; })(),
    el('div', { class: 'toast-title' }, def.title),
  );
  toast.appendChild(content);
  document.body.appendChild(toast);
  playSfx('relic');
  setTimeout(() => toast.classList.add('fade-out'), 2800);
  setTimeout(() => toast.remove(), 3200);
}
