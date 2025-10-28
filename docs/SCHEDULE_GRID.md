# Schedule Grid Component

## Overview

Il componente Schedule Grid (`schedule-grid.js`) è il cuore dell'applicazione OrarioDoc. Gestisce la visualizzazione interattiva della griglia settimanale dell'orario scolastico e permette agli utenti di aggiungere, modificare e visualizzare le lezioni.

## Struttura

### File
- **Posizione**: `/src/schedule-grid.js`
- **Dipendenze**: Nessuna (modulo standalone)
- **Export**: `window.ScheduleGrid`

### API Pubblica

```javascript
window.ScheduleGrid = {
  createGrid(container),
  renderLessons(container, lessons)
}
```

## Funzionalità

### 1. Creazione Griglia (`createGrid`)

Crea la struttura della griglia settimanale con 7 colonne (una per ogni giorno).

**Parametri:**
- `container` (HTMLElement): L'elemento DOM che conterrà la griglia

**Comportamento:**
- Pulisce il contenuto esistente del container
- Crea 7 celle, una per ogni giorno della settimana
- Ogni cella include:
  - Header con il nome del giorno (Dom, Lun, Mar, Mer, Gio, Ven, Sab)
  - Attributo `data-day` con il numero del giorno (0-6, dove 0=Domenica)
  - Attributi ARIA per accessibilità
  - Event listeners per click e tastiera

**Esempio:**
```javascript
const gridEl = document.getElementById('scheduleGrid');
ScheduleGrid.createGrid(gridEl);
```

### 2. Rendering Lezioni (`renderLessons`)

Visualizza le lezioni nella griglia, raggruppandole per giorno.

**Parametri:**
- `container` (HTMLElement): L'elemento DOM della griglia
- `lessons` (Array): Array di oggetti lezione

**Formato Oggetto Lezione:**
```javascript
{
  id: 'unique-id',           // ID univoco
  name: 'Matematica',        // Nome della lezione
  class: '3A',               // Classe (opzionale)
  day: 1,                    // Giorno (0-6)
  start: '08:00',            // Ora inizio (formato HH:MM)
  duration: 60               // Durata in minuti
}
```

**Comportamento:**
- Rimuove tutte le lezioni esistenti dalla griglia
- Raggruppa le lezioni per giorno per ottimizzare il rendering
- Usa DocumentFragment per minimizzare i reflow DOM
- Crea elementi lezione con:
  - Nome e classe
  - Ora di inizio e durata
  - Event listeners per click e tastiera
  - Attributi ARIA per accessibilità

**Esempio:**
```javascript
const lessons = [
  { id: '1', name: 'Matematica', class: '3A', day: 1, start: '08:00', duration: 60 },
  { id: '2', name: 'Fisica', class: '3B', day: 2, start: '09:00', duration: 60 }
];
ScheduleGrid.renderLessons(gridEl, lessons);
```

## Eventi Personalizzati

Il componente emette eventi personalizzati per la comunicazione con altre parti dell'applicazione:

### `schedule-cell-click`

Emesso quando l'utente clicca su una cella vuota della griglia o preme Enter/Space su di essa.

**Dettaglio Evento:**
```javascript
{
  detail: {
    day: 1  // Numero del giorno (0-6)
  }
}
```

**Esempio di Ascolto:**
```javascript
window.addEventListener('schedule-cell-click', (e) => {
  console.log(`Cella cliccata: giorno ${e.detail.day}`);
  // Aprire modale per aggiungere nuova lezione
});
```

### `lesson-click`

Emesso quando l'utente clicca su una lezione esistente o preme Enter/Space su di essa.

**Dettaglio Evento:**
```javascript
{
  detail: {
    id: 'lesson-id'  // ID della lezione
  }
}
```

**Esempio di Ascolto:**
```javascript
window.addEventListener('lesson-click', (e) => {
  console.log(`Lezione cliccata: ID ${e.detail.id}`);
  // Aprire modale per modificare lezione
});
```

## Accessibilità

Il componente è progettato seguendo le linee guida WCAG 2.1 Level AA:

### Struttura ARIA

- **Griglia**: `role="grid"` con `aria-label="Griglia orario settimanale"`
- **Celle**: `role="gridcell"` con `aria-label` descrittivo (es. "Lunedì, clicca per aggiungere lezione")
- **Lezioni**: `role="button"` con `aria-label` dettagliato (es. "Lezione: Matematica classe 3A alle 08:00, durata 60 minuti, clicca per modificare")

### Navigazione da Tastiera

#### Celle della Griglia
- **Tab**: Sposta il focus tra le celle
- **Enter/Space**: Attiva la cella (apre modale per aggiungere lezione)
- **Arrow Left/Right**: Naviga tra le celle orizzontalmente
- **Arrow Up/Down**: Naviga tra le celle verticalmente (3 celle alla volta)

#### Elementi Lezione
- **Tab**: Sposta il focus tra le lezioni
- **Enter/Space**: Attiva la lezione (apre modale per modificare)

### Annunci per Screen Reader

Gli header delle celle hanno `aria-hidden="true"` perché le informazioni sono già fornite nell'`aria-label` delle celle.

## Performance

### Ottimizzazioni Implementate

1. **DocumentFragment**: Le lezioni sono costruite in un DocumentFragment prima di essere aggiunte al DOM, minimizzando i reflow
2. **Raggruppamento per Giorno**: Le lezioni sono raggruppate per giorno prima del rendering per ridurre le query DOM
3. **Sicurezza XSS**: Uso di `textContent` invece di `innerHTML` per prevenire attacchi XSS
4. **Event Delegation**: Gli eventi sono gestiti a livello di container dove possibile

### Best Practices

- Non chiamare `renderLessons` troppo frequentemente
- Raggruppare le modifiche multiple prima di chiamare `renderLessons`
- Usare `requestAnimationFrame` per animazioni smooth se necessario

## Integrazione con Storage

Il componente Schedule Grid è stateless e non gestisce direttamente la persistenza dei dati. La gestione dello storage è delegata al modulo `storage.js`.

**Pattern di Utilizzo Tipico:**

```javascript
// 1. Inizializzazione
const gridEl = document.getElementById('scheduleGrid');
ScheduleGrid.createGrid(gridEl);

// 2. Caricamento dati dallo storage
const data = await Storage.read();
ScheduleGrid.renderLessons(gridEl, data.lessons || []);

// 3. Ascolto eventi
window.addEventListener('schedule-cell-click', async (e) => {
  // Mostrare modale per aggiungere lezione
});

window.addEventListener('lesson-click', async (e) => {
  // Mostrare modale per modificare lezione
});

// 4. Salvataggio dopo modifiche
async function saveLesson(lesson) {
  const data = await Storage.read();
  data.lessons.push(lesson);
  await Storage.write(data);
  ScheduleGrid.renderLessons(gridEl, data.lessons);
}
```

## Stile CSS

Il componente si aspetta le seguenti classi CSS:

```css
.schedule-grid {
  /* Container principale */
}

.cell {
  /* Cella giorno */
}

.cell-header {
  /* Header con nome giorno */
}

.item {
  /* Elemento lezione */
}

.item-name {
  /* Nome lezione */
}

.item-time {
  /* Orario lezione */
}
```

Gli stili sono definiti in `/style.css`.

## Testing

Il componente è testato in:
- `/tests/unit-tests.js` - Test unitari per la logica di rendering
- `/playwright-tests/persistence-interactive.spec.js` - Test end-to-end per interazioni

### Test Coverage

- ✅ Creazione griglia con 7 colonne
- ✅ Rendering multiplo di lezioni
- ✅ Eventi click su celle e lezioni
- ✅ Navigazione con tastiera
- ✅ Attributi ARIA corretti
- ✅ Prevenzione XSS

## Esempi Completi

### Esempio 1: Setup Base

```javascript
// Inizializzazione base
const container = document.getElementById('scheduleGrid');
ScheduleGrid.createGrid(container);

const lessons = [
  { id: '1', name: 'Math', day: 1, start: '08:00', duration: 60 },
  { id: '2', name: 'Physics', day: 2, start: '09:00', duration: 60 }
];

ScheduleGrid.renderLessons(container, lessons);
```

### Esempio 2: Aggiunta Lezione Dinamica

```javascript
window.addEventListener('schedule-cell-click', async (e) => {
  const newLesson = {
    id: generateId(),
    name: 'New Lesson',
    day: e.detail.day,
    start: '10:00',
    duration: 60
  };
  
  const data = await Storage.read();
  data.lessons.push(newLesson);
  await Storage.write(data);
  
  ScheduleGrid.renderLessons(container, data.lessons);
});
```

### Esempio 3: Modifica Lezione

```javascript
window.addEventListener('lesson-click', async (e) => {
  const data = await Storage.read();
  const lesson = data.lessons.find(l => l.id === e.detail.id);
  
  if (lesson) {
    // Mostra modale di modifica
    showEditModal(lesson);
  }
});

async function saveEditedLesson(updatedLesson) {
  const data = await Storage.read();
  const index = data.lessons.findIndex(l => l.id === updatedLesson.id);
  
  if (index !== -1) {
    data.lessons[index] = updatedLesson;
    await Storage.write(data);
    ScheduleGrid.renderLessons(container, data.lessons);
  }
}
```

## Troubleshooting

### Problema: Le lezioni non appaiono dopo il rendering

**Soluzione**: Verificare che:
1. Il container abbia l'ID corretto
2. L'array di lezioni sia valido e non vuoto
3. Ogni lezione abbia un `day` valido (0-6)
4. CSS sia caricato correttamente

### Problema: Eventi click non funzionano

**Soluzione**: Verificare che:
1. `createGrid` sia stato chiamato prima di `renderLessons`
2. Event listeners siano registrati sul `window` object
3. Non ci siano `stopPropagation()` che bloccano gli eventi

### Problema: Navigazione tastiera non funziona

**Soluzione**: Verificare che:
1. Le celle abbiano `tabindex="0"`
2. Il focus sia visibile (outline CSS non disabilitato)
3. Event listeners per `keydown` siano registrati

## Roadmap Futura

- [ ] Supporto drag & drop per riorganizzare lezioni
- [ ] Vista settimanale multipla (più settimane)
- [ ] Zoom e scroll per orari densi
- [ ] Colori personalizzabili per tipo di lezione
- [ ] Export/import formato iCal
- [ ] Print-friendly stylesheet

## Riferimenti

- [ARIA Authoring Practices - Grid Pattern](https://www.w3.org/WAI/ARIA/apg/patterns/grid/)
- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [DocumentFragment su MDN](https://developer.mozilla.org/en-US/docs/Web/API/DocumentFragment)
