import { el } from './dom';
import { setScreen, startNewRun, hasSave } from '../state';
import { getUnlockedMax } from '../ascension';
import { CHALLENGE_MODIFIERS } from '../challenge';
import type { ChallengeModifier } from '../challenge';
import type { CharacterClass, Screen } from '../types';
import { CHARACTER_SVG, artEl, ic } from './art';
import { t } from '../i18n';
import { playSfx } from '../audio';

const CHARACTERS: { id: CharacterClass; name: string }[] = [
  { id: 'swordmaster', name: '검사' },
  { id: 'gunner', name: '총잡이' },
  { id: 'fighter', name: '격투가' },
  { id: 'magician', name: '마법사' },
  { id: 'priest', name: '성직자' },
  { id: 'thief', name: '도적' },
  { id: 'summoner', name: '정령술사' },
  { id: 'engineer', name: '공학자' },
  { id: 'gambler', name: '갬블러' },
  { id: 'blood_mage', name: '혈술사' },
];

export function renderChallenge(): HTMLElement {
  const wrapper = el('div', { class: 'rest-screen' });
  const unlockedMax = getUnlockedMax();

  let selectedChar: CharacterClass = 'swordmaster';
  let selectedAsc = 0;
  const selectedMods = new Set<string>();

  const rebuild = () => {
    wrapper.innerHTML = '';
    append();
  };

  const append = () => {
    const title = el('h2', { style: { color: 'var(--accent)' } });
    title.innerHTML = `${ic('sword')} ${t('챌린지 모드')}`;
    wrapper.appendChild(title);
    wrapper.appendChild(
      el('div', { style: { color: 'var(--muted)', fontSize: '13px', marginBottom: '16px', maxWidth: '400px', textAlign: 'center' } },
        t('제약 조건을 선택하고 도전하세요. 조건이 많을수록 더 어렵습니다.')),
    );

    // Character selection
    wrapper.appendChild(el('div', { style: { color: 'var(--muted)', fontSize: '12px', marginBottom: '6px' } }, t('캐릭터')));
    const charRow = el('div', { style: { display: 'flex', gap: '6px', flexWrap: 'wrap', justifyContent: 'center', marginBottom: '16px', maxWidth: '400px' } });
    for (const c of CHARACTERS) {
      const active = selectedChar === c.id;
      const btn = el('button', {
        style: {
          minWidth: '36px', padding: '4px 10px', fontSize: '12px',
          background: active ? 'var(--accent)' : 'transparent',
          color: active ? '#1a1416' : 'var(--text)',
          border: `1px solid ${active ? 'var(--accent)' : 'var(--border)'}`,
          borderRadius: '6px',
        },
        onClick: () => { selectedChar = c.id; rebuild(); },
      });
      btn.appendChild(artEl(CHARACTER_SVG[c.id], 16));
      btn.appendChild(document.createTextNode(` ${t(c.name)}`));
      charRow.appendChild(btn);
    }
    wrapper.appendChild(charRow);

    // Ascension selection
    if (unlockedMax > 0) {
      wrapper.appendChild(el('div', { style: { color: 'var(--muted)', fontSize: '12px', marginBottom: '6px' } }, `${t('등반 난이도')}: A${selectedAsc}`));
      const ascRow = el('div', { style: { display: 'flex', gap: '4px', flexWrap: 'wrap', justifyContent: 'center', marginBottom: '16px', maxWidth: '360px' } });
      for (let i = 0; i <= unlockedMax; i++) {
        const lvl = i;
        ascRow.appendChild(el('button', {
          style: {
            minWidth: '32px', padding: '3px 6px', fontSize: '12px',
            background: selectedAsc === lvl ? 'var(--accent)' : 'transparent',
            color: selectedAsc === lvl ? '#1a1416' : 'var(--text)',
            border: `1px solid ${selectedAsc === lvl ? 'var(--accent)' : 'var(--border)'}`,
            borderRadius: '6px',
          },
          onClick: () => { selectedAsc = lvl; rebuild(); },
        }, lvl === 0 ? t('기본') : `A${lvl}`));
      }
      wrapper.appendChild(ascRow);
    }

    // Modifier selection
    wrapper.appendChild(el('div', { style: { color: 'var(--muted)', fontSize: '12px', marginBottom: '6px' } }, `${t('제약 조건')} (${selectedMods.size}/3)`));
    const modGrid = el('div', { style: { display: 'flex', flexDirection: 'column', gap: '6px', width: '90%', maxWidth: '420px', marginBottom: '16px' } });
    for (const mod of CHALLENGE_MODIFIERS) {
      const active = selectedMods.has(mod.id);
      const row = el('button', {
        style: {
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          padding: '8px 12px',
          background: active ? 'rgba(128,192,96,0.15)' : 'transparent',
          border: `1px solid ${active ? 'var(--good)' : 'var(--border)'}`,
          borderRadius: '8px',
          color: 'var(--text)',
          textAlign: 'left',
        },
        onClick: () => {
          if (active) {
            selectedMods.delete(mod.id);
          } else if (selectedMods.size < 3) {
            selectedMods.add(mod.id);
          }
          rebuild();
        },
      });
      row.appendChild(el('div', {},
        el('span', { style: { fontWeight: 'bold', fontSize: '13px' } }, t(mod.name)),
        el('span', { style: { color: 'var(--muted)', fontSize: '12px', marginLeft: '8px' } }, t(mod.desc)),
      ));
      row.appendChild(el('span', { style: { color: active ? 'var(--good)' : 'var(--muted)' } }, active ? '✓' : ''));
      modGrid.appendChild(row);
    }
    wrapper.appendChild(modGrid);

    // Start button
    const canStart = selectedMods.size > 0;
    wrapper.appendChild(el('button', {
      style: {
        fontSize: '16px', padding: '14px 28px', marginBottom: '8px',
        opacity: canStart ? '1' : '0.5',
      },
      disabled: canStart ? undefined : true,
      onClick: () => {
        if (!canStart) return;
        playSfx('click');
        if (hasSave()) {
          const ok = confirm(t('진행 중인 런이 있습니다. 새 게임을 시작하면 기존 진행 상황이 삭제됩니다. 계속할까요?'));
          if (!ok) return;
          try { localStorage.removeItem('dod_save'); } catch { /* ignore */ }
        }
        const merged = mergeModifiers([...selectedMods].map((id) => CHALLENGE_MODIFIERS.find((m) => m.id === id)!));
        const seed = Math.floor(Math.random() * 1e9);
        startNewRun(seed, selectedAsc, selectedChar, {
          goToScreen: 'neow_blessing' as Screen,
          daily: { date: 'challenge', constraint: merged },
        });
      },
    }, canStart ? `${t('챌린지 시작')} (${selectedMods.size}${t('개 제약')})` : t('제약 조건을 선택하세요')));

    wrapper.appendChild(el('button', {
      style: { marginTop: '4px', background: 'transparent', color: 'var(--muted)', border: '1px solid var(--border)' },
      onClick: () => { playSfx('click'); setScreen('title'); },
    }, t('뒤로')));
  };

  append();
  return wrapper;
}

function mergeModifiers(mods: ChallengeModifier[]): ChallengeModifier {
  const merged: ChallengeModifier = {
    id: mods.map((m) => m.id).join('+'),
    name: mods.map((m) => m.name).join(' + '),
    desc: mods.map((m) => m.desc).join(' / '),
  };
  for (const m of mods) {
    if (m.hpMult !== undefined) merged.hpMult = (merged.hpMult ?? 1) * m.hpMult;
    if (m.enemyHpMult !== undefined) merged.enemyHpMult = (merged.enemyHpMult ?? 1) * m.enemyHpMult;
    if (m.bonusMaxEnergy !== undefined) merged.bonusMaxEnergy = (merged.bonusMaxEnergy ?? 0) + m.bonusMaxEnergy;
    if (m.handDrawDelta !== undefined) merged.handDrawDelta = (merged.handDrawDelta ?? 0) + m.handDrawDelta;
    if (m.startCurses !== undefined) merged.startCurses = (merged.startCurses ?? 0) + m.startCurses;
    if (m.disableUpgrade) merged.disableUpgrade = true;
    if (m.disableRemove) merged.disableRemove = true;
    if (m.noShop) merged.noShop = true;
    if (m.costIncrease !== undefined) merged.costIncrease = (merged.costIncrease ?? 0) + m.costIncrease;
    if (m.enemyStrBonus !== undefined) merged.enemyStrBonus = (merged.enemyStrBonus ?? 0) + m.enemyStrBonus;
    if (m.startStr !== undefined) merged.startStr = (merged.startStr ?? 0) + m.startStr;
  }
  return merged;
}
