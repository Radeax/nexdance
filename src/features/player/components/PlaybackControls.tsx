import { Play, Pause, Rewind, FastForward, SkipBack, SkipForward } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { usePlayerStore } from '@/stores/playerStore';
import { getAudioEngine } from '@/services/audio/audioEngine';

export function PlaybackControls() {
  const isPlaying = usePlayerStore((state) => state.isPlaying);
  const isLoading = usePlayerStore((state) => state.isLoading);
  const play = usePlayerStore((state) => state.play);
  const pause = usePlayerStore((state) => state.pause);

  const handlePlayPause = () => {
    if (isPlaying) {
      pause();
    } else {
      play();
    }
  };

  const handleSeekToStart = async () => {
    const audioEngine = getAudioEngine();
    await audioEngine.seek(0);
  };

  const handleSeekToEnd = async () => {
    const audioEngine = getAudioEngine();
    const state = audioEngine.getState();
    // Seek to near end (will trigger track end)
    await audioEngine.seek(Math.max(0, state.duration - 0.5));
  };

  const handleSeekRelative = async (seconds: number) => {
    const audioEngine = getAudioEngine();
    const state = audioEngine.getState();
    const newTime = Math.max(0, Math.min(state.duration, state.currentTime + seconds));
    await audioEngine.seek(newTime);
  };

  return (
    <div className="flex items-center gap-2">
      {/* Go to Start of Song */}
      <Button
        variant="ghost"
        size="icon"
        onClick={handleSeekToStart}
        className="w-12 h-12 rounded-xl bg-white/50 border border-gray-200 hover:bg-white/80 dark:bg-white/10 dark:border-gray-600"
        title="Go to start of song"
      >
        <SkipBack className="h-5 w-5 text-gray-500" />
      </Button>

      {/* -5s Button */}
      <Button
        variant="ghost"
        size="icon"
        onClick={() => handleSeekRelative(-5)}
        className="relative flex flex-col items-center justify-center w-[52px] h-[52px] rounded-xl bg-white/50 border border-gray-200 hover:bg-white/80 dark:bg-white/10 dark:border-gray-600"
        title="Seek back 5 seconds"
      >
        <Rewind className="h-5 w-5 text-gray-500" />
        <span className="text-[11px] font-medium text-gray-500 mt-0.5">-5s</span>
      </Button>

      {/* Play/Pause (large, gradient) */}
      <Button
        onClick={handlePlayPause}
        disabled={isLoading}
        className="h-[60px] w-[60px] rounded-full text-white shadow-lg hover:shadow-xl transition-all hover:scale-105"
        style={{
          background: 'linear-gradient(135deg, #818cf8 0%, #6366f1 50%, #4f46e5 100%)',
          boxShadow: '0 0 24px rgba(129, 140, 248, 0.4)'
        }}
      >
        {isLoading ? (
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-current border-t-transparent" />
        ) : isPlaying ? (
          <Pause className="h-6 w-6" fill="currentColor" />
        ) : (
          <Play className="h-6 w-6 ml-1" fill="currentColor" />
        )}
      </Button>

      {/* +5s Button */}
      <Button
        variant="ghost"
        size="icon"
        onClick={() => handleSeekRelative(5)}
        className="relative flex flex-col items-center justify-center w-[52px] h-[52px] rounded-xl bg-white/50 border border-gray-200 hover:bg-white/80 dark:bg-white/10 dark:border-gray-600"
        title="Seek forward 5 seconds"
      >
        <FastForward className="h-5 w-5 text-gray-500" />
        <span className="text-[11px] font-medium text-gray-500 mt-0.5">+5s</span>
      </Button>

      {/* Go to End of Song */}
      <Button
        variant="ghost"
        size="icon"
        onClick={handleSeekToEnd}
        className="w-12 h-12 rounded-xl bg-white/50 border border-gray-200 hover:bg-white/80 dark:bg-white/10 dark:border-gray-600"
        title="Go to end of song"
      >
        <SkipForward className="h-5 w-5 text-gray-500" />
      </Button>
    </div>
  );
}
