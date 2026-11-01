export type Rarity = 'Common' | 'Uncommon' | 'Rare' | 'Epic' | 'Legendary' | 'Mythic';

export type CodexCategory =
  | 'Bestiary'
  | 'Wildlife'
  | 'Companions & pets'
  | 'NPCs & factions'
  | 'Legendary cast'
  | 'Questlines'
  | 'Weapons'
  | 'Armor & gear'
  | 'Accessories'
  | 'Consumables'
  | 'Ingredients & materials'
  | 'Crafting recipes'
  | 'Spells & techniques'
  | 'World locations, roads, towns & dungeons';

export interface CodexEntry {
  id: string;
  name: string;
  category: CodexCategory;
  rarity: Rarity;
  origin: string;
  classification: string;
  description: string;
  fieldNotes?: string;
  tags: string[];
  icon: string;
  // Optional XML stats for Bestiary
  stats?: {
    hp: number;
    attack: number;
    defense: number;
    speed: number;
    poise: number;
    xpReward: number;
    weakness?: string;
    resistance?: string;
    abilities?: string[];
    drops?: string[];
    boss?: boolean;
    phaseCount?: number;
  };
  // Optional item/recipe/spell attributes
  itemData?: {
    slot?: 'weapon' | 'armor' | 'relic' | 'consumable' | 'material' | string;
    attackBonus?: number;
    defenseBonus?: number;
    poiseBonus?: number;
    umbralBonus?: number;
    critBonus?: number;
    healAmount?: number;
    manaAmount?: number;
    effectDescription?: string;
  };
  recipeData?: {
    resultItemId: string;
    materials: { name: string; count: number }[];
  };
}

export type CombatStance = 'Ashen' | 'Shadow' | 'Void';

export interface PlayerStats {
  level: number;
  xp: number;
  xpToNext: number;
  hp: number;
  maxHp: number;
  stamina: number;
  maxStamina: number;
  mana: number;
  maxMana: number;
  umbralResonance: number; // 0 to 100%
  souls: number;
  // Attributes
  vitality: number;
  strength: number;
  dexterity: number;
  affinity: number;
  fortitude: number;
  unspentPoints: number;
  // Gear
  equippedWeaponId: string;
  equippedArmorId: string;
  equippedRelic1Id: string;
  equippedRelic2Id: string;
  quickSlot1Id: string;
  quickSlot2Id: string;
}

export interface InventoryItem {
  id: string;
  name: string;
  category: 'weapon' | 'armor' | 'relic' | 'consumable' | 'material';
  rarity: Rarity;
  count: number;
  description: string;
  icon: string;
  stats?: {
    attack?: number;
    defense?: number;
    poise?: number;
    umbralBonus?: number;
    crit?: number;
    heal?: number;
    mana?: number;
  };
}

export interface EnemyCombatant {
  id: string;
  name: string;
  title?: string;
  category: string;
  rarity: Rarity;
  maxHp: number;
  hp: number;
  maxPoise: number;
  poise: number;
  attackPower: number;
  defense: number;
  speed: number;
  shadowMarks: number; // 0 to 5 stacks
  isStaggered: boolean;
  staggerTimer: number;
  isTelegraphing: boolean;
  telegraphProgress: number; // 0 to 100
  currentActionName: string;
  isBoss: boolean;
  phase: number;
  maxPhases: number;
  weakness: string;
  drops: string[];
  xpReward: number;
  soulsReward: number;
}

export interface CombatLogEntry {
  id: string;
  text: string;
  type: 'player-hit' | 'enemy-hit' | 'parry' | 'dodge' | 'detonate' | 'stagger' | 'heal' | 'system';
  timestamp: string;
}

export interface ActiveDungeonNode {
  id: string;
  title: string;
  type: 'skirmish' | 'elite' | 'treasure' | 'shrine' | 'boss';
  enemyId?: string;
  completed: boolean;
  rewardText: string;
}
