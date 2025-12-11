import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useUIStore } from '@/stores/uiStore';
import { useLibraryStore } from '@/stores/libraryStore';
import { useQueueStore } from '@/stores/queueStore';
import { deleteTrackAudioBlob } from '@/services/storage/trackStorage';

export function DeleteTrackModal() {
  const activeModal = useUIStore((state) => state.activeModal);
  const modalData = useUIStore((state) => state.modalData);
  const closeModal = useUIStore((state) => state.closeModal);
  const showToast = useUIStore((state) => state.showToast);
  const removeTrack = useLibraryStore((state) => state.removeTrack);
  const removeFromQueueByTrackId = useQueueStore(
    (state) => state.removeFromQueueByTrackId
  );

  const isOpen = activeModal === 'deleteConfirm';
  const trackId = modalData?.trackId as string | undefined;
  const trackTitle = modalData?.trackTitle as string | undefined;

  const handleDelete = async () => {
    if (!trackId) return;

    try {
      // Remove from queue if present
      removeFromQueueByTrackId(trackId);

      // Delete audio blob from storage
      await deleteTrackAudioBlob(trackId);

      // Remove from library
      await removeTrack(trackId);

      // Show success toast
      showToast(`"${trackTitle}" deleted from library`, 'success');

      // Close modal
      closeModal();
    } catch (error) {
      console.error('Failed to delete track:', error);
      showToast('Failed to delete track', 'error');
    }
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={(open) => !open && closeModal()}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete "{trackTitle}"?</AlertDialogTitle>
          <AlertDialogDescription>
            This will permanently remove the song from your library. This action
            cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
