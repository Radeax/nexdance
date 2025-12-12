import { useNavigate } from 'react-router';
import { useLibraryStore } from '@/stores/libraryStore';
import { DanceStyleCard } from './DanceStyleCard';

interface DanceStyleGridProps {
  danceStyleIds: string[];
}

export function DanceStyleGrid({ danceStyleIds }: DanceStyleGridProps) {
  const navigate = useNavigate();
  const danceStyles = useLibraryStore((state) => state.danceStyles);
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
    // Navigate to Library with dance filter pre-applied
    navigate(`/library?dance=${styleId}`);
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
              isSelected={false}
              onClick={() => handleStyleClick(style.id)}
            />
          )
      )}
    </div>
  );
}
