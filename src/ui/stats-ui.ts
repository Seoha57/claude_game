import { el } from './dom';
import { setScreen } from '../state';
import { loadStats, resetStats } from '../stats';
import { getRunHistory } from '../run-history';
import type { RunHistoryEntry } from '../run-history';
import { getUnlockedMax } from '../ascension';
import type { CharacterClass } from '../types';
import { CHARACTER_SVG, artEl } from './art';
import { t } from '../i18n';

const CHAR_INFO: Record<CharacterClass, { name: string }> = {
  swordmaster: { name: '검사' },
  gunner:      { name: '총잡이' },
  fighter:     { name: '격투가' },
  magician:    { name: '마법사' },
  priest:      { name: '성직자' },
  thief:       { name: '도적' },
  summoner:    { name: '정령술사' },
  engineer:    { name: '공학자' },
  gambler:     { name: '갬블러' },
};

const ALL_CLASSES = Object.keys(CHAR_INFO) as CharacterClass[];

export function renderStats(): HTMLElement {
  const wrapper = el('div', { class: 'stats-screen' });

  const rebuild = () => {
    wrapper.innerHTML = '';
    appendContent();
  };

  const appendContent = () => {
    const stats = loadStats();
    const history = getRunHistory();
    const unlocked = getUnlockedMax();
    const totalEnded = stats.totalWins + stats.totalTrueWins + stats.totalLosses;
    const winRate = totalEnded > 0
      ? Math.round(((stats.totalWins + stats.totalTrueWins) / totalEnded) * 100)
      : 0;

    wrapper.appendChild(el('h1', { style: { color: 'var(--accent)', margin: '0' } }, `📊 ${t('통계 대시보드')}`));

    // ── 1. Aggregate summary ──
    const summary = el('div', { class: 'stats-summary' });
    summary.appendChild(statBox(t('총 런'), stats.totalRuns));
    summary.appendChild(statBox(t('승리'), stats.totalWins + stats.totalTrueWins, 'good'));
    summary.appendChild(statBox(t('진엔딩'), stats.totalTrueWins, 'accent'));
    summary.appendChild(statBox(t('패배'), stats.totalLosses, 'bad'));
    summary.appendChild(statBox(t('승률'), `${winRate}%`));
    summary.appendChild(statBox(t('최고 등반'), unlocked > 0 ? `A${unlocked}` : '-'));
    wrapper.appendChild(summary);

    // ── 2. Recent run timeline (dot streak) ──
    if (history.length > 0) {
      wrapper.appendChild(sectionTitle(t('최근 런 타임라인')));
      wrapper.appendChild(renderTimeline(history));
    }

    // ── 3. Streak info ──
    if (history.length > 0) {
      const streaks = calcStreaks(history);
      const streakRow = el('div', { class: 'stats-summary' });
      streakRow.appendChild(statBox(t('현재 연승'), streaks.current > 0 ? `${streaks.current}${t('연승')}` : '-', streaks.current > 0 ? 'good' : undefined));
      streakRow.appendChild(statBox(t('최고 연승'), streaks.best > 0 ? `${streaks.best}${t('연승')}` : '-', streaks.best > 0 ? 'accent' : undefined));
      streakRow.appendChild(statBox(t('현재 연패'), streaks.currentLoss > 0 ? `${streaks.currentLoss}${t('연패')}` : '-', streaks.currentLoss > 0 ? 'bad' : undefined));
      wrapper.appendChild(streakRow);
    }

    // ── 4. Win rate bar chart ──
    wrapper.appendChild(sectionTitle(t('캐릭터별 승률')));
    wrapper.appendChild(renderWinRateBars(stats));

    // ── 5. Death stats ──
    if (history.length > 0) {
      const killers = calcKillerStats(history);
      if (killers.length > 0) {
        wrapper.appendChild(sectionTitle(t('사망 원인 TOP 5')));
        wrapper.appendChild(renderKillerChart(killers));
      }
    }

    // ── 6. Per character detail (collapsible) ──
    wrapper.appendChild(sectionTitle(t('캐릭터별 상세')));
    const charGrid = el('div', { class: 'stats-char-grid' });
    for (const cls of ALL_CLASSES) {
      const cs = stats.perCharacter[cls];
      const info = CHAR_INFO[cls];
      const ended = cs.wins + cs.trueWins + cs.losses;
      const rate = ended > 0 ? Math.round(((cs.wins + cs.trueWins) / ended) * 100) : 0;

      const card = el('div', { class: 'stats-char-card' });
      card.appendChild(el('div', { class: 'stats-char-header' },
        artEl(CHARACTER_SVG[cls], 22),
        el('span', { class: 'stats-char-name' }, t(info.name)),
      ));
      card.appendChild(charRow(t('런'), String(cs.runs)));
      card.appendChild(charRow(t('승리'), String(cs.wins + cs.trueWins), 'var(--good)'));
      card.appendChild(charRow(t('진엔딩'), String(cs.trueWins), 'var(--accent)'));
      card.appendChild(charRow(t('패배'), String(cs.losses), 'var(--bad)'));
      card.appendChild(charRow(t('승률'), ended > 0 ? `${rate}%` : '-'));
      card.appendChild(charRow(t('최고 등반'),
        cs.bestAscension >= 0 ? (cs.bestAscension === 0 ? t('기본') : `A${cs.bestAscension}`) : '-',
        'var(--accent)'));
      charGrid.appendChild(card);
    }
    wrapper.appendChild(charGrid);

    // ── Footer ──
    const footer = el('div', { style: { display: 'flex', gap: '10px', marginTop: '24px' } });
    footer.appendChild(el('button', { onClick: () => setScreen('title') }, t('← 제목으로')));
    footer.appendChild(el('button', {
      style: { background: 'transparent', color: 'var(--bad)', border: '1px solid var(--bad)' },
      onClick: () => {
        if (confirm(t('통계를 모두 초기화합니다. 계속할까요?\n(등반 해금은 유지됩니다)'))) {
          resetStats();
          rebuild();
        }
      },
    }, t('통계 초기화')));
    wrapper.appendChild(footer);
  };

  appendContent();
  return wrapper;
}

// ── Components ──

function sectionTitle(text: string): HTMLElement {
  return el('h2', { style: { color: 'var(--accent)', margin: '8px 0 0', fontSize: '16px', width: '100%', textAlign: 'center' } }, text);
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

function charRow(label: string, value: string, color?: string): HTMLElement {
  return el('div', { class: 'stats-char-row' },
    el('span', { class: 'stats-label' }, label),
    el('span', { style: color ? { color } : {} }, value),
  );
}

// ── Timeline: dot visualization of recent runs ──

function renderTimeline(history: RunHistoryEntry[]): HTMLElement {
  const container = el('div', { class: 'stats-timeline' });
  const dots = el('div', { class: 'stats-timeline-dots' });

  for (const entry of history.slice(0, 20).reverse()) {
    const isWin = entry.outcome === 'won' || entry.outcome === 'true_won';
    const isTrueWin = entry.outcome === 'true_won';
    const cls = isTrueWin ? 'dot true-win' : isWin ? 'dot win' : 'dot loss';
    const info = CHAR_INFO[entry.characterClass];
    const d = new Date(entry.timestamp);
    const dateStr = `${d.getMonth() + 1}/${d.getDate()}`;
    const tooltip = `${t(info.name)} · ${isTrueWin ? t('진엔딩') : isWin ? t('승리') : t('패배')} · ${dateStr}`;
    const dot = el('div', { class: cls, 'data-tooltip': tooltip });
    dot.appendChild(artEl(CHARACTER_SVG[entry.characterClass], 14));
    dots.appendChild(dot);
  }

  container.appendChild(dots);
  const label = el('div', { class: 'stats-timeline-label' });
  label.textContent = `← ${t('과거')}                                 ${t('최근')} →`;
  container.appendChild(label);
  return container;
}

// ── Win rate horizontal bar chart ──

function renderWinRateBars(stats: ReturnType<typeof loadStats>): HTMLElement {
  const container = el('div', { class: 'stats-bars' });

  const sorted = ALL_CLASSES
    .map((cls) => {
      const cs = stats.perCharacter[cls];
      const ended = cs.wins + cs.trueWins + cs.losses;
      const rate = ended > 0 ? Math.round(((cs.wins + cs.trueWins) / ended) * 100) : -1;
      return { cls, rate, ended, cs };
    })
    .sort((a, b) => b.rate - a.rate);

  for (const { cls, rate, ended, cs } of sorted) {
    const info = CHAR_INFO[cls];
    const row = el('div', { class: 'stats-bar-row' });

    const label = el('div', { class: 'stats-bar-label' });
    label.appendChild(artEl(CHARACTER_SVG[cls], 18));
    label.appendChild(el('span', {}, t(info.name)));
    row.appendChild(label);

    const barBg = el('div', { class: 'stats-bar-bg' });
    if (ended > 0) {
      const winW = Math.round(((cs.wins + cs.trueWins) / ended) * 100);
      const trueW = Math.round((cs.trueWins / ended) * 100);
      if (trueW > 0) {
        barBg.appendChild(el('div', { class: 'stats-bar-fill true-win', style: { width: `${trueW}%` } }));
      }
      if (winW - trueW > 0) {
        barBg.appendChild(el('div', { class: 'stats-bar-fill win', style: { width: `${winW - trueW}%` } }));
      }
    }
    row.appendChild(barBg);

    const rateLabel = ended > 0 ? `${rate}%` : '-';
    const detail = `${cs.wins + cs.trueWins}W ${cs.losses}L`;
    row.appendChild(el('div', { class: 'stats-bar-rate' }, rateLabel));
    row.appendChild(el('div', { class: 'stats-bar-detail' }, ended > 0 ? detail : ''));
    container.appendChild(row);
  }

  return container;
}

// ── Killer stats ──

function calcKillerStats(history: RunHistoryEntry[]): { name: string; count: number }[] {
  const map = new Map<string, number>();
  for (const e of history) {
    if (e.outcome === 'lost' && e.killerName) {
      map.set(e.killerName, (map.get(e.killerName) ?? 0) + 1);
    }
  }
  return [...map.entries()]
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);
}

function renderKillerChart(killers: { name: string; count: number }[]): HTMLElement {
  const container = el('div', { class: 'stats-killers' });
  const maxCount = killers[0]?.count ?? 1;

  for (const k of killers) {
    const row = el('div', { class: 'stats-killer-row' });
    row.appendChild(el('div', { class: 'stats-killer-name' }, k.name));
    const barBg = el('div', { class: 'stats-bar-bg' });
    const pct = Math.round((k.count / maxCount) * 100);
    barBg.appendChild(el('div', { class: 'stats-bar-fill loss', style: { width: `${pct}%` } }));
    row.appendChild(barBg);
    row.appendChild(el('div', { class: 'stats-killer-count' }, `${k.count}${t('회')}`));
    container.appendChild(row);
  }

  return container;
}

// ── Streak calculation ──

function calcStreaks(history: RunHistoryEntry[]): { current: number; best: number; currentLoss: number } {
  let current = 0;
  let best = 0;
  let currentLoss = 0;
  let streak = 0;
  let lossStreak = 0;

  for (const e of history) {
    const isWin = e.outcome === 'won' || e.outcome === 'true_won';
    if (isWin) {
      streak++;
      lossStreak = 0;
    } else {
      if (streak > best) best = streak;
      streak = 0;
      lossStreak++;
    }
  }
  if (streak > best) best = streak;

  // Current streaks (from most recent)
  for (const e of history) {
    if (e.outcome === 'won' || e.outcome === 'true_won') {
      current++;
    } else break;
  }
  for (const e of history) {
    if (e.outcome === 'lost') {
      currentLoss++;
    } else break;
  }

  return { current, best, currentLoss };
}
