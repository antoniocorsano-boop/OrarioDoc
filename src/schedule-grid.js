// schedule-grid.js - render semplice della griglia settimanale e interazioni base
(function(){
  function createGrid(container){
    container.innerHTML = '';
    const days = ['Dom','Lun','Mar','Mer','Gio','Ven','Sab'];
    for(let d=1; d<=7; d++){
      const col = document.createElement('div');
      col.className = 'cell';
      col.dataset.day = ((d)%7).toString(); // 1..7 -> 1..0
      const header = document.createElement('div');
      header.className = 'cell-header';
      header.textContent = days[(d)%7];
      col.appendChild(header);
      container.appendChild(col);
    }
    container.addEventListener('click', (ev)=>{
      const target = ev.target.closest('.cell');
      if(!target) return;
      const day = parseInt(target.dataset.day,10);
      // dispatch custom event for app logic
      window.dispatchEvent(new CustomEvent('schedule-cell-click',{detail:{day}}));
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
      el.textContent = `${l.name} (${l.start})`;
      el.dataset.id = l.id;
      el.addEventListener('click', (ev)=>{
        ev.stopPropagation();
        window.dispatchEvent(new CustomEvent('lesson-click',{detail:{id:l.id}}));
      });
      col.appendChild(el);
    });
  }

  window.ScheduleGrid = { createGrid, renderLessons };
})();
