import { getAudioEngine } from './audioEngine';

/**
 * Load audio from a Blob (e.g., from IndexedDB)
 */
export async function loadAudioFromBlob(blob: Blob): Promise<void> {
  const audioEngine = getAudioEngine();
  await audioEngine.loadFromBlob(blob);
}

/**
 * Load audio from an ArrayBuffer
 */
export async function loadAudioFromArrayBuffer(buffer: ArrayBuffer): Promise<void> {
  const audioEngine = getAudioEngine();
  await audioEngine.loadFromArrayBuffer(buffer);
}

/**
 * Load audio from a File object (e.g., from file input or drag-drop)
 */
export async function loadAudioFromFile(file: File): Promise<void> {
  const audioEngine = getAudioEngine();
  const blob = new Blob([await file.arrayBuffer()], { type: file.type });
  await audioEngine.loadFromBlob(blob);
}

/**
 * Load audio from a URL (for testing/development)
 */
export async function loadAudioFromUrl(url: string): Promise<void> {
  const response = await fetch(url);
  const arrayBuffer = await response.arrayBuffer();
  const audioEngine = getAudioEngine();
  await audioEngine.loadFromArrayBuffer(arrayBuffer);
}

/**
 * Check if audio format is supported
 */
export function isAudioFormatSupported(mimeType: string): boolean {
  const supportedTypes = [
    'audio/mpeg', // MP3
    'audio/mp4', // M4A, AAC
    'audio/x-m4a', // M4A alternate
    'audio/wav', // WAV
    'audio/wave', // WAV alternate
    'audio/x-wav', // WAV alternate
    'audio/ogg', // OGG
    'audio/webm', // WebM
    'audio/flac', // FLAC
  ];

  return supportedTypes.includes(mimeType.toLowerCase());
}

/**
 * Get audio duration without fully loading (using AudioContext)
 */
export async function getAudioDuration(blob: Blob): Promise<number> {
  const audioContext = new AudioContext();
  const arrayBuffer = await blob.arrayBuffer();
  const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
  await audioContext.close();
  return audioBuffer.duration;
}
