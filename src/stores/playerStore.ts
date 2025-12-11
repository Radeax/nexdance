import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';
import type { Track } from '@/types/track';

export interface PlayerState {
  // Current track
  currentTrack: Track | null;

  // Playback state
  isPlaying: boolean;
  currentTime: number; // Current position in seconds (source time)
  duration: number; // Track duration in seconds

  // Tempo control
  originalBpm: number; // Track's detected/set BPM
  currentBpm: number; // Adjusted BPM (after tempo change)
  tempoMultiplier: number; // 0.5 - 2.0, default 1.0

  // Volume
  volume: number; // 0 - 1, default 1.0
  isMuted: boolean;

  // Track customization (from Track model)
  effectiveStartTime: number; // Where playback starts
  effectiveEndTime: number; // Where playback ends (or fades)

  // Loading state
  isLoading: boolean;
  error: string | null;
}

export interface PlayerActions {
  // Track loading
  loadTrack: (track: Track) => void;
  clearTrack: () => void;

  // Playback control (these set intent - AudioEngine executes)
  play: () => void;
  pause: () => void;
  togglePlayback: () => void;
  seek: (time: number) => void;

  // Tempo control
  setTempo: (bpm: number) => void;
  setTempoMultiplier: (multiplier: number) => void;
  resetTempo: () => void;

  // Volume control
  setVolume: (volume: number) => void;
  toggleMute: () => void;

  // Position updates (called by AudioEngine sync)
  updatePosition: (time: number) => void;

  // State updates (called by AudioEngine)
  setIsPlaying: (playing: boolean) => void;
  setIsLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setDuration: (duration: number) => void;
}

const initialState: PlayerState = {
  currentTrack: null,
  isPlaying: false,
  currentTime: 0,
  duration: 0,
  originalBpm: 120,
  currentBpm: 120,
  tempoMultiplier: 1.0,
  volume: 1.0,
  isMuted: false,
  effectiveStartTime: 0,
  effectiveEndTime: 0,
  isLoading: false,
  error: null,
};

export const usePlayerStore = create<PlayerState & PlayerActions>()(
  subscribeWithSelector((set, get) => ({
    ...initialState,

    // Track loading
    loadTrack: (track) => {
      const startTime = track.startTime ?? 0;
      const endTime = track.endTime ?? track.duration;

      set({
        currentTrack: track,
        isPlaying: false,
        currentTime: startTime,
        duration: track.duration,
        originalBpm: track.bpm ?? 120,
        currentBpm: track.bpm ?? 120,
        tempoMultiplier: 1.0,
        effectiveStartTime: startTime,
        effectiveEndTime: endTime,
        isLoading: true,
        error: null,
      });
    },

    clearTrack: () => set(initialState),

    // Playback control
    play: () => set({ isPlaying: true }),
    pause: () => set({ isPlaying: false }),
    togglePlayback: () => set((state) => ({ isPlaying: !state.isPlaying })),

    seek: (time) => {
      const { effectiveStartTime, effectiveEndTime } = get();
      const clampedTime = Math.max(effectiveStartTime, Math.min(time, effectiveEndTime));
      set({ currentTime: clampedTime });
    },

    // Tempo control
    setTempo: (bpm) => {
      const { originalBpm } = get();
      const multiplier = bpm / originalBpm;
      set({ currentBpm: bpm, tempoMultiplier: multiplier });
    },

    setTempoMultiplier: (multiplier) => {
      const clamped = Math.max(0.5, Math.min(2.0, multiplier));
      const { originalBpm } = get();
      set({
        tempoMultiplier: clamped,
        currentBpm: Math.round(originalBpm * clamped),
      });
    },

    resetTempo: () => {
      const { originalBpm } = get();
      set({ tempoMultiplier: 1.0, currentBpm: originalBpm });
    },

    // Volume control
    setVolume: (volume) => set({ volume: Math.max(0, Math.min(1, volume)) }),
    toggleMute: () => set((state) => ({ isMuted: !state.isMuted })),

    // Position updates (called frequently by AudioEngine)
    updatePosition: (time) => set({ currentTime: time }),

    // State setters (called by AudioEngine)
    setIsPlaying: (playing) => set({ isPlaying: playing }),
    setIsLoading: (loading) => set({ isLoading: loading }),
    setError: (error) => set({ error, isLoading: false }),
    setDuration: (duration) => set({ duration }),
  }))
);
