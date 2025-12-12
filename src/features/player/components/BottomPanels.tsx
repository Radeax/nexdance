import { usePlayerStore } from '@/stores/playerStore';
import { StartPanel } from './StartPanel';
import { EndPanel } from './EndPanel';
import { PlaybackPanel } from './PlaybackPanel';

export function BottomPanels() {
  const currentTrack = usePlayerStore((state) => state.currentTrack);

  // Don't show panels if no track loaded
  if (!currentTrack) return null;

  return (
    <div className="grid grid-cols-3 gap-3">
      <StartPanel />
      <EndPanel />
      <PlaybackPanel />
    </div>
  );
}
