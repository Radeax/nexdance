import { useState, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useUIStore } from '@/stores/uiStore';
import { ImportDropzone } from './ImportDropzone';
import { ImportQueue } from './ImportQueue';
import type { PendingImport } from '../types';

export function ImportModal() {
  const activeModal = useUIStore((state) => state.activeModal);
  const closeModal = useUIStore((state) => state.closeModal);
  const [pendingImports, setPendingImports] = useState<PendingImport[]>([]);

  const isOpen = activeModal === 'import';

  const handleFilesSelected = useCallback((files: File[]) => {
    const newImports: PendingImport[] = files.map((file) => ({
      id: uuidv4(),
      file,
      status: 'pending',
      metadata: null,
      selectedDanceStyleId: null,
    }));

    setPendingImports((prev) => [...prev, ...newImports]);
  }, []);

  const handleRemove = useCallback((id: string) => {
    setPendingImports((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const handleUpdate = useCallback(
    (id: string, updates: Partial<PendingImport>) => {
      setPendingImports((prev) =>
        prev.map((item) => (item.id === id ? { ...item, ...updates } : item))
      );
    },
    []
  );

  const handleComplete = useCallback(() => {
    setPendingImports([]);
    closeModal();
  }, [closeModal]);

  const handleOpenChange = useCallback(
    (open: boolean) => {
      if (!open) {
        // Clear pending imports when closing
        setPendingImports([]);
        closeModal();
      }
    },
    [closeModal]
  );

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Import Songs</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Dropzone */}
          <ImportDropzone onFilesSelected={handleFilesSelected} />

          {/* Import queue */}
          <ImportQueue
            imports={pendingImports}
            onRemove={handleRemove}
            onUpdate={handleUpdate}
            onComplete={handleComplete}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
