import { Play, Plus, MoreHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useQueueStore } from '@/stores/queueStore';
import { usePlayerStore } from '@/stores/playerStore';
import { useLibraryStore } from '@/stores/libraryStore';
import { useUIStore } from '@/stores/uiStore';
import { cn } from '@/lib/utils';
import type { Track } from '@/types/track';

interface SongRowProps {
  track: Track;
}

export function SongRow({ track }: SongRowProps) {
  const addToQueue = useQueueStore((state) => state.addToQueue);
  const loadTrack = usePlayerStore((state) => state.loadTrack);
  const play = usePlayerStore((state) => state.play);
  const currentTrack = usePlayerStore((state) => state.currentTrack);
  const getDanceStyleById = useLibraryStore((state) => state.getDanceStyleById);
  const showToast = useUIStore((state) => state.showToast);

  const danceStyle = getDanceStyleById(track.primaryDanceStyleId);
  const isCurrentTrack = currentTrack?.id === track.id;

  const formatDuration = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleClick = () => {
    addToQueue(track.id);
    showToast(`Added "${track.title}" to queue`, 'success');
  };

  const handlePlayNow = () => {
    loadTrack(track);
    play();
  };

  return (
    <div
      className={cn(
        'flex items-center gap-4 px-4 py-3 hover:bg-muted/50 transition-colors cursor-pointer group',
        isCurrentTrack && 'bg-primary/10'
      )}
      onClick={handleClick}
    >
      {/* Play button (shown on hover) */}
      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
        onClick={(e) => {
          e.stopPropagation();
          handlePlayNow();
        }}
      >
        <Play className="h-4 w-4" />
      </Button>

      {/* Track info */}
      <div className="flex-1 min-w-0">
        <p
          className={cn(
            'truncate font-medium',
            isCurrentTrack && 'text-primary'
          )}
        >
          {track.title}
        </p>
        <p className="truncate text-sm text-muted-foreground">{track.artist}</p>
      </div>

      {/* Dance style badge */}
      {danceStyle && (
        <Badge variant="outline" className="shrink-0">
          {danceStyle.name}
        </Badge>
      )}

      {/* BPM */}
      <div className="w-16 text-right text-sm text-muted-foreground">
        {track.bpm ? `${track.bpm} BPM` : '-'}
      </div>

      {/* Duration */}
      <div className="w-12 text-right text-sm text-muted-foreground">
        {formatDuration(track.duration)}
      </div>

      {/* Actions menu */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={(e) => e.stopPropagation()}
          >
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={handlePlayNow}>
            <Play className="h-4 w-4 mr-2" />
            Play Now
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleClick}>
            <Plus className="h-4 w-4 mr-2" />
            Add to Queue
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
