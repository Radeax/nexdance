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
      {/* Header - full width */}
      <Header />

      {/* Main Content Area */}
      <div className="flex flex-1 gap-3 overflow-hidden min-h-0 px-3 pt-3">
        {/* Left Navigation Sidebar */}
        <LeftSidebar />

        {/* Main Content */}
        <main
          className="flex-1 overflow-auto rounded-[var(--panel-radius)]"
          style={{
            background: 'var(--color-bg-panel)',
            backdropFilter: 'blur(var(--panel-blur))',
            boxShadow: 'var(--shadow-panel)',
          }}
        >
          <Outlet />
        </main>

        {/* Queue Sidebar (Right) - 280px per spec */}
        <aside
          className={cn(
            'transition-all duration-300 flex flex-col rounded-[var(--panel-radius)] overflow-hidden',
            isSidebarOpen ? 'w-[280px] opacity-100' : 'w-0 opacity-0'
          )}
          style={{
            background: isSidebarOpen ? 'var(--color-bg-panel)' : 'transparent',
            backdropFilter: isSidebarOpen ? 'blur(var(--panel-blur))' : 'none',
            boxShadow: isSidebarOpen ? 'var(--shadow-panel)' : 'none',
          }}
        >
          {isSidebarOpen && <QueueSidebar />}
        </aside>
      </div>

      {/* Transport Bar */}
      <div className="px-3 pt-3">
        <TransportBar />
      </div>

      {/* Bottom Panels (Start/End/Playback) */}
      <div className="px-3 pt-3 pb-3">
        <BottomPanels />
      </div>
    </div>
  );
}
