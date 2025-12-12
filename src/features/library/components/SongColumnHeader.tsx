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

  // Determine aria-sort value for the column header
  let ariaSort: 'ascending' | 'descending' | 'none' = 'none';
  if (isActive) {
    ariaSort = sortDirection === 'asc' ? 'ascending' : 'descending';
  }

  // Generate accessible label that includes sort state
  const ariaLabel = isActive
    ? `Sort by ${label}, currently sorted ${sortDirection === 'asc' ? 'ascending' : 'descending'}`
    : `Sort by ${label}`;

  return (
    <div role="columnheader" aria-sort={ariaSort} className={cn('inline-flex', className)}>
      <Button
        variant="ghost"
        size="sm"
        className="h-8 gap-1 -ml-3 font-medium text-muted-foreground hover:text-foreground"
        onClick={() => setSort(column)}
        aria-label={ariaLabel}
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
    </div>
  );
}
