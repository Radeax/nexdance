import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { usePlayerStore } from '@/stores/playerStore';

export function TempoButton() {
  const tempoMultiplier = usePlayerStore((state) => state.tempoMultiplier);
  const setTempoMultiplier = usePlayerStore((state) => state.setTempoMultiplier);
  const resetTempo = usePlayerStore((state) => state.resetTempo);

  const isModified = tempoMultiplier !== 1.0;
  const displayValue = tempoMultiplier.toFixed(2);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="default"
          size="sm"
          className={`font-mono min-w-[70px] ${
            isModified
              ? 'bg-red-500 hover:bg-red-600'
              : 'bg-orange-500 hover:bg-orange-600'
          } text-white shadow-md`}
        >
          {displayValue}×
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-64">
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="font-medium">Tempo</span>
            <Button variant="ghost" size="sm" onClick={resetTempo}>
              Reset
            </Button>
          </div>
          <Slider
            value={[tempoMultiplier]}
            min={0.5}
            max={1.5}
            step={0.01}
            onValueChange={(v) => setTempoMultiplier(v[0])}
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>0.5x</span>
            <span>1.0x</span>
            <span>1.5x</span>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
