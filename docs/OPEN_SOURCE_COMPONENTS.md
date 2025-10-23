# Componenti Open Source

Questo documento elenca le librerie e i componenti open source utilizzati in OrarioDoc, con le relative licenze e motivazioni.

## 📦 Core Dependencies

### React Ecosystem

#### React
- **Versione**: ^18.2.0
- **Licenza**: MIT
- **Uso**: Framework UI principale
- **Motivazione**: Standard de facto per applicazioni web moderne, ottimo ecosistema, performance eccellenti
- **Link**: https://react.dev/

#### React DOM
- **Versione**: ^18.2.0
- **Licenza**: MIT
- **Uso**: Rendering React nel DOM
- **Motivazione**: Libreria essenziale per React
- **Link**: https://react.dev/

#### React Router
- **Versione**: ^6.x
- **Licenza**: MIT
- **Uso**: Routing e navigazione
- **Motivazione**: Soluzione standard per SPA routing in React
- **Link**: https://reactrouter.com/

### State Management

#### Redux Toolkit (opzione 1)
- **Versione**: ^1.9.x
- **Licenza**: MIT
- **Uso**: Gestione stato globale
- **Motivazione**: Semplifica Redux, buone pratiche integrate, DevTools
- **Link**: https://redux-toolkit.js.org/

#### Zustand (opzione 2)
- **Versione**: ^4.x
- **Licenza**: MIT
- **Uso**: State management alternativo leggero
- **Motivazione**: API semplice, no boilerplate, TypeScript-friendly
- **Link**: https://github.com/pmndrs/zustand

### PWA

#### Workbox
- **Versione**: ^7.x
- **Licenza**: Apache 2.0
- **Uso**: Service Worker e caching strategies
- **Motivazione**: Best practices PWA, strumenti Google
- **Link**: https://developers.google.com/web/tools/workbox

#### web-vitals
- **Versione**: ^3.x
- **Licenza**: Apache 2.0
- **Uso**: Misurazione Core Web Vitals
- **Motivazione**: Metriche performance standard Google
- **Link**: https://github.com/GoogleChrome/web-vitals

## 🎨 UI Components & Styling

### Styling Solutions

#### Styled Components (opzione 1)
- **Versione**: ^6.x
- **Licenza**: MIT
- **Uso**: CSS-in-JS
- **Motivazione**: Scoping automatico, props dinamiche, theming
- **Link**: https://styled-components.com/

#### CSS Modules (opzione 2)
- **Versione**: Built-in
- **Licenza**: N/A
- **Uso**: CSS modulare
- **Motivazione**: Zero-runtime, performance, semplice
- **Link**: https://github.com/css-modules/css-modules

#### Tailwind CSS (opzione 3)
- **Versione**: ^3.x
- **Licenza**: MIT
- **Uso**: Utility-first CSS
- **Motivazione**: Rapid development, consistency, ottimizzazione
- **Link**: https://tailwindcss.com/

### Component Libraries

#### Headless UI
- **Versione**: ^1.x
- **Licenza**: MIT
- **Uso**: Componenti UI accessibili headless
- **Motivazione**: Accessibilità integrata, customizzazione completa
- **Link**: https://headlessui.com/

#### Radix UI
- **Versione**: ^1.x
- **Licenza**: MIT
- **Uso**: Primitives UI accessibili
- **Motivazione**: WCAG compliant, componibili, unstyled
- **Link**: https://www.radix-ui.com/

#### React Icons
- **Versione**: ^4.x
- **Licenza**: MIT (varie per gli icon set)
- **Uso**: Libreria icone
- **Motivazione**: Ampia scelta, tree-shakeable, facile da usare
- **Link**: https://react-icons.github.io/react-icons/

## 🗄️ Data & Storage

#### LocalForage
- **Versione**: ^1.10.x
- **Licenza**: Apache 2.0
- **Uso**: Storage locale asincrono
- **Motivazione**: API semplice, supporto IndexedDB/WebSQL/localStorage
- **Link**: https://localforage.github.io/localForage/

#### Dexie.js
- **Versione**: ^3.x
- **Licenza**: Apache 2.0
- **Uso**: Wrapper IndexedDB
- **Motivazione**: API moderna, query potenti, TypeScript support
- **Link**: https://dexie.org/

## 🔧 Utilities

#### date-fns
- **Versione**: ^2.x
- **Licenza**: MIT
- **Uso**: Manipolazione date
- **Motivazione**: Modulare, immutabile, tree-shakeable
- **Link**: https://date-fns.org/

#### Lodash
- **Versione**: ^4.x
- **Licenza**: MIT
- **Uso**: Utility functions
- **Motivazione**: Collaudata, performance, ampia gamma di utilities
- **Link**: https://lodash.com/

#### clsx
- **Versione**: ^2.x
- **Licenza**: MIT
- **Uso**: Conditional className
- **Motivazione**: Leggera, performance, supporto conditional
- **Link**: https://github.com/lukeed/clsx

## 📝 Form Handling

#### React Hook Form
- **Versione**: ^7.x
- **Licenza**: MIT
- **Uso**: Gestione form
- **Motivazione**: Performance, DX, validazione integrata
- **Link**: https://react-hook-form.com/

#### Zod
- **Versione**: ^3.x
- **Licenza**: MIT
- **Uso**: Schema validation
- **Motivazione**: TypeScript-first, composable, runtime safe
- **Link**: https://github.com/colinhacks/zod

## 🧪 Testing

#### Jest
- **Versione**: ^29.x
- **Licenza**: MIT
- **Uso**: Test framework
- **Motivazione**: Standard React, snapshot testing, mocking
- **Link**: https://jestjs.io/

#### React Testing Library
- **Versione**: ^14.x
- **Licenza**: MIT
- **Uso**: Testing componenti React
- **Motivazione**: Best practices testing, focus accessibilità
- **Link**: https://testing-library.com/react

#### jest-axe
- **Versione**: ^8.x
- **Licenza**: MPL 2.0
- **Uso**: Accessibility testing
- **Motivazione**: Testing automatico a11y, integrazione Jest
- **Link**: https://github.com/nickcolley/jest-axe

#### Cypress
- **Versione**: ^13.x
- **Licenza**: MIT
- **Uso**: E2E testing
- **Motivazione**: DX eccellente, debugging facile, CI/CD friendly
- **Link**: https://www.cypress.io/

## 🛠️ Development Tools

#### Vite (opzione 1)
- **Versione**: ^5.x
- **Licenza**: MIT
- **Uso**: Build tool
- **Motivazione**: Fast HMR, build ottimizzate, plugin ecosystem
- **Link**: https://vitejs.dev/

#### Create React App (opzione 2)
- **Versione**: ^5.x
- **Licenza**: MIT
- **Uso**: React boilerplate
- **Motivazione**: Zero config, best practices integrate
- **Link**: https://create-react-app.dev/

#### ESLint
- **Versione**: ^8.x
- **Licenza**: MIT
- **Uso**: Linting JavaScript/TypeScript
- **Motivazione**: Standard de facto, personalizzabile, plugin ecosystem
- **Link**: https://eslint.org/

#### Prettier
- **Versione**: ^3.x
- **Licenza**: MIT
- **Uso**: Code formatting
- **Motivazione**: Opinionated, consistent, integrazione IDE
- **Link**: https://prettier.io/

#### Husky
- **Versione**: ^8.x
- **Licenza**: MIT
- **Uso**: Git hooks
- **Motivazione**: Pre-commit validation, quality gates
- **Link**: https://typicode.github.io/husky/

#### lint-staged
- **Versione**: ^15.x
- **Licenza**: MIT
- **Uso**: Lint solo file staged
- **Motivazione**: Performance, focus su modifiche
- **Link**: https://github.com/okonet/lint-staged

## 🤖 AI & Machine Learning

#### TensorFlow.js (opzionale)
- **Versione**: ^4.x
- **Licenza**: Apache 2.0
- **Uso**: ML in browser
- **Motivazione**: Privacy-first, no server needed
- **Link**: https://www.tensorflow.org/js

#### Brain.js (opzionale)
- **Versione**: ^2.x
- **Licenza**: MIT
- **Uso**: Neural networks semplici
- **Motivazione**: Easy to use, good for simple AI tasks
- **Link**: https://brain.js.org/

## 📊 Analytics & Monitoring

#### Plausible Analytics (self-hosted)
- **Versione**: Latest
- **Licenza**: AGPL v3
- **Uso**: Privacy-friendly analytics
- **Motivazione**: No cookies, GDPR compliant, open source
- **Link**: https://plausible.io/

#### Sentry (opzionale)
- **Versione**: ^7.x
- **Licenza**: FSL (Functional Source License)
- **Uso**: Error tracking
- **Motivazione**: Debugging, performance monitoring
- **Link**: https://sentry.io/

## ♿ Accessibility

#### react-aria
- **Versione**: ^3.x
- **Licenza**: Apache 2.0
- **Uso**: Accessibility primitives
- **Motivazione**: Adobe, WCAG compliant, comprehensive
- **Link**: https://react-spectrum.adobe.com/react-aria/

#### focus-trap-react
- **Versione**: ^10.x
- **Licenza**: MIT
- **Uso**: Focus management
- **Motivazione**: Modal/dialog accessibility
- **Link**: https://github.com/focus-trap/focus-trap-react

## 📱 PWA Tools

#### pwa-asset-generator
- **Versione**: ^6.x
- **Licenza**: MIT
- **Uso**: Generazione icone PWA
- **Motivazione**: Automated icon generation
- **Link**: https://github.com/onderceylan/pwa-asset-generator

## 🔄 CI/CD

#### GitHub Actions
- **Versione**: N/A
- **Licenza**: Free for public repos
- **Uso**: CI/CD pipeline
- **Motivazione**: Integrato GitHub, gratis OSS, flessibile
- **Link**: https://github.com/features/actions

## 📄 Licenze utilizzate

| Licenza | Descrizione | Compatibilità |
|---------|-------------|---------------|
| MIT | Molto permissiva, uso commerciale ok | ✅ Alta |
| Apache 2.0 | Permissiva con patent grant | ✅ Alta |
| MPL 2.0 | Copyleft debole | ✅ Media |
| AGPL v3 | Copyleft forte (solo Plausible, self-hosted) | ✅ Media |

## 🔍 Criteri di selezione

Quando scegliamo una dipendenza, consideriamo:

1. **Licenza**: Deve essere compatibile con MIT
2. **Manutenzione**: Progetto attivamente mantenuto
3. **Community**: Buon supporto community
4. **Performance**: Impact su bundle size
5. **Accessibilità**: Supporto a11y quando rilevante
6. **TypeScript**: Preferenza per librerie con TS support
7. **Documentazione**: Buona documentazione
8. **Security**: Track record di sicurezza

## 📝 Note

- Tutte le dipendenze vengono regolarmente aggiornate
- Security audit tramite `npm audit`
- Licenze verificate con `license-checker`
- Bundle size monitorato con `webpack-bundle-analyzer` o `rollup-plugin-visualizer`

## 🔄 Aggiornamenti

Questo documento viene aggiornato ogni volta che:
- Si aggiunge una nuova dipendenza
- Si rimuove una dipendenza
- Si aggiorna una major version
- Cambiano le licenze delle dipendenze

---

**Ultimo aggiornamento**: 2025-01-23

**Contributori**: Se aggiungi una nuova dipendenza, aggiorna questo file nella stessa PR.
