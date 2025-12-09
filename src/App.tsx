import { RouterProvider } from 'react-router';
import { router } from './router';
import { useAudioSync } from '@/hooks/useAudioSync';
import { Toaster } from '@/components/ui/sonner';
import { ImportModal } from '@/features/import/components/ImportModal';

function App() {
  // Initialize audio sync
  useAudioSync();

  return (
    <>
      <RouterProvider router={router} />
      <ImportModal />
      <Toaster />
    </>
  );
}

export default App;
