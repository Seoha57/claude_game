import { el } from './dom';
import { setScreen, startNewRun, hasSave, loadRun } from '../state';
import {
  getDailySetup,
  getDailyResult,
  setDailyResult,
  getAllDailyResults,
  todayDateString,
} from '../daily';
import type { CharacterClass, Screen } from '../types';

const CHAR_INFO: Record<CharacterClass, { name: string; emoji: string }> = {
  swordmaster: { name: '귀검사',   emoji: '⚔️' },
  gunner:      { name: '거너',     emoji: '🔫' },
  fighter:     { name: '격투가',   emoji: '🥊' },
  magician:    { name: '마법사',   emoji: '🔮' },
  priest:      { name: '프리스트', emoji: '⛪' },
  thief:       { name: '도적',     emoji: '🗡️' },
};

export function renderDaily(): HTMLElement {
  const wrapper = el('div', { class: 'rest-screen' });
  const today = todayDateString();
  const setup = getDailySetup(today);
  const result = getDailyResult(today);
  const info = CHAR_INFO[setup.character];

  // 현재 진행 중인 데일리 런이 세이브에 있는지
  const savedRun = (() => {
    try {
      const raw = localStorage.getItem('dungeoncard_save');
      if (!raw) return null;
      const data = JSON.parse(raw);
      return data.runState ?? null;
    } catch { return null; }
  })();
  const hasActiveDaily = !!savedRun?.dailyConfig && savedRun.dailyConfig.date === today;

  wrapper.appendChild(el('h2', { style: { color: 'var(--accent)' } }, '🌅 오늘의 도전'));
  wrapper.appendChild(
    el(
      'div',
      { style: { color: 'var(--muted)', fontSize: '13px', marginBottom: '16px', textAlign: 'center', maxWidth: '480px' } },
      '매일 모두에게 같은 시드 / 캐릭터 / 제약. 동기화 켜져 있으면 결과도 클라우드에 저장.',
    ),
  );

  // 날짜 카드
  wrapper.appendChild(
    el(
      'div',
      {
        style: {
          padding: '20px 24px',
          border: '2px solid var(--accent)',
          borderRadius: '12px',
          background: 'rgba(212,160,91,0.08)',
          textAlign: 'center',
          marginBottom: '12px',
          width: '90%', maxWidth: '480px',
        },
      },
      el('div', { style: { color: 'var(--muted)', fontSize: '12px', marginBottom: '6px' } }, today),
      el('div', { style: { fontSize: '40px', marginBottom: '4px' } }, info.emoji),
      el('div', { style: { fontSize: '20px', fontWeight: 'bold', marginBottom: '10px' } }, info.name),
      el(
        'div',
        {
          style: {
            display: 'inline-block',
            padding: '8px 14px',
            border: '1px solid #c97a3a',
            borderRadius: '8px',
            background: 'rgba(201,122,58,0.12)',
            color: '#ffd080',
          },
        },
        el('div', { style: { fontWeight: 'bold', marginBottom: '4px' } }, `✦ ${setup.constraint.name}`),
        el('div', { style: { fontSize: '12px', color: 'var(--fg)' } }, setup.constraint.desc),
      ),
    ),
  );

  // 결과 또는 시작 버튼
  if (result && (result.outcome === 'won' || result.outcome === 'true_won' || result.outcome === 'lost' || result.outcome === 'abandoned')) {
    const isWin = result.outcome === 'won' || result.outcome === 'true_won';
    wrapper.appendChild(
      el(
        'div',
        {
          style: {
            padding: '14px 18px',
            background: isWin ? 'rgba(80,180,80,0.12)' : 'rgba(180,80,80,0.12)',
            border: `1px solid ${isWin ? 'rgba(80,180,80,0.5)' : 'rgba(180,80,80,0.5)'}`,
            borderRadius: '8px',
            marginBottom: '12px',
            width: '90%', maxWidth: '440px',
            textAlign: 'center',
          },
        },
        el(
          'div',
          { style: { fontWeight: 'bold', color: isWin ? 'var(--good)' : 'var(--bad)', marginBottom: '4px' } },
          isWin ? (result.outcome === 'true_won' ? '🏆 진엔딩 클리어!' : '✓ 클리어!') : '✗ 실패',
        ),
        el('div', { style: { fontSize: '12px', color: 'var(--muted)' } }, `챕터 ${result.chapter} · ${result.floor}층 도달`),
      ),
    );
    wrapper.appendChild(
      el('div', { style: { color: 'var(--muted)', fontSize: '13px', marginTop: '8px' } }, '내일 새 도전이 열립니다.'),
    );
  } else if (hasActiveDaily) {
    wrapper.appendChild(
      el(
        'div',
        { style: { color: 'var(--muted)', fontSize: '13px', marginBottom: '12px' } },
        '진행 중인 오늘의 도전이 있습니다.',
      ),
    );
    wrapper.appendChild(
      el(
        'button',
        {
          style: { background: 'var(--good)', color: '#1a1416', fontWeight: 'bold', marginBottom: '8px' },
          onClick: () => {
            if (loadRun()) setScreen('map');
          },
        },
        '🗺 이어하기',
      ),
    );
    wrapper.appendChild(
      el(
        'button',
        {
          style: { background: 'transparent', color: 'var(--bad)', border: '1px solid var(--bad)' },
          onClick: () => {
            if (!confirm('오늘의 도전을 포기합니다. 실패로 기록되고 내일까지 재도전 불가능합니다.')) return;
            const run = savedRun;
            setDailyResult({
              date: today,
              characterClass: setup.character,
              constraintId: setup.constraint.id,
              outcome: 'abandoned',
              chapter: run?.chapter ?? 1,
              floor: run?.floor ?? 0,
              timestamp: Date.now(),
            });
            try { localStorage.removeItem('dungeoncard_save'); } catch { /* ignore */ }
            setScreen('title');
          },
        },
        '포기',
      ),
    );
  } else {
    // 진행 중인 다른 런이 있으면 경고
    const hasOtherRun = hasSave();
    wrapper.appendChild(
      el(
        'button',
        {
          style: { fontSize: '16px', padding: '14px 28px', marginBottom: '8px' },
          onClick: () => {
            if (hasOtherRun) {
              const ok = confirm('진행 중인 일반 런이 있습니다. 데일리를 시작하면 기존 진행이 삭제됩니다. 계속할까요?');
              if (!ok) return;
              try { localStorage.removeItem('dungeoncard_save'); } catch { /* ignore */ }
            }
            startNewRun(setup.seed, 0, setup.character, {
              goToScreen: 'neow_blessing' as Screen,
              daily: { date: today, constraint: setup.constraint },
            });
            // 시작 직후 결과는 in_progress로 일단 기록 안 함 — 끝났을 때만 기록
          },
        },
        '⚔ 도전 시작',
      ),
    );
  }

  // 최근 결과 히스토리
  const history = getAllDailyResults().slice(0, 10);
  if (history.length > 0) {
    wrapper.appendChild(
      el(
        'div',
        { style: { marginTop: '24px', width: '90%', maxWidth: '480px' } },
        el('div', { style: { color: 'var(--muted)', fontSize: '12px', marginBottom: '6px' } }, '📜 최근 도전'),
        ...history.map((r) =>
          el(
            'div',
            {
              style: {
                display: 'flex',
                justifyContent: 'space-between',
                padding: '4px 8px',
                fontSize: '12px',
                borderBottom: '1px solid var(--border)',
              },
            },
            el('span', {}, r.date),
            el('span', {}, `${CHAR_INFO[r.characterClass]?.emoji ?? '?'} ${CHAR_INFO[r.characterClass]?.name ?? r.characterClass}`),
            el(
              'span',
              {
                style: {
                  color:
                    r.outcome === 'won' || r.outcome === 'true_won' ? 'var(--good)' :
                    r.outcome === 'abandoned' ? 'var(--muted)' :
                    'var(--bad)',
                },
              },
              r.outcome === 'true_won' ? '🏆' :
              r.outcome === 'won' ? '✓' :
              r.outcome === 'abandoned' ? '⊘' :
              '✗',
            ),
          ),
        ),
      ),
    );
  }

  wrapper.appendChild(
    el(
      'button',
      {
        style: { marginTop: '24px', background: 'transparent', color: 'var(--muted)', border: '1px solid var(--border)' },
        onClick: () => setScreen('title'),
      },
      '← 제목으로',
    ),
  );

  return wrapper;
}
