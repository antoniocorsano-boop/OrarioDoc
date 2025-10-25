# OrarioDoc — Vanilla PWA (full-mvp)

Scopo: PWA leggera per gestione orario settimanale senza dipendenze (compatibile con Termux).

Quickstart:
1. python3 -m http.server 8080
2. apri http://127.0.0.1:8080

Contenuto e prossimi step: scaffold, storage, settings, export/import, accessibility tests.

## Temi e grafica
OrarioDoc PWA offre diverse opzioni di personalizzazione per l'interfaccia:

### Opzioni tema disponibili
- **Automatico (sistema)**: Segue le preferenze del sistema operativo (`prefers-color-scheme`). Passa automaticamente tra tema chiaro e scuro in base alle impostazioni del dispositivo.
- **Chiaro**: Tema con colori luminosi e alta leggibilità su sfondo bianco.
- **Scuro**: Tema ottimizzato per ambienti con poca luce, riduce l'affaticamento visivo.
- **Expressive (M3)**: Ispirato a Material Design 3, con palette colori vivaci e dinamici.

### Personalizzazione colori
Tramite il menu **Impostazioni**, puoi personalizzare i colori principali dell'applicazione:
- **Colore primario**: Utilizzato per pulsanti, link e elementi interattivi principali
- **Colore secondario**: Utilizzato per accenti e azioni secondarie

Le scelte vengono salvate in `localStorage` (chiavi: `orariodoc:theme`, `orariodoc:colors`) e ripristinate automaticamente al riavvio dell'app.

### Icone e accessibilità
- Le icone sono in formato **SVG** (scalabili) posizionate nella cartella `/icons`.
- Attualmente contiene icone placeholder; è consigliato sostituirle con artwork definitivo prima del rilascio in produzione.
- Tutte le icone hanno attributi `alt` e `aria-label` appropriati per garantire l'accessibilità agli screen reader.
- I controlli interattivi includono stati di focus visibili per la navigazione da tastiera.

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
