import { ArrowUp, ArrowDown, ArrowUpDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLibraryStore, type SortColumn } from '@/stores/libraryStore';
import { cn } from '@/lib/utils';

interface SongColumnHeaderProps {
  column: SortColumn;
  label: string;
  className?: string;
}

export function SongColumnHeader({ column, label, className }: SongColumnHeaderProps) {
  const sortColumn = useLibraryStore((state) => state.sortColumn);
  const sortDirection = useLibraryStore((state) => state.sortDirection);
  const setSort = useLibraryStore((state) => state.setSort);

  const isActive = sortColumn === column;

  return (
    <Button
      variant="ghost"
      size="sm"
      className={cn('h-8 gap-1 -ml-3 font-medium text-muted-foreground hover:text-foreground', className)}
      onClick={() => setSort(column)}
    >
      {label}
      {isActive ? (
        sortDirection === 'asc' ? (
          <ArrowUp className="h-3 w-3" />
        ) : (
          <ArrowDown className="h-3 w-3" />
        )
      ) : (
        <ArrowUpDown className="h-3 w-3 opacity-50" />
      )}
    </Button>
  );
}
