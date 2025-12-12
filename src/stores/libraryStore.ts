import { create } from 'zustand';
import type { Track } from '@/types/track';
import type { DanceStyle } from '@/types/danceStyle';
import type { PrimaryCategory } from '@/types/taxonomy';
import {
  getAllTracks,
  getTracksByDanceStyle,
  saveTrack,
  deleteTrack,
} from '@/services/storage/trackStorage';
import { getAllDanceStyles } from '@/services/storage/danceStyleStorage';

export interface LibraryState {
  // Track cache
  tracks: Track[];
  tracksById: Map<string, Track>;

  // Dance styles (loaded once)
  danceStyles: DanceStyle[];

  // Filtered view
  selectedDanceStyleId: string | null;
  filteredTracks: Track[];

  // Search
  searchQuery: string;

  // Filter: show only unassigned tracks
  showUnassignedOnly: boolean;

  // Loading states
  isLoading: boolean;
  isLoadingTracks: boolean;
  error: string | null;
}

export interface LibraryActions {
  // Initialization
  loadLibrary: () => Promise<void>;
  loadDanceStyles: () => Promise<void>;

  // Track operations
  addTrack: (track: Track) => Promise<void>;
  updateTrack: (track: Track) => Promise<void>;
  removeTrack: (trackId: string) => Promise<void>;
  refreshTracks: () => Promise<void>;

  // Filtering
  selectDanceStyle: (styleId: string | null) => Promise<void>;
  setSearchQuery: (query: string) => void;
  setShowUnassignedOnly: (show: boolean) => void;

  // Helpers
  getTrackById: (id: string) => Track | undefined;
  getDanceStyleById: (id: string) => DanceStyle | undefined;
  getDanceStylesByCategory: (category: PrimaryCategory) => DanceStyle[];
}

const initialState: LibraryState = {
  tracks: [],
  tracksById: new Map(),
  danceStyles: [],
  selectedDanceStyleId: null,
  filteredTracks: [],
  searchQuery: '',
  showUnassignedOnly: false,
  isLoading: false,
  isLoadingTracks: false,
  error: null,
};

// Helper to filter tracks by search query
function filterTracksBySearch(tracks: Track[], query: string): Track[] {
  if (!query.trim()) return tracks;

  const lowerQuery = query.toLowerCase();
  return tracks.filter(
    (track) =>
      track.title.toLowerCase().includes(lowerQuery) ||
      track.artist.toLowerCase().includes(lowerQuery) ||
      (track.album && track.album.toLowerCase().includes(lowerQuery))
  );
}

export const useLibraryStore = create<LibraryState & LibraryActions>()((set, get) => ({
  ...initialState,

  loadLibrary: async () => {
    set({ isLoading: true, error: null });

    try {
      // Load dance styles first (small, fast)
      await get().loadDanceStyles();

      // Load all tracks
      const tracks = await getAllTracks();
      const tracksById = new Map(tracks.map((track) => [track.id, track]));

      set({
        tracks,
        tracksById,
        filteredTracks: filterTracksBySearch(tracks, get().searchQuery),
        isLoading: false,
      });
    } catch (error) {
      console.error('Failed to load library:', error);
      set({
        error: error instanceof Error ? error.message : 'Failed to load library',
        isLoading: false,
      });
    }
  },

  loadDanceStyles: async () => {
    try {
      const danceStyles = await getAllDanceStyles();
      set({ danceStyles });
    } catch (error) {
      console.error('Failed to load dance styles:', error);
    }
  },

  addTrack: async (track) => {
    try {
      await saveTrack(track);

      set((state) => {
        const newTracks = [...state.tracks, track];
        const newTracksById = new Map(state.tracksById);
        newTracksById.set(track.id, track);

        return {
          tracks: newTracks,
          tracksById: newTracksById,
          filteredTracks: filterTracksBySearch(newTracks, state.searchQuery),
        };
      });
    } catch (error) {
      console.error('Failed to add track:', error);
      throw error;
    }
  },

  updateTrack: async (track) => {
    try {
      await saveTrack(track);

      set((state) => {
        const newTracks = state.tracks.map((t) => (t.id === track.id ? track : t));
        const newTracksById = new Map(state.tracksById);
        newTracksById.set(track.id, track);

        return {
          tracks: newTracks,
          tracksById: newTracksById,
          filteredTracks: filterTracksBySearch(newTracks, state.searchQuery),
        };
      });
    } catch (error) {
      console.error('Failed to update track:', error);
      throw error;
    }
  },

  removeTrack: async (trackId) => {
    try {
      await deleteTrack(trackId);

      set((state) => {
        const newTracks = state.tracks.filter((t) => t.id !== trackId);
        const newTracksById = new Map(state.tracksById);
        newTracksById.delete(trackId);

        return {
          tracks: newTracks,
          tracksById: newTracksById,
          filteredTracks: filterTracksBySearch(newTracks, state.searchQuery),
        };
      });
    } catch (error) {
      console.error('Failed to remove track:', error);
      throw error;
    }
  },

  refreshTracks: async () => {
    set({ isLoadingTracks: true });

    try {
      const tracks = await getAllTracks();
      const tracksById = new Map(tracks.map((track) => [track.id, track]));

      set((state) => ({
        tracks,
        tracksById,
        filteredTracks: filterTracksBySearch(tracks, state.searchQuery),
        isLoadingTracks: false,
      }));
    } catch (error) {
      console.error('Failed to refresh tracks:', error);
      set({ isLoadingTracks: false });
    }
  },

  selectDanceStyle: async (styleId) => {
    set({ selectedDanceStyleId: styleId, isLoadingTracks: true });

    try {
      let filteredTracks: Track[];

      if (styleId) {
        filteredTracks = await getTracksByDanceStyle(styleId);
      } else {
        filteredTracks = get().tracks;
      }

      // Apply search filter on top
      filteredTracks = filterTracksBySearch(filteredTracks, get().searchQuery);

      set({ filteredTracks, isLoadingTracks: false });
    } catch (error) {
      console.error('Failed to filter tracks:', error);
      set({ isLoadingTracks: false });
    }
  },

  setSearchQuery: (query) => {
    const { tracks, selectedDanceStyleId, showUnassignedOnly } = get();

    set({ searchQuery: query });

    // Re-filter with new search query
    // If a dance style is selected, we need to re-fetch filtered tracks
    if (selectedDanceStyleId) {
      get().selectDanceStyle(selectedDanceStyleId);
    } else {
      let filtered = filterTracksBySearch(tracks, query);
      if (showUnassignedOnly) {
        filtered = filtered.filter((t) => !t.primaryDanceStyleId);
      }
      set({ filteredTracks: filtered });
    }
  },

  setShowUnassignedOnly: (show) => {
    const { tracks, searchQuery, selectedDanceStyleId } = get();

    set({ showUnassignedOnly: show });

    // Re-filter with new unassigned filter
    if (selectedDanceStyleId) {
      get().selectDanceStyle(selectedDanceStyleId);
    } else {
      let filtered = filterTracksBySearch(tracks, searchQuery);
      if (show) {
        filtered = filtered.filter((t) => !t.primaryDanceStyleId);
      }
      set({ filteredTracks: filtered });
    }
  },

  getTrackById: (id) => get().tracksById.get(id),

  getDanceStyleById: (id) => get().danceStyles.find((style) => style.id === id),

  getDanceStylesByCategory: (category) =>
    get().danceStyles.filter((style) => style.primaryCategory === category),
}));
