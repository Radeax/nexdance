import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useUIStore } from '@/stores/uiStore';
import { useLibraryStore } from '@/stores/libraryStore';
import { DEFAULT_NAVIGATION_GROUPS } from '@/data/navigationGroups';
import { DANCE_STYLE_MAP } from '@/data/danceStyles';
import { getDanceColor } from '@/data/danceColors';
import { cn } from '@/lib/utils';

export function SetDanceStyleModal() {
  const activeModal = useUIStore((state) => state.activeModal);
  const modalData = useUIStore((state) => state.modalData);
  const closeModal = useUIStore((state) => state.closeModal);
  const showToast = useUIStore((state) => state.showToast);

  const tracksById = useLibraryStore((state) => state.tracksById);
  const updateTrack = useLibraryStore((state) => state.updateTrack);

  const [activeTab, setActiveTab] = useState(DEFAULT_NAVIGATION_GROUPS[0].id);

  const isOpen = activeModal === 'setDanceStyle';
  const trackId = modalData?.trackId as string | undefined;
  const track = trackId ? tracksById.get(trackId) : undefined;

  const handleSelectStyle = async (styleId: string) => {
    if (!track) return;

    try {
      await updateTrack({ ...track, primaryDanceStyleId: styleId });
      const styleName = DANCE_STYLE_MAP.get(styleId)?.name || styleId;
      showToast(`Dance style set to "${styleName}"`, 'success');
      closeModal();
    } catch (error) {
      console.error('Failed to update dance style:', error);
      showToast('Failed to update dance style', 'error');
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && closeModal()}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Set Dance Style</DialogTitle>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <ScrollArea className="w-full">
            <TabsList className="w-full flex-wrap h-auto gap-1 bg-transparent p-0">
              {DEFAULT_NAVIGATION_GROUPS.map((group) => (
                <TabsTrigger
                  key={group.id}
                  value={group.id}
                  className="text-xs px-2 py-1 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                >
                  {group.name}
                </TabsTrigger>
              ))}
            </TabsList>
          </ScrollArea>

          {DEFAULT_NAVIGATION_GROUPS.map((group) => (
            <TabsContent key={group.id} value={group.id} className="mt-4">
              <div className="grid grid-cols-2 gap-2">
                {group.danceStyleIds.map((styleId) => {
                  const style = DANCE_STYLE_MAP.get(styleId);
                  if (!style) return null;

                  const isSelected = track?.primaryDanceStyleId === styleId;
                  const color = getDanceColor(styleId);

                  return (
                    <Button
                      key={styleId}
                      variant="outline"
                      className={cn(
                        'justify-start h-auto py-2 px-3',
                        isSelected && 'ring-2 ring-primary bg-primary/10'
                      )}
                      onClick={() => handleSelectStyle(styleId)}
                    >
                      <span
                        className="w-3 h-3 rounded-full shrink-0 mr-2"
                        style={{ backgroundColor: color }}
                      />
                      <span className="text-sm">{style.name}</span>
                    </Button>
                  );
                })}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
