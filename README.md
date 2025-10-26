# OrarioDoc — Vanilla PWA (full-mvp)

Scopo: PWA leggera per gestione orario settimanale senza dipendenze (compatibile con Termux).

Quickstart:
1. python3 -m http.server 8080
2. apri http://127.0.0.1:8080

## 🗺️ Roadmap di Sviluppo

Per una panoramica completa dei task pianificati e del loro stato di avanzamento, consulta **[ROADMAP.md](ROADMAP.md)**.

La roadmap organizza lo sviluppo in 4 livelli di priorità con 11 subtask dettagliati:
- **Alta priorità:** Consolidamento UI/UX e accessibilità
- **Media priorità:** Funzionalità core e miglioramenti
- **Media-bassa priorità:** Ottimizzazione e qualità
- **Bassa priorità:** Documentazione e collaborazione

## Architettura dello Stile - Sistema Centralizzato

OrarioDoc utilizza un **sistema di gestione degli stili completamente centralizzato** basato su **Material Design 3** e CSS Variables (Custom Properties), garantendo consistenza visiva, accessibilità e manutenibilità.

### 📁 Struttura dei File CSS

Il progetto utilizza una **singola fonte di verità** per tutti gli stili:

1. **`theme.css`** (principale) - Sistema di tema centralizzato Material 3
   - Tutte le variabili CSS (colori, tipografia, spacing, elevazioni, forme)
   - Definizioni dei temi: light, dark, expressive
   - Stili base globali (reset, body, utility classes)
   - Font: Roboto Flex (Google Fonts - font variabile)

2. **`style.css`** - Stili specifici dell'applicazione
   - Layout e componenti dell'app (topbar, schedule-grid, forms, footer)
   - Usa SOLO variabili da theme.css, nessun valore hardcoded

3. **`src/components/*.css`** - Componenti Material Design 3 riutilizzabili
   - `button.css` - Button (Filled, Tonal, Outlined, Text, Elevated)
   - `card.css` - Card (Elevated, Filled, Outlined)
   - `navigation.css` - Top App Bar, Bottom Navigation, Navigation Drawer
   - `textfield.css` - Text Field (Filled, Outlined)
   - `dialog.css` - Dialog/Modal (Basic, Full Screen)
   - `fab.css` - Floating Action Button (Standard, Small, Large, Extended)
   - `chip.css` - Chip (Assist, Filter, Input, Suggestion)
   - `list.css` - List (One-line, Two-line, Three-line)
   - Usano SOLO variabili da theme.css

**Importante:** Tutti i file CSS fanno riferimento esclusivamente alle variabili definite in `theme.css`. Non esistono valori hardcoded o duplicazioni.

### 📦 Componenti Material Design 3

OrarioDoc include un set completo di componenti MD3 centralizzati e pronti all'uso. Per la documentazione completa con esempi e best practices, consulta **[docs/COMPONENTS.md](docs/COMPONENTS.md)**.

### 🎨 Sistema di Temi

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
- **Usa SEMPRE CSS Variables da `theme.css`** (mai colori o valori hardcoded)
- Tutti gli stili devono fare riferimento a `theme.css` come unica fonte di verità
- Testa i componenti su **tutti i temi** (Light, Dark, Expressive)
- Verifica il **contrasto dei colori** con strumenti di accessibilità
- Consulta [docs/THEMES.md](docs/THEMES.md) per le linee guida complete

**Ordine di inclusione CSS nei file HTML:**
```html
<link rel="stylesheet" href="/theme.css"/>
<link rel="stylesheet" href="/src/components/button.css"/>
<link rel="stylesheet" href="/src/components/card.css"/>
<link rel="stylesheet" href="/style.css"/>
```

Esempio corretto di utilizzo delle variabili:
```css
/* ✅ Corretto - usa variabili Material 3 */
.button {
  background: var(--md-sys-color-primary);
  color: var(--md-sys-color-on-primary);
  padding: var(--md-sys-spacing-sm) var(--md-sys-spacing-lg);
  border-radius: var(--md-sys-shape-corner-full);
  font-family: var(--md-sys-typescale-font-family);
}

/* ❌ Sbagliato - valori hardcoded */
.button {
  background: #2b7cff;
  color: #ffffff;
  padding: 8px 16px;
  border-radius: 9999px;
  font-family: 'Roboto Flex', sans-serif;
}
```

### 🔧 Variabili CSS Disponibili

Tutte definite in `theme.css`:
- **Colori:** `--md-sys-color-primary`, `--md-sys-color-surface`, `--md-sys-color-on-surface`, ecc.
- **Tipografia:** `--md-sys-typescale-*` (font-family, size, weight, line-height)
- **Spacing:** `--md-sys-spacing-xs`, `--md-sys-spacing-sm`, `--md-sys-spacing-md`, `--md-sys-spacing-lg`, ecc.
- **Elevazioni:** `--md-sys-elevation-level0` fino a `level5`
- **Forme:** `--md-sys-shape-corner-small`, `--md-sys-shape-corner-medium`, `--md-sys-shape-corner-full`, ecc.
- **Stati:** `--md-sys-state-hover-opacity`, `--md-sys-state-disabled-opacity`, ecc.

Per l'elenco completo, consulta il file `theme.css`.

## Migrazione dalla versione React/Node
- Questo branch è pensato come alternativa quando l'ambiente Node non è disponibile. Non rimuove il lavoro React/Node principale; mantenere la storia/branch originali è consigliato.
- Se vuoi mantenere entrambe le versioni nel repository, possiamo aggiungere una sezione nel README principale con link e indicazioni su come scegliere quella corretta per il proprio ambiente.

## Come contribuire
- Apri una issue per proporre cambiamenti, nuove feature o per segnalare bug.
- Se vuoi proporre aggiornamenti alla PWA, crea una branch a partire da `pwa-vanilla` e apri una PR verso `pwa-vanilla` o `main` a seconda dell'obiettivo.

## Testing

OrarioDoc include una suite di test automatici che può essere eseguita direttamente nel browser, senza necessità di Node.js o dipendenze esterne.

### Eseguire i Test

1. Avviare un server locale:
   ```bash
   python3 -m http.server 8080
   ```

2. Aprire il test runner nel browser:
   ```
   http://localhost:8080/tests/test-runner.html
   ```

3. Cliccare su "Run Tests" per eseguire tutti i test

### Copertura Test

- ✅ **Storage**: Test per IndexedDB e localStorage
- ✅ **Theme Manager**: Test per gestione temi e colori
- ✅ **Toast**: Test per notifiche utente
- ✅ **Accessibility**: Test conformità WCAG 2.1 AA

Per maggiori dettagli, consulta:
- **[docs/TEST_PLAN.md](docs/TEST_PLAN.md)** - Piano test completo (manuale e automatico)
- **[tests/README.md](tests/README.md)** - Documentazione suite test automatici

### CI/CD

I test vengono eseguiti automaticamente su ogni push e pull request tramite GitHub Actions.

## Note tecniche e miglioramenti possibili
- ✅ IndexedDB implementato per dataset più grandi (migrazione automatica da localStorage)
- Aggiungere sincronizzazione remota e backup (API REST o file export)
- Aggiungere icone reali / file nella cartella `/icons` per migliorare l'esperienza PWA
- ✅ Test automatici implementati (browser-based, no Node.js richiesto)

## Contatti
Per domande o richieste specifiche riguardo a questa migrazione/documentazione scrivi qui su GitHub o apri un'issue nel repository.

---
Aggiornato per riflettere la scelta tecnica: PWA vanilla (Termux-friendly).
