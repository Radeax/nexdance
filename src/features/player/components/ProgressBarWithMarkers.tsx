import { useCallback } from 'react';
import { usePlayerStore } from '@/stores/playerStore';
import { getAudioEngine } from '@/services/audio/audioEngine';

export function ProgressBarWithMarkers() {
  const currentTime = usePlayerStore((state) => state.currentTime);
  const duration = usePlayerStore((state) => state.duration);
  const currentTrack = usePlayerStore((state) => state.currentTrack);

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

  // Get start/end markers from track metadata (if set)
  const startTime = currentTrack?.startTime ?? 0;
  const endTime = currentTrack?.endTime ?? duration;
  const startPercent = duration > 0 ? (startTime / duration) * 100 : 0;
  const endPercent = duration > 0 ? (endTime / duration) * 100 : 100;

  return (
    <div className="flex items-center gap-3">
      {/* Current time */}
      <span className="text-sm font-semibold text-foreground w-12 tabular-nums">
        {formatTime(currentTime)}
      </span>

      {/* Progress bar */}
      <div
        className="flex-1 h-[6px] bg-gray-200 dark:bg-gray-700 rounded-full cursor-pointer relative"
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

        {/* Start Marker (green) - only show if startTime > 0 */}
        {startTime > 0 && (
          <div
            className="absolute top-1/2 -translate-y-1/2 w-1 h-[14px] bg-green-500 rounded-full"
            style={{ left: `${startPercent}%` }}
            title={`Start: ${formatTime(startTime)}`}
          />
        )}

        {/* End Marker (red) - only show if endTime < duration */}
        {endTime < duration && (
          <div
            className="absolute top-1/2 -translate-y-1/2 w-1 h-[14px] bg-red-500 rounded-full"
            style={{ left: `${endPercent}%` }}
            title={`End: ${formatTime(endTime)}`}
          />
        )}

        {/* Playhead (white/blue circle with shadow) */}
        <div
          className="absolute top-1/2 -translate-y-1/2 w-4 h-4 rounded-full shadow-lg border-[3px] border-white"
          style={{
            left: `calc(${progress}% - 8px)`,
            background: 'linear-gradient(135deg, #60a5fa 0%, #a78bfa 100%)',
            boxShadow: '0 2px 8px rgba(99, 102, 241, 0.4)'
          }}
        />
      </div>

      {/* Duration */}
      <span className="text-sm font-semibold text-foreground w-12 text-right tabular-nums">
        {formatTime(duration)}
      </span>
    </div>
  );
}
