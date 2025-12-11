import { DanceStyleTabs } from '@/features/library/components/DanceStyleTabs';
import { SongList } from '@/features/library/components/SongList';

export function DancePage() {
  return (
    <div className="flex h-full flex-col">
      {/* Dance Style Navigation */}
      <DanceStyleTabs />

      {/* Song List */}
      <div className="flex-1 overflow-auto">
        <SongList />
      </div>
    </div>
  );
}
