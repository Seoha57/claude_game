import type { CardInstance, CharacterClass, CombatState, Player, RunState, Screen } from './types';
import { CARD_DEFS } from './content/cards';
import { generateMap, startNode } from './map/map';
import { uid } from './rng';
import { getModifiers } from './ascension';
import { recordRunStart, recordWin, recordTrueWin, recordLoss } from './stats';
import { checkWin, checkTrueWin, getUnlockedCount } from './achievements';
import { recordCards, recordRelic, getCodexCounts } from './codex';
import { playBgm, stopBgm } from './audio';
import type { BgmTrack } from './audio';
import { markDirty } from './sync/sync';
import type { DailyConstraint, DailyOutcome } from './daily';
import { setDailyResult } from './daily';
import { newUnlocksAfterWin } from './unlocks';
import { loadStats } from './stats';
import { recordRunHistory } from './run-history';
import type { RunOutcome } from './run-history';
import { ENEMY_DEFS } from './content/enemies';

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
    markDirty();
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
  markDirty();
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
      // Snapshot wins BEFORE recording so unlock toast can compare
      const prev = snapshotWins();
      recordWin(runState.characterClass, runState.ascension);
      checkWin(runState.characterClass, runState.ascension);
      maybeRecordDaily(runState, 'won');
      maybeShowUnlockToast(prev);
      recordHistory(runState, 'won');
    } else if (s === 'true_win') {
      const prev = snapshotWins();
      recordTrueWin(runState.characterClass, runState.ascension);
      checkTrueWin(runState.characterClass, runState.ascension);
      maybeRecordDaily(runState, 'true_won');
      maybeShowUnlockToast(prev);
      recordHistory(runState, 'true_won');
    } else if (s === 'lose') {
      recordLoss(runState.characterClass);
      maybeRecordDaily(runState, 'lost');
      recordHistory(runState, 'lost');
    }
  }
  // Clear save on terminal screens.
  if (s === 'win' || s === 'true_win' || s === 'lose' || s === 'title') clearSave();
  // BGM track based on screen
  updateBgmForScreen(s);
  rerender();
}

function snapshotWins(): { wins: number; trueWins: number } {
  const s = loadStats();
  return { wins: s.totalWins + s.totalTrueWins, trueWins: s.totalTrueWins };
}

function maybeShowUnlockToast(prev: { wins: number; trueWins: number }): void {
  // Lazy import to avoid cycles
  void Promise.resolve().then(async () => {
    try {
      const { CARD_DEFS } = await import('./content/cards');
      const { RELIC_LIST } = await import('./content/relics');
      const { isCurseLike } = await import('./ui/deck-overlay');
      const allCards = Object.values(CARD_DEFS).filter((c) => !isCurseLike(c.id));
      const news = newUnlocksAfterWin(prev, allCards, RELIC_LIST);
      if (news.cardCount === 0 && news.relicCount === 0) return;
      const { showAchievementToast } = await import('./ui/achievement-toast');
      showAchievementToast({
        id: 'unlock_toast',
        emoji: '🔓',
        title: '새로운 컨텐츠 해제!',
        description: `${news.tierLabel ? news.tierLabel + ' — ' : ''}카드 ${news.cardCount}장 · 유물 ${news.relicCount}개`,
        category: 'progression',
      });
    } catch { /* ignore */ }
  });
}

function recordHistory(run: RunState, outcome: RunOutcome): void {
  let killerName: string | undefined;
  if (outcome === 'lost') {
    const ids = run.combatEnemyDefIds ?? [];
    const names = ids.map((id) => ENEMY_DEFS[id]?.name).filter(Boolean) as string[];
    if (names.length > 0) killerName = names.join(' · ');
  }
  recordRunHistory({
    timestamp: Date.now(),
    characterClass: run.characterClass,
    outcome,
    chapter: run.chapter,
    floor: run.floor,
    ascension: run.ascension,
    deckSize: run.player.deck.length,
    gold: run.player.gold,
    killerName,
    daily: !!run.dailyConfig,
  });
}

function maybeRecordDaily(run: RunState, outcome: DailyOutcome): void {
  if (!run.dailyConfig) return;
  setDailyResult({
    date: run.dailyConfig.date,
    characterClass: run.characterClass,
    constraintId: run.dailyConfig.constraintId,
    outcome,
    chapter: run.chapter,
    floor: run.floor,
    timestamp: Date.now(),
  });
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
  if (s === 'endless_wave_clear') return 'map';
  if (s === 'endless_result' || s === 'leaderboard') return 'title';
  if (s === 'title' || s === 'character_select' || s === 'help' || s === 'stats' || s === 'codex') {
    return 'title';
  }
  if (s === 'true_ending_choice') return 'boss';
  if (s === 'win' || s === 'true_win') return 'title';
  // 'lose' — no BGM (silent)
  return null;
}

export function startNewRun(
  seed: number,
  ascension = 0,
  characterClass: CharacterClass = 'swordmaster',
  options: { goToScreen?: Screen; daily?: { date: string; constraint: DailyConstraint } } = {},
): void {
  const mods = getModifiers(ascension);
  const baseHpMap: Record<CharacterClass, number> = { swordmaster: 75, gunner: 70, fighter: 80, magician: 65, priest: 82, thief: 68 };
  let baseHp = Math.max(1, baseHpMap[characterClass] - mods.startingHpPenalty);
  // 데일리 제약: HP 배율
  if (options.daily?.constraint.hpMult !== undefined) {
    baseHp = Math.max(1, Math.floor(baseHp * options.daily.constraint.hpMult));
  }
  const deck =
    characterClass === 'gunner' ? makeGunnerStarterDeck() :
    characterClass === 'fighter' ? makeFighterStarterDeck() :
    characterClass === 'magician' ? makeMagicianStarterDeck() :
    characterClass === 'priest' ? makePriestStarterDeck() :
    characterClass === 'thief' ? makeThiefStarterDeck() :
    makeStarterDeck();
  for (let i = 0; i < mods.cursesInDeck; i++) deck.push(makeCard('wound'));
  // 데일리 제약: 시작 저주
  if (options.daily?.constraint.startCurses) {
    for (let i = 0; i < options.daily.constraint.startCurses; i++) deck.push(makeCard('wound'));
  }
  const relicMap: Record<CharacterClass, string> = {
    swordmaster: 'burning_blood',
    gunner: 'bag_of_marbles',
    fighter: 'fighting_spirit',
    magician: 'mage_orb',
    priest: 'holy_chalice',
    thief: 'oddly_smooth_stone',
  };
  // 시그니처 유물 — 캐릭터 정체성을 강화하는 두 번째 시작 유물
  const signatureMap: Record<CharacterClass, string> = {
    swordmaster: 'gwihon_charm',
    gunner: 'gunner_magazine',
    fighter: 'one_mind_belt',
    magician: 'elemental_resonance',
    priest: 'holy_seal',
    thief: 'venom_fang',
  };
  const startingRelic = relicMap[characterClass];
  const signatureRelic = signatureMap[characterClass];

  // 데일리: 최대 에너지 조정
  const baseMaxEnergy = 3 + (options.daily?.constraint.bonusMaxEnergy ?? 0);

  const player: Player = {
    hp: baseHp,
    maxHp: baseHp,
    block: 0,
    energy: 0,
    maxEnergy: Math.max(1, baseMaxEnergy),
    gold: 0,
    statuses: {},
    deck,
    draw: [],
    hand: [],
    discard: [],
    exhaust: [],
    relics: [startingRelic, signatureRelic],
    potions: [],
    keys: [],
  };
  // 도감 달성 보상
  const codex = getCodexCounts();
  const discovered = codex.cards + codex.relics;
  if (discovered >= 31) player.gold += 30;
  if (discovered >= 62) { player.maxHp += 5; player.hp += 5; }
  if (discovered >= 93) player.maxEnergy += 1;

  // 업적 달성 보상
  const achCount = getUnlockedCount();
  if (achCount >= 3) player.gold += 20;
  if (achCount >= 8) { player.maxHp += 3; player.hp += 3; }
  if (achCount >= 15) player.gold += 30;

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
    ...(options.daily && {
      dailyConfig: {
        date: options.daily.date,
        constraintId: options.daily.constraint.id,
        bonusMaxEnergy: options.daily.constraint.bonusMaxEnergy,
        handDrawDelta: options.daily.constraint.handDrawDelta,
        disableUpgrade: options.daily.constraint.disableUpgrade,
        disableRemove: options.daily.constraint.disableRemove,
        enemyHpMult: options.daily.constraint.enemyHpMult,
      },
    }),
  };
  combatState = null;
  recordRunStart(characterClass);
  // Codex: starter deck + starting relics
  recordCards(deck.map((c) => c.defId));
  recordRelic(startingRelic);
  recordRelic(signatureRelic);
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

function makeThiefStarterDeck(): CardInstance[] {
  const deck: CardInstance[] = [];
  for (let i = 0; i < 5; i++) deck.push(makeCard('t_slicer'));
  for (let i = 0; i < 4; i++) deck.push(makeCard('t_bone_shield'));
  deck.push(makeCard('t_dark_soul'));
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

export function startEndless(): void {
  if (!runState) return;
  runState.endless = { wave: 0, score: 0 };
  combatState = null;
  setScreen('endless_wave_clear');
}

export function endRun(): void {
  runState = null;
  combatState = null;
  setScreen('title');
}
