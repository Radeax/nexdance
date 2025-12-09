import { useEffect } from 'react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useUIStore } from '@/stores/uiStore';
import { DanceStyleGrid } from './DanceStyleGrid';
import { DEFAULT_NAVIGATION_GROUPS } from '@/data/navigationGroups';

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
    <div className="border-b">
      <Tabs
        value={activeGroupId ?? undefined}
        onValueChange={setActiveGroup}
        className="w-full"
      >
        <TabsList className="w-full justify-start h-12 rounded-none bg-transparent border-b px-4 gap-1">
          {DEFAULT_NAVIGATION_GROUPS.map((group) => (
            <TabsTrigger
              key={group.id}
              value={group.id}
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-md px-3 py-1.5"
            >
              {group.name}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      {/* Dance Style Grid for selected category */}
      {activeGroup && <DanceStyleGrid danceStyleIds={activeGroup.danceStyleIds} />}
    </div>
  );
}
