import React, { useState } from 'react';
import { PlayerStats, InventoryItem, CodexEntry } from '../types/game';
import { CODEX_ENTRIES } from '../data/codexData';
import { sound } from '../utils/audio';
import { 
  Shield, Swords, Heart, Zap, Sparkles, Plus, Check, 
  Trash2, ArrowUpCircle, Flame, User, Backpack 
} from 'lucide-react';

interface CharacterSheetProps {
  player: PlayerStats;
  onUpdatePlayer: (updates: Partial<PlayerStats>) => void;
  inventory: InventoryItem[];
  onEquipItem: (item: InventoryItem | CodexEntry) => void;
  onUseItem: (item: InventoryItem) => void;
  onClose: () => void;
}

export const CharacterSheet: React.FC<CharacterSheetProps> = ({
  player,
  onUpdatePlayer,
  inventory,
  onEquipItem,
  onUseItem,
  onClose
}) => {
  const [activeTab, setActiveTab] = useState<'attributes' | 'inventory'>('attributes');
  const [inventoryFilter, setInventoryFilter] = useState<'all' | 'weapon' | 'armor' | 'relic' | 'consumable' | 'material'>('all');

  // Find equipped items from Codex
  const equippedWeapon = CODEX_ENTRIES.find(e => e.id === player.equippedWeaponId);
  const equippedArmor = CODEX_ENTRIES.find(e => e.id === player.equippedArmorId);
  const equippedRelic1 = CODEX_ENTRIES.find(e => e.id === player.equippedRelic1Id);
  const equippedRelic2 = CODEX_ENTRIES.find(e => e.id === player.equippedRelic2Id);

  // Allocate attribute points
  const handleAddPoint = (attr: 'vitality' | 'strength' | 'dexterity' | 'affinity' | 'fortitude') => {
    if (player.unspentPoints <= 0) return;
    sound.playLevelUp();

    const updates: Partial<PlayerStats> = {
      [attr]: player[attr] + 1,
      unspentPoints: player.unspentPoints - 1
    };

    if (attr === 'vitality') {
      updates.maxHp = player.maxHp + 25;
      updates.hp = player.hp + 25;
    } else if (attr === 'fortitude') {
      updates.maxStamina = player.maxStamina + 10;
      updates.stamina = player.stamina + 10;
    } else if (attr === 'affinity') {
      updates.maxMana = player.maxMana + 15;
      updates.mana = player.mana + 15;
    }

    onUpdatePlayer(updates);
  };

  const filteredInventory = inventory.filter(item => {
    if (inventoryFilter === 'all') return true;
    return item.category === inventoryFilter;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-5xl h-[88vh] flex flex-col bg-[#0e0b14] border border-[#3e3450] rounded-xl shadow-2xl overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#2d253b] bg-[#14101e]">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-amber-950/40 border border-amber-500/30 rounded-lg text-amber-400">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold font-heading text-amber-200 tracking-wider">
                CHARACTER & EQUIPMENT SANCTUM
              </h2>
              <div className="flex items-center gap-2 text-xs text-stone-400">
                <span>Bearer of the Shadow Mark</span>
                <span aria-hidden="true">·</span>
                <span className="text-amber-300 font-bold">Level {player.level}</span>
                <span aria-hidden="true">·</span>
                <span className="text-yellow-400 font-bold">{player.souls} Souls / Gold</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center bg-[#09080e] p-1 rounded-lg border border-[#2b2238] text-xs">
              <button
                onClick={() => setActiveTab('attributes')}
                className={`px-3 py-1.5 rounded font-semibold transition-all cursor-pointer ${
                  activeTab === 'attributes'
                    ? 'bg-amber-600 text-stone-900 shadow'
                    : 'text-stone-400 hover:text-stone-200'
                }`}
              >
                Attributes & Gear
              </button>
              <button
                onClick={() => setActiveTab('inventory')}
                className={`px-3 py-1.5 rounded font-semibold transition-all cursor-pointer ${
                  activeTab === 'inventory'
                    ? 'bg-amber-600 text-stone-900 shadow'
                    : 'text-stone-400 hover:text-stone-200'
                }`}
              >
                Inventory ({inventory.length})
              </button>
            </div>

            <button
              onClick={onClose}
              className="px-3 py-1.5 bg-stone-800 hover:bg-stone-700 text-stone-300 text-xs font-semibold rounded-lg transition-colors cursor-pointer"
            >
              Close [ESC]
            </button>
          </div>
        </div>

        {/* Tab 1: Attributes & Gear */}
        {activeTab === 'attributes' && (
          <div className="flex-1 overflow-y-auto p-6 grid grid-cols-1 md:grid-cols-2 gap-6 bg-[#0c0912]">
            {/* Left: Attribute Stats & Points */}
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-[#2a2238]">
                <h3 className="text-sm font-bold font-heading text-stone-200 uppercase tracking-wider">
                  Core Attributes
                </h3>
                {player.unspentPoints > 0 ? (
                  <span className="text-xs px-2.5 py-1 bg-amber-500/20 text-amber-300 border border-amber-500/40 rounded-full font-bold animate-pulse">
                    +{player.unspentPoints} Points Available
                  </span>
                ) : (
                  <span className="text-xs text-stone-500">0 unspent points</span>
                )}
              </div>

              {/* Attributes List */}
              <div className="space-y-2.5">
                {[
                  { key: 'vitality' as const, label: 'Vitality', desc: 'Increases Maximum Health Points & survivability.', val: player.vitality, icon: '❤️' },
                  { key: 'strength' as const, label: 'Strength', desc: 'Increases Heavy Cleave damage & poise shatter capability.', val: player.strength, icon: '⚔️' },
                  { key: 'dexterity' as const, label: 'Dexterity', desc: 'Increases Light Attack speed & critical strike chance.', val: player.dexterity, icon: '🗡️' },
                  { key: 'affinity' as const, label: 'Umbral Affinity', desc: 'Amplifies Shadow Mark Detonation & void spell power.', val: player.affinity, icon: '🔮' },
                  { key: 'fortitude' as const, label: 'Fortitude', desc: 'Increases Maximum Stamina & natural physical armor.', val: player.fortitude, icon: '🛡️' }
                ].map(attr => (
                  <div
                    key={attr.key}
                    className="p-3 bg-[#151120] border border-[#2c233c] rounded-lg flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-xl">{attr.icon}</span>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-bold text-stone-200">{attr.label}</span>
                          <span className="text-sm font-mono font-bold text-amber-400">{attr.val}</span>
                        </div>
                        <p className="text-[11px] text-stone-400">{attr.desc}</p>
                      </div>
                    </div>

                    {player.unspentPoints > 0 && (
                      <button
                        onClick={() => handleAddPoint(attr.key)}
                        className="p-1.5 bg-amber-600 hover:bg-amber-500 text-stone-900 rounded-md transition-colors cursor-pointer shadow"
                        title="Increase Attribute"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                ))}
              </div>

              {/* Secondary Combat Stats Overview */}
              <div className="p-4 bg-[#120e1a] border border-[#2b2238] rounded-xl space-y-2 mt-4 text-xs">
                <h4 className="font-bold text-amber-300 uppercase tracking-wider text-[11px]">
                  Derived Combat Parameters
                </h4>
                <div className="grid grid-cols-2 gap-2 text-stone-300">
                  <div className="flex justify-between p-2 bg-[#09080e] rounded">
                    <span className="text-stone-400">Max Health:</span>
                    <span className="text-red-400 font-bold">{player.maxHp} HP</span>
                  </div>
                  <div className="flex justify-between p-2 bg-[#09080e] rounded">
                    <span className="text-stone-400">Max Stamina:</span>
                    <span className="text-emerald-400 font-bold">{player.maxStamina}</span>
                  </div>
                  <div className="flex justify-between p-2 bg-[#09080e] rounded">
                    <span className="text-stone-400">Max Mana:</span>
                    <span className="text-blue-400 font-bold">{player.maxMana} MP</span>
                  </div>
                  <div className="flex justify-between p-2 bg-[#09080e] rounded">
                    <span className="text-stone-400">Critical Strike:</span>
                    <span className="text-amber-300 font-bold">{(15 + player.dexterity * 1.2).toFixed(0)}%</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Active Equipment Loadout Slots */}
            <div className="space-y-4">
              <div className="pb-2 border-b border-[#2a2238]">
                <h3 className="text-sm font-bold font-heading text-stone-200 uppercase tracking-wider">
                  Equipped Loadout
                </h3>
              </div>

              {/* Weapon Slot */}
              <div className="p-3.5 bg-[#161122] border border-amber-500/30 rounded-xl flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-lg bg-[#0d0a14] border border-amber-500/40 flex items-center justify-center text-2xl">
                    {equippedWeapon?.icon || '🗡️'}
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-amber-400 block">Primary Weapon</span>
                    <h4 className="text-sm font-bold text-stone-100">{equippedWeapon?.name || 'Greatsword of Valdor'}</h4>
                    <p className="text-xs text-stone-400 mt-0.5">
                      +{equippedWeapon?.itemData?.attackBonus || 65} Atk · +{equippedWeapon?.itemData?.poiseBonus || 40} Poise Damage
                    </p>
                  </div>
                </div>
              </div>

              {/* Armor Slot */}
              <div className="p-3.5 bg-[#161122] border border-blue-500/30 rounded-xl flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-lg bg-[#0d0a14] border border-blue-500/40 flex items-center justify-center text-2xl">
                    {equippedArmor?.icon || '🛡️'}
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-blue-400 block">Body Armor</span>
                    <h4 className="text-sm font-bold text-stone-100">{equippedArmor?.name || 'Ashen Knight Full Plate'}</h4>
                    <p className="text-xs text-stone-400 mt-0.5">
                      +{equippedArmor?.itemData?.defenseBonus || 45} Def · +{equippedArmor?.itemData?.poiseBonus || 35} Poise Stability
                    </p>
                  </div>
                </div>
              </div>

              {/* Relic Slot 1 */}
              <div className="p-3.5 bg-[#161122] border border-purple-500/30 rounded-xl flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-lg bg-[#0d0a14] border border-purple-500/40 flex items-center justify-center text-2xl">
                    {equippedRelic1?.icon || '💍'}
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-purple-400 block">Relic Slot I</span>
                    <h4 className="text-sm font-bold text-stone-100">{equippedRelic1?.name || 'Ring of Umbral Leech'}</h4>
                    <p className="text-xs text-stone-400 mt-0.5">{equippedRelic1?.itemData?.effectDescription || 'Siphons HP on mark detonate.'}</p>
                  </div>
                </div>
              </div>

              {/* Relic Slot 2 */}
              <div className="p-3.5 bg-[#161122] border border-purple-500/30 rounded-xl flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-lg bg-[#0d0a14] border border-purple-500/40 flex items-center justify-center text-2xl">
                    {equippedRelic2?.icon || '📿'}
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-purple-400 block">Relic Slot II</span>
                    <h4 className="text-sm font-bold text-stone-100">{equippedRelic2?.name || 'Amulet of the Ashen Dawn'}</h4>
                    <p className="text-xs text-stone-400 mt-0.5">{equippedRelic2?.itemData?.effectDescription || '+15% attack speed & stamina regen.'}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Inventory Grid */}
        {activeTab === 'inventory' && (
          <div className="flex-1 flex flex-col p-6 bg-[#0c0912] overflow-hidden">
            {/* Filter buttons */}
            <div className="flex items-center gap-2 pb-4 border-b border-[#272033] text-xs">
              {(['all', 'weapon', 'armor', 'relic', 'consumable', 'material'] as const).map(f => (
                <button
                  key={f}
                  onClick={() => setInventoryFilter(f)}
                  className={`px-3 py-1.5 rounded uppercase font-semibold transition-all cursor-pointer ${
                    inventoryFilter === f
                      ? 'bg-amber-600 text-stone-900 shadow'
                      : 'text-stone-400 hover:text-stone-200 hover:bg-stone-800/40'
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>

            {/* Inventory List */}
            <div className="flex-1 overflow-y-auto pt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {filteredInventory.length === 0 ? (
                <div className="col-span-full p-12 text-center text-stone-500 text-sm">
                  No items found in this inventory category. Defeat enemies or craft in the forge!
                </div>
              ) : (
                filteredInventory.map(item => (
                  <div
                    key={item.id}
                    className="p-3 bg-[#151120] border border-[#2b2238] rounded-xl flex items-start gap-3 hover:border-amber-500/40 transition-colors"
                  >
                    <div className="w-11 h-11 rounded-lg bg-[#0b0912] border border-[#3b314e] flex items-center justify-center text-2xl shrink-0">
                      {item.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h4 className="text-sm font-bold text-stone-200 truncate">{item.name}</h4>
                        <span className="text-[10px] text-amber-300 font-mono">×{item.count}</span>
                      </div>
                      <p className="text-xs text-stone-400 line-clamp-2 mt-0.5">{item.description}</p>
                      
                      <div className="flex items-center gap-2 mt-2">
                        {(item.category === 'weapon' || item.category === 'armor' || item.category === 'relic') && (
                          <button
                            onClick={() => onEquipItem(item)}
                            className="px-2.5 py-1 bg-amber-600 hover:bg-amber-500 text-stone-900 font-bold rounded text-[11px] cursor-pointer"
                          >
                            Equip
                          </button>
                        )}
                        {item.category === 'consumable' && (
                          <button
                            onClick={() => onUseItem(item)}
                            className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-500 text-stone-900 font-bold rounded text-[11px] cursor-pointer"
                          >
                            Use Now
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
