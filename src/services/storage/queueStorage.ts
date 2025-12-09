import { EMPTY_QUEUE_STATE } from '@/types';
import type { PersistedQueueState } from '@/types';
import { getDB, STORES } from './db';

export async function getQueueState(): Promise<PersistedQueueState> {
  const db = await getDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORES.queue, 'readonly');
    const request = tx.objectStore(STORES.queue).get('current');
    request.onsuccess = () => resolve(request.result ?? EMPTY_QUEUE_STATE);
    request.onerror = () => reject(request.error);
  });
}

export async function saveQueueState(state: PersistedQueueState): Promise<void> {
  const db = await getDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORES.queue, 'readwrite');
    tx.objectStore(STORES.queue).put({ ...state, savedAt: new Date() }, 'current');
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}
