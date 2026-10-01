const KEY = 'dod_game_settings';

export interface GameSettings {
  animSpeed: 'fast' | 'normal' | 'slow';
  screenShake: boolean;
  autoEndTurn: boolean;
  fontSize: 'small' | 'normal' | 'large';
  colorBlind: boolean;
}

const DEFAULTS: GameSettings = {
  animSpeed: 'normal',
  screenShake: true,
  autoEndTurn: false,
  fontSize: 'normal',
  colorBlind: false,
};

let cache: GameSettings | null = null;

export function getSettings(): GameSettings {
  if (cache) return cache;
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) {
      const p = JSON.parse(raw) as Partial<GameSettings>;
      cache = { ...DEFAULTS, ...p };
      return cache;
    }
  } catch { /* ignore */ }
  cache = { ...DEFAULTS };
  return cache;
}

export function setSetting<K extends keyof GameSettings>(key: K, value: GameSettings[K]): void {
  const s = getSettings();
  s[key] = value;
  cache = s;
  try { localStorage.setItem(KEY, JSON.stringify(s)); } catch { /* ignore */ }
  applyToDOM();
}

export function getAnimMultiplier(): number {
  const s = getSettings();
  if (s.animSpeed === 'fast') return 0.4;
  if (s.animSpeed === 'slow') return 1.8;
  return 1;
}

export function applyToDOM(): void {
  const s = getSettings();
  const root = document.documentElement;
  root.style.setProperty('--anim-mult', String(getAnimMultiplier()));
  root.classList.toggle('no-shake', !s.screenShake);
  root.classList.toggle('color-blind', s.colorBlind);
  root.classList.toggle('font-small', s.fontSize === 'small');
  root.classList.toggle('font-large', s.fontSize === 'large');
}
