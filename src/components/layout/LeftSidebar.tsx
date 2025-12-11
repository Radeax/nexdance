import { NavLink } from 'react-router';
import { Disc3, Library, ListMusic, Settings } from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { to: '/dance', icon: Disc3, label: 'Dance', color: 'text-orange-500' },
  { to: '/library', icon: Library, label: 'Library', color: 'text-blue-500' },
  { to: '/playlists', icon: ListMusic, label: 'Playlists', color: 'text-purple-500' },
  { to: '/settings', icon: Settings, label: 'Settings', color: 'text-slate-500' },
];

export function LeftSidebar() {
  return (
    <aside className="w-44 border-r bg-muted/30 p-3 flex flex-col gap-1">
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
