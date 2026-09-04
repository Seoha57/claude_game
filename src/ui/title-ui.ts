import { el } from './dom';
import { setScreen, hasSave, loadRun, clearSave, getRunOrNull } from '../state';
import { getUnlockedMax } from '../ascension';
import { unlockProgress } from '../unlocks';
import { CARD_DEFS } from '../content/cards';
import { RELIC_LIST } from '../content/relics';
import { isCurseLike } from './deck-overlay';
import { FRAMES, getCardFrame, setCardFrame } from '../card-frame';

let pendingSeed = 0;
let pendingAscension = 0;

export function getPendingRunParams(): { seed: number; ascension: number } {
  return { seed: pendingSeed, ascension: pendingAscension };
}

export function renderTitle(): HTMLElement {
  const unlockedMax = getUnlockedMax();
  let selectedAscension = 0;

  const wrapper = el('div', { class: 'title-screen' });

  const rebuild = () => {
    wrapper.innerHTML = '';
    append();
  };

  const append = () => {
    wrapper.appendChild(el('h1', {}, '덱 오브 던전'));
    wrapper.appendChild(el('div', { class: 'subtitle' }, '덱빌더 로그라이트'));

    // 언락 진행도 표시 (전체 컨텐츠 X% 해제)
    const allCards = Object.values(CARD_DEFS).filter((c) => !isCurseLike(c.id));
    const prog = unlockProgress(allCards, RELIC_LIST);
    const totalUnlocked = prog.cards.unlocked + prog.relics.unlocked;
    const totalAll = prog.cards.total + prog.relics.total;
    const pct = totalAll > 0 ? Math.floor((totalUnlocked / totalAll) * 100) : 100;
    if (pct < 100) {
      wrapper.appendChild(
        el(
          'div',
          {
            style: {
              color: 'var(--muted)',
              fontSize: '11px',
              marginBottom: '8px',
              padding: '4px 10px',
              border: '1px solid var(--border)',
              borderRadius: '6px',
              background: 'rgba(0,0,0,0.2)',
            },
          },
          `🔓 컨텐츠 ${pct}% 해제 · 카드 ${prog.cards.unlocked}/${prog.cards.total} · 유물 ${prog.relics.unlocked}/${prog.relics.total}`,
        ),
      );
    }

    if (unlockedMax > 0) {
      const ascLabel = el(
        'div',
        { style: { color: 'var(--muted)', marginBottom: '8px', fontSize: '14px' } },
        `등반 난이도: A${selectedAscension}`,
      );
      wrapper.appendChild(ascLabel);

      const btnRow = el('div', { style: { display: 'flex', gap: '6px', flexWrap: 'wrap', justifyContent: 'center', marginBottom: '8px', maxWidth: '360px' } });
      for (let i = 0; i <= unlockedMax; i++) {
        const lvl = i;
        const btn = el(
          'button',
          {
            class: selectedAscension === lvl ? 'selected' : '',
            style: {
              minWidth: '36px',
              padding: '4px 8px',
              background: selectedAscension === lvl ? 'var(--accent)' : '',
              color: selectedAscension === lvl ? '#1a1416' : '',
            },
            onClick: () => {
              selectedAscension = lvl;
              rebuild();
            },
          },
          lvl === 0 ? '기본' : `A${lvl}`,
        );
        btnRow.appendChild(btn);
      }
      wrapper.appendChild(btnRow);
      wrapper.appendChild(renderModifierHints(selectedAscension));
    }

    const saveExists = hasSave();

    if (saveExists) {
      wrapper.appendChild(
        el(
          'button',
          {
            style: { marginTop: '16px', background: 'var(--good)', color: '#1a1416', fontWeight: 'bold' },
            onClick: () => {
              if (loadRun()) {
                const r = getRunOrNull();
                setScreen(r?.endless ? 'endless_wave_clear' : 'map');
              }
            },
          },
          '🗺  이어하기',
        ),
      );
    }

    wrapper.appendChild(
      el(
        'button',
        {
          style: { marginTop: saveExists ? '8px' : '16px' },
          onClick: () => {
            if (saveExists) {
              const ok = confirm('진행 중인 런이 있습니다. 새 게임을 시작하면 기존 진행 상황이 삭제됩니다. 계속할까요?');
              if (!ok) return;
              clearSave();
            }
            pendingSeed = Math.floor(Math.random() * 1e9);
            pendingAscension = selectedAscension;
            setScreen('character_select');
          },
        },
        selectedAscension > 0 ? `새 게임 시작 (A${selectedAscension})` : '새 게임 시작',
      ),
    );

    const menuBtn = (label: string, screen: string) =>
      el('button', {
        class: 'hb-item',
        onClick: () => setScreen(screen as any),
      }, label);

    const accentBtn = (label: string, screen: string) =>
      el('button', {
        style: {
          background: 'transparent',
          color: 'var(--accent)',
          border: '1px solid var(--accent)',
          fontSize: '13px', padding: '8px 14px',
        },
        onClick: () => setScreen(screen as any),
      }, label);

    // Hamburger menu
    const hbWrap = el('div', { class: 'hb-wrap' });
    const hbBtn = el('button', {
      class: 'hb-toggle',
      onClick: (e: Event) => { e.stopPropagation(); hbWrap.classList.toggle('open'); },
    }, '☰');
    wrapper.addEventListener('click', () => hbWrap.classList.remove('open'));
    hbWrap.appendChild(hbBtn);
    const hbPanel = el('div', { class: 'hb-panel' });
    hbPanel.appendChild(menuBtn('❓ 도움말', 'help'));
    hbPanel.appendChild(menuBtn('📖 도감', 'codex'));
    hbPanel.appendChild(menuBtn('🏅 도전과제', 'achievements'));
    hbPanel.appendChild(menuBtn('📊 통계', 'stats'));
    hbPanel.appendChild(menuBtn('📜 기록', 'history'));
    hbPanel.appendChild(menuBtn('☁️ 동기화', 'sync'));
    hbPanel.appendChild(menuBtn('⚙️ 설정', 'settings'));
    hbWrap.appendChild(hbPanel);
    wrapper.appendChild(hbWrap);

    const row2 = el('div', { style: { display: 'flex', gap: '8px', marginTop: '6px', justifyContent: 'center' } });
    row2.appendChild(accentBtn('🌅 오늘의 도전', 'daily'));
    row2.appendChild(accentBtn('🏆 리더보드', 'leaderboard'));
    wrapper.appendChild(row2);

    // Card frame selector
    const currentFrame = getCardFrame();
    const frameRow = el('div', {
      style: { display: 'flex', gap: '8px', justifyContent: 'center', flexWrap: 'wrap', marginTop: '8px' },
    });
    frameRow.appendChild(el('span', { style: { color: 'var(--muted)', fontSize: '12px', alignSelf: 'center', width: '100%', textAlign: 'center' } }, '카드 프레임'));
    for (const f of FRAMES) {
      const unlocked = f.check();
      const active = currentFrame === f.id;
      frameRow.appendChild(el('button', {
        style: {
          fontSize: '12px', padding: '4px 10px',
          background: active ? 'var(--accent-2)' : 'transparent',
          color: unlocked ? (active ? 'white' : 'var(--text)') : 'var(--muted)',
          border: `1px solid ${active ? 'var(--accent)' : 'var(--border)'}`,
          borderRadius: '6px',
          cursor: unlocked ? 'pointer' : 'default',
          opacity: unlocked ? '1' : '0.5',
        },
        title: unlocked ? f.name : `해금: ${f.unlockLabel}`,
        onClick: () => { if (unlocked) { setCardFrame(f.id); rebuild(); } },
      }, unlocked ? `${f.emoji} ${f.name}` : `🔒 ${f.unlockLabel || f.name}`));
    }
    wrapper.appendChild(frameRow);
  };

  append();
  return wrapper;
}

function renderModifierHints(level: number): HTMLElement {
  if (level === 0) return el('div', {});
  const hints: string[] = [];
  if (level >= 1) hints.push('적 HP +5%');
  if (level >= 2) hints.push('적 힘 +1');
  if (level >= 3) hints.push('시작 덱에 상처 +1');
  if (level >= 4) hints.push('상점 가격 +10%');
  if (level >= 5) hints.push('시작 HP -4');
  if (level >= 6) hints.push('적 HP +10% 추가');
  if (level >= 7) hints.push('휴식 회복량 30%→20%');
  if (level >= 8) hints.push('시작 덱에 상처 +1 추가');
  if (level >= 9) hints.push('적 힘 +1 추가');
  if (level >= 10) hints.push('적 HP +15% 추가');

  const mult = `무한 던전 점수 ×${(1 + level * 0.1).toFixed(1)}`;
  return el(
    'div',
    { style: { fontSize: '12px', maxWidth: '320px', textAlign: 'center', marginBottom: '4px' } },
    el('span', { style: { color: 'var(--bad)' } }, hints.join(' · ')),
    el('span', { style: { color: 'var(--good)', marginLeft: '8px' } }, mult),
  );
}
