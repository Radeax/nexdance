import type { Track } from '@/types';
import { getDB, STORES } from './db';

export async function getAllTracks(): Promise<Track[]> {
  const db = await getDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORES.tracks, 'readonly');
    const request = tx.objectStore(STORES.tracks).getAll();
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export async function getTrack(id: string): Promise<Track | undefined> {
  const db = await getDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORES.tracks, 'readonly');
    const request = tx.objectStore(STORES.tracks).get(id);
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export async function getTracksByDanceStyle(styleId: string): Promise<Track[]> {
  const db = await getDB();
  const tx = db.transaction(STORES.tracks, 'readonly');
  const store = tx.objectStore(STORES.tracks);

  // Get tracks where this is primary
  const primaryIndex = store.index('primaryDanceStyleId');
  const primaryTracks = await new Promise<Track[]>((resolve, reject) => {
    const request = primaryIndex.getAll(styleId);
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });

  // Get tracks where this is alternate
  const altIndex = store.index('alternateDanceStyleIds');
  const altTracks = await new Promise<Track[]>((resolve, reject) => {
    const request = altIndex.getAll(styleId);
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });

  // Deduplicate
  const seenIds = new Set<string>();
  const result: Track[] = [];
  for (const track of [...primaryTracks, ...altTracks]) {
    if (!seenIds.has(track.id)) {
      seenIds.add(track.id);
      result.push(track);
    }
  }

  return result;
}

export async function saveTrack(track: Track): Promise<void> {
  const db = await getDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORES.tracks, 'readwrite');
    tx.objectStore(STORES.tracks).put(track);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

export async function saveTracks(tracks: Track[]): Promise<void> {
  const db = await getDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORES.tracks, 'readwrite');
    const store = tx.objectStore(STORES.tracks);
    for (const track of tracks) {
      store.put(track);
    }
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

export async function deleteTrack(id: string): Promise<void> {
  const db = await getDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORES.tracks, 'readwrite');
    tx.objectStore(STORES.tracks).delete(id);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

export async function updateTrackPlayCount(id: string): Promise<void> {
  const track = await getTrack(id);
  if (track) {
    track.playCount += 1;
    track.lastPlayed = new Date();
    await saveTrack(track);
  }
}
