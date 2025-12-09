import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { initializeDB } from '@/services/storage';
import App from './App';
import './index.css';

// Initialize database before rendering
initializeDB()
  .then(() => {
    console.log('Database initialized');
    createRoot(document.getElementById('root')!).render(
      <StrictMode>
        <App />
      </StrictMode>
    );
  })
  .catch((error) => {
    console.error('Failed to initialize database:', error);
    // Still render app, but show error state
    createRoot(document.getElementById('root')!).render(
      <StrictMode>
        <App />
      </StrictMode>
    );
  });
