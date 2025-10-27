# Template README Componente

Questo file serve come template per creare documentazione per nuovi componenti OrarioDoc.

---

# Componente [Nome Componente]

Breve descrizione del componente (1-2 frasi).

## 📋 Descrizione

Descrizione dettagliata del componente:
- Cosa fa
- Quando usarlo
- Caratteristiche principali
- Casi d'uso

## 🎨 Design

Il componente segue le linee guida Material Design 3:
- **Layout**: Descrizione layout
- **Colori**: Usa esclusivamente variabili da `theme.css`
- **Tipografia**: Roboto Flex con scale tipografiche MD3
- **Elevazioni**: Shadow e stati secondo MD3
- **Stati**: Hover, focus, active, disabled
- **Accessibilità**: WCAG 2.1 Level AA compliant

## 📁 Struttura File

```
src/components/[nome-componente]/
├── [nome-componente].html      # Template HTML (se applicabile)
├── [nome-componente].css       # Stili componente
├── [nome-componente].js        # Logica JavaScript (se applicabile)
├── README.md                   # Questa documentazione
└── checklist.md                # Checklist implementazione
```

Oppure per componenti CSS-only:

```
src/components/
└── [nome-componente].css       # Stili componente con docs inline
```

## 🚀 Utilizzo

### HTML

```html
<!-- Esempio utilizzo HTML -->
<div class="component-class">
  <!-- Struttura componente -->
</div>
```

### CSS

Include gli stili:

```html
<link rel="stylesheet" href="/theme.css"/>
<link rel="stylesheet" href="/src/components/[nome-componente].css"/>
```

### JavaScript (se applicabile)

```javascript
// Esempio inizializzazione
const component = new ComponentClass(container, {
  option1: value1,
  option2: value2
});
```

## ⚙️ Opzioni

Per componenti con JavaScript, documentare le opzioni:

| Opzione | Tipo | Default | Descrizione |
|---------|------|---------|-------------|
| `option1` | Type | default | Descrizione opzione |
| `option2` | Type | default | Descrizione opzione |

## 📊 Varianti

Descrizione delle varianti disponibili:

### Variante 1
Descrizione e esempio

### Variante 2
Descrizione e esempio

## 🎨 Personalizzazione

### Colori
Elenco variabili CSS utilizzate per i colori:
- `--md-sys-color-primary`
- `--md-sys-color-on-primary`
- etc.

### Dimensioni
Elenco variabili CSS per spacing:
- `--md-sys-spacing-sm`
- `--md-sys-spacing-md`
- etc.

## 📱 Responsive

Descrivi come il componente si comporta su diversi viewport:

### Desktop (> 900px)
- Caratteristiche layout desktop

### Tablet (600px - 900px)
- Caratteristiche layout tablet

### Mobile (< 600px)
- Caratteristiche layout mobile

## ♿ Accessibilità

Elenco feature accessibilità implementate:

- **Ruoli ARIA**: Quali ruoli sono usati
- **Label**: Come sono gestite le label
- **Navigazione tastiera**: Tasti supportati
- **Focus**: Come è gestito il focus
- **Screen reader**: Considerazioni per screen reader
- **Contrasto**: Verifica contrasto colori

## 🔧 API Metodi (se applicabile)

### `metodo1(param)`
Descrizione metodo

```javascript
component.metodo1(value);
```

### `metodo2(param1, param2)`
Descrizione metodo

```javascript
component.metodo2(value1, value2);
```

## 🧪 Testing

Come testare il componente:

1. Verifica rendering su temi (light, dark, expressive)
2. Test responsive (mobile, tablet, desktop)
3. Test accessibilità con screen reader
4. Test navigazione tastiera
5. Test interazioni utente

## 🚧 Funzionalità Future

Elenco funzionalità pianificate:

- [ ] Funzionalità 1
- [ ] Funzionalità 2
- [ ] Funzionalità 3

## 📚 Riferimenti

- [Material Design 3 - [Componente]](https://m3.material.io/components/[component])
- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [OrarioDoc Style Guide](../../docs/STYLE_GUIDE.md)
- [OrarioDoc Components](../../docs/COMPONENTS.md)

## 🤝 Contribuire

Per contribuire al componente:

1. Leggi [CONTRIBUTING.md](../../CONTRIBUTING.md)
2. Segui [Style Guide](../../docs/STYLE_GUIDE.md)
3. Usa solo variabili da `theme.css`
4. Testa accessibilità
5. Aggiorna questa documentazione
6. Compila `checklist.md`

## 📝 Note

### Decisioni Design
- Motivazione scelta 1
- Motivazione scelta 2

### Problemi Noti
- Problema 1 e workaround
- Problema 2 e workaround

## 📄 Licenza

MIT License - vedi [LICENSE](../../LICENSE)

---

## 📝 Istruzioni per l'uso del Template

Quando crei un nuovo componente:

1. **Copia questo file** nella cartella del componente come `README.md`
2. **Sostituisci** `[Nome Componente]` e `[nome-componente]` con il nome effettivo
3. **Compila** tutte le sezioni con informazioni specifiche
4. **Rimuovi** questa sezione "Istruzioni per l'uso del Template"
5. **Aggiorna** `docs/COMPONENTS.md` con riferimento al nuovo componente
6. **Crea** il file `checklist.md` usando il template appropriato

### Sezioni Opzionali

Alcune sezioni possono essere omesse se non applicabili:
- **JavaScript**: Per componenti CSS-only
- **API Metodi**: Per componenti senza JavaScript
- **Varianti**: Se il componente ha una sola variante
- **Opzioni**: Per componenti statici

### Linee Guida Documentazione

- **Chiarezza**: Scrivi per utenti che vedono il componente per la prima volta
- **Esempi**: Includi sempre esempi di codice funzionanti
- **Visual**: Aggiungi screenshot quando possibile
- **Accessibilità**: Documenta sempre le feature accessibilità
- **Manutenzione**: Mantieni la documentazione aggiornata con il codice
