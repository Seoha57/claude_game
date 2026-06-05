import { el } from './dom';
import { setScreen } from '../state';
import { getRunHistory, clearRunHistory } from '../run-history';
import type { RunHistoryEntry } from '../run-history';
import type { CharacterClass } from '../types';

const CHAR_INFO: Record<CharacterClass, { name: string; emoji: string }> = {
  swordmaster: { name: '귀검사',   emoji: '⚔️' },
  gunner:      { name: '거너',     emoji: '🔫' },
  fighter:     { name: '격투가',   emoji: '🥊' },
  magician:    { name: '마법사',   emoji: '🔮' },
  priest:      { name: '프리스트', emoji: '⛪' },
  thief:       { name: '도적',     emoji: '🗡️' },
};

export function renderHistory(): HTMLElement {
  const wrapper = el('div', { class: 'rest-screen' });

  const rebuild = () => {
    wrapper.innerHTML = '';
    append();
  };

  const append = () => {
    wrapper.appendChild(el('h2', { style: { color: 'var(--accent)' } }, '📜 런 기록'));

    const entries = getRunHistory();
    if (entries.length === 0) {
      wrapper.appendChild(
        el('div', { style: { color: 'var(--muted)', marginTop: '20px' } }, '아직 기록된 런이 없습니다.'),
      );
    } else {
      // 간단 요약 (승률)
      const wins = entries.filter((e) => e.outcome === 'won' || e.outcome === 'true_won').length;
      const trueWins = entries.filter((e) => e.outcome === 'true_won').length;
      wrapper.appendChild(
        el(
          'div',
          { style: { color: 'var(--muted)', fontSize: '12px', marginBottom: '12px' } },
          `최근 ${entries.length}판 · ${wins}승 ${entries.length - wins}패${trueWins > 0 ? ` · 진엔딩 ${trueWins}회` : ''}`,
        ),
      );

      const list = el('div', { style: { width: '92%', maxWidth: '540px', display: 'flex', flexDirection: 'column', gap: '6px' } });
      for (const e of entries) list.appendChild(renderEntry(e));
      wrapper.appendChild(list);
    }

    const footer = el('div', { style: { display: 'flex', gap: '10px', marginTop: '24px' } });
    footer.appendChild(
      el('button', {
        style: { background: 'transparent', color: 'var(--muted)', border: '1px solid var(--border)' },
        onClick: () => setScreen('title'),
      }, '← 제목으로'),
    );
    if (entries.length > 0) {
      footer.appendChild(
        el('button', {
          style: { background: 'transparent', color: 'var(--bad)', border: '1px solid var(--bad)' },
          onClick: () => {
            if (confirm('런 기록을 모두 삭제합니다. 계속할까요?')) {
              clearRunHistory();
              rebuild();
            }
          },
        }, '기록 삭제'),
      );
    }
    wrapper.appendChild(footer);
  };

  append();
  return wrapper;
}

function renderEntry(e: RunHistoryEntry): HTMLElement {
  const info = CHAR_INFO[e.characterClass] ?? { name: e.characterClass, emoji: '?' };
  const isWin = e.outcome === 'won' || e.outcome === 'true_won';
  const outcomeIcon = e.outcome === 'true_won' ? '🏆' : e.outcome === 'won' ? '✓' : '✗';
  const outcomeColor = isWin ? 'var(--good)' : 'var(--bad)';
  const borderColor = e.outcome === 'true_won' ? 'var(--accent)' : isWin ? 'rgba(80,180,80,0.4)' : 'rgba(180,80,80,0.35)';

  const locText = e.outcome === 'true_won' ? '챕터 4 클리어'
    : e.outcome === 'won' ? '챕터 3 보스 클리어'
    : `챕터 ${e.chapter} · ${e.floor}층`;

  const main = el(
    'div',
    { style: { display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' } },
    el('span', { style: { fontSize: '18px' } }, info.emoji),
    el('span', { style: { fontWeight: 'bold', minWidth: '54px' } }, info.name),
    el('span', { style: { color: outcomeColor, fontWeight: 'bold' } }, outcomeIcon),
    el('span', { style: { color: 'var(--fg)', fontSize: '13px' } }, locText),
    e.ascension > 0 ? el('span', { style: { color: 'var(--accent)', fontSize: '12px' } }, `A${e.ascension}`) : el('span'),
    e.daily ? el('span', { style: { color: 'var(--accent)', fontSize: '11px' } }, '🌅') : el('span'),
  );

  const sub = el(
    'div',
    { style: { color: 'var(--muted)', fontSize: '11px', marginTop: '3px', display: 'flex', gap: '10px', flexWrap: 'wrap' } },
    el('span', {}, formatTime(e.timestamp)),
    el('span', {}, `🃏 ${e.deckSize}장`),
    el('span', {}, `💰 ${e.gold}`),
    ...(e.killerName ? [el('span', { style: { color: 'var(--bad)' } }, `☠ ${e.killerName}`)] : []),
  );

  return el(
    'div',
    {
      style: {
        padding: '8px 12px',
        border: `1px solid ${borderColor}`,
        borderRadius: '8px',
        background: 'rgba(0,0,0,0.18)',
      },
    },
    main,
    sub,
  );
}

function formatTime(ts: number): string {
  const d = new Date(ts);
  const now = new Date();
  const sameDay = d.toDateString() === now.toDateString();
  const yesterday = new Date(now.getTime() - 86400000).toDateString() === d.toDateString();
  const hm = `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
  if (sameDay) return `오늘 ${hm}`;
  if (yesterday) return `어제 ${hm}`;
  return `${d.getMonth() + 1}/${d.getDate()} ${hm}`;
}
