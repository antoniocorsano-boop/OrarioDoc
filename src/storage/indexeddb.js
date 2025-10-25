// indexeddb.js - IndexedDB wrapper with localStorage migration
// Provides async read()/write() API for storing app data
(function() {
  const DB_NAME = 'OrarioDocDB';
  const DB_VERSION = 1;
  const STORE_NAME = 'appData';
  const DATA_KEY = 'orariodoc:v1';
  const MIGRATION_FLAG_KEY = 'migrated_from_localStorage';

  let dbInstance = null;
  let initPromise = null;

  // Initialize IndexedDB connection
  function initDB() {
    if (initPromise) return initPromise;
    
    initPromise = new Promise((resolve, reject) => {
      if (!window.indexedDB) {
        reject(new Error('IndexedDB not supported'));
        return;
      }

      const request = indexedDB.open(DB_NAME, DB_VERSION);

      request.onerror = () => {
        console.error('IndexedDB open error:', request.error);
        reject(request.error);
      };

      request.onsuccess = () => {
        dbInstance = request.result;
        resolve(dbInstance);
      };

      request.onupgradeneeded = (event) => {
        const db = event.target.result;
        
        // Create object store if it doesn't exist
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          db.createObjectStore(STORE_NAME);
        }
      };
    });

    return initPromise;
  }

  // Migrate data from localStorage to IndexedDB if not already done
  async function migrateFromLocalStorage() {
    try {
      const db = await initDB();
      
      // Check if migration already done
      const alreadyMigrated = await new Promise((resolve, reject) => {
        const transaction = db.transaction([STORE_NAME], 'readonly');
        const store = transaction.objectStore(STORE_NAME);
        const request = store.get(MIGRATION_FLAG_KEY);
        
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
      });

      if (alreadyMigrated) {
        return; // Migration already done
      }

      // Get data from localStorage
      const localStorageData = localStorage.getItem(DATA_KEY);
      
      if (localStorageData) {
        try {
          const data = JSON.parse(localStorageData);
          
          // Write to IndexedDB
          await new Promise((resolve, reject) => {
            const transaction = db.transaction([STORE_NAME], 'readwrite');
            const store = transaction.objectStore(STORE_NAME);
            
            // Store the migrated data
            store.put(data, DATA_KEY);
            
            // Set migration flag
            store.put(true, MIGRATION_FLAG_KEY);
            
            transaction.oncomplete = () => {
              console.log('Data migrated from localStorage to IndexedDB');
              resolve();
            };
            transaction.onerror = () => reject(transaction.error);
          });
        } catch (parseError) {
          console.error('Error parsing localStorage data:', parseError);
        }
      } else {
        // No data in localStorage, just set migration flag
        await new Promise((resolve, reject) => {
          const transaction = db.transaction([STORE_NAME], 'readwrite');
          const store = transaction.objectStore(STORE_NAME);
          store.put(true, MIGRATION_FLAG_KEY);
          
          transaction.oncomplete = () => resolve();
          transaction.onerror = () => reject(transaction.error);
        });
      }
    } catch (error) {
      console.error('Migration error:', error);
      throw error;
    }
  }

  // Read data from IndexedDB
  async function read() {
    try {
      const db = await initDB();
      await migrateFromLocalStorage();
      
      return new Promise((resolve, reject) => {
        const transaction = db.transaction([STORE_NAME], 'readonly');
        const store = transaction.objectStore(STORE_NAME);
        const request = store.get(DATA_KEY);
        
        request.onsuccess = () => {
          const data = request.result;
          // Return default structure if no data found
          resolve(data || { lessons: [], settings: {} });
        };
        
        request.onerror = () => {
          console.error('Read error:', request.error);
          reject(request.error);
        };
      });
    } catch (error) {
      console.error('Read operation failed:', error);
      // Fallback to default data
      return { lessons: [], settings: {} };
    }
  }

  // Write data to IndexedDB
  async function write(data) {
    try {
      const db = await initDB();
      
      return new Promise((resolve, reject) => {
        const transaction = db.transaction([STORE_NAME], 'readwrite');
        const store = transaction.objectStore(STORE_NAME);
        const request = store.put(data, DATA_KEY);
        
        request.onsuccess = () => resolve();
        request.onerror = () => {
          console.error('Write error:', request.error);
          reject(request.error);
        };
      });
    } catch (error) {
      console.error('Write operation failed:', error);
      throw error;
    }
  }

  // Export the API
  window.IndexedDBStorage = {
    read,
    write,
    initDB,
    migrateFromLocalStorage
  };
})();
