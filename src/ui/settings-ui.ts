import { el } from './dom';
import { setScreen } from '../state';
import { getMuted, setMuted, getVolume, setVolume, playSfx, getBgmMuted, setBgmMuted, getBgmVolume, setBgmVolume } from '../audio';
import { FRAMES, getCardFrame, setCardFrame } from '../card-frame';

export function renderSettings(): HTMLElement {
  const wrapper = el('div', { class: 'settings-screen' });

  const rebuild = () => {
    wrapper.innerHTML = '';
    appendContent();
  };

  const appendContent = () => {
    wrapper.appendChild(el('h1', { style: { color: 'var(--accent)', margin: '0' } }, '⚙️ 설정'));

    // SFX
    const muted = getMuted();
    const audioRow = el('div', { class: 'audio-row' });
    audioRow.appendChild(el('button', {
      class: 'audio-toggle',
      onClick: () => { setMuted(!getMuted()); if (!getMuted()) playSfx('click'); rebuild(); },
    }, muted ? '🔇 음소거' : '🔊 음향 ON'));
    if (!muted) {
      audioRow.appendChild(el('input', {
        type: 'range', min: '0', max: '100',
        value: String(Math.round(getVolume() * 100)),
        class: 'volume-slider',
        onInput: (e: Event) => setVolume(parseInt((e.target as HTMLInputElement).value, 10) / 100),
        onChange: () => playSfx('click'),
      }));
    }
    wrapper.appendChild(audioRow);

    // BGM
    const bgmM = getBgmMuted();
    const bgmRow = el('div', { class: 'audio-row' });
    bgmRow.appendChild(el('button', {
      class: 'audio-toggle',
      onClick: () => { setBgmMuted(!getBgmMuted()); rebuild(); },
    }, bgmM ? '🎵 BGM OFF' : '🎵 BGM ON'));
    if (!bgmM) {
      bgmRow.appendChild(el('input', {
        type: 'range', min: '0', max: '100',
        value: String(Math.round(getBgmVolume() * 100)),
        class: 'volume-slider',
        onInput: (e: Event) => setBgmVolume(parseInt((e.target as HTMLInputElement).value, 10) / 100),
      }));
    }
    wrapper.appendChild(bgmRow);

    // Card frame
    const currentFrame = getCardFrame();
    wrapper.appendChild(el('div', {
      style: { color: 'var(--muted)', fontSize: '13px', marginTop: '16px', marginBottom: '8px' },
    }, '카드 프레임'));
    const frameRow = el('div', {
      style: { display: 'flex', gap: '8px', justifyContent: 'center', flexWrap: 'wrap' },
    });
    for (const f of FRAMES) {
      const unlocked = f.check();
      const active = currentFrame === f.id;
      frameRow.appendChild(el('button', {
        style: {
          fontSize: '12px', padding: '6px 12px',
          background: active ? 'var(--accent-2)' : 'transparent',
          color: unlocked ? (active ? 'white' : 'var(--text)') : 'var(--muted)',
          border: `1px solid ${active ? 'var(--accent)' : 'var(--border)'}`,
          borderRadius: '6px',
          cursor: unlocked ? 'pointer' : 'default',
          opacity: unlocked ? '1' : '0.5',
        },
        onClick: () => { if (unlocked) { setCardFrame(f.id); rebuild(); } },
      }, unlocked ? `${f.emoji} ${f.name}` : `🔒 ${f.name}`));
    }
    wrapper.appendChild(frameRow);

    wrapper.appendChild(el('button', {
      style: { marginTop: '24px' },
      onClick: () => setScreen('title'),
    }, '← 제목으로'));
  };

  appendContent();
  return wrapper;
}
