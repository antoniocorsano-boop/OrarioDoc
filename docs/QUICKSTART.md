# Quick Start Guide - OrarioDoc

Guida rapida per iniziare a sviluppare con OrarioDoc.

## 📋 Prerequisiti

OrarioDoc è una PWA vanilla JavaScript senza dipendenze di runtime. Per lo sviluppo base serve solo:

- **Python 3** (per server HTTP locale) - già installato su molti sistemi
- **Git** ([Download](https://git-scm.com/))
- Un editor di codice (consigliato: [VS Code](https://code.visualstudio.com/))

### Prerequisiti opzionali per testing

- **Node.js** >= 18.x ([Download](https://nodejs.org/)) - solo per eseguire test Playwright
- **npm** >= 9.x (incluso con Node.js)

### Verifica installazione

```bash
python3 --version  # Python 3.x
git --version      # Qualsiasi versione recente

# Opzionale (solo per testing)
node --version     # v18.0.0 o superiore
npm --version      # v9.0.0 o superiore
```

## 🚀 Setup iniziale

### 1. Clone del repository

```bash
# Clone tramite HTTPS
git clone https://github.com/antoniocorsano-boop/OrarioDoc.git

# Oppure tramite SSH (se configurato)
git clone git@github.com:antoniocorsano-boop/OrarioDoc.git

# Entra nella directory
cd OrarioDoc
```

### 2. Installazione dipendenze (opzionale - solo per testing)

```bash
# Installa Playwright per i test
npm install
```

**Nota**: Le dipendenze npm sono **solo per testing** e non necessarie per eseguire l'applicazione.

## 🏃 Esecuzione in sviluppo

### Metodo 1: Python HTTP Server (Raccomandato)

```bash
# Avvia server sulla porta 8080
python3 -m http.server 8080

# Apri il browser su:
# http://127.0.0.1:8080
# oppure
# http://localhost:8080
```

### Metodo 2: VS Code Live Server

1. Installa l'estensione "[Live Server](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer)" in VS Code
2. Apri la cartella OrarioDoc in VS Code
3. Click destro su `index.html` → "Open with Live Server"
4. Il browser si aprirà automaticamente

### Metodo 3: Node.js (se disponibile)

```bash
# Usando http-server
npx http-server -p 8080

# Oppure usando serve
npx serve -p 8080
```

### Comandi disponibili

```bash
# Avvio sviluppo
python3 -m http.server 8080

# Test (opzionale - richiede npm)
npm test

# Test in modalità headed (browser visibile)
npm run test:headed

# Test con debug
npm run test:debug

# Validazione test
npm run test:validate
```

**Nota**: L'applicazione funziona perfettamente senza eseguire test. I test sono utili solo per sviluppatori che modificano il codice.

## 🛠️ Workflow di sviluppo

### 1. Crea un nuovo branch

```bash
# Feature branch
git checkout -b feature/nome-funzionalita

# Bug fix branch
git checkout -b fix/nome-bug

# Documentation branch
git checkout -b docs/argomento
```

### 2. Sviluppa la tua funzionalità

1. Avvia il server di sviluppo: `python3 -m http.server 8080`
2. Modifica i file necessari
3. Ricarica il browser per vedere le modifiche
4. Testa su diversi temi (Light, Dark, Expressive)
5. Verifica accessibilità con Lighthouse

### 3. Commit delle modifiche

```bash
# Aggiungi i file modificati
git add .

# Commit con messaggio descrittivo (Conventional Commits)
git commit -m "feat: descrizione della funzionalità"

# Oppure per un bug fix
git commit -m "fix: descrizione del fix"
```

### 4. Push e Pull Request

```bash
# Push del branch
git push origin feature/nome-funzionalita

# Quindi apri una Pull Request su GitHub
```

## 📁 Struttura del progetto

```
OrarioDoc/
├── index.html           # Pagina principale
├── manifest.json        # PWA manifest
├── service-worker.js    # Service Worker per offline
├── theme.css            # Sistema temi Material Design 3
├── style.css            # Stili applicazione
│
├── src/
│   ├── components/      # Componenti CSS Material Design 3
│   │   ├── button.css
│   │   ├── card.css
│   │   ├── dialog.css
│   │   └── ...
│   │
│   ├── screens/         # Schermate applicazione
│   │   └── settings-screen.js
│   │
│   ├── storage/         # Gestione dati
│   │   ├── indexeddb.js
│   │   └── storage.js
│   │
│   ├── utils/           # Utility functions
│   │   ├── theme.js     # Theme manager
│   │   └── toast.js     # Notifiche toast
│   │
│   ├── main.js          # Entry point applicazione
│   ├── schedule-grid.js # Gestione griglia orario
│   └── settings.js      # Settings manager
│
├── public/              # Asset statici
├── icons/               # Icone PWA
├── docs/                # Documentazione
├── tests/               # Test Playwright
└── .github/             # Config GitHub
```

## 🧪 Testing

### Eseguire i test (richiede npm)

```bash
# Tutti i test
npm test

# Test specifico
npm test -- ScheduleCard.test.js

npm test

# Test unitari
npm run test:unit

# Test con browser visibile
npm run test:headed

# Test con debugging
npm run test:debug

# Report test
npm run test:report
```

### Testing manuale

1. **Accessibilità**: Usa Lighthouse in Chrome DevTools (target: score >= 95)
2. **Responsive**: Testa su mobile (320px), tablet (768px), desktop (1280px)
3. **Temi**: Verifica funzionamento su tutti i 4 temi
4. **Tastiera**: Naviga l'app usando solo Tab, Enter, Escape
5. **Offline**: Disabilita rete e verifica funzionamento PWA

## 🎨 Sviluppo UI

### Linee guida componenti

**Usa sempre CSS Variables** da `theme.css`:

```css
/* ✅ Corretto */
.button {
  background: var(--md-sys-color-primary);
  color: var(--md-sys-color-on-primary);
  padding: var(--md-sys-spacing-md);
  border-radius: var(--md-sys-shape-corner-full);
}

/* ❌ Sbagliato - valori hardcoded */
.button {
  background: #2b7cff;
  padding: 16px;
  border-radius: 20px;
}
```

### Checklist componente

- [ ] Usa solo CSS Variables da theme.css
- [ ] ARIA labels su elementi interattivi
- [ ] Contrasto colori >= 4.5:1 (WCAG AA)
- [ ] Navigazione tastiera funzionante
- [ ] Focus indicators visibili
- [ ] Testato su tutti i temi (Light, Dark, Expressive, Auto)
- [ ] Responsive su mobile/tablet/desktop

## 🐛 Debug e troubleshooting

### App non si carica

```bash
# Verifica che il server sia in esecuzione
ps aux | grep python

# Verifica la porta
lsof -i :8080

# Riavvia il server
python3 -m http.server 8080
```

### Service Worker issues

```javascript
// Apri Console del browser e esegui:
navigator.serviceWorker.getRegistrations().then(registrations => {
  registrations.forEach(reg => reg.unregister());
});

// Poi ricarica la pagina con Ctrl+Shift+R (hard reload)
```

### IndexedDB issues

```javascript
// Apri Console del browser e esegui:
indexedDB.deleteDatabase('OrarioDoc');

// Ricarica la pagina
```

### Tema non si applica

1. Apri DevTools → Application → Local Storage
2. Verifica chiave `orariodoc:theme`
3. Cancella e ricarica: `localStorage.clear()`

## 📚 Risorse utili

### Documentazione OrarioDoc
- [README.md](../README.md) - Overview progetto
- [ARCHITECTURE.md](ARCHITECTURE.md) - Architettura sistema
- [THEMES.md](THEMES.md) - Sistema temi completo
- [COMPONENTS.md](COMPONENTS.md) - Componenti MD3
- [STYLE_GUIDE.md](STYLE_GUIDE.md) - Linee guida codice
- [CONTRIBUTING.md](../CONTRIBUTING.md) - Guida contributori

### Riferimenti esterni
- [Material Design 3](https://m3.material.io/) - Design system
- [WCAG 2.1](https://www.w3.org/WAI/WCAG21/quickref/) - Accessibilità
- [MDN Web Docs](https://developer.mozilla.org/) - Web APIs
- [Playwright](https://playwright.dev/) - Testing framework

## 💡 Tips

- **Hot reload**: Non c'è hot reload automatico. Ricarica manualmente il browser dopo ogni modifica
- **DevTools**: Usa Chrome DevTools per debugging (F12)
- **Mobile testing**: Usa Device Mode in DevTools per testare responsive
- **Performance**: Usa Lighthouse per audit performance/accessibilità
- **Offline**: Disabilita rete in DevTools per testare PWA offline

## ❓ Domande frequenti

**Q: Serve Node.js per eseguire l'app?**  
A: No, serve solo Python per il server locale. Node.js serve solo per i test.

**Q: Come faccio il deploy?**  
A: Copia tutti i file su un server web statico (GitHub Pages, Netlify, Vercel).

**Q: Posso usare TypeScript?**  
A: OrarioDoc usa vanilla JS per compatibilità massima. TypeScript richiederebbe build step.

**Q: Dove sono salvati i dati?**  
A: In IndexedDB nel browser. I dati rimangono sul dispositivo dell'utente.

**Q: Come aggiorno i temi?**  
A: Modifica `theme.css` e le variabili CSS. Leggi [THEMES.md](THEMES.md) per dettagli.

---

**Pronto a iniziare?** Apri il terminale, avvia il server e inizia a sviluppare! 🚀
