import { usePlayerStore } from '@/stores/playerStore';
import { StartPanel } from './StartPanel';
import { EndPanel } from './EndPanel';
import { PlaybackPanel } from './PlaybackPanel';

export function BottomPanels() {
  const currentTrack = usePlayerStore((state) => state.currentTrack);

  // Don't show panels if no track loaded
  if (!currentTrack) return null;

  return (
    <div
      className="border-t backdrop-blur-sm"
      style={{ background: 'var(--color-bg-panel)' }}
    >
      <div className="grid grid-cols-3 gap-4 p-4">
        <StartPanel />
        <EndPanel />
        <PlaybackPanel />
      </div>
    </div>
  );
}
