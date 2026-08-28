import { el } from './dom';
import { getRunOrNull, getScreen, getCombatOrNull } from '../state';
import { RELIC_DEFS, getActiveSynergies } from '../content/relics';
import { getCombat, getRun, setCombat, setScreen, rerender } from '../state';
import { getEffectiveDef } from '../content/cards';
import { openDeckOverlay } from './deck-overlay';
import { ENEMY_DEFS } from '../content/enemies';
import { bossDefeatFlavor } from '../content/lore';
import { STATUS_INFO, applyStatus, modifiedAttackDamage, getStatusValueLabel, getStatusTooltip } from '../combat/statuses';
import { buildIntentDisplay } from '../combat/intent';
import { endPlayerTurn } from '../combat/combat';
import { playCard } from '../combat/effects';
import type { CardInstance, CombatState, Enemy } from '../types';
import { POTION_DEFS, POTION_LIST } from '../content/potions';
import { isCurseLike } from './deck-overlay';
import { playSfx, getMuted, setMuted, getVolume, setVolume, getBgmMuted, setBgmMuted, getBgmVolume, setBgmVolume } from '../audio';
import { makeRng, pick } from '../rng';
import { checkDamage, checkBlock, checkTurnCount, checkStrength, checkFreezeChain, checkPoison } from '../achievements';
import { getCardFrame } from '../card-frame';

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
  pendingFx = [];
}

// Compute damage preview for a card against a specific enemy.
// 플레이어 힘/약화 + 적 취약을 반영. 콤보 조건이 현재 충족되면 보너스 데미지도,
// 스케일링 카드는 현재 카운터 기준 데미지도 포함. 방어도는 빼지 않음.
function computeCardDamageVsEnemy(card: CardInstance, state: CombatState, enemy: Enemy): number {
  const def = getEffectiveDef(card);
  const player = state.player;
  let total = 0;
  const addDamage = (amount: number, times = 1) => {
    total += modifiedAttackDamage(amount, player as any, enemy) * times;
  };
  for (const eff of def.effects) {
    if (eff.kind === 'damage') {
      addDamage(eff.amount, eff.times ?? 1);
    } else if (eff.kind === 'damage_all') {
      addDamage(eff.amount);
    } else if (eff.kind === 'damage_per_attack') {
      addDamage(eff.amount * (state.flags.attackCount ?? 0));
    } else if (eff.kind === 'damage_per_card_this_turn') {
      // 이 카드 자신도 카운트되므로 +1
      addDamage(eff.amount * ((state.flags.cardsPlayedThisTurn ?? 0) + 1));
    } else if (eff.kind === 'conditional' && previewConditionMet(state, eff.condition)) {
      for (const sub of eff.then) {
        if (sub.kind === 'damage') addDamage(sub.amount, sub.times ?? 1);
        else if (sub.kind === 'damage_all') addDamage(sub.amount);
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

export const ENEMY_ART: Record<string, string> = {
  jaw_worm: '🪱',
  cultist: '🧙',
  fungi_beast: '🍄',
  gremlin_nob: '👹',
  sentinel: '🛡️',
  hexaghost: '👻',
  blue_slaver: '🔵',
  red_slaver: '🔴',
  shield_gremlin: '🛡',
  taskmaster: '📋',
  book_of_stabbing: '📖',
  the_collector: '🏛️',
  looter: '🗡️',
  dark_slime: '🌑',
  centurion: '⚔️',
  writhing_mass: '🐙',
  void_heart: '💀',
  abyss_lord: '🌀',
  mad_butcher: '🪓',
  obsidian_golem: '🗿',
  karnak_runemaster: '🔮',
  sirocco_phantom: '🐲',
  death_apostle: '☠️',
  isaris_overlord: '👹',
  goblin_berserker: '👺',
  wandering_swordsman: '🥷',
  frenzy_gremlin: '😈',
  arcane_scholar: '📜',
  black_butcher: '🔪',
  heavy_armored: '🛡️',
  dark_knight: '⚔️',
  corrupted_beast: '🦂',
  dragonling: '🐉',
  flame_wisp: '🔥',
  charging_boar: '🐗',
  curse_priest: '🩸',
  mech_scout: '🤖',
  exorcist_hunter: '✝️',
  forest_spirit: '🌳',
  dimension_sorcerer: '🌌',
  titan_golem: '🗿',
  // Chapter 4
  void_echo: '🌀',
  dimensional_warden: '🛡️',
  whispering_madness: '👁️',
  rift_titan: '⚡',
  time_sovereign: '⌛',
  void_avatar: '💠',
};

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
      lastPhasePlayed = 'won';
    }
    return renderCombatVictory(state);
  }
  if (state.phase === 'lost') {
    if (lastPhasePlayed !== 'lost') { playSfx('defeat'); lastPhasePlayed = 'lost'; }
    const run = getRunOrNull();
    setTimeout(() => setScreen(run?.endless ? 'endless_result' : 'lose'), 0);
    return el('div', { class: 'combat-screen' });
  }
  // Reset for next combat
  if (state.phase === 'player' && lastPhasePlayed !== null) lastPhasePlayed = null;

  // Clear hover state if hovered card is no longer in hand (was played, discarded, etc.)
  if (hoveredCardUid && !state.player.hand.some((c) => c.uid === hoveredCardUid)) {
    hoveredCardUid = null;
  }
  // Re-apply damage previews after DOM mount
  requestAnimationFrame(updateDamagePreviews);

  return el(
    'div',
    { class: 'combat-screen' },
    renderTop(state),
    renderMid(state),
    renderHand(state),
    renderDeckPile(state),
  );
}

function renderTop(state: CombatState): HTMLElement {
  const enemiesEl = el('div', { class: 'enemies' });
  const enemyRow = el('div', { style: { display: 'flex', gap: '32px' } });
  for (const e of state.enemies) {
    enemyRow.appendChild(renderEnemy(state, e));
  }
  enemiesEl.appendChild(enemyRow);

  const log = el('div', { class: 'combat-log' });
  const recent = state.log.slice(-12);
  for (const entry of recent) {
    log.appendChild(el('div', { class: 'entry' }, entry));
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

  const art = el('div', { class: 'enemy-art' }, ENEMY_ART[e.defId] ?? '👤');

  const enemyHpPct = e.hp / e.maxHp;
  const hpFill = el('div', { class: 'fill', style: { width: `${enemyHpPct * 100}%` } });
  const enemyLowHp = e.hp > 0 && enemyHpPct <= 0.3;
  const hpBar = el(
    'div',
    { class: `hp-bar ${enemyLowHp ? 'low-hp' : ''}` },
    hpFill,
    el('div', { class: 'text' }, `${e.hp}/${e.maxHp}${e.block > 0 ? ` 🛡${e.block}` : ''}`),
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
      'data-tooltip': perfectGuard ? '🛡 안전: 방어도로 모두 막힘' : dangerHit ? '⚠️ 큰 한방 — 대비하세요' : '',
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

  const statuses = renderStatuses(e.statuses);

  const kbTargeted = getKeyboardTargetedEnemyUid(state) === e.uid;
  const enemyEl = el(
    'div',
    {
      class: `enemy ${dead ? 'dead' : ''} ${targetable ? 'targetable' : ''} ${kbTargeted ? 'kb-targeted' : ''}`,
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

function renderStatuses(s: Record<string, number | undefined>): HTMLElement {
  const row = el('div', { class: 'statuses' });
  for (const [k, v] of Object.entries(s)) {
    if (!v) continue;
    const info = STATUS_INFO[k as keyof typeof STATUS_INFO];
    if (!info) continue;
    const key = k as keyof typeof STATUS_INFO;
    row.appendChild(
      el(
        'div',
        {
          class: `status ${info.buff ? 'buff' : 'debuff'}`,
          'data-tooltip': getStatusTooltip(key, v),
        },
        `${info.name} ${getStatusValueLabel(key, v)}`,
      ),
    );
  }
  return row;
}

function renderMid(state: CombatState): HTMLElement {
  const p = state.player;
  const energy = el('div', { class: 'energy-orb' }, `${p.energy}/${p.maxEnergy}`);

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

  const blockBadge = p.block > 0 ? el('span', { class: 'block-badge' }, `🛡 ${p.block}`) : el('span');

  const playerStats = el(
    'div',
    { class: 'player-stats' },
    energy,
    hpBar,
    blockBadge,
    renderStatuses(p.statuses),
  );

  const pileLink = (label: string, cards: typeof p.draw, opts: { shuffleHint?: boolean } = {}) =>
    el('span', {
      class: 'pile-link',
      onClick: () => openDeckOverlay(cards, { title: label, shuffleHint: opts.shuffleHint, emptyText: '비어있습니다.' }),
    }, `${label}: ${cards.length}`);

  const piles = el(
    'div',
    { class: 'pile-counts' },
    pileLink('드로우', p.draw, { shuffleHint: true }),
    pileLink('버림', p.discard),
    pileLink('소멸', p.exhaust),
    el('span', {
      class: 'pile-link',
      onClick: () => openDeckOverlay(p.deck, { title: '전체 덱' }),
    }, `전체 덱`),
  );

  // 낭비 경고: 사용 가능한 카드가 있는데 턴 끝내려 하면 한 번 흔들어 알림
  const hasPlayable = state.player.hand.some((c) => {
    const def = getEffectiveDef(c);
    return state.player.energy >= def.cost && !isCurseLike(def.id);
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
          btn.title = '에너지가 남았어요. 한 번 더 누르면 턴이 끝납니다.';
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
        detectFx(state, before);
        rerender();
        flushFx();
      },
    },
    '턴 종료',
    el('span', { class: 'kbd-hint' }, '(E)'),
  );

  const run = getRunOrNull();
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
  }, '⚙️');

  return el('div', { class: 'combat-mid' }, playerStats, relicBar, potionBar, piles, endTurn, gearBtn);
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
    }, muted ? '🔇 음소거' : '🔊 음향 ON'));
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
    }, '닫기'));
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
    hand.appendChild(cardEl);
  });
  previousHandUids = newHandUids;
  // Restore on next frame so the layout is settled
  requestAnimationFrame(() => { hand.scrollLeft = savedHandScroll; });
  return hand;
}

function renderDeckPile(state: CombatState): HTMLElement {
  const count = state.player.draw.length;
  const pile = el('div', {
    class: 'deck-pile',
    'data-tooltip': `드로우 더미: ${count}장`,
    onClick: () => openDeckOverlay(state.player.draw, { title: '드로우', shuffleHint: true, emptyText: '비어있습니다.' }),
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
  const canAfford = state.player.energy >= def.cost;
  const canPlay = inPlayerPhase && canAfford;
  const noEnergy = inPlayerPhase && !canAfford; // distinct visual state
  const selected = selectedCardUid === c.uid;
  const hotkey = idx < 9 ? String(idx + 1) : '';
  const curse = isCurseLike(def.id);
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
        if (live.player.energy < def.cost) return;
        if (def.target === 'enemy') {
          selectedCardUid = selected ? null : c.uid;
          // Selecting an enemy-target card cancels any pending potion targeting
          if (!selected) selectedPotionId = null;
          rerender();
        } else {
          selectedCardUid = null;
          spawnCardPlayAnim(e.currentTarget as HTMLElement, { exhaust: !!def.exhaust });
          const before = snapshotFx(state);
          state.player.energy -= def.cost;
          playSfx(def.type === 'attack' ? 'card_attack' : def.type === 'skill' ? 'card_skill' : 'card_power');
          playCard(state, c, null, (s) => state.log.push(s));
          checkCombatEnd(state);
          detectFx(state, before);
          rerender();
          flushFx();
        }
      },
    },
    hotkey ? el('div', { class: 'card-hotkey' }, hotkey) : el('div'),
    el('div', { class: 'card-cost' }, String(def.cost)),
    el('div', { class: 'card-name' }, def.name),
    el('div', { class: 'card-desc' }, def.description),
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
    const synText = synFor.map((s) => `⚡ ${s.name}: ${s.description}`).join('\n');
    const tooltip = synText ? `${def.name}\n${def.description}\n${synText}` : `${def.name}\n${def.description}`;
    const hasSynergy = synFor.length > 0;
    bar.appendChild(
      el('div', {
        class: `relic-chip${hasSynergy ? ' synergy-active' : ''}`,
        'data-tooltip': tooltip,
      }, def.name),
    );
  }
  wrapper.appendChild(bar);
  if (activeSynergies.length > 0) {
    const synRow = el('div', { class: 'synergy-row' });
    for (const s of activeSynergies) {
      synRow.appendChild(el('span', { class: 'synergy-tag' }, `⚡ ${s.name}`));
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
        }, def.name[0]),
      );
    } else {
      bar.appendChild(el('div', { class: 'potion-slot empty' }, '·'));
    }
  }
  return bar;
}

function applyPotionSelf(state: CombatState, potionId: string): void {
  playSfx('potion');
  const run = getRunOrNull()!;
  const idx = run.player.potions.indexOf(potionId);
  if (idx < 0) return;
  run.player.potions.splice(idx, 1);
  switch (potionId) {
    case 'health_potion':
      run.player.hp = Math.min(run.player.maxHp, run.player.hp + 20);
      break;
    case 'strength_potion':
      applyStatus(state.player, 'strength', 5);
      break;
    case 'block_potion':
      state.player.block += 15;
      break;
    case 'energy_potion':
      state.player.energy = Math.min(state.player.energy + 2, state.player.maxEnergy + 2);
      break;
    case 'weak_potion':
      for (const e of state.enemies) {
        if (e.hp > 0) applyStatus(e, 'weak', 3);
      }
      break;
    case 'vulnerable_potion':
      for (const e of state.enemies) {
        if (e.hp > 0) applyStatus(e, 'vulnerable', 3);
      }
      break;
  }
}

function applyPotionEnemy(state: CombatState, potionId: string, enemy: Enemy): void {
  playSfx('potion');
  const run = getRunOrNull()!;
  const idx = run.player.potions.indexOf(potionId);
  if (idx < 0) return;
  run.player.potions.splice(idx, 1);
  switch (potionId) {
    case 'poison_potion':
      applyStatus(enemy, 'poison', 8);
      break;
    case 'fire_potion': {
      const dmg = Math.max(0, 20 - enemy.block);
      enemy.block = Math.max(0, enemy.block - 20);
      enemy.hp = Math.max(0, enemy.hp - dmg);
      checkCombatEnd(state);
      break;
    }
    case 'burn_potion':
      applyStatus(enemy, 'burn', 5);
      break;
    case 'freeze_potion':
      applyStatus(enemy, 'freeze', 1);
      applyStatus(enemy, 'weak', 2);
      break;
  }
}

function typeLabel(t: string): string {
  if (t === 'attack') return '공격';
  if (t === 'skill') return '방어';
  return '효과';
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
  if (state.player.energy < def.cost) return;
  // Animate the selected card flying out before rerender wipes it
  const selectedEl = document.querySelector('.card.selected') as HTMLElement | null;
  if (selectedEl) spawnCardPlayAnim(selectedEl, { exhaust: !!def.exhaust });
  const before = snapshotFx(state);
  state.player.energy -= def.cost;
  selectedCardUid = null;
  playSfx(def.type === 'attack' ? 'card_attack' : def.type === 'skill' ? 'card_skill' : 'card_power');
  playCard(state, card, target, (s) => state.log.push(s));
  checkCombatEnd(state);
  detectFx(state, before);
  rerender();
  flushFx();
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

// ── Visual effects (attack hit marks, block gain, damage numbers) ──
type PendingFx =
  | { kind: 'attack'; enemyUid: string; damage: number }
  | { kind: 'block'; amount: number }
  | { kind: 'player_dmg'; amount: number };
let pendingFx: PendingFx[] = [];

function snapshotFx(state: CombatState) {
  return {
    enemies: state.enemies.map((e) => ({ uid: e.uid, total: e.hp + e.block })),
    playerBlock: state.player.block,
    playerHp: state.player.hp,
  };
}

function detectFx(state: CombatState, before: ReturnType<typeof snapshotFx>): void {
  for (const e of state.enemies) {
    const b = before.enemies.find((x) => x.uid === e.uid);
    if (!b) continue;
    const dmg = b.total - (e.hp + e.block);
    if (dmg > 0) {
      pendingFx.push({ kind: 'attack', enemyUid: e.uid, damage: dmg });
      checkDamage(dmg);
    }
  }
  const blockGained = state.player.block - before.playerBlock;
  if (blockGained > 0) {
    pendingFx.push({ kind: 'block', amount: blockGained });
  }
  const hpLost = before.playerHp - state.player.hp;
  if (hpLost > 0) {
    pendingFx.push({ kind: 'player_dmg', amount: hpLost });
  }
}

function flushFx(): void {
  const run = getRunOrNull();
  const cc = run?.characterClass ?? 'swordmaster';
  let playedDmg = false;
  let playedBlock = false;
  let playedPlayerDmg = false;
  let maxDamageThisFlush = 0;
  for (const fx of pendingFx) {
    if (fx.kind === 'attack') {
      const enemyEl = document.querySelector(`[data-enemy-uid="${fx.enemyUid}"]`);
      if (enemyEl) {
        spawnAttackFx(enemyEl as HTMLElement, cc);
        spawnDamageNumber(enemyEl as HTMLElement, fx.damage);
        triggerHitFlash(enemyEl as HTMLElement);
      }
      if (!playedDmg) { playSfx('damage_hit'); playedDmg = true; }
      if (fx.damage > maxDamageThisFlush) maxDamageThisFlush = fx.damage;
    } else if (fx.kind === 'block') {
      spawnBlockFx(fx.amount);
      if (!playedBlock) { playSfx('block_gain'); playedBlock = true; }
    } else if (fx.kind === 'player_dmg') {
      spawnPlayerDamageNumber(fx.amount);
      triggerPlayerHitFlash();
      if (!playedPlayerDmg) { playSfx('enemy_attack'); playedPlayerDmg = true; }
      if (fx.amount > maxDamageThisFlush) maxDamageThisFlush = fx.amount;
    }
  }
  // Screen shake scales with the biggest single hit
  if (maxDamageThisFlush >= 25) triggerScreenShake('heavy');
  else if (maxDamageThisFlush >= 15) triggerScreenShake('light');
  pendingFx = [];
}

function triggerHitFlash(enemyEl: HTMLElement): void {
  enemyEl.classList.remove('hit-flash');
  // Force reflow so re-adding the class restarts the animation
  void enemyEl.offsetWidth;
  enemyEl.classList.add('hit-flash');
  setTimeout(() => enemyEl.classList.remove('hit-flash'), 360);
}

function triggerPlayerHitFlash(): void {
  const root = document.querySelector('.combat-screen');
  if (!root) return;
  root.classList.remove('player-hit-flash');
  void (root as HTMLElement).offsetWidth;
  root.classList.add('player-hit-flash');
  setTimeout(() => root.classList.remove('player-hit-flash'), 360);
}

function triggerScreenShake(intensity: 'light' | 'heavy'): void {
  const root = document.querySelector('.combat-screen');
  if (!root) return;
  const cls = intensity === 'heavy' ? 'screen-shake-heavy' : 'screen-shake-light';
  root.classList.remove(cls);
  void (root as HTMLElement).offsetWidth;
  root.classList.add(cls);
  setTimeout(() => root.classList.remove(cls), intensity === 'heavy' ? 380 : 260);
}

function spawnDamageNumber(target: HTMLElement, amount: number): void {
  const float = document.createElement('div');
  float.className = 'damage-float enemy-damage-float';
  float.textContent = `-${amount}`;
  // Random horizontal offset so multi-hits don't overlap perfectly
  float.style.left = `${42 + Math.random() * 16}%`;
  target.appendChild(float);
  setTimeout(() => float.remove(), 1000);
}

function spawnCardPlayAnim(cardEl: HTMLElement, opts: { exhaust?: boolean } = {}): void {
  const rect = cardEl.getBoundingClientRect();
  // Avoid animating cards that aren't actually visible
  if (rect.width === 0 || rect.height === 0) return;
  const clone = cardEl.cloneNode(true) as HTMLElement;
  clone.style.position = 'fixed';
  clone.style.left = `${rect.left}px`;
  clone.style.top = `${rect.top}px`;
  clone.style.width = `${rect.width}px`;
  clone.style.height = `${rect.height}px`;
  clone.style.margin = '0';
  clone.style.zIndex = '1500';
  clone.style.pointerEvents = 'none';
  // Strip any hotkey badge — distracting on the floating clone
  const hotkey = clone.querySelector('.card-hotkey');
  if (hotkey) (hotkey as HTMLElement).style.display = 'none';

  if (opts.exhaust) {
    clone.classList.add('card-exhausting');
    document.body.appendChild(clone);
    // Spawn dissipating particles
    spawnExhaustParticles(rect);
    setTimeout(() => clone.remove(), 820);
  } else {
    clone.classList.add('card-playing');
    document.body.appendChild(clone);
    setTimeout(() => clone.remove(), 520);
  }
}

function spawnExhaustParticles(rect: DOMRect): void {
  const cx = rect.left + rect.width / 2;
  const cy = rect.top + rect.height / 2;
  const count = 12;
  for (let i = 0; i < count; i++) {
    const p = document.createElement('div');
    p.className = 'exhaust-particle';
    const angle = (i / count) * Math.PI * 2 + Math.random() * 0.4;
    const dist = 60 + Math.random() * 80;
    p.style.left = `${cx}px`;
    p.style.top = `${cy}px`;
    p.style.setProperty('--dx', `${Math.cos(angle) * dist}px`);
    p.style.setProperty('--dy', `${Math.sin(angle) * dist}px`);
    p.style.animationDelay = `${Math.random() * 0.1}s`;
    document.body.appendChild(p);
    setTimeout(() => p.remove(), 900);
  }
}

function spawnPlayerDamageNumber(amount: number): void {
  const stats = document.querySelector('.player-stats');
  if (!stats) return;
  const float = document.createElement('div');
  float.className = 'damage-float player-damage-float';
  float.textContent = `-${amount}`;
  stats.appendChild(float);
  setTimeout(() => float.remove(), 1000);
}

function spawnAttackFx(target: HTMLElement, cc: string): void {
  const wrap = document.createElement('div');
  wrap.className = 'attack-fx';

  if (cc === 'gunner') {
    wrap.classList.add('bullet-fx');
    for (let i = 0; i < 3; i++) {
      const hole = document.createElement('div');
      hole.className = 'bullet-hole';
      hole.style.left = `${28 + Math.random() * 44}%`;
      hole.style.top = `${28 + Math.random() * 44}%`;
      hole.style.animationDelay = `${i * 0.07}s`;
      wrap.appendChild(hole);
    }
    setTimeout(() => wrap.remove(), 900);
  } else if (cc === 'fighter') {
    wrap.classList.add('hit-fx');
    const burst = document.createElement('div');
    burst.className = 'hit-burst';
    burst.textContent = '💥';
    wrap.appendChild(burst);
    const ring = document.createElement('div');
    ring.className = 'hit-ring';
    wrap.appendChild(ring);
    setTimeout(() => wrap.remove(), 600);
  } else if (cc === 'magician') {
    wrap.classList.add('magic-fx');
    // Central sparkle burst
    const burst = document.createElement('div');
    burst.className = 'magic-burst';
    burst.textContent = '✨';
    wrap.appendChild(burst);
    // Expanding arcane ring
    const ring = document.createElement('div');
    ring.className = 'magic-ring';
    wrap.appendChild(ring);
    // Orbital sparkle particles
    for (let i = 0; i < 5; i++) {
      const dot = document.createElement('div');
      dot.className = 'magic-dot';
      const angle = (i / 5) * Math.PI * 2 + Math.random() * 0.4;
      dot.style.left = `${50 + Math.cos(angle) * 18}%`;
      dot.style.top = `${50 + Math.sin(angle) * 18}%`;
      dot.style.animationDelay = `${i * 0.04}s`;
      wrap.appendChild(dot);
    }
    setTimeout(() => wrap.remove(), 750);
  } else {
    wrap.classList.add('slash-fx');
    const b1 = document.createElement('div');
    b1.className = 'slash-bar slash-bar-1';
    const b2 = document.createElement('div');
    b2.className = 'slash-bar slash-bar-2';
    wrap.appendChild(b1);
    wrap.appendChild(b2);
    setTimeout(() => wrap.remove(), 700);
  }
  target.appendChild(wrap);
}

function spawnBlockFx(amount: number): void {
  const stats = document.querySelector('.player-stats');
  if (!stats) return;
  // Floating +X text
  const float = document.createElement('div');
  float.className = 'block-float';
  float.textContent = `🛡 +${amount}`;
  stats.appendChild(float);
  setTimeout(() => float.remove(), 1100);
  // Pulse on badge
  const badge = stats.querySelector('.block-badge') as HTMLElement | null;
  if (badge) {
    badge.classList.remove('pulse');
    void badge.offsetWidth;
    badge.classList.add('pulse');
  }
  // Brief shield overlay on player stats
  const shield = document.createElement('div');
  shield.className = 'block-shield-overlay';
  stats.appendChild(shield);
  setTimeout(() => shield.remove(), 800);
}

function renderCombatVictory(_state: CombatState): HTMLElement {
  const run = getRun();
  const cur = run.currentNodeId
    ? run.map.find((n) => n.id === run.currentNodeId)!
    : null;
  const isBossNode = cur?.kind === 'boss';
  const isCh3Boss = isBossNode && run.chapter === 3;
  const isCh4Boss = isBossNode && run.chapter === 4;
  const isChapterBoss = isBossNode && (run.chapter === 1 || run.chapter === 2);
  const hasAllKeys = run.player.keys.includes('will') && run.player.keys.includes('emotion') && run.player.keys.includes('body');

  // Endless mode — skip normal routing
  if (run.endless) {
    // Apply end-of-combat relics
    if (!(_state as any)._victoryAppliedRelics) {
      applyVictoryRelics(run, _state);
      (_state as any)._victoryAppliedRelics = true;
    }
    const wave = run.endless.wave;
    return el('div', { class: 'combat-screen' },
      el('div', { class: 'combat-top', style: { flexDirection: 'column', gap: '16px' } },
        el('h2', { style: { color: 'var(--good)', margin: 0 } }, `웨이브 ${wave} 클리어!`),
        el('div', { style: { color: 'var(--muted)' } }, `HP ${run.player.hp}/${run.player.maxHp} · 점수 ${run.endless.score + wave * 100 + run.player.hp + run.player.gold + run.player.relics.length * 25}`),
        el('button', {
          onClick: () => {
            setCombat(null);
            setScreen('endless_wave_clear');
          },
        }, '다음 웨이브'),
      ),
    );
  }

  // Determine next-screen routing
  let nextScreen: 'reward' | 'chapter_clear' | 'win' | 'true_win' | 'true_ending_choice' = 'reward';
  let nextLabel = '보상 받기';
  if (isCh4Boss) {
    nextScreen = 'true_win';
    nextLabel = '진엔딩 클리어!';
  } else if (isCh3Boss) {
    if (hasAllKeys) {
      nextScreen = 'true_ending_choice';
      nextLabel = '계속...';
    } else {
      nextScreen = 'win';
      nextLabel = '최종 클리어!';
    }
  } else if (isChapterBoss) {
    nextScreen = 'chapter_clear';
    nextLabel = '챕터 클리어!';
  }

  // Key drops — first elite of each chapter
  let droppedKey: string | null = null;
  if (cur?.kind === 'elite') {
    const keyMap: Record<number, string> = { 1: 'will', 2: 'emotion', 3: 'body' };
    const keyName: Record<string, string> = { will: '의지의 열쇠', emotion: '감정의 열쇠', body: '육체의 열쇠' };
    const keyToGive = keyMap[run.chapter];
    if (keyToGive && !run.player.keys.includes(keyToGive)) {
      if (!(_state as any)._keyDropped) {
        run.player.keys.push(keyToGive);
        droppedKey = keyName[keyToGive];
        (_state as any)._keyDropped = true;
      } else {
        droppedKey = keyName[keyToGive];
      }
    }
  }

  if (!(_state as any)._victoryAppliedRelics) {
    applyVictoryRelics(run, _state);
    (_state as any)._victoryAppliedRelics = true;
  }

  // 보스 처치 대사
  const defeatFlavor = isBossNode ? bossDefeatFlavor(run.combatEnemyDefIds?.[0] ?? '') : null;

  return el(
    'div',
    { class: 'combat-screen' },
    el(
      'div',
      { class: 'combat-top', style: { flexDirection: 'column', gap: '16px' } },
      el('h2', { style: { color: 'var(--good)', margin: 0 } }, isBossNode ? '👑 보스 처치!' : '승리!'),
      ...(defeatFlavor
        ? [el('div', {
            style: {
              color: 'var(--accent)',
              fontStyle: 'italic',
              maxWidth: '420px',
              textAlign: 'center',
              lineHeight: '1.6',
              fontSize: '14px',
            },
          }, defeatFlavor)]
        : []),
      el(
        'div',
        { style: { color: 'var(--muted)' } },
        `HP ${run.player.hp}/${run.player.maxHp}`,
      ),
      ...(droppedKey
        ? [el('div', { style: { color: 'var(--accent)', fontWeight: 'bold' } }, `🗝️ ${droppedKey} 획득!`)]
        : []),
      el(
        'button',
        {
          onClick: () => {
            setCombat(null);
            setScreen(nextScreen);
          },
        },
        nextLabel,
      ),
    ),
  );
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
  if (state.player.energy < def.cost) return;
  playSfx(def.type === 'attack' ? 'card_attack' : def.type === 'skill' ? 'card_skill' : 'card_power');
  // Animate via hotkey: find the card element in current hand DOM
  const handCards = document.querySelectorAll('.combat-bottom .card');
  const idxInHand = state.player.hand.findIndex((c) => c.uid === card.uid);
  if (idxInHand >= 0 && handCards[idxInHand]) {
    spawnCardPlayAnim(handCards[idxInHand] as HTMLElement, { exhaust: !!def.exhaust });
  }
  const before = snapshotFx(state);
  state.player.energy -= def.cost;
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
  if (state.player.energy < def.cost) return;

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
  detectFx(state, before);
  rerender();
  flushFx();
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

function applyVictoryRelics(run: any, _state: any): void {
  const cur = run.currentNodeId ? run.map.find((n: any) => n.id === run.currentNodeId) : null;
  if (run.player.relics.includes('burning_blood')) {
    run.player.hp = Math.min(run.player.maxHp, run.player.hp + 6);
  }
  if (run.player.relics.includes('blood_vial')) {
    run.player.hp = Math.min(run.player.maxHp, run.player.hp + 2);
  }
  if (run.player.relics.includes('herb_pouch')) {
    run.player.hp = Math.min(run.player.maxHp, run.player.hp + 5);
  }
  if (run.player.relics.includes('soul_lantern')) {
    run.player.hp = Math.min(run.player.maxHp, run.player.hp + 8);
  }
  if (run.player.relics.includes('meat_on_the_bone') && run.player.hp / run.player.maxHp <= 0.5) {
    run.player.hp = Math.min(run.player.maxHp, run.player.hp + 12);
  }
  if (run.player.relics.includes('rich_seal')) run.player.gold += 8;
  if (run.player.relics.includes('trophy_necklace')) {
    run.player.hp = Math.min(run.player.maxHp, run.player.hp + 8);
    run.player.gold += 12;
  }
  for (const syn of getActiveSynergies(run.player.relics)) {
    if (syn.timing !== 'combat_end') continue;
    if (syn.id === 'undying') {
      run.player.hp = Math.min(run.player.maxHp, run.player.hp + 10);
    }
  }
  if (run.player.potions.length < 3) {
    const isElite = cur?.kind === 'elite' || !!run.endless;
    const dropChance = isElite ? 0.5 : 0.3;
    const victoryRng = makeRng(run.seed * 71 + (run.endless?.wave ?? run.floor) * 13);
    if (victoryRng() < dropChance) {
      const dropped = pick(victoryRng, POTION_LIST);
      run.player.potions.push(dropped.id);
    }
  }
}

export function getKeyboardTargetedEnemyUid(state: CombatState): string | null {
  if (!selectedCardUid) return null;
  const alive = aliveEnemies(state);
  if (alive.length <= 1) return null; // auto-target case, not a manual highlight
  const e = alive[Math.min(targetedEnemyIdx, alive.length - 1)];
  return e?.uid ?? null;
}

