
const DB_NAME = 'ScreeningToolDB';
const DB_VERSION = 1;

export const STORES = {
  CUSTOMERS: 'customers',
  RPLS: 'rpls',
  ZYME: 'zyme',
  GENERAL_COMMENTS: 'general_comments',
  APRV_COMMENTS: 'aprv_comments'
};

const openDB = (): Promise<IDBDatabase> => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      Object.values(STORES).forEach(storeName => {
        if (!db.objectStoreNames.contains(storeName)) {
          // We use a single key 'root' to store the array for simplicity in migration
          // For massive scalability in the future (millions), we could use indexes, 
          // but this Blob approach works perfectly for hundreds of thousands of records.
          db.createObjectStore(storeName); 
        }
      });
    };

    request.onsuccess = (event) => resolve((event.target as IDBOpenDBRequest).result);
    request.onerror = (event) => reject((event.target as IDBOpenDBRequest).error);
  });
};

export const dbService = {
  async get<T>(storeName: string): Promise<T | null> {
    try {
      const db = await openDB();
      return new Promise((resolve, reject) => {
        const transaction = db.transaction(storeName, 'readonly');
        const store = transaction.objectStore(storeName);
        const request = store.get('root'); 
        request.onsuccess = () => resolve(request.result as T);
        request.onerror = () => reject(request.error);
      });
    } catch (e) {
      console.error(`Error reading from ${storeName}`, e);
      return null;
    }
  },

  async set(storeName: string, data: any): Promise<void> {
    try {
      const db = await openDB();
      return new Promise((resolve, reject) => {
        const transaction = db.transaction(storeName, 'readwrite');
        const store = transaction.objectStore(storeName);
        const request = store.put(data, 'root');
        request.onsuccess = () => resolve();
        request.onerror = () => reject(request.error);
      });
    } catch (e) {
      console.error(`Error writing to ${storeName}`, e);
      throw e;
    }
  },
  
  async clear(): Promise<void> {
     try {
       const db = await openDB();
       const stores = Object.values(STORES);
       const transaction = db.transaction(stores, 'readwrite');
       stores.forEach(storeName => {
           transaction.objectStore(storeName).clear();
       });
       return new Promise((resolve) => {
           transaction.oncomplete = () => resolve();
       });
     } catch(e) {
         console.error("Error clearing DB", e);
     }
  }
};
