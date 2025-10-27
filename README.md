# OrarioDoc — Progressive Web App per Gestione Orario Scolastico

**OrarioDoc** è una Progressive Web App moderna e leggera per la gestione dell'orario settimanale degli insegnanti. Sviluppata in Vanilla JavaScript, è compatibile con qualsiasi ambiente, incluso Termux su dispositivi mobile.

## ✨ Caratteristiche Principali

- 📅 **Gestione Orario Settimanale**: Crea, modifica ed elimina lezioni con interfaccia intuitiva
- 🎨 **4 Temi Material Design 3**: Light, Dark, Expressive e Auto (sistema)
- ♿ **Accessibilità WCAG 2.1 AA**: Navigazione tastiera, screen reader, contrasti ottimali
- 📱 **Responsive Design**: Ottimizzato per mobile, tablet e desktop
- 💾 **Dati Offline**: Persistenza locale in IndexedDB, nessun server richiesto
- ⚡ **PWA Completa**: Installabile, funziona offline, service worker integrato
- 🎯 **Zero Dipendenze**: Vanilla JavaScript puro, nessun framework richiesto
- 🔒 **Privacy First**: Tutti i dati rimangono sul tuo dispositivo

## 🚀 Quick Start

### Metodo 1: Server Python (Raccomandato)
```bash
# Clona il repository
git clone https://github.com/antoniocorsano-boop/OrarioDoc.git
cd OrarioDoc

# Avvia server locale
python3 -m http.server 8080

# Apri nel browser
# http://127.0.0.1:8080
```

### Metodo 2: Live Server (VS Code)
1. Installa estensione "Live Server" in VS Code
2. Apri la cartella del progetto
3. Click destro su `index.html` → "Open with Live Server"

### Metodo 3: Node.js
```bash
npx serve
# Oppure
npx http-server
```

Per istruzioni dettagliate, consulta **[docs/QUICKSTART.md](docs/QUICKSTART.md)**.

## 📚 Documentazione

- **[ROADMAP.md](ROADMAP.md)** - Piano di sviluppo completo con 11 subtask
- **[CHANGELOG.md](CHANGELOG.md)** - Storico versioni e modifiche
- **[CONTRIBUTING.md](CONTRIBUTING.md)** - Guida per contributori
- **[docs/](docs/)** - Documentazione tecnica dettagliata
  - [ARCHITECTURE.md](docs/ARCHITECTURE.md) - Architettura del sistema
  - [THEMES.md](docs/THEMES.md) - Sistema temi Material Design 3
  - [COMPONENTS.md](docs/COMPONENTS.md) - Componenti riutilizzabili
  - [STYLE_GUIDE.md](docs/STYLE_GUIDE.md) - Linee guida codice
  - [RESPONSIVE.md](docs/RESPONSIVE.md) - Design responsive
  - [PERFORMANCE.md](docs/PERFORMANCE.md) - Ottimizzazioni performance
  - [TEST_STRATEGY.md](docs/TEST_STRATEGY.md) - Strategia testing

## 🗺️ Stato Sviluppo

Il progetto ha completato la roadmap principale con tutti i 11 subtask implementati:

✅ **Sprint 1-4 Completati:**
- Sistema UI/UX Material Design 3 consolidato
- Accessibilità WCAG 2.1 AA implementata
- Design responsive ottimizzato
- Funzionalità core complete (orario, impostazioni, temi)
- Testing automatizzato con Playwright
- Performance ottimizzate (Lighthouse score >= 90)
- Documentazione completa

Per dettagli completi, consulta **[ROADMAP.md](ROADMAP.md)**.

### 🏗️ Architettura dello Stile

OrarioDoc utilizza un sistema di gestione degli stili **centralizzato** basato su Material Design 3 e CSS Variables.

#### Struttura File CSS

1. **`theme.css`** - Sistema tema centralizzato
   - Variabili CSS (colori, tipografia, spacing, elevazioni, forme)
   - Definizioni temi: light, dark, expressive
   - Stili base globali e utility classes
   - Font: Roboto Flex (Google Fonts)

2. **`style.css`** - Stili applicazione
   - Layout componenti (topbar, schedule-grid, forms, footer)
   - Usa **solo** variabili da theme.css

3. **`src/components/*.css`** - Componenti Material Design 3
   - Button, Card, Navigation, TextField, Dialog, FAB, Chip, List
   - Tutti usano **solo** variabili da theme.css

**⚠️ Importante:** Nessun valore hardcoded - tutti gli stili usano CSS Variables per consistenza e manutenibilità.

### 🎨 Sistema di Temi

OrarioDoc implementa un **sistema di gestione dei temi** basato su Material Design 3 con CSS Variables, garantendo consistenza visiva e accessibilità completa.

#### Temi Disponibili

1. **Automatico (Sistema)** *(predefinito)*  
   Segue automaticamente le preferenze del sistema operativo (`prefers-color-scheme`).

2. **Chiaro (Light)**  
   Tema con colori luminosi e alta leggibilità. Ottimale per ambienti ben illuminati.

3. **Scuro (Dark)**  
   Tema con colori scuri ottimizzato per ambienti con poca luce. Riduce l'affaticamento visivo.

4. **Expressive (Material Design 3)**  
   Palette vivace e dinamica con gradiente di sfondo moderno.

#### Come Selezionare un Tema

1. Clicca sul pulsante **Impostazioni** nella barra superiore
2. Seleziona uno dei temi disponibili nel menu a tendina
3. Il tema viene applicato **immediatamente** con anteprima in tempo reale
4. La scelta viene **salvata automaticamente** in localStorage

### ♿ Accessibilità

OrarioDoc garantisce piena accessibilità secondo standard WCAG 2.1 Level AA:

- ✅ **Navigazione da tastiera** completa con stati di focus visibili
- ✅ **Supporto screen reader** con ARIA labels appropriati
- ✅ **Contrasto colori conforme** su tutti i temi (>= 4.5:1 testo normale, >= 3:1 testo grande)
- ✅ **Skip link** per navigazione rapida
- ✅ **Focus trapping** nei modal
- ✅ **Live regions** per notifiche dinamiche
- ✅ **Struttura heading** gerarchica corretta

**Documentazione:** [docs/THEMES.md](docs/THEMES.md) per dettagli completi

### 📦 Componenti Material Design 3

OrarioDoc include componenti MD3 completi e riutilizzabili:

- **Button** (Filled, Tonal, Outlined, Text, Elevated)
- **Card** (Elevated, Filled, Outlined)
- **Navigation** (Top App Bar, Bottom Navigation, Navigation Drawer)
- **TextField** (Filled, Outlined)
- **Dialog/Modal** (Basic, Full Screen)
- **FAB** (Standard, Small, Large, Extended)
- **Chip** (Assist, Filter, Input, Suggestion)
- **List** (One-line, Two-line, Three-line)

**Documentazione:** [docs/COMPONENTS.md](docs/COMPONENTS.md) per esempi e best practices

### 🔧 Variabili CSS

Tutte definite in `theme.css`:
- **Colori:** `--md-sys-color-primary`, `--md-sys-color-surface`, ecc.
- **Tipografia:** `--md-sys-typescale-*` (font-family, size, weight, line-height)
- **Spacing:** `--md-sys-spacing-xs/sm/md/lg/xl/2xl`
- **Elevazioni:** `--md-sys-elevation-level0` fino a `level5`
- **Forme:** `--md-sys-shape-corner-small/medium/large/full`
- **Stati:** `--md-sys-state-hover-opacity`, `--md-sys-state-disabled-opacity`

**Esempio uso corretto:**
```css
/* ✅ Corretto - usa variabili */
.button {
  background: var(--md-sys-color-primary);
  color: var(--md-sys-color-on-primary);
  padding: var(--md-sys-spacing-sm) var(--md-sys-spacing-lg);
  border-radius: var(--md-sys-shape-corner-full);
}

/* ❌ Sbagliato - valori hardcoded */
.button {
  background: #2b7cff;
  padding: 8px 16px;
}
```

## 🛠️ Tecnologie Utilizzate

- **Vanilla JavaScript** (ES6+) - Nessun framework, massima compatibilità
- **CSS Variables** - Sistema tematizzazione centralizzato
- **IndexedDB** - Persistenza dati offline
- **Service Worker** - Funzionalità PWA e caching
- **Material Design 3** - Design system e componenti
- **Roboto Flex** - Font variabile Google Fonts
- **Playwright** - Test E2E automatizzati

## 👨‍💻 Per Sviluppatori

### Linee Guida Sviluppo

**⚠️ Regole Importanti:**
- Usa **SEMPRE** CSS Variables da `theme.css` (mai valori hardcoded)
- Testa su **tutti i temi** (Light, Dark, Expressive)
- Verifica **accessibilità** con Lighthouse/axe
- Mantieni **test coverage** >= 80%
- Segui [STYLE_GUIDE.md](docs/STYLE_GUIDE.md)

### Setup Sviluppo

```bash
# Clona repository
git clone https://github.com/antoniocorsano-boop/OrarioDoc.git
cd OrarioDoc

# Avvia server di sviluppo
python3 -m http.server 8080

# In altra finestra terminale: esegui test
npm test

# Test specifici
npm run test:unit        # Test unitari
npm run test:headed      # Test con browser visibile
npm run test:debug       # Debug mode
```

### Ordine Inclusione CSS

```html
<link rel="stylesheet" href="/theme.css"/>
<link rel="stylesheet" href="/src/components/button.css"/>
<link rel="stylesheet" href="/src/components/card.css"/>
<link rel="stylesheet" href="/style.css"/>
```

## 🤝 Come Contribuire

Contributi sono benvenuti! Per iniziare:

1. **Leggi la documentazione:**
   - [CONTRIBUTING.md](CONTRIBUTING.md) - Guida completa contributori
   - [ROADMAP.md](ROADMAP.md) - Task pianificati
   - [docs/STYLE_GUIDE.md](docs/STYLE_GUIDE.md) - Linee guida codice

2. **Scegli un task:**
   - Controlla [Issues](https://github.com/antoniocorsano-boop/OrarioDoc/issues)
   - Consulta la [ROADMAP](ROADMAP.md) per task disponibili
   - Usa i template issue per segnalazioni

3. **Workflow Git:**
   ```bash
   # Fork il repository
   # Crea branch feature
   git checkout -b feature/nome-feature
   
   # Fai commit descrittivi
   git commit -m "feat: descrizione modifica"
   
   # Push e apri Pull Request
   git push origin feature/nome-feature
   ```

4. **Prima di aprire una PR:**
   - ✅ Esegui test: `npm test`
   - ✅ Verifica accessibilità (Lighthouse)
   - ✅ Testa su tutti i temi
   - ✅ Verifica responsive su mobile/tablet/desktop
   - ✅ Segui [STYLE_GUIDE.md](docs/STYLE_GUIDE.md)

### Issue Templates

Usa i template appropriati per:
- 🐛 **Bug Report** - Segnalare bug
- ⭐ **Feature Request** - Proporre nuove funzionalità
- 📚 **Documentation** - Miglioramenti documentazione
- 🗺️ **Roadmap Subtask** - Task dalla roadmap
- ❓ **Question** - Domande generali

## 📄 Licenza

Questo progetto è rilasciato sotto licenza [MIT](LICENSE).

## 🔗 Collegamenti Utili

- **Repository:** [github.com/antoniocorsano-boop/OrarioDoc](https://github.com/antoniocorsano-boop/OrarioDoc)
- **Issues:** [github.com/antoniocorsano-boop/OrarioDoc/issues](https://github.com/antoniocorsano-boop/OrarioDoc/issues)
- **Releases:** [github.com/antoniocorsano-boop/OrarioDoc/releases](https://github.com/antoniocorsano-boop/OrarioDoc/releases)
- **Material Design 3:** [m3.material.io](https://m3.material.io/)
- **WCAG 2.1:** [www.w3.org/WAI/WCAG21/quickref](https://www.w3.org/WAI/WCAG21/quickref/)

## 📧 Supporto e Contatti

Per domande, supporto o segnalazioni:
- Apri una [Issue](https://github.com/antoniocorsano-boop/OrarioDoc/issues)
- Consulta la [documentazione](docs/)
- Leggi le [FAQ](docs/THEMES.md#faq) nella documentazione temi

---

**Versione:** 1.0.0  
**Ultimo aggiornamento:** Ottobre 2025  
**Stato:** ✅ Pronto per produzione

Sviluppato con ❤️ per insegnanti e educatori
