import { useState } from 'react';

export function StorageTest() {
  const [status, setStatus] = useState<string[]>([]);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);

  const log = (msg: string) => setStatus((prev) => [...prev, msg]);
  const clear = () => setStatus([]);

  // Test 1: File System Access API (Chrome/Edge only)
  const testFSA = async () => {
    clear();
    log('--- Testing File System Access API ---');

    if (!('showDirectoryPicker' in window)) {
      log('❌ showDirectoryPicker not available');
      log('(Expected on Safari/Firefox)');
      return;
    }

    try {
      log('Opening directory picker...');
      const dirHandle = await (window as any).showDirectoryPicker();
      log(`✅ Got directory: ${dirHandle.name}`);

      let audioHandle: FileSystemFileHandle | null = null;
      for await (const entry of dirHandle.values()) {
        if (
          entry.kind === 'file' &&
          /\.(mp3|m4a|wav)$/i.test(entry.name)
        ) {
          audioHandle = entry;
          log(`✅ Found audio: ${entry.name}`);
          break;
        }
      }

      if (!audioHandle) {
        log('⚠️ No audio files found');
        return;
      }

      log('Storing handle in IndexedDB...');
      const db = await openTestDB();
      const tx = db.transaction('handles', 'readwrite');
      tx.objectStore('handles').put(audioHandle, 'test');
      await new Promise((r) => (tx.oncomplete = r));
      log('✅ Handle stored');

      log('Retrieving handle...');
      const tx2 = db.transaction('handles', 'readonly');
      const req = tx2.objectStore('handles').get('test');
      const retrieved = await new Promise<any>(
        (r) => (req.onsuccess = () => r(req.result))
      );
      log('✅ Handle retrieved');

      log('Requesting permission...');
      const perm = await retrieved.requestPermission({ mode: 'read' });
      if (perm !== 'granted') {
        log('❌ Permission denied');
        return;
      }
      log('✅ Permission granted');

      const file = await retrieved.getFile();
      log(`✅ File: ${file.name} (${(file.size / 1024 / 1024).toFixed(2)} MB)`);

      setAudioUrl(URL.createObjectURL(file));
      log('✅ FSA API Test Complete!');
    } catch (err) {
      log(`❌ Error: ${err}`);
    }
  };

  // Test 2: OPFS (All browsers)
  const testOPFS = async () => {
    clear();
    log('--- Testing Origin Private File System ---');

    try {
      const opfsRoot = await navigator.storage.getDirectory();
      log('✅ Got OPFS root');

      const musicDir = await opfsRoot.getDirectoryHandle('music', {
        create: true,
      });
      log('✅ Created /music directory');

      log('Select an audio file...');
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = 'audio/*';

      input.onchange = async (e) => {
        const file = (e.target as HTMLInputElement).files?.[0];
        if (!file) return;

        const start = performance.now();
        log(`Writing ${file.name} (${(file.size / 1024 / 1024).toFixed(2)} MB)...`);

        const handle = await musicDir.getFileHandle('test.mp3', {
          create: true,
        });
        const writable = await handle.createWritable();
        await writable.write(file);
        await writable.close();

        log(`✅ Write: ${(performance.now() - start).toFixed(0)}ms`);

        const readStart = performance.now();
        const readFile = await (
          await musicDir.getFileHandle('test.mp3')
        ).getFile();
        log(`✅ Read: ${(performance.now() - readStart).toFixed(0)}ms`);

        setAudioUrl(URL.createObjectURL(readFile));
        log('✅ OPFS Test Complete!');
      };

      input.click();
    } catch (err) {
      log(`❌ Error: ${err}`);
    }
  };

  // Test 3: Quota
  const testQuota = async () => {
    clear();
    log('--- Testing Storage Quota ---');

    const est = await navigator.storage.estimate();
    log(`Used: ${((est.usage || 0) / 1024 / 1024).toFixed(2)} MB`);
    log(`Quota: ${((est.quota || 0) / 1024 / 1024 / 1024).toFixed(2)} GB`);
    log(
      `Available: ${(((est.quota || 0) - (est.usage || 0)) / 1024 / 1024 / 1024).toFixed(2)} GB`
    );

    if (navigator.storage.persist) {
      const persistent = await navigator.storage.persist();
      log(persistent ? '✅ Persistent storage granted' : '⚠️ Persistent denied');
    }
  };

  return (
    <div className="p-8 max-w-2xl mx-auto space-y-4">
      <h1 className="text-2xl font-bold">Storage Technology Validation</h1>

      <div className="flex gap-2 flex-wrap">
        <button
          onClick={testFSA}
          className="px-4 py-2 bg-blue-500 text-white rounded"
        >
          Test FSA API
        </button>
        <button
          onClick={testOPFS}
          className="px-4 py-2 bg-green-500 text-white rounded"
        >
          Test OPFS
        </button>
        <button
          onClick={testQuota}
          className="px-4 py-2 bg-purple-500 text-white rounded"
        >
          Check Quota
        </button>
      </div>

      {audioUrl && <audio controls src={audioUrl} className="w-full" />}

      <div className="bg-gray-900 text-green-400 p-4 rounded font-mono text-sm h-64 overflow-auto">
        {status.map((l, i) => (
          <div key={i}>{l}</div>
        ))}
        {status.length === 0 && <span className="text-gray-500">Click a test button...</span>}
      </div>
    </div>
  );
}

async function openTestDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open('nexdance-test', 1);
    req.onerror = () => reject(req.error);
    req.onsuccess = () => resolve(req.result);
    req.onupgradeneeded = () => req.result.createObjectStore('handles');
  });
}

export default StorageTest;
