import { el } from './dom';
import { setScreen, hasSave, loadRun, clearSave } from '../state';
import { getUnlockedMax } from '../ascension';
import { getMuted, setMuted, getVolume, setVolume, playSfx, getBgmMuted, setBgmMuted, getBgmVolume, setBgmVolume } from '../audio';

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
    wrapper.appendChild(el('h1', {}, '던전앤카드'));
    wrapper.appendChild(el('div', { class: 'subtitle' }, '덱빌더 로그라이트'));

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
                setScreen('map');
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

    const utilRow = el('div', { style: { display: 'flex', gap: '8px', marginTop: '8px', flexWrap: 'wrap', justifyContent: 'center' } });
    utilRow.appendChild(
      el('button', {
        style: { background: 'transparent', color: 'var(--muted)', border: '1px solid var(--border)' },
        onClick: () => setScreen('help'),
      }, '❓ 도움말'),
    );
    utilRow.appendChild(
      el('button', {
        style: { background: 'transparent', color: 'var(--muted)', border: '1px solid var(--border)' },
        onClick: () => setScreen('codex'),
      }, '📖 도감'),
    );
    utilRow.appendChild(
      el('button', {
        style: { background: 'transparent', color: 'var(--muted)', border: '1px solid var(--border)' },
        onClick: () => setScreen('stats'),
      }, '📊 통계'),
    );
    wrapper.appendChild(utilRow);

    // Audio settings row
    const audioRow = el('div', { class: 'audio-row' });
    const muted = getMuted();
    const muteBtn = el(
      'button',
      {
        class: 'audio-toggle',
        onClick: () => {
          setMuted(!getMuted());
          if (!getMuted()) playSfx('click');
          rebuild();
        },
      },
      muted ? '🔇 음소거' : '🔊 음향 ON',
    );
    audioRow.appendChild(muteBtn);

    if (!muted) {
      const vol = getVolume();
      const slider = el('input', {
        type: 'range',
        min: '0',
        max: '100',
        value: String(Math.round(vol * 100)),
        class: 'volume-slider',
        onInput: (e: Event) => {
          const v = parseInt((e.target as HTMLInputElement).value, 10) / 100;
          setVolume(v);
        },
        onChange: () => playSfx('click'),
      });
      audioRow.appendChild(slider);
    }
    wrapper.appendChild(audioRow);

    // BGM row (independent toggle + volume)
    const bgmRow = el('div', { class: 'audio-row' });
    const bgmM = getBgmMuted();
    bgmRow.appendChild(
      el(
        'button',
        {
          class: 'audio-toggle',
          onClick: () => {
            setBgmMuted(!getBgmMuted());
            rebuild();
          },
        },
        bgmM ? '🎵 BGM OFF' : '🎵 BGM ON',
      ),
    );
    if (!bgmM) {
      const bv = getBgmVolume();
      bgmRow.appendChild(
        el('input', {
          type: 'range',
          min: '0',
          max: '100',
          value: String(Math.round(bv * 100)),
          class: 'volume-slider',
          onInput: (e: Event) => {
            const v = parseInt((e.target as HTMLInputElement).value, 10) / 100;
            setBgmVolume(v);
          },
        }),
      );
    }
    wrapper.appendChild(bgmRow);
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

  return el(
    'div',
    { style: { color: 'var(--bad)', fontSize: '12px', maxWidth: '320px', textAlign: 'center', marginBottom: '4px' } },
    hints.join(' · '),
  );
}
