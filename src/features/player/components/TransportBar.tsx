import { usePlayerStore } from '@/stores/playerStore';
import { PlaybackControls } from './PlaybackControls';
import { ProgressBarWithMarkers } from './ProgressBarWithMarkers';
import { FadeButtons } from './FadeButtons';
import { TempoButton } from './TempoButton';
import { LoopButton } from './LoopButton';

export function TransportBar() {
  const currentTrack = usePlayerStore((state) => state.currentTrack);

  if (!currentTrack) {
    return (
      <div
        className="h-24 border-t flex items-center justify-center text-muted-foreground backdrop-blur-sm"
        style={{ background: 'var(--color-bg-panel)' }}
      >
        Select a song to start playing
      </div>
    );
  }

  return (
    <div
      className="border-t px-4 py-3 backdrop-blur-sm"
      style={{ background: 'var(--color-bg-panel)' }}
    >
      {/* Progress Bar (full width) */}
      <ProgressBarWithMarkers />

      {/* Controls Row */}
      <div className="flex items-center justify-center gap-4 mt-3">
        {/* Center: Playback Controls */}
        <PlaybackControls />

        {/* Right: Fade buttons, Tempo, Loop */}
        <div className="flex items-center gap-2 ml-8">
          <FadeButtons />
          <TempoButton />
          <LoopButton />
        </div>
      </div>
    </div>
  );
}
