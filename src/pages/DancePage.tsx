import { DanceStyleTabs } from '@/features/library/components/DanceStyleTabs';

export function DancePage() {
  return (
    <div className="flex h-full flex-col">
      {/* Dance Style Navigation - Category tabs and style cards only */}
      <DanceStyleTabs />
    </div>
  );
}
