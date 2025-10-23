# Pull Request

## 📝 Descrizione

<!-- Fornisci una descrizione chiara e concisa delle modifiche -->

## 🎯 Tipo di modifica

<!-- Seleziona le opzioni appropriate mettendo una 'x' tra le parentesi quadre -->

- [ ] 🐛 Bug fix (modifica non breaking che risolve un issue)
- [ ] ✨ Nuova funzionalità (modifica non breaking che aggiunge funzionalità)
- [ ] 💥 Breaking change (fix o feature che causano modifiche al comportamento esistente)
- [ ] 📚 Documentazione (modifiche alla documentazione)
- [ ] 🎨 Style (formattazione, punto e virgola mancanti, etc; nessuna modifica al codice)
- [ ] ♻️ Refactoring (ristrutturazione codice senza modificare comportamento)
- [ ] ⚡ Performance (miglioramenti performance)
- [ ] ✅ Test (aggiunta o correzione test)
- [ ] 🔧 Chore (modifiche a build, dipendenze, configurazione, etc)
- [ ] ♿ Accessibilità (miglioramenti accessibilità)

## 🔗 Issue collegato

<!-- Se questa PR risolve una issue, linkala qui -->

Closes #(issue number)

## 🧪 Come è stato testato?

<!-- Descrivi i test effettuati per verificare le modifiche -->

- [ ] Test unitari
- [ ] Test di integrazione
- [ ] Test E2E
- [ ] Test manuali
- [ ] Test accessibilità (screen reader, tastiera)

**Ambiente di test:**
- OS: [es. macOS, Windows, Linux]
- Browser: [es. Chrome 120, Firefox 121, Safari 17]
- Dispositivo: [es. Desktop, Mobile]

## 📸 Screenshot (se applicabile)

<!-- Aggiungi screenshot per modifiche UI/UX -->

## ✅ Checklist

<!-- Assicurati di aver completato tutti i punti prima di aprire la PR -->

### Codice

- [ ] Il mio codice segue le linee guida di stile del progetto ([STYLE_GUIDE.md](./docs/STYLE_GUIDE.md))
- [ ] Ho effettuato una self-review del mio codice
- [ ] Ho commentato il codice, specialmente nelle parti complesse
- [ ] Ho aggiornato la documentazione di conseguenza
- [ ] Le mie modifiche non generano nuovi warning
- [ ] Non ci sono errori di console nel browser

### Testing

- [ ] Ho aggiunto test che provano che il mio fix è efficace o che la mia feature funziona
- [ ] I test unitari nuovi ed esistenti passano localmente con le mie modifiche
- [ ] Ho verificato la copertura dei test (`npm test -- --coverage`)
- [ ] Ho testato l'applicazione manualmente

### Accessibilità

- [ ] Ho verificato che le modifiche siano accessibili da tastiera
- [ ] Ho testato con uno screen reader (se applicabile)
- [ ] Ho verificato il contrasto dei colori (se modifiche UI)
- [ ] Ho aggiunto attributi ARIA appropriati (se necessario)
- [ ] Ho eseguito test di accessibilità automatici (jest-axe)

### PWA

- [ ] Il Service Worker funziona correttamente (se modificato)
- [ ] L'app funziona offline (se modifiche rilevanti)
- [ ] Il manifest.json è aggiornato (se necessario)
- [ ] Le icone PWA sono corrette (se modificate)

### Performance

- [ ] Ho verificato che le modifiche non impattino negativamente le performance
- [ ] Ho ottimizzato le immagini (se aggiunte/modificate)
- [ ] Ho implementato code splitting/lazy loading dove appropriato
- [ ] Ho verificato la dimensione del bundle (`npm run build`)

### Sicurezza

- [ ] Non ho committato credenziali, chiavi API o dati sensibili
- [ ] Ho validato e sanitizzato gli input utente (se applicabile)
- [ ] Non ho introdotto vulnerabilità di sicurezza note
- [ ] Ho eseguito controlli di sicurezza (npm audit)

### Git

- [ ] Ho usato commit messages significativi (Conventional Commits)
- [ ] Ho fatto rebase con il branch principale
- [ ] Non ci sono conflitti di merge
- [ ] Ho rimosso commenti di debug e console.log inutili

## 📚 Documentazione aggiornata

<!-- Indica quali documenti hai aggiornato -->

- [ ] README.md
- [ ] ARCHITECTURE.md
- [ ] STYLE_GUIDE.md
- [ ] QUICKSTART.md
- [ ] CONTRIBUTING.md
- [ ] Commenti nel codice
- [ ] Non necessaria

## 🔄 Dipendenze

<!-- Se hai aggiunto/aggiornato dipendenze, elencale qui -->

### Dipendenze aggiunte
- Nessuna

### Dipendenze aggiornate
- Nessuna

### Dipendenze rimosse
- Nessuna

## ⚠️ Note per i reviewer

<!-- Informazioni aggiuntive utili per chi farà il review -->

<!-- 
Esempi:
- Aree specifiche su cui vorresti feedback
- Decisioni di design che richiedono discussione
- Workaround temporanei che necessitano miglioramenti futuri
- Limitazioni note
-->

## 📋 Checklist post-merge

<!-- Azioni da compiere dopo il merge (se applicabile) -->

- [ ] Aggiornare issue collegate
- [ ] Aggiornare documentazione esterna
- [ ] Notificare stakeholder
- [ ] Pianificare deployment
- [ ] Nessuna azione richiesta

## 🎉 Informazioni aggiuntive

<!-- Qualsiasi altra informazione rilevante -->

---

<!-- 
Prima di aprire questa PR, assicurati di aver letto:
- CONTRIBUTING.md per le linee guida di contribuzione
- STYLE_GUIDE.md per le convenzioni di codice
-->

**Grazie per il tuo contributo a OrarioDoc! 🙏**
