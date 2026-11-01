import React, { useState, useEffect, useRef, useCallback } from 'react';
import { PlayerStats, EnemyCombatant, InventoryItem, CodexEntry } from '../types/game';
import { CODEX_ENTRIES } from '../data/codexData';
import { SoundEffectsManager } from '../hooks/useSoundEffects';
import { 
  Compass, MapPin, Sparkles, Swords, Shield, Heart, 
  MessageSquare, ShoppingBag, Bed, Flame, ChevronRight, X, User
} from 'lucide-react';

interface OpenWorldMapProps {
  player: PlayerStats;
  onUpdatePlayer: (updates: Partial<PlayerStats>) => void;
  inventory: InventoryItem[];
  onUpdateInventory: React.Dispatch<React.SetStateAction<InventoryItem[]>>;
  onStartEncounter: (enemy: EnemyCombatant, advantage?: boolean) => void;
  onOpenCodex: () => void;
  onOpenCharacter: () => void;
  onOpenForge: () => void;
  audio: SoundEffectsManager;
}

interface OverworldEnemy {
  id: string;
  name: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  icon: string;
  enemyCodexId: string;
  level: number;
}

interface OverworldLocation {
  id: string;
  name: string;
  type: 'town' | 'dungeon' | 'shrine' | 'waystone';
  x: number;
  y: number;
  icon: string;
  desc: string;
  dungeonBossId?: string;
}

interface OverworldNode {
  id: string;
  type: 'chest' | 'mineral' | 'herb' | 'void-fissure';
  x: number;
  y: number;
  name: string;
  looted: boolean;
  rewardItem: string;
}

interface SkitData {
  id: string;
  title: string;
  speaker1: { name: string; avatar: string; quote: string };
  speaker2: { name: string; avatar: string; quote: string };
  speaker3?: { name: string; avatar: string; quote: string };
}

const WORLD_WIDTH = 2400;
const WORLD_HEIGHT = 1800;

export const OpenWorldMap: React.FC<OpenWorldMapProps> = ({
  player,
  onUpdatePlayer,
  inventory,
  onUpdateInventory,
  onStartEncounter,
  onOpenCodex,
  onOpenCharacter,
  onOpenForge,
  audio
}) => {
  // Player Overworld Position (Centered on Plains of the Dawn near Valdor Gatehouse)
  const [playerPos, setPlayerPos] = useState({ x: 500, y: 700 });
  const [playerFacing, setPlayerFacing] = useState<'down' | 'up' | 'left' | 'right'>('down');
  const [isWalking, setIsWalking] = useState(false);
  const keysPressed = useRef<{ [key: string]: boolean }>({});

  // Active Town Hub Modal
  const [activeTown, setActiveTown] = useState<OverworldLocation | null>(null);
  const [townView, setTownView] = useState<'main' | 'inn' | 'shop' | 'talk'>('main');
  const [dialogueText, setDialogueText] = useState<string | null>(null);

  // Active Skit (Tales style banter)
  const [activeSkit, setActiveSkit] = useState<SkitData | null>(null);
  const [pendingSkit, setPendingSkit] = useState<SkitData | null>({
    id: 'skit-1',
    title: 'The Weight of the Shadow Mark',
    speaker1: {
      name: 'Hero of Valdor',
      avatar: '🗡️',
      quote: 'My hand aches with violet flame whenever we draw near the ancient fissures.'
    },
    speaker2: {
      name: 'The Ashen Voice',
      avatar: '👑',
      quote: 'Do not fear the mark, bearer. Consume the marks in combat before they consume your sanity.'
    }
  });

  // World notification banner
  const [fieldNotification, setFieldNotification] = useState<string | null>('Explore the continent of Valdor. WASD / Arrow keys or Click to navigate.');

  // Overworld Landmarks (Towns, Dungeons, Shrines)
  const locations: OverworldLocation[] = [
    {
      id: 'town-valdor',
      name: 'Ashen Haven (Valdor Outpost)',
      type: 'town',
      x: 520,
      y: 650,
      icon: '🏘️',
      desc: 'The last fortified settlement of mortals holding fast against the creeping corruption.'
    },
    {
      id: 'town-harbor',
      name: 'Ashmere Harbor',
      type: 'town',
      x: 1300,
      y: 420,
      icon: '⛵',
      desc: 'Drowned fishing port where smugglers trade star-ore and dried marsh roots.'
    },
    {
      id: 'town-shrine',
      name: 'Hermit’s Sanctuary of the Sun',
      type: 'shrine',
      x: 880,
      y: 1100,
      icon: '☀️',
      desc: 'Consecrated altar keeping the surrounding woods bathed in warm golden daylight.'
    },
    {
      id: 'dung-catacombs',
      name: 'Forsaken Catacombs of the Fallen',
      type: 'dungeon',
      x: 320,
      y: 1120,
      icon: '⚰️',
      desc: 'Labyrinth of ancient crypts where Gorgorath the Bone-Titan slumbers.',
      dungeonBossId: 'mon-11'
    },
    {
      id: 'dung-vaults',
      name: 'Sunken Vaults & Whispering Marshes',
      type: 'dungeon',
      x: 1650,
      y: 850,
      icon: '🌊',
      desc: 'Flooded royal archives infested with Abyssal Fiends and Mire Colossi.',
      dungeonBossId: 'mon-09'
    },
    {
      id: 'dung-loom',
      name: 'The Crimson Loom of Vespera',
      type: 'dungeon',
      x: 1850,
      y: 350,
      icon: '🕸️',
      desc: 'High tower where Arch-Sorceress Vespera weaves nightmare threads.',
      dungeonBossId: 'mon-12'
    },
    {
      id: 'dung-throne',
      name: 'Throne of the Ashen Crown',
      type: 'dungeon',
      x: 2150,
      y: 1350,
      icon: '👑',
      desc: 'The apex of the continent where Malakor the Hollow Sovereign awaits in black flame.',
      dungeonBossId: 'mon-13'
    }
  ];

  // Overworld Interactive Chests & Resource Nodes
  const [nodes, setNodes] = useState<OverworldNode[]>([
    { id: 'n1', type: 'chest', x: 620, y: 780, name: 'Ancient Soldier’s Chest', looted: false, rewardItem: 'Void-Nectar Tonic' },
    { id: 'n2', type: 'mineral', x: 420, y: 550, name: 'Star-Iron Ore Outcrop', looted: false, rewardItem: 'Star-Iron Ingot' },
    { id: 'n3', type: 'herb', x: 750, y: 820, name: 'Bioluminescent Gloom Moss', looted: false, rewardItem: 'Gloom Moss' },
    { id: 'n4', type: 'void-fissure', x: 1100, y: 720, name: 'Pulsing Void Fissure', looted: false, rewardItem: 'Void Shard' },
    { id: 'n5', type: 'chest', x: 1450, y: 520, name: 'Sunken Reliquary Chest', looted: false, rewardItem: 'Amulet of the Ashen Dawn' },
    { id: 'n6', type: 'mineral', x: 1720, y: 1100, name: 'Titanite Deposit', looted: false, rewardItem: 'Titanite Chunk' },
    { id: 'n7', type: 'herb', x: 920, y: 1250, name: 'Silverleaf Meadow', looted: false, rewardItem: 'Silverleaf Herb' },
    { id: 'n8', type: 'chest', x: 2020, y: 1200, name: 'Royal Guard Cache', looted: false, rewardItem: 'Star-Iron Ingot' }
  ]);

  // Roaming Overworld Enemies (Symbol encounters like Tales of Destiny)
  const [roamingEnemies, setRoamingEnemies] = useState<OverworldEnemy[]>([
    { id: 'oe-1', name: 'Corrupted Thrall', x: 700, y: 620, vx: 1, vy: 0, icon: '💀', enemyCodexId: 'mon-01', level: 1 },
    { id: 'oe-2', name: 'Crypt Ghoul', x: 380, y: 950, vx: 0, vy: 1, icon: '🧟', enemyCodexId: 'mon-02', level: 2 },
    { id: 'oe-3', name: 'Ashen Sentry', x: 920, y: 550, vx: -1, vy: 0, icon: '🛡️', enemyCodexId: 'mon-03', level: 3 },
    { id: 'oe-4', name: 'Gloom Stalker', x: 1400, y: 780, vx: 0, vy: -1, icon: '🐺', enemyCodexId: 'mon-04', level: 4 },
    { id: 'oe-5', name: 'Bone Knight', x: 600, y: 1200, vx: 1, vy: 1, icon: '⚔️', enemyCodexId: 'mon-05', level: 5 },
    { id: 'oe-6', name: 'Abyssal Fiend', x: 1700, y: 650, vx: -1, vy: 0, icon: '👹', enemyCodexId: 'mon-07', level: 7 },
    { id: 'oe-7', name: 'Void Drake', x: 1950, y: 920, vx: 0, vy: 1, icon: '🐉', enemyCodexId: 'mon-18', level: 10 }
  ]);

  // Movement loop
  useEffect(() => {
    const interval = setInterval(() => {
      let dx = 0;
      let dy = 0;
      const speed = 7;

      if (keysPressed.current['KeyW'] || keysPressed.current['ArrowUp']) dy -= speed;
      if (keysPressed.current['KeyS'] || keysPressed.current['ArrowDown']) dy += speed;
      if (keysPressed.current['KeyA'] || keysPressed.current['ArrowLeft']) dx -= speed;
      if (keysPressed.current['KeyD'] || keysPressed.current['ArrowRight']) dx += speed;

      if (dx !== 0 || dy !== 0) {
        setIsWalking(true);
        if (Math.abs(dx) > Math.abs(dy)) {
          setPlayerFacing(dx > 0 ? 'right' : 'left');
        } else {
          setPlayerFacing(dy > 0 ? 'down' : 'up');
        }

        setPlayerPos(prev => {
          const newX = Math.max(80, Math.min(WORLD_WIDTH - 80, prev.x + dx));
          const newY = Math.max(80, Math.min(WORLD_HEIGHT - 80, prev.y + dy));
          return { x: newX, y: newY };
        });
      } else {
        setIsWalking(false);
      }

      // Move roaming enemies slightly
      setRoamingEnemies(prev =>
        prev.map(foe => {
          let nx = foe.x + foe.vx * 1.5;
          let ny = foe.y + foe.vy * 1.5;
          let nvx = foe.vx;
          let nvy = foe.vy;

          if (nx < 100 || nx > WORLD_WIDTH - 100) nvx = -nvx;
          if (ny < 100 || ny > WORLD_HEIGHT - 100) nvy = -nvy;

          return { ...foe, x: nx, y: ny, vx: nvx, vy: nvy };
        })
      );
    }, 30);

    return () => clearInterval(interval);
  }, []);

  // Keyboard handlers
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

      keysPressed.current[e.code] = true;

      // Tales style: Space bar = Field Slash (allows pre-emptive strike on nearby roaming monster!)
      if (e.code === 'Space') {
        e.preventDefault();
        handleFieldStrike();
      }

      // Interact [E]
      if (e.code === 'KeyE') {
        handleInteract();
      }

      // Tales Skit Trigger [T]
      if (e.code === 'KeyT' && pendingSkit) {
        triggerSkit(pendingSkit);
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      keysPressed.current[e.code] = false;
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  });

  // Collision with Roaming Enemies (Symbol Encounter)
  useEffect(() => {
    for (const foe of roamingEnemies) {
      const dist = Math.hypot(playerPos.x - foe.x, playerPos.y - foe.y);
      if (dist < 42) {
        // TRIGGER ENCOUNTER!
        audio.playEncounterStart();
        const codexMonster = CODEX_ENTRIES.find(e => e.id === foe.enemyCodexId);
        if (codexMonster && codexMonster.stats) {
          const enemyData: EnemyCombatant = {
            id: codexMonster.id,
            name: codexMonster.name,
            title: codexMonster.classification,
            category: codexMonster.classification,
            rarity: codexMonster.rarity,
            maxHp: codexMonster.stats.hp,
            hp: codexMonster.stats.hp,
            maxPoise: codexMonster.stats.poise,
            poise: codexMonster.stats.poise,
            attackPower: codexMonster.stats.attack,
            defense: codexMonster.stats.defense,
            speed: codexMonster.stats.speed,
            shadowMarks: 0,
            isStaggered: false,
            staggerTimer: 0,
            isTelegraphing: false,
            telegraphProgress: 0,
            currentActionName: 'Idle',
            isBoss: false,
            phase: 1,
            maxPhases: 1,
            weakness: codexMonster.stats.weakness || 'Physical',
            drops: codexMonster.stats.drops || ['Ashen Dust'],
            xpReward: codexMonster.stats.xpReward,
            soulsReward: codexMonster.stats.xpReward * 2
          };

          // Remove that roaming enemy from world map
          setRoamingEnemies(prev => prev.filter(f => f.id !== foe.id));
          onStartEncounter(enemyData, false);
          return;
        }
      }
    }
  }, [playerPos, roamingEnemies]);

  // Field Strike: hitting nearby enemy gives Preemptive Strike Advantage
  const handleFieldStrike = () => {
    audio.playSlash();
    for (const foe of roamingEnemies) {
      const dist = Math.hypot(playerPos.x - foe.x, playerPos.y - foe.y);
      if (dist < 85) {
        audio.playEncounterStart();
        setFieldNotification(`PRE-EMPTIVE STRIKE! Caught ${foe.name} off-guard with advantage!`);

        const codexMonster = CODEX_ENTRIES.find(e => e.id === foe.enemyCodexId);
        if (codexMonster && codexMonster.stats) {
          const enemyData: EnemyCombatant = {
            id: codexMonster.id,
            name: codexMonster.name,
            title: codexMonster.classification,
            category: codexMonster.classification,
            rarity: codexMonster.rarity,
            maxHp: codexMonster.stats.hp,
            hp: Math.round(codexMonster.stats.hp * 0.85), // 15% pre-emptive damage
            maxPoise: codexMonster.stats.poise,
            poise: Math.round(codexMonster.stats.poise * 0.5), // Starts with half poise broken
            attackPower: codexMonster.stats.attack,
            defense: codexMonster.stats.defense,
            speed: codexMonster.stats.speed,
            shadowMarks: 2, // Starts with 2 Shadow Marks pre-applied!
            isStaggered: false,
            staggerTimer: 0,
            isTelegraphing: false,
            telegraphProgress: 0,
            currentActionName: 'Stunned Opening',
            isBoss: false,
            phase: 1,
            maxPhases: 1,
            weakness: codexMonster.stats.weakness || 'Physical',
            drops: codexMonster.stats.drops || ['Ashen Dust'],
            xpReward: codexMonster.stats.xpReward,
            soulsReward: codexMonster.stats.xpReward * 2
          };

          setRoamingEnemies(prev => prev.filter(f => f.id !== foe.id));
          onStartEncounter(enemyData, true);
          return;
        }
      }
    }
  };

  // Interact with Town, Dungeon, Shrine, or Resource Node
  const handleInteract = () => {
    // Check nearby location
    for (const loc of locations) {
      const dist = Math.hypot(playerPos.x - loc.x, playerPos.y - loc.y);
      if (dist < 75) {
        if (loc.type === 'town') {
          audio.playTownEnter();
          setActiveTown(loc);
          setTownView('main');
          setDialogueText(null);
          return;
        } else if (loc.type === 'shrine') {
          audio.playHeal();
          onUpdatePlayer({ hp: player.maxHp, mana: player.maxMana, stamina: player.maxStamina });
          setFieldNotification(`Bathed in sacred solar light at ${loc.name}. Health and Mana fully restored!`);
          return;
        } else if (loc.type === 'dungeon') {
          if (loc.dungeonBossId) {
            audio.playEncounterStart();
            const bossCodex = CODEX_ENTRIES.find(e => e.id === loc.dungeonBossId);
            if (bossCodex && bossCodex.stats) {
              const bossData: EnemyCombatant = {
                id: bossCodex.id,
                name: bossCodex.name,
                title: bossCodex.classification,
                category: bossCodex.classification,
                rarity: bossCodex.rarity,
                maxHp: bossCodex.stats.hp,
                hp: bossCodex.stats.hp,
                maxPoise: bossCodex.stats.poise,
                poise: bossCodex.stats.poise,
                attackPower: bossCodex.stats.attack,
                defense: bossCodex.stats.defense,
                speed: bossCodex.stats.speed,
                shadowMarks: 0,
                isStaggered: false,
                staggerTimer: 0,
                isTelegraphing: false,
                telegraphProgress: 0,
                currentActionName: 'Awakening',
                isBoss: true,
                phase: 1,
                maxPhases: bossCodex.stats.phaseCount || 2,
                weakness: bossCodex.stats.weakness || 'Radiant',
                drops: bossCodex.stats.drops || ['Legendary Crest'],
                xpReward: bossCodex.stats.xpReward,
                soulsReward: bossCodex.stats.xpReward * 2
              };
              onStartEncounter(bossData, false);
            }
          }
          return;
        }
      }
    }

    // Check nearby resource nodes / chests
    for (const node of nodes) {
      if (node.looted) continue;
      const dist = Math.hypot(playerPos.x - node.x, playerPos.y - node.y);
      if (dist < 60) {
        if (node.type === 'chest') {
          audio.playChestOpen();
        } else {
          audio.playHeal();
        }

        // Add reward to inventory
        onUpdateInventory(prev => {
          const existing = prev.find(i => i.name.toLowerCase() === node.rewardItem.toLowerCase());
          if (existing) {
            return prev.map(i => i.id === existing.id ? { ...i, count: i.count + 2 } : i);
          } else {
            return [
              ...prev,
              {
                id: Math.random().toString(),
                name: node.rewardItem,
                category: node.type === 'chest' ? 'consumable' : 'material',
                rarity: 'Rare',
                count: 2,
                description: `Discovered from ${node.name} on the overworld.`,
                icon: node.type === 'chest' ? '🎁' : '💎'
              }
            ];
          }
        });

        setNodes(prev => prev.map(n => n.id === node.id ? { ...n, looted: true } : n));
        setFieldNotification(`Discovered ${node.rewardItem} ×2 from ${node.name}!`);
        return;
      }
    }
  };

  // Skit Trigger
  const triggerSkit = (skit: SkitData) => {
    audio.playSkitChime();
    setActiveSkit(skit);
    setPendingSkit(null);
  };

  // Town Inn Rest
  const handleRestInn = () => {
    audio.playHeal();
    onUpdatePlayer({ hp: player.maxHp, mana: player.maxMana, stamina: player.maxStamina });
    setDialogueText('The innkeeper welcomes you. You slept soundly beside the hearth. Vitality and Mana fully replenished!');
  };

  // Town Shop Buy Potion
  const handleBuyFlask = () => {
    if (player.souls < 50) {
      setDialogueText('Merchant Silas: "You do not have enough souls for this draught, traveler."');
      return;
    }
    audio.playChestOpen();
    onUpdatePlayer({ souls: player.souls - 50 });
    onUpdateInventory(prev => {
      const flask = prev.find(i => i.name === 'Ashen Estus Flask');
      if (flask) {
        return prev.map(i => i.id === flask.id ? { ...i, count: i.count + 1 } : i);
      }
      return [
        ...prev,
        { id: Math.random().toString(), name: 'Ashen Estus Flask', category: 'consumable', rarity: 'Uncommon', count: 1, description: 'Restores 150 HP immediately.', icon: '🧪' }
      ];
    });
    setDialogueText('Merchant Silas: "A fine investment. The shadows burn less when your blood is fortified."');
  };

  // Find nearest point of interest for guidance
  const nearestLoc = locations.reduce((prev, curr) => {
    const dPrev = Math.hypot(playerPos.x - prev.x, playerPos.y - prev.y);
    const dCurr = Math.hypot(playerPos.x - curr.x, playerPos.y - curr.y);
    return dCurr < dPrev ? curr : prev;
  });

  return (
    <div className="relative w-full h-full overflow-hidden select-none bg-[#090b10]">
      {/* 2D / 2.5D Traversable Open World Canvas Viewport */}
      <div 
        className="absolute inset-0 transition-transform duration-75"
        style={{
          transform: `translate(${window.innerWidth / 2 - playerPos.x}px, ${window.innerHeight / 2 - playerPos.y}px)`
        }}
      >
        {/* Continent Surface Base Layer */}
        <div 
          className="relative border-4 border-[#2c223a] shadow-2xl rounded-3xl overflow-hidden"
          style={{ width: `${WORLD_WIDTH}px`, height: `${WORLD_HEIGHT}px` }}
        >
          {/* Biome 1: Plains of the Dawn (Top-Left) */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#121815] via-[#141d1a] to-[#0f1412]" />

          {/* Biome 2: Whispering Marshes (Right side) */}
          <div className="absolute top-0 right-0 w-[1100px] h-full bg-gradient-to-b from-[#131724] via-[#151c2d] to-[#0d121f] opacity-80" />

          {/* Biome 3: The Ashen Reach & Volcanic Fissures (Bottom-Left) */}
          <div className="absolute bottom-0 left-0 w-[1200px] h-[900px] bg-gradient-to-tr from-[#241212] via-[#2d1616] to-transparent opacity-85" />

          {/* Biome 4: The Apex Throne Crags (Bottom-Right) */}
          <div className="absolute bottom-0 right-0 w-[950px] h-[850px] bg-gradient-to-tl from-[#1c0d29] via-[#241334] to-transparent opacity-90" />

          {/* Decorative Cobblestone Highway / Imperial Road Network */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-40">
            {/* Main Road Connecting Towns to Dungeons */}
            <path
              d="M 320 1120 Q 520 650 880 1100 T 1300 420 T 1650 850 T 2150 1350"
              fill="none"
              stroke="#6b5b45"
              strokeWidth="24"
              strokeDasharray="4 8"
              strokeLinecap="round"
            />
            {/* Secondary Bridge Path */}
            <path
              d="M 520 650 L 1300 420 L 1850 350"
              fill="none"
              stroke="#4a3e30"
              strokeWidth="16"
              strokeDasharray="2 6"
            />
          </svg>

          {/* Environmental Terrain Landmarks (Trees, Mountains, Mist) */}
          <div className="absolute top-[300px] left-[700px] text-4xl opacity-50 pointer-events-none">🌲🌲🌲</div>
          <div className="absolute top-[800px] left-[350px] text-4xl opacity-50 pointer-events-none">🪨🌋🪨</div>
          <div className="absolute top-[500px] left-[1500px] text-4xl opacity-50 pointer-events-none">🌿🪷🌿</div>
          <div className="absolute top-[1200px] left-[1800px] text-5xl opacity-40 pointer-events-none">🏰⚡🏰</div>

          {/* Locations (Towns, Dungeons, Shrines) */}
          {locations.map(loc => {
            const isNear = Math.hypot(playerPos.x - loc.x, playerPos.y - loc.y) < 85;
            return (
              <div
                key={loc.id}
                className="absolute flex flex-col items-center -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-transform hover:scale-110"
                style={{ left: `${loc.x}px`, top: `${loc.y}px` }}
                onClick={() => {
                  setPlayerPos({ x: loc.x, y: loc.y + 40 });
                  setTimeout(handleInteract, 150);
                }}
              >
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-3xl shadow-2xl border-2 transition-all ${
                  loc.type === 'town'
                    ? 'bg-amber-950/80 border-amber-500/60 shadow-[0_0_20px_#f59e0b]'
                    : loc.type === 'dungeon'
                    ? 'bg-red-950/80 border-red-500/60 shadow-[0_0_20px_#ef4444]'
                    : 'bg-purple-950/80 border-purple-500/60 shadow-[0_0_20px_#a855f7]'
                }`}>
                  {loc.icon}
                </div>

                <div className="mt-1 px-2.5 py-0.5 bg-black/80 rounded-md border border-stone-700 text-center backdrop-blur-sm whitespace-nowrap">
                  <span className="text-xs font-bold font-heading text-stone-100">{loc.name}</span>
                  <span className="block text-[9px] uppercase font-semibold text-amber-400">{loc.type}</span>
                </div>

                {isNear && (
                  <span className="mt-1 px-2 py-0.5 bg-amber-500 text-stone-900 text-[10px] font-extrabold rounded-full animate-bounce shadow">
                    Press [E] Enter
                  </span>
                )}
              </div>
            );
          })}

          {/* Resource Nodes & Hidden Chests */}
          {nodes.map(node => {
            if (node.looted) return null;
            const isNear = Math.hypot(playerPos.x - node.x, playerPos.y - node.y) < 70;
            return (
              <div
                key={node.id}
                className="absolute flex flex-col items-center -translate-x-1/2 -translate-y-1/2 cursor-pointer animate-pulse"
                style={{ left: `${node.x}px`, top: `${node.y}px` }}
                onClick={handleInteract}
              >
                <div className="w-9 h-9 rounded-xl bg-purple-950/80 border border-purple-400/50 flex items-center justify-center text-lg shadow-lg">
                  {node.type === 'chest' ? '🎁' : node.type === 'mineral' ? '⛏️' : node.type === 'herb' ? '🌿' : '🌀'}
                </div>
                <span className="text-[10px] font-semibold text-stone-300 bg-black/60 px-1.5 py-0.5 rounded mt-0.5">
                  {node.name}
                </span>
                {isNear && (
                  <span className="text-[9px] font-bold bg-amber-400 text-black px-1.5 rounded-full mt-0.5">
                    [E] Gather
                  </span>
                )}
              </div>
            );
          })}

          {/* Roaming Overworld Enemies (Tales of Destiny Symbol Encounters) */}
          {roamingEnemies.map(foe => {
            const isNear = Math.hypot(playerPos.x - foe.x, playerPos.y - foe.y) < 85;
            return (
              <div
                key={foe.id}
                className="absolute flex flex-col items-center -translate-x-1/2 -translate-y-1/2 transition-all duration-100"
                style={{ left: `${foe.x}px`, top: `${foe.y}px` }}
              >
                {/* Aggro / Detection Aura */}
                <div className="w-11 h-11 rounded-full bg-red-950/70 border border-red-500/60 flex items-center justify-center text-2xl shadow-[0_0_15px_#dc2626] animate-pulse">
                  {foe.icon}
                </div>
                <div className="mt-0.5 px-1.5 py-0.2 bg-black/70 rounded text-[9px] text-red-300 font-bold">
                  Lv.{foe.level} {foe.name}
                </div>
                {isNear && (
                  <span className="text-[9px] font-bold text-yellow-300 bg-red-950 px-1.5 rounded-full mt-0.5 animate-bounce">
                    [Space] Strike!
                  </span>
                )}
              </div>
            );
          })}

          {/* Hero Avatar (Tales Style Traveling Sprite) */}
          <div
            className="absolute -translate-x-1/2 -translate-y-1/2 z-20 flex flex-col items-center"
            style={{ left: `${playerPos.x}px`, top: `${playerPos.y}px` }}
          >
            {/* Player Foot Shadow */}
            <div className="w-10 h-3 bg-black/60 rounded-full blur-[2px] mt-10 absolute pointer-events-none" />

            {/* Avatar Sprite */}
            <div className={`w-12 h-12 rounded-2xl bg-[#1d162b] border-2 border-amber-400 flex items-center justify-center text-3xl shadow-[0_0_20px_#d97706] transition-transform ${
              isWalking ? 'scale-105 -translate-y-1' : ''
            }`}>
              🗡️
            </div>

            <div className="mt-1 px-2 py-0.5 bg-black/80 rounded border border-amber-500/40 text-[10px] font-bold text-amber-200 shadow">
              Lv. {player.level} Hero
            </div>
          </div>
        </div>
      </div>

      {/* OVERWORLD HUD OVERLAY */}
      {/* 1. Compass & Landmark Tracker (Top-Left) */}
      <div className="absolute top-4 left-4 z-30 bg-[#0e0c16]/90 border border-[#352c48] p-3 rounded-xl shadow-xl backdrop-blur-md max-w-xs text-xs">
        <div className="flex items-center gap-2 text-amber-300 font-bold mb-1">
          <Compass className="w-4 h-4 text-amber-400 animate-spin" />
          <span>Continent of Valdor</span>
        </div>
        <p className="text-[11px] text-stone-400">
          Nearest Landmark: <strong className="text-stone-200">{nearestLoc.name}</strong> ({Math.round(Math.hypot(playerPos.x - nearestLoc.x, playerPos.y - nearestLoc.y))}m)
        </p>
        <div className="mt-2 pt-2 border-t border-[#261f34] flex items-center justify-between text-[10px] text-stone-400">
          <span>Coords: {Math.round(playerPos.x)}, {Math.round(playerPos.y)}</span>
          <span className="text-amber-400">[Space] Field Strike</span>
        </div>
      </div>

      {/* 2. Tales of Destiny Skit Prompt Button (Bottom-Left) */}
      {pendingSkit && (
        <div className="absolute bottom-6 left-6 z-40 animate-bounce">
          <button
            onClick={() => triggerSkit(pendingSkit)}
            className="px-4 py-2.5 bg-gradient-to-r from-purple-900 to-indigo-900 hover:from-purple-800 hover:to-indigo-800 text-stone-100 border-2 border-purple-400 rounded-xl font-bold text-xs flex items-center gap-2.5 shadow-2xl cursor-pointer"
          >
            <MessageSquare className="w-4 h-4 text-amber-300" />
            <span>💬 Skit: {pendingSkit.title} [T]</span>
          </button>
        </div>
      )}

      {/* 3. Field Notification Ticker (Top-Center) */}
      {fieldNotification && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-30 px-4 py-1.5 bg-[#120f1e]/90 border border-amber-500/40 rounded-full text-xs font-semibold text-amber-200 shadow-xl backdrop-blur-md animate-in fade-in flex items-center gap-2">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>{fieldNotification}</span>
        </div>
      )}

      {/* 4. Tales Style Character Skit Modal Dialog */}
      {activeSkit && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-2xl bg-[#120e1c] border-2 border-purple-500/60 rounded-2xl shadow-2xl overflow-hidden p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#2d243c]">
              <div className="flex items-center gap-2">
                <span className="text-xs px-2 py-0.5 rounded bg-purple-950 text-purple-300 border border-purple-500/40 uppercase font-bold">
                  Party Skit
                </span>
                <h3 className="text-base font-bold font-heading text-amber-200">{activeSkit.title}</h3>
              </div>
              <button
                onClick={() => setActiveSkit(null)}
                className="text-stone-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Skit Comic Frame 1 */}
            <div className="p-4 bg-[#191326] border border-[#3b3052] rounded-xl flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-purple-950 border border-purple-400 flex items-center justify-center text-3xl shrink-0">
                {activeSkit.speaker1.avatar}
              </div>
              <div>
                <h4 className="text-xs font-bold text-amber-300">{activeSkit.speaker1.name}</h4>
                <p className="text-sm text-stone-200 italic mt-1 font-serif">"{activeSkit.speaker1.quote}"</p>
              </div>
            </div>

            {/* Skit Comic Frame 2 */}
            <div className="p-4 bg-[#191326] border border-[#3b3052] rounded-xl flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-amber-950 border border-amber-400 flex items-center justify-center text-3xl shrink-0">
                {activeSkit.speaker2.avatar}
              </div>
              <div>
                <h4 className="text-xs font-bold text-amber-300">{activeSkit.speaker2.name}</h4>
                <p className="text-sm text-stone-200 italic mt-1 font-serif">"{activeSkit.speaker2.quote}"</p>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setActiveSkit(null)}
                className="px-4 py-1.5 bg-purple-700 hover:bg-purple-600 text-white font-bold rounded-lg text-xs cursor-pointer shadow"
              >
                End Skit
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 5. Tales Style Town Hub Modal (When Entering Settlement) */}
      {activeTown && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in">
          <div className="w-full max-w-3xl bg-[#100c18] border-2 border-amber-500/50 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
            {/* Town Banner Header */}
            <div className="px-6 py-4 bg-[#171224] border-b border-[#2e263d] flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-3xl">{activeTown.icon}</span>
                <div>
                  <h3 className="text-lg font-bold font-heading text-amber-200">{activeTown.name}</h3>
                  <p className="text-xs text-stone-400">{activeTown.desc}</p>
                </div>
              </div>

              <button
                onClick={() => setActiveTown(null)}
                className="px-3 py-1 bg-stone-800 hover:bg-stone-700 text-stone-300 text-xs font-bold rounded-lg cursor-pointer"
              >
                Depart Town
              </button>
            </div>

            {/* Town Hub Navigation Tabs */}
            <div className="flex items-center gap-2 px-6 py-2 bg-[#0c0914] border-b border-[#251f33] text-xs">
              <button
                onClick={() => { setTownView('main'); setDialogueText(null); }}
                className={`px-3 py-1.5 rounded font-bold cursor-pointer ${townView === 'main' ? 'bg-amber-600 text-stone-900' : 'text-stone-400 hover:text-stone-200'}`}
              >
                Town Square
              </button>
              <button
                onClick={() => setTownView('inn')}
                className={`px-3 py-1.5 rounded font-bold flex items-center gap-1.5 cursor-pointer ${townView === 'inn' ? 'bg-amber-600 text-stone-900' : 'text-stone-400 hover:text-stone-200'}`}
              >
                <Bed className="w-3.5 h-3.5" /> Wayfarer’s Inn
              </button>
              <button
                onClick={() => setTownView('shop')}
                className={`px-3 py-1.5 rounded font-bold flex items-center gap-1.5 cursor-pointer ${townView === 'shop' ? 'bg-amber-600 text-stone-900' : 'text-stone-400 hover:text-stone-200'}`}
              >
                <ShoppingBag className="w-3.5 h-3.5" /> Silas’s Bazaar
              </button>
              <button
                onClick={() => {
                  setActiveTown(null);
                  onOpenForge();
                }}
                className="px-3 py-1.5 text-stone-400 hover:text-orange-300 font-bold flex items-center gap-1.5 cursor-pointer ml-auto"
              >
                <Flame className="w-3.5 h-3.5 text-orange-400" /> Master Vane’s Forge
              </button>
            </div>

            {/* Town Content Body */}
            <div className="p-6 overflow-y-auto space-y-4 flex-1 bg-[#100c18]">
              {dialogueText && (
                <div className="p-4 bg-[#1b1526] border-l-4 border-amber-500 rounded-r-lg text-sm text-stone-200 font-serif italic animate-in fade-in">
                  "{dialogueText}"
                </div>
              )}

              {townView === 'main' && (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div 
                    onClick={() => setTownView('inn')}
                    className="p-4 bg-[#161122] border border-[#332a44] rounded-xl hover:border-amber-500/50 cursor-pointer space-y-2 text-center"
                  >
                    <Bed className="w-8 h-8 text-amber-400 mx-auto" />
                    <h4 className="text-sm font-bold text-stone-200">The Hearth Inn</h4>
                    <p className="text-xs text-stone-400">Rest your spirit to restore all HP, Stamina, and Mana.</p>
                  </div>

                  <div 
                    onClick={() => setTownView('shop')}
                    className="p-4 bg-[#161122] border border-[#332a44] rounded-xl hover:border-amber-500/50 cursor-pointer space-y-2 text-center"
                  >
                    <ShoppingBag className="w-8 h-8 text-yellow-400 mx-auto" />
                    <h4 className="text-sm font-bold text-stone-200">Merchant Silas</h4>
                    <p className="text-xs text-stone-400">Barter for restorative elixirs, whetstones, and bombs.</p>
                  </div>

                  <div 
                    onClick={() => {
                      setActiveTown(null);
                      onOpenForge();
                    }}
                    className="p-4 bg-[#161122] border border-[#332a44] rounded-xl hover:border-orange-500/50 cursor-pointer space-y-2 text-center"
                  >
                    <Flame className="w-8 h-8 text-orange-400 mx-auto" />
                    <h4 className="text-sm font-bold text-stone-200">Blacksmith Vane</h4>
                    <p className="text-xs text-stone-400">Reforge weapons and synthesize armor from codex recipes.</p>
                  </div>
                </div>
              )}

              {townView === 'inn' && (
                <div className="p-6 bg-[#161122] border border-[#362b48] rounded-xl space-y-4 text-center max-w-md mx-auto">
                  <Bed className="w-12 h-12 text-amber-400 mx-auto" />
                  <h4 className="text-base font-bold font-heading text-amber-200">Rest at the Hearth</h4>
                  <p className="text-xs text-stone-300">
                    Warm your chilled hands by the holy braziers. Restores 100% of your maximum Health, Mana, and Stamina.
                  </p>
                  <button
                    onClick={handleRestInn}
                    className="px-6 py-2.5 bg-amber-600 hover:bg-amber-500 text-stone-900 font-extrabold rounded-xl text-xs cursor-pointer shadow-lg"
                  >
                    Rest & Rekindle Embers (Free)
                  </button>
                </div>
              )}

              {townView === 'shop' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between pb-2 border-b border-[#2d243c]">
                    <span className="text-xs font-bold text-stone-300">Silas’s Wares</span>
                    <span className="text-xs text-yellow-400 font-bold">Your Balance: {player.souls} Souls</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="p-3 bg-[#161122] border border-[#302640] rounded-xl flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">🧪</span>
                        <div>
                          <h5 className="text-xs font-bold text-stone-200">Ashen Estus Flask</h5>
                          <span className="text-[11px] text-stone-400">Heals 150 HP in battle</span>
                        </div>
                      </div>
                      <button
                        onClick={handleBuyFlask}
                        className="px-3 py-1.5 bg-amber-600 hover:bg-amber-500 text-stone-900 font-bold rounded text-xs cursor-pointer"
                      >
                        Buy 50 Souls
                      </button>
                    </div>

                    <div className="p-3 bg-[#161122] border border-[#302640] rounded-xl flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">🍷</span>
                        <div>
                          <h5 className="text-xs font-bold text-stone-200">Void-Nectar Tonic</h5>
                          <span className="text-[11px] text-stone-400">Restores 100 Mana</span>
                        </div>
                      </div>
                      <button
                        onClick={handleBuyFlask}
                        className="px-3 py-1.5 bg-amber-600 hover:bg-amber-500 text-stone-900 font-bold rounded text-xs cursor-pointer"
                      >
                        Buy 50 Souls
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
