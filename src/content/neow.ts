import type { Player } from '../types';
import { PICKABLE_RELICS, BOSS_RELICS } from './relics';
import { POTION_LIST } from './potions';
import { canUpgrade } from './cards';

export type NeowTone = 'positive' | 'risky';

export interface NeowBlessing {
  id: string;
  title: string;
  emoji: string;
  description: string;
  tone: NeowTone;
  // Apply to player (which is mutated in-place). rng for randomized picks.
  apply: (player: Player, rng: () => number) => void;
}

function pickFrom<T>(rng: () => number, arr: T[]): T | undefined {
  if (arr.length === 0) return undefined;
  return arr[Math.floor(rng() * arr.length)];
}

export const NEOW_BLESSINGS: NeowBlessing[] = [
  {
    id: 'health_blessing',
    title: '체력의 축복',
    emoji: '❤',
    description: '최대 HP +10. 즉시 10 회복.',
    tone: 'positive',
    apply: (p) => {
      p.maxHp += 10;
      p.hp = Math.min(p.maxHp, p.hp + 10);
    },
  },
  {
    id: 'wealth_blessing',
    title: '부의 축복',
    emoji: '💰',
    description: '시작 골드 +100.',
    tone: 'positive',
    apply: (p) => {
      p.gold += 100;
    },
  },
  {
    id: 'relic_blessing',
    title: '유물의 축복',
    emoji: '💎',
    description: '무작위 일반 유물 1개 획득.',
    tone: 'positive',
    apply: (p, rng) => {
      const owned = new Set(p.relics);
      const candidates = PICKABLE_RELICS.filter((r) => !owned.has(r.id));
      const r = pickFrom(rng, candidates);
      if (r) p.relics.push(r.id);
    },
  },
  {
    id: 'upgrade_blessing',
    title: '연마의 축복',
    emoji: '✦',
    description: '시작 덱의 카드 1장이 무작위로 강화됨.',
    tone: 'positive',
    apply: (p, rng) => {
      const upgradable = p.deck.filter((c) => canUpgrade(c));
      const c = pickFrom(rng, upgradable);
      if (c) c.upgraded = true;
    },
  },
  {
    id: 'potion_blessing',
    title: '약병의 축복',
    emoji: '🧪',
    description: '무작위 물약 2개를 들고 시작.',
    tone: 'positive',
    apply: (p, rng) => {
      for (let i = 0; i < 2; i++) {
        if (p.potions.length >= 3) break;
        const pot = pickFrom(rng, POTION_LIST);
        if (pot) p.potions.push(pot.id);
      }
    },
  },
  {
    id: 'energy_blessing',
    title: '에너지의 축복',
    emoji: '⚡',
    description: '최대 에너지 +1. (대가: HP -8)',
    tone: 'risky',
    apply: (p) => {
      p.maxEnergy += 1;
      p.hp = Math.max(1, p.hp - 8);
    },
  },
  {
    id: 'dark_pact',
    title: '사악한 거래',
    emoji: '💀',
    description: '강력한 보스 유물 1개. (대가: 최대 HP -10)',
    tone: 'risky',
    apply: (p, rng) => {
      const owned = new Set(p.relics);
      const candidates = BOSS_RELICS.filter((r) => !owned.has(r.id));
      const r = pickFrom(rng, candidates);
      if (r) p.relics.push(r.id);
      p.maxHp = Math.max(1, p.maxHp - 10);
      p.hp = Math.min(p.hp, p.maxHp);
    },
  },
];

// Pick N random blessings for this run.
export function rollBlessings(rng: () => number, n: number = 4): NeowBlessing[] {
  const pool = [...NEOW_BLESSINGS];
  const out: NeowBlessing[] = [];
  for (let i = 0; i < n && pool.length > 0; i++) {
    const idx = Math.floor(rng() * pool.length);
    out.push(pool.splice(idx, 1)[0]);
  }
  return out;
}
