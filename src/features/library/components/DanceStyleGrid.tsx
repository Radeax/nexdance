import { useLibraryStore } from '@/stores/libraryStore';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface DanceStyleGridProps {
  danceStyleIds: string[];
}

export function DanceStyleGrid({ danceStyleIds }: DanceStyleGridProps) {
  const danceStyles = useLibraryStore((state) => state.danceStyles);
  const selectedStyleId = useLibraryStore((state) => state.selectedDanceStyleId);
  const selectDanceStyle = useLibraryStore((state) => state.selectDanceStyle);
  const tracks = useLibraryStore((state) => state.tracks);

  // Get dance styles for this group
  const groupStyles = danceStyleIds
    .map((id) => danceStyles.find((s) => s.id === id))
    .filter(Boolean);

  // Count tracks per dance style
  const getTrackCount = (styleId: string): number => {
    return tracks.filter(
      (t) =>
        t.primaryDanceStyleId === styleId ||
        t.alternateDanceStyleIds?.includes(styleId)
    ).length;
  };

  // Get total tracks for this group
  const getTotalTrackCount = (): number => {
    const styleIdSet = new Set(danceStyleIds);
    return tracks.filter(
      (t) =>
        styleIdSet.has(t.primaryDanceStyleId) ||
        t.alternateDanceStyleIds?.some((id) => styleIdSet.has(id))
    ).length;
  };

  const handleStyleClick = (styleId: string) => {
    // Toggle: click again to deselect
    if (selectedStyleId === styleId) {
      selectDanceStyle(null);
    } else {
      selectDanceStyle(styleId);
    }
  };

  if (groupStyles.length === 0) {
    return (
      <div className="p-4 text-center text-muted-foreground">
        No dance styles in this category.
      </div>
    );
  }

  return (
    <div className="flex flex-wrap gap-2 p-4">
      {/* "All" button to show all tracks in category */}
      <Button
        variant={selectedStyleId === null ? 'default' : 'outline'}
        size="sm"
        onClick={() => selectDanceStyle(null)}
        className="gap-2"
      >
        All
        <Badge variant="secondary" className="ml-1">
          {getTotalTrackCount()}
        </Badge>
      </Button>

      {groupStyles.map(
        (style) =>
          style && (
            <Button
              key={style.id}
              variant={selectedStyleId === style.id ? 'default' : 'outline'}
              size="sm"
              onClick={() => handleStyleClick(style.id)}
              className={cn(
                'gap-2',
                selectedStyleId === style.id && 'ring-2 ring-primary ring-offset-2'
              )}
            >
              {style.name}
              <Badge
                variant={selectedStyleId === style.id ? 'secondary' : 'outline'}
                className="ml-1"
              >
                {getTrackCount(style.id)}
              </Badge>
            </Button>
          )
      )}
    </div>
  );
}
