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
        className="flex-1 h-2 bg-gray-200 dark:bg-gray-700 rounded-full cursor-pointer relative"
        onClick={handleSeek}
      >
        {/* Progress fill with blue→purple gradient */}
        <div
          className="absolute h-full rounded-full"
          style={{
            width: `${progress}%`,
            background: 'linear-gradient(90deg, #60a5fa 0%, #a78bfa 100%)'
          }}
        />

        {/* Playhead (white circle with shadow) */}
        <div
          className="absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-white rounded-full shadow-lg border-2 border-purple-400"
          style={{ left: `calc(${progress}% - 8px)` }}
        />
      </div>

      {/* Duration */}
      <span className="text-xs font-mono text-muted-foreground w-10 text-right">
        {formatTime(duration)}
      </span>
    </div>
  );
}
