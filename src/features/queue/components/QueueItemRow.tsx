import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, X, Play } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
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
        'flex items-center gap-2 px-2 py-2 hover:bg-muted/50 transition-colors cursor-pointer group',
        isNowPlaying && 'bg-primary/10',
        isDragging && 'opacity-50 bg-muted'
      )}
      onClick={handleClick}
    >
      {/* Drag handle */}
      <button
        className="p-1 touch-none cursor-grab active:cursor-grabbing text-muted-foreground hover:text-foreground"
        {...attributes}
        {...listeners}
        onClick={(e) => e.stopPropagation()}
      >
        <GripVertical className="h-4 w-4" />
      </button>

      {/* Now playing indicator */}
      {isNowPlaying && <Play className="h-3 w-3 text-primary animate-pulse" />}

      {/* Track info */}
      <div className="flex-1 min-w-0">
        <p
          className={cn(
            'truncate text-sm font-medium',
            isNowPlaying && 'text-primary'
          )}
        >
          {track.title}
        </p>
        <p className="truncate text-xs text-muted-foreground">{track.artist}</p>
      </div>

      {/* Remove button */}
      <Button
        variant="ghost"
        size="icon"
        className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
        onClick={handleRemove}
      >
        <X className="h-3 w-3" />
      </Button>
    </div>
  );
}
