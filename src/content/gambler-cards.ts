import type { CardDef, CardInstance } from '../types';

export const GAMBLER_CARD_DEFS: Record<string, CardDef> = {
  // ── Starter ──
  b_dice_throw: {
    id: 'b_dice_throw',
    name: '주사위 투척',
    type: 'attack',
    rarity: 'starter',
    cost: 1,
    target: 'enemy',
    description: '2 × 🎲 데미지.',
    effects: [{ kind: 'damage_dice', base: 2 }],
  },
  b_bluff: {
    id: 'b_bluff',
    name: '블러프',
    type: 'skill',
    rarity: 'starter',
    cost: 1,
    target: 'self',
    description: '2 × 🎲 방어도.',
    effects: [{ kind: 'block_dice', base: 2 }],
  },

  // ── Common ──
  b_coin_toss: {
    id: 'b_coin_toss',
    name: '동전 던지기',
    type: 'attack',
    rarity: 'common',
    cost: 1,
    target: 'enemy',
    description: '2 × 🎲 데미지를 두 번.',
    effects: [{ kind: 'damage_dice', base: 2, times: 2 }],
  },
  b_wild_card: {
    id: 'b_wild_card',
    name: '와일드 카드',
    type: 'attack',
    rarity: 'common',
    cost: 1,
    target: 'enemy',
    description: '4 × 🎲 데미지.',
    effects: [{ kind: 'damage_dice', base: 4 }],
  },
  b_poker_face: {
    id: 'b_poker_face',
    name: '포커 페이스',
    type: 'skill',
    rarity: 'common',
    cost: 1,
    target: 'self',
    description: '3 × 🎲 방어도. 1장 드로우.',
    effects: [
      { kind: 'block_dice', base: 3 },
      { kind: 'draw', amount: 1 },
    ],
  },
  b_lucky_draw: {
    id: 'b_lucky_draw',
    name: '행운의 드로우',
    type: 'skill',
    rarity: 'common',
    cost: 0,
    target: 'self',
    description: '2장 드로우.',
    effects: [{ kind: 'draw', amount: 2 }],
  },
  b_ante_up: {
    id: 'b_ante_up',
    name: '판돈 올리기',
    type: 'skill',
    rarity: 'common',
    cost: 0,
    target: 'self',
    description: '힘 +2.',
    effects: [{ kind: 'apply_self', status: 'strength', amount: 2 }],
  },
  b_chip_shot: {
    id: 'b_chip_shot',
    name: '칩 샷',
    type: 'attack',
    rarity: 'common',
    cost: 1,
    target: 'all_enemies',
    description: '모든 적에게 3 × 🎲 데미지.',
    effects: [{ kind: 'damage_all_dice', base: 3 }],
  },
  b_hustle: {
    id: 'b_hustle',
    name: '허슬',
    type: 'attack',
    rarity: 'common',
    cost: 1,
    target: 'enemy',
    description: '2 × 🎲 데미지. 약화 +1.',
    effects: [
      { kind: 'damage_dice', base: 2 },
      { kind: 'apply_enemy', status: 'weak', amount: 1 },
    ],
  },
  b_card_trick: {
    id: 'b_card_trick',
    name: '카드 트릭',
    type: 'skill',
    rarity: 'common',
    cost: 1,
    target: 'self',
    description: '3 × 🎲 방어도. 무작위 카드 1장 소멸.',
    effects: [
      { kind: 'block_dice', base: 3 },
      { kind: 'exhaust_random_hand' },
    ],
  },
  b_snake_eyes: {
    id: 'b_snake_eyes',
    name: '스네이크 아이즈',
    type: 'attack',
    rarity: 'common',
    cost: 1,
    target: 'enemy',
    description: '3 × 🎲 데미지. 이번 턴 첫 카드면 +3 × 🎲.',
    effects: [
      { kind: 'damage_dice', base: 3 },
      { kind: 'conditional', condition: { kind: 'first_this_turn' }, then: [{ kind: 'damage_dice', base: 3 }] },
    ],
  },

  // ── Uncommon ──
  b_double_down: {
    id: 'b_double_down',
    name: '더블 다운',
    type: 'attack',
    rarity: 'uncommon',
    cost: 2,
    target: 'enemy',
    description: '3 × 🎲 데미지 3회.',
    effects: [{ kind: 'damage_dice', base: 3, times: 3 }],
  },
  b_loaded_dice: {
    id: 'b_loaded_dice',
    name: '세공 주사위',
    type: 'power',
    rarity: 'uncommon',
    cost: 1,
    target: 'self',
    description: '주사위가 1이면 다시 굴림.',
    effects: [{ kind: 'set_dice_reroll' }],
  },
  b_sleight: {
    id: 'b_sleight',
    name: '슬라이트 오브 핸드',
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
  b_high_roller: {
    id: 'b_high_roller',
    name: '하이 롤러',
    type: 'attack',
    rarity: 'uncommon',
    cost: 1,
    target: 'enemy',
    description: '5 × 🎲 데미지. 취약 +1.',
    effects: [
      { kind: 'damage_dice', base: 5 },
      { kind: 'apply_enemy', status: 'vulnerable', amount: 1 },
    ],
  },
  b_insurance: {
    id: 'b_insurance',
    name: '보험',
    type: 'skill',
    rarity: 'uncommon',
    cost: 1,
    target: 'self',
    description: '5 × 🎲 방어도.',
    effects: [{ kind: 'block_dice', base: 5 }],
  },
  b_jackpot: {
    id: 'b_jackpot',
    name: '잭팟',
    type: 'power',
    rarity: 'uncommon',
    cost: 1,
    target: 'self',
    description: '턴 종료 시 방어도 +3.',
    effects: [{ kind: 'apply_self', status: 'metallicize', amount: 3 }],
  },
  b_marked_card: {
    id: 'b_marked_card',
    name: '마킹된 카드',
    type: 'attack',
    rarity: 'uncommon',
    cost: 1,
    target: 'enemy',
    description: '8 데미지. 사용할 때마다 영구 데미지 +2.',
    effects: [{ kind: 'damage', amount: 8 }],
    scaling: { kind: 'on_play', amount: 2 },
  },
  b_card_count: {
    id: 'b_card_count',
    name: '카드 카운팅',
    type: 'skill',
    rarity: 'uncommon',
    cost: 0,
    target: 'self',
    description: '2 × 🎲 재생.',
    effects: [{ kind: 'apply_self_dice', status: 'regen', base: 2 }],
  },
  b_poison_bet: {
    id: 'b_poison_bet',
    name: '독배 내기',
    type: 'attack',
    rarity: 'uncommon',
    cost: 1,
    target: 'enemy',
    description: '3 × 🎲 데미지. 2 × 🎲 중독.',
    effects: [
      { kind: 'damage_dice', base: 3 },
      { kind: 'apply_enemy_dice', status: 'poison', base: 2 },
    ],
  },
  b_cold_bluff: {
    id: 'b_cold_bluff',
    name: '콜드 블러프',
    type: 'attack',
    rarity: 'uncommon',
    cost: 2,
    target: 'enemy',
    description: '5 × 🎲 데미지. 빙결 +1.',
    effects: [
      { kind: 'damage_dice', base: 5 },
      { kind: 'apply_enemy', status: 'freeze', amount: 1 },
    ],
  },
  b_follow_up: {
    id: 'b_follow_up',
    name: '후속 베팅',
    type: 'attack',
    rarity: 'uncommon',
    cost: 1,
    target: 'enemy',
    description: '3 × 🎲 데미지. 직전이 공격이면 +3 × 🎲.',
    effects: [
      { kind: 'damage_dice', base: 3 },
      { kind: 'conditional', condition: { kind: 'after_type', type: 'attack' }, then: [{ kind: 'damage_dice', base: 3 }] },
    ],
  },

  // ── Rare ──
  b_all_in: {
    id: 'b_all_in',
    name: '올인',
    type: 'attack',
    rarity: 'rare',
    cost: 3,
    target: 'enemy',
    description: '10 × 🎲 데미지. 취약 +2. 다음 턴 🎲 → 5.',
    effects: [
      { kind: 'damage_dice', base: 10 },
      { kind: 'apply_enemy', status: 'vulnerable', amount: 2 },
      { kind: 'fix_dice', value: 5 },
    ],
  },
  b_royal_flush: {
    id: 'b_royal_flush',
    name: '로열 플러시',
    type: 'attack',
    rarity: 'rare',
    cost: 2,
    target: 'enemy',
    description: '7 × 🎲 데미지 2회. 다음 턴 🎲 → 6. 소멸.',
    effects: [
      { kind: 'damage_dice', base: 7, times: 2 },
      { kind: 'fix_dice', value: 6 },
    ],
    exhaust: true,
  },
  b_fortune: {
    id: 'b_fortune',
    name: '포춘',
    type: 'power',
    rarity: 'rare',
    cost: 2,
    target: 'self',
    description: '턴 시작 시 힘 +2. 선천.',
    effects: [{ kind: 'apply_self', status: 'ritual', amount: 2 }],
    innate: true,
  },
  b_death_match: {
    id: 'b_death_match',
    name: '데스 매치',
    type: 'attack',
    rarity: 'rare',
    cost: 2,
    target: 'enemy',
    description: 'HP -4. 8 × 🎲 데미지.',
    effects: [
      { kind: 'lose_hp', amount: 4 },
      { kind: 'damage_dice', base: 8 },
    ],
    exhaust: true,
  },
  b_last_stand: {
    id: 'b_last_stand',
    name: '라스트 스탠드',
    type: 'attack',
    rarity: 'rare',
    cost: 2,
    target: 'enemy',
    description: '데미지 = 4 × 이번 턴 사용한 카드 수. 소멸.',
    effects: [{ kind: 'damage_per_card_this_turn', amount: 4 }],
    exhaust: true,
  },
};

const GAMBLER_UPGRADE_MAP: Record<string, Partial<CardDef>> = {
  b_dice_throw:   { name: '주사위 투척+',     description: '3 × 🎲 데미지.',                                            effects: [{ kind: 'damage_dice', base: 3 }] },
  b_bluff:        { name: '블러프+',          description: '3 × 🎲 방어도.',                                            effects: [{ kind: 'block_dice', base: 3 }] },
  b_coin_toss:    { name: '동전 던지기+',     description: '3 × 🎲 데미지를 두 번.',                                    effects: [{ kind: 'damage_dice', base: 3, times: 2 }] },
  b_wild_card:    { name: '와일드 카드+',     description: '5 × 🎲 데미지.',                                            effects: [{ kind: 'damage_dice', base: 5 }] },
  b_poker_face:   { name: '포커 페이스+',     description: '4 × 🎲 방어도. 1장 드로우.',                                effects: [{ kind: 'block_dice', base: 4 }, { kind: 'draw', amount: 1 }] },
  b_lucky_draw:   { name: '행운의 드로우+',   description: '3장 드로우.',                                              effects: [{ kind: 'draw', amount: 3 }] },
  b_ante_up:      { name: '판돈 올리기+',     description: '힘 +4.',                                                    effects: [{ kind: 'apply_self', status: 'strength', amount: 4 }] },
  b_chip_shot:    { name: '칩 샷+',           description: '모든 적에게 4 × 🎲 데미지.',                                effects: [{ kind: 'damage_all_dice', base: 4 }] },
  b_hustle:       { name: '허슬+',            description: '3 × 🎲 데미지. 약화 +2.',                                  effects: [{ kind: 'damage_dice', base: 3 }, { kind: 'apply_enemy', status: 'weak', amount: 2 }] },
  b_card_trick:   { name: '카드 트릭+',       description: '4 × 🎲 방어도. 무작위 카드 1장 소멸.',                      effects: [{ kind: 'block_dice', base: 4 }, { kind: 'exhaust_random_hand' }] },
  b_snake_eyes:   { name: '스네이크 아이즈+', description: '4 × 🎲 데미지. 이번 턴 첫 카드면 +4 × 🎲.',               effects: [{ kind: 'damage_dice', base: 4 }, { kind: 'conditional', condition: { kind: 'first_this_turn' }, then: [{ kind: 'damage_dice', base: 4 }] }] },
  b_double_down:  { name: '더블 다운+',       description: '4 × 🎲 데미지 3회.',                                       effects: [{ kind: 'damage_dice', base: 4, times: 3 }] },
  b_loaded_dice:  { name: '세공 주사위+',     description: '주사위 최솟값 2.',                                           effects: [{ kind: 'set_dice_minimum', value: 2 }] },
  b_sleight:      { name: '슬라이트 오브 핸드+', description: 'HP -2. 에너지 +3.',                                      effects: [{ kind: 'lose_hp', amount: 2 }, { kind: 'energy', amount: 3 }] },
  b_high_roller:  { name: '하이 롤러+',       description: '6 × 🎲 데미지. 취약 +2.',                                  effects: [{ kind: 'damage_dice', base: 6 }, { kind: 'apply_enemy', status: 'vulnerable', amount: 2 }] },
  b_insurance:    { name: '보험+',            description: '6 × 🎲 방어도.',                                            effects: [{ kind: 'block_dice', base: 6 }] },
  b_jackpot:      { name: '잭팟+',            description: '턴 종료 시 방어도 +4.',                                     effects: [{ kind: 'apply_self', status: 'metallicize', amount: 4 }] },
  b_marked_card:  { name: '마킹된 카드+',     description: '10 데미지. 사용할 때마다 영구 데미지 +3.',                  effects: [{ kind: 'damage', amount: 10 }], scaling: { kind: 'on_play', amount: 3 } },
  b_card_count:   { name: '카드 카운팅+',     description: '3 × 🎲 재생.',                                             effects: [{ kind: 'apply_self_dice', status: 'regen', base: 3 }] },
  b_poison_bet:   { name: '독배 내기+',       description: '4 × 🎲 데미지. 3 × 🎲 중독.',                              effects: [{ kind: 'damage_dice', base: 4 }, { kind: 'apply_enemy_dice', status: 'poison', base: 3 }] },
  b_cold_bluff:   { name: '콜드 블러프+',     description: '6 × 🎲 데미지. 빙결 +1.',                                  effects: [{ kind: 'damage_dice', base: 6 }, { kind: 'apply_enemy', status: 'freeze', amount: 1 }] },
  b_follow_up:    { name: '후속 베팅+',       description: '4 × 🎲 데미지. 직전이 공격이면 +4 × 🎲.',                  effects: [{ kind: 'damage_dice', base: 4 }, { kind: 'conditional', condition: { kind: 'after_type', type: 'attack' }, then: [{ kind: 'damage_dice', base: 4 }] }] },
  b_all_in:       { name: '올인+',            description: '12 × 🎲 데미지. 취약 +3. 다음 턴 🎲 → 6.',                effects: [{ kind: 'damage_dice', base: 12 }, { kind: 'apply_enemy', status: 'vulnerable', amount: 3 }, { kind: 'fix_dice', value: 6 }] },
  b_royal_flush:  { name: '로열 플러시+',     description: '9 × 🎲 데미지 2회. 다음 턴 🎲 → 6. 소멸.',                effects: [{ kind: 'damage_dice', base: 9, times: 2 }, { kind: 'fix_dice', value: 6 }] },
  b_fortune:      { name: '포춘+',            description: '턴 시작 시 힘 +3. 선천.',                                   effects: [{ kind: 'apply_self', status: 'ritual', amount: 3 }] },
  b_death_match:  { name: '데스 매치+',       description: 'HP -3. 10 × 🎲 데미지.',                                   effects: [{ kind: 'lose_hp', amount: 3 }, { kind: 'damage_dice', base: 10 }] },
  b_last_stand:   { name: '라스트 스탠드+',   description: '데미지 = 5 × 이번 턴 사용한 카드 수. 소멸.',                effects: [{ kind: 'damage_per_card_this_turn', amount: 5 }] },
};

const GAMBLER_UPGRADE_PP_MAP: Record<string, Partial<CardDef>> = {
  b_loaded_dice: { name: '세공 주사위++', description: '주사위 최솟값 3.', effects: [{ kind: 'set_dice_minimum', value: 3 }] },
};

export function gamblerGetEffectiveDef(card: CardInstance): CardDef {
  const base = GAMBLER_CARD_DEFS[card.defId];
  if (!card.upgraded) return base;
  if ((card.upgraded ?? 0) >= 2) {
    const pp = GAMBLER_UPGRADE_PP_MAP[card.defId];
    if (pp) return { ...base, ...pp };
  }
  const up = GAMBLER_UPGRADE_MAP[card.defId];
  return up ? { ...base, ...up } : base;
}

export function canUpgradeGambler(card: CardInstance): boolean {
  return (card.upgraded ?? 0) < 2 && card.defId in GAMBLER_UPGRADE_MAP;
}

const GAMBLER_CARD_LIST = Object.values(GAMBLER_CARD_DEFS);
export const GAMBLER_COMMON_CARDS   = GAMBLER_CARD_LIST.filter((c) => c.rarity === 'common');
export const GAMBLER_UNCOMMON_CARDS = GAMBLER_CARD_LIST.filter((c) => c.rarity === 'uncommon');
export const GAMBLER_RARE_CARDS     = GAMBLER_CARD_LIST.filter((c) => c.rarity === 'rare');
