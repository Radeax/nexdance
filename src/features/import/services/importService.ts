import { v4 as uuidv4 } from 'uuid';
import type { Track } from '@/types/track';
import { DEFAULT_TRACK_VALUES } from '@/types/track';
import type { PendingImport } from '../types';
import { saveTrackAudioBlob } from '@/services/storage/trackStorage';

export async function createTrackFromImport(
  item: PendingImport
): Promise<Track> {
  if (!item.metadata || !item.selectedDanceStyleId) {
    throw new Error('Missing metadata or dance style');
  }

  const trackId = uuidv4();

  // Store the audio blob
  await saveTrackAudioBlob(trackId, item.file);

  // Get default BPM from dance style if not detected
  const bpm = item.metadata.bpm || 120;

  const track: Track = {
    id: trackId,
    title: item.metadata.title,
    artist: item.metadata.artist,
    album: item.metadata.album ?? undefined,
    duration: item.metadata.duration,
    bpm,
    bpmSource: item.metadata.bpm ? 'id3' : 'manual',

    primaryDanceStyleId: item.selectedDanceStyleId,
    alternateDanceStyleIds: [],

    audioStorageKey: trackId,
    fileSize: item.file.size,
    mimeType: item.file.type,

    // Playback customization defaults
    startTime: DEFAULT_TRACK_VALUES.startTime,
    fadeInDuration: DEFAULT_TRACK_VALUES.fadeInDuration,
    fadeOutDuration: DEFAULT_TRACK_VALUES.fadeOutDuration,
    startDelay: DEFAULT_TRACK_VALUES.startDelay,
    pauseAfter: DEFAULT_TRACK_VALUES.pauseAfter,

    // Metadata
    dateAdded: new Date(),
    playCount: DEFAULT_TRACK_VALUES.playCount,
  };

  return track;
}
