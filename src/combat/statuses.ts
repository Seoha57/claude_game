import type { Combatant, StatusKey, Statuses } from '../types';

export interface StatusInfo {
  key: StatusKey;
  name: string;
  description: string;
  // true = decrements by 1 each owner end-of-turn
  decay: boolean;
  // true = positive buff (UI hint)
  buff: boolean;
}

export const STATUS_INFO: Record<StatusKey, StatusInfo> = {
  strength: { key: 'strength', name: '힘', description: '공격 데미지 +N', decay: false, buff: true },
  dexterity: {
    key: 'dexterity',
    name: '민첩',
    description: '획득 방어도 +N',
    decay: false,
    buff: true,
  },
  vulnerable: {
    key: 'vulnerable',
    name: '취약',
    description: '받는 공격 데미지 50% 증가',
    decay: true,
    buff: false,
  },
  weak: {
    key: 'weak',
    name: '약화',
    description: '주는 공격 데미지 25% 감소',
    decay: true,
    buff: false,
  },
  poison: {
    key: 'poison',
    name: '중독',
    description: '턴 시작마다 N 데미지, 이후 1 감소',
    decay: false,
    buff: false,
  },
  thorns: {
    key: 'thorns',
    name: '가시',
    description: '공격받으면 N 반사',
    decay: false,
    buff: true,
  },
  regen: {
    key: 'regen',
    name: '재생',
    description: '턴 종료 시 N 회복, 이후 1 감소',
    decay: false,
    buff: true,
  },
  frail: {
    key: 'frail',
    name: '쇠약',
    description: '획득 방어도 25% 감소',
    decay: true,
    buff: false,
  },
  ritual: {
    key: 'ritual',
    name: '의식',
    description: '턴 종료 시 힘 +N',
    decay: false,
    buff: true,
  },
  metallicize: {
    key: 'metallicize',
    name: '금속화',
    description: '턴 종료 시 방어도 +N',
    decay: false,
    buff: true,
  },
};

export function applyStatus(c: Combatant, key: StatusKey, amount: number): void {
  const cur = c.statuses[key] ?? 0;
  const next = cur + amount;
  if (next <= 0) {
    delete c.statuses[key];
  } else {
    c.statuses[key] = next;
  }
}

export function getStatus(s: Statuses, key: StatusKey): number {
  return s[key] ?? 0;
}

// Damage modification by statuses on attacker/defender
export function modifiedAttackDamage(
  base: number,
  attacker: Combatant,
  defender: Combatant,
): number {
  let dmg = base + getStatus(attacker.statuses, 'strength');
  if (getStatus(attacker.statuses, 'weak') > 0) dmg = Math.floor(dmg * 0.75);
  if (getStatus(defender.statuses, 'vulnerable') > 0) dmg = Math.floor(dmg * 1.5);
  return Math.max(0, dmg);
}

export function modifiedBlockGain(base: number, c: Combatant): number {
  let b = base + getStatus(c.statuses, 'dexterity');
  if (getStatus(c.statuses, 'frail') > 0) b = Math.floor(b * 0.75);
  return Math.max(0, b);
}
