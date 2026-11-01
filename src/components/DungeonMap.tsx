import React from 'react';
import { EnemyCombatant } from '../types/game';
import { CODEX_ENTRIES } from '../data/codexData';
import { MapPin, Swords, Shield, Skull, Award, Compass, Eye, Sparkles } from 'lucide-react';

interface DungeonMapProps {
  onSelectEncounter: (enemy: EnemyCombatant) => void;
  onClose: () => void;
  currentEnemyId: string;
}

interface DungeonZone {
  id: string;
  name: string;
  act: string;
  description: string;
  recommendedLevel: number;
  icon: string;
  monsters: { id: string; name: string; title: string; isBoss?: boolean; icon: string }[];
}

const DUNGEON_ZONES: DungeonZone[] = [
  {
    id: 'zone-1',
    name: 'The Forsaken Catacombs & Ashen Reach',
    act: 'Act I',
    description: 'Choked with the dust of fallen pilgrims and prowling ghouls.',
    recommendedLevel: 1,
    icon: '🌋',
    monsters: [
      { id: 'mon-01', name: 'Corrupted Thrall', title: 'Undead Humanoid', icon: '💀' },
      { id: 'mon-02', name: 'Crypt Ghoul', title: 'Abyssal Scavenger', icon: '🧟' },
      { id: 'mon-05', name: 'Bone Knight', title: 'Elite Skeletal Champion', icon: '⚔️' },
      { id: 'mon-11', name: 'Gorgorath the Unbroken Bone-Titan', title: 'Colossal Undead Dungeon Boss', isBoss: true, icon: '☠️' }
    ]
  },
  {
    id: 'zone-2',
    name: 'Sunken Vaults & Whispering Marshes',
    act: 'Act II',
    description: 'Flooded library corridors infested with abyssal abominations.',
    recommendedLevel: 5,
    icon: '🌊',
    monsters: [
      { id: 'mon-04', name: 'Gloom Stalker', title: 'Umbral Beast', icon: '🐺' },
      { id: 'mon-06', name: 'Void Cultist', title: 'Abyssal Heretic', icon: '🔮' },
      { id: 'mon-07', name: 'Abyssal Fiend', title: 'Lesser Demon', icon: '👹' },
      { id: 'mon-09', name: 'Mire Leech-Colossus', title: 'Bloated Monstrosity', isBoss: true, icon: '🪱' }
    ]
  },
  {
    id: 'zone-3',
    name: 'Weeping Gallery & The Crimson Loom',
    act: 'Act III',
    description: 'The opulent upper sanctum where Arch-Sorceress Vespera weaves nightmare threads.',
    recommendedLevel: 9,
    icon: '🕸️',
    monsters: [
      { id: 'mon-10', name: 'Spectral Maiden', title: 'Drowned Court Wraith', icon: '👻' },
      { id: 'mon-03', name: 'Ashen Sentry', title: 'Construct of Black Iron', icon: '🛡️' },
      { id: 'mon-12', name: 'Vespera the Shadow Weaver', title: 'Arch-Sorceress of the Eclipse', isBoss: true, icon: '🕸️' }
    ]
  },
  {
    id: 'zone-4',
    name: 'Throne of the Ashen Crown',
    act: 'Act IV',
    description: 'The shattered summit where King Malakor sits bound to the Void.',
    recommendedLevel: 14,
    icon: '👑',
    monsters: [
      { id: 'mon-13', name: 'Malakor the Hollow Sovereign', title: 'Fallen God-King Boss', isBoss: true, icon: '👑' }
    ]
  }
];

export const DungeonMap: React.FC<DungeonMapProps> = ({
  onSelectEncounter,
  onClose,
  currentEnemyId
}) => {
  const handleLaunchCombat = (monsterId: string) => {
    const codexEntry = CODEX_ENTRIES.find(e => e.id === monsterId);
    if (!codexEntry || !codexEntry.stats) return;

    const combatant: EnemyCombatant = {
      id: codexEntry.id,
      name: codexEntry.name,
      title: codexEntry.classification,
      category: codexEntry.classification,
      rarity: codexEntry.rarity,
      maxHp: codexEntry.stats.hp,
      hp: codexEntry.stats.hp,
      maxPoise: codexEntry.stats.poise,
      poise: codexEntry.stats.poise,
      attackPower: codexEntry.stats.attack,
      defense: codexEntry.stats.defense,
      speed: codexEntry.stats.speed,
      shadowMarks: 0,
      isStaggered: false,
      staggerTimer: 0,
      isTelegraphing: false,
      telegraphProgress: 0,
      currentActionName: 'Idle',
      isBoss: !!codexEntry.stats.boss,
      phase: 1,
      maxPhases: codexEntry.stats.phaseCount || 1,
      weakness: codexEntry.stats.weakness || 'Radiant',
      drops: codexEntry.stats.drops || ['Ancient Souls'],
      xpReward: codexEntry.stats.xpReward,
      soulsReward: codexEntry.stats.xpReward * 2
    };

    onSelectEncounter(combatant);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-5xl h-[88vh] flex flex-col bg-[#0d0a13] border border-[#3c3250] rounded-xl shadow-2xl overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#2d243c] bg-[#14101e]">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-950/40 border border-purple-500/30 rounded-lg text-purple-400">
              <Compass className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold font-heading text-amber-200 tracking-wider">
                REALM EXPEDITIONS & ENCOUNTER VAULT
              </h2>
              <div className="flex items-center gap-2 text-xs text-stone-400">
                <span>Select a destination to initiate tactical dark combat</span>
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            className="px-3 py-1.5 bg-stone-800 hover:bg-stone-700 text-stone-300 text-xs font-semibold rounded-lg transition-colors cursor-pointer"
          >
            Close [ESC]
          </button>
        </div>

        {/* Zones Grid */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-[#0c0912]">
          {DUNGEON_ZONES.map(zone => (
            <div
              key={zone.id}
              className="p-5 bg-[#14101e] border border-[#2e263d] rounded-xl space-y-4 hover:border-amber-500/30 transition-all shadow-lg"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[#271f34]">
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{zone.icon}</span>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-amber-400 bg-amber-950/40 px-2 py-0.5 rounded border border-amber-500/30">
                        {zone.act}
                      </span>
                      <h3 className="text-base font-bold font-heading text-stone-100">{zone.name}</h3>
                    </div>
                    <p className="text-xs text-stone-400 mt-0.5">{zone.description}</p>
                  </div>
                </div>

                <div className="text-xs text-stone-400">
                  Recommended Level: <strong className="text-amber-300">Lv. {zone.recommendedLevel}+</strong>
                </div>
              </div>

              {/* Encounters in Zone */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {zone.monsters.map(monster => {
                  const isActive = monster.id === currentEnemyId;

                  return (
                    <div
                      key={monster.id}
                      onClick={() => handleLaunchCombat(monster.id)}
                      className={`p-3 rounded-lg border transition-all cursor-pointer flex flex-col justify-between ${
                        isActive
                          ? 'bg-[#291f3a] border-amber-500/60 shadow-md ring-1 ring-amber-500/30'
                          : monster.isBoss
                          ? 'bg-[#1e1224] border-red-500/30 hover:border-red-500/60'
                          : 'bg-[#181324] border-[#2f273e] hover:bg-[#201a2f]'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <span className="text-2xl">{monster.icon}</span>
                        <div className="min-w-0">
                          <h4 className="text-xs font-bold text-stone-200 truncate">{monster.name}</h4>
                          <span className="text-[10px] text-stone-400 block truncate">{monster.title}</span>
                        </div>
                      </div>

                      <div className="mt-3 flex items-center justify-between pt-2 border-t border-[#2d243a]">
                        <span className={`text-[10px] font-semibold uppercase ${monster.isBoss ? 'text-red-400' : 'text-stone-400'}`}>
                          {monster.isBoss ? '👑 Boss Encounter' : 'Skirmish'}
                        </span>
                        <button className="px-2 py-0.5 bg-amber-600 hover:bg-amber-500 text-stone-900 text-[10px] font-bold rounded cursor-pointer">
                          {isActive ? 'Engaged' : 'Battle'}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
