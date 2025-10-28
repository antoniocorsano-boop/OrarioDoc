# Data Persistence Pattern

## Overview

OrarioDoc implementa un sistema di persistenza dati robusto e progressivo che utilizza **IndexedDB** come storage primario con fallback automatico a **localStorage**. Questo approccio garantisce la massima compatibilità browser mantenendo le migliori performance.

## Architettura

```
┌──────────────────────────────────────────────────┐
│              Application Layer                    │
│         (main.js, schedule-grid.js)              │
└───────────────────┬──────────────────────────────┘
                    │
                    ▼
┌──────────────────────────────────────────────────┐
│           Storage Abstraction Layer               │
│              (storage.js)                         │
│  ┌────────────────────────────────────────────┐  │
│  │  Async API: read() / write()              │  │
│  └───────────┬──────────────────┬─────────────┘  │
│              │                  │                 │
│         IndexedDB         localStorage            │
│         (preferred)        (fallback)             │
└──────────────────────────────────────────────────┘
```

## File e Responsabilità

### 1. `/src/storage.js` - Abstraction Layer

Il modulo principale che fornisce un'API unificata per leggere e scrivere dati.

**Responsabilità:**
- Fornire API asincrona semplice (`read()`, `write()`)
- Gestire automaticamente il fallback da IndexedDB a localStorage
- Garantire struttura dati consistente
- Gestione errori robusta

**Export:**
```javascript
const Storage = {
  read: async () => Promise<Data>,
  write: async (data) => Promise<void>
}
```

### 2. `/src/storage/indexeddb.js` - IndexedDB Implementation

Implementazione completa di IndexedDB con migrazione automatica da localStorage.

**Responsabilità:**
- Inizializzazione database IndexedDB
- Migrazione dati da localStorage (una sola volta)
- Operazioni CRUD asincrone
- Gestione versioning database

**Export:**
```javascript
window.IndexedDBStorage = {
  read: async () => Promise<Data>,
  write: async (data) => Promise<void>,
  initDB: async () => Promise<IDBDatabase>,
  migrateFromLocalStorage: async () => Promise<void>
}
```

## Struttura Dati

### Schema Dati Principale

```javascript
{
  lessons: [
    {
      id: string,           // ID univoco (es: 'id-abc123')
      name: string,         // Nome lezione (es: 'Matematica')
      class: string,        // Classe (opzionale, es: '3A')
      day: number,          // Giorno 0-6 (0=Dom, 1=Lun, ..., 6=Sab)
      start: string,        // Ora inizio formato 'HH:MM' (es: '08:00')
      duration: number      // Durata in minuti (es: 60)
    }
  ],
  settings: {
    theme: string,          // 'light', 'dark', 'expressive', 'auto'
    userName: string,
    userEmail: string,
    userSubjects: string,
    schoolName: string,
    schoolAddress: string,
    schoolStartTime: string,
    schoolEndTime: string,
    schoolLessonDuration: number,
    schoolBreakDuration: number,
    schoolDays: string
  }
}
```

### Storage Key

- **LocalStorage Key**: `'orariodoc:v1'`
- **IndexedDB Database**: `'OrarioDocDB'`
- **IndexedDB Store**: `'appData'`
- **IndexedDB Data Key**: `'orariodoc:v1'`
- **Migration Flag Key**: `'migrated_from_localStorage'`

## API Usage

### Lettura Dati

```javascript
// Async/await (consigliato)
const data = await Storage.read();
console.log(data.lessons); // Array di lezioni
console.log(data.settings); // Oggetto impostazioni

// Promise
Storage.read().then(data => {
  console.log(data);
}).catch(error => {
  console.error('Errore lettura:', error);
});
```

**Default Return Value:**
Se non ci sono dati salvati, ritorna:
```javascript
{
  lessons: [],
  settings: {}
}
```

### Scrittura Dati

```javascript
// Async/await (consigliato)
const data = await Storage.read();
data.lessons.push({
  id: 'new-id',
  name: 'Fisica',
  day: 1,
  start: '09:00',
  duration: 60
});
await Storage.write(data);

// Promise
Storage.read()
  .then(data => {
    data.settings.theme = 'dark';
    return Storage.write(data);
  })
  .then(() => {
    console.log('Salvato!');
  });
```

## IndexedDB Implementation

### Database Schema

```javascript
Database: OrarioDocDB
Version: 1
Object Store: appData
  - Key: 'orariodoc:v1' → { lessons: [], settings: {} }
  - Key: 'migrated_from_localStorage' → true/false
```

### Inizializzazione

L'inizializzazione avviene automaticamente alla prima chiamata di `read()` o `write()`:

```javascript
// Automatica
const data = await Storage.read(); // Inizializza se necessario

// Manuale (non necessaria normalmente)
await window.IndexedDBStorage.initDB();
```

### Migrazione da localStorage

La migrazione avviene **automaticamente** e **una sola volta**:

1. Al primo accesso, verifica se esiste il flag di migrazione
2. Se non esiste e ci sono dati in localStorage:
   - Legge i dati da localStorage
   - Li scrive in IndexedDB
   - Imposta il flag di migrazione
3. Nelle chiamate successive, salta la migrazione

**Esempio Scenario:**

```javascript
// Utente con dati vecchi in localStorage
localStorage.setItem('orariodoc:v1', JSON.stringify({
  lessons: [{ id: '1', name: 'Math', day: 1, start: '08:00', duration: 60 }],
  settings: {}
}));

// Prima chiamata dopo aggiornamento app
const data = await Storage.read();
// → Migrazione automatica da localStorage a IndexedDB
// → Ritorna i dati migrati

// Chiamate successive
const data2 = await Storage.read();
// → Legge direttamente da IndexedDB (migrazione già fatta)
```

## Fallback Strategy

### Decision Flow

```
┌─────────────────────────────────────────┐
│   Storage.read() / Storage.write()      │
└──────────────────┬──────────────────────┘
                   │
                   ▼
         ┌─────────────────────┐
         │ IndexedDB available?│
         └──────┬─────────┬────┘
                │         │
              YES        NO
                │         │
                ▼         ▼
    ┌─────────────────┐ ┌─────────────────┐
    │ Try IndexedDB   │ │ Use localStorage│
    └────┬────────────┘ └─────────────────┘
         │
    ┌────▼─────┐
    │ Success? │
    └─┬────┬───┘
      │    │
     YES  NO
      │    │
      │    ▼
      │  ┌─────────────────┐
      │  │ Use localStorage│
      │  │   (fallback)    │
      │  └─────────────────┘
      │
      ▼
   ┌─────────┐
   │ Return  │
   └─────────┘
```

### Error Handling

Tutti gli errori sono gestiti con graceful degradation:

```javascript
// IndexedDB fallisce → localStorage
try {
  return await window.IndexedDBStorage.read();
} catch(e) {
  console.error('IndexedDB read error, falling back:', e);
  return readFromLocalStorage();
}

// localStorage fallisce → Default data
try {
  const raw = localStorage.getItem(KEY);
  return raw ? JSON.parse(raw) : { lessons: [], settings: {} };
} catch(e) {
  console.error('localStorage read error:', e);
  return { lessons: [], settings: {} };
}
```

## Best Practices

### 1. Sempre Leggere Prima di Scrivere

```javascript
// ✅ CORRETTO
const data = await Storage.read();
data.lessons.push(newLesson);
await Storage.write(data);

// ❌ SBAGLIATO (sovrascrive tutti i dati)
await Storage.write({ lessons: [newLesson] });
```

### 2. Minimizzare le Scritture

```javascript
// ✅ CORRETTO (batch write)
const data = await Storage.read();
data.lessons.push(lesson1);
data.lessons.push(lesson2);
data.lessons.push(lesson3);
await Storage.write(data);

// ❌ INEFFICIENTE (3 scritture)
const data = await Storage.read();
data.lessons.push(lesson1);
await Storage.write(data);
data.lessons.push(lesson2);
await Storage.write(data);
data.lessons.push(lesson3);
await Storage.write(data);
```

### 3. Gestire Errori Appropriatamente

```javascript
// ✅ CORRETTO
try {
  const data = await Storage.read();
  // ... operazioni ...
  await Storage.write(data);
} catch (error) {
  console.error('Storage error:', error);
  // Mostra messaggio utente
  showErrorToast('Errore nel salvataggio dei dati');
}
```

### 4. Non Fare Assunzioni sui Dati

```javascript
// ✅ CORRETTO
const data = await Storage.read();
const lessons = data.lessons || [];
const settings = data.settings || {};

// ❌ RISCHIOSO
const data = await Storage.read();
const firstLesson = data.lessons[0]; // Potrebbe essere undefined
```

## Performance Considerations

### IndexedDB Advantages

- **Asincrono**: Non blocca il main thread
- **Maggiore Capacità**: ~50MB vs ~5-10MB di localStorage
- **Indexed Queries**: Query più efficienti (non usato attualmente ma disponibile)
- **Migliore per Dati Strutturati**: Supporta oggetti JavaScript nativi

### localStorage Advantages

- **Sincrono**: Più semplice per operazioni veloci
- **Ampio Supporto**: Funziona su tutti i browser moderni
- **Debugging Facile**: Visibile in DevTools

### Ottimizzazioni Implementate

1. **Lazy Initialization**: IndexedDB si inizializza solo quando necessario
2. **Single Instance**: Una sola connessione DB riutilizzata
3. **Migrazione Una Tantum**: Flag impedisce rimigrazioni inutili
4. **Graceful Degradation**: Fallback automatico senza interruzioni

## Testing

### Test Coverage

File: `/playwright-tests/persistence-interactive.spec.js`

- ✅ Persistenza singola lezione
- ✅ Persistenza lezioni multiple
- ✅ Ripristino dati dopo reload
- ✅ Migrazione da localStorage
- ✅ Update lezioni esistenti
- ✅ Cancellazione lezioni
- ✅ Fallback a localStorage
- ✅ Gestione errori

### Testing Manuale

#### Test 1: Persistenza Base

```javascript
// Console del browser
const data = await Storage.read();
data.lessons.push({ 
  id: 'test', 
  name: 'Test', 
  day: 1, 
  start: '08:00', 
  duration: 60 
});
await Storage.write(data);

// Ricarica pagina
// Verifica:
const data2 = await Storage.read();
console.log(data2.lessons); // Dovrebbe contenere 'Test'
```

#### Test 2: Migrazione

```javascript
// 1. Cancella IndexedDB
indexedDB.deleteDatabase('OrarioDocDB');

// 2. Aggiungi dati a localStorage
localStorage.setItem('orariodoc:v1', JSON.stringify({
  lessons: [{ id: '1', name: 'Old', day: 1, start: '08:00', duration: 60 }],
  settings: {}
}));

// 3. Ricarica pagina

// 4. Verifica migrazione
const data = await Storage.read();
console.log(data.lessons); // Dovrebbe contenere 'Old'

// 5. Verifica flag migrazione
const db = await window.IndexedDBStorage.initDB();
// Controlla presenza del flag in IndexedDB
```

#### Test 3: Fallback

```javascript
// Simula errore IndexedDB
window.indexedDB = null;

// Verifica funzionamento con localStorage
const data = await Storage.read();
data.lessons.push({ id: 'test', name: 'Test', day: 1, start: '08:00', duration: 60 });
await Storage.write(data);

// Verifica in localStorage
const stored = JSON.parse(localStorage.getItem('orariodoc:v1'));
console.log(stored.lessons); // Dovrebbe contenere 'Test'
```

## Browser Compatibility

| Browser | IndexedDB | localStorage | Status |
|---------|-----------|--------------|--------|
| Chrome 24+ | ✅ | ✅ | Fully supported |
| Firefox 16+ | ✅ | ✅ | Fully supported |
| Safari 10+ | ✅ | ✅ | Fully supported |
| Edge 12+ | ✅ | ✅ | Fully supported |
| Opera 15+ | ✅ | ✅ | Fully supported |
| iOS Safari 10+ | ✅ | ✅ | Fully supported |
| Chrome Android | ✅ | ✅ | Fully supported |

**Note:**
- In modalità privata/incognito, IndexedDB potrebbe non essere disponibile → fallback a localStorage
- Safari ha limiti più stringenti su storage in iframe → applicazione deve essere top-level

## Troubleshooting

### Problema: Dati non persistono dopo reload

**Diagnosi:**
```javascript
// Verifica se IndexedDB è disponibile
console.log('IndexedDB:', typeof window.indexedDB);
console.log('Storage exists:', typeof Storage !== 'undefined');

// Verifica dati salvati
const data = await Storage.read();
console.log('Current data:', data);
```

**Soluzioni:**
1. Verifica che non sia in modalità privata
2. Controlla spazio disponibile (quota exceeded)
3. Verifica console per errori
4. Prova a cancellare cache e ricaricare

### Problema: Migrazione non funziona

**Diagnosi:**
```javascript
// Verifica presenza dati localStorage
const localData = localStorage.getItem('orariodoc:v1');
console.log('LocalStorage data:', localData);

// Verifica flag migrazione in IndexedDB
const db = await window.IndexedDBStorage.initDB();
// Ispeziona IndexedDB in DevTools → Application → IndexedDB
```

**Soluzioni:**
1. Cancella IndexedDB e riprova
2. Verifica formato dati in localStorage (deve essere JSON valido)
3. Controlla console per errori durante migrazione

### Problema: Quota exceeded

**Soluzioni:**
1. Elimina dati vecchi/non necessari
2. Implementa pulizia automatica dati obsoleti
3. Considera compressione dati per grandi dataset

## Security Considerations

### Dati Sensibili

⚠️ **IMPORTANTE**: Sia localStorage che IndexedDB NON sono crittografati di default.

**Best Practices:**
- Non salvare password in chiaro
- Non salvare token di autenticazione sensibili
- Considera crittografia client-side per dati molto sensibili

### XSS Protection

Il modulo storage è protetto da XSS grazie a:
1. Uso di `JSON.parse/stringify` (safe)
2. Validazione struttura dati
3. No eval o innerHTML nel codice storage

### Privacy

- Tutti i dati rimangono sul device dell'utente
- Nessun invio automatico a server esterni
- Conformità GDPR per default (data stays local)

## Future Enhancements

Possibili miglioramenti futuri:

- [ ] Versioning schema dati per migrazioni
- [ ] Compressione automatica per grandi dataset
- [ ] Sync multi-device (opzionale, con consenso utente)
- [ ] Export/import dati (backup)
- [ ] Crittografia opzionale dati sensibili
- [ ] Cache in-memory per operazioni frequenti
- [ ] Undo/redo con history tracking

## References

- [IndexedDB API - MDN](https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API)
- [Using IndexedDB - MDN](https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API/Using_IndexedDB)
- [Web Storage API - MDN](https://developer.mozilla.org/en-US/docs/Web/API/Web_Storage_API)
- [Storage for the Web](https://web.dev/storage-for-the-web/)
- [Working with quota on mobile browsers](https://web.dev/storage-for-the-web/#how-much)
