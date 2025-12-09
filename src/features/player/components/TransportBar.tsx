import { usePlayerStore } from '@/stores/playerStore';
import { PlaybackControls } from './PlaybackControls';
import { ProgressBar } from './ProgressBar';
import { TempoControl } from './TempoControl';
import { VolumeControl } from './VolumeControl';
import { TrackInfo } from './TrackInfo';

export function TransportBar() {
  const currentTrack = usePlayerStore((state) => state.currentTrack);

  return (
    <div className="h-24 border-t bg-background px-4 py-2">
      {currentTrack ? (
        <div className="flex flex-col h-full gap-2">
          {/* Progress bar (full width) */}
          <ProgressBar />

          {/* Controls row */}
          <div className="flex items-center gap-6">
            {/* Track info (left) */}
            <TrackInfo />

            {/* Playback controls (center) */}
            <div className="flex-1 flex justify-center">
              <PlaybackControls />
            </div>

            {/* Tempo + Volume (right) */}
            <div className="flex items-center gap-4">
              <TempoControl />
              <VolumeControl />
            </div>
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-center h-full text-muted-foreground">
          Select a song to start playing
        </div>
      )}
    </div>
  );
}
