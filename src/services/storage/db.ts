import { SYSTEM_DANCE_STYLES } from '@/data/danceStyles';
import { DEFAULT_NAVIGATION_GROUPS } from '@/data/navigationGroups';
import { DEFAULT_SETTINGS, EMPTY_QUEUE_STATE } from '@/types';
import type { GlobalSettings, PersistedQueueState } from '@/types';

const DB_NAME = 'nexdance';
const DB_VERSION = 3; // Bumped to ensure audioFiles store exists

export const STORES = {
  tracks: 'tracks',
  audioFiles: 'audioFiles',
  danceStyles: 'danceStyles',
  navigationGroups: 'navigationGroups',
  tabProfiles: 'tabProfiles',
  queue: 'queue',
  playlists: 'playlists',
  settings: 'settings',
} as const;

let dbInstance: IDBDatabase | null = null;

export async function getDB(): Promise<IDBDatabase> {
  // Check if cached instance has all required stores
  if (dbInstance) {
    const hasAllStores = Object.values(STORES).every((store) =>
      dbInstance!.objectStoreNames.contains(store)
    );
    if (hasAllStores) {
      return dbInstance;
    }
    // Close stale connection to force upgrade
    console.log('Database missing stores, forcing upgrade...');
    dbInstance.close();
    dbInstance = null;
  }

  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = () => reject(request.error);

    request.onsuccess = () => {
      dbInstance = request.result;
      resolve(dbInstance);
    };

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;

      // Tracks store with indexes
      if (!db.objectStoreNames.contains(STORES.tracks)) {
        const trackStore = db.createObjectStore(STORES.tracks, { keyPath: 'id' });
        trackStore.createIndex('primaryDanceStyleId', 'primaryDanceStyleId', { unique: false });
        trackStore.createIndex('alternateDanceStyleIds', 'alternateDanceStyleIds', {
          unique: false,
          multiEntry: true,
        });
        trackStore.createIndex('dateAdded', 'dateAdded', { unique: false });
        trackStore.createIndex('lastPlayed', 'lastPlayed', { unique: false });
      }

      // Audio files store (stores Blobs keyed by track ID)
      if (!db.objectStoreNames.contains(STORES.audioFiles)) {
        db.createObjectStore(STORES.audioFiles);
      }

      // Dance styles store with indexes
      if (!db.objectStoreNames.contains(STORES.danceStyles)) {
        const styleStore = db.createObjectStore(STORES.danceStyles, { keyPath: 'id' });
        styleStore.createIndex('primaryCategory', 'primaryCategory', { unique: false });
        styleStore.createIndex('families', 'families', { unique: false, multiEntry: true });
        styleStore.createIndex('parentStyleId', 'parentStyleId', { unique: false });
      }

      // Navigation groups store
      if (!db.objectStoreNames.contains(STORES.navigationGroups)) {
        const navStore = db.createObjectStore(STORES.navigationGroups, { keyPath: 'id' });
        navStore.createIndex('order', 'order', { unique: false });
      }

      // Tab profiles store
      if (!db.objectStoreNames.contains(STORES.tabProfiles)) {
        const tabStore = db.createObjectStore(STORES.tabProfiles, { keyPath: 'id' });
        tabStore.createIndex('isActive', 'isActive', { unique: false });
      }

      // Queue store (single record)
      if (!db.objectStoreNames.contains(STORES.queue)) {
        db.createObjectStore(STORES.queue);
      }

      // Playlists store
      if (!db.objectStoreNames.contains(STORES.playlists)) {
        const playlistStore = db.createObjectStore(STORES.playlists, { keyPath: 'id' });
        playlistStore.createIndex('name', 'name', { unique: false });
      }

      // Settings store (single record)
      if (!db.objectStoreNames.contains(STORES.settings)) {
        db.createObjectStore(STORES.settings);
      }
    };
  });
}

export async function initializeDB(): Promise<void> {
  const db = await getDB();

  // Seed dance styles if empty
  const styleCount = await countRecords(db, STORES.danceStyles);
  if (styleCount === 0) {
    const tx = db.transaction(STORES.danceStyles, 'readwrite');
    const store = tx.objectStore(STORES.danceStyles);
    for (const style of SYSTEM_DANCE_STYLES) {
      store.put(style);
    }
    await new Promise<void>((resolve, reject) => {
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
  }

  // Seed navigation groups if empty
  const navCount = await countRecords(db, STORES.navigationGroups);
  if (navCount === 0) {
    const tx = db.transaction(STORES.navigationGroups, 'readwrite');
    const store = tx.objectStore(STORES.navigationGroups);
    for (const group of DEFAULT_NAVIGATION_GROUPS) {
      store.put(group);
    }
    await new Promise<void>((resolve, reject) => {
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
  }

  // Initialize settings if not exists
  const settingsTx = db.transaction(STORES.settings, 'readwrite');
  const settingsStore = settingsTx.objectStore(STORES.settings);
  const existingSettings = await new Promise<GlobalSettings | undefined>((resolve) => {
    const req = settingsStore.get('global');
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => resolve(undefined);
  });
  if (!existingSettings) {
    settingsStore.put(DEFAULT_SETTINGS, 'global');
  }
  await new Promise<void>((resolve, reject) => {
    settingsTx.oncomplete = () => resolve();
    settingsTx.onerror = () => reject(settingsTx.error);
  });

  // Initialize queue if not exists
  const queueTx = db.transaction(STORES.queue, 'readwrite');
  const queueStore = queueTx.objectStore(STORES.queue);
  const existingQueue = await new Promise<PersistedQueueState | undefined>((resolve) => {
    const req = queueStore.get('current');
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => resolve(undefined);
  });
  if (!existingQueue) {
    queueStore.put(EMPTY_QUEUE_STATE, 'current');
  }
  await new Promise<void>((resolve, reject) => {
    queueTx.oncomplete = () => resolve();
    queueTx.onerror = () => reject(queueTx.error);
  });
}

async function countRecords(db: IDBDatabase, storeName: string): Promise<number> {
  return new Promise((resolve, reject) => {
    const tx = db.transaction(storeName, 'readonly');
    const request = tx.objectStore(storeName).count();
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}
