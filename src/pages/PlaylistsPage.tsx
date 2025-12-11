import { ListMusic } from 'lucide-react';

export function PlaylistsPage() {
  return (
    <div className="flex flex-col items-center justify-center h-full gap-4">
      <div className="rounded-full bg-muted p-6">
        <ListMusic className="h-12 w-12 text-muted-foreground" />
      </div>
      <div className="text-center">
        <h2 className="font-semibold text-lg">Playlists</h2>
        <p className="text-muted-foreground">Coming in v1.1</p>
      </div>
    </div>
  );
}
