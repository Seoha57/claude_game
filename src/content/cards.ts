import type { CardDef } from '../types';
import { GUNNER_CARD_DEFS, gunnerGetEffectiveDef, canUpgradeGunner } from './gunner-cards';
import { FIGHTER_CARD_DEFS, fighterGetEffectiveDef, canUpgradeFighter } from './fighter-cards';
export { GUNNER_COMMON_CARDS, GUNNER_UNCOMMON_CARDS, GUNNER_RARE_CARDS } from './gunner-cards';
export { FIGHTER_COMMON_CARDS, FIGHTER_UNCOMMON_CARDS, FIGHTER_RARE_CARDS } from './fighter-cards';

export const CARD_DEFS: Record<string, CardDef> = {
  // ── Curse ──
  wound: {
    id: 'wound',
    name: '상처',
    type: 'skill',
    rarity: 'starter',
    cost: 0,
    target: 'none',
    description: '아무 효과 없음. (저주)',
    effects: [],
  },

  // ── Starter ──
  strike: {
    id: 'strike',
    name: '귀참',
    type: 'attack',
    rarity: 'starter',
    cost: 1,
    target: 'enemy',
    description: '6 데미지.',
    effects: [{ kind: 'damage', amount: 6 }],
  },
  defend: {
    id: 'defend',
    name: '가드',
    type: 'skill',
    rarity: 'starter',
    cost: 1,
    target: 'self',
    description: '방어도 +5.',
    effects: [{ kind: 'block', amount: 5 }],
  },

  // ── Common attacks ──
  bash: {
    id: 'bash',
    name: '에쉔 포크',
    type: 'attack',
    rarity: 'common',
    cost: 2,
    target: 'enemy',
    description: '8 데미지. 취약 +2.',
    effects: [
      { kind: 'damage', amount: 8 },
      { kind: 'apply_enemy', status: 'vulnerable', amount: 2 },
    ],
  },
  cleave: {
    id: 'cleave',
    name: '공중 연속 베기',
    type: 'attack',
    rarity: 'common',
    cost: 1,
    target: 'all_enemies',
    description: '모든 적에게 8 데미지.',
    effects: [{ kind: 'damage_all', amount: 8 }],
  },
  twin_strike: {
    id: 'twin_strike',
    name: '어퍼 슬래쉬',
    type: 'attack',
    rarity: 'common',
    cost: 1,
    target: 'enemy',
    description: '5 데미지를 두 번.',
    effects: [{ kind: 'damage', amount: 5, times: 2 }],
  },
  pommel_strike: {
    id: 'pommel_strike',
    name: '블러드러스트',
    type: 'attack',
    rarity: 'common',
    cost: 1,
    target: 'enemy',
    description: '9 데미지. 1장 드로우.',
    effects: [
      { kind: 'damage', amount: 9 },
      { kind: 'draw', amount: 1 },
    ],
  },
  thunderclap: {
    id: 'thunderclap',
    name: '열파참',
    type: 'attack',
    rarity: 'common',
    cost: 1,
    target: 'all_enemies',
    description: '모든 적에게 4 데미지. 취약 +1.',
    effects: [
      { kind: 'damage_all', amount: 4 },
      { kind: 'apply_all', status: 'vulnerable', amount: 1 },
    ],
  },
  heavy_blade: {
    id: 'heavy_blade',
    name: '단공참',
    type: 'attack',
    rarity: 'common',
    cost: 2,
    target: 'enemy',
    description: '14 데미지.',
    effects: [{ kind: 'damage', amount: 14 }],
  },

  // ── Common skills ──
  iron_wave: {
    id: 'iron_wave',
    name: '고어 크로스',
    type: 'skill',
    rarity: 'common',
    cost: 1,
    target: 'enemy',
    description: '5 데미지. 방어도 +5.',
    effects: [
      { kind: 'damage', amount: 5 },
      { kind: 'block', amount: 5 },
    ],
  },
  shrug_it_off: {
    id: 'shrug_it_off',
    name: '달빛 베기',
    type: 'skill',
    rarity: 'common',
    cost: 1,
    target: 'self',
    description: '방어도 +8. 1장 드로우.',
    effects: [
      { kind: 'block', amount: 8 },
      { kind: 'draw', amount: 1 },
    ],
  },
  flex: {
    id: 'flex',
    name: '둔기 마스터리',
    type: 'skill',
    rarity: 'common',
    cost: 0,
    target: 'self',
    description: '힘 +2.',
    effects: [{ kind: 'apply_self', status: 'strength', amount: 2 }],
  },
  true_grit: {
    id: 'true_grit',
    name: '리프트',
    type: 'skill',
    rarity: 'common',
    cost: 1,
    target: 'self',
    description: '방어도 +7. 무작위 카드 1장 소멸.',
    effects: [
      { kind: 'block', amount: 7 },
      { kind: 'exhaust_random_hand' },
    ],
  },
  warcry: {
    id: 'warcry',
    name: '초상비',
    type: 'skill',
    rarity: 'common',
    cost: 0,
    target: 'self',
    description: '1장 드로우. 무작위 카드 1장 소멸.',
    effects: [
      { kind: 'draw', amount: 1 },
      { kind: 'exhaust_random_hand' },
    ],
    exhaust: true,
  },

  // ── Uncommon ──
  dropkick: {
    id: 'dropkick',
    name: '쓰러스트',
    type: 'attack',
    rarity: 'uncommon',
    cost: 1,
    target: 'enemy',
    description: '5 데미지.',
    effects: [{ kind: 'damage', amount: 5 }],
  },
  uppercut: {
    id: 'uppercut',
    name: '파동검 지열',
    type: 'attack',
    rarity: 'uncommon',
    cost: 2,
    target: 'enemy',
    description: '13 데미지. 취약 +1. 약화 +1.',
    effects: [
      { kind: 'damage', amount: 13 },
      { kind: 'apply_enemy', status: 'vulnerable', amount: 1 },
      { kind: 'apply_enemy', status: 'weak', amount: 1 },
    ],
  },
  bloodletting: {
    id: 'bloodletting',
    name: '웨이브',
    type: 'skill',
    rarity: 'uncommon',
    cost: 0,
    target: 'self',
    description: 'HP -3. 에너지 +2.',
    effects: [
      { kind: 'lose_hp', amount: 3 },
      { kind: 'energy', amount: 2 },
    ],
  },
  ghostly_armor: {
    id: 'ghostly_armor',
    name: '도 마스터리',
    type: 'skill',
    rarity: 'uncommon',
    cost: 1,
    target: 'self',
    description: '방어도 +10. (이번 턴 한정)',
    effects: [{ kind: 'block', amount: 10 }],
    ethereal: true,
  },
  inflame: {
    id: 'inflame',
    name: '소검 마스터리',
    type: 'power',
    rarity: 'uncommon',
    cost: 1,
    target: 'self',
    description: '힘 +2.',
    effects: [{ kind: 'apply_self', status: 'strength', amount: 2 }],
  },
  rage: {
    id: 'rage',
    name: '리턴',
    type: 'skill',
    rarity: 'uncommon',
    cost: 0,
    target: 'self',
    description: '재생 +5.',
    effects: [{ kind: 'apply_self', status: 'regen', amount: 5 }],
  },
  metallicize_card: {
    id: 'metallicize_card',
    name: '대검 마스터리',
    type: 'power',
    rarity: 'uncommon',
    cost: 1,
    target: 'self',
    description: '턴 종료 시 방어도 +3.',
    effects: [{ kind: 'apply_self', status: 'metallicize', amount: 3 }],
  },

  // ── Rare (1차 각성기) ──
  bludgeon: {
    id: 'bludgeon',
    name: '극 귀검술 : 폭풍식',
    type: 'attack',
    rarity: 'rare',
    cost: 3,
    target: 'enemy',
    description: '32 데미지.',
    effects: [{ kind: 'damage', amount: 32 }],
  },
  demon_form: {
    id: 'demon_form',
    name: '파동의 눈',
    type: 'power',
    rarity: 'rare',
    cost: 3,
    target: 'self',
    description: '턴 시작 시 힘 +2.',
    effects: [{ kind: 'apply_self', status: 'ritual', amount: 2 }],
  },
  feed: {
    id: 'feed',
    name: '익스트림 오버킬',
    type: 'attack',
    rarity: 'rare',
    cost: 2,
    target: 'enemy',
    description: 'HP -5. 18 데미지.',
    effects: [
      { kind: 'lose_hp', amount: 5 },
      { kind: 'damage', amount: 18 },
    ],
    exhaust: true,
  },
  immolate: {
    id: 'immolate',
    name: '제 7의 귀신 : 광폭의 블라수',
    type: 'attack',
    rarity: 'rare',
    cost: 2,
    target: 'all_enemies',
    description: '모든 적에게 21 데미지.',
    effects: [{ kind: 'damage_all', amount: 21 }],
  },
  reaper: {
    id: 'reaper',
    name: '귀천살',
    type: 'attack',
    rarity: 'rare',
    cost: 2,
    target: 'all_enemies',
    description: '모든 적에게 4 데미지.',
    effects: [{ kind: 'damage_all', amount: 4 }],
    exhaust: true,
  },
};

// Merge all character cards into CARD_DEFS so getEffectiveDef works universally
Object.assign(CARD_DEFS, GUNNER_CARD_DEFS, FIGHTER_CARD_DEFS);

export const CARD_LIST = Object.values(CARD_DEFS).filter((c) => !c.id.startsWith('g_') && !c.id.startsWith('f_'));
export const COMMON_CARDS   = CARD_LIST.filter((c) => c.rarity === 'common');
export const UNCOMMON_CARDS = CARD_LIST.filter((c) => c.rarity === 'uncommon');
export const RARE_CARDS     = CARD_LIST.filter((c) => c.rarity === 'rare');

// Upgrade overrides — only fields that change
const UPGRADE_MAP: Record<string, Partial<CardDef>> = {
  strike:           { name: '귀참+',          description: '9 데미지.',                          effects: [{ kind: 'damage', amount: 9 }] },
  defend:           { name: '가드+',          description: '방어도 +8.',                         effects: [{ kind: 'block', amount: 8 }] },
  bash:             { name: '에쉔 포크+',      description: '10 데미지. 취약 +3.',                effects: [{ kind: 'damage', amount: 10 }, { kind: 'apply_enemy', status: 'vulnerable', amount: 3 }] },
  cleave:           { name: '공중 연속 베기+',  description: '모든 적에게 11 데미지.',              effects: [{ kind: 'damage_all', amount: 11 }] },
  twin_strike:      { name: '어퍼 슬래쉬+',   description: '7 데미지를 두 번.',                   effects: [{ kind: 'damage', amount: 7, times: 2 }] },
  pommel_strike:    { name: '블러드러스트+', description: '10 데미지. 2장 드로우.',              effects: [{ kind: 'damage', amount: 10 }, { kind: 'draw', amount: 2 }] },
  thunderclap:      { name: '열파참+',        description: '모든 적에게 7 데미지. 취약 +1.',     effects: [{ kind: 'damage_all', amount: 7 }, { kind: 'apply_all', status: 'vulnerable', amount: 1 }] },
  heavy_blade:      { name: '단공참+',   description: '18 데미지.',                          effects: [{ kind: 'damage', amount: 18 }] },
  iron_wave:        { name: '고어 크로스+',  description: '7 데미지. 방어도 +7.',               effects: [{ kind: 'damage', amount: 7 }, { kind: 'block', amount: 7 }] },
  shrug_it_off:     { name: '달빛 베기+',        description: '방어도 +11. 1장 드로우.',            effects: [{ kind: 'block', amount: 11 }, { kind: 'draw', amount: 1 }] },
  flex:             { name: '둔기 마스터리+',  description: '힘 +4.',                              effects: [{ kind: 'apply_self', status: 'strength', amount: 4 }] },
  true_grit:        { name: '리프트+',          description: '방어도 +9. 무작위 카드 1장 소멸.',   effects: [{ kind: 'block', amount: 9 }, { kind: 'exhaust_random_hand' }] },
  warcry:           { name: '초상비+',          description: '2장 드로우. 무작위 카드 1장 소멸.', effects: [{ kind: 'draw', amount: 2 }, { kind: 'exhaust_random_hand' }] },
  dropkick:         { name: '쓰러스트+',     description: '8 데미지.',                           effects: [{ kind: 'damage', amount: 8 }] },
  uppercut:         { name: '파동검 지열+',description: '15 데미지. 취약 +2. 약화 +2.',        effects: [{ kind: 'damage', amount: 15 }, { kind: 'apply_enemy', status: 'vulnerable', amount: 2 }, { kind: 'apply_enemy', status: 'weak', amount: 2 }] },
  bloodletting:     { name: '웨이브+',        description: 'HP -2. 에너지 +3.',                  effects: [{ kind: 'lose_hp', amount: 2 }, { kind: 'energy', amount: 3 }] },
  ghostly_armor:    { name: '도 마스터리+',     description: '방어도 +13.',                         effects: [{ kind: 'block', amount: 13 }] },
  inflame:          { name: '소검 마스터리+',          description: '힘 +3.',                              effects: [{ kind: 'apply_self', status: 'strength', amount: 3 }] },
  rage:             { name: '리턴+',          description: '재생 +8.',                            effects: [{ kind: 'apply_self', status: 'regen', amount: 8 }] },
  metallicize_card: { name: '대검 마스터리+',  description: '턴 종료 시 방어도 +4.',              effects: [{ kind: 'apply_self', status: 'metallicize', amount: 4 }] },
  bludgeon:         { name: '극 귀검술 : 폭풍식+',           description: '42 데미지.',                       effects: [{ kind: 'damage', amount: 42 }] },
  demon_form:       { name: '파동의 눈+',                   description: '턴 시작 시 힘 +3.',                effects: [{ kind: 'apply_self', status: 'ritual', amount: 3 }] },
  feed:             { name: '익스트림 오버킬+',             description: 'HP -3. 24 데미지.',                effects: [{ kind: 'lose_hp', amount: 3 }, { kind: 'damage', amount: 24 }] },
  immolate:         { name: '제 7의 귀신 : 광폭의 블라수+', description: '모든 적에게 28 데미지.',           effects: [{ kind: 'damage_all', amount: 28 }] },
  reaper:           { name: '귀천살+',                      description: '모든 적에게 6 데미지.',            effects: [{ kind: 'damage_all', amount: 6 }] },
};

import type { CardInstance } from '../types';

export function getEffectiveDef(card: CardInstance): CardDef {
  if (card.defId.startsWith('g_')) return gunnerGetEffectiveDef(card);
  if (card.defId.startsWith('f_')) return fighterGetEffectiveDef(card);
  const base = CARD_DEFS[card.defId];
  if (!card.upgraded) return base;
  const up = UPGRADE_MAP[card.defId];
  if (!up) return base;
  return { ...base, ...up };
}

export function canUpgrade(card: CardInstance): boolean {
  if (card.defId.startsWith('g_')) return canUpgradeGunner(card);
  if (card.defId.startsWith('f_')) return canUpgradeFighter(card);
  return !card.upgraded && card.defId in UPGRADE_MAP;
}
