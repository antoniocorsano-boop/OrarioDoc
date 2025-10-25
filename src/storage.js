// storage.js - storage layer with IndexedDB (localStorage fallback)
// Key used: orariodoc:v1
const Storage = (function(){
  const KEY = 'orariodoc:v1';
  
  // Check if IndexedDB is available and preferred
  const useIndexedDB = typeof window !== 'undefined' && 
                       window.indexedDB && 
                       window.IndexedDBStorage;
  
  // Async read function (returns Promise)
  async function read(){
    if (useIndexedDB) {
      try {
        return await window.IndexedDBStorage.read();
      } catch(e) {
        console.error('IndexedDB read error, falling back to localStorage:', e);
        return readFromLocalStorage();
      }
    }
    return readFromLocalStorage();
  }
  
  // Async write function (returns Promise)
  async function write(data){
    if (useIndexedDB) {
      try {
        await window.IndexedDBStorage.write(data);
        return;
      } catch(e) {
        console.error('IndexedDB write error, falling back to localStorage:', e);
        writeToLocalStorage(data);
      }
    }
    writeToLocalStorage(data);
  }
  
  // Synchronous localStorage fallback
  function readFromLocalStorage(){
    try{
      const raw = localStorage.getItem(KEY);
      return raw ? JSON.parse(raw) : { lessons: [], settings: {} };
    }catch(e){ 
      console.error('localStorage read error:', e); 
      return { lessons: [], settings: {} }; 
    }
  }
  
  function writeToLocalStorage(data){
    try{ 
      localStorage.setItem(KEY, JSON.stringify(data)); 
    }catch(e){ 
      console.error('localStorage write error:', e); 
    }
  }
  
  return { read, write };
})();
