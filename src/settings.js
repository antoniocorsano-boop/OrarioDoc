// settings.js - minimal settings panel wiring
(function(){
  async function loadSettings(){
    const data = await Storage.read();
    return data.settings || {};
  }
  async function saveSettings(s){
    const data = await Storage.read();
    data.settings = Object.assign({}, data.settings || {}, s);
    await Storage.write(data);
  }
  window.AppSettings = { loadSettings, saveSettings };
})();
