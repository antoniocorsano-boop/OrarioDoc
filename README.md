# OrarioDoc - Vanilla PWA

OrarioDoc è una Progressive Web App (PWA) leggera per la gestione di orari e lezioni, costruita con HTML, CSS e JavaScript vanilla senza dipendenze esterne.

## 🚀 Quickstart

### Prerequisiti
- Python 3 (o qualsiasi server HTTP statico)
- Browser moderno con supporto Service Worker

### Installazione e avvio

1. **Clona il repository**
   ```bash
   git clone https://github.com/antoniocorsano-boop/OrarioDoc.git
   cd OrarioDoc
   git checkout migrate/vanilla-pwa
   ```

2. **Avvia il server locale**
   ```bash
   python3 -m http.server 8000
   ```

3. **Apri nel browser**
   ```
   http://127.0.0.1:8000
   ```

4. **Testa l'applicazione**
   - Clicca su "Aggiungi" per creare una nuova lezione
   - Compila i campi e clicca "Salva"
   - La lezione verrà salvata e visualizzata nella griglia
   - Clicca su una lezione per eliminarla
   - Ricarica la pagina per verificare la persistenza dei dati

## 📱 Caratteristiche

- **Offline-first**: Funziona anche senza connessione grazie al Service Worker
- **Persistenza locale**: I dati vengono salvati in localStorage
- **Design responsive**: Ottimizzato per mobile e desktop
- **Zero dipendenze**: Nessun framework o libreria esterna
- **Installabile**: Può essere installata come app nativa

## 🏗️ Struttura del progetto

```
OrarioDoc/
├── index.html              # Shell HTML dell'applicazione
├── style.css               # Stili e layout
├── manifest.json           # Manifest PWA
├── service-worker.js       # Service Worker per caching
├── src/
│   ├── storage.js          # Layer di persistenza (localStorage)
│   ├── schedule-grid.js    # Rendering griglia e gestione eventi
│   └── main.js             # Inizializzazione e wiring UI
├── docs/
│   └── progetto.md         # Documento di progetto
└── README.md               # Questo file
```

## 🎯 Funzionalità implementate

### MVP (Minimum Viable Product)
- ✅ Creazione nuove lezioni
- ✅ Visualizzazione lezioni nella griglia
- ✅ Eliminazione lezioni
- ✅ Persistenza con localStorage
- ✅ Service Worker per offline
- ✅ Manifest PWA

### Prossimi sviluppi
- [ ] Modifica lezioni esistenti
- [ ] Esportazione/importazione dati
- [ ] Migrazione da localStorage a IndexedDB
- [ ] Filtri e ricerca
- [ ] Notifiche
- [ ] Temi personalizzabili
- [ ] Sincronizzazione cloud (opzionale)

## 🧪 Test manuali

Per verificare il corretto funzionamento:

1. **Test aggiunta lezione**
   - Clicca "Aggiungi"
   - Compila: Nome "Matematica", Giorno "Lunedì", Ora "09:00"
   - Clicca "Salva"
   - Verifica che appaia nella griglia

2. **Test persistenza**
   - Aggiungi alcune lezioni
   - Ricarica la pagina (F5)
   - Verifica che le lezioni siano ancora presenti

3. **Test eliminazione**
   - Clicca su una lezione nella griglia
   - Conferma l'eliminazione
   - Verifica che la lezione sia rimossa

4. **Test offline**
   - Apri DevTools → Application → Service Workers
   - Verifica che il SW sia attivo
   - Attiva la modalità offline
   - Ricarica la pagina
   - L'app dovrebbe funzionare ugualmente

## 🛠️ Tecnologie

- **HTML5**: Struttura semantica
- **CSS3**: Variables, Grid, Flexbox
- **JavaScript ES6+**: Modules pattern, arrow functions
- **Service Worker API**: Caching e offline
- **LocalStorage API**: Persistenza dati

## 📚 Documentazione

Per maggiori dettagli sull'architettura e la roadmap, consulta:
- [docs/progetto.md](docs/progetto.md) - Documento di progetto completo
- [CONTRIBUTING.md](CONTRIBUTING.md) - Linee guida per contribuire

## 🤝 Contribuire

Questo progetto è open source e accoglie contributi! Per contribuire:

1. Leggi [CONTRIBUTING.md](CONTRIBUTING.md)
2. Fork il repository
3. Crea un branch per la tua feature
4. Commit le modifiche
5. Apri una Pull Request

## 📄 Licenza

Vedi il file [LICENSE](LICENSE) per i dettagli.

## 👥 Autori

- Antonio Corsano ([@antoniocorsano-boop](https://github.com/antoniocorsano-boop))

## 🙏 Riconoscimenti

Questo progetto migra da un'architettura React/Node a vanilla PWA per massima portabilità e compatibilità con ambienti come Termux su Android.
