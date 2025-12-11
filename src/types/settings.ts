export type Theme = 'auto' | 'light' | 'dark';

export interface GlobalSettings {
  volume: number;
  tempo: number;
  normalizeVolume: boolean;
  gapDuration: number;
  autoplay: boolean;
  outputDeviceId?: string;
  theme: Theme;
  activeTabProfileId?: string;
}

export const DEFAULT_SETTINGS: GlobalSettings = {
  volume: 1,
  tempo: 1,
  normalizeVolume: false,
  gapDuration: 0,
  autoplay: true,
  theme: 'auto',
};
