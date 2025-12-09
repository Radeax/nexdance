import { Link } from 'react-router';
import { Settings, ListMusic, Library } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useUIStore } from '@/stores/uiStore';
import { usePlayerStore } from '@/stores/playerStore';
import { NowPlaying } from '@/features/player/components/NowPlaying';

export function Header() {
  const toggleSidebar = useUIStore((state) => state.toggleSidebar);
  const isSidebarOpen = useUIStore((state) => state.isSidebarOpen);
  const currentTrack = usePlayerStore((state) => state.currentTrack);

  return (
    <header className="flex h-14 items-center justify-between border-b bg-background px-4">
      {/* Logo / App Name */}
      <div className="flex items-center gap-4">
        <Link to="/" className="flex items-center gap-2">
          <Library className="h-6 w-6 text-primary" />
          <span className="text-xl font-bold">NexDance</span>
        </Link>
      </div>

      {/* Now Playing (center) */}
      <div className="flex-1 px-8">{currentTrack && <NowPlaying />}</div>

      {/* Actions */}
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" asChild>
          <Link to="/settings">
            <Settings className="h-5 w-5" />
          </Link>
        </Button>

        <Button
          variant={isSidebarOpen ? 'secondary' : 'ghost'}
          size="icon"
          onClick={toggleSidebar}
          title="Toggle queue"
        >
          <ListMusic className="h-5 w-5" />
        </Button>
      </div>
    </header>
  );
}
