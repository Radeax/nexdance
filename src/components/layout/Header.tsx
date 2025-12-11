import { Link } from 'react-router';
import { Search, Moon, Sun, ListMusic, User } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { usePlayerStore } from '@/stores/playerStore';
import { useLibraryStore } from '@/stores/libraryStore';
import { useUIStore } from '@/stores/uiStore';
import { DanceBadge } from '@/components/ui/dance-badge';
import { useState } from 'react';

export function Header() {
  const currentTrack = usePlayerStore((state) => state.currentTrack);
  const getDanceStyleById = useLibraryStore((state) => state.getDanceStyleById);
  const setSearchQuery = useLibraryStore((state) => state.setSearchQuery);
  const toggleSidebar = useUIStore((state) => state.toggleSidebar);
  const isSidebarOpen = useUIStore((state) => state.isSidebarOpen);
  const [isDark, setIsDark] = useState(false);

  const danceStyle = currentTrack
    ? getDanceStyleById(currentTrack.primaryDanceStyleId)
    : null;

  const toggleDarkMode = () => {
    setIsDark(!isDark);
    document.documentElement.classList.toggle('dark');
  };

  return (
    <header className="flex h-14 items-center justify-between border-b bg-background px-4 gap-4">
      {/* Logo */}
      <Link to="/" className="font-bold text-xl text-primary shrink-0">
        NexDance
      </Link>

      {/* Search Bar */}
      <div className="flex-1 max-w-xl">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search songs, styles, BPM... (/ to focus)"
            className="pl-9 bg-muted/50"
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Now Playing Pill */}
      {currentTrack && (
        <div className="flex items-center gap-2 bg-green-500/10 border border-green-500/20 rounded-full px-3 py-1">
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          <span className="text-sm font-medium truncate max-w-32">
            {currentTrack.title}
          </span>
          {danceStyle && (
            <DanceBadge styleId={currentTrack.primaryDanceStyleId} name={danceStyle.name} />
          )}
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center gap-1">
        <Button variant="ghost" size="icon" onClick={toggleDarkMode}>
          {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
        </Button>

        <Button variant="ghost" size="icon">
          <User className="h-5 w-5" />
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
