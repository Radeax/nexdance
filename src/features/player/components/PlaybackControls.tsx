import { Play, Pause, SkipBack, SkipForward } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { usePlayerStore } from '@/stores/playerStore';
import { useQueueStore } from '@/stores/queueStore';
import { getAudioEngine } from '@/services/audio/audioEngine';

export function PlaybackControls() {
  const isPlaying = usePlayerStore((state) => state.isPlaying);
  const isLoading = usePlayerStore((state) => state.isLoading);
  const play = usePlayerStore((state) => state.play);
  const pause = usePlayerStore((state) => state.pause);
  const loadTrack = usePlayerStore((state) => state.loadTrack);

  const goToPrevious = useQueueStore((state) => state.goToPrevious);
  const advanceQueue = useQueueStore((state) => state.advanceQueue);
  const getCurrentTrack = useQueueStore((state) => state.getCurrentTrack);
  const currentIndex = useQueueStore((state) => state.currentIndex);
  const items = useQueueStore((state) => state.items);

  const handlePlayPause = () => {
    if (isPlaying) {
      pause();
    } else {
      play();
    }
  };

  const handlePrevious = async () => {
    const hasPrev = goToPrevious();
    if (hasPrev) {
      const track = await getCurrentTrack();
      if (track) {
        loadTrack(track);
        play();
      }
    }
  };

  const handleNext = async () => {
    const hasNext = advanceQueue();
    if (hasNext) {
      const track = await getCurrentTrack();
      if (track) {
        loadTrack(track);
        play();
      }
    }
  };

  const handleSeekRelative = async (seconds: number) => {
    const audioEngine = getAudioEngine();
    const state = audioEngine.getState();
    const newTime = Math.max(0, Math.min(state.duration, state.currentTime + seconds));
    await audioEngine.seek(newTime);
  };

  const hasPrevious = currentIndex > 0;
  const hasNext = currentIndex < items.length - 1;

  return (
    <div className="flex items-center gap-2">
      {/* Previous Track */}
      <Button
        variant="ghost"
        size="icon"
        onClick={handlePrevious}
        disabled={!hasPrevious}
      >
        <SkipBack className="h-5 w-5" />
      </Button>

      {/* -5s Button */}
      <Button
        variant="ghost"
        size="icon"
        onClick={() => handleSeekRelative(-5)}
        className="relative w-12 h-12 rounded-full bg-white/80 border border-gray-200 hover:bg-gray-50 dark:bg-white/10 dark:border-gray-600"
      >
        <span className="text-lg">⏪</span>
        <span className="absolute -bottom-1 text-[10px] font-medium text-gray-500 dark:text-gray-400">-5s</span>
      </Button>

      {/* Play/Pause (large, gradient) */}
      <Button
        onClick={handlePlayPause}
        disabled={isLoading}
        className="h-14 w-14 rounded-full text-white shadow-lg hover:shadow-xl transition-all"
        style={{ background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)' }}
      >
        {isLoading ? (
          <div className="h-5 w-5 animate-spin rounded-full border-2 border-current border-t-transparent" />
        ) : isPlaying ? (
          <Pause className="h-6 w-6" />
        ) : (
          <Play className="h-6 w-6 ml-1" />
        )}
      </Button>

      {/* +5s Button */}
      <Button
        variant="ghost"
        size="icon"
        onClick={() => handleSeekRelative(5)}
        className="relative w-12 h-12 rounded-full bg-white/80 border border-gray-200 hover:bg-gray-50 dark:bg-white/10 dark:border-gray-600"
      >
        <span className="text-lg">⏩</span>
        <span className="absolute -bottom-1 text-[10px] font-medium text-gray-500 dark:text-gray-400">+5s</span>
      </Button>

      {/* Next Track */}
      <Button
        variant="ghost"
        size="icon"
        onClick={handleNext}
        disabled={!hasNext}
      >
        <SkipForward className="h-5 w-5" />
      </Button>
    </div>
  );
}
