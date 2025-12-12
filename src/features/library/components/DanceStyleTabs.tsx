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
    <div className="flex flex-col h-full">
      {/* Category Tabs - Pill Style */}
      <div className="flex items-center gap-2 px-4 py-4 border-b border-border/50">
        {DEFAULT_NAVIGATION_GROUPS.map((group) => (
          <button
            key={group.id}
            onClick={() => setActiveGroup(group.id)}
            className={cn(
              'px-5 py-2 rounded-full text-sm font-semibold transition-all duration-200',
              activeGroupId === group.id
                ? 'text-white shadow-lg'
                : 'bg-white/80 dark:bg-white/5 text-gray-600 dark:text-gray-300 border border-border hover:bg-white dark:hover:bg-white/10 hover:shadow-md'
            )}
            style={activeGroupId === group.id ? {
              background: 'var(--color-tab-active)',
              boxShadow: '0 4px 12px var(--color-tab-shadow)'
            } : undefined}
          >
            {group.name}
          </button>
        ))}
      </div>

      {/* Dance Style Grid for selected category */}
      <div className="flex-1 overflow-auto">
        {activeGroup && <DanceStyleGrid danceStyleIds={activeGroup.danceStyleIds} />}
      </div>
    </div>
  );
}
