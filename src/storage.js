// storage.js - minimal storage layer (localStorage fallback)
// Key used: orariodoc:v1
const Storage = (function(){
  const KEY = 'orariodoc:v1';
  function read(){
    try{
      const raw = localStorage.getItem(KEY);
      return raw ? JSON.parse(raw) : { lessons: [], settings: {} };
    }catch(e){ console.error(e); return { lessons: [], settings: {} }; }
  }
  function write(data){
    try{ localStorage.setItem(KEY, JSON.stringify(data)); }catch(e){ console.error(e); }
  }
  return { read, write };
})();
