// settings.js - minimal settings panel wiring
(function(){
  function loadSettings(){
    const data = Storage.read();
    return data.settings || {};
  }
  function saveSettings(s){
    const data = Storage.read();
    data.settings = Object.assign({}, data.settings || {}, s);
    Storage.write(data);
  }
  window.AppSettings = { loadSettings, saveSettings };
})();
