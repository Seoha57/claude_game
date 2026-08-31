import { el } from './dom';
import { setScreen } from '../state';
import { ACHIEVEMENTS, getUnlockedSet, resetAchievements, reconcileAchievements, getCharClearStatus, getAchievementTitle } from '../achievements';
import type { AchievementTitle } from '../achievements';
import type { AchievementDef } from '../achievements';
import type { CharacterClass } from '../types';

const CHAR_LABEL: Record<CharacterClass, string> = {
  swordmaster: '⚔️검사',
  gunner: '🔫사수',
  fighter: '🥊격투가',
  magician: '🔮마법사',
  priest: '⛪성직자',
  thief: '🗡️도적',
  summoner: '👻정령술사',
};

const CATEGORY_LABEL: Record<AchievementDef['category'], string> = {
  progression: '🌟 진행',
  character:   '🎭 캐릭터',
  difficulty:  '⛰ 등반',
  combat:      '⚔ 전투',
  collection:  '📦 수집',
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

    wrapper.appendChild(el('h1', { style: { color: 'var(--accent)', margin: '0' } }, '🏅 도전과제'));
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
    const nextTitle = TITLES.find((t) => t.threshold > done);
    wrapper.appendChild(
      el('div', {
        style: { color: 'var(--accent)', fontSize: '14px', margin: '8px 0 4px' },
      }, title ? `${title.emoji} 칭호: ${title.name}` : '칭호 없음'),
    );
    if (nextTitle) {
      wrapper.appendChild(
        el('div', { style: { color: 'var(--muted)', fontSize: '12px', marginBottom: '8px' } },
          `다음 칭호: ${nextTitle.emoji} ${nextTitle.name} (${nextTitle.threshold - done}개 더 달성)`,
        ),
      );
    }

    // Group by category
    const categories: AchievementDef['category'][] = ['progression', 'character', 'difficulty', 'combat', 'collection'];
    for (const cat of categories) {
      const items = ACHIEVEMENTS.filter((a) => a.category === cat);
      if (items.length === 0) continue;
      wrapper.appendChild(
        el('h3', { class: 'ach-category' }, CATEGORY_LABEL[cat]),
      );
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
          chips.appendChild(
            el('div', {
              style: {
                padding: '3px 8px', borderRadius: '6px', fontSize: '12px',
                border: `1px solid ${cleared ? 'var(--good)' : 'var(--border)'}`,
                background: cleared ? 'rgba(80,180,80,0.12)' : 'transparent',
                color: cleared ? 'var(--fg)' : 'var(--muted)',
                opacity: cleared ? '1' : '0.55',
              },
              title: trueCleared ? '진엔딩 클리어' : cleared ? '일반 클리어' : '미클리어',
            }, `${CHAR_LABEL[c]} ${trueCleared ? '🏆' : cleared ? '✓' : '—'}`),
          );
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
