// ─────────────────────────────────────────────────────────────────
// 언락 시스템
//
// 카드/유물 희귀도에 따라 잠금 단계가 다르고, 플레이어 통계
// (totalWins, totalTrueWins)에 따라 자동 해제됨.
// 별도 저장 없이 stats.ts의 데이터로 도출.
// ─────────────────────────────────────────────────────────────────

import type { CardRarity, CardDef, RelicDef } from './types';
import { loadStats } from './stats';

export type UnlockReq = 'always' | 'any_win' | 'wins_3' | 'true_win';

// 희귀도 기본 잠금 단계
function defaultReqForCardRarity(r: CardRarity): UnlockReq {
  if (r === 'starter' || r === 'common') return 'always';
  if (r === 'uncommon') return 'any_win';
  return 'wins_3'; // rare
}

function defaultReqForRelicRarity(r: RelicDef['rarity']): UnlockReq {
  if (r === 'starter' || r === 'common') return 'always';
  if (r === 'uncommon') return 'any_win';
  if (r === 'rare') return 'wins_3';
  return 'true_win'; // boss
}

// 특정 아이템 override — 희귀도 기본에서 벗어나야 할 때만 추가
const CARD_OVERRIDES: Record<string, UnlockReq> = {
  // 예: 특정 시그니처 카드를 처음부터 풀기
};
const RELIC_OVERRIDES: Record<string, UnlockReq> = {
  // 시작 유물(starter rarity)은 이미 always지만 명시
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
  switch (req) {
    case 'always': return '';
    case 'any_win': return '🔒 첫 승리 시 해제';
    case 'wins_3': return '🔒 3회 승리 시 해제';
    case 'true_win': return '🔒 진엔딩 클리어 시 해제';
  }
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
    if (req === 'any_win') return prev.wins < 1;
    if (req === 'wins_3') return prev.wins < 3;
    if (req === 'true_win') return prev.trueWins < 1;
    return false;
  }
  function nowMet(req: UnlockReq): boolean {
    if (req === 'always') return true;
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
