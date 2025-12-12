import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, X, Play } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { DanceBadge } from '@/components/ui/dance-badge';
import { useQueueStore } from '@/stores/queueStore';
import { useLibraryStore } from '@/stores/libraryStore';
import { usePlayerStore } from '@/stores/playerStore';
import { cn } from '@/lib/utils';
import type { QueueItem } from '@/types/queue';
import type { Track } from '@/types/track';

interface QueueItemRowProps {
  item: QueueItem;
  isNowPlaying: boolean;
}

export function QueueItemRow({ item, isNowPlaying }: QueueItemRowProps) {
  const [track, setTrack] = useState<Track | null>(null);
  const removeFromQueue = useQueueStore((state) => state.removeFromQueue);
  const jumpToIndex = useQueueStore((state) => state.jumpToIndex);
  const items = useQueueStore((state) => state.items);
  const loadTrack = usePlayerStore((state) => state.loadTrack);
  const play = usePlayerStore((state) => state.play);
  const getTrackById = useLibraryStore((state) => state.getTrackById);
  const getDanceStyleById = useLibraryStore((state) => state.getDanceStyleById);

  // Load track data
  useEffect(() => {
    const trackData = getTrackById(item.trackId);
    if (trackData) {
      setTrack(trackData);
    }
  }, [item.trackId, getTrackById]);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: item.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 50 : undefined,
  };

  const handleClick = () => {
    // Find index in full queue and jump to it
    const index = items.findIndex((i) => i.id === item.id);
    if (index !== -1 && track) {
      jumpToIndex(index);
      loadTrack(track);
      play();
    }
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    removeFromQueue(item.id);
  };

  if (!track) {
    return (
      <div className="px-4 py-3 text-sm text-muted-foreground">Loading...</div>
    );
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        'flex items-center gap-2 px-2 py-2 rounded-md transition-all cursor-pointer group',
        'bg-white/60 dark:bg-white/5 border',
        isNowPlaying
          ? 'bg-primary/5 dark:bg-primary/10 border-dashed border-primary/40'
          : 'border-transparent hover:bg-white/80 dark:hover:bg-white/10',
        isDragging && 'opacity-50 shadow-lg scale-[1.02]'
      )}
      onClick={handleClick}
    >
      {/* Drag handle - ⋮⋮ per DDR-002 */}
      <button
        className="p-1 touch-none cursor-grab active:cursor-grabbing text-muted-foreground hover:text-foreground"
        {...attributes}
        {...listeners}
        onClick={(e) => e.stopPropagation()}
        aria-label="Reorder"
      >
        <GripVertical className="h-4 w-4" />
      </button>

      {/* Now playing indicator */}
      {isNowPlaying && <Play className="h-3 w-3 text-primary animate-pulse" />}

      {/* Track info */}
      <div className="flex-1 min-w-0 overflow-hidden">
        <div className="flex items-center gap-2">
          <p
            className={cn(
              'truncate text-sm font-medium flex-1',
              isNowPlaying && 'text-primary'
            )}
          >
            {track.title}
          </p>
          {getDanceStyleById(track.primaryDanceStyleId) && (
            <DanceBadge
              styleId={track.primaryDanceStyleId}
              name={getDanceStyleById(track.primaryDanceStyleId)!.name}
            />
          )}
        </div>
        <p className="truncate text-xs text-muted-foreground">{track.artist}</p>
      </div>

      {/* Duration */}
      <span className="text-xs text-muted-foreground shrink-0 tabular-nums">
        {Math.floor(track.duration / 60)}:{String(Math.floor(track.duration % 60)).padStart(2, '0')}
      </span>

      {/* Remove button */}
      <Button
        variant="ghost"
        size="icon"
        className="h-5 w-5 shrink-0 text-muted-foreground hover:text-foreground"
        onClick={handleRemove}
      >
        <X className="h-3 w-3" />
      </Button>
    </div>
  );
}
