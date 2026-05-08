import type { CardDef, CardInstance } from '../types';

export const FIGHTER_CARD_DEFS: Record<string, CardDef> = {
  // ── Starter ──
  f_quick_kick: {
    id: 'f_quick_kick',
    name: '질풍각',
    type: 'attack',
    rarity: 'starter',
    cost: 1,
    target: 'enemy',
    description: '6 데미지.',
    effects: [{ kind: 'damage', amount: 6 }],
  },
  f_nen_guard: {
    id: 'f_nen_guard',
    name: '넨 가드',
    type: 'skill',
    rarity: 'starter',
    cost: 1,
    target: 'self',
    description: '방어도 +5.',
    effects: [{ kind: 'block', amount: 5 }],
  },

  // ── Common (includes starter-special) ──
  f_upper_kick: {
    id: 'f_upper_kick',
    name: '올려차기',
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
  f_low_kick: {
    id: 'f_low_kick',
    name: '로킥',
    type: 'attack',
    rarity: 'common',
    cost: 1,
    target: 'enemy',
    description: '5 데미지를 두 번.',
    effects: [{ kind: 'damage', amount: 5, times: 2 }],
  },
  f_aerial_stomp: {
    id: 'f_aerial_stomp',
    name: '공중 밟기',
    type: 'attack',
    rarity: 'common',
    cost: 1,
    target: 'all_enemies',
    description: '모든 적에게 8 데미지.',
    effects: [{ kind: 'damage_all', amount: 8 }],
  },
  f_dragon_kick: {
    id: 'f_dragon_kick',
    name: '용권',
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
  f_heavy_punch: {
    id: 'f_heavy_punch',
    name: '헤비 펀치',
    type: 'attack',
    rarity: 'common',
    cost: 2,
    target: 'enemy',
    description: '14 데미지.',
    effects: [{ kind: 'damage', amount: 14 }],
  },
  f_combo: {
    id: 'f_combo',
    name: '연속 공격',
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
  f_nen_bullet: {
    id: 'f_nen_bullet',
    name: '넨 탄',
    type: 'attack',
    rarity: 'common',
    cost: 1,
    target: 'random_enemy',
    description: '4 데미지를 세 번.',
    effects: [{ kind: 'damage', amount: 4, times: 3 }],
  },
  f_iron_body: {
    id: 'f_iron_body',
    name: '철벽 수비',
    type: 'skill',
    rarity: 'common',
    cost: 1,
    target: 'self',
    description: '5 데미지. 방어도 +5.',
    effects: [
      { kind: 'damage', amount: 5 },
      { kind: 'block', amount: 5 },
    ],
  },
  f_ki_focus: {
    id: 'f_ki_focus',
    name: '기 집중',
    type: 'skill',
    rarity: 'common',
    cost: 0,
    target: 'self',
    description: '힘 +2.',
    effects: [{ kind: 'apply_self', status: 'strength', amount: 2 }],
  },
  f_dodge: {
    id: 'f_dodge',
    name: '회피',
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
  f_focus: {
    id: 'f_focus',
    name: '집중',
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

  // ── Uncommon ──
  f_needle_throw: {
    id: 'f_needle_throw',
    name: '바늘 투척',
    type: 'attack',
    rarity: 'uncommon',
    cost: 1,
    target: 'enemy',
    description: '5 데미지. 중독 +5.',
    effects: [
      { kind: 'damage', amount: 5 },
      { kind: 'apply_enemy', status: 'poison', amount: 5 },
    ],
  },
  f_lion_roar: {
    id: 'f_lion_roar',
    name: '사자후',
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
  f_snap_shot: {
    id: 'f_snap_shot',
    name: '스냅 샷',
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
  f_slide_grab: {
    id: 'f_slide_grab',
    name: '슬라이딩 그랩',
    type: 'skill',
    rarity: 'uncommon',
    cost: 1,
    target: 'self',
    description: '방어도 +10. (이번 턴 한정)',
    effects: [{ kind: 'block', amount: 10 }],
    ethereal: true,
  },
  f_hadouken: {
    id: 'f_hadouken',
    name: '파동권',
    type: 'power',
    rarity: 'uncommon',
    cost: 1,
    target: 'self',
    description: '힘 +2.',
    effects: [{ kind: 'apply_self', status: 'strength', amount: 2 }],
  },
  f_mount: {
    id: 'f_mount',
    name: '마운트',
    type: 'skill',
    rarity: 'uncommon',
    cost: 0,
    target: 'self',
    description: '재생 +5.',
    effects: [{ kind: 'apply_self', status: 'regen', amount: 5 }],
  },
  f_double_open: {
    id: 'f_double_open',
    name: '이중개방',
    type: 'power',
    rarity: 'uncommon',
    cost: 1,
    target: 'self',
    description: '턴 종료 시 방어도 +3.',
    effects: [{ kind: 'apply_self', status: 'metallicize', amount: 3 }],
  },

  // ── Rare (1차 각성기) ──
  f_golden_thunder: {
    id: 'f_golden_thunder',
    name: '금뇌호 : 심판의 넨수',
    type: 'attack',
    rarity: 'rare',
    cost: 3,
    target: 'enemy',
    description: '32 데미지. 취약 +2.',
    effects: [
      { kind: 'damage', amount: 32 },
      { kind: 'apply_enemy', status: 'vulnerable', amount: 2 },
    ],
  },
  f_flame_kick: {
    id: 'f_flame_kick',
    name: '화염의 각',
    type: 'attack',
    rarity: 'rare',
    cost: 2,
    target: 'all_enemies',
    description: '모든 적에게 21 데미지.',
    effects: [{ kind: 'damage_all', amount: 21 }],
  },
  f_sky_fall: {
    id: 'f_sky_fall',
    name: '천붕지괴',
    type: 'power',
    rarity: 'rare',
    cost: 3,
    target: 'self',
    description: '턴 시작 시 힘 +2.',
    effects: [{ kind: 'apply_self', status: 'ritual', amount: 2 }],
  },
  f_my_rhythm: {
    id: 'f_my_rhythm',
    name: '나의 공격 리듬은!!',
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
};

const FIGHTER_UPGRADE_MAP: Record<string, Partial<CardDef>> = {
  f_quick_kick:    { name: '질풍각+',                   description: '9 데미지.',                              effects: [{ kind: 'damage', amount: 9 }] },
  f_nen_guard:     { name: '넨 가드+',                  description: '방어도 +8.',                            effects: [{ kind: 'block', amount: 8 }] },
  f_upper_kick:    { name: '올려차기+',                 description: '10 데미지. 취약 +3.',                   effects: [{ kind: 'damage', amount: 10 }, { kind: 'apply_enemy', status: 'vulnerable', amount: 3 }] },
  f_low_kick:      { name: '로킥+',                     description: '7 데미지를 두 번.',                     effects: [{ kind: 'damage', amount: 7, times: 2 }] },
  f_aerial_stomp:  { name: '공중 밟기+',                description: '모든 적에게 11 데미지.',                effects: [{ kind: 'damage_all', amount: 11 }] },
  f_dragon_kick:   { name: '용권+',                     description: '모든 적에게 7 데미지. 취약 +1.',        effects: [{ kind: 'damage_all', amount: 7 }, { kind: 'apply_all', status: 'vulnerable', amount: 1 }] },
  f_heavy_punch:   { name: '헤비 펀치+',                description: '18 데미지.',                            effects: [{ kind: 'damage', amount: 18 }] },
  f_combo:         { name: '연속 공격+',                description: '10 데미지. 2장 드로우.',                effects: [{ kind: 'damage', amount: 10 }, { kind: 'draw', amount: 2 }] },
  f_nen_bullet:    { name: '넨 탄+',                    description: '5 데미지를 세 번.',                     effects: [{ kind: 'damage', amount: 5, times: 3 }] },
  f_iron_body:     { name: '철벽 수비+',                description: '7 데미지. 방어도 +7.',                  effects: [{ kind: 'damage', amount: 7 }, { kind: 'block', amount: 7 }] },
  f_ki_focus:      { name: '기 집중+',                  description: '힘 +4.',                                effects: [{ kind: 'apply_self', status: 'strength', amount: 4 }] },
  f_dodge:         { name: '회피+',                     description: '방어도 +11. 1장 드로우.',               effects: [{ kind: 'block', amount: 11 }, { kind: 'draw', amount: 1 }] },
  f_focus:         { name: '집중+',                     description: '방어도 +9. 무작위 카드 1장 소멸.',      effects: [{ kind: 'block', amount: 9 }, { kind: 'exhaust_random_hand' }] },
  f_needle_throw:  { name: '바늘 투척+',                description: '7 데미지. 중독 +7.',                    effects: [{ kind: 'damage', amount: 7 }, { kind: 'apply_enemy', status: 'poison', amount: 7 }] },
  f_lion_roar:     { name: '사자후+',                   description: '15 데미지. 취약 +2. 약화 +2.',          effects: [{ kind: 'damage', amount: 15 }, { kind: 'apply_enemy', status: 'vulnerable', amount: 2 }, { kind: 'apply_enemy', status: 'weak', amount: 2 }] },
  f_snap_shot:     { name: '스냅 샷+',                  description: 'HP -2. 에너지 +3.',                     effects: [{ kind: 'lose_hp', amount: 2 }, { kind: 'energy', amount: 3 }] },
  f_slide_grab:    { name: '슬라이딩 그랩+',            description: '방어도 +13.',                           effects: [{ kind: 'block', amount: 13 }] },
  f_hadouken:      { name: '파동권+',                   description: '힘 +3.',                                effects: [{ kind: 'apply_self', status: 'strength', amount: 3 }] },
  f_mount:         { name: '마운트+',                   description: '재생 +8.',                              effects: [{ kind: 'apply_self', status: 'regen', amount: 8 }] },
  f_double_open:   { name: '이중개방+',                 description: '턴 종료 시 방어도 +4.',                 effects: [{ kind: 'apply_self', status: 'metallicize', amount: 4 }] },
  f_golden_thunder: { name: '금뇌호 : 심판의 넨수+',   description: '42 데미지. 취약 +3.',                   effects: [{ kind: 'damage', amount: 42 }, { kind: 'apply_enemy', status: 'vulnerable', amount: 3 }] },
  f_flame_kick:    { name: '화염의 각+',                description: '모든 적에게 28 데미지.',                effects: [{ kind: 'damage_all', amount: 28 }] },
  f_sky_fall:      { name: '천붕지괴+',                 description: '턴 시작 시 힘 +3.',                     effects: [{ kind: 'apply_self', status: 'ritual', amount: 3 }] },
  f_my_rhythm:     { name: '나의 공격 리듬은!!+',       description: 'HP -3. 24 데미지.',                     effects: [{ kind: 'lose_hp', amount: 3 }, { kind: 'damage', amount: 24 }] },
};

export function fighterGetEffectiveDef(card: CardInstance): CardDef {
  const base = FIGHTER_CARD_DEFS[card.defId];
  if (!card.upgraded) return base;
  const up = FIGHTER_UPGRADE_MAP[card.defId];
  if (!up) return base;
  return { ...base, ...up };
}

export function canUpgradeFighter(card: CardInstance): boolean {
  return !card.upgraded && card.defId in FIGHTER_UPGRADE_MAP;
}

const FIGHTER_CARD_LIST = Object.values(FIGHTER_CARD_DEFS);
export const FIGHTER_COMMON_CARDS   = FIGHTER_CARD_LIST.filter((c) => c.rarity === 'common');
export const FIGHTER_UNCOMMON_CARDS = FIGHTER_CARD_LIST.filter((c) => c.rarity === 'uncommon');
export const FIGHTER_RARE_CARDS     = FIGHTER_CARD_LIST.filter((c) => c.rarity === 'rare');
