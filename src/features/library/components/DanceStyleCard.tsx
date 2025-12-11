import { cn } from '@/lib/utils';
import { getDanceColor } from '@/data/danceColors';
import type { DanceStyle } from '@/types/danceStyle';

interface DanceStyleCardProps {
  style: DanceStyle;
  trackCount: number;
  isSelected: boolean;
  onClick: () => void;
}

export function DanceStyleCard({
  style,
  trackCount,
  isSelected,
  onClick,
}: DanceStyleCardProps) {
  const color = getDanceColor(style.id);

  return (
    <button
      onClick={onClick}
      className={cn(
        'relative flex flex-col items-start p-3 rounded-lg border bg-white dark:bg-slate-800 text-left transition-all',
        'hover:shadow-md hover:border-slate-300 dark:hover:border-slate-600',
        isSelected && 'ring-2 ring-primary ring-offset-2'
      )}
    >
      {/* Colored left border */}
      <div
        className="absolute left-0 top-2 bottom-2 w-1 rounded-full"
        style={{ backgroundColor: color }}
      />

      {/* Content */}
      <div className="pl-3">
        <span className="font-medium text-sm">{style.name}</span>
        <span className="block text-xs text-muted-foreground mt-0.5">
          {trackCount} {trackCount === 1 ? 'song' : 'songs'}
        </span>
      </div>
    </button>
  );
}
