import { Play, Pause, SkipBack, SkipForward, Square } from 'lucide-react';
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

  const handleStop = async () => {
    const audioEngine = getAudioEngine();
    await audioEngine.stop();
    pause();
  };

  const hasPrevious = currentIndex > 0;
  const hasNext = currentIndex < items.length - 1;

  return (
    <div className="flex items-center gap-2">
      {/* Previous */}
      <Button
        variant="ghost"
        size="icon"
        onClick={handlePrevious}
        disabled={!hasPrevious}
      >
        <SkipBack className="h-5 w-5" />
      </Button>

      {/* Play/Pause */}
      <Button
        variant="default"
        size="icon"
        className="h-10 w-10"
        onClick={handlePlayPause}
        disabled={isLoading}
      >
        {isLoading ? (
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
        ) : isPlaying ? (
          <Pause className="h-5 w-5" />
        ) : (
          <Play className="h-5 w-5" />
        )}
      </Button>

      {/* Stop */}
      <Button variant="ghost" size="icon" onClick={handleStop}>
        <Square className="h-4 w-4" />
      </Button>

      {/* Next */}
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
