import { DEFAULT_SETTINGS } from '@/types';
import type { GlobalSettings } from '@/types';
import { getDB, STORES } from './db';

export async function getSettings(): Promise<GlobalSettings> {
  const db = await getDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORES.settings, 'readonly');
    const request = tx.objectStore(STORES.settings).get('global');
    request.onsuccess = () => resolve(request.result ?? DEFAULT_SETTINGS);
    request.onerror = () => reject(request.error);
  });
}

export async function saveSettings(settings: GlobalSettings): Promise<void> {
  const db = await getDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORES.settings, 'readwrite');
    tx.objectStore(STORES.settings).put(settings, 'global');
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}
