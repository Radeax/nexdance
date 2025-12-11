import { z } from 'zod';

export const globalSettingsSchema = z.object({
  volume: z.number().min(0).max(1).default(1),
  tempo: z.number().min(0.5).max(2).default(1),
  normalizeVolume: z.boolean().default(false),
  gapDuration: z.number().min(0).max(30).default(0),
  autoplay: z.boolean().default(true),
  outputDeviceId: z.string().optional(),
  theme: z.enum(['auto', 'light', 'dark']).default('auto'),
  activeTabProfileId: z.string().optional(),
});

export type GlobalSettingsInput = z.input<typeof globalSettingsSchema>;
export type GlobalSettingsOutput = z.output<typeof globalSettingsSchema>;
