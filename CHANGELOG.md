# Changelog

Tutte le modifiche notevoli a questo progetto saranno documentate in questo file.

Il formato è basato su [Keep a Changelog](https://keepachangelog.com/it/1.0.0/),
e questo progetto aderisce al [Semantic Versioning](https://semver.org/lang/it/).

## [Unreleased]

## [1.0.0] - 2025-10-27

### Added

#### Sistema Tema Material Design 3
- Sistema di tema centralizzato basato su Material Design 3
- 4 temi disponibili: Auto (Sistema), Light, Dark, Expressive
- Font Roboto Flex come font variabile ufficiale
- Gestione completa CSS Variables per colori, tipografia, spacing, elevazioni
- Cambio tema dinamico senza ricaricamento pagina
- Persistenza preferenze tema in localStorage
- Supporto prefers-color-scheme per tema automatico
- Sincronizzazione tema tra tab aperte (BroadcastChannel)

#### Componenti Material Design 3
- Button (Filled, Tonal, Outlined, Text, Elevated)
- Card (Elevated, Filled, Outlined)
- Navigation (Top App Bar, Bottom Navigation, Navigation Drawer)
- Text Field (Filled, Outlined)
- Dialog/Modal (Basic, Full Screen)
- FAB - Floating Action Button (Standard, Small, Large, Extended)
- Chip (Assist, Filter, Input, Suggestion)
- List (One-line, Two-line, Three-line)
- Toast/Snackbar per notifiche

#### Gestione Orario Settimanale
- Visualizzazione griglia orario settimanale responsive
- Aggiunta, modifica ed eliminazione lezioni
- Persistenza dati in IndexedDB
- Validazione orari e materie
- Interfaccia intuitiva per gestione lezioni
- Supporto per lezioni multi-ora

#### Impostazioni Utente e Scuola
- UI completa per impostazioni utente e scuola
- Gestione dati utente (nome, email, materie insegnate)
- Configurazione scuola (nome, indirizzo, orari standard)
- Configurazione orari lezioni e intervalli
- Persistenza impostazioni in IndexedDB
- Reset a valori predefiniti
- Validazione form completa
- Export/import impostazioni in JSON

#### Accessibilità WCAG 2.1 AA
- Navigazione completa da tastiera
- Focus indicators visibili su tutti gli elementi interattivi
- Supporto screen reader con ARIA labels appropriati
- Landmark ARIA (main, nav, banner, contentinfo)
- Skip link per navigazione rapida
- Contrasto colori conforme WCAG 2.1 AA su tutti i temi
- Focus trapping nei modal
- Live regions per notifiche dinamiche
- Struttura heading gerarchica corretta

#### Design Responsive
- Design mobile-first ottimizzato per tutti i dispositivi
- Breakpoint: mobile (<640px), tablet (640-1024px), desktop (>1024px)
- Touch targets >= 48x48px per accessibilità mobile
- Layout adattivo per schedule grid
- Font size leggibile su mobile (>= 16px)
- Nessun overflow orizzontale
- Test su multiple viewport sizes

#### Performance e PWA
- Progressive Web App completa
- Service Worker per funzionalità offline
- Cache strategy ottimizzata
- Manifest.json per installazione su dispositivi
- Preload risorse critiche
- Lazy loading componenti non critici
- Performance score Lighthouse >= 90
- Core Web Vitals ottimizzati

#### Testing
- Setup completo Playwright per test E2E
- Test automatici per funzionalità core
- Test accessibilità con jest-axe
- Test responsive su multiple viewport
- Validazione test automatica
- Report dettagliati test results

#### Documentazione
- README.md completo con guida utilizzo
- CONTRIBUTING.md per contributori
- ROADMAP.md dettagliata con 11 subtask
- docs/ARCHITECTURE.md - architettura sistema
- docs/THEMES.md - guida completa temi
- docs/COMPONENTS.md - componenti Material Design 3
- docs/STYLE_GUIDE.md - linee guida codice
- docs/RESPONSIVE.md - guida responsive design
- docs/PERFORMANCE.md - ottimizzazioni performance
- docs/TEST_STRATEGY.md - strategia testing
- docs/QUICKSTART.md - guida rapida avvio
- Issue templates per feature, bug, documentazione
- Pull Request template

### Changed
- Migrazione da React a Vanilla JavaScript per compatibilità Termux
- Struttura file riorganizzata per chiarezza
- Ottimizzazione bundle size
- Miglioramento UX modali e form

### Fixed
- Risolti problemi di contrasto colori su tema scuro
- Corretti problemi focus trap nei modal
- Risolte sovrapposizioni layout su mobile
- Corretti memory leak in event listeners
- Risolti problemi di sincronizzazione tema tra tab

### Security
- Validazione e sanitizzazione input utente
- Content Security Policy implementata
- Dati utente criptati in IndexedDB
- Nessun tracking o analytics invasivi

## [0.1.0] - 2025-09-01

### Added
- Versione iniziale prototipo React
- Struttura base progetto
- Setup repository GitHub

---

## Collegamenti

- [Repository GitHub](https://github.com/antoniocorsano-boop/OrarioDoc)
- [Documentazione](docs/)
- [Roadmap](ROADMAP.md)
- [Contributing](CONTRIBUTING.md)
