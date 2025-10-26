# 🗺️ OrarioDoc - Roadmap Sviluppo

**Versione:** 1.0  
**Ultimo aggiornamento:** Ottobre 2025  
**Stato:** In corso

---

## 📋 Panoramica

Questo documento definisce il piano di sviluppo di OrarioDoc organizzato per priorità. Ogni task è stato progettato per essere implementato in modo incrementale e tracciato come issue separata.

### Obiettivi Generali
- ✅ Consolidare il sistema UI/UX basato su Material Design 3
- ✅ Garantire accessibilità WCAG 2.1 Level AA in tutta l'applicazione
- ✅ Implementare funzionalità core complete e testate
- ✅ Ottimizzare performance e esperienza utente
- ✅ Mantenere documentazione aggiornata e completa

### Principi di Sviluppo
1. **Mobile-first**: Design responsive con focus su dispositivi mobili
2. **Privacy-first**: Tutti i dati rimangono sul dispositivo dell'utente
3. **Accessibility-first**: WCAG 2.1 AA come standard minimo
4. **Progressive Enhancement**: Funzionalità base garantite, enhancement progressivi
5. **Testing continuo**: Validazione funzionale ad ogni step

---

## 🎯 Task Organizzati per Priorità

### 1️⃣ ALTA PRIORITÀ - Revisione e consolidamento UI/UX

Questi task sono **critici** e devono essere completati **per primi** in quanto impattano tutti gli altri sviluppi.

#### Subtask 1: Migrazione completa componenti a theme.css
**Issue:** #TBD  
**Priorità:** 🔴 Alta  
**Tempo stimato:** 8-12 ore  
**Dipendenze:** Nessuna

**Descrizione:**
Portare tutti i componenti dell'applicazione all'uso **esclusivo** delle custom properties definite in `theme.css` (Material Design 3) e del font Roboto Flex.

**Obiettivi:**
- Eliminare tutti i valori hardcoded (colori, spacing, font-size, etc.)
- Convertire ogni componente per usare variabili CSS Material 3
- Garantire compatibilità con tutti e 3 i temi (light, dark, expressive)
- Documentare pattern di conversione per futuri sviluppi

**Acceptance Criteria:**
- [ ] Nessun valore hardcoded nei file CSS (verificato con audit)
- [ ] Tutti i componenti usano `var(--md-sys-*)` per colori, spacing, tipografia
- [ ] Font Roboto Flex applicato globalmente e correttamente caricato
- [ ] Test visivo superato su tutti e 3 i temi
- [ ] Documentazione aggiornata con esempi di conversione

**File coinvolti:**
- `style.css` - stili applicazione principale
- `src/components/*.css` - tutti i componenti CSS
- Qualsiasi altro file CSS nell'applicazione

**Riferimenti:**
- [Material Design 3 Design Tokens](https://m3.material.io/foundations/design-tokens/overview)
- `docs/THEME_MIGRATION.md` - guida migrazione esistente
- `theme.css` - definizioni variabili complete

---

#### Subtask 2: Verifica e miglioramento accessibilità
**Issue:** #TBD  
**Priorità:** 🔴 Alta  
**Tempo stimato:** 6-8 ore  
**Dipendenze:** Subtask 1 (preferibile)

**Descrizione:**
Verificare e migliorare l'accessibilità dell'intera applicazione secondo gli standard WCAG 2.1 Level AA, con focus su contrasto colori, navigazione tastiera, focus visibile e etichette ARIA.

**Obiettivi:**
- Audit completo accessibilità con strumenti automatici (axe, Lighthouse)
- Verifica manuale navigazione tastiera
- Test con screen reader (NVDA o VoiceOver)
- Correzione di tutti i problemi identificati
- Documentazione linee guida accessibilità per sviluppatori

**Acceptance Criteria:**
- [ ] Score Lighthouse Accessibility >= 95
- [ ] Contrasto colori >= 4.5:1 per testo normale, >= 3:1 per testo grande (WCAG AA)
- [ ] Tutti gli elementi interattivi navigabili da tastiera
- [ ] Focus visibile su tutti gli elementi (outline >= 2px, contrasto >= 3:1)
- [ ] Etichette ARIA presenti e corrette su tutti i controlli
- [ ] Landmark ARIA appropriati (`main`, `nav`, `banner`, `contentinfo`)
- [ ] Test con screen reader superato (almeno su NVDA o VoiceOver)
- [ ] Documentazione `docs/ACCESSIBILITY.md` creata

**Aree da verificare:**
- Contrasti colori su tutti i temi (light, dark, expressive)
- Focus indicators (outline visibili e con buon contrasto)
- Skip links per navigazione rapida
- Gestione modale e focus trapping
- Live regions per notifiche dinamiche
- Form labels e messaggi di errore
- Struttura heading gerarchica (h1 → h2 → h3)

**Strumenti:**
- [axe DevTools](https://www.deque.com/axe/devtools/)
- [Lighthouse](https://developers.google.com/web/tools/lighthouse)
- [WAVE](https://wave.webaim.org/)
- [Contrast Checker](https://webaim.org/resources/contrastchecker/)
- Screen reader: NVDA (Windows) o VoiceOver (macOS)

**Riferimenti:**
- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [MDN Accessibility Guide](https://developer.mozilla.org/en-US/docs/Web/Accessibility)
- [WebAIM Checklist](https://webaim.org/standards/wcag/checklist)

---

#### Subtask 3: Design responsive e test mobile/tablet
**Issue:** #TBD  
**Priorità:** 🔴 Alta  
**Tempo stimato:** 6-8 ore  
**Dipendenze:** Subtask 1, 2

**Descrizione:**
Garantire che l'intera applicazione funzioni perfettamente su dispositivi mobile e tablet, con layout responsive, touch-friendly e ottimizzato per schermi piccoli.

**Obiettivi:**
- Implementare breakpoint responsive appropriati
- Ottimizzare layout per schermi piccoli (< 768px)
- Garantire touch targets >= 44x44px (iOS HIG) o 48x48px (Material)
- Test su dispositivi reali o emulatori
- Ottimizzare performance mobile (tempo di caricamento, interattività)

**Acceptance Criteria:**
- [ ] Layout funzionante su breakpoint: mobile (<640px), tablet (640-1024px), desktop (>1024px)
- [ ] Tutti i touch targets >= 48x48px con spacing appropriato
- [ ] Navigazione mobile-friendly (hamburger menu se necessario)
- [ ] Test superato su: iPhone (Safari), Android (Chrome), iPad (Safari)
- [ ] Nessun overflow orizzontale su mobile
- [ ] Font size leggibile su mobile (>= 16px per body text)
- [ ] Performance mobile: LCP < 2.5s, FID < 100ms, CLS < 0.1
- [ ] Touch gestures appropriati (swipe, tap, long-press dove necessario)

**Breakpoint consigliati:**
```css
/* Mobile-first approach */
/* Base: mobile (<640px) */

@media (min-width: 640px) {
  /* Tablet portrait */
}

@media (min-width: 1024px) {
  /* Desktop */
}

@media (min-width: 1280px) {
  /* Large desktop */
}
```

**Aree da verificare:**
- Schedule grid: layout orizzontale su mobile vs verticale su desktop
- Top bar: collassare su mobile con menu hamburger
- Forms: input full-width su mobile
- Buttons: dimensioni touch-friendly
- Modals: full-screen su mobile, centered su desktop

**Strumenti:**
- Chrome DevTools Device Mode
- Firefox Responsive Design Mode
- BrowserStack o dispositivi fisici
- Lighthouse Performance audit

---

### 2️⃣ MEDIA PRIORITÀ - Funzionalità core e miglioramenti

Questi task implementano le **funzionalità principali** dell'applicazione.

#### Subtask 4: Rifinitura gestione orario e UX
**Issue:** #TBD  
**Priorità:** 🟡 Media  
**Tempo stimato:** 10-12 ore  
**Dipendenze:** Subtask 1, 3

**Descrizione:**
Migliorare l'esperienza utente della gestione dell'orario settimanale, con focus su visualizzazione intuitiva, editing drag-and-drop, gestione conflitti e feedback visivo.

**Obiettivi:**
- Migliorare visualizzazione schedule grid (colori, layout, leggibilità)
- Implementare editing inline o modal migliorato
- Aggiungere drag-and-drop per spostare lezioni
- Rilevamento e segnalazione conflitti orari
- Feedback visivo per azioni utente (loading, success, error)
- Export/import orario (JSON, iCal, PDF?)

**Acceptance Criteria:**
- [ ] Schedule grid responsive e ben leggibile su tutti i dispositivi
- [ ] Drag-and-drop funzionante per spostare lezioni tra celle
- [ ] Rilevamento automatico conflitti orari con notifica visiva
- [ ] Modal/form per editing lezioni con validazione completa
- [ ] Colori assegnati automaticamente per materie diverse
- [ ] Possibilità di duplicare lezioni (es: stessa materia, giorni diversi)
- [ ] Undo/redo per azioni recenti (opzionale)
- [ ] Export orario in formato JSON
- [ ] Import orario da JSON con validazione
- [ ] Feedback toast/snackbar per azioni (salvato, eliminato, errore)

**Funzionalità da implementare:**
1. **Visualizzazione migliorata:**
   - Colori automatici per materie
   - Indicatore durata visivo (altezza cella proporzionale)
   - Tooltip con dettagli completi al hover
   
2. **Editing avanzato:**
   - Drag-and-drop con preview
   - Quick edit (click per edit inline)
   - Bulk actions (seleziona multiple, elimina, sposta)

3. **Validazione e conflitti:**
   - Controlla sovrapposizioni orarie
   - Segnala conflitti con highlight rosso
   - Suggerimenti slot liberi

4. **Import/Export:**
   - Export JSON strutturato
   - Import con validazione e merge
   - Export iCal per calendario (bonus)

**File coinvolti:**
- `src/schedule-grid.js` - logica schedule grid
- `src/main.js` - gestione eventi
- `src/storage.js` - persistenza dati
- `style.css` - stili schedule

---

#### Subtask 5: UI impostazioni utente/scuola con persistenza
**Issue:** #TBD  
**Priorità:** 🟡 Media  
**Tempo stimato:** 6-8 ore  
**Dipendenze:** Subtask 1, 6 (preferibile)

**Descrizione:**
Creare interfaccia completa per gestione impostazioni utente e scuola, con salvataggio persistente in IndexedDB e possibilità di personalizzazione completa.

**Obiettivi:**
- UI impostazioni completa e accessibile
- Gestione dati utente (nome, email, scuola)
- Configurazione scuola (nome, indirizzo, orari standard)
- Salvataggio automatico in IndexedDB
- Sync tra tabs (BroadcastChannel o storage events)
- Export/import impostazioni

**Acceptance Criteria:**
- [ ] Modal/pagina impostazioni ben strutturata e accessibile
- [ ] Form per dati utente con validazione
- [ ] Form per dati scuola con campi appropriati
- [ ] Configurazione orari standard (inizio, fine, durata lezioni)
- [ ] Salvataggio automatico in IndexedDB
- [ ] Caricamento impostazioni al boot
- [ ] Sync in tempo reale tra tabs aperte
- [ ] Export impostazioni in JSON
- [ ] Import impostazioni con validazione
- [ ] Reset a valori predefiniti
- [ ] Feedback visivo per azioni (salvato, errore)

**Campi impostazioni:**

**Utente:**
- Nome completo
- Email (opzionale)
- Materie insegnate (lista)
- Preferenze notifiche

**Scuola:**
- Nome istituto
- Indirizzo (opzionale)
- Orario inizio lezioni (es: 08:00)
- Orario fine lezioni (es: 14:00)
- Durata lezione standard (es: 60 minuti)
- Durata intervallo (es: 10 minuti)
- Giorni scolastici (Lun-Ven, Lun-Sab)

**Implementazione tecnica:**
- Usare IndexedDB tramite `src/storage/indexeddb.js`
- Schema dati strutturato e versionato
- Migration automatica per aggiornamenti schema
- Fallback a localStorage se IndexedDB non disponibile

**File coinvolti:**
- `src/settings.js` - logica settings
- `src/storage/indexeddb.js` - persistenza
- Nuovo file: `src/screens/settings.js` - UI settings

---

#### Subtask 6: Implementazione cambio tema dinamico
**Issue:** #TBD  
**Priorità:** 🟡 Media  
**Tempo stimato:** 4-6 ore  
**Dipendenze:** Subtask 1

**Descrizione:**
Implementare il sistema completo di cambio tema dinamico nell'interfaccia utente, permettendo all'utente di selezionare tra Auto, Light, Dark ed Expressive, con persistenza e anteprima live.

**Obiettivi:**
- Aggiungere UI selector tema nel menu impostazioni
- Implementare switch tra i 4 temi disponibili
- Persistenza scelta tema in localStorage
- Anteprima live senza reload pagina
- Supporto prefers-color-scheme per tema Auto
- Transizioni fluide tra temi

**Acceptance Criteria:**
- [ ] UI selector tema nel menu impostazioni (dropdown o radio buttons)
- [ ] 4 opzioni disponibili: Auto (Sistema), Light, Dark, Expressive
- [ ] Cambio tema istantaneo senza reload
- [ ] Persistenza scelta in localStorage
- [ ] Tema Auto segue prefers-color-scheme del sistema
- [ ] Transizioni CSS smooth tra temi (opzionale)
- [ ] Indicatore tema corrente visibile
- [ ] Accessibilità: selector navigabile da tastiera con ARIA appropriato

**Implementazione:**

Il sistema è già implementato in `src/utils/theme.js` (ThemeManager). Questo task richiede solo l'integrazione UI.

**Passi:**
1. Aggiungere selector tema in `src/settings.js` o nuovo componente
2. Collegare selector a `ThemeManager.setTheme(name)`
3. Inizializzare selector con tema corrente da `ThemeManager.getCurrentTheme()`
4. Ascoltare evento `theme-changed` per aggiornare UI

**Esempio implementazione:**
```javascript
// In settings.js
const themeSelector = document.getElementById('themeSelector');

// Initialize
themeSelector.value = ThemeManager.getCurrentTheme();

// Handle change
themeSelector.addEventListener('change', (e) => {
  ThemeManager.setTheme(e.target.value);
});

// Listen for changes from other tabs
window.addEventListener('theme-changed', (e) => {
  themeSelector.value = e.detail.theme;
});
```

**UI suggerita:**
```html
<div class="setting-row">
  <label for="themeSelector">Tema applicazione:</label>
  <select id="themeSelector" class="select" aria-label="Seleziona tema">
    <option value="auto">Automatico (Sistema)</option>
    <option value="light">Chiaro</option>
    <option value="dark">Scuro</option>
    <option value="expressive">Expressive (Material 3)</option>
  </select>
</div>
```

**File coinvolti:**
- `src/settings.js` - aggiungere UI selector
- `src/utils/theme.js` - già implementato (nessuna modifica)
- `style.css` - stili per selector (opzionale)

**Riferimenti:**
- `src/utils/theme.js` - implementazione ThemeManager
- `docs/THEMES.md` - documentazione temi

---

### 3️⃣ MEDIA-BASSA PRIORITÀ - Ottimizzazione e qualità

Questi task migliorano la **qualità complessiva** del codice e dell'applicazione.

#### Subtask 7: Pulizia codice e asset non utilizzati
**Issue:** #TBD  
**Priorità:** 🟢 Media-Bassa  
**Tempo stimato:** 4-6 ore  
**Dipendenze:** Subtask 1-6 completati

**Descrizione:**
Pulizia completa del codebase rimuovendo codice commentato, file non utilizzati, asset obsoleti e refactoring di duplicazioni.

**Obiettivi:**
- Rimuovere codice commentato
- Eliminare file non utilizzati
- Rimuovere asset obsoleti (immagini, icone inutilizzate)
- Refactoring codice duplicato
- Ottimizzare import e dipendenze
- Standardizzare formattazione codice

**Acceptance Criteria:**
- [ ] Nessun blocco di codice commentato (eccetto commenti doc)
- [ ] Tutti i file nel repo sono utilizzati attivamente
- [ ] Asset folder contiene solo file referenziati
- [ ] Nessuna duplicazione significativa di codice (DRY)
- [ ] Formattazione consistente (usare Prettier/ESLint se possibile)
- [ ] Import ottimizzati (no import inutilizzati)
- [ ] Dimensione bundle ridotta (se applicabile)
- [ ] Documentazione aggiornata per riflettere modifiche

**Aree da verificare:**
1. **Codice JavaScript:**
   - Funzioni duplicate
   - Import non utilizzati
   - Variabili non usate
   - Console.log dimenticati

2. **CSS:**
   - Classi non utilizzate
   - Regole duplicate
   - Vendor prefixes obsoleti

3. **Asset:**
   - Immagini non referenziate
   - Icone obsolete
   - Font non usati

4. **Documentazione:**
   - File README obsoleti
   - Commenti non aggiornati

**Strumenti utili:**
- ESLint per JavaScript
- PurgeCSS per CSS non utilizzato
- webpack-bundle-analyzer (se usi bundler)
- grep/ripgrep per trovare riferimenti

---

#### Subtask 8: Testing funzionale e setup test automatici
**Issue:** #TBD  
**Priorità:** 🟢 Media-Bassa  
**Tempo stimato:** 8-12 ore  
**Dipendenze:** Subtask 1-7

**Descrizione:**
Implementare strategia di testing completa con test manuali documentati e setup per test automatici futuri.

**Obiettivi:**
- Creare test plan con scenari manuali
- Documentare test cases per tutte le funzionalità
- Setup infrastruttura test automatici (Jest/Vitest + Testing Library)
- Scrivere test unitari per funzioni critiche
- Setup test E2E con Playwright o Cypress (opzionale)
- CI/CD per eseguire test automaticamente

**Acceptance Criteria:**
- [ ] Documento `docs/TEST_PLAN.md` con test manuali completi
- [ ] Test automatici setup e funzionanti
- [ ] Test unitari per: storage, theme manager, utility functions
- [ ] Coverage >= 60% per codice critico
- [ ] Test E2E per flussi principali (opzionale)
- [ ] CI/CD configurato per eseguire test su PR
- [ ] Documentazione per eseguire test localmente

**Test Plan (manuale):**

**Scenario 1: Gestione Orario**
1. Creare nuova lezione
2. Modificare lezione esistente
3. Eliminare lezione
4. Verificare persistenza dopo reload
5. Testare drag-and-drop (se implementato)

**Scenario 2: Impostazioni**
1. Modificare dati utente
2. Modificare dati scuola
3. Cambiare tema
4. Verificare persistenza
5. Export/import impostazioni

**Scenario 3: Accessibilità**
1. Navigare solo con tastiera
2. Test con screen reader
3. Verificare contrasti
4. Test focus visibile

**Scenario 4: Responsive**
1. Test su mobile (< 640px)
2. Test su tablet (640-1024px)
3. Test su desktop (> 1024px)
4. Verificare touch targets

**Test automatici (setup):**

```bash
# Install dependencies
npm install --save-dev jest @testing-library/dom @testing-library/jest-dom

# Create test files
src/__tests__/storage.test.js
src/__tests__/theme.test.js
src/__tests__/utils.test.js
```

**Esempio test:**
```javascript
// storage.test.js
import { saveData, loadData } from '../storage';

describe('Storage', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  test('should save and load data', () => {
    const testData = [{ name: 'Test', day: 1 }];
    saveData(testData);
    const loaded = loadData();
    expect(loaded).toEqual(testData);
  });
});
```

**File da creare:**
- `docs/TEST_PLAN.md` - test manuali
- `jest.config.js` o `vitest.config.js`
- `src/__tests__/` - directory test
- `.github/workflows/test.yml` - CI/CD

---

#### Subtask 9: Ottimizzazione performance e caricamento
**Issue:** #TBD  
**Priorità:** 🟢 Media-Bassa  
**Tempo stimato:** 6-8 ore  
**Dipendenze:** Subtask 1-8

**Descrizione:**
Ottimizzare le performance dell'applicazione, con focus su tempo di caricamento, interattività, rendering e utilizzo memoria.

**Obiettivi:**
- Audit performance con Lighthouse
- Ottimizzare caricamento risorse (lazy loading, code splitting)
- Minimizzare e comprimere asset (CSS, JS, immagini)
- Implementare caching efficace (Service Worker)
- Ottimizzare rendering (avoid layout thrashing)
- Ridurre bundle size

**Acceptance Criteria:**
- [ ] Lighthouse Performance score >= 90
- [ ] Core Web Vitals nel verde: LCP < 2.5s, FID < 100ms, CLS < 0.1
- [ ] First Contentful Paint (FCP) < 1.8s
- [ ] Time to Interactive (TTI) < 3.8s
- [ ] Bundle size < 200KB (gzipped)
- [ ] Immagini ottimizzate (WebP, dimensioni appropriate)
- [ ] CSS e JS minificati
- [ ] Service Worker caching implementato
- [ ] Lazy loading per componenti non critici

**Ottimizzazioni specifiche:**

**1. Caricamento risorse:**
- Preload font critici
- Defer JavaScript non critico
- Lazy load immagini below-the-fold
- Code splitting per route (se applicabile)

**2. Asset:**
- Minimizzare CSS e JS
- Ottimizzare immagini (WebP, compressione)
- Usare SVG per icone quando possibile
- Font subsetting per Roboto Flex

**3. Service Worker:**
- Cache static assets
- Network-first per dati dinamici
- Offline fallback page
- Background sync per dati

**4. Rendering:**
- Debounce input handlers
- Virtual scrolling per liste lunghe (se necessario)
- RequestAnimationFrame per animazioni
- CSS containment per layout pesanti

**5. Memoria:**
- Cleanup event listeners
- Rimuovere DOM nodes non usati
- Limitare history/undo stack

**Strumenti:**
- Lighthouse audit
- Chrome DevTools Performance tab
- WebPageTest
- Bundle analyzer

**File coinvolti:**
- `service-worker.js` - ottimizzare caching
- Tutti i file JS - minimizzare
- `style.css`, `theme.css` - minimizzare
- `manifest.json` - verificare configurazione

---

### 4️⃣ BASSA PRIORITÀ - Documentazione e collaborazione

Questi task migliorano la **collaborazione** e facilitano contributi esterni.

#### Subtask 10: Aggiornamento documentazione completa
**Issue:** #TBD  
**Priorità:** 🔵 Bassa  
**Tempo stimato:** 4-6 ore  
**Dipendenze:** Subtask 1-9 completati

**Descrizione:**
Aggiornare tutta la documentazione del progetto per riflettere lo stato attuale, includere nuove funzionalità e migliorare onboarding per nuovi contributori.

**Obiettivi:**
- Aggiornare README.md con funzionalità attuali
- Aggiornare CONTRIBUTING.md
- Verificare e aggiornare tutta la documentazione in /docs
- Aggiungere screenshots attuali
- Creare CHANGELOG.md
- Aggiornare architettura e diagrammi

**Acceptance Criteria:**
- [ ] README.md aggiornato con feature complete e screenshot attuali
- [ ] CONTRIBUTING.md aggiornato con processo contribuzione attuale
- [ ] Tutti i file in /docs verificati e aggiornati
- [ ] Screenshot/GIF delle funzionalità principali
- [ ] CHANGELOG.md creato con storia versioni
- [ ] Diagrammi architettura aggiornati (se presenti)
- [ ] Link funzionanti e non obsoleti
- [ ] Sezione FAQ aggiunta o aggiornata

**Documentazione da aggiornare:**

**1. README.md:**
- Overview progetto aggiornata
- Feature list completa
- Screenshot app funzionante
- Quick start aggiornato
- Link a documentazione dettagliata

**2. CONTRIBUTING.md:**
- Processo setup aggiornato
- Workflow Git/GitHub
- Code style guide
- Testing requirements
- PR template e checklist

**3. /docs:**
- `ARCHITECTURE.md` - architettura attuale
- `STYLE_GUIDE.md` - verificare consistenza
- `THEMES.md` - verificare accuratezza
- `COMPONENTS.md` - lista componenti aggiornata
- `TEST_PLAN.md` - da subtask 8
- `ACCESSIBILITY.md` - da subtask 2
- Nuovi: `FAQ.md`, `TROUBLESHOOTING.md`

**4. CHANGELOG.md:**
Creare changelog strutturato con formato [Keep a Changelog](https://keepachangelog.com/):

```markdown
# Changelog

## [Unreleased]

## [1.0.0] - 2025-10-XX
### Added
- Sistema tema Material Design 3
- Gestione orario completa
- Impostazioni utente/scuola
- ...

### Changed
- ...

### Fixed
- ...
```

**5. Screenshot/Media:**
- Screenshot homepage light theme
- Screenshot homepage dark theme
- Screenshot schedule grid con dati
- Screenshot settings panel
- GIF demo funzionalità (opzionale)

**File da aggiornare:**
- `README.md`
- `CONTRIBUTING.md`
- `docs/*.md`
- Creare: `CHANGELOG.md`
- Asset: `docs/screenshots/`

---

#### Subtask 11: Kanban board e granular issues
**Issue:** #TBD  
**Priorità:** 🔵 Bassa  
**Tempo stimato:** 2-4 ore  
**Dipendenze:** Subtask 1-10

**Descrizione:**
Organizzare GitHub Projects con Kanban board e creare issues granulari per ogni subtask di questa roadmap, facilitando tracking e collaborazione.

**Obiettivi:**
- Creare GitHub Project board per OrarioDoc
- Creare issue granulari per ogni subtask
- Organizzare issue per priorità e milestone
- Aggiungere labels appropriati
- Creare issue templates
- Configurare automation (se possibile)

**Acceptance Criteria:**
- [ ] GitHub Project board creato e configurato
- [ ] 11 issues create (una per ogni subtask)
- [ ] Ogni issue ha: descrizione, acceptance criteria, labels, milestone
- [ ] Labels create: priority (alta/media/bassa), type (feature/bug/docs), area (UI/UX/core/docs)
- [ ] Issue templates creati (feature, bug, question)
- [ ] Automation configurata (move to "In Progress" quando assegnato, etc.)
- [ ] README.md linkato al project board

**Labels da creare:**

**Priority:**
- `priority: high` 🔴
- `priority: medium` 🟡
- `priority: low` 🔵

**Type:**
- `type: feature` ⭐
- `type: bug` 🐛
- `type: enhancement` ✨
- `type: documentation` 📚
- `type: testing` 🧪

**Area:**
- `area: ui-ux` 🎨
- `area: core` ⚙️
- `area: accessibility` ♿
- `area: performance` 🚀
- `area: docs` 📖

**Status:**
- `status: ready` ✅
- `status: in-progress` 🔄
- `status: blocked` 🚫
- `status: review` 👀

**Issue template esempio:**

```markdown
---
name: Feature Request
about: Suggest a new feature for OrarioDoc
labels: type: feature
---

## Feature Description
<!-- Describe the feature -->

## Use Case
<!-- Why is this feature needed? -->

## Acceptance Criteria
- [ ] Criterio 1
- [ ] Criterio 2

## Additional Context
<!-- Screenshots, mockups, references -->
```

**Project Board columns:**
- 📋 Backlog
- 🔜 Ready
- 🔄 In Progress
- 👀 In Review
- ✅ Done

**Passi implementazione:**
1. Vai su GitHub → Projects → New project
2. Scegli Board template
3. Crea colonne come sopra
4. Crea labels nel repository
5. Crea issue per ogni subtask linkando a questa roadmap
6. Aggiungi issues al project board
7. Configura automation (Settings → Workflows)

---

## 📊 Riepilogo Statistiche

### Per Priorità
- **Alta priorità:** 3 tasks (Subtask 1-3) → ~20-28 ore
- **Media priorità:** 3 tasks (Subtask 4-6) → ~20-26 ore
- **Media-bassa priorità:** 3 tasks (Subtask 7-9) → ~18-26 ore
- **Bassa priorità:** 2 tasks (Subtask 10-11) → ~6-10 ore

**Totale stimato:** 64-90 ore di sviluppo

### Per Area
- **UI/UX:** Subtask 1, 2, 3 → 3 tasks
- **Core Features:** Subtask 4, 5, 6 → 3 tasks
- **Quality:** Subtask 7, 8, 9 → 3 tasks
- **Documentation:** Subtask 10, 11 → 2 tasks

---

## 🎯 Ordine di Esecuzione Consigliato

### Sprint 1 (Alta Priorità) - 2-3 settimane
1. ✅ Subtask 1: Migrazione theme.css completa
2. ✅ Subtask 2: Accessibilità verification
3. ✅ Subtask 3: Responsive design

**Deliverable:** UI/UX consolidata, accessibile e responsive

### Sprint 2 (Media Priorità) - 2-3 settimane
4. ✅ Subtask 6: Tema switching (rapido, sblocca UX)
5. ✅ Subtask 5: Settings UI (dipende da Subtask 6)
6. ✅ Subtask 4: Schedule refinement (core feature)

**Deliverable:** Funzionalità core completate

### Sprint 3 (Ottimizzazione) - 2 settimane
7. ✅ Subtask 7: Code cleanup
8. ✅ Subtask 8: Testing setup
9. ✅ Subtask 9: Performance optimization

**Deliverable:** Codice pulito, testato e performante

### Sprint 4 (Documentazione) - 1 settimana
10. ✅ Subtask 10: Documentazione update
11. ✅ Subtask 11: Kanban board

**Deliverable:** Documentazione completa e project management setup

---

## 🔄 Processo di Sviluppo

### Per Ogni Subtask

1. **Pianificazione:**
   - Creare issue GitHub dalla roadmap
   - Assegnare issue e milestone
   - Stimare effort e priorità

2. **Sviluppo:**
   - Creare branch da `main` (es: `feature/subtask-1`)
   - Sviluppare seguendo acceptance criteria
   - Commit frequenti e messaggi descrittivi
   - Test durante sviluppo

3. **Review:**
   - Self-review codice
   - Test manuale completo
   - Run linters e test automatici
   - Creare PR con descrizione dettagliata

4. **Merge:**
   - Code review da altro contributor
   - Sistemare feedback
   - Merge quando approvato
   - Chiudere issue

5. **Deploy:**
   - Test in staging/production
   - Monitorare errori
   - Documentare se necessario

---

## 📝 Note Importanti

### Flessibilità
Questa roadmap è **flessibile**. L'ordine può essere modificato in base a:
- Feedback utenti
- Emergenze (bug critici)
- Disponibilità risorse
- Priorità business

### Contributi Esterni
Ogni subtask può essere assegnato a contributori diversi. Le issue granulari facilitano il lavoro parallelo.

### Continuous Improvement
Questa roadmap sarà aggiornata iterativamente man mano che i task vengono completati e nuovi requisiti emergono.

---

## 🔗 Collegamenti Utili

- **Repository:** https://github.com/antoniocorsano-boop/OrarioDoc
- **Project Board:** [Da creare in Subtask 11]
- **Documentazione:** `/docs` directory
- **CONTRIBUTING:** `CONTRIBUTING.md`
- **Issue Template:** `.github/ISSUE_TEMPLATE/`

---

## 📧 Contatti

Per domande sulla roadmap o per proporre modifiche, apri una issue con label `type: question` o contatta i maintainer.

---

**Ultima modifica:** Ottobre 2025  
**Versione roadmap:** 1.0  
**Stato:** 🟢 Attiva
