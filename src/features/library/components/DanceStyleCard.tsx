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
  trackCount: _trackCount,
  isSelected,
  onClick,
}: DanceStyleCardProps) {
  const color = getDanceColor(style.id);

  return (
    <button
      onClick={onClick}
      className={cn(
        'relative flex items-center h-14 px-4 rounded-xl border bg-white/70 dark:bg-white/10 backdrop-blur-sm text-left transition-all overflow-hidden',
        'hover:shadow-lg hover:bg-white dark:hover:bg-white/20 hover:-translate-y-0.5',
        isSelected && 'ring-2 ring-purple-400 ring-offset-2'
      )}
    >
      {/* Colored left border stripe */}
      <div
        className="absolute left-2 top-2.5 bottom-2.5 w-[5px] rounded-full"
        style={{ backgroundColor: color }}
      />

      {/* Content */}
      <span className="font-semibold text-sm pl-4">{style.name}</span>
    </button>
  );
}
