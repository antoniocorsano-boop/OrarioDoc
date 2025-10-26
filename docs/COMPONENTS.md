# Componenti Material Design 3 - OrarioDoc

Questo file documenta tutti i componenti Material Design 3 disponibili in OrarioDoc, centralizzati e gestiti tramite le variabili CSS di `theme.css`.

## 📦 Componenti Disponibili

Tutti i componenti sono:
- ✅ Basati su Material Design 3
- ✅ Utilizzano SOLO variabili da `theme.css`
- ✅ Zero valori hardcoded
- ✅ Supportano tutti i temi (light, dark, expressive)
- ✅ Accessibili (WCAG 2.1 Level AA)
- ✅ Responsive e mobile-first

### 1. Button (`button.css`)
Componente button con 5 varianti Material 3:
- **Filled** - Button primario pieno
- **Tonal** - Button secondario tonale
- **Outlined** - Button con bordo
- **Text** - Button solo testo
- **Elevated** - Button con ombra

**Dimensioni:** Small, Medium (default), Large  
**Stati:** Hover, Focus, Active, Disabled  
**Uso:** Azioni primarie e secondarie nell'interfaccia

```html
<button class="btn btn--filled">Salva</button>
<button class="btn btn--outlined">Annulla</button>
```

### 2. Card (`card.css`)
Componente card con 3 varianti:
- **Elevated** - Card con ombra (default)
- **Filled** - Card con background container
- **Outlined** - Card con bordo, senza ombra

**Elementi:** Header, Title, Subtitle, Content, Actions, Media  
**Stati:** Clickable, Hover, Focus, Disabled  
**Uso:** Contenitori per informazioni raggruppate

```html
<div class="card card--elevated">
  <h3 class="card__title">Titolo</h3>
  <p class="card__content">Contenuto</p>
</div>
```

### 3. Navigation (`navigation.css`)
Componenti di navigazione con 3 varianti:
- **Top App Bar** - Barra superiore sticky
- **Bottom Navigation** - Navigazione inferiore fixed
- **Navigation Drawer** - Menu laterale con backdrop

**Elementi:** Title, Actions, Icons, Items  
**Stati:** Active item, Hover, Focus  
**Uso:** Navigazione principale e menu laterale

```html
<header class="top-app-bar">
  <div class="top-app-bar__leading">
    <h1 class="top-app-bar__title">OrarioDoc</h1>
  </div>
  <div class="top-app-bar__trailing">
    <button class="top-app-bar__action">...</button>
  </div>
</header>
```

### 4. Text Field (`textfield.css`)
Componente input con 2 varianti:
- **Filled** - Input riempito (default)
- **Outlined** - Input con bordo

**Elementi:** Label animata, Supporting text, Leading/Trailing icons  
**Stati:** Populated, Focused, Error, Disabled  
**Uso:** Input di testo, email, ricerca

```html
<div class="text-field text-field--filled">
  <div class="text-field__container">
    <input type="text" class="text-field__input" id="name" />
    <label for="name" class="text-field__label">Nome</label>
  </div>
</div>
```

### 5. Dialog (`dialog.css`)
Componente dialog/modal con 2 varianti:
- **Basic Dialog** - Dialog standard
- **Full Screen Dialog** - Dialog schermo intero

**Elementi:** Header, Title, Close button, Content, Actions  
**Stati:** Visible/Hidden con animazioni, Backdrop  
**Uso:** Conferme, form, informazioni dettagliate

```html
<div class="dialog-backdrop dialog-backdrop--visible"></div>
<div class="dialog dialog--visible" role="dialog">
  <div class="dialog__header">
    <h2 class="dialog__title">Titolo</h2>
    <button class="dialog__close">×</button>
  </div>
  <div class="dialog__content">Contenuto</div>
  <div class="dialog__actions">
    <button class="btn btn--text">Annulla</button>
    <button class="btn btn--filled">Conferma</button>
  </div>
</div>
```

### 6. FAB - Floating Action Button (`fab.css`)
Componente FAB con 4 varianti:
- **Standard FAB** - 56x56px
- **Small FAB** - 40x40px
- **Large FAB** - 96x96px
- **Extended FAB** - Con testo

**Colori:** Primary Container, Surface, Secondary, Tertiary  
**Posizionamento:** Fixed con helper classes (bottom-right, bottom-left, center)  
**Uso:** Azione principale rapida

```html
<button class="fab fab--fixed fab--bottom-right" aria-label="Aggiungi">
  <svg class="fab__icon">...</svg>
</button>
```

### 7. Chip (`chip.css`)
Componente chip con 4 varianti:
- **Assist Chip** - Azione assistita
- **Filter Chip** - Filtro selezionabile
- **Input Chip** - Chip removibile
- **Suggestion Chip** - Suggerimento

**Elementi:** Leading icon, Label, Checkmark, Trailing action (remove)  
**Stati:** Selected, Hover, Focus, Disabled  
**Uso:** Tag, filtri, selezione multipla

```html
<button class="chip chip--filter chip--selected" role="checkbox">
  <svg class="chip__checkmark">...</svg>
  <span class="chip__label">Matematica</span>
</button>
```

### 8. List (`list.css`)
Componente list con 3 varianti:
- **One-line** - Lista a una riga
- **Two-line** - Lista a due righe
- **Three-line** - Lista a tre righe

**Elementi:** Leading (icon/image/monogram), Content (headline/supporting text), Trailing (icon/text)  
**Extra:** Subheader, Divider, Dense variant  
**Uso:** Elenchi, menu, impostazioni

```html
<div class="list">
  <button class="list-item list-item--two-line">
    <div class="list-item__leading">
      <svg class="list-item__leading-icon">...</svg>
    </div>
    <div class="list-item__content">
      <h3 class="list-item__headline">Titolo</h3>
      <p class="list-item__supporting-text">Descrizione</p>
    </div>
  </button>
</div>
```

## 🎨 Sistema di Variabili

Tutti i componenti utilizzano le variabili CSS da `theme.css`:

### Colori
```css
--md-sys-color-primary
--md-sys-color-on-primary
--md-sys-color-surface
--md-sys-color-on-surface
--md-sys-color-secondary-container
--md-sys-color-outline
--md-sys-color-error
/* ... e molte altre */
```

### Tipografia
```css
--md-sys-typescale-font-family (Roboto Flex)
--md-sys-typescale-headline-*
--md-sys-typescale-title-*
--md-sys-typescale-body-*
--md-sys-typescale-label-*
```

### Spacing
```css
--md-sys-spacing-xs   /* 4px */
--md-sys-spacing-sm   /* 8px */
--md-sys-spacing-md   /* 12px */
--md-sys-spacing-lg   /* 16px */
--md-sys-spacing-xl   /* 20px */
--md-sys-spacing-2xl  /* 24px */
--md-sys-spacing-3xl  /* 32px */
```

### Elevazioni
```css
--md-sys-elevation-level0  /* none */
--md-sys-elevation-level1  /* shadow light */
--md-sys-elevation-level2
--md-sys-elevation-level3
--md-sys-elevation-level4
--md-sys-elevation-level5  /* shadow heavy */
```

### Forme
```css
--md-sys-shape-corner-none         /* 0 */
--md-sys-shape-corner-extra-small  /* 4px */
--md-sys-shape-corner-small        /* 8px */
--md-sys-shape-corner-medium       /* 12px */
--md-sys-shape-corner-large        /* 16px */
--md-sys-shape-corner-extra-large  /* 28px */
--md-sys-shape-corner-full         /* 9999px */
```

### Stati
```css
--md-sys-state-hover-opacity      /* 0.08 */
--md-sys-state-focus-opacity      /* 0.12 */
--md-sys-state-pressed-opacity    /* 0.12 */
--md-sys-state-disabled-opacity   /* 0.38 */
```

## 📋 Checklist Integrazione Componenti

Quando aggiungi un nuovo componente:
- [ ] Usa SOLO variabili da `theme.css`
- [ ] Implementa stati interattivi (hover, focus, active, disabled)
- [ ] Supporta tutti i temi (light, dark, expressive)
- [ ] Accessibilità: ARIA labels, keyboard navigation, focus visible
- [ ] Responsive: mobile-first approach
- [ ] Documentazione: esempi di utilizzo nel file CSS
- [ ] Test visivo su tutti i temi

## 🚀 Come Usare i Componenti

### 1. Includi i CSS nell'HTML
```html
<link rel="stylesheet" href="/theme.css"/>
<link rel="stylesheet" href="/src/components/button.css"/>
<link rel="stylesheet" href="/src/components/card.css"/>
<link rel="stylesheet" href="/src/components/navigation.css"/>
<!-- Aggiungi altri componenti secondo necessità -->
```

### 2. Usa le classi nei componenti
Segui gli esempi di utilizzo inclusi in ogni file CSS.

### 3. Personalizza tramite theme.css
Modifica i colori, spacing, o forme modificando le variabili in `theme.css`.

## 📱 Responsive Design

Tutti i componenti sono responsive e si adattano a:
- **Mobile** (< 600px)
- **Tablet** (600px - 900px)
- **Desktop** (> 900px)

## ♿ Accessibilità

Tutti i componenti seguono le linee guida WCAG 2.1 Level AA:
- Contrasto colori adeguato
- Navigazione da tastiera completa
- ARIA labels e roles
- Focus states visibili
- Screen reader friendly

## 🎯 Best Practices

1. **Non duplicare stili** - Usa sempre le variabili da theme.css
2. **Mantieni consistenza** - Usa gli stessi pattern in tutta l'app
3. **Testa su tutti i temi** - Verifica visivamente light, dark, expressive
4. **Accessibilità prima** - Ogni componente deve essere accessibile
5. **Mobile first** - Progetta prima per mobile, poi desktop

## 📚 Risorse

- [Material Design 3 Guidelines](https://m3.material.io/)
- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [Roboto Flex Font](https://fonts.google.com/specimen/Roboto+Flex)

## 🔄 Roadmap Componenti Futuri

Componenti Material 3 da implementare in futuro:
- [ ] Snackbar / Toast
- [ ] Progress Indicators (Linear, Circular)
- [ ] Slider
- [ ] Switch / Toggle
- [ ] Radio Button / Checkbox
- [ ] Menu / Dropdown
- [ ] Tabs
- [ ] Tooltip
- [ ] Badge
- [ ] Date Picker / Time Picker

---

**Nota:** Tutti i componenti sono progettati per essere modulari e riutilizzabili. Puoi includerli singolarmente secondo le necessità dell'applicazione.
