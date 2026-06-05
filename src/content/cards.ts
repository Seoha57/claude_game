import type { CardDef } from '../types';
import { GUNNER_CARD_DEFS, gunnerGetEffectiveDef, canUpgradeGunner } from './gunner-cards';
import { FIGHTER_CARD_DEFS, fighterGetEffectiveDef, canUpgradeFighter } from './fighter-cards';
import { MAGICIAN_CARD_DEFS, magicianGetEffectiveDef, canUpgradeMagician } from './magician-cards';
import { PRIEST_CARD_DEFS, priestGetEffectiveDef, canUpgradePriest } from './priest-cards';
import { THIEF_CARD_DEFS, thiefGetEffectiveDef, canUpgradeThief } from './thief-cards';
export { GUNNER_COMMON_CARDS, GUNNER_UNCOMMON_CARDS, GUNNER_RARE_CARDS } from './gunner-cards';
export { FIGHTER_COMMON_CARDS, FIGHTER_UNCOMMON_CARDS, FIGHTER_RARE_CARDS } from './fighter-cards';
export { MAGICIAN_COMMON_CARDS, MAGICIAN_UNCOMMON_CARDS, MAGICIAN_RARE_CARDS } from './magician-cards';
export { PRIEST_COMMON_CARDS, PRIEST_UNCOMMON_CARDS, PRIEST_RARE_CARDS } from './priest-cards';
export { THIEF_COMMON_CARDS, THIEF_UNCOMMON_CARDS, THIEF_RARE_CARDS } from './thief-cards';

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
    description: '모든 적에게 4 데미지. 화상 +2.',
    effects: [
      { kind: 'damage_all', amount: 4 },
      { kind: 'apply_all', status: 'burn', amount: 2 },
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
  mugeukdo: {
    id: 'mugeukdo',
    name: '무극도',
    type: 'attack',
    rarity: 'uncommon',
    cost: 1,
    target: 'enemy',
    description: '10 데미지. 처치 시 영구 데미지 +3.',
    effects: [{ kind: 'damage', amount: 10 }],
    exhaust: true,
    scaling: { kind: 'on_kill', amount: 3 },
  },
  chain_release: {
    id: 'chain_release',
    name: '사슬 해제',
    type: 'power',
    rarity: 'uncommon',
    cost: 1,
    target: 'self',
    description: '카드 소멸 시 힘 +1.',
    effects: [{ kind: 'apply_self', status: 'on_exhaust_str', amount: 1 }],
  },

  // ── Rare (1차 각성기) ──
  bludgeon: {
    id: 'bludgeon',
    name: '극 귀검술 : 폭풍식',
    type: 'attack',
    rarity: 'rare',
    cost: 3,
    target: 'enemy',
    description: '32 데미지. 유지.',
    effects: [{ kind: 'damage', amount: 32 }],
    retain: true,
  },
  demon_form: {
    id: 'demon_form',
    name: '파동의 눈',
    type: 'power',
    rarity: 'rare',
    cost: 3,
    target: 'self',
    description: '턴 시작 시 힘 +2. 선천.',
    effects: [{ kind: 'apply_self', status: 'ritual', amount: 2 }],
    innate: true,
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

  // ── 귀검사 콤보 시너지 ─────────────────────────────────────
  chain_slash: {
    id: 'chain_slash',
    name: '연계 베기',
    type: 'attack',
    rarity: 'common',
    cost: 1,
    target: 'enemy',
    description: '5 데미지. 이번 턴 2번째 이후 카드면 +7 데미지.',
    effects: [
      { kind: 'damage', amount: 5 },
      { kind: 'conditional', condition: { kind: 'nth_or_more', n: 2 }, then: [{ kind: 'damage', amount: 7 }] },
    ],
  },
  lingering_image: {
    id: 'lingering_image',
    name: '잔영',
    type: 'attack',
    rarity: 'uncommon',
    cost: 1,
    target: 'enemy',
    description: '9 데미지. 직전이 공격이면 +6 데미지.',
    effects: [
      { kind: 'damage', amount: 9 },
      { kind: 'conditional', condition: { kind: 'after_type', type: 'attack' }, then: [{ kind: 'damage', amount: 6 }] },
    ],
  },
  thousand_cuts: {
    id: 'thousand_cuts',
    name: '천상참',
    type: 'attack',
    rarity: 'rare',
    cost: 2,
    target: 'enemy',
    description: '데미지 = 2 × 이번 전투 누적 공격 수.',
    effects: [{ kind: 'damage_per_attack', amount: 2 }],
  },

  // ── 풀 확장 (귀검사) ────────────────────────────────────────
  twin_slash: {
    id: 'twin_slash',
    name: '이중 베기',
    type: 'attack', rarity: 'common', cost: 1, target: 'enemy',
    description: '4 데미지 2회.',
    effects: [{ kind: 'damage', amount: 4, times: 2 }],
  },
  sword_phantom: {
    id: 'sword_phantom',
    name: '검의 환영',
    type: 'attack', rarity: 'uncommon', cost: 1, target: 'enemy',
    description: '7 데미지. 직전이 공격이면 +5 데미지.',
    effects: [
      { kind: 'damage', amount: 7 },
      { kind: 'conditional', condition: { kind: 'after_type', type: 'attack' }, then: [{ kind: 'damage', amount: 5 }] },
    ],
  },
  infinite_cut: {
    id: 'infinite_cut',
    name: '무한참',
    type: 'attack', rarity: 'uncommon', cost: 2, target: 'enemy',
    description: '5 데미지 3회.',
    effects: [{ kind: 'damage', amount: 5, times: 3 }],
  },
  awakening: {
    id: 'awakening',
    name: '각성',
    type: 'skill', rarity: 'uncommon', cost: 1, target: 'self',
    description: '힘 +3. 소멸.',
    effects: [{ kind: 'apply_self', status: 'strength', amount: 3 }],
    exhaust: true,
  },
  demon_one_slash: {
    id: 'demon_one_slash',
    name: '귀살일도',
    type: 'attack', rarity: 'rare', cost: 2, target: 'enemy',
    description: '28 데미지. 처치 시 영구 데미지 +4. 소멸.',
    effects: [{ kind: 'damage', amount: 28 }],
    exhaust: true,
    scaling: { kind: 'on_kill', amount: 4 },
  },
};

// Merge all character cards into CARD_DEFS so getEffectiveDef works universally
Object.assign(CARD_DEFS, GUNNER_CARD_DEFS, FIGHTER_CARD_DEFS, MAGICIAN_CARD_DEFS, PRIEST_CARD_DEFS, THIEF_CARD_DEFS);

export const CARD_LIST = Object.values(CARD_DEFS).filter(
  (c) => !c.id.startsWith('g_') && !c.id.startsWith('f_') && !c.id.startsWith('m_') && !c.id.startsWith('p_') && !c.id.startsWith('t_'),
);
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
  thunderclap:      { name: '열파참+',        description: '모든 적에게 7 데미지. 화상 +3.',     effects: [{ kind: 'damage_all', amount: 7 }, { kind: 'apply_all', status: 'burn', amount: 3 }] },
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
  mugeukdo:         { name: '무극도+',         description: '13 데미지. 처치 시 영구 데미지 +5.',  effects: [{ kind: 'damage', amount: 13 }] },
  chain_release:    { name: '사슬 해제+',      description: '카드 소멸 시 힘 +2.',                  effects: [{ kind: 'apply_self', status: 'on_exhaust_str', amount: 2 }] },
  bludgeon:         { name: '극 귀검술 : 폭풍식+',           description: '42 데미지. 유지.',                effects: [{ kind: 'damage', amount: 42 }] },
  demon_form:       { name: '파동의 눈+',                   description: '턴 시작 시 힘 +3. 선천.',         effects: [{ kind: 'apply_self', status: 'ritual', amount: 3 }] },
  feed:             { name: '익스트림 오버킬+',             description: 'HP -3. 24 데미지.',                effects: [{ kind: 'lose_hp', amount: 3 }, { kind: 'damage', amount: 24 }] },
  immolate:         { name: '제 7의 귀신 : 광폭의 블라수+', description: '모든 적에게 28 데미지.',           effects: [{ kind: 'damage_all', amount: 28 }] },
  reaper:           { name: '귀천살+',                      description: '모든 적에게 6 데미지.',            effects: [{ kind: 'damage_all', amount: 6 }] },
  // 콤보 시너지
  chain_slash:      { name: '연계 베기+',     description: '7 데미지. 이번 턴 2번째 이후 카드면 +9 데미지.',
                      effects: [{ kind: 'damage', amount: 7 }, { kind: 'conditional', condition: { kind: 'nth_or_more', n: 2 }, then: [{ kind: 'damage', amount: 9 }] }] },
  lingering_image:  { name: '잔영+',          description: '12 데미지. 직전이 공격이면 +9 데미지.',
                      effects: [{ kind: 'damage', amount: 12 }, { kind: 'conditional', condition: { kind: 'after_type', type: 'attack' }, then: [{ kind: 'damage', amount: 9 }] }] },
  thousand_cuts:    { name: '천상참+',        description: '데미지 = 3 × 이번 전투 누적 공격 수.',
                      effects: [{ kind: 'damage_per_attack', amount: 3 }] },
  // 풀 확장
  twin_slash:       { name: '이중 베기+',     description: '5 데미지 2회.',                       effects: [{ kind: 'damage', amount: 5, times: 2 }] },
  sword_phantom:    { name: '검의 환영+',     description: '9 데미지. 직전이 공격이면 +7 데미지.',
                      effects: [{ kind: 'damage', amount: 9 }, { kind: 'conditional', condition: { kind: 'after_type', type: 'attack' }, then: [{ kind: 'damage', amount: 7 }] }] },
  infinite_cut:     { name: '무한참+',        description: '6 데미지 3회.',                       effects: [{ kind: 'damage', amount: 6, times: 3 }] },
  awakening:        { name: '각성+',          description: '힘 +5. 소멸.',                        effects: [{ kind: 'apply_self', status: 'strength', amount: 5 }] },
  demon_one_slash:  { name: '귀살일도+',      description: '36 데미지. 처치 시 영구 데미지 +5. 소멸.',
                      effects: [{ kind: 'damage', amount: 36 }] },
};

import type { CardInstance } from '../types';

export function getEffectiveDef(card: CardInstance): CardDef {
  let def: CardDef;
  if (card.defId.startsWith('g_')) {
    def = gunnerGetEffectiveDef(card);
  } else if (card.defId.startsWith('f_')) {
    def = fighterGetEffectiveDef(card);
  } else if (card.defId.startsWith('m_')) {
    def = magicianGetEffectiveDef(card);
  } else if (card.defId.startsWith('p_')) {
    def = priestGetEffectiveDef(card);
  } else if (card.defId.startsWith('t_')) {
    def = thiefGetEffectiveDef(card);
  } else {
    const base = CARD_DEFS[card.defId];
    if (!card.upgraded) {
      def = base;
    } else {
      const up = UPGRADE_MAP[card.defId];
      def = up ? { ...base, ...up } : base;
    }
  }
  if ((card.upgraded ?? 0) >= 2) def = applyPlusPlus(def);
  return applyScaling(card, def);
}

// ── 이중 강화 (++) 일괄 적용 ─────────────────────────────────────
// + 강화 위에 추가 보너스: 데미지/방어도/회복 +3, 상태이상 +1, 드로우/에너지 +1
const PLUSPLUS_DAMAGE_BONUS = 3;
const PLUSPLUS_BLOCK_BONUS = 3;
const PLUSPLUS_HEAL_BONUS = 3;
const PLUSPLUS_STATUS_BONUS = 1;
const PLUSPLUS_DRAW_BONUS = 1;
const PLUSPLUS_ENERGY_BONUS = 1;

export function applyPlusPlus(def: CardDef): CardDef {
  const effects = def.effects.map((e) => {
    if (e.kind === 'damage' || e.kind === 'damage_all') {
      return { ...e, amount: e.amount + PLUSPLUS_DAMAGE_BONUS };
    }
    if (e.kind === 'block') {
      return { ...e, amount: e.amount + PLUSPLUS_BLOCK_BONUS };
    }
    if (e.kind === 'heal') {
      return { ...e, amount: e.amount + PLUSPLUS_HEAL_BONUS };
    }
    if (e.kind === 'apply_self' || e.kind === 'apply_enemy' || e.kind === 'apply_all') {
      // negative deltas (e.g. weak -1) shouldn't grow in magnitude
      if (e.amount <= 0) return e;
      return { ...e, amount: e.amount + PLUSPLUS_STATUS_BONUS };
    }
    if (e.kind === 'draw') return { ...e, amount: e.amount + PLUSPLUS_DRAW_BONUS };
    if (e.kind === 'energy') return { ...e, amount: e.amount + PLUSPLUS_ENERGY_BONUS };
    return e;
  });
  const name = def.name.endsWith('++') ? def.name : def.name.endsWith('+') ? def.name + '+' : def.name + '++';
  return { ...def, effects, name, description: bumpNumbersForPlusPlus(def.description) };
}

// 설명 텍스트의 숫자를 ++ 보너스만큼 증가시킨다.
// 한국어 패턴: "N 데미지", "방어도 +N", "힘 +N" 등
function bumpNumbersForPlusPlus(desc: string): string {
  const damageRe = /(\d+)( 데미지)/g;
  const healRe = /(\d+)( 회복)/g;
  const blockRe = /(방어도 \+)(\d+)/g;
  const drawRe = /(\d+)(장 드로우)/g;
  const energyRe = /(에너지 \+)(\d+)/g;
  const statusLabels = ['힘', '민첩', '취약', '약화', '재생', '중독', '화상', '빙결', '의식', '가시', '금속화', '연약'];
  let out = desc
    .replace(damageRe, (_m, n, t) => `${parseInt(n, 10) + PLUSPLUS_DAMAGE_BONUS}${t}`)
    .replace(healRe, (_m, n, t) => `${parseInt(n, 10) + PLUSPLUS_HEAL_BONUS}${t}`)
    .replace(blockRe, (_m, p, n) => `${p}${parseInt(n, 10) + PLUSPLUS_BLOCK_BONUS}`)
    .replace(drawRe, (_m, n, t) => `${parseInt(n, 10) + PLUSPLUS_DRAW_BONUS}${t}`)
    .replace(energyRe, (_m, p, n) => `${p}${parseInt(n, 10) + PLUSPLUS_ENERGY_BONUS}`);
  for (const label of statusLabels) {
    const re = new RegExp(`(${label} \\+)(\\d+)`, 'g');
    out = out.replace(re, (_m, p, n) => `${p}${parseInt(n, 10) + PLUSPLUS_STATUS_BONUS}`);
  }
  return out;
}

function applyScaling(card: CardInstance, def: CardDef): CardDef {
  const bonus = card.bonusDamage ?? 0;
  if (!def.scaling || bonus === 0) return def;
  return {
    ...def,
    effects: def.effects.map((e) => {
      if (e.kind === 'damage') return { ...e, amount: e.amount + bonus };
      if (e.kind === 'damage_all') return { ...e, amount: e.amount + bonus };
      return e;
    }),
    description: `${def.description} (현재 +${bonus})`,
  };
}

export function canUpgrade(card: CardInstance): boolean {
  if (card.defId.startsWith('g_')) return canUpgradeGunner(card);
  if (card.defId.startsWith('f_')) return canUpgradeFighter(card);
  if (card.defId.startsWith('m_')) return canUpgradeMagician(card);
  if (card.defId.startsWith('p_')) return canUpgradePriest(card);
  if (card.defId.startsWith('t_')) return canUpgradeThief(card);
  return (card.upgraded ?? 0) < 2 && card.defId in UPGRADE_MAP;
}
