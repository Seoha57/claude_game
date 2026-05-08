// Lightweight Web Audio synth-based SFX engine. No external files needed.

const STORAGE_KEY = 'dungeoncard_audio';

interface AudioPrefs {
  muted: boolean;
  volume: number; // 0..1
}

function loadPrefs(): AudioPrefs {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const p = JSON.parse(raw) as Partial<AudioPrefs>;
      return {
        muted: typeof p.muted === 'boolean' ? p.muted : false,
        volume: typeof p.volume === 'number' ? Math.max(0, Math.min(1, p.volume)) : 0.5,
      };
    }
  } catch { /* ignore */ }
  return { muted: false, volume: 0.5 };
}

function savePrefs(): void {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify({ muted, volume })); } catch { /* ignore */ }
}

let ctx: AudioContext | null = null;
let masterGain: GainNode | null = null;
let { muted, volume } = loadPrefs();

function ensureCtx(): boolean {
  if (typeof window === 'undefined') return false;
  if (ctx) return true;
  try {
    const Ctor = (window as any).AudioContext ?? (window as any).webkitAudioContext;
    if (!Ctor) return false;
    ctx = new Ctor() as AudioContext;
    masterGain = ctx.createGain();
    masterGain.gain.value = muted ? 0 : volume;
    masterGain.connect(ctx.destination);
    return true;
  } catch { return false; }
}

// Resume audio on first user gesture (browser autoplay policy)
if (typeof window !== 'undefined') {
  const onGesture = () => {
    if (ensureCtx() && ctx?.state === 'suspended') ctx.resume().catch(() => { /* ignore */ });
  };
  window.addEventListener('pointerdown', onGesture, { once: false });
  window.addEventListener('keydown', onGesture, { once: false });
}

export function setMuted(m: boolean): void {
  muted = m;
  if (masterGain) masterGain.gain.value = muted ? 0 : volume;
  savePrefs();
}
export function getMuted(): boolean { return muted; }

export function setVolume(v: number): void {
  volume = Math.max(0, Math.min(1, v));
  if (masterGain && !muted) masterGain.gain.value = volume;
  savePrefs();
}
export function getVolume(): number { return volume; }

// ── Synth primitives ──
type Wave = OscillatorType;

function playTone(opts: { freq: number; duration: number; type?: Wave; gain?: number; freqEnd?: number; attack?: number }): void {
  if (!ensureCtx() || !ctx || !masterGain) return;
  const now = ctx.currentTime;
  const osc = ctx.createOscillator();
  const g = ctx.createGain();
  osc.type = opts.type ?? 'sine';
  osc.frequency.setValueAtTime(opts.freq, now);
  if (opts.freqEnd !== undefined) {
    osc.frequency.exponentialRampToValueAtTime(Math.max(20, opts.freqEnd), now + opts.duration);
  }
  const peak = opts.gain ?? 0.3;
  const att = opts.attack ?? 0.005;
  g.gain.setValueAtTime(0.0001, now);
  g.gain.exponentialRampToValueAtTime(peak, now + att);
  g.gain.exponentialRampToValueAtTime(0.0001, now + opts.duration);
  osc.connect(g);
  g.connect(masterGain);
  osc.start(now);
  osc.stop(now + opts.duration + 0.05);
}

function playNoise(opts: { duration: number; filterFreq: number; q?: number; gain?: number }): void {
  if (!ensureCtx() || !ctx || !masterGain) return;
  const now = ctx.currentTime;
  const len = Math.max(1, Math.floor(ctx.sampleRate * opts.duration));
  const buf = ctx.createBuffer(1, len, ctx.sampleRate);
  const data = buf.getChannelData(0);
  for (let i = 0; i < len; i++) data[i] = Math.random() * 2 - 1;
  const src = ctx.createBufferSource();
  src.buffer = buf;
  const filter = ctx.createBiquadFilter();
  filter.type = 'bandpass';
  filter.frequency.value = opts.filterFreq;
  filter.Q.value = opts.q ?? 1;
  const g = ctx.createGain();
  const peak = opts.gain ?? 0.3;
  g.gain.setValueAtTime(0.0001, now);
  g.gain.exponentialRampToValueAtTime(peak, now + 0.005);
  g.gain.exponentialRampToValueAtTime(0.0001, now + opts.duration);
  src.connect(filter); filter.connect(g); g.connect(masterGain);
  src.start(now);
  src.stop(now + opts.duration + 0.02);
}

function playArpeggio(freqs: number[], stepDur: number, type: Wave = 'triangle', gain = 0.25): void {
  for (let i = 0; i < freqs.length; i++) {
    setTimeout(() => playTone({ freq: freqs[i], duration: stepDur * 1.2, type, gain }), i * stepDur * 1000);
  }
}

// ── SFX library ──
export type SfxName =
  | 'card_attack'
  | 'card_skill'
  | 'card_power'
  | 'damage_hit'
  | 'block_gain'
  | 'card_draw'
  | 'turn_end'
  | 'enemy_attack'
  | 'victory'
  | 'defeat'
  | 'click'
  | 'relic'
  | 'potion'
  | 'upgrade'
  | 'gold';

export function playSfx(name: SfxName): void {
  if (muted) return;
  switch (name) {
    case 'card_attack':
      playNoise({ duration: 0.12, filterFreq: 1800, q: 4, gain: 0.35 });
      playTone({ freq: 280, freqEnd: 120, duration: 0.12, type: 'square', gain: 0.18 });
      break;
    case 'card_skill':
      playNoise({ duration: 0.18, filterFreq: 900, q: 6, gain: 0.22 });
      playTone({ freq: 600, freqEnd: 1100, duration: 0.18, type: 'triangle', gain: 0.18 });
      break;
    case 'card_power':
      playArpeggio([300, 450, 600], 0.08, 'triangle', 0.25);
      break;
    case 'damage_hit':
      playNoise({ duration: 0.15, filterFreq: 400, q: 1, gain: 0.4 });
      playTone({ freq: 160, freqEnd: 60, duration: 0.13, type: 'sawtooth', gain: 0.25 });
      break;
    case 'block_gain':
      playTone({ freq: 800, freqEnd: 1100, duration: 0.18, type: 'triangle', gain: 0.25 });
      playTone({ freq: 1200, duration: 0.12, type: 'sine', gain: 0.18 });
      break;
    case 'card_draw':
      playTone({ freq: 1400, freqEnd: 1700, duration: 0.05, type: 'triangle', gain: 0.18 });
      break;
    case 'turn_end':
      playTone({ freq: 500, freqEnd: 200, duration: 0.25, type: 'triangle', gain: 0.2 });
      break;
    case 'enemy_attack':
      playNoise({ duration: 0.2, filterFreq: 250, q: 0.8, gain: 0.5 });
      playTone({ freq: 120, freqEnd: 50, duration: 0.18, type: 'sawtooth', gain: 0.32 });
      break;
    case 'victory':
      playArpeggio([523, 659, 784, 1047], 0.09, 'triangle', 0.3);
      break;
    case 'defeat':
      playTone({ freq: 320, freqEnd: 90, duration: 0.7, type: 'sawtooth', gain: 0.3 });
      break;
    case 'click':
      playTone({ freq: 1000, duration: 0.03, type: 'square', gain: 0.12 });
      break;
    case 'relic':
      playArpeggio([880, 1175, 1568], 0.12, 'triangle', 0.32);
      break;
    case 'potion':
      playTone({ freq: 600, freqEnd: 900, duration: 0.18, type: 'sine', gain: 0.22 });
      playNoise({ duration: 0.1, filterFreq: 2400, q: 8, gain: 0.12 });
      break;
    case 'upgrade':
      playArpeggio([523, 784, 1047, 1568], 0.08, 'triangle', 0.32);
      break;
    case 'gold':
      playArpeggio([1200, 1500], 0.05, 'sine', 0.2);
      break;
  }
}
