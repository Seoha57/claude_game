import { el } from './dom';
import { getRun, setScreen, makeCard } from '../state';
import { getEffectiveDef, canUpgrade } from '../content/cards';
import { getModifiers } from '../ascension';
import { isCurseLike } from './deck-overlay';
import { playSfx } from '../audio';
import type { CardInstance } from '../types';

type RestMode = 'choose' | 'purge' | 'smith' | 'dup';

export function renderRest(): HTMLElement {
  const wrapper = el('div', { class: 'rest-screen' });
  let mode: RestMode = 'choose';

  const goTo = (next: RestMode) => {
    mode = next;
    rebuild();
  };

  const rebuild = () => {
    wrapper.innerHTML = '';
    if (mode === 'choose') {
      wrapper.appendChild(buildChoose(goTo));
    } else if (mode === 'purge') {
      wrapper.appendChild(buildPurge(() => goTo('choose')));
    } else if (mode === 'smith') {
      wrapper.appendChild(buildSmith(() => goTo('choose')));
    } else {
      wrapper.appendChild(buildDuplicate(() => goTo('choose')));
    }
  };

  rebuild();
  return wrapper;
}

function buildChoose(goTo: (m: RestMode) => void): HTMLElement {
  const run = getRun();
  const mods = getModifiers(run.ascension);
  const healAmount = Math.floor(run.player.maxHp * mods.restHealMult);
  const noUpgrade = !!run.dailyConfig?.disableUpgrade;
  const noRemove = !!run.dailyConfig?.disableRemove;

  return el(
    'div',
    { style: { display: 'contents' } },
    el('h2', { style: { color: 'var(--accent)' } }, '🔥 모닥불'),
    el('div', { style: { color: 'var(--muted)' } }, '한 가지를 선택하세요'),
    el(
      'div',
      { style: { display: 'flex', gap: '16px', flexWrap: 'wrap', justifyContent: 'center' } },
      el('button', {
        onClick: () => {
          run.player.hp = Math.min(run.player.maxHp, run.player.hp + healAmount);
          setScreen('map');
        },
      }, `휴식 (HP +${healAmount})`),
      el('button', {
        ...(noUpgrade ? { disabled: 'true', title: '데일리 제약: 강화 봉인' } : {}),
        style: noUpgrade ? { opacity: '0.45', cursor: 'not-allowed' } : {},
        onClick: () => { if (!noUpgrade) goTo('smith'); },
      }, noUpgrade ? '🔒 대장간 (강화 봉인)' : `대장간 (카드 강화 · 덱 ${run.player.deck.length}장)`),
      el('button', {
        ...(noRemove ? { disabled: 'true', title: '데일리 제약: 정화 봉인' } : {}),
        style: noRemove ? { opacity: '0.45', cursor: 'not-allowed' } : {},
        onClick: () => { if (!noRemove) goTo('purge'); },
      }, noRemove ? '🔒 정화 (정화 봉인)' : `정화 (카드 제거 · 덱 ${run.player.deck.length}장)`),
      el('button', {
        onClick: () => goTo('dup'),
      }, `복제 (카드 복제 · 덱 ${run.player.deck.length}장)`),
    ),
  );
}

function buildDuplicate(onBack: () => void): HTMLElement {
  const run = getRun();

  // Filter out curses (no point duplicating)
  const dupable = run.player.deck.filter((c) => !isCurseLike(getEffectiveDef(c).id));

  const cardRow = el('div', { class: 'rest-card-row' });
  for (const card of sortForUpgrade(dupable)) {
    cardRow.appendChild(renderCardChoice(card, () => {
      const copy = makeCard(card.defId);
      if (card.upgraded) copy.upgraded = card.upgraded;
      run.player.deck.push(copy);
      playSfx('upgrade');
      setScreen('map');
    }));
  }

  return el(
    'div',
    { style: { display: 'contents' } },
    el('h2', { style: { color: 'var(--accent)' } }, '🔮 복제'),
    el(
      'div',
      { style: { color: 'var(--muted)', marginBottom: '16px' } },
      dupable.length === 0
        ? '복제할 카드가 없습니다.'
        : '복제할 카드 1장을 선택하세요. 같은 카드 1장이 덱에 추가됩니다.',
    ),
    cardRow,
    el('button', { style: { marginTop: '16px' }, onClick: onBack }, '← 뒤로'),
  );
}

function buildPurge(onBack: () => void): HTMLElement {
  const run = getRun();
  // 덱이 1장 이하면 제거 불가 (빈 덱 진입 방지)
  const canRemove = run.player.deck.length > 1;

  const cardRow = el('div', { class: 'rest-card-row' });
  if (canRemove) {
    for (const card of sortForRemoval(run.player.deck)) {
      cardRow.appendChild(renderCardChoice(card, () => {
        if (run.player.deck.length <= 1) return;
        const idx = run.player.deck.findIndex((c) => c.uid === card.uid);
        if (idx >= 0) run.player.deck.splice(idx, 1);
        setScreen('map');
      }));
    }
  }

  return el(
    'div',
    { style: { display: 'contents' } },
    el('h2', { style: { color: 'var(--accent)' } }, '🔥 정화'),
    el('div', { style: { color: 'var(--muted)', marginBottom: '16px' } },
      canRemove ? '제거할 카드 1장을 선택하세요' : '덱이 너무 작아 제거할 수 없습니다.'),
    cardRow,
    el('button', { style: { marginTop: '16px' }, onClick: onBack }, '← 뒤로'),
  );
}

function buildSmith(onBack: () => void): HTMLElement {
  const run = getRun();
  const upgradable = run.player.deck.filter((c) => canUpgrade(c));

  const cardRow = el('div', { class: 'rest-card-row' });
  for (const card of sortForUpgrade(upgradable)) {
    cardRow.appendChild(buildSmithCard(card));
  }

  return el(
    'div',
    { style: { display: 'contents' } },
    el('h2', { style: { color: 'var(--accent)' } }, '🔨 대장간'),
    el(
      'div',
      { style: { color: 'var(--muted)', marginBottom: '16px' } },
      upgradable.length === 0
        ? '강화 가능한 카드가 없습니다.'
        : '강화할 카드 1장을 선택하세요',
    ),
    cardRow,
    el('button', { style: { marginTop: '16px' }, onClick: onBack }, '← 뒤로'),
  );
}

function renderCardChoice(card: CardInstance, onClick: () => void): HTMLElement {
  const def = getEffectiveDef(card);
  const curse = isCurseLike(def.id);
  return el(
    'div',
    {
      class: `card ${def.type} rarity-${def.rarity} ${curse ? 'curse' : ''}`,
      style: { cursor: 'pointer' },
      onClick,
    },
    el('div', { class: 'card-cost' }, String(def.cost)),
    el('div', { class: 'card-name' }, def.name),
    el('div', { class: 'card-desc' }, def.description),
    el('div', { class: 'card-type' }, curse ? '저주' : typeLabel(def.type)),
  );
}

function buildSmithCard(card: CardInstance): HTMLElement {
  const baseDef = getEffectiveDef(card);
  const nextLevel = (card.upgraded ?? 0) + 1;
  const upgradedView = getEffectiveDef({ ...card, upgraded: nextLevel });
  const isDouble = nextLevel === 2;

  const costEl = el('div', { class: 'card-cost' }, String(baseDef.cost));
  const nameEl = el('div', { class: 'card-name' }, baseDef.name);
  const descEl = el('div', { class: 'card-desc' }, baseDef.description);
  const typeEl = el('div', { class: 'card-type' }, typeLabel(baseDef.type));
  const previewBadge = el(
    'div',
    { class: 'upgrade-preview-badge' },
    isDouble ? '★★ 이중 강화 (탭하여 확정)' : '✦ 강화 미리보기 (탭하여 확정)',
  );
  previewBadge.style.display = 'none';

  let previewing = false;
  const showPreview = () => {
    if (previewing) return;
    previewing = true;
    costEl.textContent = String(upgradedView.cost);
    nameEl.textContent = upgradedView.name;
    descEl.textContent = upgradedView.description;
    typeEl.textContent = typeLabel(upgradedView.type);
    cardEl.classList.add('upgrading');
    previewBadge.style.display = '';
  };
  const hidePreview = () => {
    if (!previewing) return;
    previewing = false;
    costEl.textContent = String(baseDef.cost);
    nameEl.textContent = baseDef.name;
    descEl.textContent = baseDef.description;
    typeEl.textContent = typeLabel(baseDef.type);
    cardEl.classList.remove('upgrading');
    previewBadge.style.display = 'none';
  };

  const cardEl = el(
    'div',
    {
      class: `card ${baseDef.type} rarity-${baseDef.rarity} smith-card ${isDouble ? 'plusplus-target' : ''}`,
      style: { cursor: 'pointer' },
      onClick: () => {
        // 1st tap (touch) → preview. 2nd tap → confirm.
        // On desktop, hover already triggered preview, so first click confirms.
        if (!previewing) {
          // Hide previews on any other smith cards so only one shows at a time.
          document.querySelectorAll('.smith-card.upgrading').forEach((other) => {
            if (other !== cardEl) (other as HTMLElement).dispatchEvent(new CustomEvent('smith:reset'));
          });
          showPreview();
          return;
        }
        card.upgraded = nextLevel;
        playSfx('upgrade');
        setScreen('map');
      },
    },
    costEl,
    nameEl,
    descEl,
    typeEl,
    previewBadge,
  );

  cardEl.addEventListener('mouseenter', showPreview);
  cardEl.addEventListener('mouseleave', hidePreview);
  cardEl.addEventListener('smith:reset', hidePreview);

  return cardEl;
}

// ── Sort helpers ──
function sortForRemoval(cards: CardInstance[]): CardInstance[] {
  return [...cards].sort((a, b) => {
    const da = getEffectiveDef(a);
    const db = getEffectiveDef(b);
    const ca = isCurseLike(da.id) ? 0 : 1;
    const cb = isCurseLike(db.id) ? 0 : 1;
    if (ca !== cb) return ca - cb;
    const order = { attack: 0, skill: 1, power: 2 } as const;
    const oa = order[da.type] ?? 3;
    const ob = order[db.type] ?? 3;
    if (oa !== ob) return oa - ob;
    return da.cost - db.cost;
  });
}

function sortForUpgrade(cards: CardInstance[]): CardInstance[] {
  return [...cards].sort((a, b) => {
    const da = getEffectiveDef(a);
    const db = getEffectiveDef(b);
    const order = { attack: 0, skill: 1, power: 2 } as const;
    const oa = order[da.type] ?? 3;
    const ob = order[db.type] ?? 3;
    if (oa !== ob) return oa - ob;
    return da.cost - db.cost;
  });
}

function typeLabel(t: string): string {
  if (t === 'attack') return '공격';
  if (t === 'skill') return '스킬';
  return '파워';
}
