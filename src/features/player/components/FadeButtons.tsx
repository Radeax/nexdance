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
      {/* Fade out current track then skip to next */}
      <Button
        onClick={handleFadeToNext}
        className="h-9 px-4 rounded-full text-white font-medium text-sm border-none"
        style={{
          background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
          boxShadow: '0 2px 8px rgba(16, 185, 129, 0.3)',
        }}
        title="Fade then Next"
        aria-label="Fade then Next"
      >
        Fade → ⏭
      </Button>

      {/* Fade out current track then pause */}
      <Button
        onClick={handleFadeToPause}
        className="h-9 px-4 rounded-full text-white font-medium text-sm border-none"
        style={{
          background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
          boxShadow: '0 2px 8px rgba(16, 185, 129, 0.3)',
        }}
        title="Fade then Pause"
        aria-label="Fade then Pause"
      >
        Fade → ⏸
      </Button>
    </div>
  );
}
