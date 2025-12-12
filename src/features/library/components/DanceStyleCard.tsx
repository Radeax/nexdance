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
        'relative flex items-center h-14 px-4 rounded-2xl border border-border bg-white/85 dark:bg-white/5 backdrop-blur-sm text-left transition-all duration-200 overflow-hidden',
        'hover:shadow-lg hover:bg-white dark:hover:bg-white/10 hover:-translate-y-1 hover:scale-[1.02]',
        isSelected && 'ring-2 ring-primary ring-offset-2 dark:ring-offset-transparent'
      )}
      style={{ boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)' }}
    >
      {/* Colored left border stripe */}
      <div
        className="absolute left-2.5 top-3 bottom-3 w-1.5 rounded-full"
        style={{ backgroundColor: color }}
      />

      {/* Content */}
      <span className="font-semibold text-sm pl-4 text-gray-800 dark:text-gray-100">{style.name}</span>
    </button>
  );
}
