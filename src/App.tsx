import { RouterProvider } from 'react-router';
import { router } from './router';
import { useAudioSync } from '@/hooks/useAudioSync';
import { Toaster } from '@/components/ui/sonner';
import { ImportModal } from '@/features/import/components/ImportModal';
import { DeleteTrackModal } from '@/features/library/components/DeleteTrackModal';

function App() {
  // Initialize audio sync
  useAudioSync();

  return (
    <>
      <RouterProvider router={router} />
      <ImportModal />
      <DeleteTrackModal />
      <Toaster />
    </>
  );
}

export default App;
