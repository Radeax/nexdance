export interface QueueItem {
  id: string;
  trackId: string;
  addedAt: Date;
}

export interface PersistedQueueState {
  items: QueueItem[];
  currentIndex: number;
  currentPosition: number;
  savedAt: Date;
}

export const EMPTY_QUEUE_STATE: PersistedQueueState = {
  items: [],
  currentIndex: -1,
  currentPosition: 0,
  savedAt: new Date(),
};
