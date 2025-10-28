# OrarioDoc Tests

This directory contains the automated test suite for OrarioDoc.

## Overview

Since OrarioDoc is a vanilla JavaScript PWA without Node.js dependencies, the tests are designed to run directly in the browser using a custom lightweight test framework.

## Test Structure

```
tests/
├── test-framework.js    # Custom test framework (no dependencies)
├── test-runner.html     # Browser-based test runner UI
├── storage.test.js      # Storage module tests
├── theme.test.js        # Theme manager tests
├── toast.test.js        # Toast notification tests
└── README.md           # This file
```

## Running Tests

### Method 1: Using Test Runner (Recommended)

1. Start a local web server from the project root:
   ```bash
   python3 -m http.server 8080
   ```

2. Open the test runner in your browser:
   ```
   http://localhost:8080/tests/test-runner.html
   ```

3. Click "Run Tests" to execute all tests

4. View results in the UI

### Method 2: Browser Console

1. Open the test runner HTML page
2. Open browser DevTools (F12)
3. View test output in the Console tab

## Test Coverage

### Storage Tests (`storage.test.js`)
- ✅ localStorage read/write operations
- ✅ Data structure validation
- ✅ Edge cases (empty data, special characters, large datasets)
- ✅ Storage capacity checks
- ✅ Error handling

### Theme Manager Tests (`theme.test.js`)
- ✅ Theme initialization
- ✅ Theme switching (light, dark, expressive, auto)
- ✅ Theme persistence in localStorage
- ✅ DOM updates (data attributes)
- ✅ Custom color management
- ✅ Event dispatching
- ✅ System preference detection
- ✅ Error handling

### Toast Tests (`toast.test.js`)
- ✅ Toast creation and display
- ✅ Toast types (info, success, error, warning)
- ✅ Accessibility attributes (ARIA)
- ✅ HTML escaping (XSS prevention)
- ✅ Auto-dismiss functionality
- ✅ Multiple toasts support
- ✅ Edge cases

## Test Framework

The custom test framework provides:

### API

```javascript
// Define a test suite
describe('Module Name', () => {
  // Setup before each test
  beforeEach(() => {
    // Clean up or initialize
  });
  
  // Teardown after each test
  afterEach(() => {
    // Clean up
  });
  
  // Define a test
  test('should do something', () => {
    expect(actual).toBe(expected);
  });
  
  // Skip a test
  skip('should skip this', () => {
    // Won't run
  });
});
```

### Assertions

```javascript
expect(value).toBe(expected)           // Strict equality (===)
expect(value).toEqual(expected)        // Deep equality (JSON)
expect(value).toBeTruthy()             // Truthy check
expect(value).toBeFalsy()              // Falsy check
expect(value).toBeNull()               // Null check
expect(value).toBeUndefined()          // Undefined check
expect(value).toBeDefined()            // Not undefined
expect(array).toContain(item)          // Array/string contains
expect(value).toHaveLength(n)          // Length check
expect(fn).toThrow()                   // Function throws error
expect(value).toBeGreaterThan(n)       // Numeric comparison
expect(value).toBeLessThan(n)          // Numeric comparison
expect(string).toMatch(regex)          // Regex match
```

### Async Support

```javascript
test('async test', async () => {
  const result = await someAsyncFunction();
  expect(result).toBe(expected);
});
```

## Writing New Tests

### 1. Create a new test file

```javascript
// tests/mymodule.test.js
describe('My Module', () => {
  test('should work correctly', () => {
    const result = myFunction();
    expect(result).toBe(expected);
  });
});
```

### 2. Add to test-runner.html

```html
<!-- In test-runner.html, add: -->
<script src="./mymodule.test.js"></script>
```

### 3. Run tests

Open test-runner.html in browser and verify new tests appear.

## Best Practices

### Test Organization
- Group related tests in `describe` blocks
- Use descriptive test names
- One assertion per test (when possible)
- Test both success and failure cases

### Setup and Teardown
- Use `beforeEach` to reset state
- Use `afterEach` to clean up (DOM, storage, etc.)
- Keep tests independent

### Assertions
- Use specific matchers (e.g., `toEqual` vs `toBe`)
- Add meaningful error messages
- Test edge cases

### Example Test Structure

```javascript
describe('Feature Name', () => {
  beforeEach(() => {
    // Setup: clear storage, reset DOM, etc.
    localStorage.clear();
  });
  
  afterEach(() => {
    // Cleanup: remove elements, restore mocks, etc.
  });
  
  describe('Sub-feature', () => {
    test('should handle normal case', () => {
      const result = doSomething('normal');
      expect(result).toBe('expected');
    });
    
    test('should handle edge case', () => {
      const result = doSomething('');
      expect(result).toBe('default');
    });
    
    test('should handle errors gracefully', () => {
      expect(() => doSomething(null)).toThrow();
    });
  });
});
```

## CI/CD Integration

Tests can be run automatically in CI/CD pipelines using headless browsers:

### Using Playwright (example)

```yaml
# .github/workflows/test.yml
name: Tests
on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Start server
        run: python3 -m http.server 8080 &
      - name: Install Playwright
        run: npm install -D @playwright/test
      - name: Run tests
        run: npx playwright test
```

### Using Puppeteer (example)

```javascript
// tests/run-headless.js
const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  
  // Listen to console
  page.on('console', msg => console.log(msg.text()));
  
  // Navigate to test runner
  await page.goto('http://localhost:8080/tests/test-runner.html');
  
  // Wait for tests to complete
  await page.waitForSelector('.status.success, .status.failed');
  
  // Get results
  const stats = await page.evaluate(() => {
    return {
      total: parseInt(document.getElementById('stat-total').textContent),
      passed: parseInt(document.getElementById('stat-passed').textContent),
      failed: parseInt(document.getElementById('stat-failed').textContent)
    };
  });
  
  console.log('Test Results:', stats);
  
  await browser.close();
  
  // Exit with error if tests failed
  process.exit(stats.failed > 0 ? 1 : 0);
})();
```

## Debugging Tests

### Browser DevTools
1. Open test-runner.html
2. Open DevTools (F12)
3. Set breakpoints in test files
4. Click "Run Tests"

### Console Output
- All test output appears in browser console
- Failed tests show error messages and stack traces
- Use `console.log()` for debugging

### Isolating Tests
Skip tests you're not working on:

```javascript
// Change test() to skip()
skip('not working on this', () => {
  // Won't run
});
```

## Known Limitations

1. **No module bundling**: Tests load files directly, require manual script tags
2. **No code coverage**: Coverage reporting would require additional tooling
3. **Manual browser testing**: Requires opening browser (can be automated with Playwright/Puppeteer)
4. **IndexedDB testing**: Some IndexedDB operations may have timing issues in tests

## Future Improvements

- [ ] Add E2E tests with Playwright
- [ ] Add visual regression testing
- [ ] Implement code coverage reporting
- [ ] Add performance benchmarks
- [ ] Create GitHub Actions workflow
- [ ] Add more utility function tests

## Troubleshooting

### Tests not loading
- Check that server is running on correct port
- Verify all script paths in test-runner.html
- Check browser console for errors

### Tests failing unexpectedly
- Clear browser cache and localStorage
- Check for asynchronous timing issues
- Verify DOM cleanup in afterEach hooks

### Browser compatibility
Tests are verified to work on:
- ✅ Chrome/Chromium 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+

## Contributing

When adding new features:
1. Write tests first (TDD)
2. Ensure all tests pass
3. Add tests to appropriate test file
4. Update this README if needed

## Resources

- [MDN Web APIs](https://developer.mozilla.org/en-US/docs/Web/API)
- [Jest Documentation](https://jestjs.io/) (for API reference, similar syntax)
- [Testing Best Practices](https://testingjavascript.com/)

---

**Last Updated:** Ottobre 2025  
**Maintainer:** OrarioDoc Team
