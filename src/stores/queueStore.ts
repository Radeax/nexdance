import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';
import { v4 as uuidv4 } from 'uuid';
import type { QueueItem, PersistedQueueState } from '@/types/queue';
import type { Track } from '@/types/track';
import { getQueueState, saveQueueState } from '@/services/storage/queueStorage';
import { getTrack } from '@/services/storage/trackStorage';

export interface QueueState {
  items: QueueItem[];
  currentIndex: number; // -1 if nothing playing
  isAutoplayEnabled: boolean;
}

export interface QueueActions {
  // Queue manipulation
  addToQueue: (trackId: string) => void;
  addMultipleToQueue: (trackIds: string[]) => void;
  removeFromQueue: (queueItemId: string) => void;
  removeFromQueueByTrackId: (trackId: string) => void;
  clearQueue: () => void;
  reorderQueue: (fromIndex: number, toIndex: number) => void;

  // Playback navigation
  jumpToIndex: (index: number) => void;
  advanceQueue: () => boolean; // Returns false if queue exhausted
  goToPrevious: () => boolean; // Returns false if at start

  // Current track helpers
  getCurrentTrack: () => Promise<Track | null>;
  getNextTrack: () => Promise<Track | null>;

  // Autoplay
  setAutoplay: (enabled: boolean) => void;

  // Persistence
  loadPersistedQueue: () => Promise<void>;
  persistQueue: () => Promise<void>;

  // Validation
  validateQueue: () => Promise<void>; // Removes orphaned tracks
}

const initialState: QueueState = {
  items: [],
  currentIndex: -1,
  isAutoplayEnabled: true,
};

export const useQueueStore = create<QueueState & QueueActions>()(
  subscribeWithSelector((set, get) => ({
    ...initialState,

    addToQueue: (trackId) => {
      const newItem: QueueItem = {
        id: uuidv4(),
        trackId,
        addedAt: new Date(),
      };

      set((state) => {
        const newItems = [...state.items, newItem];
        // If queue was empty, set currentIndex to 0 (will trigger playback)
        const newIndex = state.currentIndex === -1 ? 0 : state.currentIndex;
        return { items: newItems, currentIndex: newIndex };
      });

      // Persist async
      get().persistQueue();
    },

    addMultipleToQueue: (trackIds) => {
      const newItems: QueueItem[] = trackIds.map((trackId) => ({
        id: uuidv4(),
        trackId,
        addedAt: new Date(),
      }));

      set((state) => {
        const updatedItems = [...state.items, ...newItems];
        const newIndex = state.currentIndex === -1 ? 0 : state.currentIndex;
        return { items: updatedItems, currentIndex: newIndex };
      });

      get().persistQueue();
    },

    removeFromQueue: (queueItemId) => {
      set((state) => {
        const itemIndex = state.items.findIndex((item) => item.id === queueItemId);
        if (itemIndex === -1) return state;

        const newItems = state.items.filter((item) => item.id !== queueItemId);
        let newIndex = state.currentIndex;

        // Adjust currentIndex if needed
        if (itemIndex < state.currentIndex) {
          newIndex = state.currentIndex - 1;
        } else if (itemIndex === state.currentIndex) {
          // Removed current item - stay at same index (now pointing to next)
          // If we removed the last item, decrement
          if (newIndex >= newItems.length) {
            newIndex = newItems.length - 1;
          }
        }

        return { items: newItems, currentIndex: newIndex };
      });

      get().persistQueue();
    },

    removeFromQueueByTrackId: (trackId) => {
      set((state) => ({
        items: state.items.filter((item) => item.trackId !== trackId),
      }));
      get().persistQueue();
    },

    clearQueue: () => {
      set({ items: [], currentIndex: -1 });
      get().persistQueue();
    },

    reorderQueue: (fromIndex, toIndex) => {
      set((state) => {
        const items = [...state.items];
        const [removed] = items.splice(fromIndex, 1);
        items.splice(toIndex, 0, removed);

        // Adjust currentIndex if it was affected
        let newIndex = state.currentIndex;
        if (state.currentIndex === fromIndex) {
          newIndex = toIndex;
        } else if (fromIndex < state.currentIndex && toIndex >= state.currentIndex) {
          newIndex = state.currentIndex - 1;
        } else if (fromIndex > state.currentIndex && toIndex <= state.currentIndex) {
          newIndex = state.currentIndex + 1;
        }

        return { items, currentIndex: newIndex };
      });

      get().persistQueue();
    },

    jumpToIndex: (index) => {
      const { items } = get();
      if (index >= 0 && index < items.length) {
        // Per DDR-002: Jumping removes all songs BEFORE the tapped song
        const newItems = items.slice(index);
        set({ items: newItems, currentIndex: 0 });
        get().persistQueue();
      }
    },

    advanceQueue: () => {
      const { items, currentIndex, isAutoplayEnabled } = get();

      if (!isAutoplayEnabled) return false;
      if (currentIndex >= items.length - 1) return false;

      set({ currentIndex: currentIndex + 1 });
      get().persistQueue();
      return true;
    },

    goToPrevious: () => {
      const { currentIndex } = get();

      if (currentIndex <= 0) return false;

      set({ currentIndex: currentIndex - 1 });
      get().persistQueue();
      return true;
    },

    getCurrentTrack: async () => {
      const { items, currentIndex } = get();

      if (currentIndex === -1 || currentIndex >= items.length) {
        return null;
      }

      const currentItem = items[currentIndex];
      const track = await getTrack(currentItem.trackId);
      return track ?? null;
    },

    getNextTrack: async () => {
      const { items, currentIndex } = get();
      const nextIndex = currentIndex + 1;

      if (nextIndex >= items.length) {
        return null;
      }

      const nextItem = items[nextIndex];
      const track = await getTrack(nextItem.trackId);
      return track ?? null;
    },

    setAutoplay: (enabled) => set({ isAutoplayEnabled: enabled }),

    loadPersistedQueue: async () => {
      try {
        const persisted = await getQueueState();
        set({
          items: persisted.items,
          currentIndex: persisted.currentIndex,
        });
      } catch (error) {
        console.error('Failed to load persisted queue:', error);
      }
    },

    persistQueue: async () => {
      const { items, currentIndex } = get();
      const state: PersistedQueueState = {
        items,
        currentIndex,
        currentPosition: 0, // Will be updated by player
        savedAt: new Date(),
      };

      try {
        await saveQueueState(state);
      } catch (error) {
        console.error('Failed to persist queue:', error);
      }
    },

    validateQueue: async () => {
      const { items, currentIndex } = get();
      const validItems: QueueItem[] = [];
      let removedCount = 0;

      for (const item of items) {
        const track = await getTrack(item.trackId);
        if (track) {
          validItems.push(item);
        } else {
          removedCount++;
        }
      }

      if (removedCount > 0) {
        // Adjust currentIndex if items before it were removed
        let newIndex = currentIndex;
        for (let i = 0; i < currentIndex && i < items.length; i++) {
          const track = await getTrack(items[i].trackId);
          if (!track) {
            newIndex--;
          }
        }

        // Clamp index
        newIndex = Math.max(-1, Math.min(newIndex, validItems.length - 1));
        if (validItems.length === 0) newIndex = -1;

        set({ items: validItems, currentIndex: newIndex });
        get().persistQueue();

        console.log(`Queue validated: removed ${removedCount} orphaned items`);
      }
    },
  }))
);
