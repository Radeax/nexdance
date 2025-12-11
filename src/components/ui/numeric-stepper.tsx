import { Minus, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface NumericStepperProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  unit?: string;
  disabled?: boolean;
}

export function NumericStepper({
  value,
  onChange,
  min = 0,
  max = 999,
  step = 1,
  unit,
  disabled = false,
}: NumericStepperProps) {
  const handleDecrement = () => {
    onChange(Math.max(min, value - step));
  };

  const handleIncrement = () => {
    onChange(Math.min(max, value + step));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = parseFloat(e.target.value);
    if (!isNaN(newValue)) {
      onChange(Math.max(min, Math.min(max, newValue)));
    }
  };

  return (
    <div className="flex items-center gap-1">
      <Button
        variant="outline"
        size="icon"
        className="h-7 w-7"
        onClick={handleDecrement}
        disabled={disabled || value <= min}
      >
        <Minus className="h-3 w-3" />
      </Button>
      <div className="flex items-center gap-1">
        <Input
          type="number"
          value={value}
          onChange={handleInputChange}
          className="w-12 h-7 text-center text-sm px-1"
          disabled={disabled}
          min={min}
          max={max}
          step={step}
        />
        {unit && (
          <span className="text-xs text-muted-foreground">{unit}</span>
        )}
      </div>
      <Button
        variant="outline"
        size="icon"
        className="h-7 w-7"
        onClick={handleIncrement}
        disabled={disabled || value >= max}
      >
        <Plus className="h-3 w-3" />
      </Button>
    </div>
  );
}
