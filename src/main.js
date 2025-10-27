/**
 * main.js - Application Initialization and Event Management
 * 
 * This is the main entry point for the OrarioDoc application. It initializes
 * the schedule grid, wires up UI components with storage, and manages the
 * modal panel for adding/editing lessons.
 * 
 * @module Main
 * 
 * Key Features:
 * - Application initialization and setup
 * - Data persistence with async storage (IndexedDB/localStorage)
 * - Modal panel management (open, close, focus trapping)
 * - Form validation and conflict detection
 * - Keyboard event handling (Escape to close)
 * - ARIA announcements for screen readers
 * - Focus management for accessibility
 * 
 * Data Flow:
 * 1. Load data from storage on init
 * 2. Render schedule grid with lessons
 * 3. User interactions trigger modal/events
 * 4. Changes saved to storage
 * 5. Grid re-rendered with updated data
 * 
 * Events Handled:
 * - 'schedule-cell-click': Opens add modal for selected day
 * - 'lesson-click': Opens edit modal for selected lesson
 * - Button clicks: save, cancel, delete, add
 * - Keyboard: Escape to close modal
 */
(function(){
  /**
   * Generates a unique ID for lessons
   * @private
   * @returns {string} Unique identifier in format 'id-xxxxxxx'
   */
  function uid(){ return 'id-'+Math.random().toString(36).slice(2,9); }
  
  /**
   * Stores reference to previously focused element before opening modal
   * Used to restore focus when modal closes (accessibility requirement)
   * @private
   * @type {HTMLElement|null}
   */
  let previousFocusElement = null;

  /**
   * Announces a message to screen readers via live region
   * 
   * @function announce
   * @private
   * @param {string} message - Message to announce to screen readers
   * 
   * Uses ARIA live region (#announcements) with role="status" and aria-live="polite"
   * to communicate dynamic changes to users of assistive technology.
   * 
   * Messages automatically clear after 3 seconds to prevent accumulation.
   */
  function announce(message){
    const announcer = document.getElementById('announcements');
    if(announcer){
      announcer.textContent = message;
      // Clear dopo 3 secondi per evitare annunci ripetuti
      setTimeout(()=>{ announcer.textContent = ''; }, 3000);
    }
  }

  /**
   * Shows the modal panel with proper focus management
   * 
   * @function showPanel
   * @private
   * 
   * Accessibility features:
   * - Stores reference to currently focused element for restoration
   * - Sets aria-hidden="false" to make modal visible to screen readers
   * - Moves focus to first input field
   * - Implements focus trap to prevent focus leaving modal
   * 
   * Focus trap ensures keyboard users can't accidentally navigate
   * outside the modal while it's open (WCAG 2.1 requirement).
   */
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
  
  /**
   * Hides the modal panel and restores focus
   * 
   * @function hidePanel
   * @private
   * 
   * Accessibility:
   * - Sets aria-hidden="true" to hide from screen readers
   * - Restores focus to element that was focused before modal opened
   * - Cleans up focus trap event listeners
   */
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
  
  /**
   * Implements focus trap within a container
   * 
   * @function trapFocus
   * @private
   * @param {HTMLElement} element - Container element to trap focus within
   * 
   * Traps keyboard focus within the specified element by:
   * - Finding all focusable elements (buttons, links, inputs, etc.)
   * - Handling Tab and Shift+Tab to cycle through focusable elements
   * - Preventing focus from leaving the container
   * 
   * This is essential for modal accessibility (WCAG 2.1.2 Level A).
   * Users with keyboards or assistive technology must be able to
   * navigate the modal without losing context.
   */
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

  /**
   * Loads application data from storage
   * 
   * @async
   * @function load
   * @private
   * @returns {Promise<Object>} Application data with structure:
   *   {
   *     lessons: Array<Lesson>,
   *     settings: Object
   *   }
   * 
   * Uses async Storage.read() which automatically handles:
   * - IndexedDB as primary storage
   * - localStorage as fallback
   * - Migration from localStorage to IndexedDB
   * - Default structure if no data exists
   */
  async function load(){
    const data = await Storage.read();
    return data;
  }
  
  /**
   * Saves application data to storage
   * 
   * @async
   * @function save
   * @private
   * @param {Object} data - Application data to save
   * @param {Array<Lesson>} data.lessons - Array of lesson objects
   * @param {Object} data.settings - Application settings
   * @returns {Promise<void>}
   * 
   * Data is automatically persisted to IndexedDB (or localStorage fallback).
   * Changes are immediately available across browser tabs via storage events.
   */
  async function save(data){ await Storage.write(data); }
  
  /**
   * Converts time string to minutes for easier comparison
   * 
   * @function timeToMinutes
   * @private
   * @param {string} timeStr - Time in HH:MM format (e.g., "08:30")
   * @returns {number} Total minutes from midnight
   * 
   * @example
   * timeToMinutes("08:00") // returns 480
   * timeToMinutes("12:30") // returns 750
   */
  function timeToMinutes(timeStr){
    const [hours, minutes] = timeStr.split(':').map(Number);
    return hours * 60 + minutes;
  }
  
  /**
   * Validates lesson data before saving
   * 
   * @function validateLesson
   * @private
   * @param {string} name - Lesson name
   * @param {number} day - Day of week (0-6)
   * @param {string} start - Start time in HH:MM format
   * @param {number} duration - Duration in minutes
   * @returns {Array<string>} Array of error messages (empty if valid)
   * 
   * Validation rules:
   * - Name: Required, non-empty after trimming
   * - Day: Must be number between 0 (Sunday) and 6 (Saturday)
   * - Start: Must match HH:MM format with valid hours (00-23) and minutes (00-59)
   * - Duration: Must be number between 1 and 480 minutes (8 hours max)
   * 
   * @example
   * const errors = validateLesson('Math', 1, '08:00', 60);
   * if (errors.length > 0) {
   *   // Show error to user
   * }
   */
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
  
  /**
   * Checks for time conflicts between lessons
   * 
   * @function checkConflicts
   * @private
   * @param {Array<Lesson>} lessons - Existing lessons to check against
   * @param {Lesson} newLesson - New/edited lesson to check
   * @param {string|null} [excludeId=null] - Lesson ID to exclude (for editing)
   * @returns {Array<Lesson>} Array of conflicting lessons
   * 
   * Conflict detection logic:
   * - Only checks lessons on the same day
   * - Two lessons conflict if their time intervals overlap
   * - Interval overlap: newStart < existingEnd AND newEnd > existingStart
   * - Adjacent lessons (end time = start time) do NOT conflict
   * 
   * When editing a lesson (excludeId provided), the lesson being edited
   * is excluded from conflict checking.
   * 
   * @example
   * const existing = [
   *   { id: '1', day: 1, start: '08:00', duration: 60 }
   * ];
   * const newLesson = { day: 1, start: '08:30', duration: 60 };
   * const conflicts = checkConflicts(existing, newLesson);
   * // Returns [existing lesson] because times overlap
   */
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
