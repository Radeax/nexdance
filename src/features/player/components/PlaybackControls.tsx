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
    <div className="flex items-center gap-1">
      {/* Go to Start of Song */}
      <Button
        variant="ghost"
        size="icon"
        onClick={handleSeekToStart}
        className="w-10 h-10 rounded-lg bg-white/40 border border-border/50 hover:bg-white/60 dark:bg-white/5 dark:border-white/10 dark:hover:bg-white/10"
        title="Go to start of song"
      >
        <SkipBack className="h-4 w-4 text-muted-foreground" />
      </Button>

      {/* -5s Button */}
      <Button
        variant="ghost"
        size="icon"
        onClick={() => handleSeekRelative(-5)}
        className="relative flex flex-col items-center justify-center w-11 h-11 rounded-lg bg-white/40 border border-border/50 hover:bg-white/60 dark:bg-white/5 dark:border-white/10 dark:hover:bg-white/10"
        title="Seek back 5 seconds"
      >
        <Rewind className="h-4 w-4 text-muted-foreground" />
        <span className="text-[10px] font-medium text-muted-foreground">-5s</span>
      </Button>

      {/* Play/Pause (large, gradient) */}
      <Button
        onClick={handlePlayPause}
        disabled={isLoading}
        className="h-14 w-14 rounded-full text-white shadow-lg hover:shadow-xl transition-all hover:scale-105 mx-1"
        style={{
          background: 'linear-gradient(135deg, #10b981 0%, #059669 50%, #047857 100%)',
          boxShadow: '0 0 20px rgba(16, 185, 129, 0.25)'
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
        className="relative flex flex-col items-center justify-center w-11 h-11 rounded-lg bg-white/40 border border-border/50 hover:bg-white/60 dark:bg-white/5 dark:border-white/10 dark:hover:bg-white/10"
        title="Seek forward 5 seconds"
      >
        <FastForward className="h-4 w-4 text-muted-foreground" />
        <span className="text-[10px] font-medium text-muted-foreground">+5s</span>
      </Button>

      {/* Go to End of Song */}
      <Button
        variant="ghost"
        size="icon"
        onClick={handleSeekToEnd}
        className="w-10 h-10 rounded-lg bg-white/40 border border-border/50 hover:bg-white/60 dark:bg-white/5 dark:border-white/10 dark:hover:bg-white/10"
        title="Go to end of song"
      >
        <SkipForward className="h-4 w-4 text-muted-foreground" />
      </Button>
    </div>
  );
}
