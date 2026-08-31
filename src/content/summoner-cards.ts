import type { CardDef, CardInstance } from '../types';

// 정령술사 카드 정의
// 시그니처: 정령 소환(power) 스케일링 · 영혼 흡수 · 유리 대포
export const SUMMONER_CARD_DEFS: Record<string, CardDef> = {
  // ── Starter ──
  s_spirit_bolt: {
    id: 's_spirit_bolt',
    name: '마력탄',
    type: 'attack', rarity: 'starter', cost: 1, target: 'enemy',
    description: '6 데미지.',
    effects: [{ kind: 'damage', amount: 6 }],
  },
  s_ward: {
    id: 's_ward',
    name: '보호막',
    type: 'skill', rarity: 'starter', cost: 1, target: 'self',
    description: '방어도 +5.',
    effects: [{ kind: 'block', amount: 5 }],
  },

  // ── Common ──
  s_soul_arrow: {
    id: 's_soul_arrow',
    name: '영혼 화살',
    type: 'attack', rarity: 'common', cost: 1, target: 'enemy',
    description: '7 데미지. 1장 드로우.',
    effects: [{ kind: 'damage', amount: 7 }, { kind: 'draw', amount: 1 }],
  },
  s_double_bolt: {
    id: 's_double_bolt',
    name: '쌍발 마력탄',
    type: 'attack', rarity: 'common', cost: 1, target: 'enemy',
    description: '4 데미지 2회.',
    effects: [{ kind: 'damage', amount: 4, times: 2 }],
  },
  s_spirit_shield: {
    id: 's_spirit_shield',
    name: '정령 방패',
    type: 'skill', rarity: 'common', cost: 1, target: 'self',
    description: '방어도 +8.',
    effects: [{ kind: 'block', amount: 8 }],
  },
  s_dark_pact: {
    id: 's_dark_pact',
    name: '암흑 계약',
    type: 'skill', rarity: 'common', cost: 0, target: 'self',
    description: 'HP -3. 에너지 +2.',
    effects: [{ kind: 'lose_hp', amount: 3 }, { kind: 'energy', amount: 2 }],
  },
  s_soul_drain: {
    id: 's_soul_drain',
    name: '영혼 흡수',
    type: 'attack', rarity: 'common', cost: 1, target: 'enemy',
    description: '5 데미지. 중독 +3.',
    effects: [{ kind: 'damage', amount: 5 }, { kind: 'apply_enemy', status: 'poison', amount: 3 }],
  },
  s_curse_bolt: {
    id: 's_curse_bolt',
    name: '저주탄',
    type: 'attack', rarity: 'common', cost: 1, target: 'enemy',
    description: '6 데미지. 약화 +1.',
    effects: [{ kind: 'damage', amount: 6 }, { kind: 'apply_enemy', status: 'weak', amount: 1 }],
  },
  s_spirit_sight: {
    id: 's_spirit_sight',
    name: '정령의 눈',
    type: 'skill', rarity: 'common', cost: 1, target: 'self',
    description: '1장 드로우. 민첩 +1.',
    effects: [{ kind: 'draw', amount: 1 }, { kind: 'apply_self', status: 'dexterity', amount: 1 }],
  },
  s_bind: {
    id: 's_bind',
    name: '영혼 결박',
    type: 'attack', rarity: 'common', cost: 1, target: 'enemy',
    description: '6 데미지. 취약 +2.',
    effects: [{ kind: 'damage', amount: 6 }, { kind: 'apply_enemy', status: 'vulnerable', amount: 2 }],
  },
  s_summon_fire: {
    id: 's_summon_fire',
    name: '화염 정령 소환',
    type: 'power', rarity: 'common', cost: 1, target: 'self',
    description: '턴 시작 시 힘 +1.',
    effects: [{ kind: 'apply_self', status: 'ritual', amount: 1 }],
  },
  s_summon_earth: {
    id: 's_summon_earth',
    name: '대지 정령 소환',
    type: 'power', rarity: 'common', cost: 1, target: 'self',
    description: '턴 종료 시 방어도 +3.',
    effects: [{ kind: 'apply_self', status: 'metallicize', amount: 3 }],
  },
  s_soul_wall: {
    id: 's_soul_wall',
    name: '영혼의 벽',
    type: 'skill', rarity: 'common', cost: 1, target: 'self',
    description: '방어도 +6. 1장 드로우.',
    effects: [{ kind: 'block', amount: 6 }, { kind: 'draw', amount: 1 }],
  },
  s_leech: {
    id: 's_leech',
    name: '생명력 착취',
    type: 'attack', rarity: 'common', cost: 1, target: 'enemy',
    description: '10 데미지. 소멸.',
    effects: [{ kind: 'damage', amount: 10 }],
    exhaust: true,
  },

  // ── Uncommon ──
  s_summon_thunder: {
    id: 's_summon_thunder',
    name: '번개 정령 소환',
    type: 'power', rarity: 'uncommon', cost: 1, target: 'self',
    description: '가시 +3.',
    effects: [{ kind: 'apply_self', status: 'thorns', amount: 3 }],
  },
  s_soul_storm: {
    id: 's_soul_storm',
    name: '영혼 폭풍',
    type: 'attack', rarity: 'uncommon', cost: 2, target: 'all_enemies',
    description: '모든 적에게 8 데미지. 약화 +1.',
    effects: [{ kind: 'damage_all', amount: 8 }, { kind: 'apply_all', status: 'weak', amount: 1 }],
  },
  s_spirit_link: {
    id: 's_spirit_link',
    name: '정령 결속',
    type: 'skill', rarity: 'uncommon', cost: 1, target: 'self',
    description: '힘 +2. 1장 드로우.',
    effects: [{ kind: 'apply_self', status: 'strength', amount: 2 }, { kind: 'draw', amount: 1 }],
  },
  s_dimension_gate: {
    id: 's_dimension_gate',
    name: '차원문',
    type: 'skill', rarity: 'uncommon', cost: 1, target: 'self',
    description: '방어도 +11. 1장 드로우.',
    effects: [{ kind: 'block', amount: 11 }, { kind: 'draw', amount: 1 }],
  },
  s_soul_harvest: {
    id: 's_soul_harvest',
    name: '영혼 수확',
    type: 'attack', rarity: 'uncommon', cost: 2, target: 'enemy',
    description: '14 데미지. 중독 +4.',
    effects: [{ kind: 'damage', amount: 14 }, { kind: 'apply_enemy', status: 'poison', amount: 4 }],
  },
  s_contract_renewal: {
    id: 's_contract_renewal',
    name: '계약 갱신',
    type: 'skill', rarity: 'uncommon', cost: 1, target: 'self',
    description: '2장 드로우. 무작위 카드 1장 소멸.',
    effects: [{ kind: 'draw', amount: 2 }, { kind: 'exhaust_random_hand' }],
  },
  s_life_convert: {
    id: 's_life_convert',
    name: '생명 전환',
    type: 'skill', rarity: 'uncommon', cost: 0, target: 'self',
    description: 'HP -4. 3장 드로우.',
    effects: [{ kind: 'lose_hp', amount: 4 }, { kind: 'draw', amount: 3 }],
  },
  s_frost_spirit: {
    id: 's_frost_spirit',
    name: '빙결 정령 소환',
    type: 'attack', rarity: 'uncommon', cost: 1, target: 'enemy',
    description: '7 데미지. 빙결 +2. 소멸.',
    effects: [{ kind: 'damage', amount: 7 }, { kind: 'apply_enemy', status: 'freeze', amount: 2 }],
    exhaust: true,
  },
  s_spirit_rush: {
    id: 's_spirit_rush',
    name: '정령 쇄도',
    type: 'attack', rarity: 'uncommon', cost: 2, target: 'all_enemies',
    description: '모든 적에게 7 데미지. 취약 +1.',
    effects: [{ kind: 'damage_all', amount: 7 }, { kind: 'apply_all', status: 'vulnerable', amount: 1 }],
  },
  s_soul_cage: {
    id: 's_soul_cage',
    name: '영혼 감옥',
    type: 'attack', rarity: 'uncommon', cost: 2, target: 'enemy',
    description: '12 데미지. 약화 +2. 취약 +2.',
    effects: [{ kind: 'damage', amount: 12 }, { kind: 'apply_enemy', status: 'weak', amount: 2 }, { kind: 'apply_enemy', status: 'vulnerable', amount: 2 }],
  },
  s_spirit_dance: {
    id: 's_spirit_dance',
    name: '정령의 춤',
    type: 'skill', rarity: 'uncommon', cost: 1, target: 'self',
    description: '민첩 +2. 1장 드로우.',
    effects: [{ kind: 'apply_self', status: 'dexterity', amount: 2 }, { kind: 'draw', amount: 1 }],
  },
  s_void_shield: {
    id: 's_void_shield',
    name: '공허 방벽',
    type: 'skill', rarity: 'uncommon', cost: 0, target: 'self',
    description: '방어도 +6. 소멸.',
    effects: [{ kind: 'block', amount: 6 }],
    exhaust: true,
  },

  // ── Rare ──
  s_summon_greater: {
    id: 's_summon_greater',
    name: '대정령 소환',
    type: 'power', rarity: 'rare', cost: 2, target: 'self',
    description: '턴 시작 시 힘 +2. 선천.',
    effects: [{ kind: 'apply_self', status: 'ritual', amount: 2 }],
    innate: true,
  },
  s_soul_lord: {
    id: 's_soul_lord',
    name: '영혼의 군주',
    type: 'power', rarity: 'rare', cost: 1, target: 'self',
    description: '카드 소멸 시 카드 1장 드로우.',
    effects: [{ kind: 'apply_self', status: 'on_exhaust_draw', amount: 1 }],
  },
  s_dimension_collapse: {
    id: 's_dimension_collapse',
    name: '차원 붕괴',
    type: 'attack', rarity: 'rare', cost: 3, target: 'all_enemies',
    description: '모든 적에게 28 데미지. 소멸.',
    effects: [{ kind: 'damage_all', amount: 28 }],
    exhaust: true,
  },
  s_spirit_frenzy: {
    id: 's_spirit_frenzy',
    name: '사역마 폭주',
    type: 'attack', rarity: 'rare', cost: 1, target: 'enemy',
    description: '데미지 = 3 × 이번 전투 누적 공격 수.',
    effects: [{ kind: 'damage_per_attack', amount: 3 }],
  },
  s_reaper_summon: {
    id: 's_reaper_summon',
    name: '사신 소환',
    type: 'attack', rarity: 'rare', cost: 2, target: 'enemy',
    description: '26 데미지. 처치 시 영구 데미지 +4. 소멸.',
    effects: [{ kind: 'damage', amount: 26 }],
    exhaust: true,
    scaling: { kind: 'on_kill', amount: 4 },
  },
  s_void_explosion: {
    id: 's_void_explosion',
    name: '공허 폭발',
    type: 'attack', rarity: 'rare', cost: 3, target: 'enemy',
    description: '12 데미지 3회. 소멸.',
    effects: [{ kind: 'damage', amount: 12, times: 3 }],
    exhaust: true,
  },
  s_spirit_pact: {
    id: 's_spirit_pact',
    name: '정령 서약',
    type: 'power', rarity: 'rare', cost: 1, target: 'self',
    description: '민첩 +4. 1장 드로우. 선천.',
    effects: [{ kind: 'apply_self', status: 'dexterity', amount: 4 }, { kind: 'draw', amount: 1 }],
    innate: true,
  },
  s_plague_spirit: {
    id: 's_plague_spirit',
    name: '역병 정령',
    type: 'skill', rarity: 'rare', cost: 2, target: 'all_enemies',
    description: '모든 적에게 중독 +10. 소멸.',
    effects: [{ kind: 'apply_all', status: 'poison', amount: 10 }],
    exhaust: true,
  },
};

// ── Upgrade map ──
export const SUMMONER_UPGRADE_MAP: Record<string, Partial<CardDef>> = {
  s_spirit_bolt:       { name: '마력탄+',           description: '9 데미지.',                              effects: [{ kind: 'damage', amount: 9 }] },
  s_ward:              { name: '보호막+',           description: '방어도 +8.',                             effects: [{ kind: 'block', amount: 8 }] },
  s_soul_arrow:        { name: '영혼 화살+',        description: '10 데미지. 1장 드로우.',                 effects: [{ kind: 'damage', amount: 10 }, { kind: 'draw', amount: 1 }] },
  s_double_bolt:       { name: '쌍발 마력탄+',      description: '5 데미지 2회.',                          effects: [{ kind: 'damage', amount: 5, times: 2 }] },
  s_spirit_shield:     { name: '정령 방패+',        description: '방어도 +11.',                            effects: [{ kind: 'block', amount: 11 }] },
  s_dark_pact:         { name: '암흑 계약+',        description: 'HP -2. 에너지 +3.',                      effects: [{ kind: 'lose_hp', amount: 2 }, { kind: 'energy', amount: 3 }] },
  s_soul_drain:        { name: '영혼 흡수+',        description: '7 데미지. 중독 +4.',                     effects: [{ kind: 'damage', amount: 7 }, { kind: 'apply_enemy', status: 'poison', amount: 4 }] },
  s_curse_bolt:        { name: '저주탄+',           description: '8 데미지. 약화 +2.',                     effects: [{ kind: 'damage', amount: 8 }, { kind: 'apply_enemy', status: 'weak', amount: 2 }] },
  s_spirit_sight:      { name: '정령의 눈+',        description: '2장 드로우. 민첩 +1.',                   effects: [{ kind: 'draw', amount: 2 }, { kind: 'apply_self', status: 'dexterity', amount: 1 }] },
  s_bind:              { name: '영혼 결박+',        description: '8 데미지. 취약 +3.',                     effects: [{ kind: 'damage', amount: 8 }, { kind: 'apply_enemy', status: 'vulnerable', amount: 3 }] },
  s_summon_fire:       { name: '화염 정령 소환+',   description: '턴 시작 시 힘 +2.',                      effects: [{ kind: 'apply_self', status: 'ritual', amount: 2 }] },
  s_summon_earth:      { name: '대지 정령 소환+',   description: '턴 종료 시 방어도 +5.',                  effects: [{ kind: 'apply_self', status: 'metallicize', amount: 5 }] },
  s_soul_wall:         { name: '영혼의 벽+',        description: '방어도 +9. 1장 드로우.',                 effects: [{ kind: 'block', amount: 9 }, { kind: 'draw', amount: 1 }] },
  s_leech:             { name: '생명력 착취+',      description: '14 데미지. 소멸.',                       effects: [{ kind: 'damage', amount: 14 }] },
  s_summon_thunder:    { name: '번개 정령 소환+',   description: '가시 +5.',                               effects: [{ kind: 'apply_self', status: 'thorns', amount: 5 }] },
  s_soul_storm:        { name: '영혼 폭풍+',        description: '모든 적에게 11 데미지. 약화 +2.',        effects: [{ kind: 'damage_all', amount: 11 }, { kind: 'apply_all', status: 'weak', amount: 2 }] },
  s_spirit_link:       { name: '정령 결속+',        description: '힘 +3. 1장 드로우.',                     effects: [{ kind: 'apply_self', status: 'strength', amount: 3 }, { kind: 'draw', amount: 1 }] },
  s_dimension_gate:    { name: '차원문+',           description: '방어도 +14. 1장 드로우.',                effects: [{ kind: 'block', amount: 14 }, { kind: 'draw', amount: 1 }] },
  s_soul_harvest:      { name: '영혼 수확+',        description: '18 데미지. 중독 +6.',                    effects: [{ kind: 'damage', amount: 18 }, { kind: 'apply_enemy', status: 'poison', amount: 6 }] },
  s_contract_renewal:  { name: '계약 갱신+',        description: '3장 드로우. 무작위 카드 1장 소멸.',       effects: [{ kind: 'draw', amount: 3 }, { kind: 'exhaust_random_hand' }] },
  s_life_convert:      { name: '생명 전환+',        description: 'HP -3. 4장 드로우.',                     effects: [{ kind: 'lose_hp', amount: 3 }, { kind: 'draw', amount: 4 }] },
  s_frost_spirit:      { name: '빙결 정령 소환+',   description: '10 데미지. 빙결 +2. 소멸.',              effects: [{ kind: 'damage', amount: 10 }, { kind: 'apply_enemy', status: 'freeze', amount: 2 }] },
  s_spirit_rush:       { name: '정령 쇄도+',        description: '모든 적에게 10 데미지. 취약 +2.',        effects: [{ kind: 'damage_all', amount: 10 }, { kind: 'apply_all', status: 'vulnerable', amount: 2 }] },
  s_soul_cage:         { name: '영혼 감옥+',        description: '16 데미지. 약화 +3. 취약 +3.',           effects: [{ kind: 'damage', amount: 16 }, { kind: 'apply_enemy', status: 'weak', amount: 3 }, { kind: 'apply_enemy', status: 'vulnerable', amount: 3 }] },
  s_spirit_dance:      { name: '정령의 춤+',        description: '민첩 +3. 1장 드로우.',                   effects: [{ kind: 'apply_self', status: 'dexterity', amount: 3 }, { kind: 'draw', amount: 1 }] },
  s_void_shield:       { name: '공허 방벽+',        description: '방어도 +9. 소멸.',                       effects: [{ kind: 'block', amount: 9 }] },
  s_summon_greater:    { name: '대정령 소환+',      description: '턴 시작 시 힘 +3. 선천.',                effects: [{ kind: 'apply_self', status: 'ritual', amount: 3 }] },
  s_soul_lord:         { name: '영혼의 군주+',      description: '카드 소멸 시 카드 2장 드로우.',           effects: [{ kind: 'apply_self', status: 'on_exhaust_draw', amount: 2 }] },
  s_dimension_collapse:{ name: '차원 붕괴+',        description: '모든 적에게 38 데미지. 소멸.',           effects: [{ kind: 'damage_all', amount: 38 }] },
  s_spirit_frenzy:     { name: '사역마 폭주+',      description: '데미지 = 4 × 이번 전투 누적 공격 수.',   effects: [{ kind: 'damage_per_attack', amount: 4 }] },
  s_reaper_summon:     { name: '사신 소환+',        description: '34 데미지. 처치 시 영구 데미지 +5. 소멸.', effects: [{ kind: 'damage', amount: 34 }], scaling: { kind: 'on_kill', amount: 5 } },
  s_void_explosion:    { name: '공허 폭발+',        description: '15 데미지 3회. 소멸.',                   effects: [{ kind: 'damage', amount: 15, times: 3 }] },
  s_spirit_pact:       { name: '정령 서약+',        description: '민첩 +5. 1장 드로우. 선천.',             effects: [{ kind: 'apply_self', status: 'dexterity', amount: 5 }, { kind: 'draw', amount: 1 }] },
  s_plague_spirit:     { name: '역병 정령+',        description: '모든 적에게 중독 +14. 소멸.',            effects: [{ kind: 'apply_all', status: 'poison', amount: 14 }] },
};

export function summonerGetEffectiveDef(card: CardInstance): CardDef {
  const base = SUMMONER_CARD_DEFS[card.defId];
  if (!card.upgraded) return base;
  const up = SUMMONER_UPGRADE_MAP[card.defId];
  return up ? { ...base, ...up } : base;
}

export function canUpgradeSummoner(card: CardInstance): boolean {
  return (card.upgraded ?? 0) < 2 && card.defId in SUMMONER_UPGRADE_MAP;
}

const SUMMONER_CARD_LIST = Object.values(SUMMONER_CARD_DEFS);
export const SUMMONER_COMMON_CARDS   = SUMMONER_CARD_LIST.filter((c) => c.rarity === 'common');
export const SUMMONER_UNCOMMON_CARDS = SUMMONER_CARD_LIST.filter((c) => c.rarity === 'uncommon');
export const SUMMONER_RARE_CARDS     = SUMMONER_CARD_LIST.filter((c) => c.rarity === 'rare');
