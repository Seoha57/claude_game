import { el } from './dom';
import { makeRng } from '../rng';
import { getRunOrNull } from '../state';
import {
  BOSS_ENCOUNTERS,
  CH2_BOSS_ENCOUNTERS,
  CH3_BOSS_ENCOUNTERS,
  CH4_BOSS_ENCOUNTERS,
  ENEMY_DEFS,
} from '../content/enemies';
import { ENEMY_ART } from './combat-ui';
import { CHAPTER_LORE } from '../content/lore';

export interface NextBossInfo {
  name: string;
  emoji: string;
}

export interface SplashOptions {
  title: string;
  subtitle?: string;
  emoji?: string;
  flavor?: string;
  nextBoss?: NextBossInfo;
  duration?: number; // ms, default 2200
  onDismiss?: () => void;
  variant?: 'chapter' | 'boss';
}

let activeOverlay: HTMLElement | null = null;

export function showSplash(opts: SplashOptions): void {
  // Dismiss any existing splash first
  dismissSplash();

  const duration = opts.duration ?? 2200;
  const variant = opts.variant ?? 'chapter';

  const overlay = el('div', {
    class: `splash-overlay splash-${variant}`,
  });

  const inner = el('div', { class: 'splash-inner' });
  if (opts.emoji) {
    inner.appendChild(el('div', { class: 'splash-emoji' }, opts.emoji));
  }
  inner.appendChild(el('div', { class: 'splash-title' }, opts.title));
  if (opts.subtitle) {
    inner.appendChild(el('div', { class: 'splash-subtitle' }, opts.subtitle));
  }
  if (opts.flavor) {
    inner.appendChild(el('div', { class: 'splash-flavor' }, opts.flavor));
  }
  if (opts.nextBoss) {
    const boss = opts.nextBoss;
    inner.appendChild(
      el(
        'div',
        { class: 'splash-next-boss' },
        el('span', { class: 'splash-next-boss-label' }, '이번 챕터 보스: '),
        el('span', { class: 'splash-next-boss-emoji' }, boss.emoji),
        el('span', { class: 'splash-next-boss-name' }, boss.name),
      ),
    );
  }
  inner.appendChild(el('div', { class: 'splash-skip' }, '클릭 또는 키 입력으로 건너뛰기'));
  overlay.appendChild(inner);

  let dismissed = false;
  const dismiss = () => {
    if (dismissed) return;
    dismissed = true;
    overlay.classList.add('splash-fadeout');
    setTimeout(() => {
      overlay.remove();
      if (activeOverlay === overlay) activeOverlay = null;
      window.removeEventListener('keydown', onKey);
      opts.onDismiss?.();
    }, 280);
  };

  const onKey = (_e: KeyboardEvent) => dismiss();
  overlay.addEventListener('click', dismiss);
  window.addEventListener('keydown', onKey);

  // Auto-dismiss after duration
  setTimeout(dismiss, duration);

  document.body.appendChild(overlay);
  activeOverlay = overlay;
}

export function dismissSplash(): void {
  if (activeOverlay) {
    activeOverlay.remove();
    activeOverlay = null;
  }
}

// ── Chapter info presets ──
const CHAPTER_INFO: Record<number, { title: string; subtitle: string; emoji: string; flavor?: string }> = {
  1: { title: '잿빛 사원', subtitle: 'Chapter 1', emoji: '🏛️', flavor: CHAPTER_LORE[1] },
  2: { title: '기계 혁명의 폐허', subtitle: 'Chapter 2', emoji: '⚙️', flavor: CHAPTER_LORE[2] },
  3: { title: '심연의 균열', subtitle: 'Chapter 3', emoji: '🌌', flavor: CHAPTER_LORE[3] },
  4: { title: '차원의 문 너머', subtitle: '✦ Chapter 4 — 진엔딩 ✦', emoji: '🌀', flavor: CHAPTER_LORE[4] },
};

// Compute which boss the player will face for the given chapter.
// Boss selection is deterministic based on run seed + boss-node position.
function getBossForChapter(seed: number, chapter: number): { id: string; name: string; emoji: string } | null {
  let table: string[][];
  let bossX: number, bossY: number;
  if (chapter === 4) {
    table = CH4_BOSS_ENCOUNTERS;
    bossX = 1;
    bossY = 2;
  } else {
    bossX = 0;
    bossY = 7;
    table =
      chapter === 3 ? CH3_BOSS_ENCOUNTERS :
      chapter === 2 ? CH2_BOSS_ENCOUNTERS :
      BOSS_ENCOUNTERS;
  }
  const rng = makeRng(seed + bossY * 31 + bossX);
  const idx = Math.floor(rng() * table.length);
  const bossId = table[idx][0];
  const def = ENEMY_DEFS[bossId];
  if (!def) return null;
  return { id: bossId, name: def.name, emoji: ENEMY_ART[bossId] ?? '👑' };
}

export function showChapterIntro(chapter: number, onDismiss?: () => void): void {
  const info = CHAPTER_INFO[chapter] ?? { title: `Chapter ${chapter}`, subtitle: '', emoji: '🗺' };
  const run = getRunOrNull();
  const bossPreview = run ? getBossForChapter(run.seed, chapter) : null;
  showSplash({
    variant: 'chapter',
    title: info.title,
    subtitle: info.subtitle,
    emoji: info.emoji,
    flavor: info.flavor,
    nextBoss: bossPreview ? { name: bossPreview.name, emoji: bossPreview.emoji } : undefined,
    duration: 2600, // slightly longer so player has time to read the boss preview
    onDismiss,
  });
}

// ── Boss intro ──
export interface BossIntroInfo {
  name: string;
  emoji: string;
  hp: number;
  flavor?: string;
}

export function showBossIntro(info: BossIntroInfo, onDismiss: () => void): void {
  showSplash({
    variant: 'boss',
    title: info.name,
    subtitle: `❤ HP ${info.hp}`,
    emoji: info.emoji,
    flavor: info.flavor ?? '강력한 적이 길을 막아선다...',
    duration: 2400,
    onDismiss,
  });
}
