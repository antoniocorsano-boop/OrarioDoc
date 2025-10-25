// main.js - init app and wire UI with storage and grid and settings
(function(){
  function uid(){ return 'id-'+Math.random().toString(36).slice(2,9); }

  function showPanel(){
    document.getElementById('panel').classList.remove('hidden');
    document.getElementById('panel').setAttribute('aria-hidden','false');
  }
  function hidePanel(){
    document.getElementById('panel').classList.add('hidden');
    document.getElementById('panel').setAttribute('aria-hidden','true');
  }

  function load(){
    const data = Storage.read();
    return data;
  }
  function save(data){ Storage.write(data); }

  function openAdd(day){
    document.getElementById('inputDay').value = typeof day === 'number' ? String(day) : '1';
    showPanel();
  }

  function init(){
    console.log('OrarioDoc init');
    const gridEl = document.getElementById('scheduleGrid');
    ScheduleGrid.createGrid(gridEl);

    const state = load();
    ScheduleGrid.renderLessons(gridEl, state.lessons || []);

    const addBtn = document.getElementById('addBtn');
    const settingsBtn = document.getElementById('settingsBtn');
    const saveBtn = document.getElementById('saveBtn');
    const cancelBtn = document.getElementById('cancelBtn');

    if(addBtn) addBtn.addEventListener('click', ()=>openAdd());
    if(settingsBtn) settingsBtn.addEventListener('click', ()=>{
      const s = AppSettings.loadSettings();
      alert('Impostazioni (placeholder)\nClasse default: '+(s.defaultClass||'---'));
    });
    if(cancelBtn) cancelBtn.addEventListener('click', ()=>hidePanel());

    if(saveBtn) saveBtn.addEventListener('click', ()=>{
      const name = document.getElementById('inputName').value.trim();
      const day = parseInt(document.getElementById('inputDay').value,10);
      const start = document.getElementById('inputTime').value || '08:00';
      const duration = parseInt(document.getElementById('inputDuration').value,10) || 60;
      if(!name){ alert('Inserisci il nome della lezione'); return; }

      const data = load();
      data.lessons = data.lessons || [];
      data.lessons.push({ id: uid(), name, class: document.getElementById('inputClass').value, day, start, duration });
      save(data);
      ScheduleGrid.renderLessons(gridEl, data.lessons);
      hidePanel();
    });

    // grid cell click opens add panel
    window.addEventListener('schedule-cell-click', (e)=> openAdd(e.detail.day));
    // lesson click (placeholder)
    window.addEventListener('lesson-click', (e)=> alert('Apri modifica lezione id: '+e.detail.id));
  }

  if(document.readyState === 'loading'){
    document.addEventListener('DOMContentLoaded', init, {once:true});
  }else init();
})();
