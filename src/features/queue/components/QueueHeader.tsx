import { Trash2 } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { useQueueStore } from '@/stores/queueStore';

interface QueueHeaderProps {
  itemCount: number;
}

export function QueueHeader({ itemCount }: QueueHeaderProps) {
  const clearQueue = useQueueStore((state) => state.clearQueue);
  const isAutoplayEnabled = useQueueStore((state) => state.isAutoplayEnabled);
  const setAutoplay = useQueueStore((state) => state.setAutoplay);

  // Tap-to-confirm for clear
  const [confirmClear, setConfirmClear] = useState(false);

  const handleClearClick = () => {
    if (confirmClear) {
      clearQueue();
      setConfirmClear(false);
    } else {
      setConfirmClear(true);
      // Reset after 2 seconds
      setTimeout(() => setConfirmClear(false), 2000);
    }
  };

  return (
    <div>
      {/* Header with green gradient */}
      <div
        className="px-4 py-3 text-white"
        style={{
          background: 'var(--color-tab-active)',
        }}
      >
        <div className="flex items-center justify-between">
          <h2 className="font-bold text-base">Play Queue</h2>
          <span className="text-xs bg-white/20 px-2 py-0.5 rounded-full font-medium">
            {itemCount} {itemCount === 1 ? 'song' : 'songs'}
          </span>
        </div>
      </div>

      {/* Controls row */}
      <div className="flex items-center justify-between px-3 py-2 border-b border-border/30">
        {/* Autoplay toggle */}
        <div className="flex items-center gap-2">
          <Switch
            id="autoplay"
            checked={isAutoplayEnabled}
            onCheckedChange={setAutoplay}
          />
          <Label htmlFor="autoplay" className="text-sm font-medium">
            Autoplay
          </Label>
        </div>

        {/* Clear button */}
        <Button
          variant={confirmClear ? 'destructive' : 'ghost'}
          size="sm"
          onClick={handleClearClick}
          disabled={itemCount === 0}
          className="text-sm"
        >
          <Trash2 className="h-4 w-4 mr-1" />
          {confirmClear ? 'Confirm' : 'Clear'}
        </Button>
      </div>
    </div>
  );
}
