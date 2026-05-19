import type { CardDef, CardInstance } from '../types';

// 던파 프리스트(남) 4계열 — 크루세이더 / 인파이터 / 퇴마사 / 어벤저
// 시그니처: 회복·재생, 콤보 타격, HP 코스트 강타, 디버프 정화
export const PRIEST_CARD_DEFS: Record<string, CardDef> = {
  // ── Starter ──
  p_smash: {
    id: 'p_smash',
    name: '스매셔',
    type: 'attack',
    rarity: 'starter',
    cost: 1,
    target: 'enemy',
    description: '6 데미지.',
    effects: [{ kind: 'damage', amount: 6 }],
  },
  p_holy_guard: {
    id: 'p_holy_guard',
    name: '홀리 가드',
    type: 'skill',
    rarity: 'starter',
    cost: 1,
    target: 'self',
    description: '방어도 +5.',
    effects: [{ kind: 'block', amount: 5 }],
  },

  // ── Common ──
  p_lucky_strike: {
    id: 'p_lucky_strike',
    name: '럭키 스트레이트',
    type: 'attack',
    rarity: 'common',
    cost: 1,
    target: 'enemy',
    description: '8 데미지. 카드 1장 드로우.',
    effects: [{ kind: 'damage', amount: 8 }, { kind: 'draw', amount: 1 }],
  },
  p_slow_heal: {
    id: 'p_slow_heal',
    name: '슬로우 힐',
    type: 'skill',
    rarity: 'common',
    cost: 1,
    target: 'self',
    description: '재생 +4.',
    effects: [{ kind: 'apply_self', status: 'regen', amount: 4 }],
  },
  p_cure: {
    id: 'p_cure',
    name: '큐어',
    type: 'skill',
    rarity: 'common',
    cost: 1,
    target: 'self',
    description: '방어도 +6. 8 회복.',
    effects: [
      { kind: 'block', amount: 6 },
      { kind: 'heal', amount: 8 },
    ],
  },
  p_pure_blade: {
    id: 'p_pure_blade',
    name: '순백의 칼날',
    type: 'attack',
    rarity: 'common',
    cost: 1,
    target: 'enemy',
    description: '9 데미지. 취약 +1.',
    effects: [
      { kind: 'damage', amount: 9 },
      { kind: 'apply_enemy', status: 'vulnerable', amount: 1 },
    ],
  },
  p_falling_phoenix: {
    id: 'p_falling_phoenix',
    name: '낙봉추',
    type: 'attack',
    rarity: 'common',
    cost: 2,
    target: 'enemy',
    description: '14 데미지. 적 방어도를 무시한다... 정도의 강타.',
    effects: [{ kind: 'damage', amount: 14 }],
  },
  p_gong_cham: {
    id: 'p_gong_cham',
    name: '공참타',
    type: 'attack',
    rarity: 'common',
    cost: 1,
    target: 'enemy',
    description: '6 데미지 2회.',
    effects: [{ kind: 'damage', amount: 6, times: 2 }],
  },
  p_holy_chant: {
    id: 'p_holy_chant',
    name: '성가',
    type: 'skill',
    rarity: 'common',
    cost: 1,
    target: 'self',
    description: '힘 +1. 1장 드로우.',
    effects: [
      { kind: 'apply_self', status: 'strength', amount: 1 },
      { kind: 'draw', amount: 1 },
    ],
  },
  p_rage_grip: {
    id: 'p_rage_grip',
    name: '분노의 움켜쥠',
    type: 'attack',
    rarity: 'common',
    cost: 1,
    target: 'enemy',
    description: 'HP -3. 14 데미지.',
    effects: [
      { kind: 'lose_hp', amount: 3 },
      { kind: 'damage', amount: 14 },
    ],
  },
  p_second_upper: {
    id: 'p_second_upper',
    name: '세컨드 어퍼',
    type: 'attack',
    rarity: 'common',
    cost: 1,
    target: 'enemy',
    description: '7 데미지. 약화 +1.',
    effects: [
      { kind: 'damage', amount: 7 },
      { kind: 'apply_enemy', status: 'weak', amount: 1 },
    ],
  },

  // ── Uncommon ──
  p_dragon_punch: {
    id: 'p_dragon_punch',
    name: '창룡격',
    type: 'attack',
    rarity: 'uncommon',
    cost: 2,
    target: 'enemy',
    description: '6 데미지 3회.',
    effects: [{ kind: 'damage', amount: 6, times: 3 }],
  },
  p_holy_water: {
    id: 'p_holy_water',
    name: '성수',
    type: 'skill',
    rarity: 'uncommon',
    cost: 1,
    target: 'self',
    description: '12 회복. 방어도 +8.',
    effects: [
      { kind: 'heal', amount: 12 },
      { kind: 'block', amount: 8 },
    ],
  },
  p_punishment: {
    id: 'p_punishment',
    name: '징벌',
    type: 'attack',
    rarity: 'uncommon',
    cost: 2,
    target: 'enemy',
    description: '18 데미지. 약화 +2.',
    effects: [
      { kind: 'damage', amount: 18 },
      { kind: 'apply_enemy', status: 'weak', amount: 2 },
    ],
  },
  p_doom_guardian: {
    id: 'p_doom_guardian',
    name: '둠스가디언',
    type: 'skill',
    rarity: 'uncommon',
    cost: 1,
    target: 'self',
    description: '방어도 +12. 가시 +3.',
    effects: [
      { kind: 'block', amount: 12 },
      { kind: 'apply_self', status: 'thorns', amount: 3 },
    ],
  },
  p_victory_spear: {
    id: 'p_victory_spear',
    name: '승리의 창',
    type: 'attack',
    rarity: 'uncommon',
    cost: 2,
    target: 'enemy',
    description: '22 데미지. 사용할 때마다 영구 데미지 +2.',
    effects: [{ kind: 'damage', amount: 22 }],
    scaling: { kind: 'on_play', amount: 2 },
  },
  p_holy_charge: {
    id: 'p_holy_charge',
    name: '홀리 차지',
    type: 'skill',
    rarity: 'uncommon',
    cost: 0,
    target: 'self',
    description: '에너지 +1. 1장 드로우.',
    effects: [
      { kind: 'energy', amount: 1 },
      { kind: 'draw', amount: 1 },
    ],
    exhaust: true,
  },
  p_holy_sanctuary: {
    id: 'p_holy_sanctuary',
    name: '홀리 생츄어리',
    type: 'skill',
    rarity: 'uncommon',
    cost: 2,
    target: 'self',
    description: '모든 적에게 약화 +2. 재생 +5.',
    effects: [
      { kind: 'apply_all', status: 'weak', amount: 2 },
      { kind: 'apply_self', status: 'regen', amount: 5 },
    ],
  },
  p_grand_cross: {
    id: 'p_grand_cross',
    name: '그랜드 크로스',
    type: 'attack',
    rarity: 'uncommon',
    cost: 2,
    target: 'all_enemies',
    description: '모든 적에게 11 데미지.',
    effects: [{ kind: 'damage_all', amount: 11 }],
  },
  p_painful_joy: {
    id: 'p_painful_joy',
    name: '고통의 희열',
    type: 'power',
    rarity: 'uncommon',
    cost: 2,
    target: 'self',
    description: 'HP -6. 힘 +3.',
    effects: [
      { kind: 'lose_hp', amount: 6 },
      { kind: 'apply_self', status: 'strength', amount: 3 },
    ],
  },

  // ── Rare ──
  p_apocalypse: {
    id: 'p_apocalypse',
    name: '아포칼립스',
    type: 'attack',
    rarity: 'rare',
    cost: 3,
    target: 'enemy',
    description: '32 데미지. 처치 시 영구 데미지 +4.',
    effects: [{ kind: 'damage', amount: 32 }],
    exhaust: true,
    scaling: { kind: 'on_kill', amount: 4 },
  },
  p_divine_punishment: {
    id: 'p_divine_punishment',
    name: '디바인 퍼니쉬먼트',
    type: 'attack',
    rarity: 'rare',
    cost: 2,
    target: 'all_enemies',
    description: '모든 적에게 14 데미지. 화상 +3.',
    effects: [
      { kind: 'damage_all', amount: 14 },
      { kind: 'apply_all', status: 'burn', amount: 3 },
    ],
  },
  p_holy_judgment: {
    id: 'p_holy_judgment',
    name: '신성의 심판',
    type: 'skill',
    rarity: 'rare',
    cost: 2,
    target: 'self',
    description: '20 회복. 카드 1장 강화 (이번 전투 한정 효과는 영구).',
    effects: [
      { kind: 'heal', amount: 20 },
      { kind: 'apply_self', status: 'regen', amount: 8 },
    ],
    exhaust: true,
  },
  p_immortal: {
    id: 'p_immortal',
    name: '이모탈',
    type: 'power',
    rarity: 'rare',
    cost: 2,
    target: 'self',
    description: '턴 시작 시 힘 +2. 선천.',
    effects: [{ kind: 'apply_self', status: 'ritual', amount: 2 }],
    innate: true,
  },
  p_true_avenger: {
    id: 'p_true_avenger',
    name: '진 어벤저',
    type: 'power',
    rarity: 'rare',
    cost: 1,
    target: 'self',
    description: 'HP -8. 힘 +3. 민첩 +2.',
    effects: [
      { kind: 'lose_hp', amount: 8 },
      { kind: 'apply_self', status: 'strength', amount: 3 },
      { kind: 'apply_self', status: 'dexterity', amount: 2 },
    ],
  },
};

// ── Upgrade map ──
export const PRIEST_UPGRADE_MAP: Record<string, Partial<CardDef>> = {
  p_smash:             { name: '스매셔+',          description: '9 데미지.',                              effects: [{ kind: 'damage', amount: 9 }] },
  p_holy_guard:        { name: '홀리 가드+',       description: '방어도 +8.',                             effects: [{ kind: 'block', amount: 8 }] },
  p_lucky_strike:      { name: '럭키 스트레이트+', description: '11 데미지. 1장 드로우.',                 effects: [{ kind: 'damage', amount: 11 }, { kind: 'draw', amount: 1 }] },
  p_slow_heal:         { name: '슬로우 힐+',       description: '재생 +6.',                               effects: [{ kind: 'apply_self', status: 'regen', amount: 6 }] },
  p_cure:              { name: '큐어+',            description: '방어도 +8. 12 회복.',                    effects: [{ kind: 'block', amount: 8 }, { kind: 'heal', amount: 12 }] },
  p_pure_blade:        { name: '순백의 칼날+',     description: '12 데미지. 취약 +2.',                    effects: [{ kind: 'damage', amount: 12 }, { kind: 'apply_enemy', status: 'vulnerable', amount: 2 }] },
  p_falling_phoenix:   { name: '낙봉추+',          description: '19 데미지.',                             effects: [{ kind: 'damage', amount: 19 }] },
  p_gong_cham:         { name: '공참타+',          description: '8 데미지 2회.',                          effects: [{ kind: 'damage', amount: 8, times: 2 }] },
  p_holy_chant:        { name: '성가+',            description: '힘 +2. 1장 드로우.',                     effects: [{ kind: 'apply_self', status: 'strength', amount: 2 }, { kind: 'draw', amount: 1 }] },
  p_rage_grip:         { name: '분노의 움켜쥠+',   description: 'HP -3. 19 데미지.',                      effects: [{ kind: 'lose_hp', amount: 3 }, { kind: 'damage', amount: 19 }] },
  p_second_upper:      { name: '세컨드 어퍼+',     description: '10 데미지. 약화 +2.',                    effects: [{ kind: 'damage', amount: 10 }, { kind: 'apply_enemy', status: 'weak', amount: 2 }] },
  p_dragon_punch:      { name: '창룡격+',          description: '7 데미지 3회.',                          effects: [{ kind: 'damage', amount: 7, times: 3 }] },
  p_holy_water:        { name: '성수+',            description: '16 회복. 방어도 +10.',                   effects: [{ kind: 'heal', amount: 16 }, { kind: 'block', amount: 10 }] },
  p_punishment:        { name: '징벌+',            description: '24 데미지. 약화 +3.',                    effects: [{ kind: 'damage', amount: 24 }, { kind: 'apply_enemy', status: 'weak', amount: 3 }] },
  p_doom_guardian:     { name: '둠스가디언+',      description: '방어도 +16. 가시 +5.',                   effects: [{ kind: 'block', amount: 16 }, { kind: 'apply_self', status: 'thorns', amount: 5 }] },
  p_victory_spear:     { name: '승리의 창+',       description: '30 데미지. 사용할 때마다 영구 데미지 +3.', effects: [{ kind: 'damage', amount: 30 }] },
  p_holy_charge:       { name: '홀리 차지+',       description: '에너지 +1. 2장 드로우.',                 effects: [{ kind: 'energy', amount: 1 }, { kind: 'draw', amount: 2 }] },
  p_holy_sanctuary:    { name: '홀리 생츄어리+',   description: '모든 적에게 약화 +3. 재생 +8.',          effects: [{ kind: 'apply_all', status: 'weak', amount: 3 }, { kind: 'apply_self', status: 'regen', amount: 8 }] },
  p_grand_cross:       { name: '그랜드 크로스+',   description: '모든 적에게 15 데미지.',                 effects: [{ kind: 'damage_all', amount: 15 }] },
  p_painful_joy:       { name: '고통의 희열+',     description: 'HP -4. 힘 +4.',                          effects: [{ kind: 'lose_hp', amount: 4 }, { kind: 'apply_self', status: 'strength', amount: 4 }] },
  p_apocalypse:        { name: '아포칼립스+',      description: '40 데미지. 처치 시 영구 데미지 +5.',     effects: [{ kind: 'damage', amount: 40 }] },
  p_divine_punishment: { name: '디바인 퍼니쉬먼트+', description: '모든 적에게 18 데미지. 화상 +4.',     effects: [{ kind: 'damage_all', amount: 18 }, { kind: 'apply_all', status: 'burn', amount: 4 }] },
  p_holy_judgment:     { name: '신성의 심판+',     description: '28 회복. 재생 +10.',                     effects: [{ kind: 'heal', amount: 28 }, { kind: 'apply_self', status: 'regen', amount: 10 }] },
  p_immortal:          { name: '이모탈+',          description: '턴 시작 시 힘 +3. 선천.',                effects: [{ kind: 'apply_self', status: 'ritual', amount: 3 }] },
  p_true_avenger:      { name: '진 어벤저+',       description: 'HP -6. 힘 +3. 민첩 +2.',                 effects: [{ kind: 'lose_hp', amount: 6 }, { kind: 'apply_self', status: 'strength', amount: 3 }, { kind: 'apply_self', status: 'dexterity', amount: 2 }] },
};

export function priestGetEffectiveDef(card: CardInstance): CardDef {
  const base = PRIEST_CARD_DEFS[card.defId];
  if (!card.upgraded) return base;
  const up = PRIEST_UPGRADE_MAP[card.defId];
  return up ? { ...base, ...up } : base;
}

export function canUpgradePriest(card: CardInstance): boolean {
  return (card.upgraded ?? 0) < 2 && card.defId in PRIEST_UPGRADE_MAP;
}

const PRIEST_CARD_LIST = Object.values(PRIEST_CARD_DEFS);
export const PRIEST_COMMON_CARDS   = PRIEST_CARD_LIST.filter((c) => c.rarity === 'common');
export const PRIEST_UNCOMMON_CARDS = PRIEST_CARD_LIST.filter((c) => c.rarity === 'uncommon');
export const PRIEST_RARE_CARDS     = PRIEST_CARD_LIST.filter((c) => c.rarity === 'rare');
