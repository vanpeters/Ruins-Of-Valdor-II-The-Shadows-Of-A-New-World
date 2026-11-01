import { useCallback, useRef, useState, useEffect } from 'react';

// Hook-based sound effect manager using Web Audio API
// Provides distinct procedural audio cues for:
// - Shadow Mark applications (pitch & harmonics rise with mark stacks 1-5)
// - Successful parries (crisp high-frequency steel deflection ring)
// - Enemy staggers (armor crumple, heavy poise shatter, dazed dissonance)
// - Plus mark detonations, combat slashes, dodges, town chimes, and skits

export interface SoundEffectsManager {
  playShadowMarkApplied: (stack: number) => void;
  playParryClash: () => void;
  playEnemyStagger: () => void;
  playMarkDetonation: (stacks: number) => void;
  playSlash: () => void;
  playHeavyHit: () => void;
  playDodge: () => void;
  playPlayerHurt: () => void;
  playHeal: () => void;
  playLevelUp: () => void;
  playEncounterStart: () => void;
  playChestOpen: () => void;
  playSkitChime: () => void;
  playTownEnter: () => void;
  toggleAmbient: (active?: boolean) => void;
  isAmbientActive: boolean;
  isMuted: boolean;
  setMuted: (muted: boolean) => void;
  volume: number;
  setVolume: (vol: number) => void;
}

export function useSoundEffects(): SoundEffectsManager {
  const ctxRef = useRef<AudioContext | null>(null);
  const masterGainRef = useRef<GainNode | null>(null);
  const ambientGainRef = useRef<GainNode | null>(null);
  const ambientOsc1Ref = useRef<OscillatorNode | null>(null);
  const ambientOsc2Ref = useRef<OscillatorNode | null>(null);

  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolumeState] = useState(0.6);
  const [isAmbientActive, setIsAmbientActive] = useState(false);

  // Initialize AudioContext lazily on user gesture
  const getContext = useCallback((): { ctx: AudioContext; master: GainNode } | null => {
    try {
      if (!ctxRef.current) {
        const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        const ctx = new AudioCtx();
        const master = ctx.createGain();
        master.gain.setValueAtTime(isMuted ? 0 : volume, ctx.currentTime);
        master.connect(ctx.destination);

        ctxRef.current = ctx;
        masterGainRef.current = master;
      }

      if (ctxRef.current.state === 'suspended') {
        ctxRef.current.resume();
      }

      return { ctx: ctxRef.current, master: masterGainRef.current! };
    } catch {
      return null;
    }
  }, [isMuted, volume]);

  const setMuted = useCallback((muted: boolean) => {
    setIsMuted(muted);
    if (masterGainRef.current && ctxRef.current) {
      masterGainRef.current.gain.setValueAtTime(muted ? 0 : volume, ctxRef.current.currentTime);
    }
  }, [volume]);

  const setVolume = useCallback((vol: number) => {
    const clamped = Math.max(0, Math.min(1, vol));
    setVolumeState(clamped);
    if (masterGainRef.current && ctxRef.current && !isMuted) {
      masterGainRef.current.gain.setValueAtTime(clamped, ctxRef.current.currentTime);
    }
  }, [isMuted]);

  // 1. DISTINCT SHADOW MARK APPLICATION CUE
  // Stacks 1-5 produce progressively deeper, more harmonic, and ominous ethereal chimes
  const playShadowMarkApplied = useCallback((stack: number) => {
    if (isMuted) return;
    const audio = getContext();
    if (!audio) return;
    const { ctx, master } = audio;

    const baseFreqs = [240, 288, 360, 432, 576]; // Pentatonic dark progression
    const freq = baseFreqs[Math.min(stack - 1, 4)] || 300;

    // Primary dark bell oscillator
    const osc1 = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    const gain = ctx.createGain();
    const filter = ctx.createBiquadFilter();

    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(freq, ctx.currentTime);
    osc1.frequency.exponentialRampToValueAtTime(freq * 1.6, ctx.currentTime + 0.22);

    // Secondary sub-harmonic for heavy presence on higher stacks
    osc2.type = 'triangle';
    osc2.frequency.setValueAtTime(freq * 0.5, ctx.currentTime);
    osc2.frequency.exponentialRampToValueAtTime(freq * 0.75, ctx.currentTime + 0.25);

    // Low pass filter with sweep to create dark ethereal whoosh
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(800 + stack * 200, ctx.currentTime);
    filter.frequency.exponentialRampToValueAtTime(300, ctx.currentTime + 0.3);

    const gainAmt = 0.25 + stack * 0.05;
    gain.gain.setValueAtTime(gainAmt, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.32);

    osc1.connect(filter);
    osc2.connect(filter);
    filter.connect(gain);
    gain.connect(master);

    osc1.start();
    osc2.start();
    osc1.stop(ctx.currentTime + 0.33);
    osc2.stop(ctx.currentTime + 0.33);
  }, [isMuted, getContext]);

  // 2. DISTINCT SUCCESSFUL PARRY CLASH
  // Piercing metallic deflection with high-frequency harmonic sheen and resonant bell tail
  const playParryClash = useCallback(() => {
    if (isMuted) return;
    const audio = getContext();
    if (!audio) return;
    const { ctx, master } = audio;

    // High frequency primary ping (steel impact)
    const oscHigh = ctx.createOscillator();
    const oscMid = ctx.createOscillator();
    const noiseGain = ctx.createGain();
    const mainGain = ctx.createGain();

    oscHigh.type = 'sine';
    oscHigh.frequency.setValueAtTime(2600, ctx.currentTime);
    oscHigh.frequency.exponentialRampToValueAtTime(1750, ctx.currentTime + 0.45);

    oscMid.type = 'triangle';
    oscMid.frequency.setValueAtTime(1320, ctx.currentTime);
    oscMid.frequency.exponentialRampToValueAtTime(980, ctx.currentTime + 0.5);

    // Initial sharp click transient
    mainGain.gain.setValueAtTime(0.7, ctx.currentTime);
    mainGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.52);

    oscHigh.connect(mainGain);
    oscMid.connect(mainGain);
    mainGain.connect(master);

    oscHigh.start();
    oscMid.start();
    oscHigh.stop(ctx.currentTime + 0.53);
    oscMid.stop(ctx.currentTime + 0.53);
  }, [isMuted, getContext]);

  // 3. DISTINCT ENEMY STAGGER CUE
  // Heavy armor crumple, heavy poise shatter, and exposed descending dazed ringing
  const playEnemyStagger = useCallback(() => {
    if (isMuted) return;
    const audio = getContext();
    if (!audio) return;
    const { ctx, master } = audio;

    // Heavy low crunch (poise breaking)
    const crunchOsc = ctx.createOscillator();
    const crunchSub = ctx.createOscillator();
    const crunchGain = ctx.createGain();

    crunchOsc.type = 'sawtooth';
    crunchOsc.frequency.setValueAtTime(140, ctx.currentTime);
    crunchOsc.frequency.exponentialRampToValueAtTime(35, ctx.currentTime + 0.3);

    crunchSub.type = 'sine';
    crunchSub.frequency.setValueAtTime(80, ctx.currentTime);
    crunchSub.frequency.exponentialRampToValueAtTime(20, ctx.currentTime + 0.4);

    crunchGain.gain.setValueAtTime(0.65, ctx.currentTime);
    crunchGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.45);

    crunchOsc.connect(crunchGain);
    crunchSub.connect(crunchGain);
    crunchGain.connect(master);

    crunchOsc.start();
    crunchSub.start();
    crunchOsc.stop(ctx.currentTime + 0.45);
    crunchSub.stop(ctx.currentTime + 0.45);

    // Dazed, exposed wobble bell (signals vulnerability for riposte execution)
    const dazeOsc = ctx.createOscillator();
    const dazeGain = ctx.createGain();
    const lfo = ctx.createOscillator();
    const lfoGain = ctx.createGain();

    dazeOsc.type = 'triangle';
    dazeOsc.frequency.setValueAtTime(440, ctx.currentTime + 0.1);
    dazeOsc.frequency.exponentialRampToValueAtTime(220, ctx.currentTime + 0.7);

    // LFO tremolo wobble
    lfo.frequency.setValueAtTime(8, ctx.currentTime); // 8 Hz wobble
    lfoGain.gain.setValueAtTime(30, ctx.currentTime);
    lfo.connect(dazeOsc.frequency);

    dazeGain.gain.setValueAtTime(0.0, ctx.currentTime);
    dazeGain.gain.setValueAtTime(0.4, ctx.currentTime + 0.1);
    dazeGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.75);

    dazeOsc.connect(dazeGain);
    dazeGain.connect(master);

    lfo.start(ctx.currentTime + 0.1);
    dazeOsc.start(ctx.currentTime + 0.1);
    lfo.stop(ctx.currentTime + 0.75);
    dazeOsc.stop(ctx.currentTime + 0.75);
  }, [isMuted, getContext]);

  // Mark Detonation: catastrophic void sub-bass implosion
  const playMarkDetonation = useCallback((stacks: number) => {
    if (isMuted) return;
    const audio = getContext();
    if (!audio) return;
    const { ctx, master } = audio;

    const subOsc = ctx.createOscillator();
    const highOsc = ctx.createOscillator();
    const gain = ctx.createGain();

    subOsc.type = 'sawtooth';
    subOsc.frequency.setValueAtTime(95, ctx.currentTime);
    subOsc.frequency.exponentialRampToValueAtTime(20, ctx.currentTime + 0.7);

    highOsc.type = 'triangle';
    highOsc.frequency.setValueAtTime(580, ctx.currentTime);
    highOsc.frequency.exponentialRampToValueAtTime(70, ctx.currentTime + 0.45);

    const gainAmt = Math.min(0.9, 0.45 + stacks * 0.1);
    gain.gain.setValueAtTime(gainAmt, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.75);

    subOsc.connect(gain);
    highOsc.connect(gain);
    gain.connect(master);

    subOsc.start();
    highOsc.start();
    subOsc.stop(ctx.currentTime + 0.78);
    highOsc.stop(ctx.currentTime + 0.78);
  }, [isMuted, getContext]);

  const playSlash = useCallback(() => {
    if (isMuted) return;
    const audio = getContext();
    if (!audio) return;
    const { ctx, master } = audio;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const filter = ctx.createBiquadFilter();

    osc.type = 'sawtooth';
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(750, ctx.currentTime);
    filter.frequency.exponentialRampToValueAtTime(160, ctx.currentTime + 0.13);

    osc.frequency.setValueAtTime(300, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(90, ctx.currentTime + 0.13);

    gain.gain.setValueAtTime(0.35, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.14);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(master);

    osc.start();
    osc.stop(ctx.currentTime + 0.14);
  }, [isMuted, getContext]);

  const playHeavyHit = useCallback(() => {
    if (isMuted) return;
    const audio = getContext();
    if (!audio) return;
    const { ctx, master } = audio;

    const osc = ctx.createOscillator();
    const sub = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(150, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(35, ctx.currentTime + 0.28);

    sub.type = 'sine';
    sub.frequency.setValueAtTime(80, ctx.currentTime);
    sub.frequency.exponentialRampToValueAtTime(25, ctx.currentTime + 0.32);

    gain.gain.setValueAtTime(0.6, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.32);

    osc.connect(gain);
    sub.connect(gain);
    gain.connect(master);

    osc.start();
    sub.start();
    osc.stop(ctx.currentTime + 0.33);
    sub.stop(ctx.currentTime + 0.33);
  }, [isMuted, getContext]);

  const playDodge = useCallback(() => {
    if (isMuted) return;
    const audio = getContext();
    if (!audio) return;
    const { ctx, master } = audio;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const filter = ctx.createBiquadFilter();

    osc.type = 'sawtooth';
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(500, ctx.currentTime);
    filter.frequency.exponentialRampToValueAtTime(100, ctx.currentTime + 0.18);

    osc.frequency.setValueAtTime(220, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(70, ctx.currentTime + 0.18);

    gain.gain.setValueAtTime(0.2, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.19);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(master);

    osc.start();
    osc.stop(ctx.currentTime + 0.2);
  }, [isMuted, getContext]);

  const playPlayerHurt = useCallback(() => {
    if (isMuted) return;
    const audio = getContext();
    if (!audio) return;
    const { ctx, master } = audio;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(160, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(45, ctx.currentTime + 0.18);

    gain.gain.setValueAtTime(0.4, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.2);

    osc.connect(gain);
    gain.connect(master);

    osc.start();
    osc.stop(ctx.currentTime + 0.2);
  }, [isMuted, getContext]);

  const playHeal = useCallback(() => {
    if (isMuted) return;
    const audio = getContext();
    if (!audio) return;
    const { ctx, master } = audio;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(260, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(600, ctx.currentTime + 0.35);

    gain.gain.setValueAtTime(0.3, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.38);

    osc.connect(gain);
    gain.connect(master);

    osc.start();
    osc.stop(ctx.currentTime + 0.4);
  }, [isMuted, getContext]);

  const playLevelUp = useCallback(() => {
    if (isMuted) return;
    const audio = getContext();
    if (!audio) return;
    const { ctx, master } = audio;

    const notes = [261.63, 329.63, 392.0, 523.25, 659.25];
    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.08);

      gain.gain.setValueAtTime(0.25, ctx.currentTime + idx * 0.08);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + idx * 0.08 + 0.4);

      osc.connect(gain);
      gain.connect(master);

      osc.start(ctx.currentTime + idx * 0.08);
      osc.stop(ctx.currentTime + idx * 0.08 + 0.45);
    });
  }, [isMuted, getContext]);

  // Tales of Destiny style encounter trigger sound (sharp dramatic rising chime & slash)
  const playEncounterStart = useCallback(() => {
    if (isMuted) return;
    const audio = getContext();
    if (!audio) return;
    const { ctx, master } = audio;

    const osc1 = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    const gain = ctx.createGain();

    osc1.type = 'sawtooth';
    osc1.frequency.setValueAtTime(180, ctx.currentTime);
    osc1.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.25);

    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(360, ctx.currentTime);
    osc2.frequency.exponentialRampToValueAtTime(1760, ctx.currentTime + 0.25);

    gain.gain.setValueAtTime(0.5, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35);

    osc1.connect(gain);
    osc2.connect(gain);
    gain.connect(master);

    osc1.start();
    osc2.start();
    osc1.stop(ctx.currentTime + 0.36);
    osc2.stop(ctx.currentTime + 0.36);
  }, [isMuted, getContext]);

  // Tales style skit alert chime
  const playSkitChime = useCallback(() => {
    if (isMuted) return;
    const audio = getContext();
    if (!audio) return;
    const { ctx, master } = audio;

    const notes = [587.33, 880.0]; // D5 -> A5
    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.1);

      gain.gain.setValueAtTime(0.3, ctx.currentTime + idx * 0.1);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + idx * 0.1 + 0.3);

      osc.connect(gain);
      gain.connect(master);

      osc.start(ctx.currentTime + idx * 0.1);
      osc.stop(ctx.currentTime + idx * 0.1 + 0.32);
    });
  }, [isMuted, getContext]);

  // Town entry peaceful brass / flute chime
  const playTownEnter = useCallback(() => {
    if (isMuted) return;
    const audio = getContext();
    if (!audio) return;
    const { ctx, master } = audio;

    const chord = [392.0, 493.88, 587.33]; // G major
    chord.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, ctx.currentTime);

      gain.gain.setValueAtTime(0.2, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.6);

      osc.connect(gain);
      gain.connect(master);

      osc.start();
      osc.stop(ctx.currentTime + 0.62);
    });
  }, [isMuted, getContext]);

  // Treasure chest open chime
  const playChestOpen = useCallback(() => {
    if (isMuted) return;
    const audio = getContext();
    if (!audio) return;
    const { ctx, master } = audio;

    const notes = [329.63, 392.0, 493.88, 659.25];
    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.07);

      gain.gain.setValueAtTime(0.25, ctx.currentTime + idx * 0.07);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + idx * 0.07 + 0.4);

      osc.connect(gain);
      gain.connect(master);

      osc.start(ctx.currentTime + idx * 0.07);
      osc.stop(ctx.currentTime + idx * 0.07 + 0.42);
    });
  }, [isMuted, getContext]);

  // Ambient drone
  const toggleAmbient = useCallback((active?: boolean) => {
    const audio = getContext();
    if (!audio) return;
    const { ctx, master } = audio;

    const shouldStart = active !== undefined ? active : !isAmbientActive;
    if (shouldStart && !isAmbientActive) {
      ambientGainRef.current = ctx.createGain();
      ambientGainRef.current.gain.setValueAtTime(0.08, ctx.currentTime);

      ambientOsc1Ref.current = ctx.createOscillator();
      ambientOsc1Ref.current.type = 'sine';
      ambientOsc1Ref.current.frequency.setValueAtTime(55, ctx.currentTime); // Low A

      ambientOsc2Ref.current = ctx.createOscillator();
      ambientOsc2Ref.current.type = 'triangle';
      ambientOsc2Ref.current.frequency.setValueAtTime(82.4, ctx.currentTime); // Low E

      ambientOsc1Ref.current.connect(ambientGainRef.current);
      ambientOsc2Ref.current.connect(ambientGainRef.current);
      ambientGainRef.current.connect(master);

      ambientOsc1Ref.current.start();
      ambientOsc2Ref.current.start();
      setIsAmbientActive(true);
    } else if (!shouldStart && isAmbientActive) {
      if (ambientOsc1Ref.current) {
        ambientOsc1Ref.current.stop();
        ambientOsc1Ref.current.disconnect();
      }
      if (ambientOsc2Ref.current) {
        ambientOsc2Ref.current.stop();
        ambientOsc2Ref.current.disconnect();
      }
      setIsAmbientActive(false);
    }
  }, [isAmbientActive, getContext]);

  return {
    playShadowMarkApplied,
    playParryClash,
    playEnemyStagger,
    playMarkDetonation,
    playSlash,
    playHeavyHit,
    playDodge,
    playPlayerHurt,
    playHeal,
    playLevelUp,
    playEncounterStart,
    playChestOpen,
    playSkitChime,
    playTownEnter,
    toggleAmbient,
    isAmbientActive,
    isMuted,
    setMuted,
    volume,
    setVolume
  };
}
