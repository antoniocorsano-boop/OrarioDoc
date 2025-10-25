// Main application initialization and UI wiring
function init() {
  // Get UI elements
  const addBtn = document.getElementById('addBtn');
  const settingsBtn = document.getElementById('settingsBtn');
  const saveBtn = document.getElementById('saveBtn');
  const cancelBtn = document.getElementById('cancelBtn');
  const addPanel = document.getElementById('addPanel');
  const scheduleGrid = document.getElementById('scheduleGrid');
  const lessonForm = document.getElementById('lessonForm');

  // Initialize grid
  if (scheduleGrid && window.ScheduleGrid) {
    loadAndRenderLessons();
  }

  // Add button - show panel
  if (addBtn && addPanel) {
    addBtn.addEventListener('click', () => {
      showPanel(addPanel);
      clearForm();
    });
  }

  // Settings button - placeholder
  if (settingsBtn) {
    settingsBtn.addEventListener('click', () => {
      alert('Impostazioni: funzionalità in arrivo');
    });
  }

  // Save button - persist lesson
  if (saveBtn && lessonForm) {
    saveBtn.addEventListener('click', () => {
      const lessonName = document.getElementById('lessonName');
      const lessonDay = document.getElementById('lessonDay');
      const lessonTime = document.getElementById('lessonTime');

      if (lessonName && lessonDay && lessonTime) {
        if (!lessonName.value || !lessonDay.value || !lessonTime.value) {
          alert('Compila tutti i campi');
          return;
        }

        const lesson = {
          name: lessonName.value,
          day: lessonDay.value,
          time: lessonTime.value
        };

        if (window.Storage) {
          window.Storage.add(lesson);
          loadAndRenderLessons();
          hidePanel(addPanel);
          clearForm();
        }
      }
    });
  }

  // Cancel button - hide panel
  if (cancelBtn && addPanel) {
    cancelBtn.addEventListener('click', () => {
      hidePanel(addPanel);
      clearForm();
    });
  }

  // Listen for lesson click events
  if (scheduleGrid) {
    scheduleGrid.addEventListener('lessonclick', (event) => {
      const { lesson } = event.detail;
      const confirmDelete = confirm(`Eliminare "${lesson.name}"?`);
      if (confirmDelete && window.Storage) {
        window.Storage.remove(lesson.id);
        loadAndRenderLessons();
      }
    });
  }

  // Helper functions
  function showPanel(panel) {
    panel.classList.remove('hidden');
    panel.setAttribute('aria-hidden', 'false');
  }

  function hidePanel(panel) {
    panel.classList.add('hidden');
    panel.setAttribute('aria-hidden', 'true');
  }

  function clearForm() {
    const lessonName = document.getElementById('lessonName');
    const lessonDay = document.getElementById('lessonDay');
    const lessonTime = document.getElementById('lessonTime');
    
    if (lessonName) lessonName.value = '';
    if (lessonDay) lessonDay.value = '';
    if (lessonTime) lessonTime.value = '';
  }

  function loadAndRenderLessons() {
    if (window.Storage && window.ScheduleGrid && scheduleGrid) {
      const lessons = window.Storage.read();
      window.ScheduleGrid.renderLessons(scheduleGrid, lessons);
    }
  }
}

// Initialize on DOMContentLoaded
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
