import type { DanceStyle, PrimaryCategory, DanceFamily } from '@/types';
import { getDB, STORES } from './db';

export async function getAllDanceStyles(): Promise<DanceStyle[]> {
  const db = await getDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORES.danceStyles, 'readonly');
    const request = tx.objectStore(STORES.danceStyles).getAll();
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export async function getDanceStyle(id: string): Promise<DanceStyle | undefined> {
  const db = await getDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORES.danceStyles, 'readonly');
    const request = tx.objectStore(STORES.danceStyles).get(id);
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export async function getDanceStylesByCategory(category: PrimaryCategory): Promise<DanceStyle[]> {
  const db = await getDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORES.danceStyles, 'readonly');
    const index = tx.objectStore(STORES.danceStyles).index('primaryCategory');
    const request = index.getAll(category);
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export async function getDanceStylesByFamily(family: DanceFamily): Promise<DanceStyle[]> {
  const db = await getDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORES.danceStyles, 'readonly');
    const index = tx.objectStore(STORES.danceStyles).index('families');
    const request = index.getAll(family);
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export async function getChildStyles(parentId: string): Promise<DanceStyle[]> {
  const db = await getDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORES.danceStyles, 'readonly');
    const index = tx.objectStore(STORES.danceStyles).index('parentStyleId');
    const request = index.getAll(parentId);
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export async function saveDanceStyle(style: DanceStyle): Promise<void> {
  const db = await getDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORES.danceStyles, 'readwrite');
    tx.objectStore(STORES.danceStyles).put(style);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}
