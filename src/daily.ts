// ─────────────────────────────────────────────────────────────────
// 데일리 챌린지
//
// UTC 날짜를 기반으로 deterministic하게:
//  - 시드 (모든 플레이어가 같은 맵/적/보상)
//  - 캐릭터 (5캐릭 로테이션)
//  - 제약 조건 (8종 로테이션)
// 을 결정한다. 결과는 로컬 + sync.
// ─────────────────────────────────────────────────────────────────

import type { CharacterClass } from './types';
import { markDirty } from './sync/sync';

const STORAGE_KEY = 'dungeoncard_daily';
const STORAGE_VERSION = 1;

export interface DailyConstraint {
  id: string;
  name: string;
  desc: string;
  // 모든 필드 optional — 적용할 것만 채움
  hpMult?: number;            // 시작 HP 배율 (예: 0.7 = -30%)
  enemyHpMult?: number;       // 적 HP 배율
  bonusMaxEnergy?: number;    // 최대 에너지 ±N (기본 3)
  handDrawDelta?: number;     // 매 턴 손패 ±N (기본 5)
  startCurses?: number;       // 시작 덱에 상처 N장
  disableUpgrade?: boolean;   // 모닥불 강화 불가
  disableRemove?: boolean;    // 모닥불 정화 불가
}

const CONSTRAINTS: DailyConstraint[] = [
  { id: 'harsh_march',   name: '강행군',       desc: '시작 HP -30%',                    hpMult: 0.7 },
  { id: 'energy_drain',  name: '에너지 빈혈',  desc: '매 턴 시작 에너지 -1',            bonusMaxEnergy: -1 },
  { id: 'exhaustion',    name: '탈진',         desc: '매 턴 손패 -1',                   handDrawDelta: -1 },
  { id: 'cursed_fate',   name: '사슬 운명',    desc: '시작 덱에 상처 2장',              startCurses: 2 },
  { id: 'no_upgrade',    name: '강화 봉인',    desc: '모닥불 강화 불가',                disableUpgrade: true },
  { id: 'no_remove',     name: '정화 봉인',    desc: '카드 제거 불가',                  disableRemove: true },
  { id: 'tradeoff',      name: '둔중함',       desc: '손패 -1, 최대 에너지 +1',         handDrawDelta: -1, bonusMaxEnergy: 1 },
  { id: 'titan_clash',   name: '거인의 전쟁',  desc: 'HP +30%, 적 HP +40%',              hpMult: 1.3, enemyHpMult: 1.4 },
];

const CHARACTERS: CharacterClass[] = ['swordmaster', 'gunner', 'fighter', 'magician', 'priest'];

// ── 일자 계산 (UTC 고정) ────────────────────────────────────────
export function todayDateString(): string {
  const d = new Date();
  return `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, '0')}-${String(d.getUTCDate()).padStart(2, '0')}`;
}

// 2024-01-01 기준 일수 (음수 안 됨)
function dayIndex(dateStr?: string): number {
  const target = dateStr ?? todayDateString();
  const [y, m, d] = target.split('-').map(Number);
  const epoch = Date.UTC(2024, 0, 1);
  const ts = Date.UTC(y, m - 1, d);
  return Math.max(0, Math.floor((ts - epoch) / 86_400_000));
}

// ── 오늘의 챌린지 설정 ──────────────────────────────────────────
export interface DailySetup {
  date: string;
  character: CharacterClass;
  constraint: DailyConstraint;
  seed: number;
}

export function getDailySetup(dateStr?: string): DailySetup {
  const date = dateStr ?? todayDateString();
  const idx = dayIndex(date);
  return {
    date,
    character: CHARACTERS[idx % CHARACTERS.length],
    // 캐릭터와 제약이 다른 주기로 돌도록 살짝 어긋나게
    constraint: CONSTRAINTS[(idx * 3 + 1) % CONSTRAINTS.length],
    // 시드 — 모든 플레이어 같은 값. 짧은 해시.
    seed: hashSeed(idx),
  };
}

function hashSeed(idx: number): number {
  // 단순 deterministic 해시
  let x = (idx + 1) * 2654435761;
  x ^= x >>> 13;
  x = Math.imul(x, 1597334677);
  x ^= x >>> 16;
  return (x >>> 0) % 1_000_000_007;
}

// ── 결과 저장 ───────────────────────────────────────────────────
export type DailyOutcome = 'won' | 'true_won' | 'lost' | 'in_progress' | 'abandoned';

export interface DailyResult {
  date: string;
  characterClass: CharacterClass;
  constraintId: string;
  outcome: DailyOutcome;
  chapter: number;
  floor: number;
  timestamp: number;
}

interface DailyStore {
  version: number;
  results: Record<string, DailyResult>;
}

function load(): DailyStore {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { version: STORAGE_VERSION, results: {} };
    const data = JSON.parse(raw) as DailyStore;
    if (data.version !== STORAGE_VERSION) return { version: STORAGE_VERSION, results: {} };
    return data;
  } catch {
    return { version: STORAGE_VERSION, results: {} };
  }
}

function persist(s: DailyStore): void {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(s)); } catch { /* ignore */ }
  markDirty();
}

export function getDailyResult(dateStr?: string): DailyResult | null {
  const date = dateStr ?? todayDateString();
  return load().results[date] ?? null;
}

export function setDailyResult(r: DailyResult): void {
  const s = load();
  s.results[r.date] = r;
  persist(s);
}

export function clearDailyResult(dateStr?: string): void {
  const date = dateStr ?? todayDateString();
  const s = load();
  delete s.results[date];
  persist(s);
}

export function getAllDailyResults(): DailyResult[] {
  return Object.values(load().results).sort((a, b) => b.timestamp - a.timestamp);
}
