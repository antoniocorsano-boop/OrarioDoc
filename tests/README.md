# OrarioDoc Test Suite

> **Comprehensive testing infrastructure for OrarioDoc application**

## 📋 Overview

This directory contains the complete test suite for OrarioDoc, including:
- **Unit Tests** - Testing individual functions and modules
- **Integration Tests** - Testing component interactions and workflows
- **E2E Tests** - Full user journey testing with Playwright

## 📁 Files

### Test Files

- **`test-runner.html`** - Browser-based test runner with visual interface
- **`unit-tests.js`** - 33 unit tests for core functionality
- **`integration-tests.js`** - 16 integration tests for workflows

### Related Files

- **`../playwright-tests/test-runner.spec.js`** - Playwright E2E test
- **`../docs/TEST_STRATEGY.md`** - Complete testing strategy
- **`../docs/TEST_EXECUTION.md`** - Detailed execution guide

## 🚀 Quick Start

### Run Manual Tests

```bash
# 1. Start local server
python3 -m http.server 8080

# 2. Open in browser
# http://localhost:8080/tests/test-runner.html

# 3. Click "Run Tests" button
```

### Run E2E Tests

```bash
# Install dependencies
npm install

# Run tests
npm test

# Run with UI
npm run test:headed

# Debug tests
npm run test:debug
```

### Validate Test Structure

```bash
npm run test:validate
```

## 📊 Test Coverage

### Unit Tests (33 tests)

**Validation Logic**
- ✅ Empty name validation
- ✅ Invalid day range validation
- ✅ Invalid time format validation
- ✅ Invalid duration validation
- ✅ Valid lesson validation

**Time Utilities**
- ✅ Time to minutes conversion

**Conflict Detection**
- ✅ Simple overlap detection
- ✅ No conflict on different days
- ✅ No conflict for adjacent lessons
- ✅ Exclude lesson being edited

**Storage Layer**
- ✅ localStorage availability
- ✅ Read/write operations
- ✅ IndexedDB availability
- ✅ Default data structure

**Schedule Grid**
- ✅ Grid creation (7 columns)
- ✅ Day data attributes
- ✅ Keyboard accessibility

**Theme Manager**
- ✅ Document element access
- ✅ Theme attribute setting
- ✅ localStorage persistence
- ✅ System preference detection

**Toast Notifications**
- ✅ Container creation
- ✅ Accessibility attributes
- ✅ HTML escaping (XSS prevention)

**Settings**
- ✅ Structure validation
- ✅ Settings merge

**Accessibility**
- ✅ Skip links
- ✅ Keyboard accessibility
- ✅ Form labels

**Performance**
- ✅ Rendering performance
- ✅ Storage operation performance

**Utilities**
- ✅ UID generation
- ✅ Document fragment batching

### Integration Tests (16 tests)

**Lesson Management Workflows**
- ✅ Complete add lesson workflow
- ✅ Add multiple lessons
- ✅ Edit lesson workflow
- ✅ Delete lesson workflow

**Conflict Detection Workflows**
- ✅ Detect overlapping lessons
- ✅ Allow non-overlapping lessons

**Theme Switching Workflows**
- ✅ Theme persistence
- ✅ Custom colors persistence

**Storage Persistence Workflows**
- ✅ Multiple operations persistence
- ✅ Settings and lessons coexistence

**Validation Workflows**
- ✅ Invalid lesson rejection
- ✅ Valid lesson acceptance

**Rendering Workflows**
- ✅ Lessons render in grid

**Accessibility Workflows**
- ✅ Focus management
- ✅ Keyboard navigation

**Performance Workflows**
- ✅ Large dataset handling (100 lessons)

### E2E Tests (Playwright)

- ✅ Browser environment validation
- ✅ All test-runner tests execution
- ✅ Screenshot on failure
- ✅ Results reporting

## 🎯 Test Execution

### Browser Tests

The `test-runner.html` provides a visual interface for running tests:

1. **Stats Display**: Shows total, passed, failed, skipped counts
2. **Progress Bar**: Visual progress indicator
3. **Test Results**: Individual test results with pass/fail status
4. **Error Details**: Detailed error messages for failed tests

### Console Output

Tests also output to browser console:
```javascript
console.log('Test Results:', {
  total: 49,
  passed: 49,
  failed: 0,
  skipped: 0
});
```

## 🔍 Test Categories

### By Module

```
[Validation]  - Input validation tests
[Time]        - Time utilities tests
[Conflicts]   - Conflict detection tests
[Storage]     - Storage layer tests
[Grid]        - Schedule grid tests
[Theme]       - Theme manager tests
[Toast]       - Toast notifications tests
[Settings]    - Settings tests
[A11y]        - Accessibility tests
[Performance] - Performance tests
[Utility]     - Utility functions tests
[Integration] - Integration workflow tests
```

## 🐛 Debugging

### Failed Tests

When a test fails, check:

1. **Error Message** - Specific assertion that failed
2. **Browser Console** - JavaScript errors
3. **Network Tab** - Failed requests
4. **Test Code** - Review test expectations

### Common Issues

**Test times out**
```javascript
// Increase timeout if needed
test.setTimeout(60000);
```

**Element not found**
```javascript
// Add wait conditions
await page.waitForSelector('#element', { timeout: 30000 });
```

**Flaky tests**
```javascript
// Add stability waits
await page.waitForLoadState('networkidle');
```

## 📝 Writing New Tests

### Unit Test Template

```javascript
runner.test('[Module] Description of what is tested', () => {
  // Arrange - Setup test data
  const input = 'test data';
  
  // Act - Execute the code
  const result = functionUnderTest(input);
  
  // Assert - Verify results
  assertEqual(result, expectedValue, 'Should return expected value');
});
```

### Integration Test Template

```javascript
runner.test('[Integration] Workflow name', async () => {
  const mockStorage = createMockStorage();
  
  // 1. Setup initial state
  let data = await mockStorage.read();
  
  // 2. Perform actions
  data.lessons.push(newLesson);
  await mockStorage.write(data);
  
  // 3. Verify results
  data = await mockStorage.read();
  assertEqual(data.lessons.length, 1, 'Should have one lesson');
});
```

## 📚 Documentation

For more detailed information, see:

- **[TEST_STRATEGY.md](../docs/TEST_STRATEGY.md)** - Overall testing strategy and standards
- **[TEST_EXECUTION.md](../docs/TEST_EXECUTION.md)** - Detailed execution and troubleshooting guide
- **[CONTRIBUTING.md](../CONTRIBUTING.md)** - Contributing guidelines

## 🎓 Best Practices

1. **Keep tests independent** - Each test should work in isolation
2. **Clean up after tests** - Remove DOM elements, clear storage
3. **Use descriptive names** - Test names should explain what is tested
4. **Test edge cases** - Not just happy paths
5. **Mock external dependencies** - Use mock storage, not real DB
6. **Performance matters** - Tests should run quickly (<100ms each)
7. **Accessibility first** - Always test ARIA labels and keyboard nav

## 🔄 Continuous Integration

Tests run automatically on:
- Push to main/develop branches
- Pull requests
- Manual workflow dispatch

See `.github/workflows/test.yml` for CI configuration.

## 📊 Test Results

Test results are stored in:
- `test-results/` - Playwright results and screenshots
- `playwright-report/` - HTML report
- `test-results.json` - JSON summary

## 🆘 Getting Help

If you encounter issues:

1. Check [TEST_EXECUTION.md](../docs/TEST_EXECUTION.md) troubleshooting section
2. Review test error messages carefully
3. Open an issue with test name and error details
4. Include browser/environment information

## 📈 Coverage Goals

- **Overall**: ≥ 80%
- **Storage Layer**: ≥ 95%
- **Main Logic**: ≥ 90%
- **Schedule Grid**: ≥ 85%
- **Theme Manager**: ≥ 80%
- **UI Components**: ≥ 75%

---

**Maintainer:** @antoniocorsano-boop  
**Last Updated:** October 2025  
**Version:** 1.0
