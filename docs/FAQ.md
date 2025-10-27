# FAQ - Domande Frequenti

Risposte alle domande più comuni su OrarioDoc.

## 🚀 Installazione e Setup

### Ho bisogno di Node.js per usare OrarioDoc?

**No.** OrarioDoc è una PWA vanilla JavaScript che non richiede Node.js per funzionare. Serve solo Python (o qualsiasi server HTTP statico) per eseguire l'applicazione localmente.

Node.js è necessario **solo** se vuoi eseguire i test automatizzati con Playwright.

### Come posso installare OrarioDoc?

OrarioDoc non richiede installazione tradizionale. Puoi:

1. **Usare online**: Visita l'URL dove è hostato (es. GitHub Pages)
2. **Installare come PWA**: Click su "Installa" nel browser
3. **Eseguire localmente**: Clone repository + avvia server Python

Vedi [QUICKSTART.md](QUICKSTART.md) per istruzioni dettagliate.

### Funziona su Termux?

**Sì!** OrarioDoc è stato progettato specificamente per essere compatibile con Termux e altri ambienti limitati. Non richiede Node.js o build tools.

```bash
# Su Termux
pkg install python
cd OrarioDoc
python -m http.server 8080
```

### Quali browser sono supportati?

OrarioDoc funziona su tutti i browser moderni che supportano:
- CSS Custom Properties (CSS Variables)
- IndexedDB
- Service Workers
- ES6+ JavaScript

**Supportati:**
- ✅ Chrome/Edge >= 88
- ✅ Firefox >= 78
- ✅ Safari >= 14
- ✅ Opera >= 74

**Non supportati:**
- ❌ Internet Explorer (qualsiasi versione)

## 💾 Dati e Privacy

### Dove vengono salvati i miei dati?

I dati vengono salvati **localmente** sul tuo dispositivo in:
- **IndexedDB**: Orari, lezioni, impostazioni
- **localStorage**: Preferenze tema

**Nessun dato** viene inviato a server esterni. Tutto rimane sul tuo dispositivo.

### Come faccio il backup dei miei dati?

Attualmente OrarioDoc salva i dati solo localmente. Per fare backup:

1. **Export JSON**: Usa la funzione Export nelle Impostazioni (se disponibile)
2. **Browser sync**: Se usi Chrome/Firefox sync, IndexedDB può essere sincronizzato
3. **Manuale**: Esporta dati da DevTools → Application → IndexedDB

### Cosa succede se cancello i dati del browser?

**Perdi tutti i dati.** OrarioDoc non ha sincronizzazione cloud. Prima di cancellare dati browser, fai un export delle impostazioni.

### OrarioDoc rispetta il GDPR?

**Sì.** OrarioDoc è completamente privacy-first:
- ✅ Nessun tracking o analytics
- ✅ Nessun cookie
- ✅ Nessun dato inviato a server
- ✅ Nessuna registrazione account
- ✅ Open source e verificabile

## 🎨 Temi e UI

### Come cambio il tema?

1. Click su **Impostazioni** nella topbar
2. Seleziona tema dal menu a tendina:
   - **Auto** (segue sistema)
   - **Light** (chiaro)
   - **Dark** (scuro)
   - **Expressive** (colorato)
3. Il tema si applica immediatamente

### Posso personalizzare i colori?

La personalizzazione colori avanzata è pianificata per versioni future. Attualmente puoi scegliere tra i 4 temi predefiniti.

Se sei sviluppatore, puoi modificare `theme.css` per creare temi custom.

### Il tema non si applica correttamente

Prova questi passaggi:

1. **Cancella cache tema**:
   ```javascript
   // In Console browser (F12)
   localStorage.removeItem('orariodoc:theme');
   location.reload();
   ```

2. **Verifica che CSS sia caricato**: DevTools → Network → Cerca `theme.css`

3. **Hard refresh**: Ctrl+Shift+R (Windows/Linux) o Cmd+Shift+R (Mac)

## 📱 Mobile e Responsive

### OrarioDoc funziona su mobile?

**Sì!** OrarioDoc è ottimizzato per dispositivi mobili con:
- Design responsive mobile-first
- Touch targets >= 48x48px
- Layout adattivo
- Funzionalità offline complete

### Posso installarlo come app sul telefono?

**Sì!** OrarioDoc è una Progressive Web App (PWA):

**Android (Chrome/Edge):**
1. Apri OrarioDoc nel browser
2. Menu (⋮) → "Installa app" o "Aggiungi a schermata home"

**iOS (Safari):**
1. Apri OrarioDoc in Safari
2. Tap icona Condividi
3. "Aggiungi a Home"

### Funziona offline?

**Sì!** Una volta caricato, OrarioDoc funziona completamente offline grazie al Service Worker. Dati e impostazioni sono salvati localmente.

## ⌨️ Accessibilità

### OrarioDoc è accessibile per screen reader?

**Sì!** OrarioDoc implementa WCAG 2.1 Level AA con:
- ✅ ARIA labels completi
- ✅ Landmark regions
- ✅ Navigazione tastiera
- ✅ Annunci live regions
- ✅ Focus management

Testato con NVDA e VoiceOver.

### Posso navigare solo con tastiera?

**Sì!** Tutti gli elementi sono accessibili da tastiera:
- **Tab/Shift+Tab**: Naviga tra elementi
- **Enter/Space**: Attiva bottoni/link
- **Escape**: Chiudi modali
- **Arrow keys**: Naviga menu

## 🛠️ Sviluppo e Contributi

### Come posso contribuire?

Leggi [CONTRIBUTING.md](../CONTRIBUTING.md) per:
- Setup ambiente sviluppo
- Linee guida codice
- Processo Pull Request
- Testing requirements

### Devo sapere React per contribuire?

**No!** OrarioDoc usa **Vanilla JavaScript** puro. Non serve conoscere framework. Se sai HTML, CSS e JavaScript, puoi contribuire.

### Come eseguo i test?

```bash
# Installa dipendenze test (una volta)
npm install

# Esegui test
npm test

# Test con browser visibile
npm run test:headed
```

Vedi [TEST_STRATEGY.md](TEST_STRATEGY.md) per dettagli.

### Posso usare OrarioDoc come base per il mio progetto?

**Sì!** OrarioDoc è rilasciato sotto licenza MIT. Puoi:
- ✅ Usare commercialmente
- ✅ Modificare
- ✅ Distribuire
- ✅ Sublicenziare

Devi solo includere il copyright e la licenza MIT originale.

## 🐛 Problemi e Bug

### L'app non si carica

**Soluzioni:**

1. **Verifica server**:
   ```bash
   # Verifica che Python sia in esecuzione
   ps aux | grep python
   ```

2. **Verifica porta**: Assicurati che porta 8080 sia libera

3. **Controlla browser console**: F12 → Console per errori

4. **Hard refresh**: Ctrl+Shift+R

### Service Worker bloccato

```javascript
// In Console browser (F12)
navigator.serviceWorker.getRegistrations().then(registrations => {
  registrations.forEach(reg => reg.unregister());
});
// Poi ricarica con Ctrl+Shift+R
```

### Dati non vengono salvati

**Verifica:**

1. **IndexedDB abilitato**: DevTools → Application → IndexedDB
2. **Quota storage**: Browser potrebbe aver raggiunto limite
3. **Modalità incognito**: IndexedDB potrebbe essere disabilitato

```javascript
// Test IndexedDB in Console
indexedDB.open('test').onsuccess = () => console.log('✅ IndexedDB OK');
```

### Errori in console

Se vedi errori nella console del browser:

1. **Copia errore completo**
2. **Apri issue** su GitHub con:
   - Messaggio errore
   - Browser e versione
   - Passi per riprodurre
   - Screenshot se possibile

## 📊 Performance

### OrarioDoc è lento

**Ottimizzazioni:**

1. **Hard refresh**: Cancella cache con Ctrl+Shift+R
2. **Disabilita estensioni**: Alcune estensioni rallentano
3. **Audit Lighthouse**: DevTools → Lighthouse per diagnosticare

Target performance:
- First Contentful Paint < 1.8s
- Time to Interactive < 3.8s
- Lighthouse Score >= 90

### Quanto spazio occupa?

OrarioDoc è estremamente leggero:
- **Bundle totale**: ~200KB (gzipped)
- **Dati utente**: Varia, tipicamente < 5MB
- **Cache Service Worker**: ~500KB

## 🔄 Aggiornamenti

### Come aggiorno OrarioDoc?

**Se installato come PWA:**
- Gli aggiornamenti vengono scaricati automaticamente
- Service Worker si aggiorna in background
- Ricarica app per applicare

**Se usi da repository:**
```bash
git pull origin main
# Riavvia server
```

### Come vedo quale versione ho?

Controlla:
1. **Footer app**: Versione mostrata in basso
2. **CHANGELOG.md**: Storico versioni
3. **package.json**: Campo "version"

Versione corrente: **1.0.0**

## 📧 Supporto

### Dove posso chiedere aiuto?

- **Issues GitHub**: [github.com/antoniocorsano-boop/OrarioDoc/issues](https://github.com/antoniocorsano-boop/OrarioDoc/issues)
- **Documentazione**: Consulta file in `/docs`
- **Template Question**: Usa template issue "Question"

### Ho trovato un bug

Apri una [issue](https://github.com/antoniocorsano-boop/OrarioDoc/issues/new) usando template "Bug Report" con:
- Descrizione dettagliata
- Passi per riprodurre
- Browser e OS
- Screenshot
- Errori console

### Ho un'idea per una nuova funzionalità

Apri una [issue](https://github.com/antoniocorsano-boop/OrarioDoc/issues/new) usando template "Feature Request" con:
- Descrizione feature
- Problema che risolve
- Mockup/esempi (se possibile)

---

## 💡 Tips e Tricks

- **Shortcuts tastiera**: Usa Tab per navigare velocemente
- **Temi**: Prova tema Auto per adattamento automatico
- **Offline**: Installa come PWA per usare senza connessione
- **Performance**: Disabilita estensioni browser se lento
- **Backup**: Esporta dati regolarmente dalle Impostazioni

## 📚 Altre Risorse

- [README.md](../README.md) - Overview progetto
- [QUICKSTART.md](QUICKSTART.md) - Guida rapida
- [ARCHITECTURE.md](ARCHITECTURE.md) - Architettura
- [THEMES.md](THEMES.md) - Sistema temi
- [CONTRIBUTING.md](../CONTRIBUTING.md) - Contributi

---

**Non trovi risposta?** Apri una [issue Question](https://github.com/antoniocorsano-boop/OrarioDoc/issues/new) su GitHub!
