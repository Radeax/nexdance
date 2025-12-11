import { Volume2, VolumeX, Volume1 } from 'lucide-react';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { usePlayerStore } from '@/stores/playerStore';

export function VolumeControl() {
  const volume = usePlayerStore((state) => state.volume);
  const isMuted = usePlayerStore((state) => state.isMuted);
  const setVolume = usePlayerStore((state) => state.setVolume);
  const toggleMute = usePlayerStore((state) => state.toggleMute);

  const VolumeIcon =
    isMuted || volume === 0 ? VolumeX : volume < 0.5 ? Volume1 : Volume2;

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon">
          <VolumeIcon className="h-5 w-5" />
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-48" align="end">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Volume</span>
            <Button variant="ghost" size="sm" onClick={toggleMute}>
              {isMuted ? 'Unmute' : 'Mute'}
            </Button>
          </div>

          <div className="flex items-center gap-3">
            <VolumeX className="h-4 w-4 text-muted-foreground" />
            <Slider
              value={[isMuted ? 0 : volume]}
              min={0}
              max={1}
              step={0.01}
              onValueChange={(v) => setVolume(v[0])}
              className="flex-1"
            />
            <Volume2 className="h-4 w-4 text-muted-foreground" />
          </div>

          <p className="text-center text-sm text-muted-foreground">
            {Math.round((isMuted ? 0 : volume) * 100)}%
          </p>
        </div>
      </PopoverContent>
    </Popover>
  );
}
