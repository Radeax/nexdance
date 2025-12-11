import { Search, Upload } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useLibraryStore } from '@/stores/libraryStore';
import { useUIStore } from '@/stores/uiStore';

interface SongListHeaderProps {
  trackCount: number;
}

export function SongListHeader({ trackCount }: SongListHeaderProps) {
  const searchQuery = useLibraryStore((state) => state.searchQuery);
  const setSearchQuery = useLibraryStore((state) => state.setSearchQuery);
  const openModal = useUIStore((state) => state.openModal);

  return (
    <div className="flex items-center gap-4 p-4 border-b">
      {/* Search */}
      <div className="relative flex-1 max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search songs..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-9"
        />
      </div>

      {/* Track count */}
      <span className="text-sm text-muted-foreground">
        {trackCount} {trackCount === 1 ? 'song' : 'songs'}
      </span>

      {/* Import button */}
      <Button
        variant="outline"
        size="sm"
        onClick={() => openModal('import')}
        className="gap-2"
      >
        <Upload className="h-4 w-4" />
        Import
      </Button>
    </div>
  );
}
