# OrarioDoc — Vanilla PWA (full-mvp)

Scopo: PWA leggera per gestione orario settimanale senza dipendenze (compatibile con Termux).

Quickstart:
1. python3 -m http.server 8080
2. apri http://127.0.0.1:8080

Contenuto e prossimi step: scaffold, storage, settings, export/import, accessibility tests.

## Temi e Gestione dello Stile

> **📝 Nota:** Il sistema di temi è già tecnicamente implementato in `app.css` e `app.js` (CSS variables, logica di switching, persistenza). L'integrazione nell'interfaccia utente sarà completata in PR successive. Questa sezione descrive il sistema COMPLETO per guidare lo sviluppo dell'interfaccia.

OrarioDoc implementa un **sistema di gestione dei temi centralizzato** basato su CSS Variables (Custom Properties), garantendo consistenza visiva, accessibilità e personalizzazione completa dell'interfaccia.

### 📖 Documentazione Completa
Per una guida dettagliata sul sistema di temi, consulta **[docs/THEMES.md](docs/THEMES.md)** che include:
- Stato implementazione e roadmap
- Struttura completa della palette colori
- Guida per sviluppatori sull'uso delle CSS Variables
- Best practices per accessibilità (WCAG 2.1 AA)
- Istruzioni per aggiungere nuovi temi
- FAQ e troubleshooting

### Temi Disponibili (Pianificati)

OrarioDoc offrirà **4 temi** selezionabili dal menu **Impostazioni**:

1. **Automatico (Sistema)** *(predefinito)*  
   Seguirà automaticamente le preferenze del sistema operativo (`prefers-color-scheme`). Si adatterà in tempo reale quando l'utente modifica le impostazioni del dispositivo tra chiaro e scuro.

2. **Chiaro (Light)**  
   Tema con colori luminosi e alta leggibilità su sfondo bianco. Ottimale per ambienti ben illuminati e utilizzo diurno.

3. **Scuro (Dark)**  
   Tema con colori scuri ottimizzato per ambienti con poca luce. Ridurrà l'affaticamento visivo durante l'utilizzo notturno.

4. **Expressive (Material Design 3)**  
   Ispirato a Material Design 3, con palette di colori vivaci e dinamici. Design espressivo e moderno con gradiente di sfondo.

### Come Selezionare un Tema (Funzionalità Futura)

1. Cliccare sul pulsante **Impostazioni** nella barra superiore
2. Nel menu a discesa, selezionare uno dei temi disponibili:
   - **Auto** (segue il sistema)
   - **Light** (chiaro)
   - **Dark** (scuro)
   - **Expressive** (Material 3)
3. Il tema verrà applicato **immediatamente** con anteprima in tempo reale
4. La scelta verrà **salvata automaticamente** e ripristinata al prossimo avvio

### Personalizzazione Colori (Funzionalità Futura)

Oltre ai temi predefiniti, sarà possibile personalizzare i colori principali dell'interfaccia:

1. Aprire il menu **Impostazioni**
2. Usare i selettori colore per modificare:
   - **Colore Primario**: utilizzato per pulsanti, link e elementi interattivi principali
   - **Colore Secondario**: utilizzato per accenti e azioni secondarie
3. Cliccare **Salva Colori** per applicare le modifiche
4. I colori personalizzati **sovrascriveranno** i valori del tema corrente
5. Usare **Ripristina Colori** per tornare ai colori predefiniti del tema

**Nota:** I colori personalizzati verranno salvati in `localStorage` (chiave: `orariodoc:colors`) e persisteranno anche quando si cambia tema.

### Persistenza delle Preferenze

Tutte le scelte di tema e colori verranno salvate automaticamente in `localStorage`:
- Chiave `orariodoc:theme`: tema selezionato (`auto`, `light`, `dark`, `expressive`)
- Chiave `orariodoc:colors`: colori personalizzati (se presenti)

Le preferenze verranno ripristinate automaticamente all'avvio dell'applicazione.

### Accessibilità

Tutti i temi di OrarioDoc garantiranno:
- ✅ **Conformità WCAG 2.1 Level AA** per il contrasto dei colori
- ✅ **Navigazione da tastiera** completa con stati di focus visibili
- ✅ **Supporto screen reader** con ARIA labels appropriati
- ✅ **Anteprima in tempo reale** delle modifiche
- ✅ **Responsive design** ottimizzato per desktop e mobile

### Icone e Risorse Visive

- Le icone sono in formato **SVG** (scalabili) posizionate nella cartella `/icons`
- Attualmente contiene icone placeholder; sostituirle con artwork definitivo prima del rilascio in produzione
- Tutte le icone hanno attributi `aria-hidden` e le azioni interattive includono `aria-label` per l'accessibilità

### Per Sviluppatori

**⚠️ IMPORTANTE:** Quando sviluppi componenti per OrarioDoc:
- **Usa SEMPRE CSS Variables** (mai colori hardcoded)
- Testa i componenti su **tutti i temi** (Light, Dark, Expressive)
- Verifica il **contrasto dei colori** con strumenti di accessibilità
- Consulta [docs/THEMES.md](docs/THEMES.md) per le linee guida complete

Esempio corretto:
```css
/* ✅ Corretto */
.button {
  background: var(--md-sys-color-primary);
  color: var(--md-sys-color-on-primary);
}

/* ❌ Sbagliato */
.button {
  background: #2b7cff;
  color: #ffffff;
}
```

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
