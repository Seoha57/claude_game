import { el } from './dom';
import { setScreen } from '../state';
import { ACHIEVEMENTS, getUnlockedSet, resetAchievements } from '../achievements';
import type { AchievementDef } from '../achievements';

const CATEGORY_LABEL: Record<AchievementDef['category'], string> = {
  progression: '🌟 진행',
  character:   '🎭 캐릭터',
  difficulty:  '⛰ 등반',
  combat:      '⚔ 전투',
  collection:  '📦 수집',
};

export function renderAchievements(): HTMLElement {
  const wrapper = el('div', { class: 'achievements-screen' });

  const rebuild = () => {
    wrapper.innerHTML = '';
    appendContent();
  };

  const appendContent = () => {
    const unlocked = getUnlockedSet();
    const total = ACHIEVEMENTS.length;
    const done = ACHIEVEMENTS.filter((a) => unlocked.has(a.id)).length;

    wrapper.appendChild(el('h1', { style: { color: 'var(--accent)', margin: '0' } }, '🏅 도전과제'));
    wrapper.appendChild(
      el('div', { class: 'achievements-progress' }, `${done} / ${total} 달성`),
    );

    // Progress bar
    const bar = el('div', { class: 'ach-progress-bar' });
    bar.appendChild(el('div', { class: 'ach-progress-fill', style: { width: `${(done / total) * 100}%` } }));
    wrapper.appendChild(bar);

    // Group by category
    const categories: AchievementDef['category'][] = ['progression', 'character', 'difficulty', 'combat', 'collection'];
    for (const cat of categories) {
      const items = ACHIEVEMENTS.filter((a) => a.category === cat);
      if (items.length === 0) continue;
      wrapper.appendChild(
        el('h3', { class: 'ach-category' }, CATEGORY_LABEL[cat]),
      );
      const grid = el('div', { class: 'ach-grid' });
      for (const a of items) {
        grid.appendChild(renderAchievementCard(a, unlocked.has(a.id)));
      }
      wrapper.appendChild(grid);
    }

    // Footer
    const footer = el('div', { style: { display: 'flex', gap: '10px', marginTop: '20px' } });
    footer.appendChild(el('button', { onClick: () => setScreen('title') }, '← 제목으로'));
    footer.appendChild(el('button', {
      style: { background: 'transparent', color: 'var(--bad)', border: '1px solid var(--bad)' },
      onClick: () => {
        if (confirm('도전과제 기록을 모두 초기화합니다. 계속할까요?')) {
          resetAchievements();
          rebuild();
        }
      },
    }, '도전과제 초기화'));
    wrapper.appendChild(footer);
  };

  appendContent();
  return wrapper;
}

function renderAchievementCard(a: AchievementDef, unlocked: boolean): HTMLElement {
  return el(
    'div',
    { class: `ach-card ${unlocked ? 'unlocked' : 'locked'}` },
    el('div', { class: 'ach-emoji' }, unlocked ? a.emoji : '🔒'),
    el(
      'div',
      { class: 'ach-text' },
      el('div', { class: 'ach-title' }, unlocked ? a.title : '???'),
      el('div', { class: 'ach-desc' }, a.description),
    ),
  );
}
