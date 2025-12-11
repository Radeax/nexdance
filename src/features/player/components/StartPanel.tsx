import { useState } from 'react';
import { PanelCard } from './PanelCard';
import { NumericStepper } from '@/components/ui/numeric-stepper';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { usePlayerStore } from '@/stores/playerStore';

export function StartPanel() {
  const currentTime = usePlayerStore((state) => state.currentTime);

  // Local state for panel controls
  const [isEnabled, setIsEnabled] = useState(false);
  const [startTime, setStartTime] = useState(0);
  const [fadeIn, setFadeIn] = useState(1);
  const [fadeInEnabled, setFadeInEnabled] = useState(false);
  const [startDelay, setStartDelay] = useState(3);
  const [startDelayEnabled, setStartDelayEnabled] = useState(false);

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSetNow = () => {
    setStartTime(Math.floor(currentTime));
    setIsEnabled(true);
  };

  return (
    <PanelCard
      title="Start"
      tooltip="Set a custom start point for this track. The track will begin playing from this position."
    >
      <div className="space-y-3">
        {/* Start time */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Switch checked={isEnabled} onCheckedChange={setIsEnabled} />
            <span className="text-sm">On</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm font-mono w-12">{formatTime(startTime)}</span>
            <Button variant="outline" size="sm" onClick={handleSetNow}>
              Set = Now
            </Button>
          </div>
        </div>

        {/* Fade in */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Switch checked={fadeInEnabled} onCheckedChange={setFadeInEnabled} />
            <span className="text-sm">Fade in</span>
          </div>
          <NumericStepper
            value={fadeIn}
            onChange={setFadeIn}
            min={0}
            max={10}
            step={1}
            unit="sec"
            disabled={!fadeInEnabled}
          />
        </div>

        {/* Start delay */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Switch
              checked={startDelayEnabled}
              onCheckedChange={setStartDelayEnabled}
            />
            <span className="text-sm">Start delay</span>
          </div>
          <NumericStepper
            value={startDelay}
            onChange={setStartDelay}
            min={0}
            max={30}
            step={1}
            unit="sec"
            disabled={!startDelayEnabled}
          />
        </div>
      </div>
    </PanelCard>
  );
}
