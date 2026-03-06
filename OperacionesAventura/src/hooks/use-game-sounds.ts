"use client";

import { useEffect, useRef, useCallback } from 'react';
import * as Tone from 'tone';

export function useGameSounds() {
  const synth = useRef<Tone.Synth | null>(null);
  const isInitialized = useRef(false);

  const initialize = useCallback(() => {
    if (!isInitialized.current) {
      synth.current = new Tone.Synth({
        oscillator: { type: 'sine' },
        envelope: { attack: 0.005, decay: 0.1, sustain: 0.3, release: 1 },
      }).toDestination();
      isInitialized.current = true;
    }
  }, []);

  useEffect(() => {
    // Cleanup on unmount
    return () => {
      if (synth.current) {
        synth.current.dispose();
      }
      isInitialized.current = false;
    };
  }, []);

  const playSound = (notes: string[], duration: string, intervals: number[]) => {
    if (synth.current && Tone.context.state === 'running') {
      const now = Tone.now();
      notes.forEach((note, index) => {
        synth.current?.triggerAttackRelease(note, duration, now + intervals[index]);
      });
    }
  };

  const playCorrectSound = useCallback(() => {
    playSound(['C5', 'E5', 'G5'], '8n', [0, 0.1, 0.2]);
  }, []);

  const playIncorrectSound = useCallback(() => {
    playSound(['C3', 'C#3'], '8n', [0, 0.1]);
  }, []);

  const playLevelUpSound = useCallback(() => {
    playSound(['C5', 'E5', 'G5', 'C6'], '8n', [0, 0.1, 0.2, 0.4]);
  }, []);

  const startAudioContext = useCallback(() => {
    if (Tone.context.state !== 'running') {
      Tone.start().then(() => {
        initialize();
      });
    } else {
      initialize();
    }
  }, [initialize]);

  return { playCorrectSound, playIncorrectSound, playLevelUpSound, startAudioContext };
}
