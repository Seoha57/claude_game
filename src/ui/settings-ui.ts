import { el } from './dom';
import { setScreen } from '../state';
import { getMuted, setMuted, getVolume, setVolume, playSfx, getBgmMuted, setBgmMuted, getBgmVolume, setBgmVolume } from '../audio';

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

    wrapper.appendChild(el('button', {
      style: { marginTop: '24px' },
      onClick: () => setScreen('title'),
    }, '← 제목으로'));
  };

  appendContent();
  return wrapper;
}
