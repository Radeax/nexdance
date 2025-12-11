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
    <div className="flex items-center gap-2">
      {/* Fade to Next (orange gradient) */}
      <Button
        onClick={handleFadeToNext}
        className="px-4 py-2 rounded-lg text-white font-medium shadow-md text-sm"
        style={{ background: 'linear-gradient(135deg, #fb923c 0%, #f97316 100%)' }}
        title="Fade to next track"
      >
        Fade → ⏭
      </Button>

      {/* Fade to Pause (pink gradient) */}
      <Button
        onClick={handleFadeToPause}
        className="px-4 py-2 rounded-lg text-white font-medium shadow-md text-sm"
        style={{ background: 'linear-gradient(135deg, #f472b6 0%, #fb7185 100%)' }}
        title="Fade to pause"
      >
        Fade → ⏸
      </Button>
    </div>
  );
}
