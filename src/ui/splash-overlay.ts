import { el } from './dom';

export interface SplashOptions {
  title: string;
  subtitle?: string;
  emoji?: string;
  flavor?: string;
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
  1: { title: '잿빛 사원', subtitle: 'Chapter 1', emoji: '🏛️', flavor: '광기와 혼돈이 깃든 던전' },
  2: { title: '기계 혁명의 폐허', subtitle: 'Chapter 2', emoji: '⚙️', flavor: '추적자들이 도사리는 영역' },
  3: { title: '이샤리스의 심연', subtitle: 'Chapter 3', emoji: '🌌', flavor: '공허의 끝, 마지막 시련' },
  4: { title: '차원의 문 너머', subtitle: '✦ Chapter 4 — 진엔딩 ✦', emoji: '🌀', flavor: '균열의 끝에 무엇이 기다릴까' },
};

export function showChapterIntro(chapter: number, onDismiss?: () => void): void {
  const info = CHAPTER_INFO[chapter] ?? { title: `Chapter ${chapter}`, subtitle: '', emoji: '🗺' };
  showSplash({
    variant: 'chapter',
    title: info.title,
    subtitle: info.subtitle,
    emoji: info.emoji,
    flavor: info.flavor,
    duration: 2200,
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
