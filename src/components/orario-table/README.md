# Componente Tabella Orario

Componente per visualizzare e gestire la tabella orario scolastico settimanale secondo Material Design 3 (Expressive theme).

## 📋 Descrizione

La Tabella Orario è un componente centrale di OrarioDoc che permette di:
- Visualizzare l'orario settimanale in formato griglia
- Mostrare le lezioni con informazioni (nome, classe, durata)
- Aggiungere nuove lezioni tramite pulsanti interattivi
- Modificare lezioni esistenti (click su card)
- Supportare diverse visualizzazioni responsive (desktop, tablet, mobile)

## 🎨 Design

Il componente segue le linee guida Material Design 3:
- **Layout**: Griglia responsive con giorni e fasce orarie
- **Colori**: Usa esclusivamente variabili da `theme.css`
- **Tipografia**: Roboto Flex con scale tipografiche MD3
- **Elevazioni**: Shadow e stati hover secondo MD3
- **Stati**: Hover, focus, active, disabled gestiti
- **Accessibilità**: WCAG 2.1 Level AA compliant

## 📁 Struttura File

```
src/components/orario-table/
├── orario-table.html      # Template HTML struttura base
├── orario-table.css       # Stili componente (solo variabili CSS)
├── orario-table.js        # Logica e rendering dinamico
├── README.md              # Questa documentazione
└── checklist.md           # Checklist implementazione/testing
```

## 🚀 Utilizzo

### HTML

Include il template HTML nella tua pagina oppure usa il JavaScript per generare dinamicamente:

```html
<div id="scheduleContainer"></div>

<script src="/src/components/orario-table/orario-table.js"></script>
```

### CSS

Include gli stili nel tuo HTML:

```html
<link rel="stylesheet" href="/theme.css"/>
<link rel="stylesheet" href="/src/components/orario-table/orario-table.css"/>
```

### JavaScript

Inizializza il componente:

```javascript
const container = document.getElementById('scheduleContainer');

const orarioTable = new OrarioTable(container, {
  startHour: 8,
  endHour: 18,
  timeSlotMinutes: 60,
  showSaturday: true,
  lessons: [
    {
      id: '1',
      name: 'Matematica',
      class: '3A',
      subject: 'matematica',
      day: 0, // Lunedì
      time: '08:00',
      duration: 60
    },
    {
      id: '2',
      name: 'Italiano',
      class: '3A',
      subject: 'italiano',
      day: 1, // Martedì
      time: '09:00',
      duration: 60
    }
  ],
  onLessonClick: (lesson) => {
    console.log('Lezione cliccata:', lesson);
    // Apri modal modifica
  },
  onSlotClick: ({ day, time }) => {
    console.log('Slot vuoto cliccato:', day, time);
    // Apri modal aggiungi lezione
  }
});
```

## ⚙️ Opzioni

| Opzione | Tipo | Default | Descrizione |
|---------|------|---------|-------------|
| `startHour` | Number | 8 | Ora inizio giornata scolastica (0-23) |
| `endHour` | Number | 18 | Ora fine giornata scolastica (0-23) |
| `timeSlotMinutes` | Number | 60 | Durata slot in minuti |
| `showSaturday` | Boolean | true | Mostra colonna Sabato |
| `lessons` | Array | [] | Array di lezioni da visualizzare |
| `onLessonClick` | Function | null | Callback click su lezione |
| `onSlotClick` | Function | null | Callback click su slot vuoto |

## 📊 Formato Dati Lezione

```javascript
{
  id: 'unique-id',           // ID univoco (obbligatorio)
  name: 'Matematica',        // Nome materia (obbligatorio)
  class: '3A',               // Classe (opzionale)
  subject: 'matematica',     // Slug materia per colore (opzionale)
  day: 0,                    // Giorno: 0=Lun, 1=Mar, ..., 5=Sab (obbligatorio)
  time: '08:00',             // Orario inizio HH:MM (obbligatorio)
  duration: 60               // Durata in minuti (opzionale, default 60)
}
```

## 🎨 Colori Materie

Il componente supporta diverse varianti colore per materie tramite `data-subject`:

- **matematica**: Primary container (blu/viola)
- **italiano**: Secondary container (rosa/corallo)
- **storia, geografia**: Tertiary container (verde/giallo)
- **inglese, lingue**: Error container (rosso/arancio)
- **default**: Primary container

Per aggiungere nuove materie, modifica il CSS in `orario-table.css` sezione "Varianti colore per materie".

## 📱 Responsive

Il componente è completamente responsive:

### Desktop (> 900px)
- 6 colonne giorni + 1 colonna orari
- Label giorni complete
- Slot 80px altezza minima

### Tablet (600px - 900px)
- 5 colonne giorni (nasconde Sabato)
- Label giorni abbreviate (Lun, Mar, ...)
- Slot 70px altezza minima

### Mobile (< 600px)
- 3 colonne giorni visibili (scroll orizzontale)
- Label giorni abbreviate
- Slot 60px altezza minima
- Padding ridotto

## ♿ Accessibilità

Il componente è accessibile e include:

- **Ruoli ARIA**: `role="table"`, `role="row"`, `role="cell"`, `role="columnheader"`
- **Label descrittive**: `aria-label` su elementi interattivi
- **Navigazione tastiera**: Tab, Enter, Space
- **Focus visibile**: Outline 2px primary color
- **Screen reader**: Label nascosti per contesto
- **High contrast**: Supporto modalità alto contrasto
- **Reduced motion**: Animazioni disabilitabili

## 🔧 API Metodi

### `updateLessons(lessons)`
Aggiorna array lezioni e re-renderizza tabella.

```javascript
orarioTable.updateLessons(newLessons);
```

### `addLesson(lesson)`
Aggiunge una singola lezione.

```javascript
orarioTable.addLesson({
  id: '3',
  name: 'Storia',
  day: 2,
  time: '10:00'
});
```

### `removeLesson(lessonId)`
Rimuove una lezione per ID.

```javascript
orarioTable.removeLesson('3');
```

### `updateOptions(options)`
Aggiorna opzioni componente.

```javascript
orarioTable.updateOptions({
  showSaturday: false,
  startHour: 9
});
```

### `destroy()`
Distrugge il componente, rimuove listener e pulisce DOM.

```javascript
orarioTable.destroy();
```

## 🧪 Testing

Per testare il componente:

1. Apri `index.html` nel browser
2. Include il componente nella pagina
3. Verifica:
   - Rendering corretto su diversi temi (light, dark, expressive)
   - Responsive su mobile, tablet, desktop
   - Interazioni click e keyboard
   - Accessibilità con screen reader

## 🚧 Funzionalità Future

- [ ] Drag & Drop per spostare lezioni
- [ ] Multi-slot per lezioni lunghe (> 60 min)
- [ ] Filtri per materia/classe
- [ ] Export PDF/immagine
- [ ] Stampa ottimizzata
- [ ] Sincronizzazione con calendar esterno
- [ ] Conflitti automatici rilevamento
- [ ] View settimanale/mensile alternative

## 📚 Riferimenti

- [Material Design 3 - Data Tables](https://m3.material.io/components/data-tables)
- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [OrarioDoc Style Guide](../../../docs/STYLE_GUIDE.md)
- [OrarioDoc Components](../../../docs/COMPONENTS.md)

## 🤝 Contribuire

Per contribuire al componente:

1. Leggi [CONTRIBUTING.md](../../../CONTRIBUTING.md)
2. Segui [Style Guide](../../../docs/STYLE_GUIDE.md)
3. Usa solo variabili da `theme.css`
4. Testa accessibilità
5. Aggiorna questa documentazione
6. Compila `checklist.md`

## 📄 Licenza

MIT License - vedi [LICENSE](../../../LICENSE)
