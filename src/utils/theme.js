/**
 * theme.js - Gestione tema centralizzata per OrarioDoc
 * 
 * Questo modulo gestisce:
 * - Applicazione e persistenza del tema (light/dark/expressive/auto)
 * - Personalizzazione colori primari e secondari
 * - Sincronizzazione con preferenze sistema (prefers-color-scheme)
 * - Gestione eventi cambio tema
 * 
 * Uso:
 * - ThemeManager.init() all'avvio dell'app
 * - ThemeManager.setTheme('light'|'dark'|'expressive'|'auto')
 * - ThemeManager.setCustomColors({ primary: '#hex', secondary: '#hex' })
 */

const ThemeManager = (function() {
  'use strict';
  
  // Chiavi localStorage
  const STORAGE_KEYS = {
    THEME: 'orariodoc:theme',
    COLORS: 'orariodoc:colors'
  };
  
  // Temi disponibili
  const THEMES = {
    AUTO: 'auto',
    LIGHT: 'light',
    DARK: 'dark',
    EXPRESSIVE: 'expressive'
  };
  
  // Riferimento al root element
  const root = document.documentElement;
  
  // Media query per preferenza sistema
  const prefersDarkQuery = window.matchMedia('(prefers-color-scheme: dark)');
  
  /**
   * Ottiene il tema corrente salvato o default
   * @returns {string} Tema salvato o 'expressive'
   */
  function getSavedTheme() {
    try {
      return localStorage.getItem(STORAGE_KEYS.THEME) || THEMES.EXPRESSIVE;
    } catch (e) {
      console.warn('Impossibile leggere tema da localStorage:', e);
      return THEMES.EXPRESSIVE;
    }
  }
  
  /**
   * Salva il tema in localStorage
   * @param {string} theme - Nome del tema da salvare
   */
  function saveTheme(theme) {
    try {
      localStorage.setItem(STORAGE_KEYS.THEME, theme);
    } catch (e) {
      console.warn('Impossibile salvare tema in localStorage:', e);
    }
  }
  
  /**
   * Ottiene i colori personalizzati salvati
   * @returns {Object|null} Oggetto con primary/secondary o null
   */
  function getSavedColors() {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.COLORS);
      return saved ? JSON.parse(saved) : null;
    } catch (e) {
      console.warn('Impossibile leggere colori da localStorage:', e);
      return null;
    }
  }
  
  /**
   * Salva colori personalizzati in localStorage
   * @param {Object} colors - Oggetto con {primary, secondary}
   */
  function saveColors(colors) {
    try {
      if (colors && (colors.primary || colors.secondary)) {
        localStorage.setItem(STORAGE_KEYS.COLORS, JSON.stringify(colors));
      }
    } catch (e) {
      console.warn('Impossibile salvare colori in localStorage:', e);
    }
  }
  
  /**
   * Rimuove colori personalizzati
   */
  function clearColors() {
    try {
      localStorage.removeItem(STORAGE_KEYS.COLORS);
    } catch (e) {
      console.warn('Impossibile rimuovere colori da localStorage:', e);
    }
  }
  
  /**
   * Determina il tema effettivo da applicare
   * @param {string} theme - Tema richiesto (può essere 'auto')
   * @returns {string} Tema concreto da applicare
   */
  function resolveTheme(theme) {
    if (theme === THEMES.AUTO) {
      return prefersDarkQuery.matches ? THEMES.DARK : THEMES.LIGHT;
    }
    return theme;
  }
  
  /**
   * Applica il tema al documento
   * @param {string} theme - Nome del tema da applicare
   */
  function applyTheme(theme) {
    const resolvedTheme = resolveTheme(theme);
    
    // Imposta attributo data-theme su html
    root.setAttribute('data-theme', resolvedTheme);
    
    // Imposta anche data-user-theme se non è auto
    if (theme === THEMES.AUTO) {
      root.removeAttribute('data-user-theme');
    } else {
      root.setAttribute('data-user-theme', theme);
    }
    
    // Ri-applica colori personalizzati se presenti
    const customColors = getSavedColors();
    if (customColors) {
      applyCustomColors(customColors);
    }
    
    // Dispatch evento per notificare il cambio tema
    window.dispatchEvent(new CustomEvent('theme-changed', { 
      detail: { theme: resolvedTheme, userTheme: theme }
    }));
  }
  
  /**
   * Applica colori personalizzati sovrascrivendo le variabili CSS
   * @param {Object} colors - Oggetto con {primary, secondary}
   */
  function applyCustomColors(colors) {
    if (!colors) return;
    
    if (colors.primary) {
      root.style.setProperty('--md-sys-color-primary', colors.primary);
      root.style.setProperty('--accent', colors.primary);
    }
    
    if (colors.secondary) {
      root.style.setProperty('--md-sys-color-secondary', colors.secondary);
    }
  }
  
  /**
   * Rimuove override dei colori personalizzati
   */
  function resetCustomColors() {
    root.style.removeProperty('--md-sys-color-primary');
    root.style.removeProperty('--md-sys-color-secondary');
    root.style.removeProperty('--accent');
  }
  
  /**
   * Handler per cambio preferenza sistema
   */
  function handleSystemThemeChange(e) {
    const currentTheme = getSavedTheme();
    if (currentTheme === THEMES.AUTO) {
      applyTheme(THEMES.AUTO);
    }
  }
  
  /**
   * Imposta un nuovo tema
   * @param {string} theme - Nome del tema ('light', 'dark', 'expressive', 'auto')
   */
  function setTheme(theme) {
    if (!Object.values(THEMES).includes(theme)) {
      console.warn(`Tema non valido: ${theme}. Uso default 'auto'.`);
      theme = THEMES.AUTO;
    }
    
    saveTheme(theme);
    applyTheme(theme);
  }
  
  /**
   * Imposta colori personalizzati
   * @param {Object} colors - Oggetto con {primary, secondary}
   * @returns {boolean} True se salvato con successo
   */
  function setCustomColors(colors) {
    if (!colors || (!colors.primary && !colors.secondary)) {
      console.warn('Colori non validi');
      return false;
    }
    
    saveColors(colors);
    applyCustomColors(colors);
    
    // Dispatch evento
    window.dispatchEvent(new CustomEvent('colors-changed', { 
      detail: { colors }
    }));
    
    return true;
  }
  
  /**
   * Ripristina i colori del tema corrente
   */
  function resetColors() {
    clearColors();
    resetCustomColors();
    
    // Ri-applica il tema per usare i colori default
    const currentTheme = getSavedTheme();
    applyTheme(currentTheme);
    
    // Dispatch evento
    window.dispatchEvent(new CustomEvent('colors-reset'));
  }
  
  /**
   * Ottiene il tema corrente effettivo
   * @returns {string} Tema corrente applicato
   */
  function getCurrentTheme() {
    return root.getAttribute('data-theme') || THEMES.LIGHT;
  }
  
  /**
   * Ottiene il tema scelto dall'utente (può essere 'auto')
   * @returns {string} Tema scelto dall'utente
   */
  function getUserTheme() {
    return root.getAttribute('data-user-theme') || getSavedTheme();
  }
  
  /**
   * Ottiene i colori personalizzati correnti
   * @returns {Object|null} Colori personalizzati o null
   */
  function getCustomColors() {
    return getSavedColors();
  }
  
  /**
   * Inizializza il theme manager
   * - Carica e applica tema salvato
   * - Setup listener per cambio preferenza sistema
   */
  function init() {
    // Carica tema salvato
    const savedTheme = getSavedTheme();
    applyTheme(savedTheme);
    
    // Ascolta cambi preferenza sistema
    prefersDarkQuery.addEventListener('change', handleSystemThemeChange);
    
    console.log(`[ThemeManager] Inizializzato con tema: ${savedTheme}`);
  }
  
  /**
   * Pulisce event listeners (per cleanup)
   */
  function destroy() {
    prefersDarkQuery.removeEventListener('change', handleSystemThemeChange);
  }
  
  // API pubblica
  return {
    // Costanti
    THEMES,
    
    // Metodi principali
    init,
    destroy,
    setTheme,
    setCustomColors,
    resetColors,
    
    // Getters
    getCurrentTheme,
    getUserTheme,
    getCustomColors,
    
    // Utility (per compatibilità con codice esistente)
    applyTheme,
    saveTheme: setTheme
  };
})();

// Esporta per uso globale
if (typeof window !== 'undefined') {
  window.ThemeManager = ThemeManager;
}
