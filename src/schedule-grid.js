/**
 * schedule-grid.js - Schedule Grid Component
 * 
 * This module provides the rendering and interaction logic for the weekly schedule grid.
 * It creates a 7-column grid representing the days of the week, handles keyboard navigation,
 * and manages lesson items within the grid.
 * 
 * @module ScheduleGrid
 * 
 * Features:
 * - Creates accessible grid structure with ARIA attributes
 * - Keyboard navigation (Enter, Space, Arrow keys)
 * - Click and keyboard event handlers for cells and lessons
 * - Optimized rendering with DocumentFragment
 * - XSS protection with textContent
 * - Focus management and accessibility
 * 
 * Events Dispatched:
 * - 'schedule-cell-click': When a grid cell is clicked/activated
 *   detail: { day: number } - Day index (0=Sunday, 6=Saturday)
 * - 'lesson-click': When a lesson item is clicked/activated
 *   detail: { id: string } - Lesson ID
 * 
 * @example
 * const gridEl = document.getElementById('scheduleGrid');
 * ScheduleGrid.createGrid(gridEl);
 * ScheduleGrid.renderLessons(gridEl, lessons);
 */
(function(){
  /**
   * Creates the weekly schedule grid with 7 day columns
   * 
   * @function createGrid
   * @param {HTMLElement} container - The container element for the grid
   * 
   * Creates a grid with:
   * - 7 cells (one for each day of the week)
   * - Proper ARIA roles and labels
   * - Keyboard navigation (Enter, Space, Arrow keys)
   * - Click handlers for cell and keyboard interaction
   * 
   * Keyboard navigation:
   * - Enter/Space: Activate cell (add lesson)
   * - ArrowLeft/Right: Navigate between adjacent cells
   * - ArrowUp/Down: Navigate vertically (3 cells at a time for grid layout)
   * 
   * @fires schedule-cell-click - When cell is activated
   */
  function createGrid(container){
    container.innerHTML = '';
    const days = ['Dom','Lun','Mar','Mer','Gio','Ven','Sab'];
    for(let d=1; d<=7; d++){
      const col = document.createElement('div');
      col.className = 'cell';
      col.dataset.day = ((d)%7).toString(); // 1..7 -> 1..0
      col.setAttribute('role', 'gridcell');
      col.setAttribute('tabindex', '0');
      col.setAttribute('aria-label', `${days[(d)%7]}, clicca per aggiungere lezione`);
      
      const header = document.createElement('div');
      header.className = 'cell-header';
      header.textContent = days[(d)%7];
      header.setAttribute('aria-hidden', 'true'); // Nascosto perché info duplicata in aria-label
      col.appendChild(header);
      container.appendChild(col);
    }
    
    // Click handler
    container.addEventListener('click', (ev)=>{
      const target = ev.target.closest('.cell');
      if(!target) return;
      const day = parseInt(target.dataset.day,10);
      window.dispatchEvent(new CustomEvent('schedule-cell-click',{detail:{day}}));
    });
    
    // Keyboard handler per celle
    container.addEventListener('keydown', (ev)=>{
      const target = ev.target.closest('.cell');
      if(!target) return;
      
      // Enter o Space attiva la cella
      if(ev.key === 'Enter' || ev.key === ' '){
        ev.preventDefault();
        const day = parseInt(target.dataset.day,10);
        window.dispatchEvent(new CustomEvent('schedule-cell-click',{detail:{day}}));
      }
      
      // Navigazione con frecce
      if(['ArrowLeft','ArrowRight','ArrowUp','ArrowDown'].includes(ev.key)){
        ev.preventDefault();
        const cells = Array.from(container.querySelectorAll('.cell'));
        const currentIndex = cells.indexOf(target);
        let newIndex = currentIndex;
        
        if(ev.key === 'ArrowLeft') newIndex = Math.max(0, currentIndex - 1);
        if(ev.key === 'ArrowRight') newIndex = Math.min(cells.length - 1, currentIndex + 1);
        if(ev.key === 'ArrowUp') newIndex = Math.max(0, currentIndex - 3);
        if(ev.key === 'ArrowDown') newIndex = Math.min(cells.length - 1, currentIndex + 3);
        
        if(cells[newIndex]) cells[newIndex].focus();
      }
    });
  }

  /**
   * Renders lesson items in the schedule grid
   * 
   * @function renderLessons
   * @param {HTMLElement} container - The grid container element
   * @param {Array<Object>} lessons - Array of lesson objects to render
   * @param {string} lessons[].id - Unique lesson identifier
   * @param {string} lessons[].name - Lesson name (required)
   * @param {number} lessons[].day - Day of week (0=Sunday, 6=Saturday)
   * @param {string} lessons[].start - Start time in HH:MM format
   * @param {number} lessons[].duration - Duration in minutes
   * @param {string} [lessons[].class] - Class name/identifier (optional)
   * 
   * Performance optimizations:
   * - Groups lessons by day to minimize DOM queries
   * - Uses DocumentFragment to batch DOM insertions (reduces reflow)
   * - Efficient removal of existing items before re-render
   * 
   * Security:
   * - Uses textContent instead of innerHTML to prevent XSS attacks
   * - Safely escapes all user-provided content
   * 
   * Accessibility:
   * - Each lesson has role="button" for screen reader interaction
   * - Descriptive aria-labels with lesson details
   * - Keyboard accessible (Enter, Space keys)
   * - Tabindex="0" for keyboard navigation
   * 
   * @fires lesson-click - When a lesson is clicked or activated
   * 
   * @example
   * const lessons = [
   *   { id: '1', name: 'Math', day: 1, start: '08:00', duration: 60, class: '3A' },
   *   { id: '2', name: 'Science', day: 2, start: '09:00', duration: 90 }
   * ];
   * ScheduleGrid.renderLessons(gridEl, lessons);
   */
  function renderLessons(container, lessons){
    // Ottimizzato con DocumentFragment per ridurre reflow
    // clear items
    Array.from(container.querySelectorAll('.item')).forEach(n=>n.remove());
    
    // Raggruppa lezioni per giorno per ottimizzare il rendering
    const lessonsByDay = {};
    lessons.forEach(l => {
      const day = String(l.day);
      if (!lessonsByDay[day]) lessonsByDay[day] = [];
      lessonsByDay[day].push(l);
    });
    
    // Render usando fragment per minimizzare DOM manipulation
    Object.entries(lessonsByDay).forEach(([day, dayLessons]) => {
      const col = container.querySelector(`.cell[data-day="${day}"]`);
      if(!col) return;
      
      const fragment = document.createDocumentFragment();
      
      dayLessons.forEach(l => {
        const el = document.createElement('div');
        el.className = 'item';
        
        // Format display text with more details
        const displayText = l.class ? `${l.name} (${l.class})` : l.name;
        const durationText = l.duration ? ` • ${l.duration}min` : '';
        
        // Create elements safely using textContent to prevent XSS
        const nameDiv = document.createElement('div');
        nameDiv.className = 'item-name';
        nameDiv.textContent = displayText;
        
        const timeDiv = document.createElement('div');
        timeDiv.className = 'item-time';
        timeDiv.textContent = `${l.start}${durationText}`;
        
        el.appendChild(nameDiv);
        el.appendChild(timeDiv);
        
        el.dataset.id = l.id;
        el.setAttribute('role', 'button');
        el.setAttribute('tabindex', '0');
        el.setAttribute('aria-label', `Lezione: ${l.name}${l.class ? ' classe ' + l.class : ''} alle ${l.start}${l.duration ? ', durata ' + l.duration + ' minuti' : ''}, clicca per modificare`);
        
        // Click handler
        el.addEventListener('click', (ev)=>{
          ev.stopPropagation();
          window.dispatchEvent(new CustomEvent('lesson-click',{detail:{id:l.id}}));
        });
        
        // Keyboard handler per item
        el.addEventListener('keydown', (ev)=>{
          if(ev.key === 'Enter' || ev.key === ' '){
            ev.preventDefault();
            ev.stopPropagation();
            window.dispatchEvent(new CustomEvent('lesson-click',{detail:{id:l.id}}));
          }
        });
        
        fragment.appendChild(el);
      });
      
      col.appendChild(fragment);
    });
  }

  /**
   * Public API for the ScheduleGrid module
   * 
   * @namespace ScheduleGrid
   * @global
   * 
   * @property {Function} createGrid - Creates the weekly schedule grid structure
   * @property {Function} renderLessons - Renders lesson items in the grid
   * 
   * @see {@link createGrid} for grid creation
   * @see {@link renderLessons} for lesson rendering
   */
  window.ScheduleGrid = { createGrid, renderLessons };
})();
