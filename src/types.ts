export type CardType = 'attack' | 'skill' | 'power';
export type CardRarity = 'starter' | 'common' | 'uncommon' | 'rare';
export type CardTarget = 'enemy' | 'self' | 'all_enemies' | 'random_enemy' | 'none';

export type StatusKey =
  | 'strength'
  | 'dexterity'
  | 'vulnerable'
  | 'weak'
  | 'poison'
  | 'thorns'
  | 'regen'
  | 'frail'
  | 'ritual'
  | 'metallicize'
  | 'burn'
  | 'freeze'
  | 'on_exhaust_str'
  | 'on_exhaust_draw'
  | 'on_exhaust_block'
  | 'on_exhaust_energy';

export type Effect =
  | { kind: 'damage'; amount: number; times?: number }
  | { kind: 'damage_all'; amount: number }
  | { kind: 'block'; amount: number }
  | { kind: 'block_all_enemies_attack_lose' } // unused placeholder
  | { kind: 'draw'; amount: number }
  | { kind: 'energy'; amount: number }
  | { kind: 'apply_self'; status: StatusKey; amount: number }
  | { kind: 'apply_enemy'; status: StatusKey; amount: number }
  | { kind: 'apply_all'; status: StatusKey; amount: number }
  | { kind: 'heal'; amount: number }
  | { kind: 'lose_hp'; amount: number }
  | { kind: 'exhaust_random_hand' }
  | { kind: 'discard_random'; amount: number };

export interface CardDef {
  id: string;
  name: string;
  type: CardType;
  rarity: CardRarity;
  cost: number;
  target: CardTarget;
  description: string;
  effects: Effect[];
  exhaust?: boolean;
  ethereal?: boolean; // exhausts at end of turn if not played
  innate?: boolean;   // always in opening hand
  retain?: boolean;   // stays in hand at end of turn (not discarded)
  // Permanent damage scaling — applied to the same CardInstance across combats
  scaling?: {
    kind: 'on_play' | 'on_kill';
    amount: number; // bonus damage added per trigger
  };
}

export interface CardInstance {
  uid: string;
  defId: string;
  upgraded?: number; // 0/undefined = base, 1 = +, 2 = ++ (이중 강화)
  bonusDamage?: number; // accumulated permanent scaling damage
}

export type Statuses = Partial<Record<StatusKey, number>>;

export interface Combatant {
  hp: number;
  maxHp: number;
  block: number;
  statuses: Statuses;
}

export interface Player extends Combatant {
  energy: number;
  maxEnergy: number;
  gold: number;
  deck: CardInstance[];
  draw: CardInstance[];
  hand: CardInstance[];
  discard: CardInstance[];
  exhaust: CardInstance[];
  relics: string[];
  potions: string[];
  keys: string[]; // 'will' | 'emotion' | 'body'
}

export type IntentKind =
  | 'attack'
  | 'attack_block'
  | 'attack_buff'
  | 'block'
  | 'buff'
  | 'debuff'
  | 'unknown';

export interface Intent {
  kind: IntentKind;
  damage?: number;
  hits?: number;
  block?: number;
  label?: string;
}

export interface EnemyDef {
  id: string;
  name: string;
  hpRange: [number, number];
  isBoss?: boolean;
  decideIntent: (state: CombatState, self: Enemy, turn: number) => Intent;
  act: (state: CombatState, self: Enemy) => void;
  // Phase change triggered once when HP drops to ≤ 50%
  onHalfHp?: (state: CombatState, self: Enemy) => string; // returns short flavor text
}

export interface Enemy extends Combatant {
  uid: string;
  defId: string;
  intent: Intent;
  turn: number;
  phaseTriggered?: boolean;
}

export interface CombatState {
  player: Player;
  enemies: Enemy[];
  turn: number;
  phase: 'start' | 'player' | 'enemy_telegraph' | 'enemy_act' | 'won' | 'lost';
  log: string[];
  rng: () => number;
  flags: {
    firstAttackThisTurn?: boolean;
    // Signature relic counters (per combat unless noted)
    attackCount?: number;             // total hits this combat (pen_nib, 귀혼, 탄창)
    cardsPlayedThisTurn?: number;     // resets each turn (일심)
    lastPlayedType?: CardType;        // persists in combat (원소 공명)
    fighterProcThisTurn?: boolean;    // 일심 procced once this turn
  };
}

export type NodeKind = 'combat' | 'elite' | 'rest' | 'reward' | 'shop' | 'boss' | 'start' | 'event';

export interface MapNode {
  id: string;
  kind: NodeKind;
  x: number;
  y: number;
  next: string[];
  visited: boolean;
}

export type Screen = 'title' | 'character_select' | 'map' | 'combat' | 'reward' | 'rest' | 'shop' | 'chapter_clear' | 'win' | 'lose' | 'event' | 'true_ending_choice' | 'true_win' | 'stats' | 'help' | 'codex' | 'achievements' | 'neow_blessing';

export type CharacterClass = 'swordmaster' | 'gunner' | 'fighter' | 'magician' | 'priest';

export interface RewardChoice {
  cards: string[]; // card def ids
  gold: number;
  relicId?: string;
}

export interface RunState {
  player: Player;
  map: MapNode[];
  currentNodeId: string | null;
  floor: number;
  seed: number;
  chapter: number;
  ascension: number;
  characterClass: CharacterClass;
  combatEnemyDefIds?: string[];
  reward?: RewardChoice;
  pendingNextScreen?: Screen;
}

export interface RelicDef {
  id: string;
  name: string;
  description: string;
  rarity: 'starter' | 'common' | 'uncommon' | 'rare' | 'boss';
}
