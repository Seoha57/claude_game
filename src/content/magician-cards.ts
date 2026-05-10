import type { CardDef, CardInstance } from '../types';

export const MAGICIAN_CARD_DEFS: Record<string, CardDef> = {
  // ── Starter ──
  m_magic_missile: {
    id: 'm_magic_missile',
    name: '매직 미사일',
    type: 'attack',
    rarity: 'starter',
    cost: 1,
    target: 'enemy',
    description: '6 데미지.',
    effects: [{ kind: 'damage', amount: 6 }],
  },
  m_aura_shield: {
    id: 'm_aura_shield',
    name: '오라 실드',
    type: 'skill',
    rarity: 'starter',
    cost: 1,
    target: 'self',
    description: '방어도 +5.',
    effects: [{ kind: 'block', amount: 5 }],
  },

  // ── Common (starter special + actives) ──
  m_phase_shift: {
    id: 'm_phase_shift',
    name: '위상변화',
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
  m_skystrike: {
    id: 'm_skystrike',
    name: '천격',
    type: 'attack',
    rarity: 'common',
    cost: 2,
    target: 'enemy',
    description: '14 데미지.',
    effects: [{ kind: 'damage', amount: 14 }],
  },
  m_dragon_tooth: {
    id: 'm_dragon_tooth',
    name: '용아',
    type: 'attack',
    rarity: 'common',
    cost: 1,
    target: 'enemy',
    description: '5 데미지를 두 번.',
    effects: [{ kind: 'damage', amount: 5, times: 2 }],
  },
  m_lantern: {
    id: 'm_lantern',
    name: '랜턴 파이어',
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
  m_air_lantern: {
    id: 'm_air_lantern',
    name: '공중 랜턴 파이어',
    type: 'attack',
    rarity: 'common',
    cost: 1,
    target: 'all_enemies',
    description: '모든 적에게 8 데미지.',
    effects: [{ kind: 'damage_all', amount: 8 }],
  },
  m_petal: {
    id: 'm_petal',
    name: '낙화장',
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

  // ── Common skills ──
  m_pluto: {
    id: 'm_pluto',
    name: '플루토',
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
  m_frost: {
    id: 'm_frost',
    name: '프로스트 헤드',
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
  m_disenchant: {
    id: 'm_disenchant',
    name: '디스인챈트',
    type: 'skill',
    rarity: 'common',
    cost: 0,
    target: 'self',
    description: '힘 +2.',
    effects: [{ kind: 'apply_self', status: 'strength', amount: 2 }],
  },
  m_no_entry: {
    id: 'm_no_entry',
    name: '접근 금지!',
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
  m_summon_horus: {
    id: 'm_summon_horus',
    name: '계약소환 : 기갑 호도르',
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
  m_blossom: {
    id: 'm_blossom',
    name: '플로레 비비기',
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
  m_whip: {
    id: 'm_whip',
    name: '채찍질',
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
  m_showtime: {
    id: 'm_showtime',
    name: '쇼타임',
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
  m_rose_bind: {
    id: 'm_rose_bind',
    name: '로즈 바인',
    type: 'skill',
    rarity: 'uncommon',
    cost: 1,
    target: 'self',
    description: '방어도 +10. (이번 턴 한정)',
    effects: [{ kind: 'block', amount: 10 }],
    ethereal: true,
  },
  m_mirror: {
    id: 'm_mirror',
    name: '미러이미지',
    type: 'power',
    rarity: 'uncommon',
    cost: 1,
    target: 'self',
    description: '힘 +2.',
    effects: [{ kind: 'apply_self', status: 'strength', amount: 2 }],
  },
  m_goblin_charge: {
    id: 'm_goblin_charge',
    name: '계약소환: 고블린 돌격대',
    type: 'power',
    rarity: 'uncommon',
    cost: 1,
    target: 'self',
    description: '턴 종료 시 방어도 +3.',
    effects: [{ kind: 'apply_self', status: 'metallicize', amount: 3 }],
  },

  // ── Rare (1차 각성기) ──
  m_astral_storm: {
    id: 'm_astral_storm',
    name: '애스트럴 스톰',
    type: 'attack',
    rarity: 'rare',
    cost: 3,
    target: 'enemy',
    description: '32 데미지.',
    effects: [{ kind: 'damage', amount: 32 }],
  },
  m_kasiyas: {
    id: 'm_kasiyas',
    name: '정복자 카시야스',
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
  m_quasar: {
    id: 'm_quasar',
    name: '퀘이사 익스플로전',
    type: 'attack',
    rarity: 'rare',
    cost: 2,
    target: 'all_enemies',
    description: '모든 적에게 21 데미지.',
    effects: [{ kind: 'damage_all', amount: 21 }],
  },
  m_fusion: {
    id: 'm_fusion',
    name: '퓨전 크래프트',
    type: 'power',
    rarity: 'rare',
    cost: 3,
    target: 'self',
    description: '턴 시작 시 힘 +2.',
    effects: [{ kind: 'apply_self', status: 'ritual', amount: 2 }],
  },
  m_marionette: {
    id: 'm_marionette',
    name: '마리오네트',
    type: 'attack',
    rarity: 'rare',
    cost: 2,
    target: 'all_enemies',
    description: '모든 적에게 4 데미지.',
    effects: [{ kind: 'damage_all', amount: 4 }],
    exhaust: true,
  },
};

const MAGICIAN_UPGRADE_MAP: Record<string, Partial<CardDef>> = {
  m_magic_missile:  { name: '매직 미사일+',                description: '9 데미지.',                              effects: [{ kind: 'damage', amount: 9 }] },
  m_aura_shield:    { name: '오라 실드+',                  description: '방어도 +8.',                             effects: [{ kind: 'block', amount: 8 }] },
  m_phase_shift:    { name: '위상변화+',                   description: '10 데미지. 취약 +3.',                    effects: [{ kind: 'damage', amount: 10 }, { kind: 'apply_enemy', status: 'vulnerable', amount: 3 }] },
  m_skystrike:      { name: '천격+',                       description: '18 데미지.',                             effects: [{ kind: 'damage', amount: 18 }] },
  m_dragon_tooth:   { name: '용아+',                       description: '7 데미지를 두 번.',                      effects: [{ kind: 'damage', amount: 7, times: 2 }] },
  m_lantern:        { name: '랜턴 파이어+',                description: '10 데미지. 2장 드로우.',                 effects: [{ kind: 'damage', amount: 10 }, { kind: 'draw', amount: 2 }] },
  m_air_lantern:    { name: '공중 랜턴 파이어+',           description: '모든 적에게 11 데미지.',                 effects: [{ kind: 'damage_all', amount: 11 }] },
  m_petal:          { name: '낙화장+',                     description: '모든 적에게 7 데미지. 취약 +1.',         effects: [{ kind: 'damage_all', amount: 7 }, { kind: 'apply_all', status: 'vulnerable', amount: 1 }] },
  m_pluto:          { name: '플루토+',                     description: '7 데미지. 방어도 +7.',                   effects: [{ kind: 'damage', amount: 7 }, { kind: 'block', amount: 7 }] },
  m_frost:          { name: '프로스트 헤드+',              description: '방어도 +11. 1장 드로우.',                effects: [{ kind: 'block', amount: 11 }, { kind: 'draw', amount: 1 }] },
  m_disenchant:     { name: '디스인챈트+',                 description: '힘 +4.',                                 effects: [{ kind: 'apply_self', status: 'strength', amount: 4 }] },
  m_no_entry:       { name: '접근 금지!+',                 description: '방어도 +9. 무작위 카드 1장 소멸.',       effects: [{ kind: 'block', amount: 9 }, { kind: 'exhaust_random_hand' }] },
  m_summon_horus:   { name: '계약소환 : 기갑 호도르+',     description: '2장 드로우. 무작위 카드 1장 소멸.',      effects: [{ kind: 'draw', amount: 2 }, { kind: 'exhaust_random_hand' }] },
  m_blossom:        { name: '플로레 비비기+',              description: '15 데미지. 취약 +2. 약화 +2.',           effects: [{ kind: 'damage', amount: 15 }, { kind: 'apply_enemy', status: 'vulnerable', amount: 2 }, { kind: 'apply_enemy', status: 'weak', amount: 2 }] },
  m_whip:           { name: '채찍질+',                     description: '7 데미지. 중독 +7.',                     effects: [{ kind: 'damage', amount: 7 }, { kind: 'apply_enemy', status: 'poison', amount: 7 }] },
  m_showtime:       { name: '쇼타임+',                     description: 'HP -2. 에너지 +3.',                      effects: [{ kind: 'lose_hp', amount: 2 }, { kind: 'energy', amount: 3 }] },
  m_rose_bind:      { name: '로즈 바인+',                  description: '방어도 +13.',                            effects: [{ kind: 'block', amount: 13 }] },
  m_mirror:         { name: '미러이미지+',                 description: '힘 +3.',                                 effects: [{ kind: 'apply_self', status: 'strength', amount: 3 }] },
  m_goblin_charge:  { name: '계약소환: 고블린 돌격대+',   description: '턴 종료 시 방어도 +4.',                  effects: [{ kind: 'apply_self', status: 'metallicize', amount: 4 }] },
  m_astral_storm:   { name: '애스트럴 스톰+',              description: '42 데미지.',                             effects: [{ kind: 'damage', amount: 42 }] },
  m_kasiyas:        { name: '정복자 카시야스+',            description: 'HP -3. 24 데미지.',                      effects: [{ kind: 'lose_hp', amount: 3 }, { kind: 'damage', amount: 24 }] },
  m_quasar:         { name: '퀘이사 익스플로전+',          description: '모든 적에게 28 데미지.',                 effects: [{ kind: 'damage_all', amount: 28 }] },
  m_fusion:         { name: '퓨전 크래프트+',              description: '턴 시작 시 힘 +3.',                      effects: [{ kind: 'apply_self', status: 'ritual', amount: 3 }] },
  m_marionette:     { name: '마리오네트+',                 description: '모든 적에게 6 데미지.',                  effects: [{ kind: 'damage_all', amount: 6 }] },
};

export function magicianGetEffectiveDef(card: CardInstance): CardDef {
  const base = MAGICIAN_CARD_DEFS[card.defId];
  if (!card.upgraded) return base;
  const up = MAGICIAN_UPGRADE_MAP[card.defId];
  if (!up) return base;
  return { ...base, ...up };
}

export function canUpgradeMagician(card: CardInstance): boolean {
  return !card.upgraded && card.defId in MAGICIAN_UPGRADE_MAP;
}

const MAGICIAN_CARD_LIST = Object.values(MAGICIAN_CARD_DEFS);
export const MAGICIAN_COMMON_CARDS   = MAGICIAN_CARD_LIST.filter((c) => c.rarity === 'common');
export const MAGICIAN_UNCOMMON_CARDS = MAGICIAN_CARD_LIST.filter((c) => c.rarity === 'uncommon');
export const MAGICIAN_RARE_CARDS     = MAGICIAN_CARD_LIST.filter((c) => c.rarity === 'rare');
