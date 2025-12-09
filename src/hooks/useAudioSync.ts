import { useEffect, useRef } from 'react';
import { usePlayerStore } from '@/stores/playerStore';
import { useQueueStore } from '@/stores/queueStore';
import { getAudioEngine } from '@/services/audio/audioEngine';
import { getTrackAudioBlob } from '@/services/storage/trackStorage';

export function useAudioSync(): void {
  const isInitialized = useRef(false);
  const currentTrackId = useRef<string | null>(null);

  // Initialize AudioEngine once
  useEffect(() => {
    if (isInitialized.current) return;

    const audioEngine = getAudioEngine();

    const init = async () => {
      try {
        await audioEngine.initialize();
        isInitialized.current = true;
        console.log('AudioEngine initialized via useAudioSync');
      } catch (error) {
        console.error('Failed to initialize AudioEngine:', error);
        usePlayerStore.getState().setError('Failed to initialize audio engine');
      }
    };

    init();

    return () => {
      // Don't dispose on unmount - singleton persists
    };
  }, []);

  // Subscribe to AudioEngine events
  useEffect(() => {
    const audioEngine = getAudioEngine();

    const handleTimeUpdate = (data: unknown) => {
      const { time } = data as { time: number };
      usePlayerStore.getState().updatePosition(time);
    };

    const handleLoaded = (data: unknown) => {
      const { duration } = data as { duration: number };
      usePlayerStore.getState().setDuration(duration);
      usePlayerStore.getState().setIsLoading(false);
    };

    const handleEnded = async () => {
      usePlayerStore.getState().setIsPlaying(false);

      // Check autoplay and advance queue
      const { isAutoplayEnabled, advanceQueue, getCurrentTrack } =
        useQueueStore.getState();

      if (isAutoplayEnabled) {
        const hasNext = advanceQueue();
        if (hasNext) {
          // Load and play next track
          const nextTrack = await getCurrentTrack();
          if (nextTrack) {
            usePlayerStore.getState().loadTrack(nextTrack);
          }
        }
      }
    };

    const handleError = (data: unknown) => {
      const { error } = data as { error: Error };
      usePlayerStore.getState().setError(error.message);
    };

    const handlePlay = () => {
      usePlayerStore.getState().setIsPlaying(true);
    };

    const handlePause = () => {
      usePlayerStore.getState().setIsPlaying(false);
    };

    audioEngine.on('timeupdate', handleTimeUpdate);
    audioEngine.on('loaded', handleLoaded);
    audioEngine.on('ended', handleEnded);
    audioEngine.on('error', handleError);
    audioEngine.on('play', handlePlay);
    audioEngine.on('pause', handlePause);

    return () => {
      audioEngine.off('timeupdate', handleTimeUpdate);
      audioEngine.off('loaded', handleLoaded);
      audioEngine.off('ended', handleEnded);
      audioEngine.off('error', handleError);
      audioEngine.off('play', handlePlay);
      audioEngine.off('pause', handlePause);
    };
  }, []);

  // Subscribe to track changes in PlayerStore and load audio
  useEffect(() => {
    const audioEngine = getAudioEngine();

    const unsubTrack = usePlayerStore.subscribe(
      (state) => state.currentTrack,
      async (track) => {
        if (!track) {
          currentTrackId.current = null;
          return;
        }

        // Avoid reloading the same track
        if (track.id === currentTrackId.current) return;
        currentTrackId.current = track.id;

        console.log('Loading track:', track.title);

        try {
          // Get audio blob from storage
          const audioBlob = await getTrackAudioBlob(track.id);
          if (!audioBlob) {
            throw new Error('Audio file not found in storage');
          }

          await audioEngine.loadFromBlob(audioBlob);

          // Seek to start time if specified
          if (track.startTime && track.startTime > 0) {
            await audioEngine.seek(track.startTime);
          }
        } catch (error) {
          console.error('Failed to load track audio:', error);
          usePlayerStore
            .getState()
            .setError(
              error instanceof Error ? error.message : 'Failed to load audio'
            );
        }
      }
    );

    return () => unsubTrack();
  }, []);

  // Subscribe to play/pause changes in PlayerStore and forward to AudioEngine
  useEffect(() => {
    const audioEngine = getAudioEngine();
    let wasPlaying = false;

    const unsubPlayState = usePlayerStore.subscribe(
      (state) => state.isPlaying,
      async (isPlaying) => {
        // Only act if state actually changed and track is loaded
        if (isPlaying === wasPlaying) return;
        wasPlaying = isPlaying;

        const { currentTrack, isLoading } = usePlayerStore.getState();
        if (!currentTrack || isLoading) return;

        try {
          if (isPlaying) {
            await audioEngine.play();
          } else {
            await audioEngine.pause();
          }
        } catch (error) {
          console.error('Playback control error:', error);
        }
      }
    );

    return () => unsubPlayState();
  }, []);

  // Subscribe to seek requests in PlayerStore
  useEffect(() => {
    const audioEngine = getAudioEngine();

    const unsubSeek = usePlayerStore.subscribe(
      (state) => state.currentTime,
      async (currentTime, prevTime) => {
        // Detect user seek (large jump vs normal playback)
        const timeDiff = Math.abs(currentTime - prevTime);
        if (timeDiff > 0.5) {
          // User seek detected
          await audioEngine.seek(currentTime);
        }
      }
    );

    return () => unsubSeek();
  }, []);

  // Subscribe to tempo changes in PlayerStore
  useEffect(() => {
    const audioEngine = getAudioEngine();

    const unsubTempo = usePlayerStore.subscribe(
      (state) => state.tempoMultiplier,
      async (tempoMultiplier) => {
        await audioEngine.setSpeed(tempoMultiplier);
      }
    );

    return () => unsubTempo();
  }, []);

  // Subscribe to volume changes in PlayerStore
  useEffect(() => {
    const audioEngine = getAudioEngine();

    const unsubVolume = usePlayerStore.subscribe(
      (state) => ({ volume: state.volume, isMuted: state.isMuted }),
      ({ volume, isMuted }) => {
        audioEngine.setVolume(isMuted ? 0 : volume);
      },
      { equalityFn: (a, b) => a.volume === b.volume && a.isMuted === b.isMuted }
    );

    return () => unsubVolume();
  }, []);
}
