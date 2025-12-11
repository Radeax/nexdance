import { SkipForward, Pause } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useQueueStore } from '@/stores/queueStore';
import { usePlayerStore } from '@/stores/playerStore';
import { getAudioEngine } from '@/services/audio/audioEngine';

export function FadeButtons() {
  const advanceQueue = useQueueStore((state) => state.advanceQueue);
  const getCurrentTrack = useQueueStore((state) => state.getCurrentTrack);
  const loadTrack = usePlayerStore((state) => state.loadTrack);
  const play = usePlayerStore((state) => state.play);
  const pause = usePlayerStore((state) => state.pause);

  const handleFadeToNext = async () => {
    const audioEngine = getAudioEngine();

    // Fade out current track
    if (audioEngine.getIsPlaying()) {
      await audioEngine.pause(); // Will fade out
    }

    // Advance to next track
    if (advanceQueue()) {
      const track = await getCurrentTrack();
      if (track) {
        loadTrack(track);
        play(); // Will fade in
      }
    }
  };

  const handleFadeToPause = async () => {
    await pause(); // Fades out via AudioEngine
  };

  return (
    <div className="flex items-center gap-1">
      <Button
        variant="outline"
        size="sm"
        onClick={handleFadeToNext}
        className="text-xs gap-1"
        title="Fade to next track"
      >
        Fade
        <SkipForward className="h-3 w-3" />
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={handleFadeToPause}
        className="text-xs gap-1"
        title="Fade to pause"
      >
        Fade
        <Pause className="h-3 w-3" />
      </Button>
    </div>
  );
}
