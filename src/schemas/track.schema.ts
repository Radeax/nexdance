import { z } from 'zod';

export const trackSchema = z.object({
  id: z.string().uuid(),
  title: z.string().min(1).max(200),
  artist: z.string().min(1).max(200),
  album: z.string().max(200).optional(),
  duration: z.number().positive(),
  bpm: z.number().min(20).max(300).optional(),

  primaryDanceStyleId: z.string().min(1),
  alternateDanceStyleIds: z.array(z.string()).max(5).default([]),

  audioStorageKey: z.string().min(1),
  fileSize: z.number().positive(),
  mimeType: z.string().regex(/^audio\//),

  startTime: z.number().min(0).default(0),
  endTime: z.number().positive().optional(),
  fadeInDuration: z.number().min(0).max(30).default(0),
  fadeOutDuration: z.number().min(0).max(30).default(5),
  startDelay: z.number().min(0).max(60).default(0),
  pauseAfter: z.boolean().default(false),

  dateAdded: z.coerce.date(),
  lastPlayed: z.coerce.date().optional(),
  playCount: z.number().int().min(0).default(0),

  waveformPeaks: z.instanceof(ArrayBuffer).optional(),
  bpmSource: z.enum(['id3', 'detected', 'manual']).optional(),
  bpmConfidence: z.number().min(0).max(1).optional(),
});

export type TrackInput = z.input<typeof trackSchema>;
export type TrackOutput = z.output<typeof trackSchema>;
