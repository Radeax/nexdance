import { useQueueStore } from '@/stores/queueStore';
import { QueueHeader } from './QueueHeader';
import { QueueList } from './QueueList';
import { EmptyQueue } from './EmptyQueue';
import { ScrollArea } from '@/components/ui/scroll-area';

export function QueueSidebar() {
  const items = useQueueStore((state) => state.items);
  const currentIndex = useQueueStore((state) => state.currentIndex);

  // Get upcoming items (current + future)
  const upcomingItems = items.slice(Math.max(0, currentIndex));

  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <QueueHeader itemCount={upcomingItems.length} />

      {/* Queue List */}
      <ScrollArea className="flex-1">
        {upcomingItems.length === 0 ? (
          <EmptyQueue />
        ) : (
          <QueueList items={upcomingItems} currentIndex={currentIndex} />
        )}
      </ScrollArea>
    </div>
  );
}
