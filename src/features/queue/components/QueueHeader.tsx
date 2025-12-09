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
    <div className="border-b p-4 space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="font-semibold">Play Queue</h2>
        <span className="text-sm text-muted-foreground">
          {itemCount} {itemCount === 1 ? 'song' : 'songs'}
        </span>
      </div>

      <div className="flex items-center justify-between">
        {/* Autoplay toggle */}
        <div className="flex items-center gap-2">
          <Switch
            id="autoplay"
            checked={isAutoplayEnabled}
            onCheckedChange={setAutoplay}
          />
          <Label htmlFor="autoplay" className="text-sm">
            Autoplay
          </Label>
        </div>

        {/* Clear button */}
        <Button
          variant={confirmClear ? 'destructive' : 'ghost'}
          size="sm"
          onClick={handleClearClick}
          disabled={itemCount === 0}
        >
          <Trash2 className="h-4 w-4 mr-1" />
          {confirmClear ? 'Tap to confirm' : 'Clear'}
        </Button>
      </div>
    </div>
  );
}
