import type { RelicDef } from '../types';

export const RELIC_DEFS: Record<string, RelicDef> = {
  burning_blood: {
    id: 'burning_blood',
    name: '불타는 피',
    description: '전투 종료 시 6 회복.',
    rarity: 'starter',
  },
  vajra: {
    id: 'vajra',
    name: '바즈라',
    description: '전투 시작 시 힘 +1.',
    rarity: 'common',
  },
  anchor: {
    id: 'anchor',
    name: '닻',
    description: '전투 시작 시 방어도 +10.',
    rarity: 'common',
  },
  bag_of_marbles: {
    id: 'bag_of_marbles',
    name: '구슬 주머니',
    description: '전투 시작 시 모든 적에게 취약 +1.',
    rarity: 'common',
  },
  pen_nib: {
    id: 'pen_nib',
    name: '펜촉',
    description: '매 10번째 공격은 데미지 2배.',
    rarity: 'uncommon',
  },
  blood_vial: {
    id: 'blood_vial',
    name: '피의 약병',
    description: '전투 종료 시 추가로 2 회복.',
    rarity: 'common',
  },
  oddly_smooth_stone: {
    id: 'oddly_smooth_stone',
    name: '매끈한 돌',
    description: '전투 시작 시 민첩 +1.',
    rarity: 'common',
  },
  meat_on_the_bone: {
    id: 'meat_on_the_bone',
    name: '뼈에 붙은 고기',
    description: '전투 종료 시 HP가 50% 이하면 12 회복.',
    rarity: 'uncommon',
  },
  fighting_spirit: {
    id: 'fighting_spirit',
    name: '투혼',
    description: '전투 시작 시 힘 +2.',
    rarity: 'starter',
  },
  mage_orb: {
    id: 'mage_orb',
    name: '마탑의 결정',
    description: '매 턴 시작 시 무작위 적에게 3 데미지.',
    rarity: 'starter',
  },
  holy_chalice: {
    id: 'holy_chalice',
    name: '성배',
    description: '전투 시작 시 재생 +4.',
    rarity: 'starter',
  },

  // ── Common ──
  frozen_dart: {
    id: 'frozen_dart',
    name: '얼린 표창',
    description: '전투 시작 시 모든 적에게 약화 +1.',
    rarity: 'common',
  },
  thick_hide: {
    id: 'thick_hide',
    name: '단단한 가죽',
    description: '전투 시작 시 금속화 +2 (턴 종료 시 방어도 +2).',
    rarity: 'common',
  },
  holy_charm: {
    id: 'holy_charm',
    name: '신성한 부적',
    description: '전투 시작 시 카드 1장 추가로 드로우.',
    rarity: 'common',
  },

  spiked_armor: {
    id: 'spiked_armor',
    name: '가시 갑옷',
    description: '전투 시작 시 가시 +3.',
    rarity: 'common',
  },
  sturdy_boots: {
    id: 'sturdy_boots',
    name: '견고한 장화',
    description: '전투 시작 시 방어도 +6.',
    rarity: 'common',
  },
  kinetic_belt: {
    id: 'kinetic_belt',
    name: '운동 벨트',
    description: '전투 시작 시 민첩 +2.',
    rarity: 'common',
  },

  // ── Uncommon ──
  rich_seal: {
    id: 'rich_seal',
    name: '부유한 상인의 인장',
    description: '전투 승리 시 골드 +8.',
    rarity: 'uncommon',
  },
  herb_pouch: {
    id: 'herb_pouch',
    name: '약초 주머니',
    description: '전투 종료 시 추가로 5 회복.',
    rarity: 'uncommon',
  },
  fury_banner: {
    id: 'fury_banner',
    name: '격노의 깃발',
    description: '전투 시작 시 힘 +3.',
    rarity: 'uncommon',
  },
  soul_lantern: {
    id: 'soul_lantern',
    name: '영혼의 등불',
    description: '전투 종료 시 추가로 8 회복.',
    rarity: 'uncommon',
  },
  phoenix_feather: {
    id: 'phoenix_feather',
    name: '불사조 깃털',
    description: '전투 시작 시 재생 +5.',
    rarity: 'uncommon',
  },
  storm_banner: {
    id: 'storm_banner',
    name: '폭풍의 깃발',
    description: '매 턴 시작 시 방어도 +4.',
    rarity: 'uncommon',
  },

  // ── Rare ──
  hourglass: {
    id: 'hourglass',
    name: '시간의 모래시계',
    description: '매 턴 시작 시 카드 1장 추가로 드로우.',
    rarity: 'rare',
  },
  demon_seal: {
    id: 'demon_seal',
    name: '악마의 인장',
    description: '매 턴 시작 시 힘 +1.',
    rarity: 'rare',
  },
  eternal_hourglass: {
    id: 'eternal_hourglass',
    name: '영원한 모래시계',
    description: '매 턴 시작 시 카드 2장 추가로 드로우.',
    rarity: 'rare',
  },
  storm_core: {
    id: 'storm_core',
    name: '폭풍의 핵',
    description: '매 턴 시작 시 무작위 적에게 6 데미지.',
    rarity: 'rare',
  },
  champion_belt: {
    id: 'champion_belt',
    name: '챔피언 벨트',
    description: '전투 시작 시 힘 +1, 민첩 +1.',
    rarity: 'rare',
  },

  // ── Boss relics ──
  energy_core: {
    id: 'energy_core',
    name: '에너지 코어',
    description: '최대 에너지 +1. 최대 HP -6.',
    rarity: 'boss',
  },
  iron_will: {
    id: 'iron_will',
    name: '강철 의지',
    description: '전투 시작 시 힘 +4.',
    rarity: 'boss',
  },
  dragon_scale: {
    id: 'dragon_scale',
    name: '용의 비늘',
    description: '전투 시작 시 방어도 +20.',
    rarity: 'boss',
  },
  warriors_heart: {
    id: 'warriors_heart',
    name: '전사의 심장',
    description: '최대 HP +20.',
    rarity: 'boss',
  },
  doom_ring: {
    id: 'doom_ring',
    name: '파멸의 반지',
    description: '최대 에너지 +1. 덱에 상처 2장 추가.',
    rarity: 'boss',
  },
  adrenaline_surge: {
    id: 'adrenaline_surge',
    name: '아드레날린',
    description: '전투 시작 시 에너지 +1, 카드 1장 드로우.',
    rarity: 'boss',
  },
};

export const RELIC_LIST = Object.values(RELIC_DEFS);
export const PICKABLE_RELICS = RELIC_LIST.filter((r) => r.rarity !== 'starter' && r.rarity !== 'boss');
export const BOSS_RELICS = RELIC_LIST.filter((r) => r.rarity === 'boss');
