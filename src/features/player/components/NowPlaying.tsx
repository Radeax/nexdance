import { usePlayerStore } from '@/stores/playerStore';
import { useLibraryStore } from '@/stores/libraryStore';
import { Badge } from '@/components/ui/badge';

export function NowPlaying() {
  const currentTrack = usePlayerStore((state) => state.currentTrack);
  const getDanceStyleById = useLibraryStore((state) => state.getDanceStyleById);

  if (!currentTrack) return null;

  const danceStyle = getDanceStyleById(currentTrack.primaryDanceStyleId);

  return (
    <div className="flex items-center gap-3 min-w-0">
      <div className="min-w-0 flex-1">
        <p className="truncate font-medium">{currentTrack.title}</p>
        <p className="truncate text-sm text-muted-foreground">
          {currentTrack.artist}
        </p>
      </div>
      {danceStyle && (
        <Badge variant="secondary" className="shrink-0">
          {danceStyle.name}
        </Badge>
      )}
    </div>
  );
}
