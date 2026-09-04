// ─────────────────────────────────────────────────────────────────
// 언락 시스템
//
// 카드/유물 희귀도에 따라 잠금 단계가 다르고, 플레이어 통계
// (totalWins, totalTrueWins)에 따라 자동 해제됨.
// 별도 저장 없이 stats.ts의 데이터로 도출.
// ─────────────────────────────────────────────────────────────────

import type { CardRarity, CardDef, RelicDef } from './types';
import { loadStats } from './stats';
import { isUnlocked as isAchUnlocked, ACHIEVEMENTS } from './achievements';

export type UnlockReq = 'always' | 'any_win' | 'wins_3' | 'true_win' | `ach:${string}`;

// 희귀도 기본 잠금 단계 — 진엔딩이 어려워서 락이 영원히 안 풀리는 일을 피하려고 완화.
// 보스 유물은 챕터 클리어로 자동 획득되니까 항상 노출.
function defaultReqForCardRarity(r: CardRarity): UnlockReq {
  if (r === 'starter' || r === 'common') return 'always';
  if (r === 'uncommon') return 'always';
  return 'any_win'; // rare — 첫 챕터 3 클리어로 해제
}

function defaultReqForRelicRarity(r: RelicDef['rarity']): UnlockReq {
  if (r === 'starter' || r === 'common') return 'always';
  if (r === 'uncommon') return 'always';
  if (r === 'rare') return 'any_win';
  // boss relic은 챕터 클리어로 자동 획득되니까 코덱스 락은 무의미.
  return 'always';
}

// 특정 아이템 override — 희귀도 기본에서 벗어나야 할 때만 추가
const CARD_OVERRIDES: Record<string, UnlockReq> = {
  // 예: 특정 시그니처 카드를 처음부터 풀기
};
const RELIC_OVERRIDES: Record<string, UnlockReq> = {
  master_scabbard: 'ach:sword_clear',
  incendiary_round: 'ach:pyromaniac',
  iron_gauntlet: 'ach:iron_wall',
  arcane_focus: 'ach:mage_clear',
  blessed_water: 'ach:priest_clear',
  lethal_poison: 'ach:venomous',
  soul_crystal: 'ach:soul_eater',
  champion_belt: 'ach:all_classes_win',
  storm_core: 'ach:asc5',
};

export function cardUnlockReq(def: CardDef): UnlockReq {
  return CARD_OVERRIDES[def.id] ?? defaultReqForCardRarity(def.rarity);
}

export function relicUnlockReq(def: RelicDef): UnlockReq {
  return RELIC_OVERRIDES[def.id] ?? defaultReqForRelicRarity(def.rarity);
}

// 현재 플레이어 진행 상태에서 해당 잠금 단계가 풀려있는가
export function isReqMet(req: UnlockReq): boolean {
  if (req === 'always') return true;
  if (req.startsWith('ach:')) return isAchUnlocked(req.slice(4));
  const s = loadStats();
  const wins = s.totalWins + s.totalTrueWins;
  const trueWins = s.totalTrueWins;
  if (req === 'any_win') return wins >= 1;
  if (req === 'wins_3') return wins >= 3;
  if (req === 'true_win') return trueWins >= 1;
  return false;
}

export function isCardUnlocked(def: CardDef): boolean {
  return isReqMet(cardUnlockReq(def));
}

export function isRelicUnlocked(def: RelicDef): boolean {
  return isReqMet(relicUnlockReq(def));
}

// UI 라벨용 한국어 요구사항 텍스트
export function reqLabel(req: UnlockReq): string {
  if (req === 'always') return '';
  if (req === 'any_win') return '🔒 첫 승리 시 해제';
  if (req === 'wins_3') return '🔒 3회 승리 시 해제';
  if (req === 'true_win') return '🔒 진엔딩 클리어 시 해제';
  if (req.startsWith('ach:')) {
    const ach = ACHIEVEMENTS.find((a) => a.id === req.slice(4));
    return ach ? `🔒 '${ach.title}' 업적 달성 시 해제` : '🔒 업적 달성 시 해제';
  }
  return '';
}

// 진행도 (몇/몇 해제) — 코덱스/타이틀에 노출용
export function unlockProgress(
  allCards: CardDef[],
  allRelics: RelicDef[],
): { cards: { unlocked: number; total: number }; relics: { unlocked: number; total: number } } {
  const cards = { unlocked: 0, total: 0 };
  for (const c of allCards) {
    cards.total++;
    if (isCardUnlocked(c)) cards.unlocked++;
  }
  const relics = { unlocked: 0, total: 0 };
  for (const r of allRelics) {
    relics.total++;
    if (isRelicUnlocked(r)) relics.unlocked++;
  }
  return { cards, relics };
}

// 직전 승리로 새로 해제된 항목 수 계산 — 토스트용
// 이전 wins/trueWins 값을 받아서 그때 잠겨있던 것 중 지금 풀린 것 수
export function newUnlocksAfterWin(
  prev: { wins: number; trueWins: number },
  allCards: CardDef[],
  allRelics: RelicDef[],
): { cardCount: number; relicCount: number; tierLabel: string | null } {
  const cur = loadStats();
  const curWins = cur.totalWins + cur.totalTrueWins;
  const curTrue = cur.totalTrueWins;

  function wasLocked(req: UnlockReq): boolean {
    if (req === 'always') return false;
    if (req.startsWith('ach:')) return false;
    if (req === 'any_win') return prev.wins < 1;
    if (req === 'wins_3') return prev.wins < 3;
    if (req === 'true_win') return prev.trueWins < 1;
    return false;
  }
  function nowMet(req: UnlockReq): boolean {
    if (req === 'always') return true;
    if (req.startsWith('ach:')) return isAchUnlocked(req.slice(4));
    if (req === 'any_win') return curWins >= 1;
    if (req === 'wins_3') return curWins >= 3;
    if (req === 'true_win') return curTrue >= 1;
    return false;
  }

  let cardCount = 0;
  let relicCount = 0;
  let tier: UnlockReq | null = null;
  for (const c of allCards) {
    const r = cardUnlockReq(c);
    if (wasLocked(r) && nowMet(r)) { cardCount++; tier = r; }
  }
  for (const r of allRelics) {
    const req = relicUnlockReq(r);
    if (wasLocked(req) && nowMet(req)) { relicCount++; tier = req; }
  }
  return { cardCount, relicCount, tierLabel: tier ? reqLabel(tier).replace('🔒 ', '🔓 ').replace(' 해제', ' 달성') : null };
}
