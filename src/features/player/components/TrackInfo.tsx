import { usePlayerStore } from '@/stores/playerStore';
import { useLibraryStore } from '@/stores/libraryStore';
import { Badge } from '@/components/ui/badge';

export function TrackInfo() {
  const currentTrack = usePlayerStore((state) => state.currentTrack);
  const getDanceStyleById = useLibraryStore((state) => state.getDanceStyleById);

  if (!currentTrack) return null;

  const danceStyle = getDanceStyleById(currentTrack.primaryDanceStyleId);

  return (
    <div className="flex items-center gap-3 min-w-0 w-64">
      {/* Album art placeholder */}
      <div className="h-12 w-12 rounded bg-muted flex items-center justify-center shrink-0">
        <span className="text-2xl">🎵</span>
      </div>

      <div className="min-w-0 flex-1">
        <p className="font-medium truncate text-sm">{currentTrack.title}</p>
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground truncate">
            {currentTrack.artist}
          </span>
          {danceStyle && (
            <Badge variant="outline" className="text-xs px-1 py-0 shrink-0">
              {danceStyle.name}
            </Badge>
          )}
        </div>
      </div>
    </div>
  );
}
