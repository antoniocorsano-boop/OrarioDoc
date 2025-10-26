# Test IndexedDB Storage

> **Note:** The dedicated test page `test-indexeddb.html` has been removed as part of code cleanup. 
> The IndexedDB implementation is now tested through the main application and can be verified 
> using browser developer tools.

## Testing IndexedDB in Production App

1. Start a local web server:
   ```bash
   python3 -m http.server 8080
   ```

2. Open the app in your browser:
   ```
   http://localhost:8080/
   ```

3. Open browser Developer Tools (F12) and navigate to:
   - **Application** tab > **IndexedDB** > **OrarioDocDB**
   - Or **Storage** tab > **IndexedDB** (in Firefox)

## Manual Testing

You can test the IndexedDB functionality through the main app:

1. **Add lessons** using the "Aggiungi" button
2. **Verify storage** in DevTools IndexedDB section
3. **Refresh page** to verify persistence
4. **Check migration** from localStorage (if applicable)

## Expected Behavior

- Adding lessons should persist immediately to IndexedDB
- Reading data should be fast (<50ms for typical datasets)
- Migration from localStorage happens automatically on first app load
- UI remains responsive during all storage operations

## Technical Details

- Uses IndexedDB for storage (async operations)
- Automatically migrates data from localStorage on first run
- Uses key: `orariodoc:v1` for data storage
- Database name: `OrarioDocDB`
- Object store: `appData`
