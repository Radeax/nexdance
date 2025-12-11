import { Music, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useUIStore } from '@/stores/uiStore';

export function EmptyLibrary() {
  const openModal = useUIStore((state) => state.openModal);

  return (
    <div className="flex flex-col items-center justify-center h-64 gap-4">
      <div className="rounded-full bg-muted p-6">
        <Music className="h-12 w-12 text-muted-foreground" />
      </div>

      <div className="text-center">
        <h3 className="font-semibold text-lg">No songs yet</h3>
        <p className="text-muted-foreground mt-1">
          Import your music to get started
        </p>
      </div>

      <Button onClick={() => openModal('import')} size="lg" className="gap-2">
        <Upload className="h-5 w-5" />
        Import Songs
      </Button>
    </div>
  );
}
