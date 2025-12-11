import { useCallback } from 'react';
import { usePlayerStore } from '@/stores/playerStore';
import { getAudioEngine } from '@/services/audio/audioEngine';

export function ProgressBarWithMarkers() {
  const currentTime = usePlayerStore((state) => state.currentTime);
  const duration = usePlayerStore((state) => state.duration);

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSeek = useCallback(
    async (e: React.MouseEvent<HTMLDivElement>) => {
      const rect = e.currentTarget.getBoundingClientRect();
      const percent = (e.clientX - rect.left) / rect.width;
      const newTime = percent * duration;
      const audioEngine = getAudioEngine();
      await audioEngine.seek(newTime);
    },
    [duration]
  );

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div className="flex items-center gap-3">
      {/* Current time */}
      <span className="text-xs font-mono text-muted-foreground w-10">
        {formatTime(currentTime)}
      </span>

      {/* Progress bar */}
      <div
        className="flex-1 h-2 bg-muted rounded-full cursor-pointer relative overflow-hidden"
        onClick={handleSeek}
      >
        {/* Progress fill with gradient */}
        <div
          className="absolute inset-y-0 left-0 bg-gradient-to-r from-green-500 to-blue-500 rounded-full transition-all"
          style={{ width: `${progress}%` }}
        />

        {/* Hover effect */}
        <div className="absolute inset-0 hover:bg-white/10 transition-colors" />
      </div>

      {/* Duration */}
      <span className="text-xs font-mono text-muted-foreground w-10 text-right">
        {formatTime(duration)}
      </span>
    </div>
  );
}
