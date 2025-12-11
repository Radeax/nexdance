import { ListMusic } from 'lucide-react';

export function EmptyQueue() {
  return (
    <div className="flex flex-col items-center justify-center h-48 text-center px-4">
      <ListMusic className="h-12 w-12 text-muted-foreground mb-3" />
      <p className="text-sm text-muted-foreground">Queue is empty.</p>
      <p className="text-xs text-muted-foreground mt-1">
        Click a song to add it.
      </p>
    </div>
  );
}
