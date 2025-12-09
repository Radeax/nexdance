import { create } from 'zustand';

export type ModalType =
  | 'import'
  | 'trackEdit'
  | 'settings'
  | 'deleteConfirm'
  | 'clearQueueConfirm'
  | null;

export interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
  duration?: number;
}

export interface UIState {
  // Sidebar (queue panel)
  isSidebarOpen: boolean;

  // Navigation
  activeNavigationGroupId: string | null;

  // Modals
  activeModal: ModalType;
  modalData: Record<string, unknown> | null;

  // Toasts
  toasts: Toast[];

  // Transport panel
  isPlaybackPanelExpanded: boolean;

  // Mobile
  isMobileQueueDrawerOpen: boolean;
}

export interface UIActions {
  // Sidebar
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;

  // Navigation
  setActiveNavigationGroup: (id: string | null) => void;

  // Modals
  openModal: (modal: ModalType, data?: Record<string, unknown>) => void;
  closeModal: () => void;

  // Toasts
  showToast: (message: string, type?: Toast['type'], duration?: number) => void;
  dismissToast: (id: string) => void;
  clearToasts: () => void;

  // Transport panel
  togglePlaybackPanel: () => void;
  setPlaybackPanelExpanded: (expanded: boolean) => void;

  // Mobile
  toggleMobileQueueDrawer: () => void;
  setMobileQueueDrawerOpen: (open: boolean) => void;
}

let toastIdCounter = 0;

export const useUIStore = create<UIState & UIActions>()((set, get) => ({
  // Initial state
  isSidebarOpen: true,
  activeNavigationGroupId: null,
  activeModal: null,
  modalData: null,
  toasts: [],
  isPlaybackPanelExpanded: false,
  isMobileQueueDrawerOpen: false,

  // Sidebar
  toggleSidebar: () => set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
  setSidebarOpen: (open) => set({ isSidebarOpen: open }),

  // Navigation
  setActiveNavigationGroup: (id) => set({ activeNavigationGroupId: id }),

  // Modals
  openModal: (modal, data = undefined) =>
    set({ activeModal: modal, modalData: data ?? null }),
  closeModal: () => set({ activeModal: null, modalData: null }),

  // Toasts
  showToast: (message, type = 'info', duration = 4000) => {
    const id = `toast-${++toastIdCounter}`;
    const toast: Toast = { id, message, type, duration };

    set((state) => ({ toasts: [...state.toasts, toast] }));

    // Auto-dismiss
    if (duration > 0) {
      setTimeout(() => {
        get().dismissToast(id);
      }, duration);
    }
  },

  dismissToast: (id) => {
    set((state) => ({
      toasts: state.toasts.filter((t) => t.id !== id),
    }));
  },

  clearToasts: () => set({ toasts: [] }),

  // Transport panel
  togglePlaybackPanel: () =>
    set((state) => ({ isPlaybackPanelExpanded: !state.isPlaybackPanelExpanded })),
  setPlaybackPanelExpanded: (expanded) => set({ isPlaybackPanelExpanded: expanded }),

  // Mobile
  toggleMobileQueueDrawer: () =>
    set((state) => ({ isMobileQueueDrawerOpen: !state.isMobileQueueDrawerOpen })),
  setMobileQueueDrawerOpen: (open) => set({ isMobileQueueDrawerOpen: open }),
}));
