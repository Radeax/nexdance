import { useCallback } from 'react';
import { Slider } from '@/components/ui/slider';
import { usePlayerStore } from '@/stores/playerStore';
import { getAudioEngine } from '@/services/audio/audioEngine';

export function ProgressBar() {
  const currentTime = usePlayerStore((state) => state.currentTime);
  const duration = usePlayerStore((state) => state.duration);
  const effectiveStartTime = usePlayerStore(
    (state) => state.effectiveStartTime
  );
  const effectiveEndTime = usePlayerStore((state) => state.effectiveEndTime);

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSeek = useCallback(
    async (value: number[]) => {
      const audioEngine = getAudioEngine();
      const seekTime = value[0];
      await audioEngine.seek(seekTime);
      usePlayerStore.getState().updatePosition(seekTime);
    },
    []
  );

  return (
    <div className="flex items-center gap-3 w-full">
      {/* Current time */}
      <span className="text-xs text-muted-foreground font-mono w-10 text-right">
        {formatTime(currentTime)}
      </span>

      {/* Progress slider */}
      <Slider
        value={[currentTime]}
        min={effectiveStartTime}
        max={effectiveEndTime || duration}
        step={0.1}
        onValueChange={handleSeek}
        className="flex-1"
      />

      {/* Duration */}
      <span className="text-xs text-muted-foreground font-mono w-10">
        {formatTime(effectiveEndTime || duration)}
      </span>
    </div>
  );
}
