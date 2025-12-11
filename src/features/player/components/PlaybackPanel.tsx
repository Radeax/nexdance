import { useState } from 'react';
import { Volume2 } from 'lucide-react';
import { PanelCard } from './PanelCard';
import { NumericStepper } from '@/components/ui/numeric-stepper';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { usePlayerStore } from '@/stores/playerStore';

export function PlaybackPanel() {
  const volume = usePlayerStore((state) => state.volume);
  const setVolume = usePlayerStore((state) => state.setVolume);

  // Local state
  const [normalizeVolume, setNormalizeVolume] = useState(true);
  const [songGap, setSongGap] = useState(0);
  const [outputDevice, setOutputDevice] = useState('default');

  return (
    <PanelCard
      title="Playback"
      tooltip="Configure audio output settings and volume normalization."
    >
      <div className="space-y-3">
        {/* Output device */}
        <div className="flex items-center justify-between">
          <span className="text-sm">Output</span>
          <Select value={outputDevice} onValueChange={setOutputDevice}>
            <SelectTrigger className="w-48 h-8">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="default">Speakers (Main)</SelectItem>
              <SelectItem value="headphones">Headphones</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Volume slider */}
        <div className="flex items-center gap-3">
          <Volume2 className="h-4 w-4 text-muted-foreground" />
          <Slider
            value={[volume]}
            min={0}
            max={1}
            step={0.01}
            onValueChange={(v) => setVolume(v[0])}
            className="flex-1"
          />
          <span className="text-sm w-12 text-right">
            {Math.round(volume * 100)}%
          </span>
        </div>

        {/* Normalize volume + Song gap */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Switch
              checked={normalizeVolume}
              onCheckedChange={setNormalizeVolume}
            />
            <span className="text-sm">Normalize volume</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Song gap</span>
            <NumericStepper
              value={songGap}
              onChange={setSongGap}
              min={0}
              max={30}
              step={1}
              unit="sec"
            />
          </div>
        </div>
      </div>
    </PanelCard>
  );
}
