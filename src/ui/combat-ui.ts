import { el } from './dom';
import { getRunOrNull, getScreen, getCombatOrNull } from '../state';
import { RELIC_DEFS, getActiveSynergies } from '../content/relics';
import { getCombat, setScreen, rerender } from '../state';
import { getEffectiveDef } from '../content/cards';
import { openDeckOverlay } from './deck-overlay';
import { ENEMY_DEFS } from '../content/enemies';
import { usePotion } from '../run/rules';
import { STATUS_INFO, modifiedAttackDamage, getStatusValueLabel, getStatusTooltip } from '../combat/statuses';
import { kwDesc, STATUS_ICON } from './keywords';
import { ENEMY_SVG, POTION_SVG, RELIC_SVG, ic } from './art';
import { buildIntentDisplay } from '../combat/intent';
import { endPlayerTurn } from '../combat/combat';
import { playCard, modifyAttackAmount } from '../combat/effects';
import type { CardInstance, CombatState, Enemy } from '../types';
import { POTION_DEFS } from '../content/potions';
import { isCurseLike } from './deck-overlay';
import { playSfx, getMuted, setMuted, getVolume, setVolume, getBgmMuted, setBgmMuted, getBgmVolume, setBgmVolume } from '../audio';
import { checkBlock, checkTurnCount, checkStrength, checkFreezeChain, checkPoison, checkGlassCannon, checkExhaust } from '../achievements';
import { t } from '../i18n';
import { getCardFrame } from '../card-frame';
import { renderCombatVictory } from './combat-victory';
import { snapshotFx, detectFx, detectEnemyTurnFx, flushFx, flushEnemyTurnFx, spawnCardPlayAnim, resetFx } from './combat-fx';
import { getSettings } from '../game-settings';

function playCost(baseCost: number): number {
  const run = getRunOrNull();
  return baseCost + (run?.dailyConfig?.costIncrease ?? 0);
}
import { isTutorialDone, showTutorialOverlay } from './tutorial-overlay';

let selectedCardUid: string | null = null;
let selectedPotionId: string | null = null;
let hoveredCardUid: string | null = null;

// 새 전투 시작 시 전투 UI 모듈 상태를 초기화한다.
// (전역 변수들이 이전 전투의 잔여 상태를 들고 가는 것을 방지)
export function resetCombatUiState(): void {
  selectedCardUid = null;
  selectedPotionId = null;
  hoveredCardUid = null;
  previousHandUids = new Set<string>();
  targetedEnemyIdx = 0;
  lastPhasePlayed = null;
  resetFx();
  prevStatusKeys.clear();
}

// Compute damage preview for a card against a specific enemy.
// 플레이어 힘/약화 + 적 취약을 반영. 콤보 조건이 현재 충족되면 보너스 데미지도,
// 스케일링 카드는 현재 카운터 기준 데미지도 포함. 방어도는 빼지 않음.
function computeCardDamageVsEnemy(card: CardInstance, state: CombatState, enemy: Enemy): number {
  const def = getEffectiveDef(card);
  const player = state.player;
  let total = 0;
  // 공격 카드를 내면 attackCount가 먼저 +1 되고, 그 값이 카드의 모든 타격에 공통 적용된다.
  const previewAc = (state.flags.attackCount ?? 0) + (def.type === 'attack' ? 1 : 0);
  const addDamage = (amount: number, times = 1) => {
    const withRelics = modifyAttackAmount(state, amount, previewAc);
    total += modifiedAttackDamage(withRelics, player as any, enemy) * times;
  };
  const dice = state.flags.diceRoll ?? 1;
  for (const eff of def.effects) {
    if (eff.kind === 'damage') {
      addDamage(eff.amount, eff.times ?? 1);
    } else if (eff.kind === 'damage_all') {
      addDamage(eff.amount);
    } else if (eff.kind === 'damage_dice') {
      addDamage(eff.base * dice, eff.times ?? 1);
    } else if (eff.kind === 'damage_all_dice') {
      addDamage(eff.base * dice);
    } else if (eff.kind === 'lifesteal') {
      addDamage(eff.amount, eff.times ?? 1);
    } else if (eff.kind === 'lifesteal_all') {
      addDamage(eff.amount);
    } else if (eff.kind === 'damage_per_attack') {
      addDamage(eff.amount * (state.flags.attackCount ?? 0));
    } else if (eff.kind === 'damage_per_card_this_turn') {
      addDamage(eff.amount * ((state.flags.cardsPlayedThisTurn ?? 0) + 1));
    } else if (eff.kind === 'conditional' && previewConditionMet(state, eff.condition)) {
      for (const sub of eff.then) {
        if (sub.kind === 'damage') addDamage(sub.amount, sub.times ?? 1);
        else if (sub.kind === 'damage_all') addDamage(sub.amount);
        else if (sub.kind === 'damage_dice') addDamage(sub.base * dice, sub.times ?? 1);
        else if (sub.kind === 'damage_all_dice') addDamage(sub.base * dice);
      }
    }
  }
  return total;
}

// 미리보기용 콤보 조건 평가 — 이 카드를 내면 cardsPlayedThisTurn이 +1 되므로
// 그 시점 기준으로 판단 (effects.ts의 실제 평가와 동일하게 맞춤).
function previewConditionMet(state: CombatState, cond: any): boolean {
  const playedAfter = (state.flags.cardsPlayedThisTurn ?? 0) + 1;
  if (cond.kind === 'nth_or_more') return playedAfter >= cond.n;
  if (cond.kind === 'first_this_turn') return playedAfter === 1;
  if (cond.kind === 'after_type') return state.flags.lastPlayedType === cond.type;
  return false;
}

function onCardHover(uid: string | null): void {
  hoveredCardUid = uid;
  updateDamagePreviews();
}

function updateDamagePreviews(): void {
  // Clear existing previews
  document.querySelectorAll('.dmg-preview').forEach((el) => el.remove());
  if (!hoveredCardUid) return;
  const state = getCombatOrNull();
  if (!state || state.phase !== 'player') return;
  const card = state.player.hand.find((c) => c.uid === hoveredCardUid);
  if (!card) return;
  const def = getEffectiveDef(card);
  // Only show damage preview for cards that deal damage to enemies
  const showsOnAll = def.target === 'all_enemies' || def.target === 'random_enemy';
  const showsOnEnemyTarget = def.target === 'enemy';
  if (!showsOnAll && !showsOnEnemyTarget) return;

  for (const e of state.enemies) {
    if (e.hp <= 0) continue;
    const dmg = computeCardDamageVsEnemy(card, state, e);
    if (dmg <= 0) continue;
    const enemyEl = document.querySelector(`[data-enemy-uid="${e.uid}"]`);
    if (!enemyEl) continue;
    const preview = document.createElement('div');
    preview.className = 'dmg-preview';
    preview.textContent = `↦ ${dmg}`;
    enemyEl.appendChild(preview);
  }
}

export { ENEMY_SVG as ENEMY_ART };

let lastPhasePlayed: string | null = null;

export function renderCombat(): HTMLElement {
  const state = getCombat();
  // 턴 시작 직접 데미지(마탑의 결정/폭풍의 핵)나 도트로 마지막 적이
  // 플레이어 행동 없이 죽었을 수 있으니 렌더 전에 승리 판정을 한 번 더 한다.
  if (state.phase === 'player' && state.enemies.every((e) => e.hp <= 0)) {
    state.phase = 'won';
  }
  // Achievement spot checks (idempotent)
  checkCombatAchievements(state);
  if (state.phase === 'won') {
    if (lastPhasePlayed !== 'won') {
      playSfx('victory');
      checkTurnCount(state.turn);
      checkGlassCannon(state.player.hp);
      checkExhaust(state.player.exhaust.length);
      lastPhasePlayed = 'won';
    }
    return renderCombatVictory(state);
  }
  if (state.phase === 'lost') {
    if (lastPhasePlayed !== 'lost') { playSfx('defeat'); lastPhasePlayed = 'lost'; }
    const run = getRunOrNull();
    setTimeout(() => setScreen(run?.endless ? 'endless_result' : 'lose'), 0);
    return el('div', { class: `combat-screen ch-${(run?.chapter ?? 1)}` });
  }
  // Reset for next combat
  if (state.phase === 'player' && lastPhasePlayed !== null) lastPhasePlayed = null;

  // Clear hover state if hovered card is no longer in hand (was played, discarded, etc.)
  if (hoveredCardUid && !state.player.hand.some((c) => c.uid === hoveredCardUid)) {
    hoveredCardUid = null;
  }
  // Re-apply damage previews after DOM mount
  requestAnimationFrame(updateDamagePreviews);

  // 첫 전투 첫 턴에 튜토리얼 오버레이
  if (state.turn === 1 && !isTutorialDone()) {
    requestAnimationFrame(() => showTutorialOverlay());
  }

  const run = getRunOrNull();
  const ch = run?.chapter ?? 1;
  const screen = el(
    'div',
    { class: `combat-screen ch-${ch}` },
    renderTop(state),
    renderMid(state),
    el('div', { class: 'combat-hand-row' },
      renderHand(state),
      renderDeckPile(state),
    ),
  );

  // Swipe-left to end turn (mobile) — skip if touch started in hand area
  let touchStartX = 0;
  let touchStartY = 0;
  let touchInHand = false;
  screen.addEventListener('touchstart', (e) => {
    touchStartX = e.touches[0].clientX;
    touchStartY = e.touches[0].clientY;
    touchInHand = !!(e.target as Element)?.closest?.('.combat-bottom');
  }, { passive: true });
  screen.addEventListener('touchend', (e) => {
    if (touchInHand) return;
    const dx = e.changedTouches[0].clientX - touchStartX;
    const dy = e.changedTouches[0].clientY - touchStartY;
    if (dx < -80 && Math.abs(dy) < 60 && state.phase === 'player') {
      screen.classList.add('swipe-flash');
      endPlayerTurn(state);
      rerender();
    }
  }, { passive: true });

  return screen;
}

function renderTop(state: CombatState): HTMLElement {
  const enemiesEl = el('div', { class: 'enemies' });
  const enemyRow = el('div', { style: { display: 'flex', gap: '32px' } });
  for (let i = 0; i < state.enemies.length; i++) {
    const enemyEl = renderEnemy(state, state.enemies[i]);
    if (state.turn === 1 && state.enemies[i].hp > 0) {
      enemyEl.classList.add('enemy-intro');
      enemyEl.style.animationDelay = `${i * 120}ms`;
    }
    enemyRow.appendChild(enemyEl);
  }
  enemiesEl.appendChild(enemyRow);

  const log = el('div', { class: 'combat-log' });
  // 적 턴 요약: "── 턴 N" 마커 이후 로그를 하이라이트
  const turnMarkerPrefix = `── 턴 `;
  const recent = state.log.slice(-16);
  let inEnemySection = false;
  for (const entry of recent) {
    if (entry.startsWith(turnMarkerPrefix)) inEnemySection = true;
    else if (entry === '── 플레이어 턴 ──') inEnemySection = false;
    const cls = inEnemySection ? 'entry enemy-log' : 'entry';
    log.appendChild(el('div', { class: cls }, entry));
  }

  return el('div', { class: 'combat-top' }, enemiesEl, log);
}

function renderEnemy(state: CombatState, e: Enemy): HTMLElement {
  const def = ENEMY_DEFS[e.defId];
  const dead = e.hp <= 0;
  const targetable =
    !dead &&
    ((selectedCardUid !== null && isCardEnemyTargeted(getSelectedCard(state))) ||
     (selectedPotionId !== null));

  const art = el('div', { class: 'enemy-art' });
  art.innerHTML = ENEMY_SVG[e.defId] ?? '👤';

  const enemyHpPct = e.hp / e.maxHp;
  const hpFill = el('div', { class: 'fill', style: { width: `${enemyHpPct * 100}%` } });
  const enemyLowHp = e.hp > 0 && enemyHpPct <= 0.3;
  const hpBar = el(
    'div',
    { class: `hp-bar ${enemyLowHp ? 'low-hp' : ''}` },
    hpFill,
    (() => { const d = el('div', { class: 'text' }); d.innerHTML = `${e.hp}/${e.maxHp}${e.block > 0 ? ` ${ic('shield')}${e.block}` : ''}`; return d; })(),
  );

  const intent = e.intent;
  const display = buildIntentDisplay(intent, e, state.player);
  const isAttack = intent.kind === 'attack' || intent.kind === 'attack_block' || intent.kind === 'attack_buff';

  // Perfect guard: total damage from this intent ≤ player's current block
  // 실제 데미지 함수(modifiedAttackDamage)를 그대로 써서 반올림까지 일치시킨다.
  const perTickDmg = intent.damage !== undefined
    ? modifiedAttackDamage(intent.damage, e as any, state.player as any)
    : 0;
  const totalIncoming = perTickDmg * (intent.hits ?? 1);
  const perfectGuard = isAttack && totalIncoming > 0 && state.player.block >= totalIncoming;

  const dangerHit = isAttack && !perfectGuard && totalIncoming >= 20;
  const intentEl = el(
    'div',
    {
      class: `intent ${intent.kind === 'block' ? 'block' : ''} ${
        intent.kind === 'buff' ? 'buff' : ''
      } ${intent.kind === 'debuff' ? 'debuff' : ''} ${perfectGuard ? 'perfect-guard' : ''} ${dangerHit ? 'danger-hit' : ''}`,
      'data-tooltip': perfectGuard ? t('안전: 방어도로 모두 막힘') : dangerHit ? t('큰 한방 — 대비하세요') : '',
    },
    isAttack
      ? el(
          'span',
          {},
          `${display.symbol} `,
          el('span', { class: `intent-dmg ${display.modClass}` }, display.damageText),
          display.totalText,
          display.suffix,
          perfectGuard ? el('span', { class: 'guard-mark' }, ' ✓') : el('span'),
        )
      : `${display.symbol} ${display.fallbackLabel}`,
  );

  const statuses = renderStatuses(e.statuses, e.uid);
  const freezeImm = e.freezeImmuneTurns ?? 0;
  if (freezeImm > 0) {
    const badge = el('div', { class: 'status buff st-freeze-immune', 'data-tooltip': `${t('빙결 면역')}: ${freezeImm}${t('턴 남음')}\n${t('빙결 해제 후 일정 턴 동안 빙결에 걸리지 않습니다.')}` });
    badge.innerHTML = `${ic('shield')} ${t('빙결 면역')} ${freezeImm}`;
    statuses.appendChild(badge);
  }

  const kbTargeted = getKeyboardTargetedEnemyUid(state) === e.uid;
  const enemyEl = el(
    'div',
    {
      class: `enemy ${dead ? 'dead' : ''} ${targetable ? 'targetable' : ''} ${kbTargeted ? 'kb-targeted' : ''} ${ENEMY_DEFS[e.defId]?.isBoss ? 'is-boss' : ''}`,
      'data-enemy-uid': e.uid,
      onClick: () => {
        if (!targetable || dead) return;
        if (selectedPotionId) {
          applyPotionEnemy(state, selectedPotionId, e);
          selectedPotionId = null;
          rerender();
        } else if (selectedCardUid) {
          playSelectedCard(e);
        }
      },
    },
    intentEl,
    art,
    el('div', { class: 'enemy-name' }, def.name),
    hpBar,
    statuses,
  );

  return enemyEl;
}

const prevStatusKeys = new Map<string, Set<string>>();

function renderStatuses(s: Record<string, number | undefined>, ownerId = '_player'): HTMLElement {
  const row = el('div', { class: 'statuses' });
  const prev = prevStatusKeys.get(ownerId) ?? new Set();
  const cur = new Set<string>();
  for (const [k, v] of Object.entries(s)) {
    if (!v) continue;
    const info = STATUS_INFO[k as keyof typeof STATUS_INFO];
    if (!info) continue;
    cur.add(k);
    const key = k as keyof typeof STATUS_INFO;
    const isNew = !prev.has(k);
    const icon = STATUS_ICON[key] ?? '';
    const statusEl = el(
      'div',
      {
        class: `status ${info.buff ? 'buff' : 'debuff'} st-${key} ${isNew ? 'status-new' : ''}`,
        'data-tooltip': getStatusTooltip(key, v),
      },
    );
    statusEl.innerHTML = `${icon} ${info.name} ${getStatusValueLabel(key, v)}`;
    row.appendChild(statusEl);
  }
  prevStatusKeys.set(ownerId, cur);
  return row;
}

function renderMid(state: CombatState): HTMLElement {
  const p = state.player;
  const energy = el('div', { class: 'energy-orb' }, `${p.energy}`);

  const hpPct = p.hp / p.maxHp;
  const hpFill = el('div', {
    class: 'fill',
    style: { width: `${hpPct * 100}%` },
  });
  const lowHp = p.hp > 0 && hpPct <= 0.3;
  const hpBar = el(
    'div',
    { class: `hp-bar ${lowHp ? 'low-hp' : ''}`, style: { width: '180px' } },
    hpFill,
    el('div', { class: 'text' }, `${p.hp}/${p.maxHp}`),
  );

  const blockBadge = p.block > 0 ? (() => { const d = el('span', { class: 'block-badge' }); d.innerHTML = `${ic('shield')} ${p.block}`; return d; })() : el('span');

  const run = getRunOrNull();
  const goldBadge = (() => { const d = el('span', { class: 'gold-badge' }); d.innerHTML = `${ic('gold')} ${run?.player.gold ?? 0}`; return d; })();

  const diceBadge = run?.characterClass === 'gambler' && state.flags.diceRoll
    ? (() => {
        const cls = state.flags.diceRoll! >= 5 ? 'dice-high' : state.flags.diceRoll! <= 1 ? 'dice-low' : '';
        const badge = el('span', {
          class: `dice-badge ${cls}`,
          'data-tooltip': `${t('이번 턴 주사위')}: ${state.flags.diceRoll}${state.flags.fixedDice ? `\n${t('다음 턴 고정')}: ${state.flags.fixedDice}` : ''}${state.flags.diceReroll ? `\n${t('리롤 활성')}` : ''}${state.flags.diceMinimum ? `\n${t('최솟값')}: ${state.flags.diceMinimum}` : ''}`,
        });
        badge.innerHTML = `🎲 ${state.flags.diceRoll}${state.flags.fixedDice ? ` <span class="dice-next">→${state.flags.fixedDice}</span>` : ''}`;
        return badge;
      })()
    : null;

  const playerStats = el(
    'div',
    { class: 'player-stats' },
    energy,
    ...(diceBadge ? [diceBadge] : []),
    hpBar,
    blockBadge,
    goldBadge,
    renderStatuses(p.statuses),
  );

  const pileLink = (label: string, cards: typeof p.draw, opts: { shuffleHint?: boolean } = {}) =>
    el('span', {
      class: 'pile-link',
      onClick: () => openDeckOverlay(cards, { title: label, shuffleHint: opts.shuffleHint, emptyText: t('비어있습니다.') }),
    }, `${label}: ${cards.length}`);

  const piles = el(
    'div',
    { class: 'pile-counts' },
    pileLink(t('덱'), p.draw, { shuffleHint: true }),
    pileLink(t('버림'), p.discard),
    pileLink(t('소멸'), p.exhaust),
    el('span', {
      class: 'pile-link',
      onClick: () => openDeckOverlay(p.deck, { title: t('덱') }),
    }, t('덱')),
  );

  // 낭비 경고: 사용 가능한 카드가 있는데 턴 끝내려 하면 한 번 흔들어 알림
  const hasPlayable = state.player.hand.some((c) => {
    const def = getEffectiveDef(c);
    return state.player.energy >= playCost(def.cost) && !isCurseLike(def.id);
  });
  const endTurn = el(
    'button',
    {
      class: `end-turn-btn ${hasPlayable && state.player.energy > 0 ? 'warn' : ''}`,
      onClick: (ev: MouseEvent) => {
        const btn = ev.currentTarget as HTMLElement;
        // First click on a wasteful turn: shake + arm; second click within 2s: proceed
        if (hasPlayable && state.player.energy > 0 && !btn.dataset.armed) {
          btn.classList.remove('shake');
          void btn.offsetWidth;
          btn.classList.add('shake');
          btn.dataset.armed = '1';
          btn.title = t('에너지가 남았어요. 한 번 더 누르면 턴이 끝납니다.');
          setTimeout(() => {
            btn.classList.remove('shake');
            delete btn.dataset.armed;
            btn.title = '';
          }, 2000);
          return;
        }
        selectedCardUid = null;
        playSfx('turn_end');
        const before = snapshotFx(state);
        endPlayerTurn(state);
        detectEnemyTurnFx(state, before);
        rerender();
        flushEnemyTurnFx();
      },
    },
    t('턴 종료'),
    el('span', { class: 'kbd-hint' }, '(E)'),
  );

  const relicBar = run ? renderRelicBar(run.player.relics) : el('div');
  const potionBar = renderPotionBar(state);

  const gearBtn = el('button', {
    class: 'combat-gear',
    onClick: (e: Event) => {
      e.stopPropagation();
      const existing = document.querySelector('.combat-audio-panel');
      if (existing) { existing.remove(); return; }
      const panel = buildAudioPanel();
      document.getElementById('app')!.appendChild(panel);
    },
  });
  gearBtn.innerHTML = ic('gear');

  const helpBtn = el('button', {
    class: 'combat-help',
    title: t('도움말'),
    onClick: (e: Event) => {
      e.stopPropagation();
      setScreen('help');
    },
  }, '?');

  return el('div', { class: 'combat-mid' }, playerStats, relicBar, potionBar, piles, endTurn, helpBtn, gearBtn);
}

function buildAudioPanel(): HTMLElement {
  const overlay = el('div', { class: 'combat-audio-panel' });
  overlay.addEventListener('click', (e) => { if (e.target === overlay) overlay.remove(); });

  const box = el('div', { class: 'combat-audio-box' });

  const rebuild = () => {
    box.innerHTML = '';
    const muted = getMuted();
    box.appendChild(el('button', {
      class: 'audio-toggle',
      onClick: () => { setMuted(!getMuted()); if (!getMuted()) playSfx('click'); rebuild(); },
    }, muted ? `🔇 ${t('음소거')}` : `🔊 ${t('음향 ON')}`));
    if (!muted) {
      box.appendChild(el('input', {
        type: 'range', min: '0', max: '100',
        value: String(Math.round(getVolume() * 100)),
        class: 'volume-slider',
        onInput: (e: Event) => setVolume(parseInt((e.target as HTMLInputElement).value, 10) / 100),
      }));
    }
    const bgmM = getBgmMuted();
    box.appendChild(el('button', {
      class: 'audio-toggle',
      onClick: () => { setBgmMuted(!getBgmMuted()); rebuild(); },
    }, bgmM ? '🎵 BGM OFF' : '🎵 BGM ON'));
    if (!bgmM) {
      box.appendChild(el('input', {
        type: 'range', min: '0', max: '100',
        value: String(Math.round(getBgmVolume() * 100)),
        class: 'volume-slider',
        onInput: (e: Event) => setBgmVolume(parseInt((e.target as HTMLInputElement).value, 10) / 100),
      }));
    }
    box.appendChild(el('button', {
      style: { fontSize: '12px', padding: '6px 16px', marginTop: '4px' },
      onClick: () => overlay.remove(),
    }, t('닫기')));
  };

  rebuild();
  overlay.appendChild(box);
  return overlay;
}

// Preserve hand scroll position across rerenders
let savedHandScroll = 0;
// Track which card UIDs were in hand last render — newly drawn cards animate in
let previousHandUids = new Set<string>();

function renderHand(state: CombatState): HTMLElement {
  const hand = el('div', { class: 'combat-bottom' });
  hand.addEventListener('scroll', () => { savedHandScroll = hand.scrollLeft; });
  const inner = el('div', { class: 'hand-cards' });
  const newHandUids = new Set<string>();
  state.player.hand.forEach((c, i) => {
    const isFresh = !previousHandUids.has(c.uid);
    newHandUids.add(c.uid);
    const cardEl = renderCard(state, c, i);
    if (isFresh) {
      cardEl.classList.add('card-fresh');
      cardEl.style.animationDelay = `${i * 55}ms`;
      const capturedIdx = i;
      requestAnimationFrame(() => spawnDrawFromDeck(cardEl, capturedIdx * 55));
    }
    inner.appendChild(cardEl);
  });
  // Fan spread: apply subtle rotation when 3+ cards in hand
  const count = state.player.hand.length;
  if (count >= 3) {
    const cards = inner.children;
    for (let i = 0; i < cards.length; i++) {
      const card = cards[i] as HTMLElement;
      const angle = (i - (count - 1) / 2) * 3;
      const yOff = Math.abs(i - (count - 1) / 2) * 4;
      card.style.transform = `rotate(${angle}deg) translateY(${yOff}px)`;
      card.style.transformOrigin = 'bottom center';
    }
  }
  hand.appendChild(inner);
  previousHandUids = newHandUids;
  // Restore on next frame so the layout is settled
  requestAnimationFrame(() => { hand.scrollLeft = savedHandScroll; });
  return hand;
}

function renderDeckPile(state: CombatState): HTMLElement {
  const count = state.player.draw.length;
  const frame = getCardFrame();
  const pile = el('div', {
    class: `deck-pile frame-${frame}`,
    'data-tooltip': `${t('드로우 더미')}: ${count}${t('장')}`,
    onClick: () => openDeckOverlay(state.player.draw, { title: t('드로우'), shuffleHint: true, emptyText: t('비어있습니다.') }),
  });
  const stackCount = Math.min(count, 5);
  for (let i = 0; i < stackCount; i++) {
    const isTop = i === stackCount - 1;
    const card = el('div', { class: `deck-pile-card${isTop ? ' top' : ''}`, style: { bottom: `${i * 3}px` } });
    pile.appendChild(card);
  }
  pile.appendChild(el('div', { class: 'deck-pile-count' }, String(count)));
  return pile;
}

function spawnDrawFromDeck(cardEl: HTMLElement, delay: number): void {
  const deckEl = document.querySelector('.deck-pile');
  if (!deckEl) return;
  const deckRect = deckEl.getBoundingClientRect();
  const flyCard = document.createElement('div');
  flyCard.className = 'deck-fly-card';
  flyCard.style.left = `${deckRect.left + deckRect.width / 2 - 40}px`;
  flyCard.style.top = `${deckRect.top + deckRect.height / 2 - 55}px`;
  flyCard.style.animationDelay = `${delay}ms`;
  document.body.appendChild(flyCard);
  setTimeout(() => {
    const targetRect = cardEl.getBoundingClientRect();
    if (targetRect.width === 0) { flyCard.remove(); return; }
    const dx = targetRect.left + targetRect.width / 2 - 40 - parseFloat(flyCard.style.left);
    const dy = targetRect.top + targetRect.height / 2 - 55 - parseFloat(flyCard.style.top);
    flyCard.style.setProperty('--fly-dx', `${dx}px`);
    flyCard.style.setProperty('--fly-dy', `${dy}px`);
    flyCard.classList.add('flying');
    setTimeout(() => flyCard.remove(), 400 + delay);
  }, 10 + delay);
}

function renderCard(state: CombatState, c: CardInstance, idx: number): HTMLElement {
  const def = getEffectiveDef(c);
  const inPlayerPhase = state.phase === 'player';
  const cost = playCost(def.cost);
  const curse = isCurseLike(def.id);
  const canAfford = !curse && state.player.energy >= cost;
  const canPlay = inPlayerPhase && canAfford;
  const noEnergy = inPlayerPhase && !canAfford && !curse;
  const selected = selectedCardUid === c.uid;
  const hotkey = idx < 9 ? String(idx + 1) : '';
  // 힘/약화/취약을 반영한 실제 데미지 — 첫 생존 적 기준 (적별 정확한 값은 호버 미리보기)
  const hitsEnemy = def.target === 'enemy' || def.target === 'all_enemies' || def.target === 'random_enemy';
  const firstAlive = state.enemies.find((e) => e.hp > 0);
  const dmgVsFirst = hitsEnemy && firstAlive ? computeCardDamageVsEnemy(c, state, firstAlive) : 0;
  const upLevel = c.upgraded ?? 0;
  const upgraded = upLevel >= 1;
  const upgradedPlus = upLevel >= 2;
  return el(
    'div',
    {
      class: `card ${def.type} rarity-${def.rarity} ${curse ? 'curse' : ''} ${canPlay ? '' : 'disabled'} ${noEnergy ? 'no-energy' : ''} ${selected ? 'selected' : ''} ${upgraded ? 'upgraded' : ''} ${upgradedPlus ? 'upgraded-plus' : ''} frame-${getCardFrame()}`,
      'data-card-uid': c.uid,
      onMouseEnter: () => onCardHover(c.uid),
      onMouseLeave: () => onCardHover(null),
      onClick: (e: MouseEvent) => {
        if (!canPlay) return;
        // 더블클릭/분리된 DOM 재발동 방어: 이 카드가 아직 손패에 있고
        // 현재 에너지로 낼 수 있을 때만 진행
        const live = getCombatOrNull();
        if (!live || live.phase !== 'player') return;
        if (!live.player.hand.some((h) => h.uid === c.uid)) return;
        if (live.player.energy < cost) return;
        if (def.target === 'enemy') {
          selectedCardUid = selected ? null : c.uid;
          // Selecting an enemy-target card cancels any pending potion targeting
          if (!selected) selectedPotionId = null;
          rerender();
        } else {
          selectedCardUid = null;
          spawnCardPlayAnim(e.currentTarget as HTMLElement, { exhaust: !!def.exhaust });
          const before = snapshotFx(state);
          state.player.energy -= cost;
          playSfx(def.type === 'attack' ? 'card_attack' : def.type === 'skill' ? 'card_skill' : 'card_power');
          playCard(state, c, null, (s) => state.log.push(s));
          checkCombatEnd(state);
          detectFx(state, before);
          rerender();
          flushFx();
          maybeAutoEndTurn(state);
        }
      },
    },
    hotkey ? el('div', { class: 'card-hotkey' }, hotkey) : el('div'),
    el('div', { class: 'card-cost' }, cost < 0 ? 'X' : String(cost)),
    el('div', { class: 'card-name' }, def.name),
    el('div', { class: 'card-desc' }, kwDesc(def.description)),
    dmgVsFirst > 0
      ? el('div', { class: 'card-dmg' }, `↦ ${dmgVsFirst}`)
      : el('div'),
    el('div', { class: 'card-type' }, typeLabel(def.type)),
  );
}

function renderRelicBar(relics: string[]): HTMLElement {
  const wrapper = el('div', { class: 'relic-bar-wrapper' });
  const bar = el('div', { class: 'relic-bar' });
  const activeSynergies = getActiveSynergies(relics);
  for (const id of relics) {
    const def = RELIC_DEFS[id];
    if (!def) continue;
    const synFor = activeSynergies.filter((s) => s.relics.includes(id));
    const synText = synFor.map((s) => `${s.name}: ${s.description}`).join('\n');
    const tooltip = synText ? `${def.name}\n${def.description}\n${synText}` : `${def.name}\n${def.description}`;
    const hasSynergy = synFor.length > 0;
    const chip = el('div', {
      class: `relic-chip${hasSynergy ? ' synergy-active' : ''}`,
      'data-tooltip': tooltip,
    });
    const rsvg = RELIC_SVG[id];
    if (rsvg) chip.innerHTML = rsvg;
    else chip.textContent = def.name;
    bar.appendChild(chip);
  }
  wrapper.appendChild(bar);
  if (activeSynergies.length > 0) {
    const synRow = el('div', { class: 'synergy-row' });
    for (const s of activeSynergies) {
      const relicNames = s.relics.map((rid: string) => RELIC_DEFS[rid]?.name ?? rid).join(' + ');
      const synTag = el('span', {
        class: 'synergy-tag',
        'data-tooltip': `${s.name}\n${s.description}\n\n${t('조합')}: ${relicNames}`,
      });
      synTag.innerHTML = `${ic('lightning')} ${s.name} <span class="synergy-relics">(${relicNames})</span>`;
      synRow.appendChild(synTag);
    }
    wrapper.appendChild(synRow);
  }
  return wrapper;
}

function renderPotionBar(state: CombatState): HTMLElement {
  const run = getRunOrNull();
  if (!run) return el('div');
  const bar = el('div', { class: 'potion-bar' });
  const MAX_POTIONS = 3;
  for (let i = 0; i < MAX_POTIONS; i++) {
    const potionId = run.player.potions[i];
    if (potionId) {
      const def = POTION_DEFS[potionId];
      const isSelected = selectedPotionId === potionId;
      bar.appendChild(
        el('div', {
          class: `potion-slot filled ${isSelected ? 'selected' : ''}`,
          'data-tooltip': `${def.name}\n${def.description}`,
          onClick: () => {
            if (state.phase !== 'player') return;
            if (def.target === 'self') {
              applyPotionSelf(state, potionId);
              selectedPotionId = null;
              rerender();
            } else {
              selectedPotionId = isSelected ? null : potionId;
              // Selecting an enemy-target potion cancels any pending card targeting
              if (!isSelected) selectedCardUid = null;
              rerender();
            }
          },
        }, (() => { const ps = POTION_SVG[potionId]; if (ps) { const d = document.createElement('span'); d.innerHTML = ps; return d; } return document.createTextNode(def.name[0]); })()),
      );
    } else {
      bar.appendChild(el('div', { class: 'potion-slot empty', 'data-tooltip': `${t('물약 슬롯')} ${i + 1} (${t('비어있음')})` }, ''));
    }
  }
  const filledCount = run.player.potions.filter(Boolean).length;
  bar.appendChild(el('span', { style: { fontSize: '10px', color: 'var(--muted)', alignSelf: 'center' } }, `${filledCount}/${MAX_POTIONS}`));
  return bar;
}

function applyPotionSelf(state: CombatState, potionId: string): void {
  if (!usePotion(state, getRunOrNull()!, potionId, null)) return;
  playSfx('potion');
}

function applyPotionEnemy(state: CombatState, potionId: string, enemy: Enemy): void {
  if (!usePotion(state, getRunOrNull()!, potionId, enemy)) return;
  playSfx('potion');
  checkCombatEnd(state);
}

function typeLabel(ty: string): string {
  if (ty === 'attack') return t('공격');
  if (ty === 'skill') return t('방어');
  return t('효과');
}

function isCardEnemyTargeted(c: CardInstance | null): boolean {
  if (!c) return false;
  return getEffectiveDef(c).target === 'enemy';
}

function getSelectedCard(state: CombatState): CardInstance | null {
  if (!selectedCardUid) return null;
  return state.player.hand.find((c) => c.uid === selectedCardUid) ?? null;
}

function playSelectedCard(target: Enemy): void {
  const state = getCombat();
  if (state.phase !== 'player') return;
  const card = getSelectedCard(state);
  if (!card) return;
  // 카드가 아직 손패에 있는지 확인 (더블클릭/stale 방어)
  if (!state.player.hand.some((h) => h.uid === card.uid)) { selectedCardUid = null; return; }
  const def = getEffectiveDef(card);
  const cost = playCost(def.cost);
  if (state.player.energy < cost) return;
  const selectedEl = document.querySelector('.card.selected') as HTMLElement | null;
  if (selectedEl) spawnCardPlayAnim(selectedEl, { exhaust: !!def.exhaust });
  const before = snapshotFx(state);
  state.player.energy -= cost;
  selectedCardUid = null;
  playSfx(def.type === 'attack' ? 'card_attack' : def.type === 'skill' ? 'card_skill' : 'card_power');
  playCard(state, card, target, (s) => state.log.push(s));
  checkCombatEnd(state);
  detectFx(state, before);
  rerender();
  flushFx();
  maybeAutoEndTurn(state);
}

function maybeAutoEndTurn(state: CombatState): void {
  if (!getSettings().autoEndTurn) return;
  if (state.phase !== 'player') return;
  const canPlayAny = state.player.hand.some((c) => {
    const d = getEffectiveDef(c);
    return state.player.energy >= playCost(d.cost) && !isCurseLike(d.id);
  });
  if (canPlayAny) return;
  setTimeout(() => {
    const live = getCombatOrNull();
    if (!live || live.phase !== 'player') return;
    selectedCardUid = null;
    playSfx('turn_end');
    const before = snapshotFx(live);
    endPlayerTurn(live);
    detectEnemyTurnFx(live, before);
    rerender();
    flushEnemyTurnFx();
  }, 400);
}

function checkCombatEnd(state: CombatState): void {
  if (state.enemies.every((e) => e.hp <= 0)) {
    state.phase = 'won';
  }
}

function checkCombatAchievements(state: CombatState): void {
  const strength = state.player.statuses.strength ?? 0;
  if (strength >= 8) checkStrength(strength);
  if (state.player.block >= 50) checkBlock(state.player.block);
  for (const e of state.enemies) {
    const fz = e.statuses.freeze ?? 0;
    if (fz >= 4) checkFreezeChain(fz);
    const poison = e.statuses.poison ?? 0;
    if (poison >= 20) checkPoison(poison);
  }
}



// ──────────────────────────────────────────────────────────────
// Keyboard shortcuts
// ──────────────────────────────────────────────────────────────
let targetedEnemyIdx = 0; // for Tab cycling

function aliveEnemies(state: CombatState): Enemy[] {
  return state.enemies.filter((e) => e.hp > 0);
}

function playCardWithFx(state: CombatState, card: CardInstance, target: Enemy | null): void {
  if (state.phase !== 'player') return;
  // 카드가 아직 손패에 있을 때만 진행 (핫키 연타/stale 방어)
  if (!state.player.hand.some((h) => h.uid === card.uid)) return;
  const def = getEffectiveDef(card);
  if (isCurseLike(def.id)) return;
  const cost = playCost(def.cost);
  if (state.player.energy < cost) return;
  playSfx(def.type === 'attack' ? 'card_attack' : def.type === 'skill' ? 'card_skill' : 'card_power');
  const handCards = document.querySelectorAll('.hand-cards .card');
  const idxInHand = state.player.hand.findIndex((c) => c.uid === card.uid);
  if (idxInHand >= 0 && handCards[idxInHand]) {
    let targetEl: HTMLElement | undefined;
    if (def.type === 'attack' && target) {
      targetEl = document.querySelector(`[data-enemy-uid="${target.uid}"]`) as HTMLElement | undefined ?? undefined;
    }
    spawnCardPlayAnim(handCards[idxInHand] as HTMLElement, { exhaust: !!def.exhaust, targetEl });
  }
  const before = snapshotFx(state);
  state.player.energy -= cost;
  selectedCardUid = null;
  playCard(state, card, target, (s) => state.log.push(s));
  checkCombatEnd(state);
  detectFx(state, before);
  rerender();
  flushFx();
}

function selectOrPlayCard(card: CardInstance): void {
  const state = getCombat();
  const def = getEffectiveDef(card);
  if (isCurseLike(def.id)) return;
  if (state.player.energy < playCost(def.cost)) return;

  if (def.target === 'enemy') {
    const alive = aliveEnemies(state);
    if (alive.length === 0) return;
    if (alive.length === 1) {
      // Auto-target single enemy
      playCardWithFx(state, card, alive[0]);
    } else {
      // Toggle selection / let user click target or press number again
      const wasSelected = selectedCardUid === card.uid;
      selectedCardUid = wasSelected ? null : card.uid;
      if (!wasSelected) selectedPotionId = null; // newly selecting card cancels pending potion
      targetedEnemyIdx = 0;
      rerender();
    }
  } else {
    // self / all_enemies / random_enemy / none — play immediately
    playCardWithFx(state, card, null);
  }
}

function endTurnHotkey(): void {
  const state = getCombat();
  if (state.phase !== 'player') return;
  selectedCardUid = null;
  selectedPotionId = null;
  playSfx('turn_end');
  const before = snapshotFx(state);
  endPlayerTurn(state);
  detectEnemyTurnFx(state, before);
  rerender();
  flushEnemyTurnFx();
}

function cycleEnemyTarget(): void {
  const state = getCombat();
  if (!selectedCardUid) return;
  const alive = aliveEnemies(state);
  if (alive.length <= 1) return;
  targetedEnemyIdx = (targetedEnemyIdx + 1) % alive.length;
  rerender();
}

function confirmTargetedPlay(): void {
  const state = getCombat();
  if (!selectedCardUid) return;
  const card = state.player.hand.find((c) => c.uid === selectedCardUid);
  if (!card) return;
  const alive = aliveEnemies(state);
  if (alive.length === 0) return;
  const target = alive[Math.min(targetedEnemyIdx, alive.length - 1)];
  playCardWithFx(state, card, target);
}

function isTypingInInput(): boolean {
  const a = document.activeElement as HTMLElement | null;
  if (!a) return false;
  const tag = a.tagName;
  return tag === 'INPUT' || tag === 'TEXTAREA' || a.isContentEditable;
}

function handleKeydown(e: KeyboardEvent): void {
  if (isTypingInInput()) return;
  if (getScreen() !== 'combat') return;
  // 덱/카드 목록 오버레이나 스플래시가 떠 있으면 핫키 무시
  // (오버레이 뒤의 손패가 실수로 플레이되는 것 방지)
  if (document.querySelector('.card-list-overlay, .splash-overlay')) return;
  const state = getCombatOrNull();
  if (!state || state.phase !== 'player') return;

  // Card slots 1-9
  if (e.key >= '1' && e.key <= '9') {
    const idx = parseInt(e.key, 10) - 1;
    const card = state.player.hand[idx];
    if (card) {
      selectOrPlayCard(card);
      e.preventDefault();
    }
    return;
  }

  switch (e.key) {
    case 'e':
    case 'E':
    case ' ':
      // Space/E: confirm targeted enemy if selected, else end turn
      if (selectedCardUid) {
        confirmTargetedPlay();
      } else {
        endTurnHotkey();
      }
      e.preventDefault();
      break;
    case 'Enter':
      if (selectedCardUid) {
        confirmTargetedPlay();
        e.preventDefault();
      }
      break;
    case 'Tab':
      if (selectedCardUid) {
        cycleEnemyTarget();
        e.preventDefault();
      }
      break;
    case 'Escape':
      if (selectedCardUid || selectedPotionId) {
        selectedCardUid = null;
        selectedPotionId = null;
        rerender();
        e.preventDefault();
      }
      break;
  }
}

if (typeof window !== 'undefined') {
  window.addEventListener('keydown', handleKeydown);
}


export function getKeyboardTargetedEnemyUid(state: CombatState): string | null {
  if (!selectedCardUid) return null;
  const alive = aliveEnemies(state);
  if (alive.length <= 1) return null; // auto-target case, not a manual highlight
  const e = alive[Math.min(targetedEnemyIdx, alive.length - 1)];
  return e?.uid ?? null;
}

