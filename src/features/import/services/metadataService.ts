import * as musicMetadata from 'music-metadata-browser';
import type { ExtractedMetadata } from '../types';

export async function extractMetadata(file: File): Promise<ExtractedMetadata> {
  try {
    const metadata = await musicMetadata.parseBlob(file);

    return {
      title:
        metadata.common.title || file.name.replace(/\.[^/.]+$/, '') || 'Unknown',
      artist: metadata.common.artist || 'Unknown Artist',
      album: metadata.common.album || null,
      bpm: metadata.common.bpm || null,
      duration: metadata.format.duration || 0,
    };
  } catch (error) {
    console.error('Metadata extraction failed:', error);

    // Fallback: use filename as title
    return {
      title: file.name.replace(/\.[^/.]+$/, '') || 'Unknown',
      artist: 'Unknown Artist',
      album: null,
      bpm: null,
      duration: 0,
    };
  }
}
