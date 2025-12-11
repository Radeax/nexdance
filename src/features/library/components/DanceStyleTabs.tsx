import { useEffect } from 'react';
import { useUIStore } from '@/stores/uiStore';
import { DanceStyleGrid } from './DanceStyleGrid';
import { DEFAULT_NAVIGATION_GROUPS } from '@/data/navigationGroups';
import { cn } from '@/lib/utils';

export function DanceStyleTabs() {
  const activeGroupId = useUIStore((state) => state.activeNavigationGroupId);
  const setActiveGroup = useUIStore((state) => state.setActiveNavigationGroup);

  // Set default tab on mount
  useEffect(() => {
    if (!activeGroupId && DEFAULT_NAVIGATION_GROUPS.length > 0) {
      setActiveGroup(DEFAULT_NAVIGATION_GROUPS[0].id);
    }
  }, [activeGroupId, setActiveGroup]);

  const activeGroup = DEFAULT_NAVIGATION_GROUPS.find(
    (g) => g.id === activeGroupId
  );

  return (
    <div className="border-b bg-background">
      {/* Category Tabs - Pill Style */}
      <div className="flex items-center gap-2 px-4 py-3">
        {DEFAULT_NAVIGATION_GROUPS.map((group) => (
          <button
            key={group.id}
            onClick={() => setActiveGroup(group.id)}
            className={cn(
              'px-4 py-1.5 rounded-full text-sm font-medium transition-colors',
              activeGroupId === group.id
                ? 'bg-blue-500 text-white'
                : 'bg-muted hover:bg-muted/80 text-muted-foreground hover:text-foreground'
            )}
          >
            {group.name}
          </button>
        ))}
      </div>

      {/* Dance Style Grid for selected category */}
      {activeGroup && <DanceStyleGrid danceStyleIds={activeGroup.danceStyleIds} />}
    </div>
  );
}
