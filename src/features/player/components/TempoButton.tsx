import { Minus, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { usePlayerStore } from '@/stores/playerStore';

export function TempoButton() {
  const tempoMultiplier = usePlayerStore((state) => state.tempoMultiplier);
  const setTempoMultiplier = usePlayerStore((state) => state.setTempoMultiplier);

  const displayValue = tempoMultiplier.toFixed(2);

  const handleDecrement = () => {
    setTempoMultiplier(Math.max(0.5, tempoMultiplier - 0.01));
  };

  const handleIncrement = () => {
    setTempoMultiplier(Math.min(2.0, tempoMultiplier + 0.01));
  };

  return (
    <div className="inline-flex items-center gap-1">
      <Button
        variant="outline"
        size="icon"
        className="h-[30px] w-[30px] rounded-lg"
        onClick={handleDecrement}
        disabled={tempoMultiplier <= 0.5}
      >
        <Minus className="h-3 w-3" />
      </Button>
      <span className="w-16 text-center font-semibold text-sm tabular-nums text-emerald-600 dark:text-emerald-400">
        {displayValue}×
      </span>
      <Button
        variant="outline"
        size="icon"
        className="h-[30px] w-[30px] rounded-lg"
        onClick={handleIncrement}
        disabled={tempoMultiplier >= 2.0}
      >
        <Plus className="h-3 w-3" />
      </Button>
    </div>
  );
}
