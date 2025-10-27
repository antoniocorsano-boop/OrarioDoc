/**
 * orario-table.js - Logica del componente Tabella Orario
 * 
 * Gestisce:
 * - Generazione dinamica della griglia oraria
 * - Rendering delle lezioni
 * - Interazioni utente (click, hover, etc.)
 * - Comunicazione con storage per persistenza dati
 * - Accessibilità (ARIA attributes dinamici)
 * 
 * Segue le convenzioni OrarioDoc:
 * - Codice modulare e documentato
 * - Nomi variabili descrittivi (camelCase)
 * - Gestione errori esplicita
 * - Accessibilità first
 */

// ============================================================================
// COSTANTI
// ============================================================================

const DEFAULT_START_HOUR = 8;  // Ora inizio giornata scolastica
const DEFAULT_END_HOUR = 18;   // Ora fine giornata scolastica
const TIME_SLOT_MINUTES = 60;  // Durata slot (60 minuti = 1 ora)
const DAYS_OF_WEEK = ['Lunedì', 'Martedì', 'Mercoledì', 'Giovedì', 'Venerdì', 'Sabato'];
const DAYS_SHORT = ['Lun', 'Mar', 'Mer', 'Gio', 'Ven', 'Sab'];

// ============================================================================
// CLASSE ORARIO TABLE
// ============================================================================

/**
 * Classe per gestire il componente Tabella Orario
 */
class OrarioTable {
  /**
   * Costruttore
   * @param {HTMLElement} container - Elemento DOM contenitore della tabella
   * @param {Object} options - Opzioni configurazione
   */
  constructor(container, options = {}) {
    if (!container) {
      throw new Error('OrarioTable: container element is required');
    }
    
    this.container = container;
    this.options = {
      startHour: options.startHour || DEFAULT_START_HOUR,
      endHour: options.endHour || DEFAULT_END_HOUR,
      timeSlotMinutes: options.timeSlotMinutes || TIME_SLOT_MINUTES,
      showSaturday: options.showSaturday !== false, // default true
      lessons: options.lessons || [],
      onLessonClick: options.onLessonClick || null,
      onSlotClick: options.onSlotClick || null,
    };
    
    this.lessons = this.options.lessons;
    this.timeSlots = this._generateTimeSlots();
    
    this._init();
  }
  
  // ==========================================================================
  // METODI PRIVATI - Inizializzazione
  // ==========================================================================
  
  /**
   * Inizializza il componente
   * @private
   */
  _init() {
    this._render();
    this._attachEventListeners();
  }
  
  /**
   * Genera array di slot temporali
   * @private
   * @returns {Array} Array di stringhe orari (es. ['08:00', '09:00', ...])
   */
  _generateTimeSlots() {
    const slots = [];
    const { startHour, endHour, timeSlotMinutes } = this.options;
    
    for (let hour = startHour; hour < endHour; hour++) {
      // Supporta slot di 60 minuti (standard) o altre durate
      const iterations = 60 / timeSlotMinutes;
      for (let i = 0; i < iterations; i++) {
        const minutes = i * timeSlotMinutes;
        const timeString = `${String(hour).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
        slots.push(timeString);
      }
    }
    
    return slots;
  }
  
  /**
   * Renderizza l'intera tabella
   * @private
   */
  _render() {
    this.container.innerHTML = '';
    this.container.className = 'orario-table';
    this.container.setAttribute('role', 'table');
    this.container.setAttribute('aria-label', 'Tabella orario settimanale');
    
    // Render header
    const header = this._renderHeader();
    this.container.appendChild(header);
    
    // Render body
    const body = this._renderBody();
    this.container.appendChild(body);
    
    // Render footer (placeholder)
    const footer = this._renderFooter();
    this.container.appendChild(footer);
  }
  
  /**
   * Renderizza l'header della tabella (giorni settimana)
   * @private
   * @returns {HTMLElement}
   */
  _renderHeader() {
    const header = document.createElement('div');
    header.className = 'orario-table__header';
    header.setAttribute('role', 'rowgroup');
    
    const row = document.createElement('div');
    row.className = 'orario-table__row';
    row.setAttribute('role', 'row');
    
    // Colonna vuota per le ore
    const timeCell = document.createElement('div');
    timeCell.className = 'orario-table__header-cell orario-table__header-cell--time';
    timeCell.setAttribute('role', 'columnheader');
    const hiddenLabel = document.createElement('span');
    hiddenLabel.className = 'visually-hidden';
    hiddenLabel.textContent = 'Ora';
    timeCell.appendChild(hiddenLabel);
    row.appendChild(timeCell);
    
    // Giorni della settimana
    const daysToShow = this.options.showSaturday ? 6 : 5;
    for (let i = 0; i < daysToShow; i++) {
      const dayCell = document.createElement('div');
      dayCell.className = 'orario-table__header-cell';
      if (i === 5) { // Sabato è opzionale
        dayCell.classList.add('orario-table__header-cell--optional');
      }
      dayCell.setAttribute('role', 'columnheader');
      
      const fullLabel = document.createElement('span');
      fullLabel.className = 'orario-table__day-label';
      fullLabel.textContent = DAYS_OF_WEEK[i];
      
      const shortLabel = document.createElement('span');
      shortLabel.className = 'orario-table__day-label--short';
      shortLabel.setAttribute('aria-hidden', 'true');
      shortLabel.textContent = DAYS_SHORT[i];
      
      dayCell.appendChild(fullLabel);
      dayCell.appendChild(shortLabel);
      row.appendChild(dayCell);
    }
    
    header.appendChild(row);
    return header;
  }
  
  /**
   * Renderizza il body della tabella (slot orari e lezioni)
   * @private
   * @returns {HTMLElement}
   */
  _renderBody() {
    const body = document.createElement('div');
    body.className = 'orario-table__body';
    body.setAttribute('role', 'rowgroup');
    
    // Per ogni slot temporale, crea una riga
    this.timeSlots.forEach(timeSlot => {
      const row = this._renderTimeSlotRow(timeSlot);
      body.appendChild(row);
    });
    
    return body;
  }
  
  /**
   * Renderizza una riga per uno slot temporale
   * @private
   * @param {string} timeSlot - Orario (es. '08:00')
   * @returns {HTMLElement}
   */
  _renderTimeSlotRow(timeSlot) {
    const row = document.createElement('div');
    row.className = 'orario-table__row';
    row.setAttribute('role', 'row');
    
    // Colonna orario
    const timeCell = document.createElement('div');
    timeCell.className = 'orario-table__cell orario-table__cell--time';
    timeCell.setAttribute('role', 'cell');
    const timeLabel = document.createElement('span');
    timeLabel.className = 'orario-table__time-label';
    timeLabel.textContent = timeSlot;
    timeCell.appendChild(timeLabel);
    row.appendChild(timeCell);
    
    // Celle per ogni giorno
    const daysToShow = this.options.showSaturday ? 6 : 5;
    for (let day = 0; day < daysToShow; day++) {
      const cell = this._renderCell(day, timeSlot);
      row.appendChild(cell);
    }
    
    return row;
  }
  
  /**
   * Renderizza una cella (vuota o con lezione)
   * @private
   * @param {number} day - Giorno (0=Lunedì, 5=Sabato)
   * @param {string} timeSlot - Orario
   * @returns {HTMLElement}
   */
  _renderCell(day, timeSlot) {
    const cell = document.createElement('div');
    cell.className = 'orario-table__cell';
    cell.setAttribute('role', 'cell');
    cell.dataset.day = day;
    cell.dataset.time = timeSlot;
    
    // Cerca se c'è una lezione in questo slot
    const lesson = this._findLesson(day, timeSlot);
    
    if (lesson) {
      const lessonElement = this._renderLesson(lesson);
      cell.appendChild(lessonElement);
    } else {
      const emptySlot = this._renderEmptySlot(day, timeSlot);
      cell.appendChild(emptySlot);
    }
    
    return cell;
  }
  
  /**
   * Renderizza uno slot vuoto con pulsante add
   * @private
   * @param {number} day - Giorno
   * @param {string} timeSlot - Orario
   * @returns {HTMLElement}
   */
  _renderEmptySlot(day, timeSlot) {
    const slot = document.createElement('div');
    slot.className = 'orario-table__slot';
    slot.dataset.empty = 'true';
    
    const addBtn = document.createElement('button');
    addBtn.className = 'orario-table__add-btn';
    addBtn.setAttribute('aria-label', `Aggiungi lezione ${DAYS_OF_WEEK[day]} alle ${timeSlot}`);
    addBtn.dataset.day = day;
    addBtn.dataset.time = timeSlot;
    
    // Icona +
    const icon = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    icon.setAttribute('class', 'orario-table__add-icon');
    icon.setAttribute('aria-hidden', 'true');
    icon.setAttribute('viewBox', '0 0 24 24');
    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path.setAttribute('d', 'M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z');
    icon.appendChild(path);
    addBtn.appendChild(icon);
    
    slot.appendChild(addBtn);
    return slot;
  }
  
  /**
   * Renderizza una card lezione
   * @private
   * @param {Object} lesson - Dati lezione
   * @returns {HTMLElement}
   */
  _renderLesson(lesson) {
    const lessonCard = document.createElement('div');
    lessonCard.className = 'orario-table__lesson';
    lessonCard.dataset.lessonId = lesson.id;
    lessonCard.dataset.subject = lesson.subject || '';
    lessonCard.setAttribute('role', 'button');
    lessonCard.setAttribute('tabindex', '0');
    lessonCard.setAttribute('aria-label', `Lezione ${lesson.name}, classe ${lesson.class || ''}, ${lesson.duration || 60} minuti`);
    
    // Title
    const title = document.createElement('h3');
    title.className = 'orario-table__lesson-title';
    title.textContent = lesson.name;
    lessonCard.appendChild(title);
    
    // Class (se presente)
    if (lesson.class) {
      const classLabel = document.createElement('p');
      classLabel.className = 'orario-table__lesson-class';
      classLabel.textContent = lesson.class;
      lessonCard.appendChild(classLabel);
    }
    
    // Duration
    const duration = document.createElement('span');
    duration.className = 'orario-table__lesson-duration';
    duration.textContent = `${lesson.duration || 60} min`;
    lessonCard.appendChild(duration);
    
    return lessonCard;
  }
  
  /**
   * Renderizza il footer
   * @private
   * @returns {HTMLElement}
   */
  _renderFooter() {
    const footer = document.createElement('div');
    footer.className = 'orario-table__footer';
    footer.setAttribute('role', 'rowgroup');
    // Placeholder per future funzionalità
    return footer;
  }
  
  // ==========================================================================
  // METODI PRIVATI - Utilità
  // ==========================================================================
  
  /**
   * Trova una lezione per giorno e orario
   * @private
   * @param {number} day - Giorno
   * @param {string} timeSlot - Orario
   * @returns {Object|null} Lezione trovata o null
   */
  _findLesson(day, timeSlot) {
    return this.lessons.find(lesson => {
      return lesson.day === day && lesson.time === timeSlot;
    });
  }
  
  /**
   * Attacca gli event listener
   * @private
   */
  _attachEventListeners() {
    // Delegazione eventi sul container
    this.container.addEventListener('click', this._handleClick.bind(this));
    this.container.addEventListener('keydown', this._handleKeydown.bind(this));
  }
  
  /**
   * Gestisce click su elementi
   * @private
   * @param {Event} event
   */
  _handleClick(event) {
    const target = event.target.closest('.orario-table__add-btn, .orario-table__lesson');
    
    if (!target) return;
    
    if (target.classList.contains('orario-table__add-btn')) {
      // Click su pulsante add
      const day = parseInt(target.dataset.day, 10);
      const time = target.dataset.time;
      
      if (this.options.onSlotClick) {
        this.options.onSlotClick({ day, time });
      }
    } else if (target.classList.contains('orario-table__lesson')) {
      // Click su lezione
      const lessonId = target.dataset.lessonId;
      const lesson = this.lessons.find(l => l.id === lessonId);
      
      if (this.options.onLessonClick && lesson) {
        this.options.onLessonClick(lesson);
      }
    }
  }
  
  /**
   * Gestisce navigazione da tastiera
   * @private
   * @param {Event} event
   */
  _handleKeydown(event) {
    const target = event.target;
    
    // Enter o Space su elementi interattivi
    if ((event.key === 'Enter' || event.key === ' ') && 
        (target.classList.contains('orario-table__add-btn') || 
         target.classList.contains('orario-table__lesson'))) {
      event.preventDefault();
      target.click();
    }
  }
  
  // ==========================================================================
  // METODI PUBBLICI - API
  // ==========================================================================
  
  /**
   * Aggiorna le lezioni e re-renderizza
   * @param {Array} lessons - Array di lezioni
   */
  updateLessons(lessons) {
    this.lessons = lessons;
    this._render();
    this._attachEventListeners();
  }
  
  /**
   * Aggiungi una lezione
   * @param {Object} lesson - Dati lezione
   */
  addLesson(lesson) {
    this.lessons.push(lesson);
    this._render();
    this._attachEventListeners();
  }
  
  /**
   * Rimuovi una lezione
   * @param {string} lessonId - ID lezione
   */
  removeLesson(lessonId) {
    this.lessons = this.lessons.filter(l => l.id !== lessonId);
    this._render();
    this._attachEventListeners();
  }
  
  /**
   * Aggiorna opzioni e re-renderizza
   * @param {Object} options - Nuove opzioni
   */
  updateOptions(options) {
    this.options = { ...this.options, ...options };
    this.timeSlots = this._generateTimeSlots();
    this._render();
    this._attachEventListeners();
  }
  
  /**
   * Destroy - rimuove listener e pulisce DOM
   */
  destroy() {
    this.container.removeEventListener('click', this._handleClick);
    this.container.removeEventListener('keydown', this._handleKeydown);
    this.container.innerHTML = '';
  }
}

// ============================================================================
// EXPORT
// ============================================================================

// Export per uso come modulo
if (typeof module !== 'undefined' && module.exports) {
  module.exports = OrarioTable;
}

// Export globale per uso diretto in browser
if (typeof window !== 'undefined') {
  window.OrarioTable = OrarioTable;
}
