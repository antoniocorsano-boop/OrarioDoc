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
  
  // Helper: Convert time to minutes for easier comparison
  function timeToMinutes(timeStr){
    const [hours, minutes] = timeStr.split(':').map(Number);
    return hours * 60 + minutes;
  }
  
  // Validation functions
  function validateLesson(name, day, start, duration){
    const errors = [];
    
    if(!name || name.trim().length === 0){
      errors.push('Il nome della lezione è obbligatorio');
    }
    
    if(isNaN(day) || day < 0 || day > 6){
      errors.push('Il giorno deve essere tra 0 (Domenica) e 6 (Sabato)');
    }
    
    if(!start || !/^([0-1][0-9]|2[0-3]):([0-5][0-9])$/.test(start)){
      errors.push('L\'ora deve essere nel formato HH:MM');
    }
    
    if(isNaN(duration) || duration < 1 || duration > 480){
      errors.push('La durata deve essere tra 1 e 480 minuti');
    }
    
    return errors;
  }
  
  // Conflict detection
  function checkConflicts(lessons, newLesson, excludeId = null){
    const conflicts = [];
    
    const newStart = timeToMinutes(newLesson.start);
    const newEnd = newStart + newLesson.duration;
    
    lessons.forEach(lesson => {
      if(lesson.id === excludeId) return; // Skip current lesson when editing
      if(lesson.day !== newLesson.day) return; // Only check same day
      
      const existingStart = timeToMinutes(lesson.start);
      const existingEnd = existingStart + lesson.duration;
      
      // Simplified overlap detection: intervals overlap if start < other's end AND end > other's start
      if(newStart < existingEnd && newEnd > existingStart){
        conflicts.push(lesson);
      }
    });
    
    return conflicts;
  }

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
    const saveBtn = document.getElementById('saveBtn');
    const cancelBtn = document.getElementById('cancelBtn');
    const deleteBtn = document.getElementById('deleteBtn');

    if(addBtn) addBtn.addEventListener('click', ()=>openAdd());
    // Settings button handler is now in settings-screen.js
    
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
      
      // Validate input
      const errors = validateLesson(name, day, start, duration);
      if(errors.length > 0){
        Toast.showToast(errors[0], 'error');
        document.getElementById('inputName').focus();
        return;
      }

      const data = await load();
      data.lessons = data.lessons || [];
      
      const newLesson = {
        name, 
        class: document.getElementById('inputClass').value, 
        day, 
        start, 
        duration
      };
      
      // Check for conflicts
      const conflicts = checkConflicts(data.lessons, newLesson, editingLessonId);
      if(conflicts.length > 0){
        const conflictNames = conflicts.map(l => l.name).join(', ');
        Toast.showToast(`Conflitto orario con: ${conflictNames}`, 'warning', 5000);
        return;
      }
      
      if(editingLessonId){
        // Update existing lesson
        const index = data.lessons.findIndex(l => l.id === editingLessonId);
        if(index !== -1){
          data.lessons[index] = { 
            ...data.lessons[index],
            id: editingLessonId,
            ...newLesson
          };
          await save(data);
          ScheduleGrid.renderLessons(gridEl, data.lessons);
          hidePanel();
          Toast.showToast(`Lezione ${name} modificata con successo`, 'success');
          announce(`Lezione ${name} modificata con successo`);
          editingLessonId = null;
        }
      } else {
        // Add new lesson
        data.lessons.push({ id: uid(), ...newLesson });
        await save(data);
        ScheduleGrid.renderLessons(gridEl, data.lessons);
        hidePanel();
        Toast.showToast(`Lezione ${name} aggiunta con successo`, 'success');
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
          Toast.showToast(`${lessonName} eliminata con successo`, 'success');
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
