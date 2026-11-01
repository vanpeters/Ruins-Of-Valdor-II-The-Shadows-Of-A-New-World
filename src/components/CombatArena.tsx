import React, { useState, useEffect, useRef, useCallback } from 'react';
import { PlayerStats, EnemyCombatant, CombatStance, CombatLogEntry, CodexEntry } from '../types/game';
import { SoundEffectsManager } from '../hooks/useSoundEffects';
import { 
  Shield, Swords, Zap, Heart, Flame, Sparkles, Skull, 
  RotateCcw, Volume2, VolumeX, Eye, AlertCircle, Award, Compass
} from 'lucide-react';

interface CombatArenaProps {
  player: PlayerStats;
  onUpdatePlayer: (updates: Partial<PlayerStats>) => void;
  activeEnemy: EnemyCombatant;
  onEnemyDefeated: (enemy: EnemyCombatant) => void;
  onOpenCodex: () => void;
  onOpenCharacter: () => void;
  onSelectNewEncounter?: () => void;
  onReturnToWorld?: () => void;
  audio: SoundEffectsManager;
}

interface DamageNumber {
  id: string;
  value: string;
  type: 'damage' | 'crit' | 'mark' | 'heal' | 'parry' | 'stagger' | 'dodge';
  x: number;
  y: number;
  opacity: number;
}

export const CombatArena: React.FC<CombatArenaProps> = ({
  player,
  onUpdatePlayer,
  activeEnemy: initialEnemy,
  onEnemyDefeated,
  onOpenCodex,
  onOpenCharacter,
  onSelectNewEncounter,
  onReturnToWorld,
  audio
}) => {
  const [enemy, setEnemy] = useState<EnemyCombatant>(initialEnemy);
  const [stance, setStance] = useState<CombatStance>('Shadow');
  const [isBlocking, setIsBlocking] = useState(false);
  const [isDodging, setIsDodging] = useState(false);
  const [isParrying, setIsParrying] = useState(false);
  const [parryWindowActive, setParryWindowActive] = useState(false);
  const [screenShake, setScreenShake] = useState(false);
  const [screenFlash, setScreenFlash] = useState<string | null>(null);
  const [comboStep, setComboStep] = useState(0);
  const [slashEffect, setSlashEffect] = useState<string | null>(null);
  const [damageNumbers, setDamageNumbers] = useState<DamageNumber[]>([]);
  const [combatLogs, setCombatLogs] = useState<CombatLogEntry[]>([
    { id: '1', text: `Encounter commenced against ${initialEnemy.name}.`, type: 'system', timestamp: '00:00' }
  ]);
  const [isDefeated, setIsDefeated] = useState(false);
  const [isVictory, setIsVictory] = useState(false);
  const [cooldowns, setCooldowns] = useState<{ [key: string]: number }>({
    detonate: 0,
    blink: 0,
    judgment: 0,
    dodge: 0,
    flask: 0
  });

  // Track enemy change from props
  useEffect(() => {
    setEnemy(initialEnemy);
    setIsVictory(false);
    setIsDefeated(false);
    addLog(`A dangerous foe emerges: ${initialEnemy.name}!`, 'system');
  }, [initialEnemy.id]);

  const addLog = (text: string, type: CombatLogEntry['type']) => {
    setCombatLogs(prev => [
      { id: Math.random().toString(), text, type, timestamp: new Date().toLocaleTimeString().slice(3, 8) },
      ...prev.slice(0, 20)
    ]);
  };

  const spawnDamageNumber = (value: string, type: DamageNumber['type'], target: 'enemy' | 'player') => {
    const id = Math.random().toString();
    const baseX = target === 'enemy' ? 62 + (Math.random() * 8 - 4) : 34 + (Math.random() * 8 - 4);
    const baseY = 40 + (Math.random() * 10 - 5);
    setDamageNumbers(prev => [...prev, { id, value, type, x: baseX, y: baseY, opacity: 1 }]);

    setTimeout(() => {
      setDamageNumbers(prev => prev.filter(d => d.id !== id));
    }, 900);
  };

  const triggerShake = () => {
    setScreenShake(true);
    setTimeout(() => setScreenShake(false), 300);
  };

  const triggerFlash = (color: string) => {
    setScreenFlash(color);
    setTimeout(() => setScreenFlash(null), 250);
  };

  // Cooldown ticker
  useEffect(() => {
    const timer = setInterval(() => {
      setCooldowns(prev => {
        let changed = false;
        const next = { ...prev };
        for (const k in next) {
          if (next[k] > 0) {
            next[k] = Math.max(0, next[k] - 0.1);
            changed = true;
          }
        }
        return changed ? next : prev;
      });
    }, 100);
    return () => clearInterval(timer);
  }, []);

  // Passive stamina & resonance regeneration
  useEffect(() => {
    const regen = setInterval(() => {
      if (isDefeated || isVictory) return;
      onUpdatePlayer({
        stamina: Math.min(player.maxStamina, player.stamina + (isBlocking ? 2 : 6)),
        mana: Math.min(player.maxMana, player.mana + 1.5)
      });
    }, 200);
    return () => clearInterval(regen);
  }, [player.stamina, player.maxStamina, player.mana, player.maxMana, isBlocking, isDefeated, isVictory]);

  // Enemy Combat Loop (Telegraph -> Attack)
  useEffect(() => {
    if (isDefeated || isVictory || enemy.hp <= 0) return;

    let attackInterval: NodeJS.Timeout | null = null;
    let progressTimer: NodeJS.Timeout | null = null;

    const startEnemyAttack = () => {
      if (enemy.isStaggered) return;

      const attackNames = enemy.isBoss
        ? ['Void Rupture Cleave', 'Abyssal Sweep', 'Soul Siphon Burst', 'Eclipse Starfall']
        : ['Serrated Slash', 'Heavy Lunging Thrust', 'Corrupted Flail', 'Dark Smite'];
      const chosenAction = attackNames[Math.floor(Math.random() * attackNames.length)];

      setEnemy(prev => ({
        ...prev,
        isTelegraphing: true,
        telegraphProgress: 0,
        currentActionName: chosenAction
      }));

      // Telegraph animation progress
      let prog = 0;
      const telegraphSpeed = enemy.isBoss && enemy.phase > 1 ? 14 : 10;
      const progressTimer = setInterval(() => {
        prog += telegraphSpeed;
        setEnemy(prev => ({ ...prev, telegraphProgress: Math.min(100, prog) }));
        if (prog >= 100) {
          clearInterval(progressTimer);
          resolveEnemyAttack(chosenAction);
        }
      }, 100);
    };

    const resolveEnemyAttack = (actionName: string) => {
      setEnemy(prev => ({ ...prev, isTelegraphing: false, telegraphProgress: 0 }));

      // Check player defense state
      if (parryWindowActive) {
        // SUCCESSFUL PERFECT PARRY!
        audio.playParryClash();
        triggerShake();
        triggerFlash('rgba(56, 189, 248, 0.4)');
        spawnDamageNumber('PARRIED!', 'parry', 'player');
        spawnDamageNumber('-45 POISE', 'stagger', 'enemy');
        addLog(`Perfect Parry! Deflected ${actionName} and cracked enemy poise!`, 'parry');

        setEnemy(prev => {
          const newPoise = Math.max(0, prev.poise - 45);
          const staggered = newPoise === 0;
          if (staggered) {
            audio.playEnemyStagger();
            addLog(`${prev.name} is STAGGERED! Roster is open for critical riposte!`, 'stagger');
          }
          return {
            ...prev,
            poise: newPoise,
            isStaggered: staggered,
            staggerTimer: staggered ? 5 : prev.staggerTimer
          };
        });

        onUpdatePlayer({
          umbralResonance: Math.min(100, player.umbralResonance + 25)
        });
        return;
      }

      if (isDodging) {
        // SUCCESSFUL DODGE
        audio.playDodge();
        spawnDamageNumber('EVADED', 'dodge', 'player');
        addLog(`Evaded ${actionName} with a clean shadow slip!`, 'dodge');
        return;
      }

      // Regular hit or blocked hit
      let rawDamage = Math.max(10, Math.round(enemy.attackPower * (0.85 + Math.random() * 0.3)));
      if (isBlocking) {
        const blockReduction = stance === 'Ashen' ? 0.8 : 0.65;
        const damageTaken = Math.max(2, Math.round(rawDamage * (1 - blockReduction)));
        audio.playHeavyHit();
        spawnDamageNumber(`-${damageTaken} (BLOCKED)`, 'damage', 'player');
        addLog(`Blocked ${actionName}. Absorbed majority of damage.`, 'player-hit');
        onUpdatePlayer({
          hp: Math.max(0, player.hp - damageTaken),
          stamina: Math.max(0, player.stamina - 20)
        });
      } else {
        // Full unblocked hit
        audio.playPlayerHurt();
        triggerShake();
        triggerFlash('rgba(239, 68, 68, 0.4)');
        spawnDamageNumber(`-${rawDamage}`, 'damage', 'player');
        addLog(`Struck by ${actionName} for ${rawDamage} damage!`, 'player-hit');

        const newHp = Math.max(0, player.hp - rawDamage);
        onUpdatePlayer({ hp: newHp });

        if (newHp <= 0) {
          setIsDefeated(true);
          addLog('You have fallen in combat against the shadows...', 'system');
        }
      }
    };

    attackInterval = setInterval(startEnemyAttack, enemy.isBoss ? 2800 : 3400);

    return () => {
      if (attackInterval) clearInterval(attackInterval);
      if (progressTimer) clearInterval(progressTimer);
    };
  }, [enemy, parryWindowActive, isDodging, isBlocking, stance, player, isDefeated, isVictory]);

  // Handle enemy stagger decay
  useEffect(() => {
    if (!enemy.isStaggered) return;
    const timer = setInterval(() => {
      setEnemy(prev => {
        if (prev.staggerTimer <= 1) {
          return { ...prev, isStaggered: false, poise: prev.maxPoise, staggerTimer: 0 };
        }
        return { ...prev, staggerTimer: prev.staggerTimer - 1 };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [enemy.isStaggered]);

  // PLAYER COMBAT ACTIONS
  // 1. Light Attack Combo
  const handleLightAttack = () => {
    if (player.stamina < 12 || isDefeated || isVictory) return;

    audio.playSlash();
    setSlashEffect('slash-sweep');
    setTimeout(() => setSlashEffect(null), 250);

    const step = (comboStep % 3) + 1;
    setComboStep(step);

    const baseDmg = 25 + player.strength * 1.5 + (step === 3 ? 18 : 0);
    const isCrit = Math.random() < (0.15 + player.dexterity * 0.01 + (stance === 'Shadow' ? 0.15 : 0));
    const finalDamage = Math.round(baseDmg * (isCrit ? 1.8 : 1));

    // Shadow Mark buildup with distinct tiered audio cue!
    const markChance = stance === 'Shadow' ? 1.0 : 0.7;
    const addedMark = Math.random() < markChance;

    if (addedMark) {
      const nextStack = Math.min(5, enemy.shadowMarks + 1);
      audio.playShadowMarkApplied(nextStack);
    }

    onUpdatePlayer({
      stamina: Math.max(0, player.stamina - 12),
      umbralResonance: Math.min(100, player.umbralResonance + 8)
    });

    spawnDamageNumber(
      `${finalDamage}${isCrit ? ' CRIT!' : ''}`,
      isCrit ? 'crit' : 'damage',
      'enemy'
    );

    applyEnemyDamage(finalDamage, 12, addedMark ? 1 : 0);
    addLog(`Combo strike #${step} dealt ${finalDamage} damage to ${enemy.name}.`, 'player-hit');
  };

  // 2. Heavy Cleave (Poise Breaker)
  const handleHeavyCleave = () => {
    if (player.stamina < 25 || isDefeated || isVictory) return;

    audio.playHeavyHit();
    triggerShake();
    setSlashEffect('heavy-slam');
    setTimeout(() => setSlashEffect(null), 300);

    const baseDmg = 55 + player.strength * 2.8;
    const finalDamage = Math.round(baseDmg);

    onUpdatePlayer({
      stamina: Math.max(0, player.stamina - 25),
      umbralResonance: Math.min(100, player.umbralResonance + 15)
    });

    spawnDamageNumber(`${finalDamage} CLEAVE!`, 'crit', 'enemy');
    applyEnemyDamage(finalDamage, 35, 1);
    addLog(`Heavy Cleave smashed ${enemy.name} for ${finalDamage} and crushed 35 poise!`, 'player-hit');
  };

  // 3. Perfect Parry Attempt
  const handleParry = () => {
    if (isParrying || isDefeated || isVictory) return;
    setIsParrying(true);
    setParryWindowActive(true);

    const parryDuration = stance === 'Ashen' ? 420 : 320;
    setTimeout(() => {
      setParryWindowActive(false);
      setIsParrying(false);
    }, parryDuration);
  };

  // 4. Shadow Dodge Roll
  const handleDodge = () => {
    if (cooldowns.dodge > 0 || player.stamina < 15 || isDefeated || isVictory) return;
    audio.playDodge();
    setIsDodging(true);
    setCooldowns(prev => ({ ...prev, dodge: 1.0 }));
    onUpdatePlayer({ stamina: Math.max(0, player.stamina - 15) });

    setTimeout(() => {
      setIsDodging(false);
    }, 450);
  };

  // 5. SHADOW DETONATION (Signature mechanic)
  const handleDetonate = () => {
    if (enemy.shadowMarks === 0 || cooldowns.detonate > 0 || isDefeated || isVictory) return;

    const marks = enemy.shadowMarks;
    audio.playMarkDetonation(marks);
    triggerShake();
    triggerFlash('rgba(147, 51, 234, 0.5)');

    const baseDetonate = 65 + player.affinity * 4;
    // Exponential mark burst
    const markMultiplier = Math.pow(1.5, marks - 1);
    const finalDamage = Math.round(baseDetonate * marks * markMultiplier);
    const healthSiphon = marks * 25;

    spawnDamageNumber(`💥 ${finalDamage} DETONATION!`, 'mark', 'enemy');
    spawnDamageNumber(`+${healthSiphon} HP`, 'heal', 'player');

    applyEnemyDamage(finalDamage, 40 * marks, -marks);
    onUpdatePlayer({
      hp: Math.min(player.maxHp, player.hp + healthSiphon),
      umbralResonance: Math.min(100, player.umbralResonance + 20)
    });

    setCooldowns(prev => ({ ...prev, detonate: 2.5 }));
    addLog(`Detonated ${marks} Shadow Marks! Unleashed ${finalDamage} Void explosion & siphoned ${healthSiphon} HP!`, 'detonate');
  };

  // 6. Abyssal Step / Blink Strike
  const handleAbyssalBlink = () => {
    if (player.mana < 25 || cooldowns.blink > 0 || isDefeated || isVictory) return;
    audio.playSlash();
    triggerFlash('rgba(99, 102, 241, 0.4)');

    const blinkDmg = Math.round(75 + player.affinity * 2.5 + player.dexterity * 1.5);
    spawnDamageNumber(`${blinkDmg} BLINK!`, 'crit', 'enemy');

    onUpdatePlayer({
      mana: Math.max(0, player.mana - 25),
      umbralResonance: Math.min(100, player.umbralResonance + 15)
    });

    applyEnemyDamage(blinkDmg, 25, 2);
    setCooldowns(prev => ({ ...prev, blink: 4.0 }));
    addLog(`Abyssal Step teleported behind ${enemy.name} for ${blinkDmg} critical strike!`, 'player-hit');
  };

  // 7. Visceral Riposte on Staggered Foe
  const handleVisceralRiposte = () => {
    if (!enemy.isStaggered || isDefeated || isVictory) return;

    audio.playHeavyHit();
    triggerShake();
    triggerFlash('rgba(250, 204, 21, 0.5)');

    const riposteDmg = Math.round(180 + player.strength * 4 + player.dexterity * 3);
    spawnDamageNumber(`☠️ ${riposteDmg} RIPOSTE!`, 'crit', 'enemy');

    applyEnemyDamage(riposteDmg, 0, 3);
    setEnemy(prev => ({ ...prev, isStaggered: false, poise: prev.maxPoise }));
    addLog(`VISCERAL RIPOSTE! Executed a devastating execution on ${enemy.name} for ${riposteDmg} damage!`, 'stagger');
  };

  // 8. Drink Ashen Flask
  const handleDrinkFlask = () => {
    if (cooldowns.flask > 0 || isDefeated || isVictory) return;
    audio.playHeal();
    const healVal = 160;
    spawnDamageNumber(`+${healVal} HP`, 'heal', 'player');
    onUpdatePlayer({
      hp: Math.min(player.maxHp, player.hp + healVal)
    });
    setCooldowns(prev => ({ ...prev, flask: 5.0 }));
    addLog(`Consumed Ashen Flask. Restored ${healVal} Health.`, 'heal');
  };

  // Central damage application helper
  const applyEnemyDamage = (dmg: number, poiseDmg: number, marksDelta: number) => {
    setEnemy(prev => {
      const newHp = Math.max(0, prev.hp - dmg);
      const newPoise = Math.max(0, prev.poise - poiseDmg);
      const newMarks = Math.max(0, Math.min(5, prev.shadowMarks + marksDelta));
      const staggered = newPoise === 0 && !prev.isStaggered;

      // Play stagger audio if poise broke
      if (staggered) {
        audio.playEnemyStagger();
      }

      // Check Boss Phase 2 transition
      let phase = prev.phase;
      if (prev.isBoss && phase === 1 && newHp <= prev.maxHp * 0.5) {
        phase = 2;
        triggerShake();
        triggerFlash('rgba(185, 28, 28, 0.6)');
        audio.playHeavyHit();
        addLog(`⚠️ ${prev.name} enters PHASE 2: Void Eclipse unleashed! Attack speed & ferocity doubled!`, 'system');
      }

      if (newHp === 0) {
        handleVictory(prev);
      }

      return {
        ...prev,
        hp: newHp,
        poise: newPoise,
        shadowMarks: newMarks,
        phase,
        isStaggered: staggered || prev.isStaggered,
        staggerTimer: staggered ? 4 : prev.staggerTimer
      };
    });
  };

  const handleVictory = (defeatedEnemy: EnemyCombatant) => {
    setIsVictory(true);
    audio.playLevelUp();
    triggerFlash('rgba(234, 179, 8, 0.4)');
    addLog(`VICTORY! ${defeatedEnemy.name} was vanquished! Gained ${defeatedEnemy.xpReward} XP & ${defeatedEnemy.soulsReward} Souls!`, 'system');

    // Give XP and souls
    const newXp = player.xp + defeatedEnemy.xpReward;
    let newLevel = player.level;
    let unspent = player.unspentPoints;
    let nextThreshold = player.xpToNext;

    if (newXp >= player.xpToNext) {
      newLevel += 1;
      unspent += 3;
      nextThreshold = Math.round(player.xpToNext * 1.5);
      addLog(`✨ LEVEL UP! You reached Level ${newLevel}! +3 Attribute points available.`, 'system');
    }

    onUpdatePlayer({
      xp: newXp,
      level: newLevel,
      unspentPoints: unspent,
      xpToNext: nextThreshold,
      souls: player.souls + defeatedEnemy.soulsReward
    });

    onEnemyDefeated(defeatedEnemy);
  };

  // Keyboard controls listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

      if (e.code === 'Digit1' || e.code === 'KeyZ') {
        handleLightAttack();
      } else if (e.code === 'Digit2' || e.code === 'KeyX') {
        handleHeavyCleave();
      } else if (e.code === 'Space') {
        e.preventDefault();
        handleParry();
      } else if (e.code === 'ShiftLeft' || e.code === 'KeyC') {
        e.preventDefault();
        handleDodge();
      } else if (e.code === 'KeyQ') {
        handleDetonate();
      } else if (e.code === 'KeyE') {
        handleAbyssalBlink();
      } else if (e.code === 'KeyR' && enemy.isStaggered) {
        handleVisceralRiposte();
      } else if (e.code === 'KeyF') {
        handleDrinkFlask();
      } else if (e.code === 'Tab') {
        e.preventDefault();
        // Cycle stances
        setStance(s => s === 'Ashen' ? 'Shadow' : s === 'Shadow' ? 'Void' : 'Ashen');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  });

  return (
    <div className={`relative w-full h-full flex flex-col justify-between overflow-hidden select-none bg-[#0a0810] ${screenShake ? 'animate-screen-shake' : ''}`}>
      {/* Screen color flashes */}
      {screenFlash && (
        <div 
          className="pointer-events-none absolute inset-0 z-40 transition-opacity duration-200" 
          style={{ backgroundColor: screenFlash }} 
        />
      )}

      {/* Low HP Red Heartbeat Vignette */}
      {player.hp < player.maxHp * 0.3 && (
        <div className="pointer-events-none absolute inset-0 z-30 ring-inset ring-8 ring-red-600/40 animate-pulse bg-red-950/20" />
      )}

      {/* TOP: Boss / Enemy Health & Poise Bar HUD */}
      <div className="relative z-20 pt-4 px-6 max-w-4xl mx-auto w-full">
        <div className="bg-[#120e1c]/90 border border-[#3e3452] p-4 rounded-xl shadow-2xl backdrop-blur-md">
          <div className="flex items-center justify-between mb-1.5">
            <div className="flex items-center gap-2">
              <span className="text-xl">{enemy.isBoss ? '👑' : '💀'}</span>
              <div>
                <h2 className="text-lg font-bold font-heading text-stone-100 flex items-center gap-2">
                  {enemy.name}
                  {enemy.phase > 1 && (
                    <span className="text-xs px-2 py-0.5 rounded bg-red-950 text-red-400 border border-red-500/40 uppercase">
                      Phase {enemy.phase} Enraged
                    </span>
                  )}
                </h2>
                <div className="flex items-center gap-2 text-xs text-stone-400">
                  <span>{enemy.category}</span>
                  <span>·</span>
                  <span className="text-emerald-400">Weak: {enemy.weakness}</span>
                </div>
              </div>
            </div>

            {/* Shadow Mark Orbit Display & Disengage Button */}
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1.5 bg-[#1f1730] px-3 py-1.5 rounded-lg border border-purple-500/40">
                <span className="text-xs font-semibold text-purple-300">Shadow Marks:</span>
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map(idx => (
                    <div
                      key={idx}
                      className={`w-3.5 h-3.5 rounded-full transition-all duration-300 ${
                        idx <= enemy.shadowMarks
                          ? 'bg-purple-500 shadow-[0_0_8px_#c084fc] scale-110 ring-1 ring-purple-300'
                          : 'bg-stone-800 border border-stone-700'
                      }`}
                    />
                  ))}
                </div>
                {enemy.shadowMarks > 0 && (
                  <span className="text-xs font-bold text-amber-300 ml-1">
                    [Q: Detonate]
                  </span>
                )}
              </div>

              {onReturnToWorld && (
                <button
                  onClick={onReturnToWorld}
                  className="px-2.5 py-1.5 bg-stone-900/80 hover:bg-stone-800 text-stone-300 hover:text-white border border-[#3e3452] rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                  title="Flee encounter to open world"
                >
                  <Compass className="w-3.5 h-3.5 text-purple-400" />
                  <span className="hidden sm:inline">World</span>
                </button>
              )}
            </div>
          </div>

          {/* Enemy HP Bar */}
          <div className="relative w-full h-5 bg-[#1b1526] rounded-full overflow-hidden border border-[#3a304e]">
            <div
              className="h-full bg-gradient-to-r from-red-800 via-red-600 to-amber-600 transition-all duration-200"
              style={{ width: `${(enemy.hp / enemy.maxHp) * 100}%` }}
            />
            <span className="absolute inset-0 flex items-center justify-center text-[11px] font-bold text-white drop-shadow">
              {enemy.hp} / {enemy.maxHp} HP
            </span>
          </div>

          {/* Enemy Poise / Stagger Bar */}
          <div className="mt-2 flex items-center gap-2">
            <span className="text-[10px] uppercase font-bold text-stone-400 w-12">Poise</span>
            <div className="relative flex-1 h-2 bg-[#1b1526] rounded-full overflow-hidden border border-[#332a42]">
              <div
                className={`h-full transition-all duration-150 ${
                  enemy.isStaggered ? 'bg-amber-400 animate-pulse' : 'bg-gradient-to-r from-amber-600 to-yellow-400'
                }`}
                style={{ width: `${(enemy.poise / enemy.maxPoise) * 100}%` }}
              />
            </div>
            {enemy.isStaggered && (
              <span className="text-xs font-bold text-amber-400 uppercase tracking-wider animate-bounce">
                STAGGERED! Press [R] Riposte!
              </span>
            )}
          </div>

          {/* Enemy Telegraph Bar */}
          {enemy.isTelegraphing && (
            <div className="mt-2 p-2 bg-red-950/70 border border-red-500/50 rounded-lg flex items-center gap-3 animate-in fade-in">
              <AlertCircle className="w-4 h-4 text-red-400 animate-spin" />
              <div className="flex-1">
                <div className="flex justify-between text-xs font-semibold text-red-200 mb-1">
                  <span>WARNING: {enemy.currentActionName}</span>
                  <span>{Math.round(enemy.telegraphProgress)}%</span>
                </div>
                <div className="w-full h-2 bg-black/60 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-red-500 transition-all duration-75"
                    style={{ width: `${enemy.telegraphProgress}%` }}
                  />
                </div>
              </div>
              <span className="text-xs font-bold text-cyan-300 uppercase px-2 py-0.5 bg-cyan-950/80 border border-cyan-500/40 rounded">
                [SPACE] PARRY NOW
              </span>
            </div>
          )}
        </div>
      </div>

      {/* CENTER: Visual Combat Stage & Floating Damage Numbers */}
      <div className="relative flex-1 flex items-center justify-center my-4 overflow-hidden">
        {/* Atmospheric Dungeon Arena Background Layer */}
        <div className="absolute inset-0 bg-dark-radial opacity-90" />
        <div className="absolute inset-0 bg-vignette pointer-events-none" />

        {/* Floating Damage & Action Text */}
        {damageNumbers.map(d => (
          <div
            key={d.id}
            className={`absolute pointer-events-none font-bold text-lg transition-all transform -translate-y-6 ${
              d.type === 'crit'
                ? 'text-yellow-300 text-2xl drop-shadow-[0_2px_8px_rgba(234,179,8,0.8)] font-ornate'
                : d.type === 'mark'
                ? 'text-purple-300 text-2xl drop-shadow-[0_2px_8px_rgba(168,85,247,0.8)]'
                : d.type === 'parry'
                ? 'text-cyan-300 text-2xl drop-shadow-[0_2px_8px_rgba(34,211,238,0.8)]'
                : d.type === 'stagger'
                ? 'text-amber-400 text-xl'
                : d.type === 'heal'
                ? 'text-emerald-400 text-xl'
                : 'text-stone-100 text-lg'
            }`}
            style={{ left: `${d.x}%`, top: `${d.y}%` }}
          >
            {d.value}
          </div>
        ))}

        {/* Combatants Center Stage */}
        <div className="relative z-10 w-full max-w-4xl px-8 flex items-center justify-between">
          {/* Player Visual Avatar */}
          <div className="flex flex-col items-center">
            <div className={`relative w-28 h-28 sm:w-36 sm:h-36 rounded-2xl border-2 flex items-center justify-center text-5xl transition-all duration-200 ${
              isParrying
                ? 'border-cyan-400 bg-cyan-950/50 shadow-[0_0_25px_#22d3ee] scale-105'
                : isDodging
                ? 'opacity-40 blur-[1px] translate-x-4 border-purple-400'
                : isBlocking
                ? 'border-blue-400 bg-blue-950/40 scale-95'
                : 'border-amber-500/40 bg-[#161222] shadow-xl'
            }`}>
              {/* Stance Aura */}
              <div className={`absolute -inset-1 rounded-2xl opacity-40 blur-md pointer-events-none ${
                stance === 'Ashen' ? 'bg-amber-600' : stance === 'Shadow' ? 'bg-purple-600' : 'bg-cyan-600'
              }`} />
              
              <span className="relative z-10">🗡️</span>

              {/* Slash Trail Effect */}
              {slashEffect && (
                <div className="absolute inset-0 border-4 border-amber-300 rounded-2xl animate-ping pointer-events-none" />
              )}
            </div>

            <div className="mt-3 text-center">
              <span className="text-xs uppercase font-bold text-amber-300 tracking-wider">
                Hero of Valdor (Lv. {player.level})
              </span>
              <div className="text-[11px] text-stone-400">
                Stance: <strong className="text-purple-300">{stance}</strong>
              </div>
            </div>
          </div>

          {/* Clash Sparks / Distance Indicator */}
          <div className="flex flex-col items-center justify-center text-stone-500 text-xs">
            <div className="h-0.5 w-24 bg-gradient-to-r from-transparent via-[#5b4e75] to-transparent mb-2" />
            <Swords className="w-6 h-6 text-stone-400 animate-pulse" />
            <span className="text-[10px] mt-1 text-stone-400 font-mono">CLASH ZONE</span>
            <div className="h-0.5 w-24 bg-gradient-to-r from-transparent via-[#5b4e75] to-transparent mt-2" />
          </div>

          {/* Enemy Visual Avatar */}
          <div className="flex flex-col items-center">
            <div className={`relative w-32 h-32 sm:w-44 sm:h-44 rounded-2xl border-2 flex items-center justify-center text-6xl transition-all duration-300 ${
              enemy.isStaggered
                ? 'border-amber-400 bg-amber-950/40 translate-y-3 opacity-80'
                : enemy.isTelegraphing
                ? 'border-red-500 bg-red-950/40 shadow-[0_0_30px_#ef4444] scale-105'
                : 'border-purple-600/40 bg-[#170e24] shadow-2xl'
            }`}>
              {/* Void Marks Orbiting the Boss */}
              {enemy.shadowMarks > 0 && (
                <div className="absolute -inset-3 border-2 border-dashed border-purple-500/60 rounded-3xl animate-spin pointer-events-none" />
              )}

              <span className="relative z-10">{enemy.isBoss ? '👑' : '👹'}</span>

              {/* Stagger Riposte Indicator Button */}
              {enemy.isStaggered && (
                <button
                  onClick={handleVisceralRiposte}
                  className="absolute -top-4 px-3 py-1 bg-amber-500 hover:bg-amber-400 text-black font-extrabold rounded-full text-xs shadow-lg animate-bounce cursor-pointer"
                >
                  ⚡ EXECUTE RIPOSTE [R]
                </button>
              )}
            </div>

            <div className="mt-3 text-center">
              <span className="text-xs uppercase font-bold text-red-300 tracking-wider">
                {enemy.name}
              </span>
              <div className="text-[11px] text-stone-400">
                {enemy.isStaggered ? '⚡ STAGGERED (Vulnerable)' : enemy.isTelegraphing ? '⚠️ WINDING UP ATTACK' : 'Combat Ready'}
              </div>
            </div>
          </div>
        </div>

        {/* Victory / Defeat Overlay Modals */}
        {isVictory && (
          <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md animate-in fade-in">
            <div className="p-8 bg-[#151020] border-2 border-amber-500/60 rounded-2xl text-center max-w-md shadow-2xl space-y-4">
              <Award className="w-16 h-16 text-amber-400 mx-auto animate-bounce" />
              <h3 className="text-2xl font-bold font-heading text-amber-200">FOE VANQUISHED!</h3>
              <p className="text-sm text-stone-300">
                You have defeated <strong className="text-white">{enemy.name}</strong>. The shadows recede from this sanctum.
              </p>
              <div className="p-3 bg-[#0d0a14] rounded-lg border border-[#2b2238] flex justify-around text-xs">
                <div>
                  <span className="text-stone-400 block">Experience</span>
                  <span className="text-amber-400 font-bold text-sm">+{enemy.xpReward} XP</span>
                </div>
                <div>
                  <span className="text-stone-400 block">Souls / Gold</span>
                  <span className="text-yellow-400 font-bold text-sm">+{enemy.soulsReward}</span>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row items-center gap-2 pt-2">
                {onReturnToWorld && (
                  <button
                    onClick={onReturnToWorld}
                    className="w-full sm:flex-1 py-2.5 bg-purple-700 hover:bg-purple-600 text-white font-bold rounded-lg text-sm transition-colors cursor-pointer flex items-center justify-center gap-1.5 shadow-lg"
                  >
                    <Compass className="w-4 h-4" />
                    Return to Open World
                  </button>
                )}
                {onSelectNewEncounter && (
                  <button
                    onClick={onSelectNewEncounter}
                    className="w-full sm:flex-1 py-2.5 bg-amber-600 hover:bg-amber-500 text-stone-900 font-bold rounded-lg text-sm transition-colors cursor-pointer"
                  >
                    Next Dungeon
                  </button>
                )}
                <button
                  onClick={onOpenCodex}
                  className="px-4 py-2.5 bg-stone-800 hover:bg-stone-700 text-stone-200 font-semibold rounded-lg text-sm transition-colors cursor-pointer"
                >
                  Codex [J]
                </button>
              </div>
            </div>
          </div>
        )}

        {isDefeated && (
          <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md animate-in fade-in">
            <div className="p-8 bg-[#180e15] border-2 border-red-600/60 rounded-2xl text-center max-w-md shadow-2xl space-y-4">
              <Skull className="w-16 h-16 text-red-500 mx-auto" />
              <h3 className="text-2xl font-bold font-heading text-red-400">YOU HAVE FALLEN</h3>
              <p className="text-sm text-stone-300">
                The Shadow Mark overtook your consciousness. Rekindle your embers at the shrine.
              </p>
              <button
                onClick={() => {
                  onUpdatePlayer({ hp: player.maxHp, stamina: player.maxStamina, mana: player.maxMana });
                  setIsDefeated(false);
                  setEnemy(initialEnemy);
                }}
                className="w-full py-2.5 bg-red-700 hover:bg-red-600 text-white font-bold rounded-lg text-sm transition-colors cursor-pointer flex items-center justify-center gap-2"
              >
                <RotateCcw className="w-4 h-4" />
                Resurrect at Ashen Shrine
              </button>
            </div>
          </div>
        )}
      </div>

      {/* BOTTOM: Player Status & Interactive Action Controls */}
      <div className="relative z-20 pb-4 px-6 max-w-4xl mx-auto w-full space-y-3">
        {/* Player Bars: HP / Stamina / Mana / Umbral Resonance */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 text-xs">
          {/* Health */}
          <div className="p-2.5 bg-[#140e1e] border border-red-950/60 rounded-lg">
            <div className="flex justify-between text-stone-300 mb-1 font-semibold">
              <span className="flex items-center gap-1 text-red-400">
                <Heart className="w-3.5 h-3.5 fill-current" /> HP
              </span>
              <span>{player.hp} / {player.maxHp}</span>
            </div>
            <div className="w-full h-2.5 bg-black/60 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-red-700 to-rose-500 transition-all duration-200"
                style={{ width: `${(player.hp / player.maxHp) * 100}%` }}
              />
            </div>
          </div>

          {/* Stamina */}
          <div className="p-2.5 bg-[#140e1e] border border-emerald-950/60 rounded-lg">
            <div className="flex justify-between text-stone-300 mb-1 font-semibold">
              <span className="flex items-center gap-1 text-emerald-400">
                <Zap className="w-3.5 h-3.5 fill-current" /> Stamina
              </span>
              <span>{Math.round(player.stamina)} / {player.maxStamina}</span>
            </div>
            <div className="w-full h-2.5 bg-black/60 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-emerald-600 to-teal-400 transition-all duration-100"
                style={{ width: `${(player.stamina / player.maxStamina) * 100}%` }}
              />
            </div>
          </div>

          {/* Mana */}
          <div className="p-2.5 bg-[#140e1e] border border-blue-950/60 rounded-lg">
            <div className="flex justify-between text-stone-300 mb-1 font-semibold">
              <span className="flex items-center gap-1 text-blue-400">
                <Sparkles className="w-3.5 h-3.5" /> Mana
              </span>
              <span>{Math.round(player.mana)} / {player.maxMana}</span>
            </div>
            <div className="w-full h-2.5 bg-black/60 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-blue-600 to-indigo-400 transition-all duration-200"
                style={{ width: `${(player.mana / player.maxMana) * 100}%` }}
              />
            </div>
          </div>

          {/* Umbral Resonance / Shadow Mark Gauge */}
          <div className="p-2.5 bg-[#140e1e] border border-purple-950/60 rounded-lg">
            <div className="flex justify-between text-stone-300 mb-1 font-semibold">
              <span className="flex items-center gap-1 text-purple-400">
                <Flame className="w-3.5 h-3.5" /> Umbral Gauge
              </span>
              <span>{Math.round(player.umbralResonance)}%</span>
            </div>
            <div className="w-full h-2.5 bg-black/60 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-purple-700 via-purple-500 to-fuchsia-400 transition-all duration-200"
                style={{ width: `${player.umbralResonance}%` }}
              />
            </div>
          </div>
        </div>

        {/* Action Toolbar */}
        <div className="bg-[#120f1b]/95 border border-[#372d47] p-3 rounded-xl shadow-2xl backdrop-blur-md flex flex-wrap items-center justify-between gap-2">
          {/* Stance Selector */}
          <div className="flex items-center gap-1 bg-[#09080e] p-1 rounded-lg border border-[#2b2238] text-xs">
            {(['Ashen', 'Shadow', 'Void'] as CombatStance[]).map(st => (
              <button
                key={st}
                onClick={() => setStance(st)}
                className={`px-2.5 py-1 rounded font-semibold transition-all cursor-pointer ${
                  stance === st
                    ? st === 'Ashen'
                      ? 'bg-amber-600 text-stone-900 shadow'
                      : st === 'Shadow'
                      ? 'bg-purple-600 text-white shadow'
                      : 'bg-cyan-600 text-stone-900 shadow'
                    : 'text-stone-400 hover:text-stone-200'
                }`}
              >
                {st} Stance
              </button>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
            {/* 1: Light Strike */}
            <button
              onClick={handleLightAttack}
              disabled={player.stamina < 12}
              className="px-3 py-2 bg-[#211a2f] hover:bg-[#2c223f] disabled:opacity-40 text-stone-200 border border-[#44365b] rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
              title="Light Attack Combo (Key 1 or Z)"
            >
              <Swords className="w-3.5 h-3.5 text-amber-400" />
              <span>Light [1]</span>
            </button>

            {/* 2: Heavy Cleave */}
            <button
              onClick={handleHeavyCleave}
              disabled={player.stamina < 25}
              className="px-3 py-2 bg-[#211a2f] hover:bg-[#2c223f] disabled:opacity-40 text-stone-200 border border-[#44365b] rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
              title="Heavy Cleave Poise Breaker (Key 2 or X)"
            >
              <Shield className="w-3.5 h-3.5 text-orange-400" />
              <span>Heavy [2]</span>
            </button>

            {/* Space: Perfect Parry */}
            <button
              onClick={handleParry}
              className={`px-3 py-2 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer border ${
                parryWindowActive
                  ? 'bg-cyan-500 text-stone-900 border-cyan-300 shadow-[0_0_12px_#22d3ee]'
                  : 'bg-cyan-950/60 hover:bg-cyan-900 text-cyan-200 border-cyan-500/40'
              }`}
              title="Deflect Enemy Attack (Spacebar)"
            >
              <Shield className="w-3.5 h-3.5" />
              <span>Parry [Space]</span>
            </button>

            {/* Shift: Dodge Roll */}
            <button
              onClick={handleDodge}
              disabled={cooldowns.dodge > 0 || player.stamina < 15}
              className="px-3 py-2 bg-[#191524] hover:bg-[#241e33] disabled:opacity-40 text-stone-300 border border-[#3b314e] rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
              title="Shadow Dodge Roll (Shift or C)"
            >
              <Zap className="w-3.5 h-3.5 text-emerald-400" />
              <span>Dodge [Shift]</span>
            </button>

            {/* Q: Shadow Detonation */}
            <button
              onClick={handleDetonate}
              disabled={enemy.shadowMarks === 0 || cooldowns.detonate > 0}
              className="px-3.5 py-2 bg-purple-950/80 hover:bg-purple-900 disabled:opacity-40 text-purple-100 border border-purple-500/50 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-sm"
              title="Detonate all Shadow Marks for massive burst (Q)"
            >
              <Flame className="w-3.5 h-3.5 text-purple-400" />
              <span>Detonate [Q] ({enemy.shadowMarks})</span>
            </button>

            {/* E: Abyssal Step */}
            <button
              onClick={handleAbyssalBlink}
              disabled={player.mana < 25 || cooldowns.blink > 0}
              className="px-3 py-2 bg-indigo-950/80 hover:bg-indigo-900 disabled:opacity-40 text-indigo-100 border border-indigo-500/40 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
              title="Teleport Backstab (E)"
            >
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
              <span>Blink [E]</span>
            </button>

            {/* F: Ashen Flask */}
            <button
              onClick={handleDrinkFlask}
              disabled={cooldowns.flask > 0}
              className="px-3 py-2 bg-emerald-950/80 hover:bg-emerald-900 disabled:opacity-40 text-emerald-200 border border-emerald-500/40 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
              title="Drink Ashen Flask to heal (F)"
            >
              <Heart className="w-3.5 h-3.5 text-emerald-400" />
              <span>Flask [F]</span>
            </button>
          </div>
        </div>

        {/* Combat Log Ticker */}
        <div className="px-3 py-1.5 bg-[#0b0912]/80 border border-[#231b2e] rounded-lg text-[11px] text-stone-400 flex items-center justify-between truncate">
          <div className="flex items-center gap-2 truncate">
            <span className="text-amber-400/80 font-mono">[{combatLogs[0]?.timestamp || '00:00'}]</span>
            <span className="truncate">{combatLogs[0]?.text || 'Combat arena ready.'}</span>
          </div>
          <span className="text-[10px] text-stone-500 hidden sm:inline">Hotkey Guide: 1 (Light), 2 (Heavy), Space (Parry), Q (Detonate)</span>
        </div>
      </div>
    </div>
  );
};
