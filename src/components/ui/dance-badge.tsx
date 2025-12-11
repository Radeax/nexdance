import { getDanceColor } from '@/data/danceColors';

interface DanceBadgeProps {
  styleId: string;
  name: string;
  className?: string;
}

export function DanceBadge({ styleId, name, className }: DanceBadgeProps) {
  const color = getDanceColor(styleId);

  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium text-white ${className}`}
      style={{ backgroundColor: color }}
    >
      {name}
    </span>
  );
}
