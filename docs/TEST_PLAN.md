# Test Plan - OrarioDoc

**Versione:** 1.0  
**Data:** Ottobre 2025  
**Stato:** Attivo

---

## Indice

1. [Panoramica](#panoramica)
2. [Test Manuali](#test-manuali)
3. [Test Automatici](#test-automatici)
4. [Esecuzione Test](#esecuzione-test)
5. [Criteri di Successo](#criteri-di-successo)

---

## Panoramica

Questo documento definisce la strategia di testing completa per OrarioDoc, includendo test manuali e automatici per garantire qualità, accessibilità e funzionalità corrette.

### Obiettivi

- ✅ Verificare funzionalità core dell'applicazione
- ✅ Garantire accessibilità WCAG 2.1 Level AA
- ✅ Validare responsive design su tutti i dispositivi
- ✅ Assicurare persistenza dati corretta
- ✅ Verificare compatibilità browser
- ✅ Test performance e caricamento

### Ambiente di Test

**Browser supportati:**
- Chrome/Chromium 90+
- Firefox 88+
- Safari 14+
- Edge 90+

**Dispositivi:**
- Desktop (>1024px)
- Tablet (640-1024px)
- Mobile (<640px)

**Sistemi Operativi:**
- Windows 10/11
- macOS
- Linux
- Android (Termux)
- iOS/iPadOS

---

## Test Manuali

### Scenario 1: Gestione Orario Base

**Priorità:** 🔴 Alta  
**Tempo stimato:** 15 minuti

#### Test 1.1: Creazione Nuova Lezione

**Prerequisiti:**
- App aperta nel browser
- Schedule grid visibile

**Passi:**
1. Cliccare sul pulsante "Aggiungi Lezione"
2. Compilare il form:
   - Nome materia: "Matematica"
   - Giorno: "Lunedì"
   - Ora inizio: "08:00"
   - Ora fine: "09:00"
   - Aula: "101"
3. Cliccare "Salva"

**Risultato atteso:**
- ✅ Lezione appare nello schedule grid
- ✅ Toast di conferma "Lezione salvata"
- ✅ Dati persistono dopo refresh pagina

#### Test 1.2: Modifica Lezione Esistente

**Prerequisiti:**
- Almeno una lezione presente nello schedule

**Passi:**
1. Cliccare sulla lezione esistente
2. Modal di modifica si apre
3. Modificare nome materia in "Italiano"
4. Cliccare "Salva"

**Risultato atteso:**
- ✅ Lezione aggiornata nello schedule
- ✅ Toast "Lezione modificata"
- ✅ Modifiche persistono dopo refresh

#### Test 1.3: Eliminazione Lezione

**Prerequisiti:**
- Almeno una lezione presente nello schedule

**Passi:**
1. Cliccare sulla lezione
2. Cliccare pulsante "Elimina"
3. Confermare eliminazione nel dialog

**Risultato atteso:**
- ✅ Lezione rimossa dallo schedule
- ✅ Toast "Lezione eliminata"
- ✅ Eliminazione persiste dopo refresh

#### Test 1.4: Persistenza Dati

**Prerequisiti:**
- Almeno una lezione salvata

**Passi:**
1. Aggiungere 2-3 lezioni
2. Ricaricare la pagina (F5)
3. Chiudere e riaprire il browser
4. Navigare via dall'app e tornare

**Risultato atteso:**
- ✅ Tutte le lezioni rimangono visibili
- ✅ Nessuna perdita di dati
- ✅ Layout e formattazione corretti

#### Test 1.5: Validazione Form

**Prerequisiti:**
- Form "Aggiungi Lezione" aperto

**Passi:**
1. Tentare di salvare form vuoto
2. Inserire solo nome materia e salvare
3. Inserire ora fine precedente a ora inizio

**Risultato atteso:**
- ✅ Messaggi di errore appropriati
- ✅ Form non si chiude se dati non validi
- ✅ Campi obbligatori evidenziati

---

### Scenario 2: Gestione Impostazioni

**Priorità:** 🔴 Alta  
**Tempo stimato:** 10 minuti

#### Test 2.1: Modifica Dati Utente

**Prerequisiti:**
- Menu Impostazioni accessibile

**Passi:**
1. Aprire menu "Impostazioni"
2. Modificare nome utente
3. Modificare email (opzionale)
4. Salvare modifiche

**Risultato atteso:**
- ✅ Dati salvati correttamente
- ✅ Toast di conferma
- ✅ Persistenza dopo refresh

#### Test 2.2: Modifica Dati Scuola

**Prerequisiti:**
- Menu Impostazioni aperto

**Passi:**
1. Modificare nome scuola
2. Modificare orario inizio lezioni (es: 08:00)
3. Modificare durata lezione standard (es: 60 min)
4. Salvare

**Risultato atteso:**
- ✅ Impostazioni salvate
- ✅ Schedule grid riflette nuovi orari
- ✅ Persistenza verificata

#### Test 2.3: Cambio Tema

**Prerequisiti:**
- App funzionante

**Passi:**
1. Aprire menu Impostazioni
2. Selezionare tema "Light"
3. Verificare cambio immediato
4. Selezionare tema "Dark"
5. Selezionare tema "Expressive"
6. Selezionare tema "Auto"

**Risultato atteso:**
- ✅ Tema cambia immediatamente (no reload)
- ✅ Colori corretti per ogni tema
- ✅ Scelta persiste dopo refresh
- ✅ Tema "Auto" segue sistema operativo

#### Test 2.4: Personalizzazione Colori

**Prerequisiti:**
- Menu Impostazioni aperto

**Passi:**
1. Aprire sezione "Colori personalizzati"
2. Modificare colore primario
3. Modificare colore secondario
4. Salvare
5. Testare "Ripristina colori"

**Risultato atteso:**
- ✅ Colori applicati immediatamente
- ✅ UI riflette nuovi colori
- ✅ Ripristino funziona correttamente

---

### Scenario 3: Accessibilità

**Priorità:** 🔴 Alta  
**Tempo stimato:** 20 minuti

#### Test 3.1: Navigazione da Tastiera

**Prerequisiti:**
- App aperta
- Mouse disconnesso o non utilizzato

**Passi:**
1. Usare Tab per navigare tra elementi
2. Usare Shift+Tab per navigazione inversa
3. Usare Enter/Space per attivare pulsanti
4. Navigare tra form fields con Tab
5. Usare Esc per chiudere modal

**Risultato atteso:**
- ✅ Tutti elementi interattivi raggiungibili
- ✅ Ordine di focus logico e prevedibile
- ✅ Focus visibile con outline >= 2px
- ✅ Nessun "focus trap" indesiderato
- ✅ Modal trappano focus correttamente

#### Test 3.2: Focus Visibile

**Prerequisiti:**
- App aperta

**Passi:**
1. Navigare con Tab attraverso tutti elementi
2. Verificare visibilità outline su:
   - Pulsanti
   - Link
   - Input fields
   - Select/dropdown
   - Radio/checkbox
   - Cards cliccabili

**Risultato atteso:**
- ✅ Outline visibile su tutti elementi focusati
- ✅ Contrasto outline >= 3:1 con sfondo
- ✅ Spessore outline >= 2px
- ✅ Outline non coperto da altri elementi

#### Test 3.3: Screen Reader (NVDA/VoiceOver)

**Prerequisiti:**
- Screen reader installato e attivo
- App aperta

**Passi:**
1. Navigare pagina con screen reader
2. Ascoltare annunci per:
   - Headings (h1, h2, h3)
   - Buttons e loro funzione
   - Form labels
   - Link e destinazione
   - Status messages (toast)
   - Modal/dialog
3. Verificare landmark regions (main, nav, etc.)

**Risultato atteso:**
- ✅ Tutti elementi hanno label/descrizione appropriata
- ✅ Headings gerarchici e descrittivi
- ✅ Form fields hanno label associato
- ✅ Toast/notifiche annunciate (aria-live)
- ✅ Modal annunciano apertura/chiusura
- ✅ Landmark facilitano navigazione

#### Test 3.4: Contrasto Colori

**Prerequisiti:**
- Strumento contrast checker disponibile
- Tutti i temi da testare

**Passi:**
1. Per ogni tema (Light, Dark, Expressive):
2. Verificare contrasto testo normale >= 4.5:1
3. Verificare contrasto testo grande >= 3:1
4. Verificare contrasto elementi UI >= 3:1
5. Testare con WebAIM Contrast Checker

**Risultato atteso:**
- ✅ Tutti i contrasti superano WCAG AA
- ✅ Testo leggibile su tutti gli sfondi
- ✅ Pulsanti e controlli ben visibili

#### Test 3.5: Lighthouse Accessibility Audit

**Prerequisiti:**
- Chrome DevTools

**Passi:**
1. Aprire Chrome DevTools (F12)
2. Tab "Lighthouse"
3. Selezionare "Accessibility"
4. Click "Analyze page load"
5. Esaminare report

**Risultato atteso:**
- ✅ Score >= 95/100
- ✅ Nessun errore critico
- ✅ Warning minori (se presenti) documentati

---

### Scenario 4: Responsive Design

**Priorità:** 🔴 Alta  
**Tempo stimato:** 15 minuti

#### Test 4.1: Layout Mobile (<640px)

**Prerequisiti:**
- Chrome DevTools Device Mode attivo
- Viewport 375x667 (iPhone SE)

**Passi:**
1. Verificare layout homepage
2. Testare schedule grid
3. Aprire menu impostazioni
4. Testare form aggiungi lezione
5. Verificare modal
6. Testare rotazione landscape

**Risultato atteso:**
- ✅ Layout ottimizzato per mobile
- ✅ Testo leggibile (>=16px)
- ✅ Touch targets >= 48x48px
- ✅ Nessun overflow orizzontale
- ✅ Modal full-screen su mobile
- ✅ Landscape funziona correttamente

#### Test 4.2: Layout Tablet (640-1024px)

**Prerequisiti:**
- Viewport 768x1024 (iPad)

**Passi:**
1. Verificare layout adattivo
2. Testare schedule grid
3. Verificare navigation
4. Testare modal (centered o full?)

**Risultato atteso:**
- ✅ Layout appropriato per tablet
- ✅ Utilizzo spazio ottimizzato
- ✅ Touch targets adeguati
- ✅ Portrait e landscape supportati

#### Test 4.3: Layout Desktop (>1024px)

**Prerequisiti:**
- Viewport 1920x1080

**Passi:**
1. Verificare layout completo
2. Schedule grid con buona spaziatura
3. Modal centered
4. Testare resize finestra

**Risultato atteso:**
- ✅ Layout sfrutta spazio disponibile
- ✅ Non eccessivamente "stretched"
- ✅ Leggibile e ben proporzionato
- ✅ Resize dinamico funziona

#### Test 4.4: Touch Targets

**Prerequisiti:**
- Mobile device o emulatore

**Passi:**
1. Misurare dimensioni pulsanti con DevTools
2. Tentare tap su tutti elementi interattivi
3. Verificare spacing tra elementi vicini

**Risultato atteso:**
- ✅ Tutti touch targets >= 48x48px
- ✅ Spacing tra target >= 8px
- ✅ Nessun tap accidentale

---

### Scenario 5: Performance e PWA

**Priorità:** 🟡 Media  
**Tempo stimato:** 15 minuti

#### Test 5.1: Lighthouse Performance

**Prerequisiti:**
- Chrome DevTools
- Connection throttling: Fast 3G

**Passi:**
1. Aprire Lighthouse
2. Selezionare "Performance"
3. Run audit
4. Esaminare Core Web Vitals

**Risultato atteso:**
- ✅ Performance score >= 90
- ✅ LCP < 2.5s
- ✅ FID < 100ms
- ✅ CLS < 0.1
- ✅ FCP < 1.8s

#### Test 5.2: Service Worker e Offline

**Prerequisiti:**
- App aperta online

**Passi:**
1. Verificare service worker registrato (DevTools > Application)
2. Caricare app completamente
3. DevTools > Network > Offline
4. Navigare nell'app
5. Aggiungere/modificare lezioni
6. Ritornare online
7. Verificare sync

**Risultato atteso:**
- ✅ Service worker attivo
- ✅ App funziona offline
- ✅ UI indica stato offline
- ✅ Dati sincronizzati quando online

#### Test 5.3: Installazione PWA

**Prerequisiti:**
- Browser supporta PWA

**Passi:**
1. Visitare app con HTTPS o localhost
2. Verificare prompt "Install App"
3. Installare app
4. Aprire da home screen/app drawer
5. Verificare funzionalità

**Risultato atteso:**
- ✅ Prompt installazione appare
- ✅ App installabile
- ✅ Icona corretta in home screen
- ✅ App apre in standalone mode
- ✅ Tutte funzionalità operative

#### Test 5.4: Caricamento Iniziale

**Prerequisiti:**
- Cache pulita

**Passi:**
1. DevTools > Application > Clear storage
2. Ricaricare app (Ctrl+Shift+R)
3. Misurare tempo caricamento
4. Verificare progressive rendering

**Risultato atteso:**
- ✅ First Contentful Paint < 1.8s
- ✅ Time to Interactive < 3.8s
- ✅ Contenuto visibile rapidamente
- ✅ Nessun blocco rendering

---

### Scenario 6: Compatibilità Browser

**Priorità:** 🟡 Media  
**Tempo stimato:** 20 minuti

#### Test 6.1: Chrome/Chromium

**Versioni:** 90+

**Passi:**
1. Testare tutti scenari 1-5
2. Verificare console errors
3. Testare funzionalità avanzate:
   - IndexedDB
   - Service Worker
   - CSS Variables
   - ES6+ features

**Risultato atteso:**
- ✅ Tutto funziona correttamente
- ✅ Nessun errore console
- ✅ Performance ottimale

#### Test 6.2: Firefox

**Versioni:** 88+

**Passi:**
1. Testare scenari principali
2. Verificare DevTools per errori
3. Testare specific Firefox behaviors

**Risultato atteso:**
- ✅ Funzionalità identiche a Chrome
- ✅ Layout consistente
- ✅ Nessun bug specifico Firefox

#### Test 6.3: Safari (Desktop/iOS)

**Versioni:** 14+

**Passi:**
1. Testare su Safari macOS
2. Testare su Safari iOS (iPhone/iPad)
3. Verificare compatibilità CSS
4. Testare IndexedDB/localStorage

**Risultato atteso:**
- ✅ Layout corretto
- ✅ Funzionalità complete
- ✅ Nessun problema webkit-specific

#### Test 6.4: Edge

**Versioni:** 90+

**Passi:**
1. Test base funzionalità
2. Verificare PWA installation
3. Console check

**Risultato atteso:**
- ✅ Parità con Chrome (Chromium-based)
- ✅ Nessun problema specifico

---

### Scenario 7: Casi Edge e Stress Test

**Priorità:** 🟢 Media-Bassa  
**Tempo stimato:** 15 minuti

#### Test 7.1: Dataset Grande

**Passi:**
1. Aggiungere 50+ lezioni
2. Verificare performance rendering
3. Testare scroll
4. Verificare persistenza
5. Testare ricerca/filtro (se implementata)

**Risultato atteso:**
- ✅ App rimane responsive
- ✅ Scroll fluido
- ✅ Nessun lag visibile

#### Test 7.2: Nomi/Testi Lunghi

**Passi:**
1. Inserire nome materia molto lungo (>100 caratteri)
2. Inserire testo con caratteri speciali
3. Testare emoji in nomi

**Risultato atteso:**
- ✅ Testo gestito correttamente (troncato o wrapped)
- ✅ Nessun overflow layout
- ✅ Caratteri speciali salvati

#### Test 7.3: Storage Limit

**Passi:**
1. Riempire storage con dati
2. Continuare ad aggiungere fino a limite
3. Verificare gestione errore

**Risultato atteso:**
- ✅ Errore gestito gracefully
- ✅ Messaggio user-friendly
- ✅ App non crasha

#### Test 7.4: Network Instabile

**Passi:**
1. DevTools > Network > Slow 3G
2. Usare app normalmente
3. Toggle online/offline ripetutamente

**Risultato atteso:**
- ✅ App funziona con network lento
- ✅ Gestione transizioni online/offline
- ✅ Nessun dato perso

---

## Test Automatici

### Unit Tests

I test automatici sono eseguiti tramite browser e coprono le funzioni critiche.

#### Storage Tests

**File:** `tests/storage.test.js`

**Copertura:**
- ✅ Lettura/scrittura IndexedDB
- ✅ Fallback a localStorage
- ✅ Migrazione da localStorage a IndexedDB
- ✅ Gestione errori

#### Theme Manager Tests

**File:** `tests/theme.test.js`

**Copertura:**
- ✅ Inizializzazione tema
- ✅ Cambio tema
- ✅ Persistenza tema
- ✅ Tema auto (system preference)
- ✅ Colori personalizzati

#### Toast Tests

**File:** `tests/toast.test.js`

**Copertura:**
- ✅ Creazione toast
- ✅ Tipi di toast (success, error, warning, info)
- ✅ Auto-dismiss
- ✅ Escape HTML

#### Utility Tests

**File:** `tests/utils.test.js`

**Copertura:**
- ✅ Funzioni helper
- ✅ Validazione form
- ✅ Formatters (date, time)

### Test Runner

**File:** `tests/test-runner.html`

Pagina HTML che carica ed esegue tutti i test nel browser.

**Uso:**
```bash
# Avviare server locale
python3 -m http.server 8080

# Aprire in browser
http://localhost:8080/tests/test-runner.html
```

---

## Esecuzione Test

### Test Manuali

1. **Preparazione:**
   - Stampare o aprire questo documento
   - Preparare ambiente di test
   - Pulire cache/storage se necessario

2. **Esecuzione:**
   - Seguire scenari nell'ordine
   - Documentare risultati
   - Annotare bug trovati

3. **Documentazione:**
   - Creare issue per ogni bug
   - Screenshot se utile
   - Includere passi per riprodurre

### Test Automatici

1. **Setup:**
   ```bash
   cd /path/to/OrarioDoc
   python3 -m http.server 8080
   ```

2. **Esecuzione:**
   - Aprire `http://localhost:8080/tests/test-runner.html`
   - I test partono automaticamente
   - Visualizzare risultati

3. **CI/CD:**
   - I test girano automaticamente su PR
   - Verifica workflow su GitHub Actions

---

## Criteri di Successo

### Test Manuali

- ✅ Tutti gli scenari priorità Alta passano
- ✅ >= 90% scenari Media priorità passano
- ✅ Bug critici risolti prima del merge

### Test Automatici

- ✅ Tutti i test passano (0 failures)
- ✅ Coverage >= 60% su codice critico
- ✅ Nessun errore console durante test

### Accessibilità

- ✅ Lighthouse Accessibility >= 95
- ✅ Tutti contrasti >= WCAG AA
- ✅ Navigazione tastiera completa
- ✅ Screen reader funzionante

### Performance

- ✅ Lighthouse Performance >= 90
- ✅ Core Web Vitals nel verde
- ✅ App funziona offline

### Compatibilità

- ✅ Chrome/Edge: 100% funzionante
- ✅ Firefox: 100% funzionante
- ✅ Safari: >= 95% funzionante

---

## Registro Test

### Template Issue Bug

```markdown
**Scenario:** [Nome scenario]
**Test:** [Numero test]
**Browser:** [Nome e versione]
**OS:** [Sistema operativo]

**Descrizione:**
[Descrizione del bug]

**Passi per riprodurre:**
1. ...
2. ...

**Risultato atteso:**
[Cosa dovrebbe accadere]

**Risultato effettivo:**
[Cosa accade]

**Screenshot:**
[Se disponibile]

**Console errors:**
[Eventuali errori]
```

---

## Manutenzione Test Plan

Questo documento dovrebbe essere aggiornato quando:
- Vengono aggiunte nuove funzionalità
- Vengono scoperti nuovi scenari di test
- Cambiano i requisiti di accessibilità
- Vengono supportati nuovi browser/dispositivi

**Ultima revisione:** Ottobre 2025  
**Prossima revisione:** Dicembre 2025

---

**Autore:** GitHub Copilot  
**Versione:** 1.0
