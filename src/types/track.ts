export type BpmSource = 'id3' | 'detected' | 'manual';

export interface Track {
  id: string;
  title: string;
  artist: string;
  album?: string;
  duration: number;
  bpm?: number;

  // Dance tagging
  primaryDanceStyleId: string;
  alternateDanceStyleIds: string[];

  // Audio storage
  audioStorageKey: string; // Key in OPFS or reference handle ID
  fileSize: number;
  mimeType: string;

  // Playback customization
  startTime: number;
  endTime?: number;
  fadeInDuration: number;
  fadeOutDuration: number;
  startDelay: number;
  pauseAfter: boolean;

  // Metadata
  dateAdded: Date;
  lastPlayed?: Date;
  playCount: number;

  // Audio analysis (computed on import)
  waveformPeaks?: ArrayBuffer;
  bpmSource?: BpmSource;
  bpmConfidence?: number;
}

export const DEFAULT_TRACK_VALUES = {
  startTime: 0,
  fadeInDuration: 0,
  fadeOutDuration: 5,
  startDelay: 0,
  pauseAfter: false,
  playCount: 0,
  alternateDanceStyleIds: [],
} as const;
