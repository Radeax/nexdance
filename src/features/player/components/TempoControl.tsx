import { useCallback } from 'react';
import { Gauge, RotateCcw } from 'lucide-react';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { usePlayerStore } from '@/stores/playerStore';

export function TempoControl() {
  const currentBpm = usePlayerStore((state) => state.currentBpm);
  const originalBpm = usePlayerStore((state) => state.originalBpm);
  const tempoMultiplier = usePlayerStore((state) => state.tempoMultiplier);
  const setTempoMultiplier = usePlayerStore(
    (state) => state.setTempoMultiplier
  );
  const resetTempo = usePlayerStore((state) => state.resetTempo);

  const isModified = tempoMultiplier !== 1.0;
  const percentChange = Math.round((tempoMultiplier - 1) * 100);

  const handleTempoChange = useCallback(
    (value: number[]) => {
      setTempoMultiplier(value[0]);
    },
    [setTempoMultiplier]
  );

  // Preset buttons
  const presets = [
    { label: '-10%', value: 0.9 },
    { label: '-5%', value: 0.95 },
    { label: '0%', value: 1.0 },
    { label: '+5%', value: 1.05 },
    { label: '+10%', value: 1.1 },
  ];

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={isModified ? 'secondary' : 'ghost'}
          size="sm"
          className="gap-2 min-w-[100px]"
        >
          <Gauge className="h-4 w-4" />
          <span className="font-mono">{currentBpm}</span>
          <span className="text-xs text-muted-foreground">BPM</span>
          {isModified && (
            <span className="text-xs">
              ({percentChange > 0 ? '+' : ''}
              {percentChange}%)
            </span>
          )}
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-72" align="end">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="font-medium">Tempo Control</h4>
            <Button
              variant="ghost"
              size="sm"
              onClick={resetTempo}
              disabled={!isModified}
              className="gap-1"
            >
              <RotateCcw className="h-3 w-3" />
              Reset
            </Button>
          </div>

          {/* BPM Display */}
          <div className="text-center py-2">
            <span className="text-3xl font-bold font-mono">{currentBpm}</span>
            <span className="text-muted-foreground ml-2">BPM</span>
            <p className="text-xs text-muted-foreground mt-1">
              Original: {originalBpm} BPM
            </p>
          </div>

          {/* Slider */}
          <div className="space-y-2">
            <Slider
              value={[tempoMultiplier]}
              min={0.75}
              max={1.25}
              step={0.01}
              onValueChange={handleTempoChange}
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>-25%</span>
              <span>0%</span>
              <span>+25%</span>
            </div>
          </div>

          {/* Preset buttons */}
          <div className="flex gap-1">
            {presets.map((preset) => (
              <Button
                key={preset.label}
                variant={
                  Math.abs(tempoMultiplier - preset.value) < 0.01
                    ? 'default'
                    : 'outline'
                }
                size="sm"
                className="flex-1 text-xs"
                onClick={() => setTempoMultiplier(preset.value)}
              >
                {preset.label}
              </Button>
            ))}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
