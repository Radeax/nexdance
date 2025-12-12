import { useSearchParams } from 'react-router';
import { useEffect } from 'react';
import { X } from 'lucide-react';
import { SongList } from '@/features/library/components/SongList';
import { useLibraryStore } from '@/stores/libraryStore';
import { Button } from '@/components/ui/button';
import { DanceBadge } from '@/components/ui/dance-badge';

export function LibraryPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const danceFilterId = searchParams.get('dance');

  const selectDanceStyle = useLibraryStore((state) => state.selectDanceStyle);
  const getDanceStyleById = useLibraryStore((state) => state.getDanceStyleById);
  const selectedDanceStyleId = useLibraryStore((state) => state.selectedDanceStyleId);

  // Apply dance filter from URL param
  useEffect(() => {
    if (danceFilterId) {
      selectDanceStyle(danceFilterId);
    } else {
      selectDanceStyle(null);
    }
  }, [danceFilterId, selectDanceStyle]);

  const handleClearFilter = () => {
    searchParams.delete('dance');
    setSearchParams(searchParams);
  };

  const filteredStyle = selectedDanceStyleId ? getDanceStyleById(selectedDanceStyleId) : null;

  return (
    <div className="flex h-full flex-col">
      <div className="p-4 border-b bg-background">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold">Library</h1>
            <p className="text-sm text-muted-foreground">
              {filteredStyle ? 'Filtered by dance style' : 'All songs in your collection'}
            </p>
          </div>
          {filteredStyle && (
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Showing:</span>
              <DanceBadge styleId={filteredStyle.id} name={filteredStyle.name} />
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6"
                onClick={handleClearFilter}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      </div>
      <div className="flex-1 overflow-auto">
        <SongList />
      </div>
    </div>
  );
}
