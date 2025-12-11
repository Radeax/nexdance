import { useLibraryStore } from '@/stores/libraryStore';
import { SongRow } from './SongRow';
import { SongListHeader } from './SongListHeader';
import { EmptyLibrary } from './EmptyLibrary';
import { ScrollArea } from '@/components/ui/scroll-area';

export function SongList() {
  const filteredTracks = useLibraryStore((state) => state.filteredTracks);
  const isLoading = useLibraryStore((state) => state.isLoadingTracks);
  const tracks = useLibraryStore((state) => state.tracks);

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
          <div className="flex items-center justify-center h-32 text-muted-foreground">
            No songs match the current filter.
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
