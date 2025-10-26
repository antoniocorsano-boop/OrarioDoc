// settings-screen.js - Complete settings UI implementation
// Gestisce l'interfaccia completa per impostazioni utente e scuola
(function() {
  'use strict';
  
  let previousFocusElement = null;
  
  /**
   * Valori predefiniti per le impostazioni
   */
  const DEFAULT_SETTINGS = {
    user: {
      name: '',
      email: '',
      subjects: []
    },
    school: {
      name: '',
      address: '',
      startTime: '08:00',
      endTime: '14:00',
      lessonDuration: 60,
      breakDuration: 10,
      schoolDays: 'mon-fri' // 'mon-fri' o 'mon-sat'
    },
    theme: 'expressive'
  };
  
  /**
   * Mostra il modal impostazioni
   */
  function showSettings() {
    const modal = document.getElementById('settingsModal');
    if (!modal) return;
    
    previousFocusElement = document.activeElement;
    
    modal.classList.remove('hidden');
    modal.setAttribute('aria-hidden', 'false');
    
    // Focus sul primo input
    const firstInput = modal.querySelector('input, select');
    if (firstInput) {
      setTimeout(() => firstInput.focus(), 100);
    }
    
    // Trap focus nel modal
    trapFocus(modal);
  }
  
  /**
   * Nasconde il modal impostazioni
   */
  function hideSettings() {
    const modal = document.getElementById('settingsModal');
    if (!modal) return;
    
    modal.classList.add('hidden');
    modal.setAttribute('aria-hidden', 'true');
    
    // Ripristina focus
    if (previousFocusElement && previousFocusElement.focus) {
      previousFocusElement.focus();
    }
    previousFocusElement = null;
  }
  
  /**
   * Trap focus all'interno del modal
   */
  function trapFocus(element) {
    const focusableElements = element.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const firstFocusable = focusableElements[0];
    const lastFocusable = focusableElements[focusableElements.length - 1];
    
    function handleKeyDown(e) {
      if (e.key !== 'Tab') return;
      
      if (e.shiftKey) {
        if (document.activeElement === firstFocusable) {
          e.preventDefault();
          lastFocusable.focus();
        }
      } else {
        if (document.activeElement === lastFocusable) {
          e.preventDefault();
          firstFocusable.focus();
        }
      }
    }
    
    element.addEventListener('keydown', handleKeyDown);
  }
  
  /**
   * Carica le impostazioni e popola il form
   */
  async function loadSettingsIntoForm() {
    try {
      const settings = await AppSettings.loadSettings();
      const merged = mergeSettings(DEFAULT_SETTINGS, settings);
      
      // Utente
      setValueIfExists('userName', merged.user.name);
      setValueIfExists('userEmail', merged.user.email);
      setValueIfExists('userSubjects', merged.user.subjects.join(', '));
      
      // Scuola
      setValueIfExists('schoolName', merged.school.name);
      setValueIfExists('schoolAddress', merged.school.address);
      setValueIfExists('schoolStartTime', merged.school.startTime);
      setValueIfExists('schoolEndTime', merged.school.endTime);
      setValueIfExists('schoolLessonDuration', merged.school.lessonDuration);
      setValueIfExists('schoolBreakDuration', merged.school.breakDuration);
      setValueIfExists('schoolDays', merged.school.schoolDays);
      
      // Tema
      const savedTheme = window.ThemeManager ? window.ThemeManager.getUserTheme() : merged.theme;
      setValueIfExists('themeSelector', savedTheme);
      
    } catch (error) {
      console.error('Errore caricamento impostazioni:', error);
      if (window.Toast) {
        Toast.showToast('Errore caricamento impostazioni', 'error');
      }
    }
  }
  
  /**
   * Helper per impostare valore di un input se esiste
   */
  function setValueIfExists(id, value) {
    const element = document.getElementById(id);
    if (element) {
      element.value = value || '';
    }
  }
  
  /**
   * Merge impostazioni con valori predefiniti
   */
  function mergeSettings(defaults, saved) {
    return {
      user: { ...defaults.user, ...(saved.user || {}) },
      school: { ...defaults.school, ...(saved.school || {}) },
      theme: saved.theme || defaults.theme
    };
  }
  
  /**
   * Salva le impostazioni dal form
   */
  async function saveSettingsFromForm() {
    try {
      // Validazione
      const errors = validateForm();
      if (errors.length > 0) {
        if (window.Toast) {
          Toast.showToast(errors[0], 'error');
        }
        return false;
      }
      
      // Raccogli dati dal form
      const settings = {
        user: {
          name: getValueIfExists('userName'),
          email: getValueIfExists('userEmail'),
          subjects: getValueIfExists('userSubjects')
            .split(',')
            .map(s => s.trim())
            .filter(s => s.length > 0)
        },
        school: {
          name: getValueIfExists('schoolName'),
          address: getValueIfExists('schoolAddress'),
          startTime: getValueIfExists('schoolStartTime'),
          endTime: getValueIfExists('schoolEndTime'),
          lessonDuration: parseInt(getValueIfExists('schoolLessonDuration'), 10),
          breakDuration: parseInt(getValueIfExists('schoolBreakDuration'), 10),
          schoolDays: getValueIfExists('schoolDays')
        },
        theme: getValueIfExists('themeSelector')
      };
      
      // Salva in IndexedDB
      await AppSettings.saveSettings(settings);
      
      // Applica tema se ThemeManager disponibile
      if (window.ThemeManager) {
        window.ThemeManager.setTheme(settings.theme);
      }
      
      // Feedback successo
      if (window.Toast) {
        Toast.showToast('Impostazioni salvate con successo', 'success');
      }
      
      // Chiudi modal
      hideSettings();
      
      return true;
    } catch (error) {
      console.error('Errore salvataggio impostazioni:', error);
      if (window.Toast) {
        Toast.showToast('Errore durante il salvataggio', 'error');
      }
      return false;
    }
  }
  
  /**
   * Helper per ottenere valore di un input se esiste
   */
  function getValueIfExists(id) {
    const element = document.getElementById(id);
    return element ? element.value : '';
  }
  
  /**
   * Validazione form
   */
  function validateForm() {
    const errors = [];
    
    // Valida orari
    const startTime = getValueIfExists('schoolStartTime');
    const endTime = getValueIfExists('schoolEndTime');
    
    if (startTime && endTime && startTime >= endTime) {
      errors.push('L\'orario di fine deve essere successivo all\'orario di inizio');
    }
    
    // Valida durata lezione
    const lessonDuration = parseInt(getValueIfExists('schoolLessonDuration'), 10);
    if (lessonDuration && (lessonDuration < 1 || lessonDuration > 480)) {
      errors.push('La durata della lezione deve essere tra 1 e 480 minuti');
    }
    
    // Valida durata intervallo
    const breakDuration = parseInt(getValueIfExists('schoolBreakDuration'), 10);
    if (breakDuration && (breakDuration < 0 || breakDuration > 120)) {
      errors.push('La durata dell\'intervallo deve essere tra 0 e 120 minuti');
    }
    
    // Valida email se fornita
    const email = getValueIfExists('userEmail');
    if (email && email.length > 0) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        errors.push('L\'indirizzo email non è valido');
      }
    }
    
    return errors;
  }
  
  /**
   * Reset a valori predefiniti
   */
  async function resetToDefaults() {
    if (!confirm('Sei sicuro di voler ripristinare le impostazioni predefinite?')) {
      return;
    }
    
    try {
      // Salva valori predefiniti
      await AppSettings.saveSettings(DEFAULT_SETTINGS);
      
      // Ricarica form
      await loadSettingsIntoForm();
      
      // Applica tema predefinito
      if (window.ThemeManager) {
        window.ThemeManager.setTheme(DEFAULT_SETTINGS.theme);
      }
      
      if (window.Toast) {
        Toast.showToast('Impostazioni ripristinate ai valori predefiniti', 'success');
      }
    } catch (error) {
      console.error('Errore reset impostazioni:', error);
      if (window.Toast) {
        Toast.showToast('Errore durante il ripristino', 'error');
      }
    }
  }
  
  /**
   * Inizializzazione
   */
  async function init() {
    // Setup bottone apri impostazioni
    const settingsBtn = document.getElementById('settingsBtn');
    if (settingsBtn) {
      settingsBtn.addEventListener('click', async () => {
        await loadSettingsIntoForm();
        showSettings();
      });
    }
    
    // Setup bottone salva
    const saveBtn = document.getElementById('saveSettingsBtn');
    if (saveBtn) {
      saveBtn.addEventListener('click', saveSettingsFromForm);
    }
    
    // Setup bottone chiudi (X)
    const closeBtn = document.getElementById('closeSettingsBtn');
    if (closeBtn) {
      closeBtn.addEventListener('click', hideSettings);
    }
    
    // Setup bottone annulla
    const cancelBtn = document.getElementById('cancelSettingsBtn');
    if (cancelBtn) {
      cancelBtn.addEventListener('click', hideSettings);
    }
    
    // Setup bottone reset
    const resetBtn = document.getElementById('resetSettingsBtn');
    if (resetBtn) {
      resetBtn.addEventListener('click', resetToDefaults);
    }
    
    // Setup cambio tema in tempo reale
    const themeSelector = document.getElementById('themeSelector');
    if (themeSelector && window.ThemeManager) {
      themeSelector.addEventListener('change', (e) => {
        window.ThemeManager.setTheme(e.target.value);
      });
    }
    
    // Chiudi modal con Escape
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        const modal = document.getElementById('settingsModal');
        if (modal && !modal.classList.contains('hidden')) {
          hideSettings();
        }
      }
    });
    
    // Ascolta eventi theme-changed da altre tabs
    window.addEventListener('theme-changed', (e) => {
      const themeSelector = document.getElementById('themeSelector');
      if (themeSelector && e.detail && e.detail.userTheme) {
        themeSelector.value = e.detail.userTheme;
      }
    });
  }
  
  // Inizializza quando DOM è pronto
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init, { once: true });
  } else {
    init();
  }
  
  // Esporta per uso esterno se necessario
  window.SettingsScreen = {
    show: showSettings,
    hide: hideSettings,
    load: loadSettingsIntoForm,
    save: saveSettingsFromForm,
    reset: resetToDefaults
  };
})();
