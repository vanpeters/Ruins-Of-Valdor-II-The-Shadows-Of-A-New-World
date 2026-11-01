import React from 'react';
import { PlayerStats } from '../types/game';
import { SoundEffectsManager } from '../hooks/useSoundEffects';
import { 
  BookOpen, User, Compass, Flame, Volume2, VolumeX, 
  Radio, Sparkles, Coins, Swords
} from 'lucide-react';

interface HeaderNavProps {
  player: PlayerStats;
  onOpenCodex: () => void;
  onOpenCharacter: () => void;
  onOpenMap: () => void;
  onOpenForge: () => void;
  activeMode: 'overworld' | 'arena';
  onToggleMode: (mode: 'overworld' | 'arena') => void;
  audio: SoundEffectsManager;
}

export const HeaderNav: React.FC<HeaderNavProps> = ({
  player,
  onOpenCodex,
  onOpenCharacter,
  onOpenMap,
  onOpenForge,
  activeMode,
  onToggleMode,
  audio
}) => {
  return (
    <header className="relative z-30 w-full bg-[#0c0913]/95 border-b border-[#2d253a] px-4 py-2.5 backdrop-blur-md flex flex-wrap items-center justify-between gap-3 shadow-xl">
      {/* Brand & Identity */}
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-[#181124] border border-amber-500/40 flex items-center justify-center text-lg shadow">
          👑
        </div>
        <div>
          <h1 className="text-base sm:text-lg font-bold font-heading tracking-wider text-amber-200">
            REALMS OF VALDOR <span className="text-purple-400 font-ornate">· SHADOW MARK</span>
          </h1>
          <div className="flex items-center gap-2 text-[10px] text-stone-400">
            <span className="text-stone-300">Action RPG & Open World</span>
            <span>·</span>
            <span>Chronicles of the Ashen Crown</span>
          </div>
        </div>
      </div>

      {/* Center: Mode Switcher (Overworld vs Combat Arena) + Player Status */}
      <div className="flex items-center gap-3">
        {/* Tales of Destiny Overworld / Arena Switcher */}
        <div className="flex items-center bg-[#09080e] p-1 rounded-xl border border-[#2e263d] text-xs">
          <button
            onClick={() => onToggleMode('overworld')}
            className={`px-3 py-1.5 rounded-lg font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
              activeMode === 'overworld'
                ? 'bg-purple-700 text-white shadow-md'
                : 'text-stone-400 hover:text-stone-200'
            }`}
          >
            <Compass className="w-3.5 h-3.5" />
            <span>Open World</span>
          </button>

          <button
            onClick={() => onToggleMode('arena')}
            className={`px-3 py-1.5 rounded-lg font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
              activeMode === 'arena'
                ? 'bg-red-800 text-stone-100 shadow-md'
                : 'text-stone-400 hover:text-stone-200'
            }`}
          >
            <Swords className="w-3.5 h-3.5" />
            <span>Combat Arena</span>
          </button>
        </div>

        {/* Currency & Level */}
        <div className="hidden sm:flex items-center gap-3 bg-[#14101e] px-3.5 py-1.5 rounded-xl border border-[#2e263d] text-xs">
          <div className="flex items-center gap-1.5">
            <span className="text-amber-400 font-bold">Lv. {player.level}</span>
            <div className="w-14 h-1.5 bg-black/60 rounded-full overflow-hidden">
              <div 
                className="h-full bg-amber-400" 
                style={{ width: `${Math.min(100, (player.xp / player.xpToNext) * 100)}%` }} 
              />
            </div>
          </div>

          <span className="text-stone-600">|</span>

          <div className="flex items-center gap-1 text-yellow-300 font-bold">
            <Coins className="w-3.5 h-3.5 text-yellow-400" />
            <span>{player.souls} Souls</span>
          </div>

          {player.unspentPoints > 0 && (
            <button
              onClick={onOpenCharacter}
              className="px-2 py-0.5 bg-amber-500 text-stone-900 rounded font-bold text-[10px] animate-pulse cursor-pointer"
            >
              +{player.unspentPoints} Pts
            </button>
          )}
        </div>
      </div>

      {/* Navigation Controls */}
      <div className="flex items-center gap-1.5 sm:gap-2">
        {/* World Codex [J] */}
        <button
          onClick={onOpenCodex}
          className="px-3 py-1.5 bg-[#1b1526] hover:bg-[#251e34] text-stone-200 border border-amber-500/30 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
          title="Open World Codex (Key J)"
        >
          <BookOpen className="w-3.5 h-3.5 text-amber-400" />
          <span>Codex</span>
          <span className="text-[10px] px-1 py-0.2 rounded bg-amber-400/20 text-amber-300 font-mono">
            309
          </span>
        </button>

        {/* Character Sheet [C] */}
        <button
          onClick={onOpenCharacter}
          className="px-3 py-1.5 bg-[#1b1526] hover:bg-[#251e34] text-stone-200 border border-[#3c324e] rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
          title="Open Character Sheet (Key C)"
        >
          <User className="w-3.5 h-3.5 text-blue-400" />
          <span>Gear</span>
        </button>

        {/* Expeditions Vault [M] */}
        <button
          onClick={onOpenMap}
          className="px-3 py-1.5 bg-[#1b1526] hover:bg-[#251e34] text-stone-200 border border-[#3c324e] rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
          title="Dungeon Expeditions Vault (Key M)"
        >
          <Compass className="w-3.5 h-3.5 text-purple-400" />
          <span>Vault</span>
        </button>

        {/* Forge [K] */}
        <button
          onClick={onOpenForge}
          className="px-3 py-1.5 bg-[#1b1526] hover:bg-[#251e34] text-stone-200 border border-[#3c324e] rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
          title="Open Sunken Forge (Key K)"
        >
          <Flame className="w-3.5 h-3.5 text-orange-400" />
          <span>Forge</span>
        </button>

        {/* Audio Toggles */}
        <div className="flex items-center gap-1 pl-2 border-l border-[#2e263c]">
          <button
            onClick={() => audio.toggleAmbient()}
            className={`p-1.5 rounded-lg border transition-colors cursor-pointer ${
              audio.isAmbientActive
                ? 'bg-purple-950/60 text-purple-300 border-purple-500/40 shadow'
                : 'bg-[#151120] text-stone-500 border-[#2f273e]'
            }`}
            title="Toggle Gothic Ambient Drone"
          >
            <Radio className="w-4 h-4" />
          </button>

          <button
            onClick={() => audio.setMuted(!audio.isMuted)}
            className="p-1.5 bg-[#151120] hover:bg-[#221b30] text-stone-300 border border-[#2f273e] rounded-lg transition-colors cursor-pointer"
            title="Mute / Unmute Sound Effects"
          >
            {audio.isMuted ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4 text-amber-400" />}
          </button>
        </div>
      </div>
    </header>
  );
};
