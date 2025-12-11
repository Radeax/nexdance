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
    <div
      className="flex h-screen flex-col"
      style={{ background: 'var(--color-bg-app)', backgroundAttachment: 'fixed' }}
    >
      {/* Header */}
      <Header />

      {/* Main Content Area */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Navigation Sidebar */}
        <LeftSidebar />

        {/* Main Content */}
        <main className="flex-1 overflow-auto">
          <Outlet />
        </main>

        {/* Queue Sidebar (Right) */}
        <aside
          className={cn(
            'w-80 border-l transition-all duration-200 flex flex-col backdrop-blur-sm',
            isSidebarOpen ? 'translate-x-0' : 'translate-x-full w-0 border-0'
          )}
          style={{ background: isSidebarOpen ? 'var(--color-bg-panel)' : 'transparent' }}
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
