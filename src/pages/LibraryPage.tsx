import { SongList } from '@/features/library/components/SongList';
import { useLibraryStore } from '@/stores/libraryStore';
import { useEffect } from 'react';

export function LibraryPage() {
  const selectDanceStyle = useLibraryStore((state) => state.selectDanceStyle);

  // Clear dance style filter when viewing library
  useEffect(() => {
    selectDanceStyle(null);
  }, [selectDanceStyle]);

  return (
    <div className="flex h-full flex-col">
      <div className="p-4 border-b bg-background">
        <h1 className="text-xl font-semibold">Library</h1>
        <p className="text-sm text-muted-foreground">All songs in your collection</p>
      </div>
      <div className="flex-1 overflow-auto">
        <SongList />
      </div>
    </div>
  );
}
