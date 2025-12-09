import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { initializeDB } from '@/services/storage';
import { useLibraryStore } from '@/stores/libraryStore';
import { useQueueStore } from '@/stores/queueStore';
import App from './App';
import './index.css';

// Initialize app
async function init() {
  try {
    // Initialize database first
    await initializeDB();
    console.log('Database initialized');

    // Load library and queue in parallel
    await Promise.all([
      useLibraryStore.getState().loadLibrary(),
      useQueueStore.getState().loadPersistedQueue(),
    ]);
    console.log('Library and queue loaded');
  } catch (error) {
    console.error('Failed to initialize app:', error);
  }

  // Render app
  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <App />
    </StrictMode>
  );
}

init();
