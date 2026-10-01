import { el } from './dom';
import { setScreen } from '../state';
import { getMuted, setMuted, getVolume, setVolume, playSfx, getBgmMuted, setBgmMuted, getBgmVolume, setBgmVolume } from '../audio';
import { ic } from './art';
import { t, getLang, setLang } from '../i18n';
import { render } from './router';
import { getSettings, setSetting } from '../game-settings';
import type { GameSettings } from '../game-settings';

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

    // ── Audio ──
    wrapper.appendChild(sectionLabel(t('오디오')));

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

    // ── Gameplay ──
    const gs = getSettings();
    wrapper.appendChild(sectionLabel(t('게임플레이')));

    // Animation speed
    wrapper.appendChild(optionRow(
      `⚡ ${t('애니메이션 속도')}`,
      segmentedControl<GameSettings['animSpeed']>(
        [['fast', t('빠름')], ['normal', t('보통')], ['slow', t('느림')]],
        gs.animSpeed,
        (v) => { setSetting('animSpeed', v); rebuild(); },
      ),
    ));

    // Screen shake
    wrapper.appendChild(toggleRow(`💥 ${t('화면 흔들림')}`, gs.screenShake, (v) => {
      setSetting('screenShake', v);
      rebuild();
    }));

    // Auto end turn
    wrapper.appendChild(toggleRow(`⏭ ${t('자동 턴 종료')}`, gs.autoEndTurn, (v) => {
      setSetting('autoEndTurn', v);
      rebuild();
    }));

    // ── Accessibility ──
    wrapper.appendChild(sectionLabel(t('접근성')));

    // Font size
    wrapper.appendChild(optionRow(
      `🔤 ${t('글자 크기')}`,
      segmentedControl<GameSettings['fontSize']>(
        [['small', t('작게')], ['normal', t('보통')], ['large', t('크게')]],
        gs.fontSize,
        (v) => { setSetting('fontSize', v); rebuild(); },
      ),
    ));

    // Color blind mode
    wrapper.appendChild(toggleRow(`👁 ${t('색약 모드')}`, gs.colorBlind, (v) => {
      setSetting('colorBlind', v);
      rebuild();
    }));

    // ── Language ──
    wrapper.appendChild(sectionLabel(t('언어')));
    const langRow = el('div', { class: 'audio-row' });
    const curLang = getLang();
    langRow.appendChild(langBtn('한국어', curLang === 'ko', () => { setLang('ko'); render(); }));
    langRow.appendChild(langBtn('English', curLang === 'en', () => { setLang('en'); render(); }));
    wrapper.appendChild(langRow);

    wrapper.appendChild(el('button', {
      style: { marginTop: '24px' },
      onClick: () => setScreen('title'),
    }, `← ${t('제목 화면으로')}`));
  };

  appendContent();
  return wrapper;
}

function sectionLabel(text: string): HTMLElement {
  return el('div', {
    style: { color: 'var(--accent)', fontSize: '13px', fontWeight: 'bold', marginTop: '18px', marginBottom: '4px', borderBottom: '1px solid var(--border)', paddingBottom: '4px' },
  }, text);
}

function optionRow(label: string, control: HTMLElement): HTMLElement {
  const row = el('div', { class: 'settings-row' });
  const lbl = el('span', { class: 'settings-label' });
  lbl.innerHTML = label;
  row.appendChild(lbl);
  row.appendChild(control);
  return row;
}

function toggleRow(label: string, value: boolean, onChange: (v: boolean) => void): HTMLElement {
  return optionRow(label, el('button', {
    class: `settings-toggle ${value ? 'on' : ''}`,
    onClick: () => onChange(!value),
  }, value ? 'ON' : 'OFF'));
}

function segmentedControl<T extends string>(
  options: [T, string][],
  current: T,
  onChange: (v: T) => void,
): HTMLElement {
  const row = el('div', { class: 'settings-segment' });
  for (const [value, label] of options) {
    row.appendChild(el('button', {
      class: `settings-seg-btn ${value === current ? 'active' : ''}`,
      onClick: () => onChange(value),
    }, label));
  }
  return row;
}

function langBtn(label: string, active: boolean, onClick: () => void): HTMLElement {
  return el('button', {
    style: {
      padding: '4px 12px', fontSize: '13px', marginRight: '4px',
      background: active ? 'var(--accent)' : 'transparent',
      color: active ? '#1a1416' : 'var(--text)',
      border: `1px solid ${active ? 'var(--accent)' : 'var(--border)'}`,
      borderRadius: '4px',
    },
    onClick,
  }, label);
}
