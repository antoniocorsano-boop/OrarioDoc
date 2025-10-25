# Progetto OrarioDoc - Documento di Architettura e Roadmap

## 1. Introduzione

### 1.1 Scopo del progetto
OrarioDoc è una Progressive Web App per la gestione di orari, lezioni e attività didattiche. Il progetto mira a fornire uno strumento semplice, veloce e accessibile per insegnanti e studenti.

### 1.2 Obiettivi della migrazione
La migrazione a una architettura vanilla PWA ha i seguenti obiettivi:
- **Portabilità**: Esecuzione su qualsiasi dispositivo con un browser moderno
- **Leggerezza**: Nessuna dipendenza da framework pesanti (React, Node.js)
- **Compatibilità Termux**: Funzionamento su Android tramite Termux senza configurazioni complesse
- **Offline-first**: Funzionamento completo anche senza connessione internet
- **Manutenibilità**: Codice semplice e comprensibile

## 2. Architettura

### 2.1 Stack tecnologico
- **HTML5**: Struttura semantica dell'applicazione
- **CSS3**: Styling con variabili CSS, Grid e Flexbox
- **JavaScript ES6+**: Logica applicativa vanilla
- **Service Worker API**: Caching e funzionalità offline
- **LocalStorage API**: Persistenza dati lato client
- **PWA Manifest**: Installabilità dell'applicazione

### 2.2 Struttura dei file

```
OrarioDoc/
├── index.html              # Shell HTML dell'applicazione
├── style.css               # Stili globali e layout
├── manifest.json           # Configurazione PWA
├── service-worker.js       # Service Worker per offline
│
├── src/                    # Moduli JavaScript
│   ├── storage.js          # Layer di persistenza
│   ├── schedule-grid.js    # Rendering griglia e eventi
│   └── main.js             # Inizializzazione e orchestrazione
│
├── icons/                  # Icone per PWA
│   ├── icon-192.svg
│   └── icon-512.svg
│
├── docs/                   # Documentazione
│   └── progetto.md         # Questo documento
│
├── README.md               # Guida rapida
└── CONTRIBUTING.md         # Linee guida per contributi
```

### 2.3 Flusso dell'applicazione

1. **Inizializzazione**
   - Caricamento di index.html
   - Registrazione del Service Worker
   - Caricamento script con `defer`
   - Esecuzione di `init()` al DOMContentLoaded

2. **Rendering iniziale**
   - Lettura dati da localStorage via `Storage.read()`
   - Rendering della griglia tramite `ScheduleGrid.renderLessons()`

3. **Interazione utente**
   - Click su "Aggiungi" → Apertura pannello
   - Compilazione form → Validazione
   - Click su "Salva" → `Storage.add()` + re-render
   - Click su lezione → Conferma eliminazione → `Storage.remove()` + re-render

### 2.4 Moduli principali

#### storage.js
Gestisce la persistenza dei dati usando localStorage.

**Metodi pubblici:**
- `read()`: Legge tutte le lezioni
- `write(lessons)`: Scrive l'array di lezioni
- `add(lesson)`: Aggiunge una nuova lezione
- `remove(id)`: Rimuove una lezione per ID
- `clear()`: Cancella tutti i dati

**Formato dati:**
```javascript
[
  {
    id: 1234567890,
    name: "Matematica",
    day: "Lunedì",
    time: "09:00"
  },
  // ...
]
```

#### schedule-grid.js
Gestisce il rendering della griglia e gli eventi.

**Metodi pubblici:**
- `createGrid(container)`: Inizializza la griglia vuota
- `renderLessons(container, lessons)`: Renderizza le lezioni
- `escapeHtml(text)`: Escape HTML per sicurezza

**Eventi personalizzati:**
- `lessonclick`: Emesso quando si clicca su una lezione

#### main.js
Orchestrazione dell'applicazione e wiring degli eventi UI.

**Funzione principale:**
- `init()`: Inizializza l'app, collega eventi, carica dati

**Gestisce:**
- Click su pulsanti (Aggiungi, Salva, Annulla, Impostazioni)
- Apertura/chiusura pannelli
- Validazione form
- Sincronizzazione tra Storage e UI

### 2.5 Service Worker
Il Service Worker implementa una strategia **cache-first**:
- Risorse statiche cached all'install
- Fetch: prima cache, poi network
- Update automatico delle cache

## 3. Persistenza dati

### 3.1 localStorage (Attuale)
**Vantaggi:**
- Semplice da usare
- Sincrono
- Supporto universale
- Sufficiente per MVP

**Limitazioni:**
- Max ~5-10 MB
- Solo stringhe (serializzazione JSON necessaria)
- Sincrono (può bloccare UI con grandi dataset)
- Nessuna indicizzazione o query complesse

**Chiave usata:** `orariodoc:v1`

### 3.2 IndexedDB (Futuro)
Pianificata migrazione a IndexedDB per:
- Storage maggiore (centinaia di MB)
- API asincrona (non blocca UI)
- Indicizzazione e query efficienti
- Transazioni ACID

**Roadmap migrazione:**
1. Wrapper API compatibile con Storage attuale
2. Migrazione automatica dati da localStorage
3. Fallback a localStorage se IndexedDB non disponibile
4. Utilizzo di libreria `idb` per semplificare API

## 4. Roadmap

### 4.1 Fase 1: MVP (Completata)
- ✅ Struttura HTML/CSS base
- ✅ Storage localStorage
- ✅ CRUD lezioni (Create, Read, Delete)
- ✅ Service Worker offline
- ✅ PWA installabile

### 4.2 Fase 2: Funzionalità core (Prossima)
- [ ] Modifica lezioni esistenti (Update)
- [ ] Validazione avanzata form
- [ ] Conferme modali invece di alert()
- [ ] Feedback visivo sulle operazioni
- [ ] Animazioni transizioni

### 4.3 Fase 3: Miglioramenti UX
- [ ] Filtri per giorno/ora
- [ ] Ricerca lezioni
- [ ] Ordinamento personalizzabile
- [ ] Vista calendario
- [ ] Vista timeline giornaliera

### 4.4 Fase 4: Persistenza avanzata
- [ ] Migrazione a IndexedDB
- [ ] Esportazione dati (JSON)
- [ ] Importazione dati
- [ ] Backup automatico
- [ ] Sincronizzazione multi-dispositivo (opzionale)

### 4.5 Fase 5: Personalizzazione
- [ ] Temi colori
- [ ] Modalità scura
- [ ] Personalizzazione campi lezione
- [ ] Categorie/etichette
- [ ] Icone personalizzate

### 4.6 Fase 6: Funzionalità avanzate
- [ ] Notifiche push
- [ ] Promemoria
- [ ] Ricorrenze settimanali
- [ ] Statistiche utilizzo
- [ ] Condivisione orari

## 5. Considerazioni tecniche

### 5.1 Compatibilità browser
- Chrome/Edge: Full support
- Firefox: Full support
- Safari: Full support (iOS 11.3+)
- Opera: Full support

### 5.2 Accessibilità
- Attributi ARIA per screen reader
- Focus management su modali
- Supporto navigazione tastiera
- Contrasto colori WCAG 2.1 AA

### 5.3 Performance
- Lazy loading risorse non critiche
- Compressione CSS/JS (opzionale in produzione)
- Cache aggressiva con Service Worker
- Rendering ottimizzato con DocumentFragment

### 5.4 Sicurezza
- Escape HTML per prevenire XSS
- Content Security Policy (da implementare)
- HTTPS obbligatorio in produzione
- Validazione input lato client

## 6. Testing

### 6.1 Test manuali (Attuale)
Checklist test funzionali:
- [ ] Aggiunta lezione
- [ ] Visualizzazione lezioni
- [ ] Eliminazione lezione
- [ ] Persistenza dopo ricarica
- [ ] Funzionamento offline
- [ ] Installazione come PWA
- [ ] Responsive design (mobile/desktop)

### 6.2 Test automatizzati (Futuro)
Pianificati per le prossime fasi:
- Unit test con Jest
- Integration test con Testing Library
- E2E test con Playwright o Cypress
- Lighthouse CI per performance/PWA score

## 7. Deployment

### 7.1 Sviluppo locale
```bash
python3 -m http.server 8000
```

### 7.2 Produzione
Opzioni raccomandate:
- **GitHub Pages**: Hosting gratuito per siti statici
- **Netlify**: Deploy automatico da git, HTTPS gratuito
- **Vercel**: Simile a Netlify, ottimo per PWA
- **Cloudflare Pages**: CDN globale, veloce

**Requisiti:**
- HTTPS obbligatorio per Service Worker
- Configurazione corretta MIME types
- Cache headers appropriati

## 8. Contribuire

### 8.1 Come iniziare
1. Fork del repository
2. Clone locale
3. Creare branch feature
4. Implementare modifiche
5. Test manuali
6. Commit con messaggio descrittivo
7. Push e apertura PR

### 8.2 Linee guida
- Codice semplice e leggibile
- Commenti solo dove necessario
- Nomi variabili descrittivi
- Rispettare struttura esistente
- No dipendenze esterne (framework/librerie)

### 8.3 Priorità contributi
1. Bug fix critici
2. Funzionalità roadmap Fase 2
3. Miglioramenti UX/accessibilità
4. Documentazione
5. Test automatizzati
6. Feature aggiuntive (previo discussione)

## 9. Conclusioni

OrarioDoc rappresenta un esempio di come sia possibile creare una PWA moderna e funzionale usando solo tecnologie web standard, senza framework complessi. La semplicità dell'architettura la rende ideale per:
- Apprendimento sviluppo web
- Esecuzione in ambienti limitati (Termux)
- Manutenzione a lungo termine
- Estensioni e personalizzazioni

Il progetto è in continua evoluzione e accoglie contributi dalla community per renderlo sempre più utile e completo.

---

**Versione documento:** 1.0  
**Data:** 2025-10-25  
**Autore:** Antonio Corsano
