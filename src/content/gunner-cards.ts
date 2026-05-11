import type { CardDef, CardInstance } from '../types';

export const GUNNER_CARD_DEFS: Record<string, CardDef> = {
  // ── Starter ──
  g_rising_shot: {
    id: 'g_rising_shot',
    name: '라이징 샷',
    type: 'attack',
    rarity: 'starter',
    cost: 1,
    target: 'enemy',
    description: '6 데미지.',
    effects: [{ kind: 'damage', amount: 6 }],
  },
  g_reload: {
    id: 'g_reload',
    name: '고각도 슬라이딩',
    type: 'skill',
    rarity: 'starter',
    cost: 1,
    target: 'self',
    description: '방어도 +5.',
    effects: [{ kind: 'block', amount: 5 }],
  },

  // ── Common attacks ──
  g_headshot: {
    id: 'g_headshot',
    name: '더스트 샷',
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
  g_double_gunhawk: {
    id: 'g_double_gunhawk',
    name: '잭스파이크',
    type: 'attack',
    rarity: 'common',
    cost: 1,
    target: 'enemy',
    description: '5 데미지를 두 번.',
    effects: [{ kind: 'damage', amount: 5, times: 2 }],
  },
  g_western_fire: {
    id: 'g_western_fire',
    name: '마하킥',
    type: 'attack',
    rarity: 'common',
    cost: 1,
    target: 'all_enemies',
    description: '모든 적에게 8 데미지.',
    effects: [{ kind: 'damage_all', amount: 8 }],
  },
  g_frag: {
    id: 'g_frag',
    name: '윈드밀',
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
  g_cannonball: {
    id: 'g_cannonball',
    name: 'M-137 개틀링건',
    type: 'attack',
    rarity: 'common',
    cost: 2,
    target: 'enemy',
    description: '14 데미지.',
    effects: [{ kind: 'damage', amount: 14 }],
  },
  g_burst_fire: {
    id: 'g_burst_fire',
    name: '퍼니셔',
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
  g_barrage: {
    id: 'g_barrage',
    name: '공중사격',
    type: 'attack',
    rarity: 'common',
    cost: 1,
    target: 'random_enemy',
    description: '4 데미지를 세 번.',
    effects: [{ kind: 'damage', amount: 4, times: 3 }],
  },

  // ── Common skills ──
  g_smoke: {
    id: 'g_smoke',
    name: '라이징 윈드밀',
    type: 'skill',
    rarity: 'common',
    cost: 1,
    target: 'all_enemies',
    description: '모든 적에게 약화 +2.',
    effects: [{ kind: 'apply_all', status: 'weak', amount: 2 }],
  },
  g_booster: {
    id: 'g_booster',
    name: '패스티스트 건',
    type: 'skill',
    rarity: 'common',
    cost: 0,
    target: 'self',
    description: '힘 +2.',
    effects: [{ kind: 'apply_self', status: 'strength', amount: 2 }],
  },
  g_reposit: {
    id: 'g_reposit',
    name: '회심의 랜드러너',
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
  g_ammo: {
    id: 'g_ammo',
    name: '조준 사격',
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
  g_armor: {
    id: 'g_armor',
    name: '냉동탄',
    type: 'attack',
    rarity: 'common',
    cost: 1,
    target: 'enemy',
    description: '5 데미지. 빙결 +1. 소멸.',
    effects: [
      { kind: 'damage', amount: 5 },
      { kind: 'apply_enemy', status: 'freeze', amount: 1 },
    ],
    exhaust: true,
  },

  // ── Uncommon ──
  g_satellite: {
    id: 'g_satellite',
    name: '새틀라이트 빔',
    type: 'attack',
    rarity: 'rare',
    cost: 2,
    target: 'all_enemies',
    description: '모든 적에게 18 데미지. 약화 +2.',
    effects: [
      { kind: 'damage_all', amount: 18 },
      { kind: 'apply_all', status: 'weak', amount: 2 },
    ],
  },
  g_viper: {
    id: 'g_viper',
    name: '바베~큐',
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
  g_optical: {
    id: 'g_optical',
    name: '슈타이어 중저격총',
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
  g_napalm: {
    id: 'g_napalm',
    name: 'M-3 화염방사기',
    type: 'attack',
    rarity: 'uncommon',
    cost: 2,
    target: 'all_enemies',
    description: '모든 적에게 10 데미지.',
    effects: [{ kind: 'damage_all', amount: 10 }],
    exhaust: true,
  },
  g_g14: {
    id: 'g_g14',
    name: 'G-14 파열류탄',
    type: 'attack',
    rarity: 'uncommon',
    cost: 1,
    target: 'enemy',
    description: '8 데미지. 취약 +2.',
    effects: [
      { kind: 'damage', amount: 8 },
      { kind: 'apply_enemy', status: 'vulnerable', amount: 2 },
    ],
  },
  g_reinforce: {
    id: 'g_reinforce',
    name: '슈타이어 대전차포',
    type: 'power',
    rarity: 'uncommon',
    cost: 1,
    target: 'self',
    description: '힘 +2.',
    effects: [{ kind: 'apply_self', status: 'strength', amount: 2 }],
  },
  g_sparrow: {
    id: 'g_sparrow',
    name: 'RX-78 랜드러너',
    type: 'power',
    rarity: 'uncommon',
    cost: 1,
    target: 'self',
    description: '턴 종료 시 방어도 +3.',
    effects: [{ kind: 'apply_self', status: 'metallicize', amount: 3 }],
  },

  // ── Rare (1차 각성기) ──
  g_overheat: {
    id: 'g_overheat',
    name: '부스트 : 서프레스',
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
  g_mech_drop: {
    id: 'g_mech_drop',
    name: 'Ez-8 카운트다운',
    type: 'attack',
    rarity: 'rare',
    cost: 2,
    target: 'enemy',
    description: '26 데미지.',
    effects: [{ kind: 'damage', amount: 26 }],
  },
  g_arms_dealer: {
    id: 'g_arms_dealer',
    name: '뽑아치기',
    type: 'attack',
    rarity: 'rare',
    cost: 2,
    target: 'enemy',
    description: 'HP -5. 22 데미지.',
    effects: [
      { kind: 'lose_hp', amount: 5 },
      { kind: 'damage', amount: 22 },
    ],
    exhaust: true,
  },
  g_airstrike: {
    id: 'g_airstrike',
    name: '은탄',
    type: 'attack',
    rarity: 'rare',
    cost: 2,
    target: 'all_enemies',
    description: '모든 적에게 18 데미지.',
    effects: [{ kind: 'damage_all', amount: 18 }],
    exhaust: true,
  },
};

const GUNNER_UPGRADE_MAP: Record<string, Partial<CardDef>> = {
  g_rising_shot:    { name: '라이징 샷+',       description: '9 데미지.',                        effects: [{ kind: 'damage', amount: 9 }] },
  g_reload:         { name: '고각도 슬라이딩+',      description: '방어도 +8.',                       effects: [{ kind: 'block', amount: 8 }] },
  g_headshot:       { name: '더스트 샷+',           description: '10 데미지. 취약 +3.',              effects: [{ kind: 'damage', amount: 10 }, { kind: 'apply_enemy', status: 'vulnerable', amount: 3 }] },
  g_double_gunhawk: { name: '잭스파이크+',      description: '7 데미지를 두 번.',                effects: [{ kind: 'damage', amount: 7, times: 2 }] },
  g_western_fire:   { name: '마하킥+',    description: '모든 적에게 11 데미지.',           effects: [{ kind: 'damage_all', amount: 11 }] },
  g_frag:           { name: '윈드밀+',         description: '모든 적에게 7 데미지. 취약 +1.',   effects: [{ kind: 'damage_all', amount: 7 }, { kind: 'apply_all', status: 'vulnerable', amount: 1 }] },
  g_cannonball:     { name: 'M-137 개틀링건+',           description: '18 데미지.',                       effects: [{ kind: 'damage', amount: 18 }] },
  g_burst_fire:     { name: '퍼니셔+',        description: '10 데미지. 2장 드로우.',           effects: [{ kind: 'damage', amount: 10 }, { kind: 'draw', amount: 2 }] },
  g_barrage:        { name: '공중사격+',             description: '5 데미지를 세 번.',                effects: [{ kind: 'damage', amount: 5, times: 3 }] },
  g_smoke:          { name: '라이징 윈드밀+', description: '모든 적에게 약화 +3.',            effects: [{ kind: 'apply_all', status: 'weak', amount: 3 }] },
  g_booster:        { name: '패스티스트 건+',           description: '힘 +4.',                           effects: [{ kind: 'apply_self', status: 'strength', amount: 4 }] },
  g_reposit:        { name: '회심의 랜드러너+',      description: '방어도 +11. 1장 드로우.',          effects: [{ kind: 'block', amount: 11 }, { kind: 'draw', amount: 1 }] },
  g_ammo:           { name: '조준 사격+',        description: '2장 드로우. 무작위 카드 1장 소멸.',effects: [{ kind: 'draw', amount: 2 }, { kind: 'exhaust_random_hand' }] },
  g_armor:          { name: '냉동탄+',           description: '7 데미지. 빙결 +2. 소멸.',              effects: [{ kind: 'damage', amount: 7 }, { kind: 'apply_enemy', status: 'freeze', amount: 2 }] },
  g_satellite:      { name: '새틀라이트 빔+',           description: '모든 적에게 24 데미지. 약화 +3.',      effects: [{ kind: 'damage_all', amount: 24 }, { kind: 'apply_all', status: 'weak', amount: 3 }] },
  g_viper:          { name: '바베~큐+',                  description: '7 데미지. 중독 +7.',                   effects: [{ kind: 'damage', amount: 7 }, { kind: 'apply_enemy', status: 'poison', amount: 7 }] },
  g_optical:        { name: '슈타이어 중저격총+',       description: 'HP -2. 에너지 +3.',                    effects: [{ kind: 'lose_hp', amount: 2 }, { kind: 'energy', amount: 3 }] },
  g_napalm:         { name: 'M-3 화염방사기+',                description: '모든 적에게 14 데미지.',               effects: [{ kind: 'damage_all', amount: 14 }] },
  g_g14:            { name: 'G-14 파열류탄+',           description: '11 데미지. 취약 +3.',                  effects: [{ kind: 'damage', amount: 11 }, { kind: 'apply_enemy', status: 'vulnerable', amount: 3 }] },
  g_reinforce:      { name: '슈타이어 대전차포+',               description: '힘 +3.',                               effects: [{ kind: 'apply_self', status: 'strength', amount: 3 }] },
  g_sparrow:        { name: 'RX-78 랜드러너+',         description: '턴 종료 시 방어도 +4.',                effects: [{ kind: 'apply_self', status: 'metallicize', amount: 4 }] },
  g_overheat:       { name: '부스트 : 서프레스+',       description: '42 데미지. 취약 +3.',                  effects: [{ kind: 'damage', amount: 42 }, { kind: 'apply_enemy', status: 'vulnerable', amount: 3 }] },
  g_mech_drop:      { name: 'Ez-8 카운트다운+',           description: '34 데미지.',                           effects: [{ kind: 'damage', amount: 34 }] },
  g_arms_dealer:    { name: '뽑아치기+',       description: 'HP -3. 30 데미지.',                    effects: [{ kind: 'lose_hp', amount: 3 }, { kind: 'damage', amount: 30 }] },
  g_airstrike:      { name: '은탄+',   description: '모든 적에게 24 데미지.',               effects: [{ kind: 'damage_all', amount: 24 }] },
};

export function gunnerGetEffectiveDef(card: CardInstance): CardDef {
  const base = GUNNER_CARD_DEFS[card.defId];
  if (!card.upgraded) return base;
  const up = GUNNER_UPGRADE_MAP[card.defId];
  if (!up) return base;
  return { ...base, ...up };
}

export function canUpgradeGunner(card: CardInstance): boolean {
  return !card.upgraded && card.defId in GUNNER_UPGRADE_MAP;
}

const GUNNER_CARD_LIST = Object.values(GUNNER_CARD_DEFS);
export const GUNNER_COMMON_CARDS  = GUNNER_CARD_LIST.filter((c) => c.rarity === 'common');
export const GUNNER_UNCOMMON_CARDS = GUNNER_CARD_LIST.filter((c) => c.rarity === 'uncommon');
export const GUNNER_RARE_CARDS    = GUNNER_CARD_LIST.filter((c) => c.rarity === 'rare');
