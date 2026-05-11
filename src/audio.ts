// Lightweight Web Audio synth-based SFX + procedural BGM engine.

const STORAGE_KEY = 'dungeoncard_audio';

interface AudioPrefs {
  muted: boolean;
  volume: number;     // master volume 0..1
  bgmMuted: boolean;
  bgmVolume: number;  // bgm sub-mix 0..1
}

function loadPrefs(): AudioPrefs {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const p = JSON.parse(raw) as Partial<AudioPrefs>;
      return {
        muted: typeof p.muted === 'boolean' ? p.muted : false,
        volume: typeof p.volume === 'number' ? Math.max(0, Math.min(1, p.volume)) : 0.5,
        bgmMuted: typeof p.bgmMuted === 'boolean' ? p.bgmMuted : true,  // default OFF
        bgmVolume: typeof p.bgmVolume === 'number' ? Math.max(0, Math.min(1, p.bgmVolume)) : 0.35,
      };
    }
  } catch { /* ignore */ }
  return { muted: false, volume: 0.5, bgmMuted: true, bgmVolume: 0.35 };
}

function savePrefs(): void {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify({ muted, volume, bgmMuted, bgmVolume })); } catch { /* ignore */ }
}

let ctx: AudioContext | null = null;
let masterGain: GainNode | null = null;
let bgmGain: GainNode | null = null;
let { muted, volume, bgmMuted, bgmVolume } = loadPrefs();

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
    // BGM sub-mix routed through master
    bgmGain = ctx.createGain();
    bgmGain.gain.value = bgmMuted ? 0 : bgmVolume;
    bgmGain.connect(masterGain);
    return true;
  } catch { return false; }
}

// Resume audio on first user gesture (browser autoplay policy)
if (typeof window !== 'undefined') {
  const onGesture = () => {
    if (ensureCtx() && ctx?.state === 'suspended') {
      ctx.resume().catch(() => { /* ignore */ });
    }
    // If BGM enabled but not playing yet (deferred from before interaction), start it
    if (!bgmMuted && intendedTrack && !activeTrack) {
      actuallyStartBgm(intendedTrack);
    }
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

// ─────────────────────────────────────────────────────────────
// Procedural BGM
// ─────────────────────────────────────────────────────────────

export type BgmTrack = 'title' | 'map' | 'combat' | 'boss';

interface TrackDef {
  pads: number[];      // chord drone frequencies (low Hz)
  arp: number[];       // arpeggio note sequence (mid Hz)
  bpm: number;         // arpeggio tempo
  filterHz: number;    // pad lowpass cutoff
  padWave: OscillatorType;
  arpWave: OscillatorType;
  padGain: number;
  arpGain: number;
}

const TRACKS: Record<BgmTrack, TrackDef> = {
  // Atmospheric, slow, mysterious
  title: {
    pads: [110, 138.6, 164.8],          // A2 dim chord (A C# E)... actually A C E = A minor
    arp:  [440, 523.3, 659.3, 880, 659.3, 523.3],
    bpm: 80,
    filterHz: 700,
    padWave: 'sine',
    arpWave: 'triangle',
    padGain: 0.09,
    arpGain: 0.04,
  },
  // Exploring, mid-tempo, adventurous
  map: {
    pads: [146.8, 174.6, 220],          // D3 minor (D F A)
    arp:  [293.7, 349.2, 440, 587.3, 440, 349.2],
    bpm: 100,
    filterHz: 1100,
    padWave: 'triangle',
    arpWave: 'triangle',
    padGain: 0.08,
    arpGain: 0.04,
  },
  // Tense, faster, combat
  combat: {
    pads: [82.4, 103.8, 123.5],         // E2 minor (E G B)
    arp:  [329.6, 392, 493.9, 659.3, 493.9, 392, 329.6, 246.9],
    bpm: 130,
    filterHz: 1400,
    padWave: 'sawtooth',
    arpWave: 'square',
    padGain: 0.06,
    arpGain: 0.04,
  },
  // Heavy, slower, ominous
  boss: {
    pads: [65.4, 82.4, 98],             // C2 minor (C Eb G)... low E G
    arp:  [261.6, 311.1, 392, 523.3, 392, 311.1],
    bpm: 95,
    filterHz: 600,
    padWave: 'sawtooth',
    arpWave: 'triangle',
    padGain: 0.07,
    arpGain: 0.05,
  },
};

let activeTrack: BgmTrack | null = null;
let intendedTrack: BgmTrack | null = null;
let activeNodes: AudioNode[] = [];
let arpTimer: number | null = null;

function clearActiveNodes(): void {
  if (arpTimer !== null) { clearInterval(arpTimer); arpTimer = null; }
  if (ctx) {
    const fadeEnd = ctx.currentTime + 0.25;
    for (const n of activeNodes) {
      try {
        if ((n as OscillatorNode).stop) {
          (n as OscillatorNode).stop(fadeEnd + 0.05);
        }
      } catch { /* ignore */ }
    }
  }
  // Disconnect after fade
  const toCleanup = activeNodes;
  activeNodes = [];
  setTimeout(() => {
    for (const n of toCleanup) try { (n as any).disconnect(); } catch { /* ignore */ }
  }, 400);
}

function actuallyStartBgm(name: BgmTrack): void {
  if (!ensureCtx() || !ctx || !bgmGain) return;
  const t = TRACKS[name];
  if (!t) return;

  activeTrack = name;
  const now = ctx.currentTime;

  // Start pad drones
  for (const freq of t.pads) {
    const osc = ctx.createOscillator();
    osc.type = t.padWave;
    osc.frequency.value = freq;
    osc.detune.value = (Math.random() - 0.5) * 6;  // mild detune for warmth

    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = t.filterHz;
    filter.Q.value = 0.7;

    const g = ctx.createGain();
    g.gain.setValueAtTime(0.0001, now);
    g.gain.exponentialRampToValueAtTime(t.padGain, now + 0.5);

    osc.connect(filter); filter.connect(g); g.connect(bgmGain);
    osc.start(now);
    activeNodes.push(osc, filter, g);
  }

  // Arpeggio loop
  const stepMs = (60 / t.bpm / 2) * 1000;  // 8th notes
  let step = 0;
  arpTimer = window.setInterval(() => {
    if (!ctx || !bgmGain || activeTrack !== name) return;
    const noteFreq = t.arp[step % t.arp.length];
    step++;
    const nt = ctx.currentTime;
    const osc = ctx.createOscillator();
    osc.type = t.arpWave;
    osc.frequency.value = noteFreq;
    const g = ctx.createGain();
    g.gain.setValueAtTime(0.0001, nt);
    g.gain.exponentialRampToValueAtTime(t.arpGain, nt + 0.02);
    g.gain.exponentialRampToValueAtTime(0.0001, nt + 0.4);
    osc.connect(g); g.connect(bgmGain);
    osc.start(nt);
    osc.stop(nt + 0.45);
  }, stepMs);
}

export function playBgm(name: BgmTrack): void {
  intendedTrack = name;
  if (bgmMuted) return;
  if (activeTrack === name) return;
  if (activeTrack) {
    clearActiveNodes();
    setTimeout(() => actuallyStartBgm(name), 300);
  } else {
    actuallyStartBgm(name);
  }
}

export function stopBgm(): void {
  intendedTrack = null;
  if (activeTrack) {
    clearActiveNodes();
    activeTrack = null;
  }
}

export function setBgmMuted(m: boolean): void {
  bgmMuted = m;
  if (bgmGain) bgmGain.gain.value = m ? 0 : bgmVolume;
  if (m && activeTrack) {
    clearActiveNodes();
    activeTrack = null;
  } else if (!m && intendedTrack && !activeTrack) {
    actuallyStartBgm(intendedTrack);
  }
  savePrefs();
}
export function getBgmMuted(): boolean { return bgmMuted; }

export function setBgmVolume(v: number): void {
  bgmVolume = Math.max(0, Math.min(1, v));
  if (bgmGain && !bgmMuted) bgmGain.gain.value = bgmVolume;
  savePrefs();
}
export function getBgmVolume(): number { return bgmVolume; }
