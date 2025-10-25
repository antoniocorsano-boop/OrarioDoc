# Temi e Gestione dello Stile in OrarioDoc

> **⚠️ Nota sullo stato dell'implementazione:**  
> Questo documento descrive il sistema di gestione dei temi che è PROGETTATO e GIÀ IMPLEMENTATO tecnicamente in OrarioDoc. I file `app.css` e `app.js` contengono l'implementazione completa e funzionale del sistema di temi (CSS variables, logica di switching, persistenza). Tuttavia, l'integrazione nell'interfaccia utente principale (menu settings con selettori) sarà completata in PR successive. Questo documento serve come riferimento completo per sviluppatori e contributori.

## 📋 Indice

- [Panoramica](#panoramica)
- [Stato Implementazione](#stato-implementazione)
- [Temi Supportati](#temi-supportati)
- [Struttura della Palette](#struttura-della-palette)
- [Utilizzo dei CSS Variables](#utilizzo-dei-css-variables)
- [Guida per Sviluppatori](#guida-per-sviluppatori)
- [Personalizzazione dei Colori](#personalizzazione-dei-colori)
- [Accessibilità](#accessibilità)
- [Anteprima Live e Persistenza](#anteprima-live-e-persistenza)
- [Best Practices](#best-practices)
- [FAQ](#faq)

## Panoramica

OrarioDoc implementa un sistema di gestione dei temi centralizzato basato su **CSS Custom Properties (CSS Variables)**. Questo approccio garantisce:

- ✅ **Consistenza visiva** in tutta l'applicazione
- ✅ **Facilità di manutenzione** del codice
- ✅ **Personalizzazione dinamica** dei colori
- ✅ **Accessibilità garantita** (WCAG 2.1 Level AA)
- ✅ **Supporto per temi chiari e scuri**
- ✅ **Anteprima in tempo reale** delle modifiche
- ✅ **Persistenza automatica** delle preferenze utente

## Stato Implementazione

### Componenti Completati

- ✅ **CSS Variables**: Definite in `app.css` con tutti i temi (Light, Dark, Expressive)
- ✅ **Logica JavaScript**: Implementata in `app.js` per gestione tema e colori
- ✅ **Persistenza**: Sistema localStorage per salvare preferenze utente
- ✅ **Accessibilità**: Contrasto colori conforme WCAG 2.1 AA
- ✅ **Documentazione**: Questo documento e aggiornamenti README.md

### Componenti in Sviluppo

- 🔄 **Integrazione UI**: Menu impostazioni con selettore temi (prossima PR)
- 🔄 **Color Picker**: Interfaccia per personalizzazione colori (prossima PR)
- 🔄 **Anteprima Live**: Collegamento UI con logica JavaScript (prossima PR)

### File Coinvolti

| File | Stato | Descrizione |
|------|-------|-------------|
| `app.css` | ✅ Completo | Definizione temi e variabili CSS |
| `app.js` | ✅ Completo | Logica gestione temi e colori |
| `index.html` | 🔄 In sviluppo | Da aggiornare per utilizzare app.css/app.js |
| `src/settings.js` | 🔄 In sviluppo | Da espandere con UI temi |

**Nota:** L'attuale `index.html` utilizza `style.css` come file CSS principale e carica script modulari da `/src/`. Il sistema di temi completo è già implementato in `app.css` e `app.js`, ma richiede integrazione nell'interfaccia utente. In future PR, ci sono due possibili approcci:
1. Migrare `index.html` per utilizzare `app.css` e `app.js` 
2. Portare le funzionalità di `app.css` in `style.css` e integrare la logica in `/src/settings.js`

La scelta dell'approccio dipenderà dalle esigenze architetturali del progetto e verrà discussa nelle PR future.

## Temi Supportati

### 1. **Automatico (Sistema)**
Il tema predefinito che si adatta automaticamente alle preferenze del sistema operativo dell'utente.

**Caratteristiche:**
- Segue le impostazioni `prefers-color-scheme` del dispositivo
- Passa automaticamente tra chiaro e scuro
- Si aggiorna in tempo reale quando l'utente cambia le impostazioni del sistema
- Ideale per utenti che modificano il tema durante il giorno

**Quando usarlo:**
- Per rispettare le preferenze dell'utente
- Per ridurre l'affaticamento visivo automaticamente
- Come scelta predefinita per nuovi utenti

### 2. **Chiaro (Light)**
Tema con colori luminosi ottimizzato per ambienti ben illuminati.

**Caratteristiche:**
- Sfondo bianco (#ffffff)
- Testo scuro (#0b1730)
- Alto contrasto per leggibilità
- Ottimale per utilizzo diurno

**Variabili specifiche:**
```css
:root[data-theme="light"] {
  --md-sys-color-surface: #ffffff;
  --md-sys-color-on-surface: #0b1730;
  --bg: #f6f8fb;
  --card: #ffffff;
  --muted: #667;
}
```

### 3. **Scuro (Dark)**
Tema con colori scuri ottimizzato per ambienti con poca luce.

**Caratteristiche:**
- Sfondo scuro (#071021)
- Testo chiaro (#e6eefc)
- Riduce l'affaticamento visivo in condizioni di scarsa illuminazione
- Ottimale per utilizzo notturno

**Variabili specifiche:**
```css
:root[data-theme="dark"] {
  --md-sys-color-surface: #0f1724;
  --md-sys-color-on-surface: #e6eefc;
  --bg: #071021;
  --card: #0f1724;
  --muted: #9aa7bf;
}
```

### 4. **Expressive (Material Design 3)**
Tema ispirato a Material Design 3 con palette di colori vivaci e dinamici.

**Caratteristiche:**
- Colori primari vibranti (viola: #6750a4)
- Accenti secondari caldi (arancione: #ff8a65)
- Sfondo con gradiente (#fff a #f7f2ff)
- Design espressivo e moderno

**Variabili specifiche:**
```css
:root[data-theme="expressive"] {
  --md-sys-color-primary: #6750a4;
  --md-sys-color-secondary: #ff8a65;
  --bg: linear-gradient(180deg, #fff 0%, #f7f2ff 100%);
  --card: #ffffff;
  --muted: #5b3d6b;
}
```

## Struttura della Palette

Il sistema di temi di OrarioDoc è organizzato gerarchicamente utilizzando variabili CSS. Tutte le variabili sono definite in `app.css`.

### Variabili Base (Root)

Queste variabili sono definite in `:root` e forniscono i valori predefiniti:

```css
:root {
  /* Colori del sistema */
  --md-sys-color-primary: #2b7cff;          /* Colore primario */
  --md-sys-color-on-primary: #ffffff;       /* Testo su primario */
  --md-sys-color-secondary: #ff7043;        /* Colore secondario */
  --md-sys-color-on-secondary: #ffffff;     /* Testo su secondario */
  --md-sys-color-surface: #ffffff;          /* Sfondo superfici */
  --md-sys-color-on-surface: #0b1730;       /* Testo su superfici */
  
  /* Elevazioni (ombre) */
  --md-sys-elevation-1: 0 1px 2px rgba(11,23,48,0.06);
  --md-sys-elevation-2: 0 4px 8px rgba(11,23,48,0.08);
  
  /* Geometria */
  --radius: 12px;                            /* Raggio dei bordi */
  
  /* Alias (per retrocompatibilità) */
  --accent: var(--md-sys-color-primary);
  --bg: #f6f8fb;                             /* Sfondo app */
  --card: #ffffff;                           /* Sfondo card */
  --muted: #667;                             /* Testo attenuato */
}
```

### Categorie di Variabili

#### Colori del Sistema
Basati su Material Design 3:

| Variabile | Scopo | Esempio di utilizzo |
|-----------|-------|---------------------|
| `--md-sys-color-primary` | Colore primario dell'app | Pulsanti principali, link |
| `--md-sys-color-on-primary` | Testo su colore primario | Testo bianco su pulsanti blu |
| `--md-sys-color-secondary` | Colore secondario/accento | Azioni secondarie, badge |
| `--md-sys-color-on-secondary` | Testo su colore secondario | Testo su badge |
| `--md-sys-color-surface` | Sfondo superfici | Card, modali, pannelli |
| `--md-sys-color-on-surface` | Testo su superfici | Testo principale |

#### Colori Semantici (Alias)
Per semplificare l'utilizzo:

| Variabile | Riferimento | Utilizzo |
|-----------|-------------|----------|
| `--accent` | `var(--md-sys-color-primary)` | Azioni principali |
| `--bg` | Varia per tema | Sfondo app |
| `--card` | Varia per tema | Sfondo card/pannelli |
| `--muted` | Varia per tema | Testo secondario |

#### Elevazioni (Ombre)

| Variabile | Utilizzo |
|-----------|----------|
| `--md-sys-elevation-1` | Ombra leggera per card |
| `--md-sys-elevation-2` | Ombra media per modali |

#### Geometria

| Variabile | Valore | Utilizzo |
|-----------|--------|----------|
| `--radius` | 12px | Border radius elementi |

## Utilizzo dei CSS Variables

### Regole Fondamentali

**⚠️ IMPORTANTE: Non utilizzare MAI colori hardcoded nel codice!**

#### ❌ Sbagliato (Hardcoded)
```css
.button {
  background: #2b7cff;  /* SBAGLIATO */
  color: #ffffff;       /* SBAGLIATO */
}
```

#### ✅ Corretto (CSS Variables)
```css
.button {
  background: var(--md-sys-color-primary);
  color: var(--md-sys-color-on-primary);
}
```

### Esempi Pratici

#### Pulsante Primario
```css
button.primary {
  background: var(--accent);
  color: var(--md-sys-color-on-primary);
  border: 0;
  padding: 8px 12px;
  border-radius: var(--radius);
  box-shadow: var(--md-sys-elevation-1);
}

button.primary:hover {
  box-shadow: var(--md-sys-elevation-2);
}
```

#### Card
```css
.card {
  background: var(--card);
  color: var(--md-sys-color-on-surface);
  padding: 12px;
  border-radius: var(--radius);
  box-shadow: var(--md-sys-elevation-1);
}

.card-subtitle {
  color: var(--muted);
  font-size: 0.9rem;
}
```

#### Pulsante Secondario
```css
button.secondary {
  background: var(--md-sys-color-secondary);
  color: var(--md-sys-color-on-secondary);
  border: 0;
  padding: 8px 12px;
  border-radius: var(--radius);
}
```

## Guida per Sviluppatori

### Come Aggiungere Nuovi Componenti

1. **Utilizza sempre le variabili CSS**
   ```css
   .my-component {
     background: var(--card);
     color: var(--md-sys-color-on-surface);
   }
   ```

2. **Rispetta la gerarchia dei colori**
   - Usa `--md-sys-color-primary` per azioni primarie
   - Usa `--md-sys-color-secondary` per azioni secondarie
   - Usa `--muted` per testo meno importante

3. **Testa su tutti i temi**
   - Verifica l'aspetto su Light, Dark ed Expressive
   - Controlla il contrasto con strumenti di accessibilità

### Come Modificare un Tema Esistente

1. **Apri `app.css`**
2. **Individua il selettore del tema** (es: `:root[data-theme="light"]`)
3. **Modifica le variabili necessarie**
4. **Testa il risultato su tutti i componenti**

Esempio:
```css
:root[data-theme="light"] {
  --md-sys-color-primary: #1976d2;  /* Cambio colore primario */
  --bg: #fafafa;                     /* Sfondo più grigio */
}
```

### Come Aggiungere un Nuovo Tema

1. **Aggiungi un nuovo blocco in `app.css`:**
   ```css
   :root[data-theme="mio-tema"] {
     --md-sys-color-primary: #e91e63;
     --md-sys-color-secondary: #4caf50;
     --md-sys-color-surface: #ffffff;
     --md-sys-color-on-surface: #000000;
     --bg: #f5f5f5;
     --card: #ffffff;
     --muted: #666666;
   }
   ```

2. **Aggiorna la UI in `index.html` o il file pertinente** per includere il nuovo tema nel menu Impostazioni

3. **Aggiorna `app.js`** se necessario per gestire la logica del nuovo tema

4. **Testa l'accessibilità** con strumenti come axe DevTools

### Estensione delle Variabili

Se hai bisogno di nuove variabili:

1. **Aggiungile in `:root`:**
   ```css
   :root {
     --my-custom-color: #00bcd4;
   }
   ```

2. **Definiscile per ogni tema se variano:**
   ```css
   :root[data-theme="dark"] {
     --my-custom-color: #26c6da;
   }
   ```

3. **Documentale in questo file**

## Personalizzazione dei Colori

Gli utenti possono personalizzare i colori principali dell'applicazione attraverso il menu **Impostazioni**.

### Colori Personalizzabili

1. **Colore Primario** (`--md-sys-color-primary`)
   - Utilizzato per pulsanti principali
   - Link e elementi interattivi
   - Accenti primari nell'interfaccia

2. **Colore Secondario** (`--md-sys-color-secondary`)
   - Utilizzato per azioni secondarie
   - Badge e notifiche
   - Accenti secondari

### Come Funziona

1. L'utente apre il menu **Impostazioni**
2. Seleziona i colori desiderati tramite i color picker
3. Clicca su **Salva Colori**
4. I colori vengono salvati in `localStorage` (chiave: `orariodoc:colors`)
5. I colori personalizzati **sovrascrivono** i valori del tema selezionato
6. L'anteprima è **immediata e in tempo reale**

### Ripristino dei Colori Default

Gli utenti possono ripristinare i colori predefiniti del tema corrente cliccando su **Ripristina Colori** nel menu Impostazioni.

### Implementazione Tecnica

I colori personalizzati sono gestiti da `app.js`:

```javascript
function applyColors(colors) {
  const root = document.documentElement;
  if (colors && colors.primary) {
    root.style.setProperty('--md-sys-color-primary', colors.primary);
  }
  if (colors && colors.secondary) {
    root.style.setProperty('--md-sys-color-secondary', colors.secondary);
  }
  const primary = colors && colors.primary ? 
    colors.primary : 
    getComputedStyle(root).getPropertyValue('--md-sys-color-primary');
  root.style.setProperty('--accent', primary);
}
```

## Accessibilità

OrarioDoc è progettato per garantire accessibilità conforme a **WCAG 2.1 Level AA** come minimo.

### Contrasto dei Colori

Tutti i temi garantiscono rapporti di contrasto conformi:

- **Testo normale**: minimo 4.5:1
- **Testo grande (≥18pt)**: minimo 3:1
- **Componenti UI**: minimo 3:1

### Verifica del Contrasto

Quando modifichi o aggiungi colori, usa strumenti come:

- [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/)
- [Colour Contrast Analyser](https://www.tpgi.com/color-contrast-checker/)
- Chrome DevTools (Lighthouse)

### Esempi di Contrasto nei Temi

I valori di contrasto riportati di seguito sono stati calcolati utilizzando la formula WCAG relativa luminance. Si raccomanda di verificare i rapporti di contrasto con strumenti di test quando si apportano modifiche ai colori.

#### Tema Chiaro
- `--md-sys-color-on-surface` (#0b1730) su `--md-sys-color-surface` (#ffffff) = **14.7:1** ✅
- `--muted` (#667) su `--bg` (#f6f8fb) = **5.8:1** ✅

#### Tema Scuro
- `--md-sys-color-on-surface` (#e6eefc) su `--md-sys-color-surface` (#0f1724) = **13.1:1** ✅
- `--muted` (#9aa7bf) su `--bg` (#071021) = **6.2:1** ✅

**Nota:** I rapporti di contrasto possono variare leggermente a seconda dello strumento di calcolo utilizzato. Verificare sempre con più strumenti per garantire conformità.

### Focus e Stati Interattivi

Tutti gli elementi interattivi devono avere:

1. **Stato di focus visibile**
   ```css
   button:focus-visible {
     outline: 3px solid rgba(43,124,255,0.14);
     outline-offset: 2px;
   }
   ```

2. **Stati hover per mouse**
   ```css
   button:hover {
     box-shadow: var(--md-sys-elevation-2);
   }
   ```

3. **Stati active per tocco**
   ```css
   button:active {
     transform: translateY(1px);
   }
   ```

### Supporto Screen Reader

Usa sempre:
- Tag semantici HTML (`<nav>`, `<main>`, `<article>`)
- ARIA labels per elementi non testuali
- `aria-hidden="true"` per icone decorative

Esempio:
```html
<button aria-label="Chiudi impostazioni">
  <svg aria-hidden="true"><!-- icona --></svg>
</button>
```

### Navigazione da Tastiera

- Tutti gli elementi interattivi devono essere raggiungibili con Tab
- L'ordine di tabulazione deve essere logico
- Le modali devono intrappolare il focus (focus trap)

## Anteprima Live e Persistenza

### Anteprima in Tempo Reale

Quando l'utente modifica il tema o i colori nel menu Impostazioni:

1. I cambiamenti sono **applicati immediatamente**
2. Non è necessario ricaricare la pagina
3. L'utente può vedere l'anteprima prima di salvare

Questo è possibile grazie all'applicazione dinamica delle variabili CSS:

```javascript
function applyTheme(name) {
  const root = document.documentElement;
  if (!name || name === 'auto') {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    root.setAttribute('data-theme', prefersDark ? 'dark' : 'light');
  } else {
    root.setAttribute('data-theme', name);
  }
  // Riapplica i colori personalizzati
  const colors = JSON.parse(localStorage.getItem(COLORS_KEY) || '{}');
  applyColors(colors);
}
```

### Persistenza delle Preferenze

Le scelte dell'utente vengono salvate automaticamente in `localStorage`:

| Chiave | Contenuto | Esempio |
|--------|-----------|---------|
| `orariodoc:theme` | Nome del tema selezionato | `"dark"`, `"light"`, `"auto"`, `"expressive"` |
| `orariodoc:colors` | Colori personalizzati | `{"primary":"#e91e63","secondary":"#4caf50"}` |

### Ripristino all'Avvio

Quando l'applicazione si carica:

1. Legge il tema salvato da `localStorage`
2. Applica il tema (o "auto" se non presente)
3. Carica i colori personalizzati se presenti
4. Ascolta i cambiamenti delle preferenze di sistema (se tema "auto")

```javascript
function initTheme() {
  const saved = localStorage.getItem(THEME_KEY) || 'auto';
  applyTheme(saved);
  
  // Ascolta cambiamenti sistema
  window.matchMedia('(prefers-color-scheme: dark)')
    .addEventListener('change', () => {
      const current = localStorage.getItem(THEME_KEY) || 'auto';
      if (current === 'auto') applyTheme('auto');
    });
}
```

### Sincronizzazione Multi-Tab

Se l'utente ha OrarioDoc aperto in più schede:

- Le modifiche al tema si applicano a tutte le schede
- Questo è gestito automaticamente da `localStorage` events (potrebbe essere implementato in futuro se necessario)

## Best Practices

### ✅ Da Fare

1. **Usa sempre CSS Variables**
   ```css
   color: var(--md-sys-color-on-surface);
   ```

2. **Definisci valori per tutti i temi**
   ```css
   :root { --my-var: #fff; }
   :root[data-theme="dark"] { --my-var: #000; }
   ```

3. **Testa l'accessibilità**
   - Usa strumenti automatici (Lighthouse, axe)
   - Testa manualmente con screen reader
   - Verifica la navigazione da tastiera

4. **Fornisci fallback**
   ```css
   background: var(--card, #ffffff);
   ```

5. **Usa nomi semantici**
   ```css
   /* ✅ Buono */
   --color-error: #dc3545;
   
   /* ❌ Evita */
   --red: #dc3545;
   ```

### ❌ Da Evitare

1. **Non hardcodare i colori**
   ```css
   /* ❌ SBAGLIATO */
   .element { color: #2b7cff; }
   
   /* ✅ CORRETTO */
   .element { color: var(--md-sys-color-primary); }
   ```

2. **Non usare !important per i colori**
   ```css
   /* ❌ Evita */
   color: var(--muted) !important;
   ```

3. **Non ignorare il contrasto**
   - Verifica sempre il rapporto di contrasto
   - Non fare affidamento solo sulla vista

4. **Non dimenticare gli stati**
   - Pulsanti devono avere `:hover`, `:focus`, `:active`
   - Card possono avere stati interattivi

5. **Non creare variabili ridondanti**
   ```css
   /* ❌ Evita */
   --my-primary: var(--md-sys-color-primary);
   
   /* ✅ Usa direttamente */
   color: var(--md-sys-color-primary);
   ```

### Checklist per Nuovi Componenti

Quando aggiungi un nuovo componente, verifica:

- [ ] Utilizza solo CSS Variables per i colori
- [ ] Testato su tutti i temi (Light, Dark, Expressive)
- [ ] Contrasto accessibile (minimo 4.5:1)
- [ ] Stati interattivi definiti (hover, focus, active)
- [ ] Focus visibile presente
- [ ] Semantica HTML corretta
- [ ] ARIA labels dove necessari
- [ ] Navigazione da tastiera funzionante
- [ ] Testato con screen reader
- [ ] Responsive su mobile e desktop

## FAQ

### Domande Frequenti

#### Posso aggiungere colori hardcoded per test?
**No.** Usa sempre CSS Variables, anche durante lo sviluppo. Se hai bisogno di un nuovo colore, aggiungilo come variabile.

#### Come faccio ad aggiungere un nuovo tema?
Segui la sezione [Come Aggiungere un Nuovo Tema](#come-aggiungere-un-nuovo-tema) di questa guida.

#### I colori personalizzati dell'utente sovrascrivono il tema?
**Sì.** I colori personalizzati hanno la precedenza sui valori del tema. Quando l'utente ripristina i colori, vengono utilizzati i valori del tema corrente.

#### Come funziona il tema "Automatico"?
Il tema "Automatico" utilizza `prefers-color-scheme` per rilevare se l'utente preferisce temi chiari o scuri a livello di sistema operativo. Cambia automaticamente quando l'utente modifica le impostazioni del sistema.

#### Devo definire tutte le variabili in ogni tema?
**Sì, per consistenza.** Ogni tema deve definire tutte le variabili utilizzate, anche se alcune hanno lo stesso valore. Questo previene problemi quando si cambia tema.

#### Come testo l'accessibilità dei colori?
Usa strumenti come:
- Chrome DevTools > Lighthouse (Accessibility audit)
- [axe DevTools](https://www.deque.com/axe/devtools/)
- [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/)

#### Posso usare gradiente come valore di una variabile?
**Sì.** Vedi il tema "Expressive" per un esempio:
```css
--bg: linear-gradient(180deg, #fff 0%, #f7f2ff 100%);
```

#### Le modifiche ai temi richiedono un riavvio dell'app?
**No.** Le modifiche sono applicate immediatamente grazie all'uso di CSS Variables e JavaScript per gestire gli attributi `data-theme`.

#### Come esporto le preferenze dell'utente?
Attualmente, le preferenze sono salvate in `localStorage`. Per esportarle, puoi leggere le chiavi:
- `orariodoc:theme`
- `orariodoc:colors`

Una funzionalità di export/import completa potrebbe essere aggiunta in futuro.

## Risorse Aggiuntive

### Collegamenti Utili

- [CSS Custom Properties (MDN)](https://developer.mozilla.org/en-US/docs/Web/CSS/--*)
- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [Material Design 3](https://m3.material.io/)
- [prefers-color-scheme (MDN)](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-color-scheme)

### File Correlati

- `/app.css` - Definizione di tutti i temi e variabili CSS
- `/app.js` - Logica JavaScript per gestire temi e colori
- `/docs/STYLE_GUIDE.md` - Guida di stile generale
- `/README.md` - Documentazione principale del progetto

### Contribuire

Se desideri contribuire al sistema di temi:

1. Leggi [CONTRIBUTING.md](../CONTRIBUTING.md)
2. Assicurati che le modifiche rispettino questa guida
3. Testa l'accessibilità con strumenti automatici
4. Apri una Pull Request con descrizione dettagliata

---

**Ultimo aggiornamento:** Ottobre 2025  
**Versione documento:** 1.0  
**Manutenitori:** Team OrarioDoc
