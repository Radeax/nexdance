import { useState } from 'react';
import { PanelCard } from './PanelCard';
import { NumericStepper } from '@/components/ui/numeric-stepper';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { usePlayerStore } from '@/stores/playerStore';

export function EndPanel() {
  const currentTime = usePlayerStore((state) => state.currentTime);

  // Local state for panel controls
  const [isEnabled, setIsEnabled] = useState(false);
  const [endTime, setEndTime] = useState(120); // 2:00 default
  const [fadeOut, setFadeOut] = useState(5);
  const [fadeOutEnabled, setFadeOutEnabled] = useState(true);
  const [pauseAfter, setPauseAfter] = useState(false);

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSetNow = () => {
    setEndTime(Math.floor(currentTime));
    setIsEnabled(true);
  };

  return (
    <PanelCard
      title="End"
      tooltip="Set a custom end point for this track. Playback will stop or fade out at this position."
    >
      <div className="space-y-3">
        {/* End time */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Switch checked={isEnabled} onCheckedChange={setIsEnabled} />
            <span className="text-sm">On</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm font-mono w-12">{formatTime(endTime)}</span>
            <Button variant="outline" size="sm" onClick={handleSetNow}>
              Set = Now
            </Button>
          </div>
        </div>

        {/* Fade out */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Switch checked={fadeOutEnabled} onCheckedChange={setFadeOutEnabled} />
            <span className="text-sm">Fade out</span>
          </div>
          <NumericStepper
            value={fadeOut}
            onChange={setFadeOut}
            min={0}
            max={30}
            step={1}
            unit="sec"
            disabled={!fadeOutEnabled}
          />
        </div>

        {/* Pause after */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Switch checked={pauseAfter} onCheckedChange={setPauseAfter} />
            <span className="text-sm">Pause</span>
          </div>
          <span className="text-xs text-muted-foreground">Stop after this song</span>
        </div>
      </div>
    </PanelCard>
  );
}
