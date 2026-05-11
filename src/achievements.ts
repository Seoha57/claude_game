import type { CharacterClass } from './types';

const STORAGE_KEY = 'dungeoncard_achievements';
const STORAGE_VERSION = 1;

export interface AchievementDef {
  id: string;
  title: string;
  description: string;
  emoji: string;
  category: 'progression' | 'character' | 'difficulty' | 'collection' | 'combat';
}

export const ACHIEVEMENTS: AchievementDef[] = [
  // ── Progression ──
  { id: 'first_win',    title: '첫 영웅',   description: '일반 엔딩(챕터 3 클리어)을 한 번 달성.',     emoji: '🏆', category: 'progression' },
  { id: 'true_win',     title: '진정한 영웅', description: '진엔딩(차원의 지배자 처치)을 달성.',        emoji: '✨', category: 'progression' },
  { id: 'all_classes_win',  title: '만능 모험가',  description: '4 캐릭터 모두로 일반 엔딩 달성.',     emoji: '🎭', category: 'progression' },
  { id: 'all_classes_true', title: '경지에 오르다', description: '4 캐릭터 모두로 진엔딩 달성.',         emoji: '👑', category: 'progression' },

  // ── Character ──
  { id: 'sword_clear', title: '귀검사 클리어', description: '귀검사로 일반 엔딩 달성.',  emoji: '⚔️', category: 'character' },
  { id: 'gun_clear',   title: '거너 클리어',   description: '거너로 일반 엔딩 달성.',    emoji: '🔫', category: 'character' },
  { id: 'fight_clear', title: '격투가 클리어', description: '격투가로 일반 엔딩 달성.',  emoji: '🥊', category: 'character' },
  { id: 'mage_clear',  title: '마법사 클리어', description: '마법사로 일반 엔딩 달성.',  emoji: '🔮', category: 'character' },

  // ── Difficulty ──
  { id: 'asc5',  title: '등반자',  description: '등반 A5 이상에서 일반 엔딩 달성.',  emoji: '⛰', category: 'difficulty' },
  { id: 'asc10', title: '정상 정복', description: '등반 A10에서 일반 엔딩 달성.',     emoji: '🏔', category: 'difficulty' },

  // ── Combat ──
  { id: 'one_shot',   title: '일격필살',  description: '단일 카드로 30 이상 데미지.', emoji: '💥', category: 'combat' },
  { id: 'iron_wall',  title: '철벽',      description: '한 전투에서 방어도 50 이상 누적.', emoji: '🛡', category: 'combat' },
  { id: 'quick_kill', title: '신속 처리', description: '3턴 이내로 전투 승리.',       emoji: '💨', category: 'combat' },
  { id: 'mighty',     title: '강해지다',  description: '힘 +8 이상 보유.',            emoji: '💪', category: 'combat' },
  { id: 'pyromaniac', title: '불의 마스터', description: '화상으로 적을 처치.',         emoji: '🔥', category: 'combat' },
  { id: 'cryomancer', title: '얼음의 지배자', description: '빙결로 적 행동을 4턴 연속 봉인.', emoji: '❄', category: 'combat' },

  // ── Collection ──
  { id: 'cards_30', title: '카드 수집가', description: '30종 카드 발견.', emoji: '📖', category: 'collection' },
  { id: 'cards_60', title: '카드 박사',   description: '60종 카드 발견.', emoji: '📚', category: 'collection' },
  { id: 'relics_5', title: '유물 탐험가', description: '5종 유물 발견.',  emoji: '💎', category: 'collection' },
  { id: 'relics_15', title: '유물 수집가', description: '15종 유물 발견.', emoji: '👑', category: 'collection' },
];

interface AchData {
  version: number;
  unlocked: string[];
  perCharClear: Partial<Record<CharacterClass, boolean>>;
  perCharTrue:  Partial<Record<CharacterClass, boolean>>;
}

function emptyData(): AchData {
  return { version: STORAGE_VERSION, unlocked: [], perCharClear: {}, perCharTrue: {} };
}

function load(): AchData {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return emptyData();
    const data = JSON.parse(raw) as AchData;
    if (data.version !== STORAGE_VERSION) return emptyData();
    return {
      version: STORAGE_VERSION,
      unlocked: Array.isArray(data.unlocked) ? data.unlocked : [],
      perCharClear: data.perCharClear ?? {},
      perCharTrue: data.perCharTrue ?? {},
    };
  } catch {
    return emptyData();
  }
}

function persist(data: AchData): void {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(data)); } catch { /* ignore */ }
}

export function isUnlocked(id: string): boolean {
  return load().unlocked.includes(id);
}

export function getUnlockedSet(): Set<string> {
  return new Set(load().unlocked);
}

let notifyHandler: ((def: AchievementDef) => void) | null = null;
export function setAchievementNotifier(fn: (def: AchievementDef) => void): void {
  notifyHandler = fn;
}

function unlockId(id: string): boolean {
  const d = load();
  if (d.unlocked.includes(id)) return false;
  d.unlocked.push(id);
  persist(d);
  const def = ACHIEVEMENTS.find((a) => a.id === id);
  if (def && notifyHandler) notifyHandler(def);
  return true;
}

// ── Public trigger functions ──

export function checkWin(cls: CharacterClass, ascension: number): void {
  unlockId('first_win');
  unlockId(charClearId(cls));
  if (ascension >= 5) unlockId('asc5');
  if (ascension >= 10) unlockId('asc10');
  const d = load();
  d.perCharClear[cls] = true;
  persist(d);
  const all = (['swordmaster', 'gunner', 'fighter', 'magician'] as CharacterClass[]).every((c) => d.perCharClear[c]);
  if (all) unlockId('all_classes_win');
}

export function checkTrueWin(cls: CharacterClass, ascension: number): void {
  unlockId('true_win');
  // True win also counts as regular clear
  checkWin(cls, ascension);
  const d = load();
  d.perCharTrue[cls] = true;
  persist(d);
  const all = (['swordmaster', 'gunner', 'fighter', 'magician'] as CharacterClass[]).every((c) => d.perCharTrue[c]);
  if (all) unlockId('all_classes_true');
}

function charClearId(cls: CharacterClass): string {
  return cls === 'swordmaster' ? 'sword_clear'
    : cls === 'gunner' ? 'gun_clear'
    : cls === 'fighter' ? 'fight_clear'
    : 'mage_clear';
}

export function checkDamage(amount: number): void {
  if (amount >= 30) unlockId('one_shot');
}
export function checkBlock(amount: number): void {
  if (amount >= 50) unlockId('iron_wall');
}
export function checkTurnCount(turn: number): void {
  if (turn <= 3) unlockId('quick_kill');
}
export function checkStrength(amount: number): void {
  if (amount >= 8) unlockId('mighty');
}
export function checkBurnKill(): void {
  unlockId('pyromaniac');
}
export function checkFreezeChain(consecutive: number): void {
  if (consecutive >= 4) unlockId('cryomancer');
}

export function checkCodexCards(count: number): void {
  if (count >= 30) unlockId('cards_30');
  if (count >= 60) unlockId('cards_60');
}
export function checkCodexRelics(count: number): void {
  if (count >= 5) unlockId('relics_5');
  if (count >= 15) unlockId('relics_15');
}

export function resetAchievements(): void {
  try { localStorage.removeItem(STORAGE_KEY); } catch { /* ignore */ }
}
