import { createBrowserRouter } from 'react-router';
import { MainLayout } from '@/components/layout/MainLayout';
import { DancePage } from '@/pages/DancePage';
import { LibraryPage } from '@/pages/LibraryPage';
import { PlaylistsPage } from '@/pages/PlaylistsPage';
import { SettingsPage } from '@/pages/SettingsPage';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    children: [
      {
        index: true,
        element: <DancePage />,
      },
      {
        path: 'dance',
        element: <DancePage />,
      },
      {
        path: 'library',
        element: <LibraryPage />,
      },
      {
        path: 'playlists',
        element: <PlaylistsPage />,
      },
      {
        path: 'settings',
        element: <SettingsPage />,
      },
    ],
  },
]);
