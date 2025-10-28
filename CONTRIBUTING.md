# Contribuire a OrarioDoc

Prima di tutto, grazie per aver considerato di contribuire a OrarioDoc! Sono i contributori come te che rendono OrarioDoc un ottimo strumento per la comunità educativa.

## 📋 Sommario

- [Codice di condotta](#codice-di-condotta)
- [Come posso contribuire?](#come-posso-contribuire)
- [Processo di sviluppo](#processo-di-sviluppo)
- [Linee guida per il codice](#linee-guida-per-il-codice)
- [Processo di Pull Request](#processo-di-pull-request)
- [Segnalazione di bug](#segnalazione-di-bug)
- [Richiesta di nuove funzionalità](#richiesta-di-nuove-funzionalità)

## Codice di condotta

Questo progetto e tutti i partecipanti sono governati da un Codice di Condotta. Partecipando, ti si chiede di rispettare questo codice. Sii rispettoso, inclusivo e professionale in tutte le interazioni.

## Come posso contribuire?

### Consulta la Roadmap

Prima di iniziare, consulta la **[ROADMAP.md](ROADMAP.md)** per vedere i task pianificati e il loro stato. La roadmap organizza lo sviluppo in 11 subtask con priorità definite. Puoi scegliere un task dalla roadmap o proporre nuove funzionalità.

### Utilizza i Template Issue

Per semplificare la creazione di issue, usa i template disponibili:
- **Bug Report** - per segnalare problemi
- **Feature Request** - per proporre nuove funzionalità
- **Roadmap Subtask** - per task della roadmap
- **Documentation** - per miglioramenti alla documentazione
- **Question** - per domande generali

### Segnalazione di bug

I bug vengono tracciati come issue GitHub. Prima di creare una nuova issue:

1. **Controlla le issue esistenti** per vedere se il problema è già stato segnalato
2. **Usa un titolo chiaro e descrittivo** per identificare il problema
3. **Fornisci una descrizione dettagliata** del problema
4. **Includi i passaggi per riprodurre** il comportamento
5. **Descrivi il comportamento atteso** vs quello osservato
6. **Aggiungi screenshot** se pertinenti
7. **Specifica l'ambiente** (browser, OS, versione dell'app)

### Richiesta di nuove funzionalità

Le richieste di funzionalità sono benvenute! Prima di proporre una nuova funzionalità:

1. **Controlla le issue esistenti** per evitare duplicati
2. **Spiega chiaramente il problema** che la funzionalità risolverebbe
3. **Descrivi la soluzione proposta** in dettaglio
4. **Considera alternative** che hai valutato
5. **Valuta l'impatto** su accessibilità e privacy

## Processo di sviluppo

### Setup dell'ambiente

1. Fai un fork del repository
2. Clona il tuo fork localmente:
   ```bash
   git clone https://github.com/TUO-USERNAME/OrarioDoc.git
   cd OrarioDoc
   ```
3. Aggiungi il repository upstream:
   ```bash
   git remote add upstream https://github.com/antoniocorsano-boop/OrarioDoc.git
   ```
4. Installa le dipendenze:
   ```bash
   npm install
   ```

### Workflow di sviluppo

1. **Crea un branch** per la tua modifica:
   ```bash
   git checkout -b feature/nome-funzionalita
   # oppure
   git checkout -b fix/nome-bug
   ```

2. **Fai le tue modifiche** seguendo le linee guida del codice

3. **Testa le modifiche**:
   ```bash
   # Avvia server locale
   python3 -m http.server 8080
   
   # In altra finestra: esegui test
   npm test
   npm run test:unit
   ```

4. **Commit** le modifiche con messaggi chiari:
   ```bash
   git commit -m "feat: aggiungi funzionalità X"
   # oppure
   git commit -m "fix: correggi bug Y"
   ```

5. **Mantieni aggiornato** il tuo branch con upstream:
   ```bash
   git fetch upstream
   git rebase upstream/main
   ```

6. **Push** al tuo fork:
   ```bash
   git push origin feature/nome-funzionalita
   ```

## Linee guida per il codice

### Stile del codice

- Segui le convenzioni definite in [STYLE_GUIDE.md](./docs/STYLE_GUIDE.md)
- Usa ESLint e Prettier (la configurazione è già inclusa)
- Scrivi codice auto-documentante con nomi descrittivi
- Aggiungi commenti solo quando necessario per spiegare il "perché", non il "cosa"

### Accessibilità

- Segui le linee guida WCAG 2.1 (livello AA minimo)
- Usa HTML semantico
- Assicurati che tutti gli elementi interattivi siano accessibili da tastiera
- Fornisci testo alternativo per le immagini
- Mantieni un contrasto di colore adeguato
- Testa con screen reader quando possibile

### Testing

- Scrivi test per ogni nuova funzionalità
- Mantieni la copertura dei test sopra l'80%
- Usa Playwright per test E2E
- Testa l'accessibilità con jest-axe
- Esegui test con: `npm test`, `npm run test:unit`, `npm run test:headed`

### Commit Messages

Usa il formato Conventional Commits:

```
<tipo>(<scope>): <descrizione>

[corpo opzionale]

[footer opzionale]
```

Tipi:
- `feat`: Nuova funzionalità
- `fix`: Correzione di bug
- `docs`: Modifiche alla documentazione
- `style`: Modifiche di formattazione (senza cambiamenti al codice)
- `refactor`: Refactoring del codice
- `test`: Aggiunta o modifica di test
- `chore`: Modifiche ai processi di build, dipendenze, etc.

Esempi:
```
feat(ai): aggiungi suggerimenti intelligenti per l'orario
fix(schedule): correggi visualizzazione ore sovrapposte
docs(readme): aggiorna sezione installazione
```

## Processo di Pull Request

1. **Assicurati** che il codice passi tutti i test e il linting
2. **Aggiorna** la documentazione se necessario
3. **Compila** il template della pull request
4. **Referenzia** le issue correlate
5. **Aspetta** il review del codice
6. **Rispondi** ai commenti di review in modo costruttivo
7. **Aggiorna** il branch con eventuali modifiche richieste

### Criteri di accettazione

Una PR sarà mergiata se:
- ✅ Passa tutti i test automatici
- ✅ Ha una copertura dei test adeguata
- ✅ Segue le linee guida di stile
- ✅ Ha ricevuto almeno un'approvazione da un maintainer
- ✅ La documentazione è aggiornata
- ✅ Non introduce regressioni
- ✅ Rispetta gli standard di accessibilità

## Best Practices

### Codice

- **Piccole modifiche**: Preferisci PR piccole e focalizzate
- **Una cosa alla volta**: Non mescolare refactoring con nuove funzionalità
- **DRY (Don't Repeat Yourself)**: Evita duplicazioni di codice
- **KISS (Keep It Simple, Stupid)**: Preferisci soluzioni semplici
- **YAGNI (You Aren't Gonna Need It)**: Non aggiungere funzionalità non richieste

### Comunicazione

- Sii chiaro e conciso
- Sii rispettoso e costruttivo
- Chiedi aiuto quando necessario
- Condividi le tue conoscenze

## Risorse utili

- [Documentazione OrarioDoc](docs/)
- [Material Design 3](https://m3.material.io/)
- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [Conventional Commits](https://www.conventionalcommits.org/)
- [Progressive Web Apps](https://web.dev/progressive-web-apps/)
- [Playwright Testing](https://playwright.dev/)

## Domande?

Non esitare a:
- Aprire una issue di tipo "question"
- Contattare i maintainer
- Consultare la documentazione esistente

---

**Grazie ancora per il tuo contributo! 🎉**
