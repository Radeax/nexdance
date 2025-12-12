import { ArrowUp, ArrowDown, ArrowUpDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLibraryStore, type SortColumn } from '@/stores/libraryStore';
import { cn } from '@/lib/utils';
import { useId } from 'react';

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

  // Generate unique ID for the description element using React's useId
  const descriptionId = useId();

  // Generate description text for the sort state
  const sortDescription = isActive
    ? `Currently sorted ${sortDirection === 'asc' ? 'ascending' : 'descending'}`
    : 'Not sorted';

  return (
    <div role="columnheader" aria-sort={ariaSort} className={cn('inline-flex', className)}>
      <Button
        variant="ghost"
        size="sm"
        className="h-8 gap-1 -ml-3 font-medium text-muted-foreground hover:text-foreground"
        onClick={() => setSort(column)}
        aria-describedby={descriptionId}
        aria-pressed={isActive}
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
      {/* Visually hidden description for screen readers */}
      <span id={descriptionId} className="sr-only">
        {sortDescription}
      </span>
    </div>
  );
}
