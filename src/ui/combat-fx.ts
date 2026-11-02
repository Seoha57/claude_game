// 전투 화면의 시각 효과 — 피격 표시, 방어도 획득, 데미지 숫자, 파티클.
// combat-ui.ts에서 떼어냈다. 상태는 pendingFx 하나뿐이고, 밖으로 나가는 건
// snapshot/detect/flush 네 쌍과 카드 연출뿐이다.
import { getRunOrNull } from '../state';
import { playSfx } from '../audio';
import { checkDamage } from '../achievements';
import { getSettings } from '../game-settings';
import { ic } from './art';
import type { CombatState } from '../types';

// ── Visual effects (attack hit marks, block gain, damage numbers) ──
type PendingFx =
  | { kind: 'attack'; enemyUid: string; damage: number }
  | { kind: 'block'; amount: number }
  | { kind: 'player_dmg'; amount: number }
  | { kind: 'player_heal'; amount: number }
  | { kind: 'enemy_died'; enemyUid: string }
  | { kind: 'energy_gain' }
  | { kind: 'enemy_lunge'; enemyUid: string; delay: number };
let pendingFx: PendingFx[] = [];

/** 전투 사이에 남은 연출을 버린다 (resetCombatUiState에서 호출). */
export function resetFx(): void {
  pendingFx = [];
}

export function snapshotFx(state: CombatState) {
  return {
    enemies: state.enemies.map((e) => ({ uid: e.uid, total: e.hp + e.block, hp: e.hp })),
    playerBlock: state.player.block,
    playerHp: state.player.hp,
    playerEnergy: state.player.energy,
  };
}

export function detectFx(state: CombatState, before: ReturnType<typeof snapshotFx>): void {
  for (const e of state.enemies) {
    const b = before.enemies.find((x) => x.uid === e.uid);
    if (!b) continue;
    const dmg = b.total - (e.hp + e.block);
    if (dmg > 0) {
      pendingFx.push({ kind: 'attack', enemyUid: e.uid, damage: dmg });
      checkDamage(dmg);
    }
    if (b.hp > 0 && e.hp <= 0) {
      pendingFx.push({ kind: 'enemy_died', enemyUid: e.uid });
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
  const hpGained = state.player.hp - before.playerHp;
  if (hpGained > 0) {
    pendingFx.push({ kind: 'player_heal', amount: hpGained });
  }
  if (state.player.energy > before.playerEnergy) {
    pendingFx.push({ kind: 'energy_gain' });
  }
}

export function detectEnemyTurnFx(state: CombatState, before: ReturnType<typeof snapshotFx>): void {
  const hpLost = before.playerHp - state.player.hp;
  const blockGained = state.player.block - before.playerBlock;
  // Lunge all living enemies that acted (staggered)
  let lungeIdx = 0;
  for (const e of state.enemies) {
    const b = before.enemies.find((x) => x.uid === e.uid);
    if (!b || b.hp <= 0) continue;
    pendingFx.push({ kind: 'enemy_lunge', enemyUid: e.uid, delay: lungeIdx * 200 });
    lungeIdx++;
  }
  if (hpLost > 0) {
    pendingFx.push({ kind: 'player_dmg', amount: hpLost });
  }
  if (blockGained > 0) {
    pendingFx.push({ kind: 'block', amount: blockGained });
  }
  // Detect enemies that died during enemy turn (e.g., thorns/poison)
  for (const e of state.enemies) {
    const b = before.enemies.find((x) => x.uid === e.uid);
    if (!b) continue;
    if (b.hp > 0 && e.hp <= 0) {
      pendingFx.push({ kind: 'enemy_died', enemyUid: e.uid });
    }
  }
}

export function flushFx(): void {
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
    } else if (fx.kind === 'player_heal') {
      spawnHealNumber(fx.amount);
      triggerHealGlow();
    } else if (fx.kind === 'energy_gain') {
      triggerEnergyPulse();
    } else if (fx.kind === 'enemy_died') {
      triggerEnemyDeath(fx.enemyUid);
    }
  }
  if (maxDamageThisFlush >= 25) triggerScreenShake('heavy');
  else if (maxDamageThisFlush >= 15) triggerScreenShake('light');
  pendingFx = [];
}

export function flushEnemyTurnFx(): void {
  const lunges = pendingFx.filter((fx): fx is Extract<PendingFx, { kind: 'enemy_lunge' }> => fx.kind === 'enemy_lunge');
  const playerDmg = pendingFx.find((fx): fx is Extract<PendingFx, { kind: 'player_dmg' }> => fx.kind === 'player_dmg');
  const blockFx = pendingFx.find((fx): fx is Extract<PendingFx, { kind: 'block' }> => fx.kind === 'block');
  const deaths = pendingFx.filter((fx): fx is Extract<PendingFx, { kind: 'enemy_died' }> => fx.kind === 'enemy_died');

  const maxDelay = lunges.length > 0 ? Math.max(...lunges.map((l) => l.delay)) : 0;

  for (const lunge of lunges) {
    setTimeout(() => {
      const enemyEl = document.querySelector(`[data-enemy-uid="${lunge.enemyUid}"]`);
      if (enemyEl) triggerEnemyLunge(enemyEl as HTMLElement);
    }, lunge.delay);
  }

  // Player damage appears after first lunge impact
  const impactDelay = lunges.length > 0 ? 150 : 0;
  setTimeout(() => {
    if (playerDmg) {
      spawnPlayerDamageNumber(playerDmg.amount);
      triggerPlayerHitFlash();
      playSfx('enemy_attack');
      if (playerDmg.amount >= 25) triggerScreenShake('heavy');
      else if (playerDmg.amount >= 15) triggerScreenShake('light');
    }
    if (blockFx) {
      spawnBlockFx(blockFx.amount);
      playSfx('block_gain');
    }
  }, impactDelay);

  // Deaths after all lunges
  setTimeout(() => {
    for (const d of deaths) triggerEnemyDeath(d.enemyUid);
  }, maxDelay + 300);

  pendingFx = [];
}

function triggerEnemyLunge(enemyEl: HTMLElement): void {
  enemyEl.classList.remove('enemy-lunge');
  void enemyEl.offsetWidth;
  enemyEl.classList.add('enemy-lunge');
  setTimeout(() => enemyEl.classList.remove('enemy-lunge'), 400);
}

function triggerEnemyDeath(enemyUid: string): void {
  const enemyEl = document.querySelector(`[data-enemy-uid="${enemyUid}"]`) as HTMLElement | null;
  if (!enemyEl || enemyEl.classList.contains('death-anim')) return;
  spawnDeathParticles(enemyEl.getBoundingClientRect());
  enemyEl.classList.add('death-anim');
  playSfx('damage_hit');
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
  const stats = document.querySelector('.player-stats') as HTMLElement | null;
  if (stats) {
    stats.classList.remove('player-hit-shake');
    void stats.offsetWidth;
    stats.classList.add('player-hit-shake');
    setTimeout(() => stats.classList.remove('player-hit-shake'), 350);
  }
}

function triggerScreenShake(intensity: 'light' | 'heavy'): void {
  if (!getSettings().screenShake) return;
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

function spawnHealNumber(amount: number): void {
  const stats = document.querySelector('.player-stats');
  if (!stats) return;
  const float = document.createElement('div');
  float.className = 'heal-float';
  float.textContent = `+${amount}`;
  (stats as HTMLElement).style.position = 'relative';
  stats.appendChild(float);
  setTimeout(() => float.remove(), 1050);
}

function triggerHealGlow(): void {
  const stats = document.querySelector('.player-stats') as HTMLElement | null;
  if (!stats) return;
  stats.classList.remove('heal-glow');
  void stats.offsetWidth;
  stats.classList.add('heal-glow');
  setTimeout(() => stats.classList.remove('heal-glow'), 600);
}

function triggerEnergyPulse(): void {
  const orb = document.querySelector('.energy-orb') as HTMLElement | null;
  if (!orb) return;
  orb.classList.remove('energy-pulse');
  void orb.offsetWidth;
  orb.classList.add('energy-pulse');
  setTimeout(() => orb.classList.remove('energy-pulse'), 450);
}

export function spawnCardPlayAnim(cardEl: HTMLElement, opts: { exhaust?: boolean; targetEl?: HTMLElement } = {}): void {
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
  } else if (opts.targetEl) {
    const targetRect = opts.targetEl.getBoundingClientRect();
    const flyX = (targetRect.left + targetRect.width / 2) - (rect.left + rect.width / 2);
    const flyY = (targetRect.top + targetRect.height / 2) - (rect.top + rect.height / 2);
    clone.style.setProperty('--fly-x', `${flyX}px`);
    clone.style.setProperty('--fly-y', `${flyY}px`);
    clone.classList.add('card-flying');
    document.body.appendChild(clone);
    setTimeout(() => clone.remove(), 480);
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

function spawnDeathParticles(rect: DOMRect): void {
  const cx = rect.left + rect.width / 2;
  const cy = rect.top + rect.height / 2;
  const count = 18;
  for (let i = 0; i < count; i++) {
    const p = document.createElement('div');
    p.className = 'death-particle';
    const angle = (i / count) * Math.PI * 2 + Math.random() * 0.5;
    const dist = 100 + Math.random() * 150;
    p.style.left = `${cx}px`;
    p.style.top = `${cy}px`;
    p.style.setProperty('--dx', `${Math.cos(angle) * dist}px`);
    p.style.setProperty('--dy', `${Math.sin(angle) * dist}px`);
    p.style.animationDelay = `${Math.random() * 0.12}s`;
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
    burst.innerHTML = ic('sparkle');
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
  float.innerHTML = `${ic('shield')} +${amount}`;
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
