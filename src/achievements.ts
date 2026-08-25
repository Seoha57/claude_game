import type { CharacterClass } from './types';
import { markDirty } from './sync/sync';
import { loadStats } from './stats';

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
  { id: 'all_classes_win',  title: '만능 모험가',  description: '6 캐릭터 모두로 일반 엔딩 달성.',     emoji: '🎭', category: 'progression' },
  { id: 'all_classes_true', title: '경지에 오르다', description: '6 캐릭터 모두로 진엔딩 달성.',         emoji: '👑', category: 'progression' },

  // ── Character ──
  { id: 'sword_clear',  title: '검사 클리어',    description: '검사로 일반 엔딩 달성.',    emoji: '⚔️', category: 'character' },
  { id: 'gun_clear',    title: '사수 클리어',    description: '사수로 일반 엔딩 달성.',    emoji: '🔫', category: 'character' },
  { id: 'fight_clear',  title: '격투가 클리어',  description: '격투가로 일반 엔딩 달성.',  emoji: '🥊', category: 'character' },
  { id: 'mage_clear',   title: '마법사 클리어',  description: '마법사로 일반 엔딩 달성.',  emoji: '🔮', category: 'character' },
  { id: 'priest_clear', title: '성직자 클리어',  description: '성직자로 일반 엔딩 달성.',  emoji: '⛪', category: 'character' },
  { id: 'thief_clear',  title: '도적 클리어',    description: '도적으로 일반 엔딩 달성.',  emoji: '🗡️', category: 'character' },

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
  { id: 'venomous',   title: '맹독술사',  description: '한 적에게 중독 20 이상 누적.', emoji: '☠️', category: 'combat' },
  { id: 'big_hit',    title: '필살의 일격', description: '단일 카드로 60 이상 데미지.', emoji: '🌟', category: 'combat' },

  // ── Collection ──
  { id: 'cards_30',  title: '카드 수집가', description: '30종 카드 발견.',  emoji: '📖', category: 'collection' },
  { id: 'cards_60',  title: '카드 박사',   description: '60종 카드 발견.',  emoji: '📚', category: 'collection' },
  { id: 'cards_120', title: '카드 마스터', description: '120종 카드 발견.', emoji: '🃏', category: 'collection' },
  { id: 'relics_5',  title: '유물 탐험가', description: '5종 유물 발견.',   emoji: '💎', category: 'collection' },
  { id: 'relics_15', title: '유물 수집가', description: '15종 유물 발견.',  emoji: '👑', category: 'collection' },
  { id: 'relics_30', title: '유물의 군주', description: '30종 유물 발견.',  emoji: '🏛️', category: 'collection' },
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
  markDirty();
}

export function isUnlocked(id: string): boolean {
  return load().unlocked.includes(id);
}

export function getUnlockedSet(): Set<string> {
  return new Set(load().unlocked);
}

// 캐릭터별 클리어/진엔딩 현황 (도전과제 화면 표시용). stats도 교차 참조.
export function getCharClearStatus(): {
  clear: Record<CharacterClass, boolean>;
  trueClear: Record<CharacterClass, boolean>;
} {
  const d = load();
  const stats = loadStats();
  const clear = {} as Record<CharacterClass, boolean>;
  const trueClear = {} as Record<CharacterClass, boolean>;
  for (const c of ALL_CLASSES) {
    const cs = stats.perCharacter[c];
    clear[c] = !!d.perCharClear[c] || (cs?.wins ?? 0) > 0 || (cs?.trueWins ?? 0) > 0;
    trueClear[c] = !!d.perCharTrue[c] || (cs?.trueWins ?? 0) > 0;
  }
  return { clear, trueClear };
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
  if (ALL_CLASSES.every((c) => d.perCharClear[c])) unlockId('all_classes_win');
}

export function checkTrueWin(cls: CharacterClass, ascension: number): void {
  unlockId('true_win');
  // True win also counts as regular clear
  checkWin(cls, ascension);
  const d = load();
  d.perCharTrue[cls] = true;
  persist(d);
  if (ALL_CLASSES.every((c) => d.perCharTrue[c])) unlockId('all_classes_true');
}

const ALL_CLASSES: CharacterClass[] = ['swordmaster', 'gunner', 'fighter', 'magician', 'priest', 'thief'];

// 이미 기록된 perCharClear/perCharTrue를 보고 도전과제를 소급 평가한다.
// 과거 버그(charClearId가 마법사/성직자/도적을 모두 mage_clear로 반환,
// all_classes가 4캐릭만 체크)로 누락된 도전과제를 게임 시작 시 보정.
export function reconcileAchievements(): void {
  const d = load();
  const stats = loadStats();
  let changed = false;

  // stats의 per-캐릭터 승수를 perCharClear/perCharTrue로 역보정 (더 견고)
  for (const c of ALL_CLASSES) {
    const cs = stats.perCharacter[c];
    if (cs?.wins > 0 && !d.perCharClear[c]) { d.perCharClear[c] = true; changed = true; }
    if (cs?.trueWins > 0 && !d.perCharTrue[c]) { d.perCharTrue[c] = true; changed = true; }
  }

  // 캐릭터별 클리어 도전과제 소급
  for (const c of ALL_CLASSES) {
    if (d.perCharClear[c] && !d.unlocked.includes(charClearId(c))) {
      d.unlocked.push(charClearId(c));
      changed = true;
    }
  }
  // all_classes 소급 (토스트 없이 조용히)
  if (ALL_CLASSES.every((c) => d.perCharClear[c]) && !d.unlocked.includes('all_classes_win')) {
    d.unlocked.push('all_classes_win');
    changed = true;
  }
  if (ALL_CLASSES.every((c) => d.perCharTrue[c]) && !d.unlocked.includes('all_classes_true')) {
    d.unlocked.push('all_classes_true');
    changed = true;
  }
  // 최소 1캐릭 클리어 기록이 있으면 first_win/true_win도 보정
  if (ALL_CLASSES.some((c) => d.perCharClear[c]) && !d.unlocked.includes('first_win')) {
    d.unlocked.push('first_win'); changed = true;
  }
  if (ALL_CLASSES.some((c) => d.perCharTrue[c]) && !d.unlocked.includes('true_win')) {
    d.unlocked.push('true_win'); changed = true;
  }

  // 난이도 도전과제 소급 (stats의 캐릭별 최고 등반 기준)
  const bestAsc = Math.max(-1, ...ALL_CLASSES.map((c) => stats.perCharacter[c]?.bestAscension ?? -1));
  if (bestAsc >= 5 && !d.unlocked.includes('asc5')) { d.unlocked.push('asc5'); changed = true; }
  if (bestAsc >= 10 && !d.unlocked.includes('asc10')) { d.unlocked.push('asc10'); changed = true; }

  // 컬렉션 도전과제 소급 (코덱 발견 수 기준)
  // codex.ts가 achievements를 import하므로 순환 회피 위해 localStorage 직접 읽음.
  const codex = readCodexCounts();
  if (codex.cards >= 30 && !d.unlocked.includes('cards_30')) { d.unlocked.push('cards_30'); changed = true; }
  if (codex.cards >= 60 && !d.unlocked.includes('cards_60')) { d.unlocked.push('cards_60'); changed = true; }
  if (codex.cards >= 120 && !d.unlocked.includes('cards_120')) { d.unlocked.push('cards_120'); changed = true; }
  if (codex.relics >= 5 && !d.unlocked.includes('relics_5')) { d.unlocked.push('relics_5'); changed = true; }
  if (codex.relics >= 15 && !d.unlocked.includes('relics_15')) { d.unlocked.push('relics_15'); changed = true; }
  if (codex.relics >= 30 && !d.unlocked.includes('relics_30')) { d.unlocked.push('relics_30'); changed = true; }

  if (changed) persist(d);
}

function readCodexCounts(): { cards: number; relics: number } {
  try {
    const raw = localStorage.getItem('dungeoncard_codex');
    if (!raw) return { cards: 0, relics: 0 };
    const data = JSON.parse(raw);
    return {
      cards: Array.isArray(data.cards) ? data.cards.length : 0,
      relics: Array.isArray(data.relics) ? data.relics.length : 0,
    };
  } catch {
    return { cards: 0, relics: 0 };
  }
}

function charClearId(cls: CharacterClass): string {
  switch (cls) {
    case 'swordmaster': return 'sword_clear';
    case 'gunner': return 'gun_clear';
    case 'fighter': return 'fight_clear';
    case 'magician': return 'mage_clear';
    case 'priest': return 'priest_clear';
    case 'thief': return 'thief_clear';
  }
}

export function checkDamage(amount: number): void {
  if (amount >= 30) unlockId('one_shot');
  if (amount >= 60) unlockId('big_hit');
}
export function checkPoison(amount: number): void {
  if (amount >= 20) unlockId('venomous');
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
  if (count >= 120) unlockId('cards_120');
}
export function checkCodexRelics(count: number): void {
  if (count >= 5) unlockId('relics_5');
  if (count >= 15) unlockId('relics_15');
  if (count >= 30) unlockId('relics_30');
}

export function resetAchievements(): void {
  try { localStorage.removeItem(STORAGE_KEY); } catch { /* ignore */ }
}
