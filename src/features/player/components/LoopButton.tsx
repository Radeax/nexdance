import { Repeat } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

export function LoopButton() {
  const [isLooping, setIsLooping] = useState(false);

  return (
    <Button
      variant="ghost"
      size="icon"
      className={isLooping ? 'text-primary' : 'text-muted-foreground'}
      onClick={() => setIsLooping(!isLooping)}
      title={isLooping ? 'Disable loop' : 'Enable loop'}
    >
      <Repeat className="h-5 w-5" />
    </Button>
  );
}
