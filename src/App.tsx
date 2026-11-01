import React, { useState, useEffect } from 'react';
import { PlayerStats, InventoryItem, EnemyCombatant, CodexEntry } from './types/game';
import { CODEX_ENTRIES } from './data/codexData';
import { useSoundEffects } from './hooks/useSoundEffects';
import { HeaderNav } from './components/HeaderNav';
import { CombatArena } from './components/CombatArena';
import { OpenWorldMap } from './components/OpenWorldMap';
import { CodexModal } from './components/CodexModal';
import { CharacterSheet } from './components/CharacterSheet';
import { DungeonMap } from './components/DungeonMap';
import { AlchemyForge } from './components/AlchemyForge';

const DEFAULT_PLAYER: PlayerStats = {
  level: 1,
  xp: 0,
  xpToNext: 150,
  hp: 450,
  maxHp: 450,
  stamina: 100,
  maxStamina: 100,
  mana: 80,
  maxMana: 80,
  umbralResonance: 0,
  souls: 250,
  vitality: 10,
  strength: 12,
  dexterity: 11,
  affinity: 14,
  fortitude: 10,
  unspentPoints: 3,
  equippedWeaponId: 'weap-1',
  equippedArmorId: 'arm-1',
  equippedRelic1Id: 'acc-1',
  equippedRelic2Id: 'acc-2',
  quickSlot1Id: 'con-1',
  quickSlot2Id: 'con-3'
};

const DEFAULT_INVENTORY: InventoryItem[] = [
  {
    id: 'inv-1',
    name: 'Greatsword of Valdor',
    category: 'weapon',
    rarity: 'Rare',
    count: 1,
    description: 'Ceremonial blade of the royal knights. Slow, staggering swings with massive poise damage.',
    icon: '🗡️',
    stats: { attack: 65, poise: 40 }
  },
  {
    id: 'inv-2',
    name: 'Umbral Fang Dagger',
    category: 'weapon',
    rarity: 'Rare',
    count: 1,
    description: 'Forged from shadow glass. Applies double Shadow Mark stacks on critical hits.',
    icon: '🔪',
    stats: { attack: 38, crit: 25 }
  },
  {
    id: 'inv-3',
    name: 'Ashen Knight Full Plate',
    category: 'armor',
    rarity: 'Rare',
    count: 1,
    description: 'Heavy blackened steel forged to resist dragon fire and crushing blows.',
    icon: '🛡️',
    stats: { defense: 45, poise: 35 }
  },
  {
    id: 'inv-4',
    name: 'Voidstrider Shadow Mail',
    category: 'armor',
    rarity: 'Epic',
    count: 1,
    description: 'Lightweight chain interwoven with void threads. Increases dodge invulnerability frames.',
    icon: '🥋',
    stats: { defense: 32, poise: 20 }
  },
  {
    id: 'inv-5',
    name: 'Ring of Umbral Leech',
    category: 'relic',
    rarity: 'Rare',
    count: 1,
    description: 'Restores 4% maximum HP whenever a Shadow Mark is detonated.',
    icon: '💍'
  },
  {
    id: 'inv-6',
    name: 'Ashen Estus Flask',
    category: 'consumable',
    rarity: 'Uncommon',
    count: 6,
    description: 'Restores 150 Health Points immediately.',
    icon: '🧪',
    stats: { heal: 150 }
  },
  {
    id: 'inv-7',
    name: 'Void-Nectar Tonic',
    category: 'consumable',
    rarity: 'Uncommon',
    count: 4,
    description: 'Restores 100 Mana Points for casting Umbral spells.',
    icon: '🍷',
    stats: { mana: 100 }
  },
  // Reagents for crafting
  { id: 'inv-8', name: 'Void Shard', category: 'material', rarity: 'Rare', count: 8, description: 'Crystalline sliver of condensed darkness.', icon: '🟣' },
  { id: 'inv-9', name: 'Star-Iron Ingot', category: 'material', rarity: 'Epic', count: 6, description: 'Smelted from fallen star meteors.', icon: '🔩' },
  { id: 'inv-10', name: 'Gloom Moss', category: 'material', rarity: 'Common', count: 6, description: 'Damp bioluminescent moss.', icon: '🌿' },
  { id: 'inv-11', name: 'Ashen Dust', category: 'material', rarity: 'Common', count: 10, description: 'Fine powdery ash from consumed souls.', icon: '🌫️' },
  { id: 'inv-12', name: 'Titanite Chunk', category: 'material', rarity: 'Uncommon', count: 6, description: 'Dense metamorphic rock essential for smithing.', icon: '🪨' },
  { id: 'inv-13', name: 'Sulphur Brimstone', category: 'material', rarity: 'Common', count: 5, description: 'Volatile mineral powder for explosives.', icon: '🟡' },
  { id: 'inv-14', name: 'Silverleaf Herb', category: 'material', rarity: 'Common', count: 4, description: 'Soothing medicinal plant loved by apothecaries.', icon: '🌱' },
  { id: 'inv-15', name: 'Pure Water Essence', category: 'material', rarity: 'Uncommon', count: 4, description: 'Distilled mountain spring water.', icon: '💧' }
];

export default function App() {
  const audio = useSoundEffects();

  // Active Display Mode: 'overworld' (Tales of Destiny style world exploration) vs 'arena' (real-time combat)
  const [activeMode, setActiveMode] = useState<'overworld' | 'arena'>('overworld');

  // Load saved state or default
  const [player, setPlayer] = useState<PlayerStats>(() => {
    try {
      const saved = localStorage.getItem('valdor_player');
      return saved ? JSON.parse(saved) : DEFAULT_PLAYER;
    } catch {
      return DEFAULT_PLAYER;
    }
  });

  const [inventory, setInventory] = useState<InventoryItem[]>(() => {
    try {
      const saved = localStorage.getItem('valdor_inventory');
      return saved ? JSON.parse(saved) : DEFAULT_INVENTORY;
    } catch {
      return DEFAULT_INVENTORY;
    }
  });

  // Active enemy state
  const [activeEnemy, setActiveEnemy] = useState<EnemyCombatant>(() => {
    const thrall = CODEX_ENTRIES.find(e => e.id === 'mon-01')!;
    return {
      id: thrall.id,
      name: thrall.name,
      title: thrall.classification,
      category: thrall.classification,
      rarity: thrall.rarity,
      maxHp: thrall.stats!.hp,
      hp: thrall.stats!.hp,
      maxPoise: thrall.stats!.poise,
      poise: thrall.stats!.poise,
      attackPower: thrall.stats!.attack,
      defense: thrall.stats!.defense,
      speed: thrall.stats!.speed,
      shadowMarks: 0,
      isStaggered: false,
      staggerTimer: 0,
      isTelegraphing: false,
      telegraphProgress: 0,
      currentActionName: 'Idle',
      isBoss: false,
      phase: 1,
      maxPhases: 1,
      weakness: thrall.stats!.weakness || 'Fire',
      drops: thrall.stats!.drops || ['Ashen Dust'],
      xpReward: thrall.stats!.xpReward,
      soulsReward: thrall.stats!.xpReward * 2
    };
  });

  // Modals state
  const [isCodexOpen, setIsCodexOpen] = useState(false);
  const [isCharacterOpen, setIsCharacterOpen] = useState(false);
  const [isMapOpen, setIsMapOpen] = useState(false);
  const [isForgeOpen, setIsForgeOpen] = useState(false);
  const [forgeTargetRecipeId, setForgeTargetRecipeId] = useState<string | undefined>(undefined);

  // Auto-save
  useEffect(() => {
    try {
      localStorage.setItem('valdor_player', JSON.stringify(player));
      localStorage.setItem('valdor_inventory', JSON.stringify(inventory));
    } catch {
      // ignore
    }
  }, [player, inventory]);

  // Global Keyboard shortcuts: J (Codex), C (Character), M (Vault), K (Forge), Esc (Close all)
  useEffect(() => {
    const handleGlobalKey = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

      if (e.key === 'j' || e.key === 'J') {
        setIsCodexOpen(prev => !prev);
        setIsCharacterOpen(false);
        setIsMapOpen(false);
        setIsForgeOpen(false);
      } else if (e.key === 'c' || e.key === 'C') {
        setIsCharacterOpen(prev => !prev);
        setIsCodexOpen(false);
        setIsMapOpen(false);
        setIsForgeOpen(false);
      } else if (e.key === 'm' || e.key === 'M') {
        setIsMapOpen(prev => !prev);
        setIsCodexOpen(false);
        setIsCharacterOpen(false);
        setIsForgeOpen(false);
      } else if (e.key === 'k' || e.key === 'K') {
        setIsForgeOpen(prev => !prev);
        setIsCodexOpen(false);
        setIsCharacterOpen(false);
        setIsMapOpen(false);
      } else if (e.key === 'Escape') {
        setIsCodexOpen(false);
        setIsCharacterOpen(false);
        setIsMapOpen(false);
        setIsForgeOpen(false);
      }
    };

    window.addEventListener('keydown', handleGlobalKey);
    return () => window.removeEventListener('keydown', handleGlobalKey);
  }, []);

  const handleUpdatePlayer = (updates: Partial<PlayerStats>) => {
    setPlayer(prev => ({ ...prev, ...updates }));
  };

  // Enemy defeated: Drop materials into inventory
  const handleEnemyDefeated = (defeatedEnemy: EnemyCombatant) => {
    if (defeatedEnemy.drops && defeatedEnemy.drops.length > 0) {
      defeatedEnemy.drops.forEach(dropName => {
        setInventory(prev => {
          const existing = prev.find(i => i.name.toLowerCase() === dropName.toLowerCase());
          if (existing) {
            return prev.map(i => i.id === existing.id ? { ...i, count: i.count + 2 } : i);
          } else {
            return [
              ...prev,
              {
                id: Math.random().toString(),
                name: dropName,
                category: 'material',
                rarity: 'Common',
                count: 2,
                description: `Harvested from the remains of ${defeatedEnemy.name}.`,
                icon: '📦'
              }
            ];
          }
        });
      });
    }
  };

  // Equip item from inventory or codex
  const handleEquipItem = (item: InventoryItem | CodexEntry) => {
    const slot = (item as any).itemData?.slot || (item as any).category;
    audio.playChestOpen();
    if (slot === 'weapon') {
      handleUpdatePlayer({ equippedWeaponId: item.id });
    } else if (slot === 'armor') {
      handleUpdatePlayer({ equippedArmorId: item.id });
    } else if (slot === 'relic') {
      handleUpdatePlayer({ equippedRelic1Id: item.id });
    } else if (slot === 'consumable') {
      const healAmt = (item as any).itemData?.healAmount || (item as any).stats?.heal || 120;
      audio.playHeal();
      handleUpdatePlayer({ hp: Math.min(player.maxHp, player.hp + healAmt) });
    }
  };

  // Use consumable from inventory
  const handleUseItem = (item: InventoryItem) => {
    if (item.category !== 'consumable') return;
    audio.playHeal();

    if (item.stats?.heal) {
      handleUpdatePlayer({ hp: Math.min(player.maxHp, player.hp + item.stats.heal) });
    }
    if (item.stats?.mana) {
      handleUpdatePlayer({ mana: Math.min(player.maxMana, player.mana + item.stats.mana) });
    }

    setInventory(prev => {
      return prev
        .map(i => i.id === item.id ? { ...i, count: i.count - 1 } : i)
        .filter(i => i.count > 0);
    });
  };

  // Crafting in forge
  const handleCraftSuccess = (craftedItem: InventoryItem, consumedMaterials: { name: string; count: number }[]) => {
    setInventory(prev => {
      let nextInv = [...prev];
      consumedMaterials.forEach(m => {
        const found = nextInv.find(i => i.name.toLowerCase() === m.name.toLowerCase());
        if (found) {
          found.count -= m.count;
        }
      });
      nextInv = nextInv.filter(i => i.count > 0);

      const existing = nextInv.find(i => i.name.toLowerCase() === craftedItem.name.toLowerCase());
      if (existing && craftedItem.category === 'consumable') {
        existing.count += 1;
      } else {
        nextInv.push(craftedItem);
      }
      return nextInv;
    });
  };

  // Start encounter from overworld or codex
  const handleStartEncounter = (enemy: EnemyCombatant, advantage?: boolean) => {
    setActiveEnemy(enemy);
    setActiveMode('arena');
  };

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-[#07050a] text-[#e2ded8]">
      {/* Top Header Navigation */}
      <HeaderNav
        player={player}
        onOpenCodex={() => setIsCodexOpen(true)}
        onOpenCharacter={() => setIsCharacterOpen(true)}
        onOpenMap={() => setIsMapOpen(true)}
        onOpenForge={() => setIsForgeOpen(true)}
        activeMode={activeMode}
        onToggleMode={mode => setActiveMode(mode)}
        audio={audio}
      />

      {/* Main View Area: Either Open World Exploration (Tales of Destiny style) OR Combat Arena */}
      <main className="flex-1 relative overflow-hidden">
        {activeMode === 'overworld' ? (
          <OpenWorldMap
            player={player}
            onUpdatePlayer={handleUpdatePlayer}
            inventory={inventory}
            onUpdateInventory={setInventory}
            onStartEncounter={handleStartEncounter}
            onOpenCodex={() => setIsCodexOpen(true)}
            onOpenCharacter={() => setIsCharacterOpen(true)}
            onOpenForge={() => setIsForgeOpen(true)}
            audio={audio}
          />
        ) : (
          <CombatArena
            player={player}
            onUpdatePlayer={handleUpdatePlayer}
            activeEnemy={activeEnemy}
            onEnemyDefeated={handleEnemyDefeated}
            onOpenCodex={() => setIsCodexOpen(true)}
            onOpenCharacter={() => setIsCharacterOpen(true)}
            onSelectNewEncounter={() => setIsMapOpen(true)}
            onReturnToWorld={() => setActiveMode('overworld')}
            audio={audio}
          />
        )}
      </main>

      {/* World Codex Modal */}
      <CodexModal
        isOpen={isCodexOpen}
        onClose={() => setIsCodexOpen(false)}
        onEquipItem={handleEquipItem}
        onChallengeMonster={monster => {
          if (!monster.stats) return;
          const combatant: EnemyCombatant = {
            id: monster.id,
            name: monster.name,
            title: monster.classification,
            category: monster.classification,
            rarity: monster.rarity,
            maxHp: monster.stats.hp,
            hp: monster.stats.hp,
            maxPoise: monster.stats.poise,
            poise: monster.stats.poise,
            attackPower: monster.stats.attack,
            defense: monster.stats.defense,
            speed: monster.stats.speed,
            shadowMarks: 0,
            isStaggered: false,
            staggerTimer: 0,
            isTelegraphing: false,
            telegraphProgress: 0,
            currentActionName: 'Idle',
            isBoss: !!monster.stats.boss,
            phase: 1,
            maxPhases: monster.stats.phaseCount || 1,
            weakness: monster.stats.weakness || 'Physical',
            drops: monster.stats.drops || ['Ancient Souls'],
            xpReward: monster.stats.xpReward,
            soulsReward: monster.stats.xpReward * 2
          };
          handleStartEncounter(combatant);
        }}
        onNavigateToForge={recipe => {
          setForgeTargetRecipeId(recipe.id);
          setIsForgeOpen(true);
        }}
      />

      {/* Character Sheet Modal */}
      {isCharacterOpen && (
        <CharacterSheet
          player={player}
          onUpdatePlayer={handleUpdatePlayer}
          inventory={inventory}
          onEquipItem={handleEquipItem}
          onUseItem={handleUseItem}
          onClose={() => setIsCharacterOpen(false)}
        />
      )}

      {/* Expeditions / Dungeon Vault Modal */}
      {isMapOpen && (
        <DungeonMap
          onSelectEncounter={enemy => {
            handleStartEncounter(enemy);
          }}
          onClose={() => setIsMapOpen(false)}
          currentEnemyId={activeEnemy.id}
        />
      )}

      {/* Alchemy Forge Modal */}
      {isForgeOpen && (
        <AlchemyForge
          inventory={inventory}
          onCraftSuccess={handleCraftSuccess}
          onClose={() => setIsForgeOpen(false)}
          selectedRecipeId={forgeTargetRecipeId}
        />
      )}
    </div>
  );
}
