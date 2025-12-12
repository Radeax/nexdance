import { Play, Pause, Plus, MoreHorizontal, Trash2, Pencil, Music } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DanceBadge } from '@/components/ui/dance-badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
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
  const pause = usePlayerStore((state) => state.pause);
  const currentTrack = usePlayerStore((state) => state.currentTrack);
  const isPlaying = usePlayerStore((state) => state.isPlaying);
  const getDanceStyleById = useLibraryStore((state) => state.getDanceStyleById);
  const showToast = useUIStore((state) => state.showToast);
  const openModal = useUIStore((state) => state.openModal);

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
    // If it's the same track, toggle play/pause
    if (currentTrack?.id === track.id) {
      if (isPlaying) {
        pause();
      } else {
        play();
      }
      return;
    }
    loadTrack(track);
    play();
  };

  return (
    <div
      className={cn(
        'flex items-center gap-4 px-4 py-3 hover:bg-muted/50 transition-colors cursor-pointer group',
        isCurrentTrack && 'bg-blue-50 dark:bg-blue-900/20'
      )}
      onClick={handleClick}
      aria-current={isCurrentTrack ? 'true' : undefined}
    >
      {/* Play/Pause button (shown on hover) */}
      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
        onClick={(e) => {
          e.stopPropagation();
          handlePlayNow();
        }}
      >
        {isCurrentTrack && isPlaying ? (
          <Pause className="h-4 w-4" />
        ) : (
          <Play className="h-4 w-4" />
        )}
      </Button>

      {/* Now playing indicator (blue dot) */}
      {isCurrentTrack && (
        <span className="w-2 h-2 rounded-full bg-blue-500 shrink-0" />
      )}

      {/* Track info */}
      <div className="flex-1 min-w-0">
        <p
          className={cn(
            'truncate font-medium',
            isCurrentTrack && 'text-blue-600 dark:text-blue-400'
          )}
        >
          {track.title}
        </p>
        <p className="truncate text-sm text-muted-foreground">{track.artist}</p>
      </div>

      {/* Dance style badge */}
      {danceStyle && (
        <DanceBadge
          styleId={track.primaryDanceStyleId}
          name={danceStyle.name}
          className="shrink-0"
        />
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
            {isCurrentTrack && isPlaying ? (
              <Pause className="h-4 w-4 mr-2" />
            ) : (
              <Play className="h-4 w-4 mr-2" />
            )}
            {isCurrentTrack && isPlaying ? 'Pause' : 'Play'}
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleClick}>
            <Plus className="h-4 w-4 mr-2" />
            Add to Queue
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={(e) => {
              e.stopPropagation();
              openModal('trackEdit', { trackId: track.id });
            }}
          >
            <Pencil className="h-4 w-4 mr-2" />
            Edit Details...
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={(e) => {
              e.stopPropagation();
              openModal('setDanceStyle', { trackId: track.id });
            }}
          >
            <Music className="h-4 w-4 mr-2" />
            Set Dance Style
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            className="text-destructive focus:text-destructive"
            onClick={(e) => {
              e.stopPropagation();
              openModal('deleteConfirm', { trackId: track.id, trackTitle: track.title });
            }}
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
