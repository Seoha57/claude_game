import type { Combatant, StatusKey, Statuses } from '../types';
import { t } from '../i18n';

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
  strength: { key: 'strength', name: t('힘'), description: t('공격 데미지 +N'), decay: false, buff: true },
  dexterity: {
    key: 'dexterity',
    name: t('민첩'),
    description: t('획득 방어도 +N'),
    decay: false,
    buff: true,
  },
  vulnerable: {
    key: 'vulnerable',
    name: t('취약'),
    description: t('받는 공격 데미지 50% 증가'),
    decay: true,
    buff: false,
  },
  weak: {
    key: 'weak',
    name: t('약화'),
    description: t('주는 공격 데미지 25% 감소'),
    decay: true,
    buff: false,
  },
  poison: {
    key: 'poison',
    name: t('중독'),
    description: t('턴 시작마다 N 데미지, 이후 1 감소'),
    decay: false,
    buff: false,
  },
  thorns: {
    key: 'thorns',
    name: t('가시'),
    description: t('공격받으면 N 반사'),
    decay: false,
    buff: true,
  },
  regen: {
    key: 'regen',
    name: t('재생'),
    description: t('턴 종료 시 N 회복, 이후 1 감소'),
    decay: false,
    buff: true,
  },
  frail: {
    key: 'frail',
    name: t('쇠약'),
    description: t('획득 방어도 25% 감소'),
    decay: true,
    buff: false,
  },
  ritual: {
    key: 'ritual',
    name: t('의식'),
    description: t('턴 종료 시 힘 +N'),
    decay: false,
    buff: true,
  },
  metallicize: {
    key: 'metallicize',
    name: t('금속화'),
    description: t('턴 종료 시 방어도 +N'),
    decay: false,
    buff: true,
  },
  burn: {
    key: 'burn',
    name: t('화상'),
    description: t('턴 종료 시 N 데미지. 이후 1 감소'),
    decay: true,
    buff: false,
  },
  freeze: {
    key: 'freeze',
    name: t('빙결'),
    description: t('다음 N턴 행동 불가'),
    decay: true,
    buff: false,
  },
  on_exhaust_str: {
    key: 'on_exhaust_str',
    name: t('소멸의 힘'),
    description: t('카드 소멸 시 힘 +N'),
    decay: false,
    buff: true,
  },
  on_exhaust_draw: {
    key: 'on_exhaust_draw',
    name: t('소멸 드로우'),
    description: t('카드 소멸 시 N장 드로우'),
    decay: false,
    buff: true,
  },
  on_exhaust_block: {
    key: 'on_exhaust_block',
    name: t('소멸 방어'),
    description: t('카드 소멸 시 방어도 +N'),
    decay: false,
    buff: true,
  },
  on_exhaust_energy: {
    key: 'on_exhaust_energy',
    name: t('소멸 에너지'),
    description: t('카드 소멸 시 에너지 +N'),
    decay: false,
    buff: true,
  },
  drone_basic: {
    key: 'drone_basic',
    name: t('경량 드론'),
    description: t('매턴 랜덤 적에게 N 데미지 (힘 적용)'),
    decay: false,
    buff: true,
  },
  drone_heavy: {
    key: 'drone_heavy',
    name: t('중형 드론'),
    description: t('2턴마다 랜덤 적에게 N 데미지 (힘 적용)'),
    decay: false,
    buff: true,
  },
  drone_aoe: {
    key: 'drone_aoe',
    name: t('공성 드론'),
    description: t('3턴마다 모든 적에게 N 데미지 (힘 적용)'),
    decay: false,
    buff: true,
  },
  drone_ice: {
    key: 'drone_ice',
    name: t('냉각 드론'),
    description: t('2턴마다 랜덤 적에게 빙결 +N'),
    decay: false,
    buff: true,
  },
  drone_burn: {
    key: 'drone_burn',
    name: t('화염 드론'),
    description: t('매턴 랜덤 적에게 화상 +N'),
    decay: false,
    buff: true,
  },
  drone_recon: {
    key: 'drone_recon',
    name: t('정찰 드론'),
    description: t('매턴 N장 드로우'),
    decay: false,
    buff: true,
  },
  drone_shield: {
    key: 'drone_shield',
    name: t('보호 드론'),
    description: t('2턴마다 방어도 +N'),
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

// Triangular sum: N + (N-1) + ... + 1 = N(N+1)/2
function triangularSum(n: number): number {
  return Math.floor((n * (n + 1)) / 2);
}

// 칩에 표시될 짧은 라벨 — 모바일에서도 한눈에 의미 파악 가능
// (이름은 호출쪽에서 붙임. 여기서는 값 + 부가정보만)
export function getStatusValueLabel(key: StatusKey, value: number): string {
  switch (key) {
    case 'regen':
      return `${value} (${t('총')} ${triangularSum(value)}HP)`;
    case 'poison':
    case 'burn':
      return `${value} (${t('총')} ${triangularSum(value)})`;
    case 'freeze':
    case 'vulnerable':
    case 'weak':
    case 'frail':
      return `${value}${t('턴')}`;
    case 'drone_basic':
    case 'drone_heavy':
    case 'drone_aoe':
    case 'drone_ice':
    case 'drone_burn':
    case 'drone_recon':
    case 'drone_shield':
      return String(value);
    default:
      // strength / dexterity / thorns / metallicize / ritual / on_exhaust_* 등
      return String(value);
  }
}

// 호버 시 표시되는 자세한 툴팁 — 값에 따라 동작 명확히 안내
export function getStatusTooltip(key: StatusKey, value: number): string {
  const info = STATUS_INFO[key];
  const name = info.name;
  switch (key) {
    case 'strength':
      return `${name}: ${t('공격 카드 데미지')} +${value} (${t('영구')})`;
    case 'dexterity':
      return `${name}: ${t('방어도 카드에')} +${value} (${t('영구')})`;
    case 'thorns':
      return `${name}: ${t('공격받을 때마다')} ${value} ${t('데미지 반사')} (${t('영구')})`;
    case 'metallicize':
      return `${name}: ${t('매 턴 종료 시 방어도')} +${value} (${t('영구')})`;
    case 'ritual':
      return `${name}: ${t('매 턴 종료 시 힘')} +${value} (${t('영구')})`;
    case 'regen':
      return `${name}: ${t('턴 종료 시')} ${value} ${t('HP 회복. 이후 1씩 감소.')}\n${t('총 회복 예상:')} ${triangularSum(value)} HP`;
    case 'poison':
      return `${name}: ${t('턴 시작 시')} ${value} ${t('데미지. 이후 1씩 감소.')}\n${t('총 데미지 예상:')} ${triangularSum(value)}`;
    case 'burn':
      return `${name}: ${t('턴 종료 시')} ${value} ${t('데미지 (방어도 무시). 이후 1씩 감소.')}\n${t('총 데미지 예상:')} ${triangularSum(value)}`;
    case 'vulnerable':
      return `${name}: ${t('받는 공격')} +50%. ${value}${t('턴 동안.')}`;
    case 'weak':
      return `${name}: ${t('주는 공격')} -25%. ${value}${t('턴 동안.')}`;
    case 'frail':
      return `${name}: ${t('획득 방어도')} -25%. ${value}${t('턴 동안.')}`;
    case 'freeze':
      return `${name}: ${t('다음')} ${value}${t('턴 동안 행동 불가.')}`;
    case 'on_exhaust_str':
      return `${name}: ${t('카드 소멸 시 힘')} +${value} (${t('영구')})`;
    case 'on_exhaust_draw':
      return `${name}: ${t('카드 소멸 시')} ${value}${t('장 드로우')}`;
    case 'on_exhaust_block':
      return `${name}: ${t('카드 소멸 시 방어도')} +${value}`;
    case 'on_exhaust_energy':
      return `${name}: ${t('카드 소멸 시 에너지')} +${value}`;
    case 'drone_basic':
      return `${name}: ${t('매턴 랜덤 적에게')} ${value}+${t('힘')} ${t('데미지')}`;
    case 'drone_heavy':
      return `${name}: ${t('2턴마다 랜덤 적에게')} ${value}+${t('힘')} ${t('데미지')}`;
    case 'drone_aoe':
      return `${name}: ${t('3턴마다 모든 적에게')} ${value}+${t('힘')} ${t('데미지')}`;
    case 'drone_ice':
      return `${name}: ${t('2턴마다 랜덤 적에게 빙결')} +${value}`;
    case 'drone_burn':
      return `${name}: ${t('매턴 랜덤 적에게 화상')} +${value}`;
    case 'drone_recon':
      return `${name}: ${t('매턴')} ${value}${t('장 드로우')}`;
    case 'drone_shield':
      return `${name}: ${t('2턴마다 방어도')} +${value}`;
    default:
      return `${name}: ${info.description}`;
  }
}
