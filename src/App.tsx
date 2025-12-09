import { RouterProvider } from 'react-router';
import { router } from './router';
import { useAudioSync } from '@/hooks/useAudioSync';
import { Toaster } from '@/components/ui/sonner';

function App() {
  // Initialize audio sync
  useAudioSync();

  return (
    <>
      <RouterProvider router={router} />
      <Toaster />
    </>
  );
}

export default App;
