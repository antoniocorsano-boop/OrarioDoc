# Guida all'Esecuzione dei Test - OrarioDoc

> **Versione:** 1.0  
> **Data:** Ottobre 2025  
> **Audience:** Sviluppatori e Contributor

## 📋 Indice

1. [Introduzione](#introduzione)
2. [Tipi di Test](#tipi-di-test)
3. [Requisiti](#requisiti)
4. [Esecuzione Test Manuali](#esecuzione-test-manuali)
5. [Esecuzione Test E2E](#esecuzione-test-e2e)
6. [Interpretazione Risultati](#interpretazione-risultati)
7. [Debugging Test](#debugging-test)
8. [Continuous Integration](#continuous-integration)
9. [Best Practices](#best-practices)
10. [Troubleshooting](#troubleshooting)

---

## 🎯 Introduzione

Questa guida spiega come eseguire tutti i test dell'applicazione OrarioDoc, interpretare i risultati e risolvere eventuali problemi.

### Obiettivi dei Test

- ✅ Verificare correttezza funzionale
- ✅ Prevenire regressioni
- ✅ Documentare comportamento atteso
- ✅ Garantire accessibilità
- ✅ Validare performance

---

## 📚 Tipi di Test

### 1. Test Manuali (Browser-based)

**Localizzazione:** `tests/test-runner.html`

**Contenuto:**
- Test di base (environment, API)
- Unit test (moduli isolati)
- Integration test (workflow completi)

**Esecuzione:** Browser locale

### 2. Test E2E (Playwright)

**Localizzazione:** `playwright-tests/test-runner.spec.js`

**Contenuto:**
- Test UI completi
- Workflow utente realistici
- Screenshot su failure

**Esecuzione:** Playwright automation

---

## 🔧 Requisiti

### Software Necessario

```bash
# Node.js (v16+)
node --version

# npm (viene con Node.js)
npm --version

# Python 3 (per server locale)
python3 --version
```

### Installazione Dipendenze

```bash
# Clona il repository
git clone https://github.com/antoniocorsano-boop/OrarioDoc.git
cd OrarioDoc

# Installa dipendenze npm
npm install

# Installa browser Playwright
npx playwright install chromium
```

---

## 🌐 Esecuzione Test Manuali

### Step 1: Avvia Server Locale

```bash
# Dalla root del progetto
python3 -m http.server 8080
```

**Output atteso:**
```
Serving HTTP on 0.0.0.0 port 8080 (http://0.0.0.0:8080/) ...
```

### Step 2: Apri Test Runner

Apri nel browser:
```
http://localhost:8080/tests/test-runner.html
```

### Step 3: Esegui i Test

1. Vedrai l'interfaccia del test runner
2. Click su **"Run Tests"**
3. I test inizieranno automaticamente
4. Vedrai i risultati in tempo reale

### Interfaccia Test Runner

```
┌─────────────────────────────────────┐
│  OrarioDoc Test Runner              │
├─────────────────────────────────────┤
│  [Run Tests]                        │
├─────────────────────────────────────┤
│  Total: 45   Passed: 43             │
│  Failed: 2   Skipped: 0             │
├─────────────────────────────────────┤
│  ✓ Test 1 passed                    │
│  ✓ Test 2 passed                    │
│  ✗ Test 3 failed                    │
│    Error: Expected 5, got 3         │
│  ...                                │
└─────────────────────────────────────┘
```

### Interpretare i Risultati

**Indicatori di Stato:**

- ✓ **Verde** - Test passato
- ✗ **Rosso** - Test fallito
- ⊘ **Arancione** - Test skippato

**Statistiche:**

- **Total:** Numero totale test eseguiti
- **Passed:** Test superati con successo
- **Failed:** Test falliti (richiede attenzione)
- **Skipped:** Test saltati (se presenti)

---

## 🤖 Esecuzione Test E2E

### Metodo 1: Esecuzione Standard

```bash
# Dalla root del progetto
npm test
```

**Cosa fa:**
1. Avvia un server HTTP interno (porta 8080)
2. Lancia Playwright
3. Esegue tutti i test E2E
4. Genera report HTML

### Metodo 2: Esecuzione in Modalità Headed

```bash
# Vedi il browser durante i test
npm run test:headed
```

Utile per:
- Debug visivo
- Capire cosa sta succedendo
- Verificare interazioni UI

### Metodo 3: Esecuzione in Debug Mode

```bash
# Debug passo-passo con Playwright Inspector
npm run test:debug
```

Funzionalità:
- Pausa automatica su errori
- Esecuzione step-by-step
- Inspect elementi
- Console logs

### Opzioni Avanzate

```bash
# Esegui solo test specifici
npx playwright test --grep "storage"

# Esegui con più worker (parallelo)
npx playwright test --workers=4

# Genera video di tutti i test
npx playwright test --video=on

# Esegui su browser specifico
npx playwright test --project=chromium
npx playwright test --project=firefox
npx playwright test --project=webkit
```

---

## 📊 Interpretazione Risultati

### Output Console

```
Running 1 test using 1 worker

  ✓  test-runner.spec.js:5:1 › OrarioDoc automated tests (2.3s)

  1 passed (3.1s)
```

**Elementi:**
- `✓` - Test passato
- `(2.3s)` - Tempo di esecuzione
- `1 passed` - Riepilogo

### Report HTML

Dopo l'esecuzione, apri:
```
playwright-report/index.html
```

**Contiene:**
- Lista completa test
- Screenshot su failure
- Video registrazioni (se abilitato)
- Trace logs
- Timeline esecuzione

### Test Results JSON

```json
{
  "total": 45,
  "passed": 43,
  "failed": 2,
  "skipped": 0,
  "failedItems": [
    "Validation test: Expected 5, got 3",
    "Storage test: Write operation failed"
  ]
}
```

---

## 🐛 Debugging Test

### Test Manuali

**1. Apri DevTools**
```
F12 oppure Right-click > Inspect
```

**2. Vai alla Console**
```
Console tab
```

**3. Cerca errori**
```javascript
// Errori in rosso
// Warnings in giallo
// Logs normali in bianco
```

**4. Verifica Network**
```
Network tab > verifica richieste fallite
```

### Test E2E

**1. Usa Debug Mode**
```bash
npm run test:debug
```

**2. Aggiungi Breakpoint**
```javascript
await page.pause(); // Pausa qui
```

**3. Screenshot su Failure**
```javascript
await page.screenshot({ 
  path: 'debug-screenshot.png',
  fullPage: true 
});
```

**4. Console Logs**
```javascript
page.on('console', msg => console.log('PAGE LOG:', msg.text()));
```

### Tecniche Comuni

**A. Aumenta Timeout**
```javascript
// Se test è lento
test.setTimeout(120000); // 2 minuti
```

**B. Wait for Specific Element**
```javascript
await page.waitForSelector('#element', { timeout: 30000 });
```

**C. Controlla Stato Applicazione**
```javascript
const state = await page.evaluate(() => {
  return window.Storage.read();
});
console.log('Current state:', state);
```

---

## 🔄 Continuous Integration

### GitHub Actions Setup

Il progetto usa GitHub Actions per CI/CD.

**Workflow:** `.github/workflows/tests.yml`

```yaml
name: Tests

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main ]

jobs:
  test:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      - name: Install dependencies
        run: npm install
      
      - name: Install Playwright browsers
        run: npx playwright install --with-deps chromium
      
      - name: Run tests
        run: npm test
      
      - name: Upload test results
        uses: actions/upload-artifact@v3
        if: failure()
        with:
          name: test-results
          path: test-results/
          retention-days: 7
```

### Test in Pull Request

**Quando apri una PR:**

1. ✅ Tutti i test devono passare
2. ✅ Nessun warning bloccante
3. ✅ Coverage non deve regredire
4. ✅ Performance check pass

**Se i test falliscono:**

1. Leggi il log del test
2. Scarica artifacts (screenshot, logs)
3. Riproduci localmente
4. Fixa e push di nuovo

---

## ✅ Best Practices

### Prima di Committare

```bash
# 1. Esegui test locali
npm test

# 2. Verifica nessun errore console
# Apri test-runner.html e controlla Console

# 3. Verifica no regressioni
# Confronta test results con baseline
```

### Scrittura Nuovi Test

```javascript
// ✅ BUONO: Descrittivo e specifico
runner.test('[Storage] Can write and read from localStorage', () => {
  // test implementation
});

// ❌ CATTIVO: Vago e generico
runner.test('Test 1', () => {
  // test implementation
});
```

### Organizzazione Test

```javascript
// ✅ BUONO: Raggruppato per modulo
runner.test('[Storage] Write test', () => {});
runner.test('[Storage] Read test', () => {});
runner.test('[Validation] Name required', () => {});
runner.test('[Validation] Time format', () => {});

// ❌ CATTIVO: Disorganizzato
runner.test('Test write', () => {});
runner.test('Name check', () => {});
runner.test('Read data', () => {});
```

### Test Isolation

```javascript
// ✅ BUONO: Cleanup dopo test
runner.test('DOM test', () => {
  const el = document.createElement('div');
  document.body.appendChild(el);
  
  // ... test ...
  
  document.body.removeChild(el); // Cleanup!
});

// ❌ CATTIVO: Lascia sporcizia
runner.test('DOM test', () => {
  const el = document.createElement('div');
  document.body.appendChild(el);
  // ... test ...
  // No cleanup!
});
```

---

## 🚨 Troubleshooting

### Problema: Test Timeout

**Sintomo:**
```
Error: Test timeout of 30000ms exceeded
```

**Soluzioni:**
```bash
# Aumenta timeout globale
# playwright.config.js
timeout: 60000,

# Oppure per test specifico
test.setTimeout(60000);
```

---

### Problema: Browser Non Installato

**Sintomo:**
```
Error: browserType.launch: Executable doesn't exist
```

**Soluzione:**
```bash
npx playwright install chromium
# oppure per tutti i browser
npx playwright install
```

---

### Problema: Porta 8080 Occupata

**Sintomo:**
```
Error: Port 8080 is already in use
```

**Soluzioni:**
```bash
# Trova processo che usa porta 8080
lsof -i :8080

# Killa il processo
kill -9 <PID>

# Oppure usa porta diversa
python3 -m http.server 8081
```

---

### Problema: Test Flaky (Intermittenti)

**Sintomo:** Test passa/fallisce casualmente

**Cause comuni:**
- Race conditions
- Timing issues
- Dipendenze esterne

**Soluzioni:**
```javascript
// ✅ Usa waitFor invece di setTimeout
await page.waitForSelector('#element');

// ✅ Aumenta stabilità
await page.waitForLoadState('networkidle');

// ✅ Retry su failure
test.retries(2);
```

---

### Problema: Test Passano Localmente ma Falliscono in CI

**Cause comuni:**
- Differenze ambiente
- Timing/performance
- Font/rendering differences

**Soluzioni:**
```javascript
// Usa screenshot comparison con threshold
await expect(page).toHaveScreenshot({ 
  maxDiffPixels: 100 
});

// Aspetta animazioni finiscano
await page.waitForTimeout(500);

// Disabilita animazioni in test
await page.addStyleTag({ 
  content: '* { animation: none !important; }' 
});
```

---

## 📞 Supporto

### Risorse

- **Documentazione Test:** `docs/TEST_STRATEGY.md`
- **Playwright Docs:** https://playwright.dev
- **GitHub Issues:** https://github.com/antoniocorsano-boop/OrarioDoc/issues

### Segnalare Problemi

Quando apri una issue per problemi con i test:

**Template:**
```markdown
## Descrizione Problema
[Descrivi il problema]

## Test che Fallisce
[Nome del test]

## Errore
```
[Incolla errore completo]
```

## Steps to Reproduce
1. [Passo 1]
2. [Passo 2]
3. [Passo 3]

## Ambiente
- OS: [Windows/Mac/Linux]
- Browser: [Chrome/Firefox/Safari]
- Node version: [x.x.x]
- Playwright version: [x.x.x]

## Screenshot/Logs
[Allega screenshot o logs se disponibili]
```

---

## 🎓 Conclusione

Seguendo questa guida dovresti essere in grado di:

- ✅ Eseguire tutti i tipi di test
- ✅ Interpretare i risultati
- ✅ Debuggare problemi
- ✅ Scrivere nuovi test
- ✅ Contribuire al progetto con confidence

**Happy Testing! 🚀**

---

**Mantainer:** @antoniocorsano-boop  
**Ultima modifica:** Ottobre 2025  
**Versione:** 1.0
