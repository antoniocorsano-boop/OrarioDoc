// Schedule Grid rendering and event handling
const ScheduleGrid = {
  // Create the grid structure
  createGrid(container) {
    if (!container) {
      console.error('Container element not found');
      return;
    }
    container.innerHTML = '<p style="text-align: center; color: #999;">Nessuna lezione. Clicca "Aggiungi" per iniziare.</p>';
  },

  // Render lessons in the grid
  renderLessons(container, lessons) {
    if (!container) {
      console.error('Container element not found');
      return;
    }

    if (!lessons || lessons.length === 0) {
      this.createGrid(container);
      return;
    }

    container.innerHTML = '';

    lessons.forEach(lesson => {
      const card = document.createElement('div');
      card.className = 'lesson-card';
      card.dataset.lessonId = lesson.id;
      
      card.innerHTML = `
        <h3>${this.escapeHtml(lesson.name)}</h3>
        <p><strong>Giorno:</strong> ${this.escapeHtml(lesson.day)}</p>
        <p><strong>Ora:</strong> ${this.escapeHtml(lesson.time)}</p>
      `;

      // Dispatch custom event on click
      card.addEventListener('click', () => {
        const event = new CustomEvent('lessonclick', {
          detail: { lesson },
          bubbles: true
        });
        container.dispatchEvent(event);
      });

      container.appendChild(card);
    });
  },

  // Escape HTML to prevent XSS
  escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }
};

// Make ScheduleGrid available globally
window.ScheduleGrid = ScheduleGrid;
