# Quick Start Guide - OrarioDoc

Guida rapida per iniziare a sviluppare con OrarioDoc.

## 📋 Prerequisiti

Prima di iniziare, assicurati di avere installato:

- **Node.js** >= 18.x ([Download](https://nodejs.org/))
- **npm** >= 9.x (incluso con Node.js) o **yarn** >= 1.22.x
- **Git** ([Download](https://git-scm.com/))
- Un editor di codice (consigliato: [VS Code](https://code.visualstudio.com/))

### Verifica installazione

```bash
node --version  # v18.0.0 o superiore
npm --version   # v9.0.0 o superiore
git --version   # Qualsiasi versione recente
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

### 2. Installazione dipendenze

```bash
# Usando npm
npm install

# Oppure usando yarn
yarn install
```

Questo processo potrebbe richiedere qualche minuto alla prima installazione.

### 3. Configurazione ambiente (opzionale)

Se necessario, crea un file `.env.local` nella root del progetto:

```bash
# .env.local
REACT_APP_API_URL=http://localhost:3000/api
REACT_APP_ENV=development
```

**Nota**: Il file `.env.local` non viene committato (è in `.gitignore`).

## 🏃 Esecuzione in sviluppo

### Avvio del server di sviluppo

```bash
npm start
```

Questo comando:
- Avvia il server di sviluppo
- Apre automaticamente il browser su `http://localhost:3000`
- Abilita Hot Module Replacement (HMR) per reload automatico

### Comandi disponibili

```bash
# Avvio sviluppo
npm start

# Build per produzione
npm run build

# Esecuzione test
npm test

# Esecuzione test con coverage
npm test -- --coverage

# Linting codice
npm run lint

# Fix automatico problemi di lint
npm run lint:fix

# Formattazione codice con Prettier
npm run format

# Analisi bundle
npm run analyze
```

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

```bash
# Modifica i file necessari
# Testa le modifiche in tempo reale con npm start

# Verifica che tutto funzioni
npm test
npm run lint
npm run build
```

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
├── public/               # File statici
│   ├── index.html       # Template HTML
│   ├── manifest.json    # PWA manifest
│   └── icons/           # Icone PWA
│
├── src/
│   ├── components/      # Componenti React
│   │   ├── common/      # Componenti riutilizzabili
│   │   ├── layout/      # Layout components
│   │   └── features/    # Feature-specific
│   │
│   ├── screens/         # Pagine/Schermate
│   │   ├── Home/
│   │   ├── Schedule/
│   │   └── Settings/
│   │
│   ├── store/           # State management
│   ├── routes/          # Routing
│   ├── utils/           # Utilities
│   ├── ai/              # Moduli AI
│   ├── assets/          # Risorse (img, css, fonts)
│   ├── hooks/           # Custom hooks
│   │
│   ├── App.js           # Componente root
│   ├── index.js         # Entry point
│   └── serviceWorker.js # Service Worker PWA
│
├── docs/                # Documentazione
├── .github/            # GitHub config
└── tests/              # Test utilities
```

## 🧪 Testing

### Eseguire i test

```bash
# Tutti i test
npm test

# Test specifico
npm test -- ScheduleCard.test.js

# Watch mode (riesegue test al cambiamento)
npm test -- --watch

# Coverage report
npm test -- --coverage
```

### Scrivere un test

Crea un file `ComponentName.test.jsx` accanto al componente:

```jsx
// ScheduleCard.test.jsx
import { render, screen } from '@testing-library/react';
import ScheduleCard from './ScheduleCard';

describe('ScheduleCard', () => {
  it('should render lesson title', () => {
    const lesson = { id: 1, title: 'Matematica' };
    render(<ScheduleCard lesson={lesson} />);
    expect(screen.getByText('Matematica')).toBeInTheDocument();
  });
});
```

## 🎨 Sviluppo UI

### Componenti di base

Crea componenti nella cartella appropriata:

```bash
# Componente comune
src/components/common/Button/
  ├── Button.jsx
  ├── Button.module.css
  ├── Button.test.jsx
  └── index.js

# Screen/Page
src/screens/Schedule/
  ├── Schedule.jsx
  ├── Schedule.module.css
  ├── Schedule.test.jsx
  └── index.js
```

### Esempio componente

```jsx
// src/components/common/Button/Button.jsx
import React from 'react';
import PropTypes from 'prop-types';
import styles from './Button.module.css';

function Button({ children, onClick, variant = 'primary', disabled = false }) {
  return (
    <button
      className={`${styles.button} ${styles[variant]}`}
      onClick={onClick}
      disabled={disabled}
      type="button"
    >
      {children}
    </button>
  );
}

Button.propTypes = {
  children: PropTypes.node.isRequired,
  onClick: PropTypes.func,
  variant: PropTypes.oneOf(['primary', 'secondary', 'danger']),
  disabled: PropTypes.bool,
};

export default Button;
```

```css
/* src/components/common/Button/Button.module.css */
.button {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
  transition: all 0.2s;
}

.button:hover {
  transform: translateY(-1px);
}

.button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.primary {
  background-color: var(--color-primary);
  color: white;
}

.secondary {
  background-color: var(--color-secondary);
  color: white;
}

.danger {
  background-color: var(--color-danger);
  color: white;
}
```

## 🔧 Strumenti consigliati

### VS Code Extensions

Installa queste estensioni per una migliore esperienza di sviluppo:

- **ESLint** - Linting JavaScript/TypeScript
- **Prettier** - Code formatter
- **ES7+ React/Redux/React-Native snippets** - Snippets React
- **Auto Rename Tag** - Rinomina automatica tag HTML
- **Path Intellisense** - Autocompletamento path
- **GitLens** - Git supercharged
- **Jest** - Jest test runner
- **axe Accessibility Linter** - Accessibility checking

### Configurazione VS Code

Crea `.vscode/settings.json`:

```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "eslint.validate": [
    "javascript",
    "javascriptreact"
  ]
}
```

## 📚 Risorse utili

### Documentazione

- [React Docs](https://react.dev/) - Documentazione ufficiale React
- [MDN Web Docs](https://developer.mozilla.org/) - Reference web development
- [WCAG Guidelines](https://www.w3.org/WAI/WCAG21/quickref/) - Accessibilità
- [PWA Checklist](https://web.dev/pwa-checklist/) - PWA best practices

### Guide interne

- [ARCHITECTURE.md](./ARCHITECTURE.md) - Architettura del progetto
- [STYLE_GUIDE.md](./STYLE_GUIDE.md) - Convenzioni di stile
- [CONTRIBUTING.md](../CONTRIBUTING.md) - Come contribuire
- [OPEN_SOURCE_COMPONENTS.md](./OPEN_SOURCE_COMPONENTS.md) - Librerie usate

## ❓ Troubleshooting

### Problema: `npm install` fallisce

```bash
# Pulisci cache npm
npm cache clean --force

# Rimuovi node_modules e package-lock.json
rm -rf node_modules package-lock.json

# Reinstalla
npm install
```

### Problema: Porta 3000 già in uso

```bash
# Su macOS/Linux
PORT=3001 npm start

# Su Windows
set PORT=3001 && npm start
```

### Problema: Hot reload non funziona

1. Controlla che il file sia salvato
2. Verifica che non ci siano errori di sintassi
3. Prova a riavviare il server di sviluppo
4. Cancella cache browser (Ctrl+Shift+R / Cmd+Shift+R)

### Problema: Test falliscono

```bash
# Pulisci cache Jest
npm test -- --clearCache

# Riesegui i test
npm test
```

## 🎯 Prossimi passi

Dopo aver completato il setup:

1. ✅ Leggi [ARCHITECTURE.md](./ARCHITECTURE.md) per capire l'architettura
2. ✅ Leggi [STYLE_GUIDE.md](./STYLE_GUIDE.md) per le convenzioni di codice
3. ✅ Esplora il codice esistente in `src/`
4. ✅ Scegli una issue da [GitHub Issues](https://github.com/antoniocorsano-boop/OrarioDoc/issues)
5. ✅ Leggi [CONTRIBUTING.md](../CONTRIBUTING.md) prima di aprire una PR

## 💡 Tips

- **Usa gli snippet**: Installa l'estensione React snippets per velocizzare
- **Componenti piccoli**: Mantieni i componenti piccoli e focalizzati
- **Test as you go**: Scrivi test mentre sviluppi, non dopo
- **Commit frequenti**: Fai commit piccoli e frequenti
- **Chiedi aiuto**: Non esitare a chiedere nelle issue o discussions

## 📞 Supporto

Hai bisogno di aiuto?

- 📖 Consulta la [documentazione](./ARCHITECTURE.md)
- 💬 Apri una [Discussion](https://github.com/antoniocorsano-boop/OrarioDoc/discussions)
- 🐛 Segnala un [Issue](https://github.com/antoniocorsano-boop/OrarioDoc/issues)

---

**Buon coding! 🚀**
