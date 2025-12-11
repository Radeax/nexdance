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
    <div className="border-b" style={{ background: 'var(--color-bg-panel)', backdropFilter: 'blur(8px)' }}>
      {/* Category Tabs - Pill Style */}
      <div className="flex items-center gap-2 px-4 py-3">
        {DEFAULT_NAVIGATION_GROUPS.map((group) => (
          <button
            key={group.id}
            onClick={() => setActiveGroup(group.id)}
            className={cn(
              'px-4 py-1.5 rounded-[10px] text-sm font-medium transition-all',
              activeGroupId === group.id
                ? 'text-white shadow-md border-transparent'
                : 'bg-white/60 text-gray-500 border border-gray-200 hover:bg-white/90 dark:bg-white/10 dark:text-gray-300 dark:border-gray-600'
            )}
            style={activeGroupId === group.id ? {
              background: 'linear-gradient(135deg, #7c3aed 0%, #6366f1 100%)',
              boxShadow: '0 2px 8px rgba(124, 58, 237, 0.3)'
            } : undefined}
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
