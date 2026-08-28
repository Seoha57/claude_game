import type { CardDef, CardInstance } from '../types';

// 도적 카드 정의
// 시그니처: 독(중독) 누적 · 민첩 · 다단히트 · 어둠
export const THIEF_CARD_DEFS: Record<string, CardDef> = {
  // ── Starter ──
  t_slicer: {
    id: 't_slicer',
    name: '베기',
    type: 'attack', rarity: 'starter', cost: 1, target: 'enemy',
    description: '6 데미지.',
    effects: [{ kind: 'damage', amount: 6 }],
  },
  t_bone_shield: {
    id: 't_bone_shield',
    name: '뼈 방패',
    type: 'skill', rarity: 'starter', cost: 1, target: 'self',
    description: '방어도 +5.',
    effects: [{ kind: 'block', amount: 5 }],
  },

  // ── Common ──
  t_rising_cut: {
    id: 't_rising_cut',
    name: '올려 베기',
    type: 'attack', rarity: 'common', cost: 1, target: 'enemy',
    description: '6 데미지. 직전이 방어카드면 중독 +3.',
    effects: [
      { kind: 'damage', amount: 6 },
      { kind: 'conditional', condition: { kind: 'after_type', type: 'skill' }, then: [{ kind: 'apply_enemy', status: 'poison', amount: 3 }] },
    ],
  },
  t_shining_cut: {
    id: 't_shining_cut',
    name: '섬광 베기',
    type: 'attack', rarity: 'common', cost: 1, target: 'enemy',
    description: '4 데미지 2회.',
    effects: [{ kind: 'damage', amount: 4, times: 2 }],
  },
  t_kunai: {
    id: 't_kunai',
    name: '암기 투척',
    type: 'attack', rarity: 'common', cost: 1, target: 'enemy',
    description: '7 데미지. 1장 드로우.',
    effects: [{ kind: 'damage', amount: 7 }, { kind: 'draw', amount: 1 }],
  },
  t_dark_soul: {
    id: 't_dark_soul',
    name: '암흑의 혼',
    type: 'attack', rarity: 'common', cost: 1, target: 'enemy',
    description: '5 데미지. 중독 +3.',
    effects: [{ kind: 'damage', amount: 5 }, { kind: 'apply_enemy', status: 'poison', amount: 3 }],
  },
  t_ankle_strike: {
    id: 't_ankle_strike',
    name: '발목 타격',
    type: 'attack', rarity: 'common', cost: 1, target: 'enemy',
    description: '6 데미지. 약화 +1.',
    effects: [{ kind: 'damage', amount: 6 }, { kind: 'apply_enemy', status: 'weak', amount: 1 }],
  },
  t_flying_squirrel: {
    id: 't_flying_squirrel',
    name: '날다람쥐',
    type: 'skill', rarity: 'common', cost: 1, target: 'self',
    description: '방어도 +5. 민첩 +1.',
    effects: [{ kind: 'block', amount: 5 }, { kind: 'apply_self', status: 'dexterity', amount: 1 }],
  },
  t_molting: {
    id: 't_molting',
    name: '은신: 허물벗기',
    type: 'skill', rarity: 'common', cost: 1, target: 'self',
    description: '방어도 +8.',
    effects: [{ kind: 'block', amount: 8 }],
  },
  t_shadow_cut: {
    id: 't_shadow_cut',
    name: '그림자 베기',
    type: 'attack', rarity: 'common', cost: 1, target: 'enemy',
    description: '9 데미지. 직전이 공격이면 +4 데미지.',
    effects: [
      { kind: 'damage', amount: 9 },
      { kind: 'conditional', condition: { kind: 'after_type', type: 'attack' }, then: [{ kind: 'damage', amount: 4 }] },
    ],
  },
  t_diving_arrow: {
    id: 't_diving_arrow',
    name: '급강하 일격',
    type: 'attack', rarity: 'common', cost: 2, target: 'enemy',
    description: '14 데미지.',
    effects: [{ kind: 'damage', amount: 14 }],
  },
  t_quick_step: {
    id: 't_quick_step',
    name: '쾌속',
    type: 'skill', rarity: 'common', cost: 0, target: 'self',
    description: '1장 드로우. 민첩 +1.',
    effects: [{ kind: 'draw', amount: 1 }, { kind: 'apply_self', status: 'dexterity', amount: 1 }],
  },
  t_poison_dagger: {
    id: 't_poison_dagger',
    name: '독 단검',
    type: 'attack', rarity: 'common', cost: 0, target: 'enemy',
    description: '3 데미지. 중독 +2.',
    effects: [{ kind: 'damage', amount: 3 }, { kind: 'apply_enemy', status: 'poison', amount: 2 }],
  },
  t_neck_snap: {
    id: 't_neck_snap',
    name: '목 꺾기',
    type: 'attack', rarity: 'common', cost: 1, target: 'enemy',
    description: '10 데미지. 소멸.',
    effects: [{ kind: 'damage', amount: 10 }],
    exhaust: true,
  },
  t_backstab: {
    id: 't_backstab',
    name: '뒤치기',
    type: 'attack', rarity: 'common', cost: 1, target: 'enemy',
    description: '9 데미지. 이번 턴 첫 카드면 +5 데미지.',
    effects: [
      { kind: 'damage', amount: 9 },
      { kind: 'conditional', condition: { kind: 'first_this_turn' }, then: [{ kind: 'damage', amount: 5 }] },
    ],
  },

  // ── Uncommon ──
  t_eraser: {
    id: 't_eraser',
    name: '소거',
    type: 'attack', rarity: 'uncommon', cost: 2, target: 'enemy',
    description: '14 데미지. 중독 +4.',
    effects: [{ kind: 'damage', amount: 14 }, { kind: 'apply_enemy', status: 'poison', amount: 4 }],
  },
  t_curse_spear: {
    id: 't_curse_spear',
    name: '저주의 창',
    type: 'attack', rarity: 'uncommon', cost: 2, target: 'enemy',
    description: '12 데미지. 약화 +2. 취약 +2.',
    effects: [
      { kind: 'damage', amount: 12 },
      { kind: 'apply_enemy', status: 'weak', amount: 2 },
      { kind: 'apply_enemy', status: 'vulnerable', amount: 2 },
    ],
  },
  t_flame_slash: {
    id: 't_flame_slash',
    name: '화염 가르기',
    type: 'attack', rarity: 'uncommon', cost: 1, target: 'enemy',
    description: '8 데미지. 화상 +3.',
    effects: [{ kind: 'damage', amount: 8 }, { kind: 'apply_enemy', status: 'burn', amount: 3 }],
  },
  t_shadow_clone: {
    id: 't_shadow_clone',
    name: '분신',
    type: 'power', rarity: 'uncommon', cost: 1, target: 'self',
    description: '카드 소멸 시 카드 1장 드로우.',
    effects: [{ kind: 'apply_self', status: 'on_exhaust_draw', amount: 1 }],
  },
  t_venom_burst: {
    id: 't_venom_burst',
    name: '독안개 폭발',
    type: 'attack', rarity: 'uncommon', cost: 2, target: 'all_enemies',
    description: '모든 적에게 8 데미지. 중독 +3.',
    effects: [{ kind: 'damage_all', amount: 8 }, { kind: 'apply_all', status: 'poison', amount: 3 }],
  },
  t_assassinate: {
    id: 't_assassinate',
    name: '암살',
    type: 'attack', rarity: 'uncommon', cost: 2, target: 'enemy',
    description: '20 데미지. 약화 +2.',
    effects: [{ kind: 'damage', amount: 20 }, { kind: 'apply_enemy', status: 'weak', amount: 2 }],
  },
  t_dagger_throw: {
    id: 't_dagger_throw',
    name: '연속 투척',
    type: 'attack', rarity: 'uncommon', cost: 1, target: 'enemy',
    description: '4 데미지 3회.',
    effects: [{ kind: 'damage', amount: 4, times: 3 }],
  },
  t_dance: {
    id: 't_dance',
    name: '그림자 춤',
    type: 'skill', rarity: 'uncommon', cost: 1, target: 'self',
    description: '민첩 +2. 1장 드로우.',
    effects: [{ kind: 'apply_self', status: 'dexterity', amount: 2 }, { kind: 'draw', amount: 1 }],
  },
  t_silver_stream: {
    id: 't_silver_stream',
    name: '은빛 흐름',
    type: 'power', rarity: 'uncommon', cost: 1, target: 'self',
    description: '민첩 +2. 턴 종료 시 방어도 +3.',
    effects: [
      { kind: 'apply_self', status: 'dexterity', amount: 2 },
      { kind: 'apply_self', status: 'metallicize', amount: 3 },
    ],
  },
  t_combo_strike: {
    id: 't_combo_strike',
    name: '연계 베기',
    type: 'attack', rarity: 'uncommon', cost: 1, target: 'enemy',
    description: '7 데미지. 이번 턴 2번째 이후 카드면 +9 데미지.',
    effects: [
      { kind: 'damage', amount: 7 },
      { kind: 'conditional', condition: { kind: 'nth_or_more', n: 2 }, then: [{ kind: 'damage', amount: 9 }] },
    ],
  },
  t_grave_curse: {
    id: 't_grave_curse',
    name: '저주의 무덤',
    type: 'skill', rarity: 'uncommon', cost: 1, target: 'enemy',
    description: '중독 +8.',
    effects: [{ kind: 'apply_enemy', status: 'poison', amount: 8 }],
  },
  t_misty_step: {
    id: 't_misty_step',
    name: '안개 걸음',
    type: 'skill', rarity: 'uncommon', cost: 0, target: 'self',
    description: '방어도 +6. 소멸.',
    effects: [{ kind: 'block', amount: 6 }],
    exhaust: true,
  },
  t_toxic_spread: {
    id: 't_toxic_spread',
    name: '맹독 확산',
    type: 'attack', rarity: 'uncommon', cost: 1, target: 'enemy',
    description: '6 데미지. 중독 +5.',
    effects: [
      { kind: 'damage', amount: 6 },
      { kind: 'apply_enemy', status: 'poison', amount: 5 },
    ],
  },

  // ── Rare ──
  t_balakar: {
    id: 't_balakar',
    name: '학살의 망령 소환',
    type: 'power', rarity: 'rare', cost: 2, target: 'self',
    description: '턴 시작 시 힘 +2. 선천.',
    effects: [{ kind: 'apply_self', status: 'ritual', amount: 2 }],
    innate: true,
  },
  t_yasakani: {
    id: 't_yasakani',
    name: '비취 곡옥',
    type: 'attack', rarity: 'rare', cost: 2, target: 'all_enemies',
    description: '모든 적에게 7 데미지 2회.',
    effects: [{ kind: 'damage_all', amount: 7 }, { kind: 'damage_all', amount: 7 }],
  },
  t_death_shadow: {
    id: 't_death_shadow',
    name: '죽음의 그림자',
    type: 'attack', rarity: 'rare', cost: 2, target: 'enemy',
    description: '26 데미지. 처치 시 영구 데미지 +4. 소멸.',
    effects: [{ kind: 'damage', amount: 26 }],
    exhaust: true,
    scaling: { kind: 'on_kill', amount: 4 },
  },
  t_silvermoon: {
    id: 't_silvermoon',
    name: '은월',
    type: 'attack', rarity: 'rare', cost: 1, target: 'enemy',
    description: '데미지 = 3 × 이번 전투 누적 공격 수.',
    effects: [{ kind: 'damage_per_attack', amount: 3 }],
  },
  t_plague: {
    id: 't_plague',
    name: '역병',
    type: 'skill', rarity: 'rare', cost: 2, target: 'all_enemies',
    description: '모든 적에게 중독 +10.',
    effects: [{ kind: 'apply_all', status: 'poison', amount: 10 }],
    exhaust: true,
  },
  t_nightmare: {
    id: 't_nightmare',
    name: '악몽',
    type: 'attack', rarity: 'rare', cost: 3, target: 'enemy',
    description: '12 데미지 3회. 소멸.',
    effects: [{ kind: 'damage', amount: 12, times: 3 }],
    exhaust: true,
  },
  t_phantom_blade: {
    id: 't_phantom_blade',
    name: '환영의 칼날',
    type: 'power', rarity: 'rare', cost: 1, target: 'self',
    description: '민첩 +4. 1장 드로우. 선천.',
    effects: [
      { kind: 'apply_self', status: 'dexterity', amount: 4 },
      { kind: 'draw', amount: 1 },
    ],
    innate: true,
  },
};

// ── Upgrade map ──
export const THIEF_UPGRADE_MAP: Record<string, Partial<CardDef>> = {
  t_slicer:          { name: '베기+',             description: '9 데미지.',                              effects: [{ kind: 'damage', amount: 9 }] },
  t_bone_shield:     { name: '뼈 방패+',         description: '방어도 +8.',                             effects: [{ kind: 'block', amount: 8 }] },
  t_rising_cut:      { name: '올려 베기+',       description: '8 데미지. 직전이 방어카드면 중독 +4.',
                       effects: [{ kind: 'damage', amount: 8 }, { kind: 'conditional', condition: { kind: 'after_type', type: 'skill' }, then: [{ kind: 'apply_enemy', status: 'poison', amount: 4 }] }] },
  t_shining_cut:     { name: '섬광 베기+',       description: '5 데미지 2회.',                          effects: [{ kind: 'damage', amount: 5, times: 2 }] },
  t_kunai:           { name: '암기 투척+',       description: '10 데미지. 1장 드로우.',                 effects: [{ kind: 'damage', amount: 10 }, { kind: 'draw', amount: 1 }] },
  t_dark_soul:       { name: '암흑의 혼+',       description: '7 데미지. 중독 +4.',                     effects: [{ kind: 'damage', amount: 7 }, { kind: 'apply_enemy', status: 'poison', amount: 4 }] },
  t_ankle_strike:    { name: '발목 타격+',       description: '8 데미지. 약화 +2.',                     effects: [{ kind: 'damage', amount: 8 }, { kind: 'apply_enemy', status: 'weak', amount: 2 }] },
  t_flying_squirrel: { name: '날다람쥐+',        description: '방어도 +7. 민첩 +1.',                    effects: [{ kind: 'block', amount: 7 }, { kind: 'apply_self', status: 'dexterity', amount: 1 }] },
  t_molting:         { name: '은신: 허물벗기+',   description: '방어도 +11.',                            effects: [{ kind: 'block', amount: 11 }] },
  t_shadow_cut:      { name: '그림자 베기+',     description: '12 데미지. 직전이 공격이면 +6 데미지.',
                       effects: [{ kind: 'damage', amount: 12 }, { kind: 'conditional', condition: { kind: 'after_type', type: 'attack' }, then: [{ kind: 'damage', amount: 6 }] }] },
  t_diving_arrow:    { name: '급강하 일격+',     description: '19 데미지.',                             effects: [{ kind: 'damage', amount: 19 }] },
  t_quick_step:      { name: '쾌속+',            description: '2장 드로우. 민첩 +1.',                   effects: [{ kind: 'draw', amount: 2 }, { kind: 'apply_self', status: 'dexterity', amount: 1 }] },
  t_poison_dagger:   { name: '독 단검+',          description: '4 데미지. 중독 +3.',                     effects: [{ kind: 'damage', amount: 4 }, { kind: 'apply_enemy', status: 'poison', amount: 3 }] },
  t_neck_snap:       { name: '목 꺾기+',         description: '14 데미지. 소멸.',                       effects: [{ kind: 'damage', amount: 14 }] },
  t_backstab:        { name: '뒤치기+',          description: '12 데미지. 이번 턴 첫 카드면 +7 데미지.',
                       effects: [{ kind: 'damage', amount: 12 }, { kind: 'conditional', condition: { kind: 'first_this_turn' }, then: [{ kind: 'damage', amount: 7 }] }] },
  t_eraser:          { name: '소거+',             description: '18 데미지. 중독 +6.',                    effects: [{ kind: 'damage', amount: 18 }, { kind: 'apply_enemy', status: 'poison', amount: 6 }] },
  t_curse_spear:     { name: '저주의 창+',       description: '16 데미지. 약화 +3. 취약 +3.',           effects: [{ kind: 'damage', amount: 16 }, { kind: 'apply_enemy', status: 'weak', amount: 3 }, { kind: 'apply_enemy', status: 'vulnerable', amount: 3 }] },
  t_flame_slash:     { name: '화염 가르기+',     description: '11 데미지. 화상 +4.',                    effects: [{ kind: 'damage', amount: 11 }, { kind: 'apply_enemy', status: 'burn', amount: 4 }] },
  t_shadow_clone:    { name: '분신+',            description: '카드 소멸 시 카드 2장 드로우.',          effects: [{ kind: 'apply_self', status: 'on_exhaust_draw', amount: 2 }] },
  t_venom_burst:     { name: '독안개 폭발+',     description: '모든 적에게 11 데미지. 중독 +4.',        effects: [{ kind: 'damage_all', amount: 11 }, { kind: 'apply_all', status: 'poison', amount: 4 }] },
  t_assassinate:     { name: '암살+',            description: '26 데미지. 약화 +2.',                    effects: [{ kind: 'damage', amount: 26 }, { kind: 'apply_enemy', status: 'weak', amount: 2 }] },
  t_dagger_throw:    { name: '연속 투척+',        description: '5 데미지 3회.',                          effects: [{ kind: 'damage', amount: 5, times: 3 }] },
  t_dance:           { name: '그림자 춤+',       description: '민첩 +3. 1장 드로우.',                   effects: [{ kind: 'apply_self', status: 'dexterity', amount: 3 }, { kind: 'draw', amount: 1 }] },
  t_silver_stream:   { name: '은빛 흐름+',       description: '민첩 +3. 턴 종료 시 방어도 +5.', effects: [{ kind: 'apply_self', status: 'dexterity', amount: 3 }, { kind: 'apply_self', status: 'metallicize', amount: 5 }] },
  t_combo_strike:    { name: '연계 베기+',       description: '10 데미지. 이번 턴 2번째 이후 카드면 +11 데미지.',
                       effects: [{ kind: 'damage', amount: 10 }, { kind: 'conditional', condition: { kind: 'nth_or_more', n: 2 }, then: [{ kind: 'damage', amount: 11 }] }] },
  t_grave_curse:     { name: '저주의 무덤+',     description: '중독 +12.',                              effects: [{ kind: 'apply_enemy', status: 'poison', amount: 12 }] },
  t_misty_step:      { name: '안개 걸음+',       description: '방어도 +9. 소멸.',                       effects: [{ kind: 'block', amount: 9 }] },
  t_toxic_spread:    { name: '맹독 확산+',       description: '8 데미지. 중독 +7.',                     effects: [{ kind: 'damage', amount: 8 }, { kind: 'apply_enemy', status: 'poison', amount: 7 }] },
  t_balakar:         { name: '학살의 망령 소환+', description: '턴 시작 시 힘 +3. 선천.',           effects: [{ kind: 'apply_self', status: 'ritual', amount: 3 }] },
  t_yasakani:        { name: '비취 곡옥+',       description: '모든 적에게 9 데미지 2회.',              effects: [{ kind: 'damage_all', amount: 9 }, { kind: 'damage_all', amount: 9 }] },
  t_death_shadow:    { name: '죽음의 그림자+',   description: '34 데미지. 처치 시 영구 데미지 +5. 소멸.', effects: [{ kind: 'damage', amount: 34 }], scaling: { kind: 'on_kill', amount: 5 } },
  t_silvermoon:      { name: '은월+',            description: '데미지 = 4 × 이번 전투 누적 공격 수.',   effects: [{ kind: 'damage_per_attack', amount: 4 }] },
  t_plague:          { name: '역병+',            description: '모든 적에게 중독 +14.',                  effects: [{ kind: 'apply_all', status: 'poison', amount: 14 }] },
  t_nightmare:       { name: '악몽+',             description: '15 데미지 3회. 소멸.',                   effects: [{ kind: 'damage', amount: 15, times: 3 }] },
  t_phantom_blade:   { name: '환영의 칼날+',     description: '민첩 +5. 1장 드로우. 선천.',             effects: [{ kind: 'apply_self', status: 'dexterity', amount: 5 }, { kind: 'draw', amount: 1 }] },
};

export function thiefGetEffectiveDef(card: CardInstance): CardDef {
  const base = THIEF_CARD_DEFS[card.defId];
  if (!card.upgraded) return base;
  const up = THIEF_UPGRADE_MAP[card.defId];
  return up ? { ...base, ...up } : base;
}

export function canUpgradeThief(card: CardInstance): boolean {
  return (card.upgraded ?? 0) < 2 && card.defId in THIEF_UPGRADE_MAP;
}

const THIEF_CARD_LIST = Object.values(THIEF_CARD_DEFS);
export const THIEF_COMMON_CARDS   = THIEF_CARD_LIST.filter((c) => c.rarity === 'common');
export const THIEF_UNCOMMON_CARDS = THIEF_CARD_LIST.filter((c) => c.rarity === 'uncommon');
export const THIEF_RARE_CARDS     = THIEF_CARD_LIST.filter((c) => c.rarity === 'rare');
