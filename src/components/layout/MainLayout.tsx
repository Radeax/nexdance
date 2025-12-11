import { Outlet } from 'react-router';
import { Header } from './Header';
import { LeftSidebar } from './LeftSidebar';
import { QueueSidebar } from '@/features/queue/components/QueueSidebar';
import { TransportBar } from '@/features/player/components/TransportBar';
import { BottomPanels } from '@/features/player/components/BottomPanels';
import { useUIStore } from '@/stores/uiStore';
import { cn } from '@/lib/utils';

export function MainLayout() {
  const isSidebarOpen = useUIStore((state) => state.isSidebarOpen);

  return (
    <div className="flex h-screen flex-col bg-background">
      {/* Header */}
      <Header />

      {/* Main Content Area */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Navigation Sidebar */}
        <LeftSidebar />

        {/* Main Content */}
        <main className="flex-1 overflow-auto bg-slate-50 dark:bg-slate-900/50">
          <Outlet />
        </main>

        {/* Queue Sidebar (Right) */}
        <aside
          className={cn(
            'w-80 border-l bg-background transition-all duration-200 flex flex-col',
            isSidebarOpen ? 'translate-x-0' : 'translate-x-full w-0 border-0'
          )}
        >
          {isSidebarOpen && <QueueSidebar />}
        </aside>
      </div>

      {/* Transport Bar */}
      <TransportBar />

      {/* Bottom Panels (Start/End/Playback) */}
      <BottomPanels />
    </div>
  );
}
