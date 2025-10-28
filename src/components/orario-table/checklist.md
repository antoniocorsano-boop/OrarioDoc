# Checklist Implementazione Tabella Orario

Questa checklist traccia lo stato di implementazione e testing del componente Tabella Orario.

## 📦 Struttura Base

- [x] Creata cartella `src/components/orario-table/`
- [x] File `orario-table.html` con template struttura
- [x] File `orario-table.css` con stili MD3
- [x] File `orario-table.js` con logica componente
- [x] File `README.md` con documentazione completa
- [x] File `checklist.md` (questo file)

## 🎨 CSS e Stili

- [x] Uso esclusivo variabili da `theme.css`
- [x] Zero valori hardcoded
- [x] Layout griglia responsive
- [x] Header sticky con giorni settimana
- [x] Celle slot orari
- [x] Card lezioni con varianti colore
- [x] Stati hover, focus, active
- [x] Transizioni smooth
- [x] Responsive breakpoint (mobile, tablet, desktop)
- [x] Label giorni complete e abbreviate
- [ ] Test visivo tema light
- [ ] Test visivo tema dark
- [ ] Test visivo tema expressive
- [ ] Test responsive mobile (< 600px)
- [ ] Test responsive tablet (600-900px)
- [ ] Test responsive desktop (> 900px)

## 💻 JavaScript

- [x] Classe `OrarioTable` con costruttore
- [x] Generazione dinamica slot temporali
- [x] Rendering header
- [x] Rendering body con celle
- [x] Rendering lezioni con card
- [x] Rendering slot vuoti con pulsante add
- [x] Event delegation (click)
- [x] Keyboard navigation (Enter, Space)
- [x] API pubblica: `updateLessons()`
- [x] API pubblica: `addLesson()`
- [x] API pubblica: `removeLesson()`
- [x] API pubblica: `updateOptions()`
- [x] API pubblica: `destroy()`
- [ ] Test funzionamento add lezione
- [ ] Test funzionamento edit lezione
- [ ] Test funzionamento remove lezione
- [ ] Test aggiornamento dinamico
- [ ] Test gestione errori
- [ ] Test performance con molte lezioni (>50)

## ♿ Accessibilità

- [x] Attributi ARIA roles (table, row, cell, columnheader)
- [x] Label descrittive (`aria-label`)
- [x] Navigazione da tastiera
- [x] Focus visible con outline
- [x] Screen reader friendly (label nascosti)
- [x] Supporto high contrast mode
- [x] Supporto reduced motion
- [ ] Test con screen reader (NVDA/JAWS)
- [ ] Test navigazione solo tastiera
- [ ] Test con VoiceOver (macOS/iOS)
- [ ] Validazione WCAG 2.1 Level AA
- [ ] Test contrasto colori

## 📱 Responsive

- [x] Mobile-first approach
- [x] Griglia adattiva
- [x] Nascondi Sabato su mobile
- [x] Label giorni responsive
- [x] Padding e spacing scalabili
- [x] Font size scalabili
- [ ] Test iPhone SE (375px)
- [ ] Test iPhone 12/13 (390px)
- [ ] Test iPhone 14 Pro Max (430px)
- [ ] Test iPad (768px)
- [ ] Test iPad Pro (1024px)
- [ ] Test Desktop HD (1920px)

## 🔧 Funzionalità

### Implementate
- [x] Visualizzazione griglia oraria
- [x] Slot orari configurabili (start/end hour)
- [x] Giorni settimana configurabili (con/senza sabato)
- [x] Card lezioni con nome, classe, durata
- [x] Varianti colore per materie
- [x] Click su lezione (callback)
- [x] Click su slot vuoto (callback)
- [x] Aggiornamento dinamico lezioni

### Da Implementare
- [ ] Drag & Drop lezioni
- [ ] Multi-slot per lezioni lunghe
- [ ] Resize lezioni (durata dinamica)
- [ ] Conflict detection
- [ ] Undo/Redo
- [ ] Copy/Paste lezioni
- [ ] Export PDF
- [ ] Stampa ottimizzata
- [ ] Filtri materie/classi
- [ ] Ricerca lezioni
- [ ] View alternative (lista, calendario)

## 📖 Documentazione

- [x] README.md componente completo
- [x] Esempi di utilizzo
- [x] Documentazione API
- [x] Formato dati lezioni
- [x] Opzioni configurazione
- [x] Guida responsive
- [x] Guida accessibilità
- [ ] Aggiornato `docs/COMPONENTS.md`
- [ ] Creato `docs/INDEX.md` (se necessario)
- [ ] Creato `README_TEMPLATE_COMPONENT.md`
- [ ] Esempi codice funzionanti
- [ ] Screenshot componente
- [ ] Video demo (opzionale)

## 🧪 Testing

### Unit Test
- [ ] Test costruttore
- [ ] Test rendering
- [ ] Test add/remove lessons
- [ ] Test event handlers
- [ ] Test keyboard navigation
- [ ] Test destroy

### Integration Test
- [ ] Test con storage.js
- [ ] Test con main.js
- [ ] Test form aggiungi lezione
- [ ] Test form modifica lezione
- [ ] Test sincronizzazione dati

### Visual Test
- [ ] Screenshot tema light
- [ ] Screenshot tema dark
- [ ] Screenshot tema expressive
- [ ] Screenshot responsive mobile
- [ ] Screenshot responsive tablet
- [ ] Screenshot responsive desktop

### Accessibility Test
- [ ] axe DevTools scan
- [ ] WAVE scan
- [ ] Lighthouse accessibility score >= 95
- [ ] Manual keyboard test
- [ ] Manual screen reader test

## 🔒 Sicurezza

- [x] Nessun innerHTML con dati utente non sanitizzati
- [x] Validazione input
- [x] XSS prevention
- [ ] CSP compliance check
- [ ] Security audit

## 🚀 Performance

- [x] Event delegation invece di listener multipli
- [x] Efficient DOM manipulation
- [ ] Test performance rendering (>100 lessons)
- [ ] Profiling Chrome DevTools
- [ ] Lighthouse performance score >= 90
- [ ] Bundle size check
- [ ] Lazy loading (se necessario)

## 🔄 Integrazione

- [ ] Incluso in `index.html` principale
- [ ] Link CSS in `<head>`
- [ ] Script JS caricato
- [ ] Test integrazione con storage
- [ ] Test integrazione con modal form
- [ ] Test integrazione con settings
- [ ] Test sincronizzazione tema

## ✅ Quality Gates

Prima di considerare il componente "completo":

- [ ] Tutti i CSS test visivi passati (3 temi x 3 viewport = 9 test)
- [ ] Tutti i test accessibilità passati
- [ ] Tutti i test responsive passati
- [ ] Documentazione completa e aggiornata
- [ ] Esempi funzionanti inclusi
- [ ] Performance accettabile
- [ ] Code review completato
- [ ] Approvazione stakeholder

## 📝 Note

### Decisioni Design
- Slot di 60 minuti per default (standard ora scolastica)
- Sabato incluso per flessibilità (nascondibile)
- Colori materie basati su MD3 color roles
- Focus su accessibilità da subito

### Problemi Noti
- Nessuno al momento (componente in fase iniziale)

### Miglioramenti Futuri
- Valutare virtualizzazione per performance con molte lezioni
- Considerare Web Components per encapsulation
- Aggiungere animazioni transizione più ricche

---

**Ultima modifica:** 2025-10-27  
**Versione:** 0.1.0 (Skeleton)  
**Stato:** 🟡 In sviluppo
