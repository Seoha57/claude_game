export interface PotionDef {
  id: string;
  name: string;
  description: string;
  target: 'self' | 'enemy';
}

export const POTION_DEFS: Record<string, PotionDef> = {
  health_potion:   { id: 'health_potion',   name: '체력 물약',  description: 'HP +20 회복',           target: 'self' },
  strength_potion: { id: 'strength_potion', name: '힘의 물약',  description: '이번 전투 힘 +5',        target: 'self' },
  block_potion:    { id: 'block_potion',    name: '방어 물약',  description: '방어도 +15',             target: 'self' },
  energy_potion:   { id: 'energy_potion',   name: '에너지 물약',description: '에너지 +2',              target: 'self' },
  poison_potion:   { id: 'poison_potion',   name: '독 물약',    description: '적에게 중독 +8',         target: 'enemy' },
  fire_potion:     { id: 'fire_potion',     name: '화염 물약',  description: '적에게 20 데미지',        target: 'enemy' },
};

export const POTION_LIST = Object.values(POTION_DEFS);
