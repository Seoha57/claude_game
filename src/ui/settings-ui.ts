import { el } from './dom';
import { setScreen } from '../state';
import { getMuted, setMuted, getVolume, setVolume, playSfx, getBgmMuted, setBgmMuted, getBgmVolume, setBgmVolume } from '../audio';
import { ic } from './art';
import { t, getLang, setLang } from '../i18n';
import { render } from './router';

export function renderSettings(): HTMLElement {
  const wrapper = el('div', { class: 'settings-screen' });

  const rebuild = () => {
    wrapper.innerHTML = '';
    appendContent();
  };

  const appendContent = () => {
    const settingsH1 = el('h1', { style: { color: 'var(--accent)', margin: '0' } });
    settingsH1.innerHTML = `${ic('gear')} ${t('설정')}`;
    wrapper.appendChild(settingsH1);

    // SFX
    const muted = getMuted();
    const audioRow = el('div', { class: 'audio-row' });
    audioRow.appendChild(el('button', {
      class: 'audio-toggle',
      onClick: () => { setMuted(!getMuted()); if (!getMuted()) playSfx('click'); rebuild(); },
    }, muted ? `🔇 ${t('효과음')} OFF` : `🔊 ${t('효과음')} ON`));
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
    }, bgmM ? `🎵 ${t('배경음악')} OFF` : `🎵 ${t('배경음악')} ON`));
    if (!bgmM) {
      bgmRow.appendChild(el('input', {
        type: 'range', min: '0', max: '100',
        value: String(Math.round(getBgmVolume() * 100)),
        class: 'volume-slider',
        onInput: (e: Event) => setBgmVolume(parseInt((e.target as HTMLInputElement).value, 10) / 100),
      }));
    }
    wrapper.appendChild(bgmRow);

    // Language
    const langRow = el('div', { class: 'audio-row', style: { marginTop: '12px' } });
    const curLang = getLang();
    langRow.appendChild(el('span', { style: { color: 'var(--muted)', fontSize: '13px', marginRight: '8px' } }, `🌐 ${t('언어')}`));
    langRow.appendChild(el('button', {
      style: {
        padding: '4px 12px',
        fontSize: '13px',
        background: curLang === 'ko' ? 'var(--accent)' : 'transparent',
        color: curLang === 'ko' ? '#1a1416' : 'var(--text)',
        border: `1px solid ${curLang === 'ko' ? 'var(--accent)' : 'var(--border)'}`,
        borderRadius: '4px',
      },
      onClick: () => { setLang('ko'); render(); },
    }, '한국어'));
    langRow.appendChild(el('button', {
      style: {
        padding: '4px 12px',
        fontSize: '13px',
        marginLeft: '4px',
        background: curLang === 'en' ? 'var(--accent)' : 'transparent',
        color: curLang === 'en' ? '#1a1416' : 'var(--text)',
        border: `1px solid ${curLang === 'en' ? 'var(--accent)' : 'var(--border)'}`,
        borderRadius: '4px',
      },
      onClick: () => { setLang('en'); render(); },
    }, 'English'));
    wrapper.appendChild(langRow);

    wrapper.appendChild(el('button', {
      style: { marginTop: '24px' },
      onClick: () => setScreen('title'),
    }, `← ${t('제목 화면으로')}`));
  };

  appendContent();
  return wrapper;
}
