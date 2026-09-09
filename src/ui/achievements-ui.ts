import { el } from './dom';
import { setScreen } from '../state';
import { ACHIEVEMENTS, getUnlockedSet, resetAchievements, reconcileAchievements, getCharClearStatus, getAchievementTitle } from '../achievements';
import type { AchievementTitle } from '../achievements';
import type { AchievementDef } from '../achievements';
import type { CharacterClass } from '../types';
import { CHARACTER_SVG, ACHIEVEMENT_SVG, TITLE_SVG, artEl, ic } from './art';

const CHAR_LABEL: Record<CharacterClass, string> = {
  swordmaster: '검사',
  gunner: '총잡이',
  fighter: '격투가',
  magician: '마법사',
  priest: '성직자',
  thief: '도적',
  summoner: '정령술사',
};

const CATEGORY_LABEL: Record<AchievementDef['category'], string> = {
  progression: `${ic('progress')} 진행`,
  character:   `${ic('mask')} 캐릭터`,
  difficulty:  `${ic('mountain')} 등반`,
  combat:      `${ic('sword')} 전투`,
  collection:  `${ic('box')} 수집`,
};

export function renderAchievements(): HTMLElement {
  // 화면 진입 시 기록 기반으로 도전과제 소급 보정 (누락분 자동 채움)
  reconcileAchievements();

  const wrapper = el('div', { class: 'achievements-screen' });

  const rebuild = () => {
    reconcileAchievements();
    wrapper.innerHTML = '';
    appendContent();
  };

  const appendContent = () => {
    const unlocked = getUnlockedSet();
    const total = ACHIEVEMENTS.length;
    const done = ACHIEVEMENTS.filter((a) => unlocked.has(a.id)).length;

    const h1 = el('h1', { style: { color: 'var(--accent)', margin: '0' } });
    h1.innerHTML = `${ic('medal')} 도전과제`;
    wrapper.appendChild(h1);
    wrapper.appendChild(
      el('div', { class: 'achievements-progress' }, `${done} / ${total} 달성`),
    );

    // Progress bar
    const bar = el('div', { class: 'ach-progress-bar' });
    bar.appendChild(el('div', { class: 'ach-progress-fill', style: { width: `${(done / total) * 100}%` } }));
    wrapper.appendChild(bar);

    // 칭호 표시
    const title = getAchievementTitle();
    const TITLES: AchievementTitle[] = [
      { threshold: 3, emoji: '🌱', name: '초보 모험가' },
      { threshold: 8, emoji: '⚔️', name: '숙련된 전사' },
      { threshold: 15, emoji: '🔥', name: '던전 정복자' },
      { threshold: 22, emoji: '👑', name: '전설의 영웅' },
    ];
    const TITLE_KEYS = ['beginner', 'veteran', 'conqueror', 'legend'];
    const nextTitle = TITLES.find((t) => t.threshold > done);
    const titleIdx = title ? TITLES.indexOf(title) : -1;
    const titleRow = el('div', {
      style: { color: 'var(--accent)', fontSize: '14px', margin: '8px 0 4px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' },
    });
    if (title && titleIdx >= 0) {
      titleRow.appendChild(artEl(TITLE_SVG[TITLE_KEYS[titleIdx]], 20));
      titleRow.appendChild(document.createTextNode(`칭호: ${title.name}`));
    } else {
      titleRow.textContent = '칭호 없음';
    }
    wrapper.appendChild(titleRow);
    if (nextTitle) {
      const nextIdx = TITLES.indexOf(nextTitle);
      const nextRow = el('div', { style: { color: 'var(--muted)', fontSize: '12px', marginBottom: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' } });
      nextRow.appendChild(document.createTextNode('다음 칭호: '));
      if (nextIdx >= 0) nextRow.appendChild(artEl(TITLE_SVG[TITLE_KEYS[nextIdx]], 14));
      nextRow.appendChild(document.createTextNode(`${nextTitle.name} (${nextTitle.threshold - done}개 더 달성)`));
      wrapper.appendChild(nextRow);
    }

    // Group by category
    const categories: AchievementDef['category'][] = ['progression', 'character', 'difficulty', 'combat', 'collection'];
    for (const cat of categories) {
      const items = ACHIEVEMENTS.filter((a) => a.category === cat);
      if (items.length === 0) continue;
      const catH3 = el('h3', { class: 'ach-category' });
      catH3.innerHTML = CATEGORY_LABEL[cat];
      wrapper.appendChild(catH3);
      // 캐릭터 카테고리 위에 캐릭별 클리어/진엔딩 현황 칩
      if (cat === 'character') {
        const status = getCharClearStatus();
        const clearCount = (Object.values(status.clear) as boolean[]).filter(Boolean).length;
        const trueCount = (Object.values(status.trueClear) as boolean[]).filter(Boolean).length;
        wrapper.appendChild(
          el('div', { style: { color: 'var(--muted)', fontSize: '12px', marginBottom: '6px' } },
            `클리어 ${clearCount}/6 · 진엔딩 ${trueCount}/6`),
        );
        const chips = el('div', { style: { display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '10px' } });
        for (const c of Object.keys(CHAR_LABEL) as (keyof typeof CHAR_LABEL)[]) {
          const cleared = status.clear[c];
          const trueCleared = status.trueClear[c];
          const chip = el('div', {
            style: {
              padding: '3px 8px', borderRadius: '6px', fontSize: '12px',
              display: 'inline-flex', alignItems: 'center', gap: '3px',
              border: `1px solid ${cleared ? 'var(--good)' : 'var(--border)'}`,
              background: cleared ? 'rgba(80,180,80,0.12)' : 'transparent',
              color: cleared ? 'var(--fg)' : 'var(--muted)',
              opacity: cleared ? '1' : '0.55',
            },
            title: trueCleared ? '진엔딩 클리어' : cleared ? '일반 클리어' : '미클리어',
          });
          chip.appendChild(artEl(CHARACTER_SVG[c], 14));
          const chipLabel = el('span', {});
          chipLabel.innerHTML = `${CHAR_LABEL[c]} ${trueCleared ? ic('trophy') : cleared ? '✓' : '—'}`;
          chip.appendChild(chipLabel);
          chips.appendChild(chip);
        }
        wrapper.appendChild(chips);
      }
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
  const iconEl = el('div', { class: 'ach-emoji' });
  if (unlocked) {
    const svg = ACHIEVEMENT_SVG[a.id];
    if (svg) iconEl.innerHTML = svg;
    else iconEl.textContent = a.emoji;
  } else {
    iconEl.innerHTML = ic('lock');
  }
  return el(
    'div',
    { class: `ach-card ${unlocked ? 'unlocked' : 'locked'}` },
    iconEl,
    el(
      'div',
      { class: 'ach-text' },
      el('div', { class: 'ach-title' }, unlocked ? a.title : '???'),
      el('div', { class: 'ach-desc' }, a.description),
    ),
  );
}
