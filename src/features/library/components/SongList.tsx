import { Search } from 'lucide-react';
import { useLibraryStore } from '@/stores/libraryStore';
import { SongRow } from './SongRow';
import { SongListHeader } from './SongListHeader';
import { EmptyLibrary } from './EmptyLibrary';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';

export function SongList() {
  const filteredTracks = useLibraryStore((state) => state.filteredTracks);
  const isLoading = useLibraryStore((state) => state.isLoadingTracks);
  const tracks = useLibraryStore((state) => state.tracks);
  const searchQuery = useLibraryStore((state) => state.searchQuery);
  const showUnassignedOnly = useLibraryStore((state) => state.showUnassignedOnly);
  const setSearchQuery = useLibraryStore((state) => state.setSearchQuery);
  const setShowUnassignedOnly = useLibraryStore((state) => state.setShowUnassignedOnly);

  // Show empty state if no tracks in library at all
  if (tracks.length === 0) {
    return <EmptyLibrary />;
  }

  // Show loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  // Show filtered results (may be empty if no matches)
  return (
    <div className="flex flex-col h-full">
      {/* Search and controls */}
      <SongListHeader trackCount={filteredTracks.length} />

      {/* Song list */}
      <ScrollArea className="flex-1">
        {filteredTracks.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-48 gap-3 text-center px-4">
            <Search className="h-10 w-10 text-muted-foreground/50" />
            <div>
              <p className="text-muted-foreground font-medium">No songs found</p>
              <p className="text-sm text-muted-foreground/70 mt-1">
                {searchQuery && showUnassignedOnly
                  ? `No unassigned songs matching "${searchQuery}"`
                  : searchQuery
                    ? `No songs matching "${searchQuery}"`
                    : showUnassignedOnly
                      ? 'No unassigned songs in this view'
                      : 'No songs match the current filter'}
              </p>
            </div>
            {(searchQuery || showUnassignedOnly) && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setSearchQuery('');
                  setShowUnassignedOnly(false);
                }}
              >
                Clear filters
              </Button>
            )}
          </div>
        ) : (
          <div className="divide-y">
            {filteredTracks.map((track) => (
              <SongRow key={track.id} track={track} />
            ))}
          </div>
        )}
      </ScrollArea>
    </div>
  );
}
