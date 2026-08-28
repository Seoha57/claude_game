import type { CardDef, CardInstance } from '../types';

// 성직자 카드 정의
// 시그니처: 회복·재생, 콤보 타격, HP 코스트 강타, 디버프 정화
export const PRIEST_CARD_DEFS: Record<string, CardDef> = {
  // ── Starter ──
  p_smash: {
    id: 'p_smash',
    name: '강타',
    type: 'attack',
    rarity: 'starter',
    cost: 1,
    target: 'enemy',
    description: '6 데미지.',
    effects: [{ kind: 'damage', amount: 6 }],
  },
  p_holy_guard: {
    id: 'p_holy_guard',
    name: '신성 방어',
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
    name: '행운의 일격',
    type: 'attack',
    rarity: 'common',
    cost: 1,
    target: 'enemy',
    description: '8 데미지. 카드 1장 드로우.',
    effects: [{ kind: 'damage', amount: 8 }, { kind: 'draw', amount: 1 }],
  },
  p_slow_heal: {
    id: 'p_slow_heal',
    name: '서서히 치유',
    type: 'skill',
    rarity: 'common',
    cost: 1,
    target: 'self',
    description: '재생 +3.',
    effects: [{ kind: 'apply_self', status: 'regen', amount: 3 }],
  },
  p_cure: {
    id: 'p_cure',
    name: '치유',
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
    name: '봉황 추락',
    type: 'attack',
    rarity: 'common',
    cost: 2,
    target: 'enemy',
    description: '14 데미지. 적 방어도를 무시한다... 정도의 강타.',
    effects: [{ kind: 'damage', amount: 14 }],
  },
  p_gong_cham: {
    id: 'p_gong_cham',
    name: '허공 가르기',
    type: 'attack',
    rarity: 'common',
    cost: 1,
    target: 'enemy',
    description: '6 데미지 2회.',
    effects: [{ kind: 'damage', amount: 6, times: 2 }],
  },
  p_holy_chant: {
    id: 'p_holy_chant',
    name: '축복의 노래',
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
    name: '분노의 손아귀',
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
    name: '이중 올려치기',
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
    name: '용격',
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
    name: '파멸의 수호자',
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
    name: '신성 충전',
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
    name: '신성 결계',
    type: 'skill',
    rarity: 'uncommon',
    cost: 2,
    target: 'self',
    description: '모든 적에게 약화 +2. 재생 +3.',
    effects: [
      { kind: 'apply_all', status: 'weak', amount: 2 },
      { kind: 'apply_self', status: 'regen', amount: 3 },
    ],
  },
  p_grand_cross: {
    id: 'p_grand_cross',
    name: '대십자',
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
    name: '종말의 심판',
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
    name: '신벌',
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
    description: '12 회복. 재생 +4.',
    effects: [
      { kind: 'heal', amount: 12 },
      { kind: 'apply_self', status: 'regen', amount: 4 },
    ],
    exhaust: true,
  },
  p_immortal: {
    id: 'p_immortal',
    name: '불사',
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
    name: '궁극의 복수자',
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

  // ── 성직자 콤보 시너지 ─────────────────────────────────────
  p_blessed_blade: {
    id: 'p_blessed_blade',
    name: '축복의 칼날',
    type: 'attack',
    rarity: 'common',
    cost: 1,
    target: 'enemy',
    description: '8 데미지. 직전이 방어카드면 +6 데미지.',
    effects: [
      { kind: 'damage', amount: 8 },
      { kind: 'conditional', condition: { kind: 'after_type', type: 'skill' }, then: [{ kind: 'damage', amount: 6 }] },
    ],
  },
  p_meditation: {
    id: 'p_meditation',
    name: '묵상',
    type: 'skill',
    rarity: 'uncommon',
    cost: 0,
    target: 'self',
    description: '이번 턴 첫 카드면 에너지 +1, 1장 드로우. 소멸.',
    effects: [
      { kind: 'conditional', condition: { kind: 'first_this_turn' }, then: [
        { kind: 'energy', amount: 1 },
        { kind: 'draw', amount: 1 },
      ]},
    ],
    exhaust: true,
  },
  p_holy_avalanche: {
    id: 'p_holy_avalanche',
    name: '성스러운 사태',
    type: 'attack',
    rarity: 'rare',
    cost: 2,
    target: 'enemy',
    description: '데미지 = 3 × 이번 전투 누적 공격 수.',
    effects: [{ kind: 'damage_per_attack', amount: 3 }],
  },

  // ── 풀 확장 (성직자) ────────────────────────────────────
  p_holy_shield: {
    id: 'p_holy_shield',
    name: '신성한 방패',
    type: 'skill', rarity: 'common', cost: 1, target: 'self',
    description: '방어도 +8. 가시 +2.',
    effects: [
      { kind: 'block', amount: 8 },
      { kind: 'apply_self', status: 'thorns', amount: 2 },
    ],
  },
  p_faith_strike: {
    id: 'p_faith_strike',
    name: '신앙의 일격',
    type: 'attack', rarity: 'uncommon', cost: 1, target: 'enemy',
    description: '11 데미지. 직전이 공격이면 방어도 +6.',
    effects: [
      { kind: 'damage', amount: 11 },
      { kind: 'conditional', condition: { kind: 'after_type', type: 'attack' }, then: [{ kind: 'block', amount: 6 }] },
    ],
  },
  p_requiem: {
    id: 'p_requiem',
    name: '위령제',
    type: 'attack', rarity: 'uncommon', cost: 2, target: 'all_enemies',
    description: '모든 적에게 8 데미지. 약화 +2.',
    effects: [
      { kind: 'damage_all', amount: 8 },
      { kind: 'apply_all', status: 'weak', amount: 2 },
    ],
  },
  p_radiance: {
    id: 'p_radiance',
    name: '광휘',
    type: 'skill', rarity: 'uncommon', cost: 1, target: 'self',
    description: '모든 적에게 빙결 +1. 1장 드로우.',
    effects: [
      { kind: 'apply_all', status: 'freeze', amount: 1 },
      { kind: 'draw', amount: 1 },
    ],
  },
  p_wrath_of_god: {
    id: 'p_wrath_of_god',
    name: '신의 진노',
    type: 'attack', rarity: 'rare', cost: 3, target: 'all_enemies',
    description: '모든 적에게 24 데미지. 소멸.',
    effects: [{ kind: 'damage_all', amount: 24 }],
    exhaust: true,
  },

  // ── 풀 균형 (성직자 common +2) ──────────────────────────
  p_prayer: {
    id: 'p_prayer',
    name: '기도',
    type: 'skill', rarity: 'common', cost: 1, target: 'self',
    description: '8 회복. 1장 드로우.',
    effects: [
      { kind: 'heal', amount: 8 },
      { kind: 'draw', amount: 1 },
    ],
  },
  p_smite: {
    id: 'p_smite',
    name: '응징',
    type: 'attack', rarity: 'common', cost: 1, target: 'enemy',
    description: '7 데미지. 취약 +1.',
    effects: [
      { kind: 'damage', amount: 7 },
      { kind: 'apply_enemy', status: 'vulnerable', amount: 1 },
    ],
  },
};

// ── Upgrade map ──
export const PRIEST_UPGRADE_MAP: Record<string, Partial<CardDef>> = {
  p_smash:             { name: '강타+',          description: '9 데미지.',                              effects: [{ kind: 'damage', amount: 9 }] },
  p_holy_guard:        { name: '신성 방어+',       description: '방어도 +8.',                             effects: [{ kind: 'block', amount: 8 }] },
  p_lucky_strike:      { name: '행운의 일격+', description: '11 데미지. 1장 드로우.',                 effects: [{ kind: 'damage', amount: 11 }, { kind: 'draw', amount: 1 }] },
  p_slow_heal:         { name: '서서히 치유+',       description: '재생 +4.',                               effects: [{ kind: 'apply_self', status: 'regen', amount: 4 }] },
  p_cure:              { name: '치유+',            description: '방어도 +8. 12 회복.',                    effects: [{ kind: 'block', amount: 8 }, { kind: 'heal', amount: 12 }] },
  p_pure_blade:        { name: '순백의 칼날+',     description: '12 데미지. 취약 +2.',                    effects: [{ kind: 'damage', amount: 12 }, { kind: 'apply_enemy', status: 'vulnerable', amount: 2 }] },
  p_falling_phoenix:   { name: '봉황 추락+',          description: '19 데미지.',                             effects: [{ kind: 'damage', amount: 19 }] },
  p_gong_cham:         { name: '허공 가르기+',          description: '8 데미지 2회.',                          effects: [{ kind: 'damage', amount: 8, times: 2 }] },
  p_holy_chant:        { name: '축복의 노래+',            description: '힘 +2. 1장 드로우.',                     effects: [{ kind: 'apply_self', status: 'strength', amount: 2 }, { kind: 'draw', amount: 1 }] },
  p_rage_grip:         { name: '분노의 손아귀+',   description: 'HP -3. 19 데미지.',                      effects: [{ kind: 'lose_hp', amount: 3 }, { kind: 'damage', amount: 19 }] },
  p_second_upper:      { name: '이중 올려치기+',     description: '10 데미지. 약화 +2.',                    effects: [{ kind: 'damage', amount: 10 }, { kind: 'apply_enemy', status: 'weak', amount: 2 }] },
  p_dragon_punch:      { name: '용격+',          description: '7 데미지 3회.',                          effects: [{ kind: 'damage', amount: 7, times: 3 }] },
  p_holy_water:        { name: '성수+',            description: '16 회복. 방어도 +10.',                   effects: [{ kind: 'heal', amount: 16 }, { kind: 'block', amount: 10 }] },
  p_punishment:        { name: '징벌+',            description: '24 데미지. 약화 +3.',                    effects: [{ kind: 'damage', amount: 24 }, { kind: 'apply_enemy', status: 'weak', amount: 3 }] },
  p_doom_guardian:     { name: '파멸의 수호자+',      description: '방어도 +16. 가시 +5.',                   effects: [{ kind: 'block', amount: 16 }, { kind: 'apply_self', status: 'thorns', amount: 5 }] },
  p_victory_spear:     { name: '승리의 창+',       description: '30 데미지. 사용할 때마다 영구 데미지 +3.', effects: [{ kind: 'damage', amount: 30 }], scaling: { kind: 'on_play', amount: 3 } },
  p_holy_charge:       { name: '신성 충전+',       description: '에너지 +1. 2장 드로우.',                 effects: [{ kind: 'energy', amount: 1 }, { kind: 'draw', amount: 2 }] },
  p_holy_sanctuary:    { name: '신성 결계+',   description: '모든 적에게 약화 +3. 재생 +5.',          effects: [{ kind: 'apply_all', status: 'weak', amount: 3 }, { kind: 'apply_self', status: 'regen', amount: 5 }] },
  p_grand_cross:       { name: '대십자+',   description: '모든 적에게 15 데미지.',                 effects: [{ kind: 'damage_all', amount: 15 }] },
  p_painful_joy:       { name: '고통의 희열+',     description: 'HP -4. 힘 +4.',                          effects: [{ kind: 'lose_hp', amount: 4 }, { kind: 'apply_self', status: 'strength', amount: 4 }] },
  p_apocalypse:        { name: '종말의 심판+',      description: '40 데미지. 처치 시 영구 데미지 +5.',     effects: [{ kind: 'damage', amount: 40 }], scaling: { kind: 'on_kill', amount: 5 } },
  p_divine_punishment: { name: '신벌+', description: '모든 적에게 18 데미지. 화상 +4.',     effects: [{ kind: 'damage_all', amount: 18 }, { kind: 'apply_all', status: 'burn', amount: 4 }] },
  p_holy_judgment:     { name: '신성의 심판+',     description: '18 회복. 재생 +6.',                     effects: [{ kind: 'heal', amount: 18 }, { kind: 'apply_self', status: 'regen', amount: 6 }] },
  p_immortal:          { name: '불사+',          description: '턴 시작 시 힘 +3. 선천.',                effects: [{ kind: 'apply_self', status: 'ritual', amount: 3 }] },
  p_true_avenger:      { name: '궁극의 복수자+',       description: 'HP -6. 힘 +3. 민첩 +2.',                 effects: [{ kind: 'lose_hp', amount: 6 }, { kind: 'apply_self', status: 'strength', amount: 3 }, { kind: 'apply_self', status: 'dexterity', amount: 2 }] },
  // 콤보 시너지
  p_blessed_blade:     { name: '축복의 칼날+',     description: '11 데미지. 직전이 방어카드면 +9 데미지.',
                          effects: [{ kind: 'damage', amount: 11 }, { kind: 'conditional', condition: { kind: 'after_type', type: 'skill' }, then: [{ kind: 'damage', amount: 9 }] }] },
  p_meditation:        { name: '묵상+',            description: '이번 턴 첫 카드면 에너지 +1, 2장 드로우. 소멸.',
                          effects: [{ kind: 'conditional', condition: { kind: 'first_this_turn' }, then: [{ kind: 'energy', amount: 1 }, { kind: 'draw', amount: 2 }] }] },
  p_holy_avalanche:    { name: '성스러운 사태+',   description: '데미지 = 4 × 이번 전투 누적 공격 수.',
                          effects: [{ kind: 'damage_per_attack', amount: 4 }] },
  // 풀 확장
  p_holy_shield:       { name: '신성한 방패+',   description: '방어도 +11. 가시 +3.',                    effects: [{ kind: 'block', amount: 11 }, { kind: 'apply_self', status: 'thorns', amount: 3 }] },
  p_faith_strike:      { name: '신앙의 일격+',   description: '15 데미지. 직전이 공격이면 방어도 +8.',
                          effects: [{ kind: 'damage', amount: 15 }, { kind: 'conditional', condition: { kind: 'after_type', type: 'attack' }, then: [{ kind: 'block', amount: 8 }] }] },
  p_requiem:           { name: '위령제+',        description: '모든 적에게 11 데미지. 약화 +3.',         effects: [{ kind: 'damage_all', amount: 11 }, { kind: 'apply_all', status: 'weak', amount: 3 }] },
  p_radiance:          { name: '광휘+',          description: '모든 적에게 빙결 +2. 2장 드로우.',         effects: [{ kind: 'apply_all', status: 'freeze', amount: 2 }, { kind: 'draw', amount: 2 }] },
  p_wrath_of_god:      { name: '신의 진노+',     description: '모든 적에게 32 데미지. 소멸.',            effects: [{ kind: 'damage_all', amount: 32 }] },
  p_prayer:            { name: '기도+',          description: '12 회복. 1장 드로우.',                    effects: [{ kind: 'heal', amount: 12 }, { kind: 'draw', amount: 1 }] },
  p_smite:             { name: '응징+',          description: '10 데미지. 취약 +2.',                     effects: [{ kind: 'damage', amount: 10 }, { kind: 'apply_enemy', status: 'vulnerable', amount: 2 }] },
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
