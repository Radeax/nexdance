import { NavLink } from 'react-router';
import { Disc3, Library, ListMusic, Settings } from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { to: '/dance', icon: Disc3, label: 'Dance', color: 'text-amber-500' },
  { to: '/library', icon: Library, label: 'Library', color: 'text-blue-400' },
  { to: '/playlists', icon: ListMusic, label: 'Playlists', color: 'text-purple-400' },
  { to: '/settings', icon: Settings, label: 'Settings', color: 'text-teal-400' },
];

export function LeftSidebar() {
  return (
    <aside
      className="w-44 border-r p-3 flex flex-col gap-1 backdrop-blur-sm"
      style={{ background: 'var(--color-bg-panel)' }}
    >
      {navItems.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          className={({ isActive }) =>
            cn(
              'flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
              isActive
                ? 'bg-primary/10 text-primary'
                : 'hover:bg-muted text-muted-foreground hover:text-foreground'
            )
          }
        >
          {({ isActive }) => (
            <>
              <item.icon
                className={cn('h-5 w-5', isActive ? 'text-primary' : item.color)}
              />
              <span>{item.label}</span>
            </>
          )}
        </NavLink>
      ))}
    </aside>
  );
}
