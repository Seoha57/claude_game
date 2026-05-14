import { el } from './dom';
import { getRunOrNull, getScreen, getCombatOrNull } from '../state';
import { RELIC_DEFS } from '../content/relics';
import { getCombat, getRun, setCombat, setScreen, rerender } from '../state';
import { getEffectiveDef } from '../content/cards';
import { openDeckOverlay } from './deck-overlay';
import { ENEMY_DEFS } from '../content/enemies';
import { STATUS_INFO, applyStatus, modifiedAttackDamage } from '../combat/statuses';
import { buildIntentDisplay } from '../combat/intent';
import { endPlayerTurn } from '../combat/combat';
import { playCard } from '../combat/effects';
import type { CardInstance, CombatState, Enemy } from '../types';
import { POTION_DEFS, POTION_LIST } from '../content/potions';
import { isCurseLike } from './deck-overlay';
import { playSfx } from '../audio';
import { makeRng, pick } from '../rng';
import { checkDamage, checkBlock, checkTurnCount, checkStrength, checkFreezeChain } from '../achievements';

let selectedCardUid: string | null = null;
let selectedPotionId: string | null = null;
let hoveredCardUid: string | null = null;

// Compute damage preview for a card against a specific enemy.
// Returns total per-hit damage * times, accounting for player strength/weak
// and enemy vulnerable. Block is not subtracted (player sees enemy block separately).
function computeCardDamageVsEnemy(card: CardInstance, player: { statuses: any }, enemy: Enemy): number {
  const def = getEffectiveDef(card);
  let total = 0;
  for (const eff of def.effects) {
    if (eff.kind === 'damage') {
      const per = modifiedAttackDamage(eff.amount, player as any, enemy);
      total += per * (eff.times ?? 1);
    } else if (eff.kind === 'damage_all') {
      const per = modifiedAttackDamage(eff.amount, player as any, enemy);
      total += per;
    }
  }
  return total;
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
    const dmg = computeCardDamageVsEnemy(card, state.player, e);
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
};

let lastPhasePlayed: string | null = null;

export function renderCombat(): HTMLElement {
  const state = getCombat();
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
    setTimeout(() => setScreen('lose'), 0);
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

  const hpFill = el('div', { class: 'fill', style: { width: `${(e.hp / e.maxHp) * 100}%` } });
  const hpBar = el(
    'div',
    { class: 'hp-bar' },
    hpFill,
    el('div', { class: 'text' }, `${e.hp}/${e.maxHp}${e.block > 0 ? ` 🛡${e.block}` : ''}`),
  );

  const intent = e.intent;
  const display = buildIntentDisplay(intent, e, state.player);
  const isAttack = intent.kind === 'attack' || intent.kind === 'attack_block' || intent.kind === 'attack_buff';

  // Perfect guard: total damage from this intent ≤ player's current block
  const perTickDmg = intent.damage !== undefined
    ? Math.max(0, (intent.damage + (e.statuses.strength ?? 0))
        * (e.statuses.weak ? 0.75 : 1)
        * (state.player.statuses.vulnerable ? 1.5 : 1))
    : 0;
  const totalIncoming = Math.floor(perTickDmg) * (intent.hits ?? 1);
  const perfectGuard = isAttack && totalIncoming > 0 && state.player.block >= totalIncoming;

  const intentEl = el(
    'div',
    {
      class: `intent ${intent.kind === 'block' ? 'block' : ''} ${
        intent.kind === 'buff' ? 'buff' : ''
      } ${intent.kind === 'debuff' ? 'debuff' : ''} ${perfectGuard ? 'perfect-guard' : ''}`,
      'data-tooltip': perfectGuard ? '🛡 안전: 방어도로 모두 막힘' : '',
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
    row.appendChild(
      el(
        'div',
        {
          class: `status ${info.buff ? 'buff' : 'debuff'}`,
          'data-tooltip': `${info.name}: ${info.description}`,
        },
        `${info.name} ${v}`,
      ),
    );
  }
  return row;
}

function renderMid(state: CombatState): HTMLElement {
  const p = state.player;
  const energy = el('div', { class: 'energy-orb' }, `${p.energy}/${p.maxEnergy}`);

  const hpFill = el('div', {
    class: 'fill',
    style: { width: `${(p.hp / p.maxHp) * 100}%` },
  });
  const hpBar = el(
    'div',
    { class: 'hp-bar', style: { width: '180px' } },
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

  const endTurn = el(
    'button',
    {
      class: 'end-turn-btn',
      onClick: () => {
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

  return el('div', { class: 'combat-mid' }, playerStats, relicBar, potionBar, piles, endTurn);
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
    }
    hand.appendChild(cardEl);
  });
  previousHandUids = newHandUids;
  // Restore on next frame so the layout is settled
  requestAnimationFrame(() => { hand.scrollLeft = savedHandScroll; });
  return hand;
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
  const upgraded = !!c.upgraded;
  return el(
    'div',
    {
      class: `card ${def.type} rarity-${def.rarity} ${curse ? 'curse' : ''} ${canPlay ? '' : 'disabled'} ${noEnergy ? 'no-energy' : ''} ${selected ? 'selected' : ''} ${upgraded ? 'upgraded' : ''}`,
      'data-card-uid': c.uid,
      onMouseEnter: () => onCardHover(c.uid),
      onMouseLeave: () => onCardHover(null),
      onClick: (e: MouseEvent) => {
        if (!canPlay) return;
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
  const bar = el('div', { class: 'relic-bar' });
  for (const id of relics) {
    const def = RELIC_DEFS[id];
    if (!def) continue;
    bar.appendChild(
      el('div', {
        class: 'relic-chip',
        'data-tooltip': `${def.name}\n${def.description}`,
      }, def.name),
    );
  }
  return bar;
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
  }
}

function typeLabel(t: string): string {
  if (t === 'attack') return '공격';
  if (t === 'skill') return '스킬';
  return '파워';
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
  const card = getSelectedCard(state);
  if (!card) return;
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
  for (const fx of pendingFx) {
    if (fx.kind === 'attack') {
      const enemyEl = document.querySelector(`[data-enemy-uid="${fx.enemyUid}"]`);
      if (enemyEl) {
        spawnAttackFx(enemyEl as HTMLElement, cc);
        spawnDamageNumber(enemyEl as HTMLElement, fx.damage);
      }
      if (!playedDmg) { playSfx('damage_hit'); playedDmg = true; }
    } else if (fx.kind === 'block') {
      spawnBlockFx(fx.amount);
      if (!playedBlock) { playSfx('block_gain'); playedBlock = true; }
    } else if (fx.kind === 'player_dmg') {
      spawnPlayerDamageNumber(fx.amount);
      if (!playedPlayerDmg) { playSfx('enemy_attack'); playedPlayerDmg = true; }
    }
  }
  pendingFx = [];
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
    if (run.player.relics.includes('burning_blood')) {
      run.player.hp = Math.min(run.player.maxHp, run.player.hp + 6);
    }
    if (run.player.relics.includes('blood_vial')) {
      run.player.hp = Math.min(run.player.maxHp, run.player.hp + 2);
    }
    if (run.player.relics.includes('herb_pouch')) {
      run.player.hp = Math.min(run.player.maxHp, run.player.hp + 5);
    }
    if (
      run.player.relics.includes('meat_on_the_bone') &&
      run.player.hp / run.player.maxHp <= 0.5
    ) {
      run.player.hp = Math.min(run.player.maxHp, run.player.hp + 12);
    }
    if (run.player.relics.includes('rich_seal')) {
      run.player.gold += 8;
    }
    // Potion drop
    if (run.player.potions.length < 3) {
      const isElite = cur?.kind === 'elite';
      const dropChance = isElite ? 0.5 : 0.3;
      const victoryRng = makeRng(run.seed * 71 + run.floor * 13);
      if (victoryRng() < dropChance) {
        const dropped = pick(victoryRng, POTION_LIST);
        run.player.potions.push(dropped.id);
      }
    }
    (_state as any)._victoryAppliedRelics = true;
  }

  return el(
    'div',
    { class: 'combat-screen' },
    el(
      'div',
      { class: 'combat-top', style: { flexDirection: 'column', gap: '16px' } },
      el('h2', { style: { color: 'var(--good)', margin: 0 } }, '승리!'),
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
  const def = getEffectiveDef(card);
  playSfx(def.type === 'attack' ? 'card_attack' : def.type === 'skill' ? 'card_skill' : 'card_power');
  if (state.player.energy < def.cost) return;
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

