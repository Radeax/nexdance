import { useLibraryStore } from '@/stores/libraryStore';
import { DanceStyleCard } from './DanceStyleCard';

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
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 p-4">
      {groupStyles.map(
        (style) =>
          style && (
            <DanceStyleCard
              key={style.id}
              style={style}
              trackCount={getTrackCount(style.id)}
              isSelected={selectedStyleId === style.id}
              onClick={() => handleStyleClick(style.id)}
            />
          )
      )}
    </div>
  );
}
