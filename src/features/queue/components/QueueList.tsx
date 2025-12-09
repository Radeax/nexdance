import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core';
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { useQueueStore } from '@/stores/queueStore';
import { QueueItemRow } from './QueueItemRow';
import type { QueueItem } from '@/types/queue';

interface QueueListProps {
  items: QueueItem[];
  currentIndex: number;
}

export function QueueList({ items, currentIndex }: QueueListProps) {
  const reorderQueue = useQueueStore((state) => state.reorderQueue);
  const allItems = useQueueStore((state) => state.items);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      // Find actual indices in full queue
      const activeIndex = allItems.findIndex((item) => item.id === active.id);
      const overIndex = allItems.findIndex((item) => item.id === over.id);

      if (activeIndex !== -1 && overIndex !== -1) {
        reorderQueue(activeIndex, overIndex);
      }
    }
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext
        items={items.map((item) => item.id)}
        strategy={verticalListSortingStrategy}
      >
        <div className="divide-y">
          {items.map((item, index) => (
            <QueueItemRow
              key={item.id}
              item={item}
              isNowPlaying={currentIndex >= 0 && index === 0}
            />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
}
