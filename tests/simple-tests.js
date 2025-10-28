/**
 * Streamlined Tests for OrarioDoc
 * Fast, efficient, essential - tests only critical functionality
 */

// Simple test framework - minimal and fast
const SimpleTest = {
  tests: [],
  passed: 0,
  failed: 0,
  
  test(name, fn) {
    this.tests.push({ name, fn });
  },
  
  async run() {
    console.log('🧪 Running tests...\n');
    this.passed = 0;
    this.failed = 0;
    
    for (const test of this.tests) {
      try {
        await test.fn();
        this.passed++;
        console.log(`✓ ${test.name}`);
      } catch (error) {
        this.failed++;
        console.error(`✗ ${test.name}`);
        console.error(`  ${error.message}`);
      }
    }
    
    console.log(`\n${this.passed} passed, ${this.failed} failed`);
    return { passed: this.passed, failed: this.failed, total: this.tests.length };
  }
};

// Simple assertions
function assert(condition, message) {
  if (!condition) throw new Error(message || 'Assertion failed');
}

function assertEqual(actual, expected, message) {
  if (actual !== expected) {
    throw new Error(message || `Expected ${expected}, got ${actual}`);
  }
}

// =============================================================================
// STORAGE TESTS - Essential functionality only
// =============================================================================

SimpleTest.test('localStorage can store and retrieve data', () => {
  localStorage.clear();
  const data = { test: 'value' };
  localStorage.setItem('test-key', JSON.stringify(data));
  const retrieved = JSON.parse(localStorage.getItem('test-key'));
  assertEqual(retrieved.test, 'value');
  localStorage.clear();
});

SimpleTest.test('localStorage handles empty state', () => {
  localStorage.clear();
  const retrieved = localStorage.getItem('non-existent');
  assert(retrieved === null, 'Should return null for non-existent key');
});

SimpleTest.test('localStorage handles JSON errors', () => {
  localStorage.clear();
  localStorage.setItem('bad-json', 'not valid json{');
  try {
    JSON.parse(localStorage.getItem('bad-json'));
    throw new Error('Should have thrown');
  } catch (e) {
    assert(e instanceof SyntaxError, 'Should throw SyntaxError');
  }
  localStorage.clear();
});

// =============================================================================
// THEME TESTS - Essential functionality only
// =============================================================================

SimpleTest.test('ThemeManager exists and has required methods', () => {
  assert(typeof ThemeManager !== 'undefined', 'ThemeManager should exist');
  assert(typeof ThemeManager.setTheme === 'function', 'setTheme should exist');
  assert(typeof ThemeManager.getCurrentTheme === 'function', 'getCurrentTheme should exist');
});

SimpleTest.test('ThemeManager can set light theme', () => {
  localStorage.clear();
  ThemeManager.setTheme('light');
  const theme = ThemeManager.getCurrentTheme();
  assertEqual(theme, 'light', 'Theme should be light');
  localStorage.clear();
});

SimpleTest.test('ThemeManager can set dark theme', () => {
  localStorage.clear();
  ThemeManager.setTheme('dark');
  const theme = ThemeManager.getCurrentTheme();
  assertEqual(theme, 'dark', 'Theme should be dark');
  localStorage.clear();
});

SimpleTest.test('ThemeManager persists theme choice', () => {
  localStorage.clear();
  ThemeManager.setTheme('expressive');
  const saved = localStorage.getItem('orariodoc:theme');
  assertEqual(saved, 'expressive', 'Theme should be saved to localStorage');
  localStorage.clear();
});

// =============================================================================
// TOAST TESTS - Essential functionality only
// =============================================================================

SimpleTest.test('Toast can create notification', () => {
  // Clean up any existing toasts
  const existing = document.getElementById('toast-container');
  if (existing) existing.remove();
  
  Toast.showToast('Test message');
  
  const container = document.getElementById('toast-container');
  assert(container !== null, 'Toast container should be created');
  
  // Clean up
  if (container) container.remove();
});

SimpleTest.test('Toast creates correct type classes', () => {
  const existing = document.getElementById('toast-container');
  if (existing) existing.remove();
  
  Toast.showToast('Success', 'success');
  
  const toast = document.querySelector('.toast--success');
  assert(toast !== null, 'Toast should have success class');
  
  // Clean up
  const container = document.getElementById('toast-container');
  if (container) container.remove();
});

SimpleTest.test('Toast has accessibility attributes', () => {
  const existing = document.getElementById('toast-container');
  if (existing) existing.remove();
  
  Toast.showToast('Test');
  
  const container = document.getElementById('toast-container');
  assert(container !== null, 'Toast container should exist');
  
  const ariaLive = container.getAttribute('aria-live');
  assertEqual(ariaLive, 'polite', 'Should have aria-live="polite"');
  
  // Clean up
  if (container) container.remove();
});

// =============================================================================
// INTEGRATION TESTS - Key workflows
// =============================================================================

SimpleTest.test('Complete workflow: save data, reload, retrieve', () => {
  localStorage.clear();
  
  // Save data
  const testData = { lessons: [{ id: 1, name: 'Math' }], settings: { theme: 'dark' } };
  localStorage.setItem('orariodoc:v1', JSON.stringify(testData));
  
  // Simulate reload by reading back
  const retrieved = JSON.parse(localStorage.getItem('orariodoc:v1'));
  
  assert(retrieved.lessons.length === 1, 'Should have one lesson');
  assertEqual(retrieved.lessons[0].name, 'Math', 'Lesson name should match');
  assertEqual(retrieved.settings.theme, 'dark', 'Theme should match');
  
  localStorage.clear();
});

SimpleTest.test('Theme and storage work together', () => {
  localStorage.clear();
  
  // Set theme
  ThemeManager.setTheme('light');
  
  // Save app data
  localStorage.setItem('orariodoc:v1', JSON.stringify({ lessons: [], settings: {} }));
  
  // Both should be stored
  assert(localStorage.getItem('orariodoc:theme') !== null, 'Theme should be stored');
  assert(localStorage.getItem('orariodoc:v1') !== null, 'Data should be stored');
  
  localStorage.clear();
});

// Export for use in test runner
if (typeof window !== 'undefined') {
  window.SimpleTest = SimpleTest;
}
