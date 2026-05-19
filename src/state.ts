import type { CardInstance, CharacterClass, CombatState, Player, RunState, Screen } from './types';
import { CARD_DEFS } from './content/cards';
import { generateMap, startNode } from './map/map';
import { uid } from './rng';
import { getModifiers } from './ascension';
import { recordRunStart, recordWin, recordTrueWin, recordLoss } from './stats';
import { checkWin, checkTrueWin } from './achievements';
import { recordCards, recordRelic } from './codex';
import { playBgm, stopBgm } from './audio';
import type { BgmTrack } from './audio';

let runState: RunState | null = null;
let combatState: CombatState | null = null;
let currentScreen: Screen = 'title';
let renderFn: (() => void) | null = null;

const SAVE_KEY = 'dungeoncard_save';
const SAVE_VERSION = 2; // v2: card.upgraded is number (0/1/2)

interface SaveData {
  version: number;
  runState: RunState;
}

export function saveRun(): void {
  if (!runState) return;
  try {
    const data: SaveData = { version: SAVE_VERSION, runState };
    localStorage.setItem(SAVE_KEY, JSON.stringify(data));
  } catch (e) {
    console.warn('save failed', e);
  }
}

export function loadRun(): boolean {
  try {
    const raw = localStorage.getItem(SAVE_KEY);
    if (!raw) return false;
    const data = JSON.parse(raw) as SaveData;
    if (data.version !== SAVE_VERSION) {
      clearSave();
      return false;
    }
    runState = data.runState;
    combatState = null;
    return true;
  } catch (e) {
    console.warn('load failed', e);
    return false;
  }
}

export function hasSave(): boolean {
  try {
    const raw = localStorage.getItem(SAVE_KEY);
    if (!raw) return false;
    const data = JSON.parse(raw) as SaveData;
    return data.version === SAVE_VERSION;
  } catch {
    return false;
  }
}

export function clearSave(): void {
  try { localStorage.removeItem(SAVE_KEY); } catch { /* ignore */ }
}

export function setRenderer(fn: () => void): void {
  renderFn = fn;
}

export function rerender(): void {
  if (renderFn) renderFn();
}

export function getRun(): RunState {
  if (!runState) throw new Error('run not started');
  return runState;
}

export function getRunOrNull(): RunState | null {
  return runState;
}

export function getCombat(): CombatState {
  if (!combatState) throw new Error('no combat');
  return combatState;
}

export function getCombatOrNull(): CombatState | null {
  return combatState;
}

export function setCombat(c: CombatState | null): void {
  combatState = c;
}

export function getScreen(): Screen {
  return currentScreen;
}

export function setScreen(s: Screen): void {
  currentScreen = s;
  // Auto-save when entering a stable map state. Map = checkpoint.
  if (s === 'map' && runState) saveRun();
  // Stats — record run outcomes once on entry to terminal screens
  if (runState) {
    if (s === 'win') {
      recordWin(runState.characterClass, runState.ascension);
      checkWin(runState.characterClass, runState.ascension);
    } else if (s === 'true_win') {
      recordTrueWin(runState.characterClass, runState.ascension);
      checkTrueWin(runState.characterClass, runState.ascension);
    } else if (s === 'lose') {
      recordLoss(runState.characterClass);
    }
  }
  // Clear save on terminal screens.
  if (s === 'win' || s === 'true_win' || s === 'lose' || s === 'title') clearSave();
  // BGM track based on screen
  updateBgmForScreen(s);
  rerender();
}

function updateBgmForScreen(s: Screen): void {
  const track = bgmTrackForScreen(s);
  if (track) playBgm(track);
  else stopBgm();
}

function bgmTrackForScreen(s: Screen): BgmTrack | null {
  if (s === 'combat') {
    if (runState?.currentNodeId) {
      const n = runState.map.find((m) => m.id === runState!.currentNodeId);
      if (n?.kind === 'boss') return 'boss';
    }
    return 'combat';
  }
  if (s === 'map' || s === 'reward' || s === 'rest' || s === 'shop' || s === 'event' || s === 'chapter_clear') {
    return 'map';
  }
  if (s === 'title' || s === 'character_select' || s === 'help' || s === 'stats' || s === 'codex') {
    return 'title';
  }
  if (s === 'true_ending_choice') return 'boss';
  if (s === 'win' || s === 'true_win') return 'title';
  // 'lose' — no BGM (silent)
  return null;
}

export function startNewRun(seed: number, ascension = 0, characterClass: CharacterClass = 'swordmaster', options: { goToScreen?: Screen } = {}): void {
  const mods = getModifiers(ascension);
  const baseHpMap: Record<CharacterClass, number> = { swordmaster: 75, gunner: 70, fighter: 80, magician: 65, priest: 82 };
  const baseHp = Math.max(1, baseHpMap[characterClass] - mods.startingHpPenalty);
  const deck =
    characterClass === 'gunner' ? makeGunnerStarterDeck() :
    characterClass === 'fighter' ? makeFighterStarterDeck() :
    characterClass === 'magician' ? makeMagicianStarterDeck() :
    characterClass === 'priest' ? makePriestStarterDeck() :
    makeStarterDeck();
  for (let i = 0; i < mods.cursesInDeck; i++) deck.push(makeCard('wound'));
  const relicMap: Record<CharacterClass, string> = {
    swordmaster: 'burning_blood',
    gunner: 'bag_of_marbles',
    fighter: 'fighting_spirit',
    magician: 'mage_orb',
    priest: 'holy_chalice',
  };
  const startingRelic = relicMap[characterClass];

  const player: Player = {
    hp: baseHp,
    maxHp: baseHp,
    block: 0,
    energy: 0,
    maxEnergy: 3,
    gold: 0,
    statuses: {},
    deck,
    draw: [],
    hand: [],
    discard: [],
    exhaust: [],
    relics: [startingRelic],
    potions: [],
    keys: [],
  };
  const map = generateMap(makeSeedRng(seed), 1);
  runState = {
    player,
    map,
    currentNodeId: startNode(map).id,
    floor: 0,
    seed,
    chapter: 1,
    ascension,
    characterClass,
  };
  combatState = null;
  recordRunStart(characterClass);
  // Codex: starter deck + starting relic
  recordCards(deck.map((c) => c.defId));
  recordRelic(startingRelic);
  setScreen(options.goToScreen ?? 'map');
}

function makeStarterDeck(): CardInstance[] {
  const deck: CardInstance[] = [];
  for (let i = 0; i < 5; i++) deck.push(makeCard('strike'));
  for (let i = 0; i < 4; i++) deck.push(makeCard('defend'));
  deck.push(makeCard('bash'));
  return deck;
}

function makeGunnerStarterDeck(): CardInstance[] {
  const deck: CardInstance[] = [];
  for (let i = 0; i < 5; i++) deck.push(makeCard('g_rising_shot'));
  for (let i = 0; i < 4; i++) deck.push(makeCard('g_reload'));
  deck.push(makeCard('g_headshot'));
  return deck;
}

function makeFighterStarterDeck(): CardInstance[] {
  const deck: CardInstance[] = [];
  for (let i = 0; i < 5; i++) deck.push(makeCard('f_quick_kick'));
  for (let i = 0; i < 4; i++) deck.push(makeCard('f_nen_guard'));
  deck.push(makeCard('f_upper_kick'));
  return deck;
}

function makeMagicianStarterDeck(): CardInstance[] {
  const deck: CardInstance[] = [];
  for (let i = 0; i < 5; i++) deck.push(makeCard('m_magic_missile'));
  for (let i = 0; i < 4; i++) deck.push(makeCard('m_aura_shield'));
  deck.push(makeCard('m_phase_shift'));
  return deck;
}

function makePriestStarterDeck(): CardInstance[] {
  const deck: CardInstance[] = [];
  for (let i = 0; i < 5; i++) deck.push(makeCard('p_smash'));
  for (let i = 0; i < 4; i++) deck.push(makeCard('p_holy_guard'));
  deck.push(makeCard('p_lucky_strike'));
  return deck;
}

export function makeCard(defId: string): CardInstance {
  if (!CARD_DEFS[defId]) throw new Error(`unknown card def ${defId}`);
  return { uid: uid(), defId };
}

function makeSeedRng(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function startNextChapter(): void {
  if (!runState) return;
  const next = runState.chapter + 1;
  runState.chapter = next;
  const map = generateMap(makeSeedRng(runState.seed + next * 9999), next);
  runState.map = map;
  runState.currentNodeId = startNode(map).id;
  runState.floor = 0;
  combatState = null;
  setScreen('map');
}

export function endRun(): void {
  runState = null;
  combatState = null;
  setScreen('title');
}
