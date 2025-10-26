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

  let editingLessonId = null;

  function openAdd(day){
    editingLessonId = null;
    document.getElementById('panelTitle').textContent = 'Nuova lezione';
    document.getElementById('inputName').value = '';
    document.getElementById('inputClass').value = '';
    document.getElementById('inputDay').value = typeof day === 'number' ? String(day) : '1';
    document.getElementById('inputTime').value = '08:00';
    document.getElementById('inputDuration').value = '60';
    
    // Show/hide delete button
    const deleteBtn = document.getElementById('deleteBtn');
    if(deleteBtn) deleteBtn.style.display = 'none';
    
    showPanel();
  }
  
  async function openEdit(lessonId){
    editingLessonId = lessonId;
    const data = await load();
    const lesson = data.lessons.find(l => l.id === lessonId);
    if(!lesson) {
      announce('Lezione non trovata');
      return;
    }
    
    document.getElementById('panelTitle').textContent = 'Modifica lezione';
    document.getElementById('inputName').value = lesson.name || '';
    document.getElementById('inputClass').value = lesson.class || '';
    document.getElementById('inputDay').value = String(lesson.day);
    document.getElementById('inputTime').value = lesson.start || '08:00';
    document.getElementById('inputDuration').value = String(lesson.duration || 60);
    
    // Show delete button
    const deleteBtn = document.getElementById('deleteBtn');
    if(deleteBtn) deleteBtn.style.display = '';
    
    showPanel();
    announce(`Modifica lezione ${lesson.name}`);
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
    const deleteBtn = document.getElementById('deleteBtn');

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
      
      if(editingLessonId){
        // Update existing lesson
        const index = data.lessons.findIndex(l => l.id === editingLessonId);
        if(index !== -1){
          data.lessons[index] = { 
            ...data.lessons[index],
            id: editingLessonId, 
            name, 
            class: document.getElementById('inputClass').value, 
            day, 
            start, 
            duration 
          };
          await save(data);
          ScheduleGrid.renderLessons(gridEl, data.lessons);
          hidePanel();
          announce(`Lezione ${name} modificata con successo`);
          editingLessonId = null;
        }
      } else {
        // Add new lesson
        data.lessons.push({ id: uid(), name, class: document.getElementById('inputClass').value, day, start, duration });
        await save(data);
        ScheduleGrid.renderLessons(gridEl, data.lessons);
        hidePanel();
        announce(`Lezione ${name} aggiunta con successo`);
      }
      
      // Reset form
      document.getElementById('inputName').value = '';
      document.getElementById('inputClass').value = '';
    });
    
    if(deleteBtn) {
      deleteBtn.addEventListener('click', async ()=>{
        if(!editingLessonId) return;
        
        if(confirm('Sei sicuro di voler eliminare questa lezione?')){
          const data = await load();
          const lesson = data.lessons.find(l => l.id === editingLessonId);
          const lessonName = lesson ? lesson.name : 'Lezione';
          
          data.lessons = data.lessons.filter(l => l.id !== editingLessonId);
          await save(data);
          ScheduleGrid.renderLessons(gridEl, data.lessons);
          hidePanel();
          announce(`${lessonName} eliminata con successo`);
          editingLessonId = null;
        }
      });
    }
    
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
    
    // lesson click opens edit panel
    window.addEventListener('lesson-click', async (e)=> {
      await openEdit(e.detail.id);
    });
  }

  if(document.readyState === 'loading'){
    document.addEventListener('DOMContentLoaded', init, {once:true});
  }else init();
})();
