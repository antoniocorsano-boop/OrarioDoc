# Test IndexedDB Storage

Test page to verify IndexedDB implementation for OrarioDoc.

## Usage

1. Start a local web server:
   ```bash
   python3 -m http.server 8080
   ```

2. Open the test page in your browser:
   ```
   http://localhost:8080/test-indexeddb.html
   ```

## Tests Available

- **Test Scrittura (1000 record)**: Tests writing 1000 lesson records to IndexedDB
- **Test Lettura**: Tests reading data from IndexedDB
- **Test Migrazione da localStorage**: Tests automatic migration from localStorage to IndexedDB
- **Pulisci Dati**: Clears all data from both IndexedDB and localStorage
- **Pulisci Log**: Clears the test log display

## UI Responsiveness Indicator

The green circle in the top-right corner indicates UI responsiveness:
- **Green (pulsing)**: UI is responsive
- **Red (static)**: UI is frozen/blocked

This helps verify that the asynchronous operations don't block the user interface.

## Expected Results

- Writing 1000 records should complete in <100ms without blocking UI
- Reading 1000 records should complete in <50ms
- Migration from localStorage should work seamlessly
- UI indicator should remain green throughout all operations

## Technical Details

- Uses IndexedDB for storage (async operations)
- Automatically migrates data from localStorage on first run
- Uses key: `orariodoc:v1` for data storage
- Database name: `OrarioDocDB`
- Object store: `appData`
