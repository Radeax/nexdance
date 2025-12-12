import { HelpCircle } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface PanelCardProps {
  title: string;
  tooltip?: string;
  children: React.ReactNode;
}

export function PanelCard({ title, tooltip, children }: PanelCardProps) {
  return (
    <div className="bg-white/90 dark:bg-white/5 rounded-xl border border-border p-4 backdrop-blur-sm">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold text-sm">{title}</h3>
        {tooltip && (
          <Tooltip>
            <TooltipTrigger>
              <HelpCircle className="h-4 w-4 text-muted-foreground" />
            </TooltipTrigger>
            <TooltipContent>
              <p className="max-w-xs">{tooltip}</p>
            </TooltipContent>
          </Tooltip>
        )}
      </div>
      {children}
    </div>
  );
}
