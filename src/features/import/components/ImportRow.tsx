import { X, Check, Loader2, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useLibraryStore } from '@/stores/libraryStore';
import type { PendingImport } from '../types';

interface ImportRowProps {
  item: PendingImport;
  onRemove: () => void;
  onUpdate: (updates: Partial<PendingImport>) => void;
}

export function ImportRow({ item, onRemove, onUpdate }: ImportRowProps) {
  const danceStyles = useLibraryStore((state) => state.danceStyles);

  const formatDuration = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const formatFileSize = (bytes: number): string => {
    const mb = bytes / (1024 * 1024);
    return `${mb.toFixed(1)} MB`;
  };

  const statusIcon = {
    pending: <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />,
    extracting: <Loader2 className="h-4 w-4 animate-spin text-blue-500" />,
    ready: null,
    importing: <Loader2 className="h-4 w-4 animate-spin text-primary" />,
    complete: <Check className="h-4 w-4 text-green-500" />,
    error: <AlertCircle className="h-4 w-4 text-destructive" />,
  };

  const isEditable = item.status === 'ready';
  const isProcessing =
    item.status === 'pending' ||
    item.status === 'extracting' ||
    item.status === 'importing';

  return (
    <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
      {/* Status icon */}
      <div className="w-6 flex justify-center">{statusIcon[item.status]}</div>

      {/* Track info */}
      <div className="flex-1 min-w-0 space-y-2">
        {/* Title and Artist */}
        <div className="flex gap-2">
          <Input
            value={
              item.metadata?.title ||
              item.file.name.replace(/\.[^/.]+$/, '') ||
              ''
            }
            onChange={(e) =>
              onUpdate({
                metadata: item.metadata
                  ? { ...item.metadata, title: e.target.value }
                  : null,
              })
            }
            placeholder="Title"
            className="flex-1 h-8 text-sm"
            disabled={!isEditable}
          />
          <Input
            value={item.metadata?.artist || ''}
            onChange={(e) =>
              onUpdate({
                metadata: item.metadata
                  ? { ...item.metadata, artist: e.target.value }
                  : null,
              })
            }
            placeholder="Artist"
            className="flex-1 h-8 text-sm"
            disabled={!isEditable}
          />
        </div>

        {/* Dance style selector and info */}
        <div className="flex items-center gap-3">
          <Select
            value={item.selectedDanceStyleId || ''}
            onValueChange={(value) =>
              onUpdate({ selectedDanceStyleId: value || null })
            }
            disabled={!isEditable}
          >
            <SelectTrigger className="w-48 h-8 text-sm">
              <SelectValue placeholder="Select dance style" />
            </SelectTrigger>
            <SelectContent>
              {danceStyles.map((style) => (
                <SelectItem key={style.id} value={style.id}>
                  {style.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Duration */}
          {item.metadata?.duration && (
            <span className="text-xs text-muted-foreground">
              {formatDuration(item.metadata.duration)}
            </span>
          )}

          {/* BPM (if detected) */}
          {item.metadata?.bpm && (
            <span className="text-xs text-muted-foreground">
              {item.metadata.bpm} BPM
            </span>
          )}

          {/* File size */}
          <span className="text-xs text-muted-foreground">
            {formatFileSize(item.file.size)}
          </span>

          {/* Error message */}
          {item.error && (
            <span className="text-xs text-destructive">{item.error}</span>
          )}
        </div>
      </div>

      {/* Remove button */}
      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8 shrink-0"
        onClick={onRemove}
        disabled={isProcessing}
      >
        <X className="h-4 w-4" />
      </Button>
    </div>
  );
}
