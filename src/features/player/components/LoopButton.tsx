import { Repeat } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

export function LoopButton() {
  const [isLooping, setIsLooping] = useState(false);

  return (
    <Button
      variant="ghost"
      size="icon"
      className={
        isLooping
          ? 'text-white rounded-lg'
          : 'text-muted-foreground rounded-lg'
      }
      style={
        isLooping
          ? {
              background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
              boxShadow: '0 2px 8px rgba(16, 185, 129, 0.2)',
            }
          : undefined
      }
      onClick={() => setIsLooping(!isLooping)}
      title={isLooping ? 'Disable loop' : 'Enable loop'}
    >
      <Repeat className="h-5 w-5" />
    </Button>
  );
}
