import { Button } from '@/components/ui/button';
import { useAudioSync } from '@/hooks/useAudioSync';

function App() {
  // Initialize audio sync (bridges stores <-> AudioEngine)
  useAudioSync();

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold">NexDance</h1>
        <p className="text-muted-foreground">
          Music player for ballroom dance instructors
        </p>
        <Button>Get Started</Button>
      </div>
    </div>
  );
}

export default App;
