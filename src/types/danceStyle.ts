import { PrimaryCategory, DanceFamily } from './taxonomy';
import type { TimeSignature, TempoRange } from './taxonomy';

export interface DanceStyle {
  id: string;
  name: string;
  variant?: string;
  parentStyleId?: string;

  primaryCategory: PrimaryCategory;
  families: DanceFamily[];

  timeSignature: TimeSignature;
  tempoRange: TempoRange;

  color?: string;

  isSystemStyle: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Display helper: "Bachata (Sensual)" or just "Bachata"
export function formatDanceStyleName(style: DanceStyle): string {
  return style.variant ? `${style.name} (${style.variant})` : style.name;
}
