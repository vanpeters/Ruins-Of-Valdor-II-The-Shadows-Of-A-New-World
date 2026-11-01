import React, { useState } from 'react';
import { CodexEntry, InventoryItem } from '../types/game';
import { CODEX_ENTRIES } from '../data/codexData';
import { sound } from '../utils/audio';
import { Flame, Beaker, Check, AlertCircle, ArrowRight, Shield, Swords } from 'lucide-react';

interface AlchemyForgeProps {
  inventory: InventoryItem[];
  onCraftSuccess: (craftedItem: InventoryItem, consumedMaterials: { name: string; count: number }[]) => void;
  onClose: () => void;
  selectedRecipeId?: string;
}

export const AlchemyForge: React.FC<AlchemyForgeProps> = ({
  inventory,
  onCraftSuccess,
  onClose,
  selectedRecipeId
}) => {
  const recipes = CODEX_ENTRIES.filter(e => e.category === 'Crafting recipes');
  const [activeRecipeId, setActiveRecipeId] = useState<string>(selectedRecipeId || recipes[0]?.id || 'rec-1');
  const [craftNotice, setCraftNotice] = useState<string | null>(null);

  const activeRecipe = recipes.find(r => r.id === activeRecipeId) || recipes[0];

  // Helper to count how many of a material player has in inventory
  const getMaterialCount = (materialName: string) => {
    const found = inventory.find(i => i.name.toLowerCase() === materialName.toLowerCase());
    return found ? found.count : 0;
  };

  // Check if player has all materials
  const canCraft = activeRecipe?.recipeData?.materials.every(
    m => getMaterialCount(m.name) >= m.count
  );

  const handleCraft = () => {
    if (!activeRecipe || !canCraft || !activeRecipe.recipeData) return;

    sound.playLevelUp();

    // Find result item details from codex
    const resultCodex = CODEX_ENTRIES.find(e => e.id === activeRecipe.recipeData!.resultItemId);
    const newItem: InventoryItem = {
      id: Math.random().toString(),
      name: resultCodex?.name || activeRecipe.name.replace(/Forge: |Brew: |Weave: |Carve: |Craft: /g, ''),
      category: (resultCodex?.itemData?.slot as any) || 'weapon',
      rarity: activeRecipe.rarity,
      count: 1,
      description: resultCodex?.description || activeRecipe.description,
      icon: resultCodex?.icon || activeRecipe.icon,
      stats: {
        attack: resultCodex?.itemData?.attackBonus,
        defense: resultCodex?.itemData?.defenseBonus,
        poise: resultCodex?.itemData?.poiseBonus,
        heal: resultCodex?.itemData?.healAmount,
        mana: resultCodex?.itemData?.manaAmount
      }
    };

    onCraftSuccess(newItem, activeRecipe.recipeData.materials);
    setCraftNotice(`Successfully crafted: ${newItem.name}!`);
    setTimeout(() => setCraftNotice(null), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-5xl h-[88vh] flex flex-col bg-[#0f0c16] border border-[#3f3454] rounded-xl shadow-2xl overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#2d253d] bg-[#14101f]">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-orange-950/40 border border-orange-500/40 rounded-lg text-orange-400">
              <Flame className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold font-heading text-amber-200 tracking-wider">
                THE SUNKEN ANVIL & ALCHEMY FORGE
              </h2>
              <div className="flex items-center gap-2 text-xs text-stone-400">
                <span>Transmute Raw Bestiary Materials into Legendary Armaments</span>
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            className="px-3.5 py-1.5 bg-stone-800 hover:bg-stone-700 text-stone-300 text-xs font-semibold rounded-lg transition-colors cursor-pointer"
          >
            Close [ESC]
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 flex overflow-hidden">
          {/* Left: Recipe List */}
          <div className="w-1/3 min-w-[280px] border-r border-[#272036] bg-[#0c0913] p-3 overflow-y-auto space-y-2">
            <h3 className="text-xs font-bold font-heading text-stone-400 uppercase tracking-wider px-2 py-1">
              Discovered Blueprints ({recipes.length})
            </h3>
            {recipes.map(recipe => {
              const isSelected = recipe.id === activeRecipe?.id;
              const affordable = recipe.recipeData?.materials.every(
                m => getMaterialCount(m.name) >= m.count
              );

              return (
                <div
                  key={recipe.id}
                  onClick={() => setActiveRecipeId(recipe.id)}
                  className={`p-3 rounded-lg border transition-all cursor-pointer flex items-center justify-between ${
                    isSelected
                      ? 'bg-[#251b36] border-amber-500/50 shadow-md'
                      : 'bg-[#151120] border-[#2b2238] hover:bg-[#1c162b]'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="text-2xl">{recipe.icon}</span>
                    <div className="min-w-0">
                      <h4 className={`text-xs font-bold truncate ${isSelected ? 'text-amber-200' : 'text-stone-200'}`}>
                        {recipe.name}
                      </h4>
                      <span className="text-[10px] text-stone-400 capitalize">{recipe.rarity}</span>
                    </div>
                  </div>

                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded border shrink-0 ${
                    affordable
                      ? 'bg-emerald-950/60 text-emerald-300 border-emerald-500/40'
                      : 'bg-stone-900 text-stone-500 border-stone-800'
                  }`}>
                    {affordable ? 'Ready' : 'Need Mats'}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Right: Recipe Inspector & Crafting Action */}
          <div className="flex-1 p-6 lg:p-8 bg-[#110e1a] overflow-y-auto flex flex-col justify-between">
            {activeRecipe ? (
              <div className="space-y-6 max-w-2xl">
                {/* Title */}
                <div className="flex items-center gap-4 pb-4 border-b border-[#2d243c]">
                  <div className="w-16 h-16 rounded-xl bg-[#1b1526] border-2 border-amber-500/40 flex items-center justify-center text-3xl shadow-lg">
                    {activeRecipe.icon}
                  </div>
                  <div>
                    <span className="text-xs text-amber-400 font-bold uppercase tracking-wider">
                      {activeRecipe.classification} · {activeRecipe.rarity}
                    </span>
                    <h3 className="text-2xl font-bold font-heading text-stone-100 mt-0.5">
                      {activeRecipe.name}
                    </h3>
                    <p className="text-xs text-stone-400 mt-1">{activeRecipe.description}</p>
                  </div>
                </div>

                {craftNotice && (
                  <div className="p-3 bg-emerald-950/70 border border-emerald-500/50 rounded-lg text-emerald-200 text-xs font-bold flex items-center gap-2 animate-in fade-in">
                    <Check className="w-4 h-4 text-emerald-400" />
                    <span>{craftNotice}</span>
                  </div>
                )}

                {/* Reagents Required */}
                <div className="space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-amber-300 flex items-center gap-2">
                    <Beaker className="w-4 h-4 text-amber-400" />
                    Required Ingredients & Reagents
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {activeRecipe.recipeData?.materials.map(m => {
                      const userHas = getMaterialCount(m.name);
                      const hasEnough = userHas >= m.count;

                      return (
                        <div
                          key={m.name}
                          className={`p-3 rounded-lg border flex items-center justify-between ${
                            hasEnough
                              ? 'bg-[#181324] border-emerald-500/30 text-stone-200'
                              : 'bg-[#181324] border-red-500/30 text-stone-400'
                          }`}
                        >
                          <div>
                            <span className="text-xs font-bold block">{m.name}</span>
                            <span className="text-[11px] text-stone-500">Need: {m.count}</span>
                          </div>
                          <div className="text-right">
                            <span className={`text-sm font-mono font-bold ${hasEnough ? 'text-emerald-400' : 'text-red-400'}`}>
                              {userHas} / {m.count}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Crafting Advice */}
                <div className="p-4 bg-[#161122] border-l-2 border-amber-500 rounded-r-lg text-xs text-stone-300 leading-relaxed">
                  Defeat bestiary monsters in the combat arena or exploration nodes to replenish missing reagents.
                </div>
              </div>
            ) : null}

            {/* Bottom Forge Button */}
            <div className="pt-6 border-t border-[#2d253d] flex items-center justify-between">
              <span className="text-xs text-stone-500">Ancient Star-Forge of Valdor</span>
              <button
                onClick={handleCraft}
                disabled={!canCraft}
                className="px-6 py-3 bg-amber-600 hover:bg-amber-500 disabled:opacity-40 disabled:cursor-not-allowed text-stone-900 font-extrabold rounded-xl text-sm transition-all shadow-lg flex items-center gap-2 cursor-pointer"
              >
                <Flame className="w-4 h-4" />
                <span>Hammer & Forge Item</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
