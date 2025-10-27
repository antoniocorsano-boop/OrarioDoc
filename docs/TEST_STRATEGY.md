# Strategia di Test per OrarioDoc

> **Versione:** 1.0  
> **Data:** Ottobre 2025  
> **Stato:** 🟢 Attiva

## 📋 Indice

1. [Obiettivi](#obiettivi)
2. [Piramide dei Test](#piramide-dei-test)
3. [Aree Critiche](#aree-critiche)
4. [Tipi di Test](#tipi-di-test)
5. [Copertura Minima](#copertura-minima)
6. [Strumenti e Framework](#strumenti-e-framework)
7. [Esecuzione dei Test](#esecuzione-dei-test)
8. [Checklist Test Essenziali](#checklist-test-essenziali)
9. [Continuous Integration](#continuous-integration)

---

## 🎯 Obiettivi

La strategia di test per OrarioDoc mira a garantire:

- **Affidabilità:** Il codice funziona correttamente in tutte le condizioni
- **Manutenibilità:** I test facilitano il refactoring sicuro
- **Regressioni:** Prevenire bug in funzionalità esistenti
- **Accessibilità:** Verificare conformità WCAG 2.1 AA
- **Performance:** Garantire tempi di risposta accettabili
- **Privacy:** Validare che i dati restino sul dispositivo

---

## 🔺 Piramide dei Test

Seguiamo il modello della piramide dei test per un bilanciamento ottimale:

```
        /\
       /  \      E2E (5%)
      /____\     - Test end-to-end completi
     /      \    - Test UI principali workflow
    /________\   
   /          \  Integration (15%)
  /____________\ - Test integrazione componenti
 /              \ - Test workflow multi-modulo
/________________\
|                | Unit (80%)
|   Unit Tests   | - Test funzioni pure
|________________| - Test moduli isolati
```

### Distribuzione

- **Unit Tests (80%):** Test veloci, isolati, granulari
- **Integration Tests (15%):** Test interazione tra moduli
- **End-to-End Tests (5%):** Test workflow utente completi

---

## 🎯 Aree Critiche

### 1. Storage Layer (CRITICO)
**Moduli:** `storage.js`, `storage/indexeddb.js`

**Motivo:** Gestisce persistenza dati utente, perdita dati = fallimento critico

**Test necessari:**
- ✅ Lettura/scrittura dati
- ✅ Migrazione da localStorage
- ✅ Gestione errori
- ✅ Fallback localStorage
- ✅ Struttura dati corretta
- ✅ Performance (<50ms per operazioni tipiche)

---

### 2. Schedule Grid (ALTA)
**Moduli:** `schedule-grid.js`

**Motivo:** Core dell'applicazione, visualizzazione e interazione principale

**Test necessari:**
- ✅ Creazione griglia
- ✅ Rendering lezioni
- ✅ Click su celle
- ✅ Click su lezioni
- ✅ Navigazione tastiera
- ✅ Accessibilità (ARIA labels)
- ✅ Performance rendering (>60fps con 50+ lezioni)

---

### 3. Main Application Logic (ALTA)
**Moduli:** `main.js`

**Motivo:** Orchestrazione logica, validazione input, gestione conflitti

**Test necessari:**
- ✅ Validazione input lezioni
- ✅ Rilevamento conflitti orari
- ✅ Aggiunta lezione
- ✅ Modifica lezione
- ✅ Eliminazione lezione
- ✅ Gestione panel (apri/chiudi)
- ✅ Focus management
- ✅ Keyboard shortcuts (Escape)
- ✅ Event handling

---

### 4. Theme Manager (MEDIA)
**Moduli:** `utils/theme.js`

**Motivo:** UX importante, non bloccante ma visibile

**Test necessari:**
- ✅ Applicazione temi (light, dark, expressive, auto)
- ✅ Persistenza preferenze
- ✅ Sync con prefers-color-scheme
- ✅ Colori personalizzati
- ✅ Reset colori
- ✅ Event dispatching

---

### 5. UI Components (MEDIA)
**Moduli:** `utils/toast.js`, `settings.js`

**Test necessari:**
- ✅ Toast notifications (tutti i tipi: success, error, warning, info)
- ✅ Toast auto-dismiss
- ✅ Toast accessibilità (aria-live)
- ✅ Settings load/save

---

## 📝 Tipi di Test

### Unit Tests

**Scope:** Funzioni e moduli isolati

**Strumenti:** Test runner integrato (test-runner.html) + futuri framework

**Esempi:**
```javascript
// Test validazione input
test('validateLesson - nome vuoto ritorna errore', () => {
  const errors = validateLesson('', 1, '08:00', 60);
  assert(errors.length > 0);
  assert(errors[0].includes('obbligatorio'));
});

// Test rilevamento conflitti
test('checkConflicts - rileva overlap semplice', () => {
  const existing = [{ id: '1', day: 1, start: '08:00', duration: 60 }];
  const newLesson = { day: 1, start: '08:30', duration: 60 };
  const conflicts = checkConflicts(existing, newLesson);
  assert(conflicts.length === 1);
});

// Test theme manager
test('ThemeManager - setTheme applica attributo data-theme', () => {
  ThemeManager.setTheme('dark');
  assert(document.documentElement.getAttribute('data-theme') === 'dark');
});
```

---

### Integration Tests

**Scope:** Interazione tra componenti

**Esempi:**
```javascript
// Test workflow aggiunta lezione completo
test('Workflow: Aggiungi lezione e verifica storage', async () => {
  // 1. Click su cella griglia
  // 2. Compila form
  // 3. Click su salva
  // 4. Verifica storage
  // 5. Verifica rendering
});

// Test workflow modifica tema con persistenza
test('Workflow: Cambio tema persiste dopo reload', async () => {
  // 1. Imposta tema dark
  // 2. Reload pagina
  // 3. Verifica tema ancora dark
});
```

---

### End-to-End Tests

**Scope:** Workflow utente completi nel browser

**Strumenti:** Playwright

**Esempi:**
- Utente aggiunge 3 lezioni in giorni diversi
- Utente modifica una lezione esistente
- Utente elimina una lezione con conferma
- Utente cambia tema e colori personalizzati
- Utente naviga con tastiera
- Screen reader legge correttamente contenuti

---

### Accessibility Tests

**Scope:** Conformità WCAG 2.1 AA

**Strumenti:** axe-core (jest-axe), Lighthouse, screen reader testing

**Verifica:**
- Contrasto colori >= 4.5:1 (testo normale) >= 3:1 (testo grande)
- Tutti gli elementi interattivi raggiungibili da tastiera
- Focus visibile (outline >= 2px, contrasto >= 3:1)
- ARIA labels presenti e corretti
- Landmark ARIA appropriati
- Screen reader compatibility
- Skip links funzionanti
- Form labels e error messages
- Live regions per notifiche dinamiche

---

## 📊 Copertura Minima

### Target di Copertura

| Area | Target | Priorità |
|------|--------|----------|
| Storage layer | ≥ 95% | CRITICO |
| Main logic (validation, conflicts) | ≥ 90% | ALTA |
| Schedule grid | ≥ 85% | ALTA |
| Theme manager | ≥ 80% | MEDIA |
| UI components | ≥ 75% | MEDIA |
| **Copertura globale** | **≥ 80%** | **OBIETTIVO** |

### Metriche

- **Line coverage:** Percentuale linee eseguite
- **Branch coverage:** Percentuale branch if/else eseguiti
- **Function coverage:** Percentuale funzioni chiamate
- **Statement coverage:** Percentuale statement eseguiti

---

## 🛠 Strumenti e Framework

### Attuali

1. **Test Runner HTML** (`tests/test-runner.html`)
   - Test runner integrato per browser
   - Test manuali e automatizzati
   - Visualizzazione risultati in tempo reale

2. **Playwright** (`@playwright/test`)
   - Test E2E in browser reale
   - Screenshot e video failure
   - Multi-browser support (Chromium, Firefox, WebKit)

### Futuri (opzionali)

3. **Jest** (se necessario per Node.js unit testing)
4. **axe-core / jest-axe** (accessibility testing automatizzato)
5. **Coverage reporter** (Istanbul/nyc)

---

## ▶️ Esecuzione dei Test

### Test Manuali (Browser)

```bash
# 1. Avvia server locale
python3 -m http.server 8080

# 2. Apri nel browser
http://localhost:8080/tests/test-runner.html

# 3. Click su "Run Tests"
```

### Test E2E (Playwright)

```bash
# Installa dipendenze
npm install

# Installa browser Playwright
npx playwright install chromium

# Esegui test
npm test

# Esegui in modalità headed (con UI)
npm run test:headed

# Esegui in debug mode
npm run test:debug
```

### Test Specifici

```bash
# Solo test di un file
npx playwright test test-runner.spec.js

# Test con pattern nel nome
npx playwright test --grep "storage"
```

---

## ✅ Checklist Test Essenziali

### Storage Layer

- [ ] **Storage.read()** ritorna struttura corretta `{ lessons: [], settings: {} }`
- [ ] **Storage.write()** persiste dati correttamente
- [ ] **IndexedDB** funziona correttamente quando disponibile
- [ ] **localStorage fallback** funziona quando IndexedDB non disponibile
- [ ] **Migrazione** da localStorage a IndexedDB avviene correttamente
- [ ] **Errori storage** non crashano l'app
- [ ] **Performance:** read/write < 50ms per dataset tipico (50 lezioni)

### Schedule Grid

- [ ] **createGrid()** crea 7 celle correttamente
- [ ] **renderLessons()** mostra tutte le lezioni
- [ ] **Click cella** emette evento `schedule-cell-click` con day corretto
- [ ] **Click lezione** emette evento `lesson-click` con id corretto
- [ ] **Navigazione tastiera** (Arrow keys) tra celle funziona
- [ ] **Enter/Space** su cella apre form
- [ ] **ARIA labels** sono presenti e corretti
- [ ] **Performance:** rendering 50+ lezioni senza lag

### Main Application Logic

- [ ] **validateLesson()** - nome vuoto → errore
- [ ] **validateLesson()** - day fuori range → errore
- [ ] **validateLesson()** - time formato errato → errore
- [ ] **validateLesson()** - duration invalida → errore
- [ ] **checkConflicts()** - rileva overlap semplice
- [ ] **checkConflicts()** - rileva overlap parziale
- [ ] **checkConflicts()** - esclude lezione in modifica
- [ ] **checkConflicts()** - ignora giorni diversi
- [ ] **Aggiunta lezione** valida → success toast + storage + rendering
- [ ] **Aggiunta lezione** conflitto → warning toast, nessun salvataggio
- [ ] **Aggiunta lezione** invalida → error toast
- [ ] **Modifica lezione** → aggiorna storage e rendering
- [ ] **Eliminazione lezione** → richiede conferma, rimuove da storage
- [ ] **Escape key** chiude panel
- [ ] **Focus trap** funziona nel panel modale

### Theme Manager

- [ ] **ThemeManager.init()** carica tema salvato
- [ ] **ThemeManager.setTheme('light')** applica tema light
- [ ] **ThemeManager.setTheme('dark')** applica tema dark
- [ ] **ThemeManager.setTheme('auto')** segue sistema
- [ ] **Tema 'auto'** cambia quando sistema cambia
- [ ] **setCustomColors()** applica colori personalizzati
- [ ] **resetColors()** ripristina colori default
- [ ] **Tema** persiste dopo reload
- [ ] **Eventi** `theme-changed` e `colors-changed` vengono emessi

### UI Components (Toast)

- [ ] **Toast.showToast()** mostra toast
- [ ] **Toast** tipo success → icona ✓, colore verde
- [ ] **Toast** tipo error → icona ✕, colore rosso
- [ ] **Toast** tipo warning → icona ⚠, colore arancione
- [ ] **Toast** tipo info → icona ℹ, colore blu
- [ ] **Toast** si auto-chiude dopo durata specificata
- [ ] **Toast** ha aria-live="polite"
- [ ] **Toast** sanitizza HTML (prevenzione XSS)

### Settings

- [ ] **loadSettings()** ritorna settings o {}
- [ ] **saveSettings()** persiste settings
- [ ] **Settings** persistono dopo reload

### Accessibility

- [ ] **Contrasto colori** >= 4.5:1 per testo normale
- [ ] **Contrasto colori** >= 3:1 per testo grande
- [ ] **Tutti gli elementi interattivi** raggiungibili da tastiera
- [ ] **Focus visibile** su tutti gli elementi (outline visibile)
- [ ] **ARIA labels** presenti su button senza testo
- [ ] **ARIA live regions** per notifiche dinamiche
- [ ] **Landmark ARIA** presenti (main, nav, banner)
- [ ] **Skip link** funzionante
- [ ] **Form labels** associati correttamente
- [ ] **Error messages** associati ai campi
- [ ] **Screen reader** legge contenuti correttamente

### Performance

- [ ] **First Contentful Paint** < 1.5s
- [ ] **Time to Interactive** < 3s
- [ ] **Rendering 50 lezioni** < 100ms
- [ ] **Storage operations** < 50ms
- [ ] **Theme switching** immediato (< 50ms)
- [ ] **No layout shift** (CLS < 0.1)
- [ ] **No janky animations** (60fps)

### PWA

- [ ] **Service Worker** registrato correttamente
- [ ] **Manifest** valido
- [ ] **Icons** tutte le dimensioni presenti
- [ ] **Offline** app funziona offline
- [ ] **Install prompt** funziona
- [ ] **Theme color** applicato correttamente

---

## 🔄 Continuous Integration

### GitHub Actions Workflow

```yaml
name: Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm install
      - run: npx playwright install --with-deps chromium
      - run: npm test
      - uses: actions/upload-artifact@v3
        if: failure()
        with:
          name: test-results
          path: test-results/
```

### Test Success Criteria per PR

Prima di mergare una PR, verificare:

- ✅ Tutti i test passano
- ✅ Nessun test skippato senza motivo
- ✅ Copertura >= 80% (o non regredisce)
- ✅ Nessun console error nel test output
- ✅ Performance non regredisce (confronto baseline)
- ✅ Accessibility score >= 90 (Lighthouse)

---

## 🐛 Gestione Bug

### Quando un bug viene scoperto

1. **Scrivere un failing test** che riproduce il bug
2. **Fixare il bug**
3. **Verificare** che il test ora passa
4. **Commit** test + fix insieme

### Template Issue Bug

```markdown
## Bug Report

**Descrizione:** [descrizione bug]
**Steps to reproduce:** [passi per riprodurre]
**Expected behavior:** [comportamento atteso]
**Actual behavior:** [comportamento attuale]
**Test case:** [link al test che fallisce, se esiste]
**Browser/Device:** [info ambiente]
**Screenshots:** [se applicabile]
```

---

## 📚 Risorse

### Documentazione

- [STYLE_GUIDE.md](STYLE_GUIDE.md) - Convenzioni codice e test
- [ARCHITECTURE.md](ARCHITECTURE.md) - Architettura applicazione
- [CONTRIBUTING.md](../CONTRIBUTING.md) - Come contribuire

### Tool Documentation

- [Playwright Documentation](https://playwright.dev)
- [Jest Documentation](https://jestjs.io)
- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [axe DevTools](https://www.deque.com/axe/devtools/)

---

## 🔄 Aggiornamenti

Questa strategia è un documento vivo e verrà aggiornata con:

- Nuovi test aggiunti
- Modifiche agli standard di copertura
- Nuovi strumenti adottati
- Best practices emergenti
- Feedback dal team

---

**Mantainer:** @antoniocorsano-boop  
**Ultima modifica:** Ottobre 2025  
**Versione:** 1.0
