# Componenti e Tecnologie Open Source

Questo documento elenca le librerie, componenti e tecnologie open source utilizzate in OrarioDoc, con le relative licenze e motivazioni.

## 📦 Core Technologies

### Vanilla JavaScript
- **Versione**: ES6+ (ECMAScript 2015+)
- **Licenza**: Standard ECMA
- **Uso**: Linguaggio base dell'applicazione
- **Motivazione**: Zero dipendenze, massima compatibilità, performance ottimali, funziona ovunque (incluso Termux)
- **Link**: https://developer.mozilla.org/en-US/docs/Web/JavaScript

### IndexedDB
- **Versione**: Web API standard
- **Licenza**: W3C Standard
- **Uso**: Persistenza dati offline
- **Motivazione**: Storage robusto per PWA, supporto transazioni, query avanzate
- **Link**: https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API

### Service Worker API
- **Versione**: Web API standard
- **Licenza**: W3C Standard
- **Uso**: Funzionalità PWA, caching, offline
- **Motivazione**: Standard per Progressive Web Apps, supporto offline completo
- **Link**: https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API

### CSS Custom Properties (CSS Variables)
- **Versione**: CSS standard
- **Licenza**: W3C Standard
- **Uso**: Sistema tematizzazione centralizzato
- **Motivazione**: Nativo, performante, supporto completo browser moderni
- **Link**: https://developer.mozilla.org/en-US/docs/Web/CSS/Using_CSS_custom_properties

## 🎨 Design System & Fonts

### Material Design 3
- **Versione**: 3.0
- **Licenza**: Apache 2.0
- **Uso**: Design system, linee guida UI/UX
- **Motivazione**: Design moderno, accessibile, ben documentato
- **Link**: https://m3.material.io/

### Roboto Flex
- **Versione**: Variable Font
- **Licenza**: Apache 2.0 (Google Fonts)
- **Uso**: Font principale applicazione
- **Motivazione**: Font variabile, ottimizzato per UI, supporto completo caratteri
- **Link**: https://fonts.google.com/specimen/Roboto+Flex

## 🧪 Testing & Development

### Playwright
- **Versione**: ^1.40.0
- **Licenza**: Apache 2.0
- **Uso**: Test E2E automatizzati
- **Motivazione**: Cross-browser testing, API moderna, performance eccellenti
- **Link**: https://playwright.dev/

### @playwright/test
- **Versione**: ^1.40.0
- **Licenza**: Apache 2.0
- **Uso**: Test runner e asserzioni
- **Motivazione**: Integrato con Playwright, parallel testing, report dettagliati
- **Link**: https://playwright.dev/docs/test-intro
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


## 📊 Web Standards & APIs

### Web Storage API
- **Versione**: Web API standard
- **Licenza**: W3C Standard
- **Uso**: Persistenza preferenze (localStorage)
- **Motivazione**: Semplice, supporto universale, sufficiente per preferenze
- **Link**: https://developer.mozilla.org/en-US/docs/Web/API/Web_Storage_API

### Fetch API
- **Versione**: Web API standard
- **Licenza**: WHATWG Standard
- **Uso**: HTTP requests (future integrazioni)
- **Motivazione**: Standard moderno, Promise-based, no dipendenze
- **Link**: https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API

### BroadcastChannel API
- **Versione**: Web API standard
- **Licenza**: HTML Living Standard
- **Uso**: Sincronizzazione tra tab/finestre
- **Motivazione**: Comunicazione cross-context nativa, no polling
- **Link**: https://developer.mozilla.org/en-US/docs/Web/API/BroadcastChannel

## 🔒 Sicurezza & Privacy

### Content Security Policy (CSP)
- **Versione**: Standard Web
- **Licenza**: W3C Standard
- **Uso**: Protezione XSS e injection
- **Motivazione**: Security best practice, protezione utente
- **Link**: https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP

### SubResource Integrity (SRI)
- **Versione**: Standard Web
- **Licenza**: W3C Standard
- **Uso**: Verifica integrità risorse esterne
- **Motivazione**: Protezione da CDN compromessi
- **Link**: https://developer.mozilla.org/en-US/docs/Web/Security/Subresource_Integrity

## ♿ Accessibilità

### WAI-ARIA
- **Versione**: ARIA 1.2
- **Licenza**: W3C Standard
- **Uso**: Semantic markup per accessibilità
- **Motivazione**: Standard WCAG 2.1 AA, supporto screen reader
- **Link**: https://www.w3.org/WAI/ARIA/

### WCAG 2.1
- **Versione**: 2.1 Level AA
- **Licenza**: W3C Standard
- **Uso**: Linee guida accessibilità
- **Motivazione**: Standard industriale, requisito legale in molti paesi
- **Link**: https://www.w3.org/WAI/WCAG21/quickref/

## 🎯 Filosofia: Zero Dependencies

OrarioDoc adotta una filosofia **zero-dependency** per:

1. **Massima Compatibilità**: Funziona ovunque, anche in ambienti limitati come Termux
2. **Security**: Meno dipendenze = meno superficie di attacco
3. **Performance**: Bundle size ridotto, caricamento veloce
4. **Manutenibilità**: Nessun aggiornamento dipendenze o breaking changes esterni
5. **Longevità**: Il codice rimane funzionante anche dopo anni senza manutenzione
6. **Privacy**: Nessuna telemetria o tracking nascosto da librerie terze

### Eccezioni: Dev Dependencies

Le uniche dipendenze sono per **testing** (Playwright), che:
- Non fanno parte del bundle produzione
- Sono opzionali per utenti finali
- Possono essere facilmente sostituite se necessario

## 📚 Riferimenti e Risorse

### Standard Web
- [MDN Web Docs](https://developer.mozilla.org/) - Documentazione completa Web APIs
- [Can I Use](https://caniuse.com/) - Compatibilità browser
- [Web.dev](https://web.dev/) - Best practices Google

### Design & UX
- [Material Design 3](https://m3.material.io/) - Design system
- [Google Fonts](https://fonts.google.com/) - Web fonts
- [WCAG Guidelines](https://www.w3.org/WAI/WCAG21/quickref/) - Accessibilità

### Testing & Quality
- [Playwright](https://playwright.dev/) - Testing framework
- [WebPageTest](https://www.webpagetest.org/) - Performance testing
- [Lighthouse](https://developers.google.com/web/tools/lighthouse) - Audit tool

## 📄 Licenze

Tutti gli standard Web (HTML, CSS, JavaScript, Web APIs) sono:
- **Liberi** e aperti
- **Royalty-free**
- **Implementabili** da chiunque
- **Mantenuti** da organismi internazionali (W3C, WHATWG, ECMA)

Material Design 3 e Roboto Flex sono rilasciati sotto **Apache License 2.0**, che permette:
- ✅ Uso commerciale
- ✅ Modifica
- ✅ Distribuzione
- ✅ Uso privato
- ✅ Concessione brevetti

Playwright è rilasciato sotto **Apache License 2.0** (dev dependency).

---

**Nota**: OrarioDoc stesso è rilasciato sotto licenza **MIT**, una delle licenze open source più permissive.

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
