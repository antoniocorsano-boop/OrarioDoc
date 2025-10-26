// main.js - init app and wire UI with storage and grid and settings
(function(){
  function uid(){ return 'id-'+Math.random().toString(36).slice(2,9); }
  
  let previousFocusElement = null;

  function announce(message){
    const announcer = document.getElementById('announcements');
    if(announcer){
      announcer.textContent = message;
      // Clear dopo 3 secondi per evitare annunci ripetuti
      setTimeout(()=>{ announcer.textContent = ''; }, 3000);
    }
  }

  function showPanel(){
    const panel = document.getElementById('panel');
    previousFocusElement = document.activeElement;
    
    panel.classList.remove('hidden');
    panel.setAttribute('aria-hidden','false');
    
    // Focus sul primo input del form
    const firstInput = panel.querySelector('input');
    if(firstInput) {
      setTimeout(()=> firstInput.focus(), 100);
    }
    
    // Trap focus nel panel
    trapFocus(panel);
  }
  
  function hidePanel(){
    const panel = document.getElementById('panel');
    panel.classList.add('hidden');
    panel.setAttribute('aria-hidden','true');
    
    // Ripristina focus all'elemento precedente
    if(previousFocusElement && previousFocusElement.focus){
      previousFocusElement.focus();
    }
    previousFocusElement = null;
  }
  
  function trapFocus(element){
    const focusableElements = element.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const firstFocusable = focusableElements[0];
    const lastFocusable = focusableElements[focusableElements.length - 1];
    
    function handleKeyDown(e){
      if(e.key !== 'Tab') return;
      
      if(e.shiftKey){
        if(document.activeElement === firstFocusable){
          e.preventDefault();
          lastFocusable.focus();
        }
      } else {
        if(document.activeElement === lastFocusable){
          e.preventDefault();
          firstFocusable.focus();
        }
      }
    }
    
    element.addEventListener('keydown', handleKeyDown);
  }

  async function load(){
    const data = await Storage.read();
    return data;
  }
  async function save(data){ await Storage.write(data); }

  function openAdd(day){
    document.getElementById('inputDay').value = typeof day === 'number' ? String(day) : '1';
    showPanel();
  }

  async function init(){
    console.log('OrarioDoc init');
    const gridEl = document.getElementById('scheduleGrid');
    ScheduleGrid.createGrid(gridEl);

    const state = await load();
    ScheduleGrid.renderLessons(gridEl, state.lessons || []);

    const addBtn = document.getElementById('addBtn');
    const settingsBtn = document.getElementById('settingsBtn');
    const saveBtn = document.getElementById('saveBtn');
    const cancelBtn = document.getElementById('cancelBtn');

    if(addBtn) addBtn.addEventListener('click', ()=>openAdd());
    if(settingsBtn) settingsBtn.addEventListener('click', async ()=>{
      const s = await AppSettings.loadSettings();
      alert('Impostazioni (placeholder)\nClasse default: '+(s.defaultClass||'---'));
    });
    
    if(cancelBtn) {
      cancelBtn.addEventListener('click', ()=>{
        hidePanel();
        announce('Aggiunta lezione annullata');
      });
    }

    if(saveBtn) saveBtn.addEventListener('click', async ()=>{
      const name = document.getElementById('inputName').value.trim();
      const day = parseInt(document.getElementById('inputDay').value,10);
      const start = document.getElementById('inputTime').value || '08:00';
      const duration = parseInt(document.getElementById('inputDuration').value,10) || 60;
      if(!name){ 
        alert('Inserisci il nome della lezione');
        document.getElementById('inputName').focus();
        return;
      }

      const data = await load();
      data.lessons = data.lessons || [];
      data.lessons.push({ id: uid(), name, class: document.getElementById('inputClass').value, day, start, duration });
      await save(data);
      ScheduleGrid.renderLessons(gridEl, data.lessons);
      hidePanel();
      announce(`Lezione ${name} aggiunta con successo`);
      
      // Reset form
      document.getElementById('inputName').value = '';
      document.getElementById('inputClass').value = '';
    });
    
    // Escape key chiude il panel
    document.addEventListener('keydown', (e)=>{
      if(e.key === 'Escape'){
        const panel = document.getElementById('panel');
        if(panel && !panel.classList.contains('hidden')){
          hidePanel();
          announce('Pannello chiuso');
        }
      }
    });

    // grid cell click opens add panel
    window.addEventListener('schedule-cell-click', (e)=> {
      openAdd(e.detail.day);
      const days = ['Domenica','Lunedì','Martedì','Mercoledì','Giovedì','Venerdì','Sabato'];
      announce(`Aggiungi lezione per ${days[e.detail.day]}`);
    });
    
    // lesson click (placeholder)
    window.addEventListener('lesson-click', (e)=> {
      alert('Apri modifica lezione id: '+e.detail.id);
    });
  }

  if(document.readyState === 'loading'){
    document.addEventListener('DOMContentLoaded', init, {once:true});
  }else init();
})();
