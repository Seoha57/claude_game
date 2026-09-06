import { el } from './dom';
import { setScreen } from '../state';
import { loadStats, resetStats } from '../stats';
import { getUnlockedMax } from '../ascension';
import type { CharacterClass } from '../types';

const CHAR_INFO: Record<CharacterClass, { name: string; emoji: string }> = {
  swordmaster: { name: '검사',     emoji: '⚔️' },
  gunner:      { name: '사수',     emoji: '🔫' },
  fighter:     { name: '격투가',   emoji: '🥊' },
  magician:    { name: '마법사',   emoji: '🔮' },
  priest:      { name: '성직자',   emoji: '⛪' },
  thief:       { name: '도적',     emoji: '🗡️' },
  summoner:    { name: '정령술사', emoji: '🪬' },
};

export function renderStats(): HTMLElement {
  const wrapper = el('div', { class: 'stats-screen' });

  const rebuild = () => {
    wrapper.innerHTML = '';
    appendContent();
  };

  const appendContent = () => {
    const stats = loadStats();
    const unlocked = getUnlockedMax();
    const totalEnded = stats.totalWins + stats.totalTrueWins + stats.totalLosses;
    const winRate = totalEnded > 0
      ? Math.round(((stats.totalWins + stats.totalTrueWins) / totalEnded) * 100)
      : 0;

    wrapper.appendChild(el('h1', { style: { color: 'var(--accent)', margin: '0' } }, '📊 통계'));

    // Aggregate summary
    const summary = el('div', { class: 'stats-summary' });
    summary.appendChild(statBox('총 런', stats.totalRuns));
    summary.appendChild(statBox('일반 승리', stats.totalWins, 'good'));
    summary.appendChild(statBox('진엔딩', stats.totalTrueWins, 'accent'));
    summary.appendChild(statBox('패배', stats.totalLosses, 'bad'));
    summary.appendChild(statBox('승률', `${winRate}%`));
    summary.appendChild(statBox('해금된 등반', unlocked > 0 ? `A${unlocked}` : '-'));
    wrapper.appendChild(summary);

    // Per character table
    wrapper.appendChild(el('h2', { style: { color: 'var(--accent)', marginTop: '8px' } }, '캐릭터별'));

    const charGrid = el('div', { class: 'stats-char-grid' });
    for (const [cls, info] of Object.entries(CHAR_INFO) as [CharacterClass, typeof CHAR_INFO['swordmaster']][]) {
      const cs = stats.perCharacter[cls];
      const ended = cs.wins + cs.trueWins + cs.losses;
      const rate = ended > 0 ? Math.round(((cs.wins + cs.trueWins) / ended) * 100) : 0;

      const card = el('div', { class: 'stats-char-card' });
      card.appendChild(el('div', { class: 'stats-char-header' },
        el('span', { class: 'stats-char-emoji' }, info.emoji),
        el('span', { class: 'stats-char-name' }, info.name),
      ));
      card.appendChild(el('div', { class: 'stats-char-row' },
        el('span', { class: 'stats-label' }, '런 / 시작'),
        el('span', {}, String(cs.runs)),
      ));
      card.appendChild(el('div', { class: 'stats-char-row' },
        el('span', { class: 'stats-label' }, '일반 승리'),
        el('span', { style: { color: 'var(--good)' } }, String(cs.wins)),
      ));
      card.appendChild(el('div', { class: 'stats-char-row' },
        el('span', { class: 'stats-label' }, '진엔딩'),
        el('span', { style: { color: 'var(--accent)' } }, String(cs.trueWins)),
      ));
      card.appendChild(el('div', { class: 'stats-char-row' },
        el('span', { class: 'stats-label' }, '패배'),
        el('span', { style: { color: 'var(--bad)' } }, String(cs.losses)),
      ));
      card.appendChild(el('div', { class: 'stats-char-row' },
        el('span', { class: 'stats-label' }, '승률'),
        el('span', {}, ended > 0 ? `${rate}%` : '-'),
      ));
      card.appendChild(el('div', { class: 'stats-char-row' },
        el('span', { class: 'stats-label' }, '최고 등반'),
        el('span', { style: { color: 'var(--accent)' } },
          cs.bestAscension >= 0 ? (cs.bestAscension === 0 ? '기본 클리어' : `A${cs.bestAscension}`) : '-'),
      ));
      charGrid.appendChild(card);
    }
    wrapper.appendChild(charGrid);

    // Footer buttons
    const footer = el('div', { style: { display: 'flex', gap: '10px', marginTop: '24px' } });
    footer.appendChild(el('button', { onClick: () => setScreen('title') }, '← 제목으로'));
    footer.appendChild(el('button', {
      style: { background: 'transparent', color: 'var(--bad)', border: '1px solid var(--bad)' },
      onClick: () => {
        if (confirm('통계를 모두 초기화합니다. 계속할까요?\n(등반 해금은 유지됩니다)')) {
          resetStats();
          rebuild();
        }
      },
    }, '통계 초기화'));
    wrapper.appendChild(footer);
  };

  appendContent();
  return wrapper;
}

function statBox(label: string, value: string | number, color?: 'good' | 'bad' | 'accent'): HTMLElement {
  const colorVal = color === 'good' ? 'var(--good)' : color === 'bad' ? 'var(--bad)' : color === 'accent' ? 'var(--accent)' : 'var(--fg)';
  return el(
    'div',
    { class: 'stats-box' },
    el('div', { class: 'stats-box-label' }, label),
    el('div', { class: 'stats-box-value', style: { color: colorVal } }, String(value)),
  );
}
