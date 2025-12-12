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
        className="h-24 flex items-center justify-center text-muted-foreground rounded-[var(--panel-radius)]"
        style={{
          background: 'var(--color-bg-panel)',
          backdropFilter: 'blur(var(--panel-blur))',
          boxShadow: 'var(--shadow-panel)',
        }}
      >
        Select a song to start playing
      </div>
    );
  }

  return (
    <div
      className="px-6 py-4 rounded-[var(--panel-radius)]"
      style={{
        background: 'var(--color-bg-panel)',
        backdropFilter: 'blur(var(--panel-blur))',
        boxShadow: 'var(--shadow-panel)',
      }}
    >
      {/* Progress Bar (full width) */}
      <ProgressBarWithMarkers />

      {/* Controls Row */}
      <div className="flex items-center justify-between mt-3">
        {/* Left spacer for balance */}
        <div className="w-[280px]" />

        {/* Center: Playback Controls */}
        <PlaybackControls />

        {/* Right: Fade buttons, Tempo, Loop */}
        <div className="flex items-center gap-2 w-[280px] justify-end">
          <FadeButtons />
          <TempoButton />
          <LoopButton />
        </div>
      </div>
    </div>
  );
}
