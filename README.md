# OrarioDoc

OrarioDoc è un'app per gestire orari/lezioni/turni. Questo branch (pwa-vanilla) contiene una versione leggera e indipendente dal Node/React: una Progressive Web App che funziona con HTML/CSS/vanilla JS e può essere eseguita facilmente su dispositivi Android anche tramite Termux.

## Perché questa scelta
- Termux non è completamente compatibile con ambienti Node/React per tutti gli utenti: abbiamo scelto una soluzione "vanilla PWA" per massima compatibilità, leggerezza e facilità di esecuzione locale.
- Nessun build step: file statici (index.html, app.css, app.js, manifest.json, service-worker.js) che si servono direttamente da un server statico.
- Offline-capable grazie al Service Worker e caching.

## Contenuto del branch `pwa-vanilla`
- index.html — interfaccia utente semplice in HTML
- app.css — styling di base
- app.js — logica CRUD lato client usando localStorage (facile da migrare a IndexedDB)
- manifest.json — renderizza l'app installabile come PWA
- service-worker.js — caching e supporto offline
- README.pwa.md — istruzioni rapide specifiche per Termux (se presente)

## Istruzioni rapide (sviluppo e test su Termux)
1. Apri Termux e clona / aggiorna il repository o spostati nella cartella del progetto:
   cd /path/to/OrarioDoc

2. Cambia branch (se necessario):
   git fetch origin
   git checkout pwa-vanilla

3. Avvia un server statico locale. Esempio con Python incluso in Termux:
   python3 -m http.server 8000

4. Apri il browser del dispositivo e vai su:
   http://127.0.0.1:8000

5. Prova la PWA:
   - Apri la pagina e controlla la Console -> Service Worker per verificare l'installazione.
   - Lascia caricare la pagina per permettere il caching, poi prova a mettere il dispositivo offline e ricaricare per verificare il funzionamento offline.

## Dati e persistenza
- Attualmente i dati vengono memorizzati in localStorage sotto la chiave `orariodoc:v1`. È una soluzione semplice e affidabile per cominciare.
- Se desideri maggiore robustezza (ricerche, indici, transazioni), consigliamo IndexedDB (possibile utilizzo della libreria `idb`) o SQLite su Termux per backup locali.
- Esportazione/importazione: possiamo aggiungere funzionalità per esportare i dati in JSON e ripristinarli manualmente.

## Migrazione dalla versione React/Node
- Questo branch è pensato come alternativa quando l'ambiente Node non è disponibile. Non rimuove il lavoro React/Node principale; mantenere la storia/branch originali è consigliato.
- Se vuoi mantenere entrambe le versioni nel repository, possiamo aggiungere una sezione nel README principale con link e indicazioni su come scegliere quella corretta per il proprio ambiente.

## Come contribuire
- Apri una issue per proporre cambiamenti, nuove feature o per segnalare bug.
- Se vuoi proporre aggiornamenti alla PWA, crea una branch a partire da `pwa-vanilla` e apri una PR verso `pwa-vanilla` o `main` a seconda dell'obiettivo.

## Note tecniche e miglioramenti possibili
- Sostituire localStorage con IndexedDB (`idb`) per dataset più grandi.
- Aggiungere sincronizzazione remota e backup (API REST o file export).
- Aggiungere icone reali / file nella cartella `/icons` per migliorare l'esperienza PWA.
- Aggiungere test automatici o linters leggieri (opzionale, non obbligatori per esecuzione su Termux).

## Contatti
Per domande o richieste specifiche riguardo a questa migrazione/documentazione scrivi qui su GitHub o apri un'issue nel repository.

---
Aggiornato per riflettere la scelta tecnica: PWA vanilla (Termux-friendly).