import { Outlet } from 'react-router';
import { Header } from './Header';
import { QueueSidebar } from '@/features/queue/components/QueueSidebar';
import { TransportBar } from '@/features/player/components/TransportBar';
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
        {/* Main Content */}
        <main className="flex-1 overflow-auto">
          <Outlet />
        </main>

        {/* Queue Sidebar */}
        <aside
          className={cn(
            'w-80 border-l bg-muted/30 transition-all duration-200',
            isSidebarOpen ? 'translate-x-0' : 'translate-x-full w-0 border-0'
          )}
        >
          {isSidebarOpen && <QueueSidebar />}
        </aside>
      </div>

      {/* Transport Bar (Fixed Bottom) */}
      <TransportBar />
    </div>
  );
}
