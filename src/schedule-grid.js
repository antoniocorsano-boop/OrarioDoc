// schedule-grid.js - render semplice della griglia settimanale e interazioni base
(function(){
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

  function renderLessons(container, lessons){
    // clear items
    Array.from(container.querySelectorAll('.item')).forEach(n=>n.remove());
    lessons.forEach(l=>{
      const day = String(l.day);
      const col = container.querySelector(`.cell[data-day="${day}"]`);
      if(!col) return;
      const el = document.createElement('div');
      el.className = 'item';
      
      // Format display text with more details
      const displayText = l.class ? `${l.name} (${l.class})` : l.name;
      const durationText = l.duration ? ` • ${l.duration}min` : '';
      
      el.innerHTML = `
        <div class="item-name">${displayText}</div>
        <div class="item-time">${l.start}${durationText}</div>
      `;
      
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
      
      col.appendChild(el);
    });
  }

  window.ScheduleGrid = { createGrid, renderLessons };
})();
