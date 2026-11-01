import React, { useState, useMemo } from 'react';
import { CodexCategory, CodexEntry, Rarity } from '../types/game';
import { CODEX_ENTRIES, CODEX_CATEGORY_COUNTS } from '../data/codexData';
import { 
  BookOpen, Search, X, Shield, Swords, Sparkles, MapPin, 
  Scroll, Beaker, Zap, Crown, Compass, Eye, Check, Flame
} from 'lucide-react';

interface CodexModalProps {
  isOpen: boolean;
  onClose: () => void;
  onEquipItem?: (entry: CodexEntry) => void;
  onChallengeMonster?: (monsterEntry: CodexEntry) => void;
  onNavigateToForge?: (recipeEntry: CodexEntry) => void;
}

const CATEGORIES: CodexCategory[] = [
  'Bestiary',
  'Wildlife',
  'Companions & pets',
  'NPCs & factions',
  'Legendary cast',
  'Questlines',
  'Weapons',
  'Armor & gear',
  'Accessories',
  'Consumables',
  'Ingredients & materials',
  'Crafting recipes',
  'Spells & techniques',
  'World locations, roads, towns & dungeons'
];

const RARITIES: (Rarity | 'All')[] = ['All', 'Common', 'Uncommon', 'Rare', 'Epic', 'Legendary', 'Mythic'];

export const CodexModal: React.FC<CodexModalProps> = ({
  isOpen,
  onClose,
  onEquipItem,
  onChallengeMonster,
  onNavigateToForge
}) => {
  const [selectedCategory, setSelectedCategory] = useState<CodexCategory>('Bestiary');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRarity, setSelectedRarity] = useState<Rarity | 'All'>('All');
  const [selectedEntryId, setSelectedEntryId] = useState<string>('mon-01');
  const [trackedQuestId, setTrackedQuestId] = useState<string | null>(null);

  // Filter entries
  const filteredEntries = useMemo(() => {
    return CODEX_ENTRIES.filter(entry => {
      if (entry.category !== selectedCategory) return false;
      if (selectedRarity !== 'All' && entry.rarity !== selectedRarity) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = entry.name.toLowerCase().includes(q);
        const matchesDesc = entry.description.toLowerCase().includes(q);
        const matchesOrigin = entry.origin.toLowerCase().includes(q);
        const matchesTags = entry.tags.some(t => t.toLowerCase().includes(q));
        if (!matchesName && !matchesDesc && !matchesOrigin && !matchesTags) return false;
      }
      return true;
    });
  }, [selectedCategory, selectedRarity, searchQuery]);

  // Selected entry data
  const selectedEntry = useMemo(() => {
    return CODEX_ENTRIES.find(e => e.id === selectedEntryId) || filteredEntries[0] || CODEX_ENTRIES[0];
  }, [selectedEntryId, filteredEntries]);

  if (!isOpen) return null;

  const getRarityBadgeColor = (rarity: Rarity) => {
    switch (rarity) {
      case 'Mythic': return 'text-amber-400 border-amber-500/40 bg-amber-950/30';
      case 'Legendary': return 'text-orange-400 border-orange-500/40 bg-orange-950/30';
      case 'Epic': return 'text-purple-400 border-purple-500/40 bg-purple-950/30';
      case 'Rare': return 'text-blue-400 border-blue-500/40 bg-blue-950/30';
      case 'Uncommon': return 'text-emerald-400 border-emerald-500/40 bg-emerald-950/30';
      default: return 'text-stone-400 border-stone-600/40 bg-stone-900/40';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-7xl h-[92vh] flex flex-col bg-[#0d0b12] border border-[#3c344d] rounded-xl shadow-2xl overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        {/* Header Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#2d273a] bg-[#120f1a]">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-950/40 border border-purple-500/30 rounded-lg text-amber-400">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold font-heading tracking-wider text-amber-200">
                CHRONICLES OF VALDOR — ARCHIVE CODEX
              </h2>
              <div className="flex items-center gap-2 text-xs text-stone-400">
                <span>309 Documented Entries</span>
                <span aria-hidden="true">·</span>
                <span>Press <kbd className="px-1.5 py-0.5 bg-[#1e1929] border border-[#4a4060] rounded text-[10px] text-amber-300">J</kbd> or <kbd className="px-1.5 py-0.5 bg-[#1e1929] border border-[#4a4060] rounded text-[10px] text-amber-300">ESC</kbd> to Close</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Search Input */}
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
              <input
                type="text"
                placeholder="Search codex, lore, tags..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-56 sm:w-72 pl-9 pr-3 py-1.5 bg-[#181422] border border-[#3e3450] rounded-lg text-sm text-stone-200 placeholder-stone-500 focus:outline-none focus:border-amber-500/60 transition-colors"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-white"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            <button
              onClick={onClose}
              className="p-2 text-stone-400 hover:text-white hover:bg-stone-800/60 rounded-lg transition-colors"
              title="Close Codex (Esc)"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Category Navigation Bar */}
        <div className="flex items-center gap-1.5 px-4 py-2 bg-[#09080e] border-b border-[#252030] overflow-x-auto scrollbar-none text-xs">
          {CATEGORIES.map(cat => {
            const count = CODEX_CATEGORY_COUNTS[cat] || 0;
            const isSelected = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => {
                  setSelectedCategory(cat);
                  const first = CODEX_ENTRIES.find(e => e.category === cat);
                  if (first) setSelectedEntryId(first.id);
                }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md whitespace-nowrap font-medium transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-[#2a2238] text-amber-300 border border-amber-500/30 shadow-sm'
                    : 'text-stone-400 hover:text-stone-200 hover:bg-[#161220]'
                }`}
              >
                <span>{cat}</span>
                <span className={`text-[10px] px-1 rounded ${isSelected ? 'bg-amber-400/20 text-amber-300' : 'bg-stone-800/60 text-stone-400'}`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Sub-bar: Rarity filter buttons */}
        <div className="flex items-center justify-between px-6 py-2 bg-[#120f1b] border-b border-[#252030] text-xs">
          <div className="flex items-center gap-2">
            <span className="text-stone-400 font-medium">Filter Rarity:</span>
            <div className="flex items-center gap-1">
              {RARITIES.map(rarity => (
                <button
                  key={rarity}
                  onClick={() => setSelectedRarity(rarity)}
                  className={`px-2.5 py-1 rounded text-xs transition-colors cursor-pointer ${
                    selectedRarity === rarity
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 font-semibold'
                      : 'text-stone-400 hover:text-stone-200 hover:bg-stone-800/40'
                  }`}
                >
                  {rarity}
                </button>
              ))}
            </div>
          </div>
          <div className="text-stone-400">
            Showing <strong className="text-stone-200">{filteredEntries.length}</strong> entries in {selectedCategory}
          </div>
        </div>

        {/* Content Body: Left List + Right Field Notes Details */}
        <div className="flex-1 flex overflow-hidden">
          {/* Left: Scrollable Entry Directory */}
          <div className="w-1/3 min-w-[280px] max-w-sm border-r border-[#262033] bg-[#0c0a11] overflow-y-auto p-2 space-y-1.5">
            {filteredEntries.length === 0 ? (
              <div className="p-8 text-center text-stone-400 text-sm">
                No entries match your search criteria.
              </div>
            ) : (
              filteredEntries.map(entry => {
                const isSelected = entry.id === selectedEntry?.id;
                return (
                  <div
                    key={entry.id}
                    onClick={() => setSelectedEntryId(entry.id)}
                    className={`p-3 rounded-lg border transition-all cursor-pointer flex items-start gap-3 ${
                      isSelected
                        ? 'bg-[#221b30] border-amber-500/50 shadow-md ring-1 ring-amber-500/20'
                        : 'bg-[#14111d] border-[#292236] hover:bg-[#1a1626] hover:border-[#3d3350]'
                    }`}
                  >
                    <div className="w-10 h-10 rounded-md bg-[#09080e] border border-[#393049] flex items-center justify-center text-xl shrink-0">
                      {entry.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1">
                        <h4 className={`text-sm font-semibold truncate ${isSelected ? 'text-amber-200' : 'text-stone-200'}`}>
                          {entry.name}
                        </h4>
                        <span className={`text-[10px] px-1.5 py-0.5 rounded border uppercase font-medium shrink-0 ${getRarityBadgeColor(entry.rarity)}`}>
                          {entry.rarity}
                        </span>
                      </div>
                      <p className="text-xs text-stone-400 truncate mt-0.5">{entry.classification} · {entry.origin}</p>
                      {entry.stats && (
                        <div className="flex items-center gap-2 mt-1 text-[11px] text-stone-400">
                          <span className="text-red-400">HP {entry.stats.hp}</span>
                          <span>·</span>
                          <span className="text-amber-400">ATK {entry.stats.attack}</span>
                          <span>·</span>
                          <span className="text-blue-400">XP {entry.stats.xpReward}</span>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Right: Detailed Illuminated Codex Page */}
          <div className="flex-1 overflow-y-auto bg-[#100d17] p-6 lg:p-8 flex flex-col justify-between">
            {selectedEntry ? (
              <div className="space-y-6 max-w-3xl">
                {/* Entry Top Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#2d253b]">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-xl bg-[#1b1526] border-2 border-amber-500/30 flex items-center justify-center text-3xl shadow-lg">
                      {selectedEntry.icon}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className={`text-xs px-2 py-0.5 rounded border uppercase font-bold tracking-wider ${getRarityBadgeColor(selectedEntry.rarity)}`}>
                          {selectedEntry.rarity}
                        </span>
                        <span className="text-xs text-stone-400 uppercase font-semibold">
                          {selectedEntry.classification}
                        </span>
                      </div>
                      <h3 className="text-2xl font-bold font-heading text-stone-100 mt-1">
                        {selectedEntry.name}
                      </h3>
                      <div className="flex items-center gap-2 text-xs text-stone-400 mt-0.5">
                        <MapPin className="w-3.5 h-3.5 text-amber-400" />
                        <span>Origin: {selectedEntry.origin}</span>
                      </div>
                    </div>
                  </div>

                  {/* Contextual Action Button */}
                  <div className="flex items-center gap-2">
                    {selectedEntry.category === 'Bestiary' && onChallengeMonster && (
                      <button
                        onClick={() => {
                          onChallengeMonster(selectedEntry);
                          onClose();
                        }}
                        className="px-4 py-2 bg-red-900/60 hover:bg-red-800 text-red-100 border border-red-500/50 rounded-lg text-sm font-semibold flex items-center gap-2 transition-colors cursor-pointer shadow-md"
                      >
                        <Swords className="w-4 h-4" />
                        Challenge in Combat
                      </button>
                    )}

                    {(selectedEntry.category === 'Weapons' || selectedEntry.category === 'Armor & gear' || selectedEntry.category === 'Accessories' || selectedEntry.category === 'Consumables') && onEquipItem && (
                      <button
                        onClick={() => onEquipItem(selectedEntry)}
                        className="px-4 py-2 bg-amber-700/60 hover:bg-amber-600 text-amber-100 border border-amber-500/50 rounded-lg text-sm font-semibold flex items-center gap-2 transition-colors cursor-pointer shadow-md"
                      >
                        <Shield className="w-4 h-4" />
                        Equip / Use Item
                      </button>
                    )}

                    {selectedEntry.category === 'Crafting recipes' && onNavigateToForge && (
                      <button
                        onClick={() => {
                          onNavigateToForge(selectedEntry);
                          onClose();
                        }}
                        className="px-4 py-2 bg-purple-900/60 hover:bg-purple-800 text-purple-100 border border-purple-500/50 rounded-lg text-sm font-semibold flex items-center gap-2 transition-colors cursor-pointer shadow-md"
                      >
                        <Flame className="w-4 h-4" />
                        Open in Forge
                      </button>
                    )}

                    {selectedEntry.category === 'Questlines' && (
                      <button
                        onClick={() => setTrackedQuestId(selectedEntry.id)}
                        className={`px-4 py-2 rounded-lg text-sm font-semibold flex items-center gap-2 transition-colors cursor-pointer shadow-md border ${
                          trackedQuestId === selectedEntry.id
                            ? 'bg-emerald-900/70 border-emerald-500/60 text-emerald-200'
                            : 'bg-stone-800 hover:bg-stone-700 border-stone-600 text-stone-200'
                        }`}
                      >
                        <Check className="w-4 h-4" />
                        {trackedQuestId === selectedEntry.id ? 'Tracking Active' : 'Track Quest'}
                      </button>
                    )}
                  </div>
                </div>

                {/* Live XML Combat Stats (For Bestiary) */}
                {selectedEntry.stats && (
                  <div className="p-4 bg-[#181322] border border-[#3a304e] rounded-xl space-y-3">
                    <h4 className="text-xs uppercase tracking-wider font-bold text-amber-300 flex items-center gap-2">
                      <Swords className="w-4 h-4 text-amber-400" />
                      Live XML Combat Statistics
                    </h4>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                      <div className="p-2.5 bg-[#0e0c15] rounded-lg border border-[#272134]">
                        <span className="text-stone-400 block text-[10px] uppercase">Hit Points</span>
                        <span className="text-red-400 font-bold text-base">{selectedEntry.stats.hp}</span>
                      </div>
                      <div className="p-2.5 bg-[#0e0c15] rounded-lg border border-[#272134]">
                        <span className="text-stone-400 block text-[10px] uppercase">Attack Power</span>
                        <span className="text-amber-400 font-bold text-base">{selectedEntry.stats.attack}</span>
                      </div>
                      <div className="p-2.5 bg-[#0e0c15] rounded-lg border border-[#272134]">
                        <span className="text-stone-400 block text-[10px] uppercase">Physical Defense</span>
                        <span className="text-blue-400 font-bold text-base">{selectedEntry.stats.defense}</span>
                      </div>
                      <div className="p-2.5 bg-[#0e0c15] rounded-lg border border-[#272134]">
                        <span className="text-stone-400 block text-[10px] uppercase">Poise / Stagger Meter</span>
                        <span className="text-purple-400 font-bold text-base">{selectedEntry.stats.poise}</span>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-4 pt-1 text-xs text-stone-300">
                      <div>
                        <span className="text-stone-400">Weakness: </span>
                        <span className="text-emerald-400 font-semibold">{selectedEntry.stats.weakness || 'None'}</span>
                      </div>
                      <div>
                        <span className="text-stone-400">Experience Reward: </span>
                        <span className="text-amber-300 font-semibold">{selectedEntry.stats.xpReward} XP</span>
                      </div>
                      {selectedEntry.stats.drops && (
                        <div>
                          <span className="text-stone-400">Harvestable Drops: </span>
                          <span className="text-stone-200">{selectedEntry.stats.drops.join(', ')}</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Item / Recipe Attributes */}
                {selectedEntry.itemData && (
                  <div className="p-4 bg-[#181322] border border-[#3a304e] rounded-xl space-y-2">
                    <h4 className="text-xs uppercase tracking-wider font-bold text-amber-300 flex items-center gap-2">
                      <Shield className="w-4 h-4 text-amber-400" />
                      Equipment Attributes
                    </h4>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                      {selectedEntry.itemData.attackBonus !== undefined && (
                        <div className="p-2 bg-[#0e0c15] rounded-lg border border-[#272134]">
                          <span className="text-stone-400 text-[10px] uppercase block">Attack Bonus</span>
                          <span className="text-amber-400 font-bold text-sm">+{selectedEntry.itemData.attackBonus}</span>
                        </div>
                      )}
                      {selectedEntry.itemData.defenseBonus !== undefined && (
                        <div className="p-2 bg-[#0e0c15] rounded-lg border border-[#272134]">
                          <span className="text-stone-400 text-[10px] uppercase block">Armor Rating</span>
                          <span className="text-blue-400 font-bold text-sm">+{selectedEntry.itemData.defenseBonus}</span>
                        </div>
                      )}
                      {selectedEntry.itemData.poiseBonus !== undefined && (
                        <div className="p-2 bg-[#0e0c15] rounded-lg border border-[#272134]">
                          <span className="text-stone-400 text-[10px] uppercase block">Poise Stability</span>
                          <span className="text-purple-400 font-bold text-sm">+{selectedEntry.itemData.poiseBonus}</span>
                        </div>
                      )}
                      {selectedEntry.itemData.healAmount !== undefined && (
                        <div className="p-2 bg-[#0e0c15] rounded-lg border border-[#272134]">
                          <span className="text-stone-400 text-[10px] uppercase block">Vitality Restored</span>
                          <span className="text-emerald-400 font-bold text-sm">+{selectedEntry.itemData.healAmount} HP</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Recipe Materials */}
                {selectedEntry.recipeData && (
                  <div className="p-4 bg-[#181322] border border-[#3a304e] rounded-xl space-y-2">
                    <h4 className="text-xs uppercase tracking-wider font-bold text-amber-300">
                      Required Crafting Reagents
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedEntry.recipeData.materials.map(m => (
                        <span key={m.name} className="px-3 py-1 bg-[#0d0b13] border border-[#372d4a] rounded-lg text-xs text-stone-200">
                          {m.name} × <strong className="text-amber-400">{m.count}</strong>
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Description & Lore Text */}
                <div className="space-y-3">
                  <h4 className="text-xs uppercase tracking-wider font-bold text-stone-400">
                    Chronicle Description
                  </h4>
                  <p className="text-sm leading-relaxed text-stone-200 italic font-serif bg-[#14101e]/60 p-4 rounded-xl border border-[#2c2438]">
                    "{selectedEntry.description}"
                  </p>
                </div>

                {/* Field Notes / Tactical Archive */}
                {selectedEntry.fieldNotes && (
                  <div className="space-y-2">
                    <h4 className="text-xs uppercase tracking-wider font-bold text-amber-400/90 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5" />
                      Scholar’s Field Notes & Tactical Guidance
                    </h4>
                    <div className="text-xs leading-relaxed text-stone-300 bg-[#161220] p-3.5 rounded-lg border-l-2 border-amber-500">
                      {selectedEntry.fieldNotes}
                    </div>
                  </div>
                )}

                {/* Searchable Tags */}
                <div className="pt-2">
                  <span className="text-xs text-stone-400 mr-2">Archive Tags:</span>
                  <div className="inline-flex flex-wrap gap-1.5">
                    {selectedEntry.tags.map(tag => (
                      <button
                        key={tag}
                        onClick={() => setSearchQuery(tag)}
                        className="text-[11px] px-2 py-0.5 bg-[#1b1626] text-stone-300 border border-[#352c44] rounded hover:border-amber-500/40 cursor-pointer"
                      >
                        #{tag}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center h-full text-stone-500 text-sm">
                Select an entry from the ledger to view detailed field notes.
              </div>
            )}

            {/* Bottom Footer info */}
            <div className="pt-6 border-t border-[#251f30] text-xs text-stone-500 flex items-center justify-between">
              <span>Realms of Valdor · Ashen Crown Codex v1.4</span>
              <span>All 309 Entries Indexed</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
