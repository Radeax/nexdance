import { useEffect, useCallback } from 'react';
import { ImportRow } from './ImportRow';
import { Button } from '@/components/ui/button';
import { useLibraryStore } from '@/stores/libraryStore';
import { extractMetadata } from '../services/metadataService';
import { createTrackFromImport } from '../services/importService';
import type { PendingImport } from '../types';
import { toast } from 'sonner';

interface ImportQueueProps {
  imports: PendingImport[];
  onRemove: (id: string) => void;
  onUpdate: (id: string, updates: Partial<PendingImport>) => void;
  onComplete: () => void;
}

export function ImportQueue({
  imports,
  onRemove,
  onUpdate,
  onComplete,
}: ImportQueueProps) {
  const addTrack = useLibraryStore((state) => state.addTrack);

  // Extract metadata for pending imports
  useEffect(() => {
    imports.forEach(async (item) => {
      if (item.status === 'pending' && !item.metadata) {
        onUpdate(item.id, { status: 'extracting' });

        try {
          const metadata = await extractMetadata(item.file);
          onUpdate(item.id, { metadata, status: 'ready' });
        } catch (error) {
          console.error('Metadata extraction failed:', error);
          onUpdate(item.id, {
            status: 'error',
            error: 'Failed to extract metadata',
          });
        }
      }
    });
  }, [imports, onUpdate]);

  const canImport = imports.some(
    (item) => item.status === 'ready' && item.selectedDanceStyleId
  );

  const readyCount = imports.filter(
    (item) => item.status === 'ready' && item.selectedDanceStyleId
  ).length;

  const handleImportAll = useCallback(async () => {
    const readyImports = imports.filter(
      (item) => item.status === 'ready' && item.selectedDanceStyleId
    );

    let successCount = 0;

    for (const item of readyImports) {
      onUpdate(item.id, { status: 'importing' });

      try {
        const track = await createTrackFromImport(item);
        await addTrack(track);
        onUpdate(item.id, { status: 'complete' });
        successCount++;
      } catch (error) {
        console.error('Import failed:', error);
        onUpdate(item.id, {
          status: 'error',
          error: error instanceof Error ? error.message : 'Import failed',
        });
      }
    }

    if (successCount > 0) {
      toast.success(
        `Successfully imported ${successCount} ${successCount === 1 ? 'song' : 'songs'}`
      );
    }

    // Check if all imports are complete
    const remaining = imports.filter(
      (item) => item.status !== 'complete' && item.status !== 'error'
    );

    if (remaining.length === 0) {
      // Small delay to show completion state
      setTimeout(onComplete, 500);
    }
  }, [imports, onUpdate, addTrack, onComplete]);

  if (imports.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
      {/* Import list */}
      <div className="space-y-2 max-h-80 overflow-y-auto">
        {imports.map((item) => (
          <ImportRow
            key={item.id}
            item={item}
            onRemove={() => onRemove(item.id)}
            onUpdate={(updates) => onUpdate(item.id, updates)}
          />
        ))}
      </div>

      {/* Import action */}
      <div className="flex items-center justify-between pt-2 border-t">
        <p className="text-sm text-muted-foreground">
          {readyCount > 0
            ? `${readyCount} ${readyCount === 1 ? 'song' : 'songs'} ready to import`
            : 'Select a dance style for each song to import'}
        </p>

        <Button onClick={handleImportAll} disabled={!canImport}>
          Import{readyCount > 0 ? ` (${readyCount})` : ''}
        </Button>
      </div>
    </div>
  );
}
