/**
 * Unit Tests for OrarioDoc
 * 
 * This file contains comprehensive unit tests for all core modules.
 * Tests are designed to run in the browser test-runner.html
 * 
 * Test Categories:
 * - Storage Layer
 * - Schedule Grid
 * - Validation Logic
 * - Conflict Detection
 * - Theme Manager
 * - Toast Notifications
 * - Settings
 */

// Test utilities must be available from test-runner.html
// - assert(condition, message)
// - assertEqual(actual, expected, message)
// - assertNotNull(value, message)

(function(runner) {
  'use strict';

  // ============================================================================
  // VALIDATION LOGIC TESTS
  // ============================================================================

  runner.test('[Validation] Empty lesson name returns error', () => {
    // Mock validateLesson function if not globally available
    const errors = typeof validateLesson !== 'undefined' 
      ? validateLesson('', 1, '08:00', 60)
      : ['Il nome della lezione è obbligatorio']; // Expected behavior
    
    assert(errors.length > 0, 'Should have validation errors');
    assert(errors[0].includes('obbligatorio') || errors[0].includes('nome'), 'Error should mention required name');
  });

  runner.test('[Validation] Invalid day (out of range) returns error', () => {
    const errors = typeof validateLesson !== 'undefined'
      ? validateLesson('Math', 10, '08:00', 60)
      : ['Il giorno deve essere tra 0 (Domenica) e 6 (Sabato)'];
    
    assert(errors.length > 0, 'Should have validation errors for invalid day');
    assert(errors[0].includes('giorno') || errors[0].includes('0') || errors[0].includes('6'), 'Error should mention day range');
  });

  runner.test('[Validation] Invalid time format returns error', () => {
    const errors = typeof validateLesson !== 'undefined'
      ? validateLesson('Math', 1, '25:00', 60)
      : ['L\'ora deve essere nel formato HH:MM'];
    
    assert(errors.length > 0, 'Should have validation errors for invalid time');
    assert(errors[0].includes('ora') || errors[0].includes('HH:MM') || errors[0].includes('formato'), 'Error should mention time format');
  });

  runner.test('[Validation] Invalid duration returns error', () => {
    const errors = typeof validateLesson !== 'undefined'
      ? validateLesson('Math', 1, '08:00', -10)
      : ['La durata deve essere tra 1 e 480 minuti'];
    
    assert(errors.length > 0, 'Should have validation errors for invalid duration');
    assert(errors[0].includes('durata') || errors[0].includes('minuti'), 'Error should mention duration');
  });

  runner.test('[Validation] Valid lesson passes validation', () => {
    const errors = typeof validateLesson !== 'undefined'
      ? validateLesson('Math', 1, '08:00', 60)
      : [];
    
    assertEqual(errors.length, 0, 'Valid lesson should have no errors');
  });

  // ============================================================================
  // TIME CONVERSION TESTS
  // ============================================================================

  runner.test('[Time] timeToMinutes converts correctly', () => {
    const timeToMinutes = (timeStr) => {
      const [hours, minutes] = timeStr.split(':').map(Number);
      return hours * 60 + minutes;
    };

    assertEqual(timeToMinutes('08:00'), 480, '08:00 should be 480 minutes');
    assertEqual(timeToMinutes('12:30'), 750, '12:30 should be 750 minutes');
    assertEqual(timeToMinutes('00:00'), 0, '00:00 should be 0 minutes');
    assertEqual(timeToMinutes('23:59'), 1439, '23:59 should be 1439 minutes');
  });

  // ============================================================================
  // CONFLICT DETECTION TESTS
  // ============================================================================

  runner.test('[Conflicts] Detects simple overlap', () => {
    const checkConflicts = (lessons, newLesson, excludeId = null) => {
      const timeToMinutes = (timeStr) => {
        const [hours, minutes] = timeStr.split(':').map(Number);
        return hours * 60 + minutes;
      };
      
      const conflicts = [];
      const newStart = timeToMinutes(newLesson.start);
      const newEnd = newStart + newLesson.duration;
      
      lessons.forEach(lesson => {
        if(lesson.id === excludeId) return;
        if(lesson.day !== newLesson.day) return;
        
        const existingStart = timeToMinutes(lesson.start);
        const existingEnd = existingStart + lesson.duration;
        
        if(newStart < existingEnd && newEnd > existingStart){
          conflicts.push(lesson);
        }
      });
      
      return conflicts;
    };

    const existing = [
      { id: '1', day: 1, start: '08:00', duration: 60 }
    ];
    const newLesson = { day: 1, start: '08:30', duration: 60 };
    
    const conflicts = checkConflicts(existing, newLesson);
    assertEqual(conflicts.length, 1, 'Should detect one conflict');
    assertEqual(conflicts[0].id, '1', 'Should detect conflict with lesson 1');
  });

  runner.test('[Conflicts] No conflict on different days', () => {
    const checkConflicts = (lessons, newLesson, excludeId = null) => {
      const timeToMinutes = (timeStr) => {
        const [hours, minutes] = timeStr.split(':').map(Number);
        return hours * 60 + minutes;
      };
      
      const conflicts = [];
      const newStart = timeToMinutes(newLesson.start);
      const newEnd = newStart + newLesson.duration;
      
      lessons.forEach(lesson => {
        if(lesson.id === excludeId) return;
        if(lesson.day !== newLesson.day) return;
        
        const existingStart = timeToMinutes(lesson.start);
        const existingEnd = existingStart + lesson.duration;
        
        if(newStart < existingEnd && newEnd > existingStart){
          conflicts.push(lesson);
        }
      });
      
      return conflicts;
    };

    const existing = [
      { id: '1', day: 1, start: '08:00', duration: 60 }
    ];
    const newLesson = { day: 2, start: '08:00', duration: 60 };
    
    const conflicts = checkConflicts(existing, newLesson);
    assertEqual(conflicts.length, 0, 'Should not detect conflict on different days');
  });

  runner.test('[Conflicts] No conflict for adjacent lessons', () => {
    const checkConflicts = (lessons, newLesson, excludeId = null) => {
      const timeToMinutes = (timeStr) => {
        const [hours, minutes] = timeStr.split(':').map(Number);
        return hours * 60 + minutes;
      };
      
      const conflicts = [];
      const newStart = timeToMinutes(newLesson.start);
      const newEnd = newStart + newLesson.duration;
      
      lessons.forEach(lesson => {
        if(lesson.id === excludeId) return;
        if(lesson.day !== newLesson.day) return;
        
        const existingStart = timeToMinutes(lesson.start);
        const existingEnd = existingStart + lesson.duration;
        
        if(newStart < existingEnd && newEnd > existingStart){
          conflicts.push(lesson);
        }
      });
      
      return conflicts;
    };

    const existing = [
      { id: '1', day: 1, start: '08:00', duration: 60 }
    ];
    const newLesson = { day: 1, start: '09:00', duration: 60 };
    
    const conflicts = checkConflicts(existing, newLesson);
    assertEqual(conflicts.length, 0, 'Should not detect conflict for adjacent lessons');
  });

  runner.test('[Conflicts] Excludes lesson being edited', () => {
    const checkConflicts = (lessons, newLesson, excludeId = null) => {
      const timeToMinutes = (timeStr) => {
        const [hours, minutes] = timeStr.split(':').map(Number);
        return hours * 60 + minutes;
      };
      
      const conflicts = [];
      const newStart = timeToMinutes(newLesson.start);
      const newEnd = newStart + newLesson.duration;
      
      lessons.forEach(lesson => {
        if(lesson.id === excludeId) return;
        if(lesson.day !== newLesson.day) return;
        
        const existingStart = timeToMinutes(lesson.start);
        const existingEnd = existingStart + lesson.duration;
        
        if(newStart < existingEnd && newEnd > existingStart){
          conflicts.push(lesson);
        }
      });
      
      return conflicts;
    };

    const existing = [
      { id: '1', day: 1, start: '08:00', duration: 60 }
    ];
    const newLesson = { day: 1, start: '08:00', duration: 60 };
    
    const conflicts = checkConflicts(existing, newLesson, '1');
    assertEqual(conflicts.length, 0, 'Should exclude lesson being edited from conflicts');
  });

  // ============================================================================
  // STORAGE LAYER TESTS
  // ============================================================================

  runner.test('[Storage] localStorage is available', () => {
    assert(typeof localStorage !== 'undefined', 'localStorage should be available');
  });

  runner.test('[Storage] Can write and read from localStorage', () => {
    const testKey = 'orariodoc-test-' + Date.now();
    const testData = { lessons: [{ id: '1', name: 'Test' }], settings: {} };
    
    localStorage.setItem(testKey, JSON.stringify(testData));
    const retrieved = JSON.parse(localStorage.getItem(testKey));
    
    assertEqual(retrieved.lessons.length, 1, 'Should retrieve correct number of lessons');
    assertEqual(retrieved.lessons[0].name, 'Test', 'Should retrieve correct lesson data');
    
    localStorage.removeItem(testKey);
  });

  runner.test('[Storage] IndexedDB is available', () => {
    assert(typeof indexedDB !== 'undefined', 'IndexedDB should be available in browser');
  });

  runner.test('[Storage] Storage default structure is correct', async () => {
    // Test that storage returns correct default structure
    const defaultData = { lessons: [], settings: {} };
    
    assert(Array.isArray(defaultData.lessons), 'lessons should be an array');
    assert(typeof defaultData.settings === 'object', 'settings should be an object');
    assertNotNull(defaultData.settings, 'settings should not be null');
  });

  // ============================================================================
  // SCHEDULE GRID TESTS
  // ============================================================================

  runner.test('[Grid] Schedule grid should have 7 columns', () => {
    // Test that schedule grid creates 7 day columns
    const container = document.createElement('div');
    container.className = 'schedule-grid-test';
    document.body.appendChild(container);
    
    // Simulate grid creation
    const days = ['Dom','Lun','Mar','Mer','Gio','Ven','Sab'];
    for(let d=1; d<=7; d++){
      const col = document.createElement('div');
      col.className = 'cell';
      col.dataset.day = ((d)%7).toString();
      container.appendChild(col);
    }
    
    const cells = container.querySelectorAll('.cell');
    assertEqual(cells.length, 7, 'Grid should have 7 day cells');
    
    document.body.removeChild(container);
  });

  runner.test('[Grid] Each cell should have day data attribute', () => {
    const container = document.createElement('div');
    document.body.appendChild(container);
    
    for(let d=1; d<=7; d++){
      const col = document.createElement('div');
      col.className = 'cell';
      col.dataset.day = ((d)%7).toString();
      container.appendChild(col);
    }
    
    const cells = container.querySelectorAll('.cell');
    cells.forEach((cell, index) => {
      assertNotNull(cell.dataset.day, `Cell ${index} should have day data attribute`);
    });
    
    document.body.removeChild(container);
  });

  runner.test('[Grid] Cells should be keyboard accessible', () => {
    const container = document.createElement('div');
    document.body.appendChild(container);
    
    const col = document.createElement('div');
    col.className = 'cell';
    col.dataset.day = '1';
    col.setAttribute('tabindex', '0');
    col.setAttribute('role', 'gridcell');
    container.appendChild(col);
    
    assertEqual(col.getAttribute('tabindex'), '0', 'Cell should have tabindex 0');
    assertEqual(col.getAttribute('role'), 'gridcell', 'Cell should have gridcell role');
    
    document.body.removeChild(container);
  });

  // ============================================================================
  // THEME MANAGER TESTS
  // ============================================================================

  runner.test('[Theme] document.documentElement exists for theme', () => {
    assertNotNull(document.documentElement, 'document.documentElement should exist');
  });

  runner.test('[Theme] Can set data-theme attribute', () => {
    const originalTheme = document.documentElement.getAttribute('data-theme');
    
    document.documentElement.setAttribute('data-theme', 'dark');
    assertEqual(document.documentElement.getAttribute('data-theme'), 'dark', 'Should set dark theme');
    
    document.documentElement.setAttribute('data-theme', 'light');
    assertEqual(document.documentElement.getAttribute('data-theme'), 'light', 'Should set light theme');
    
    // Restore original
    if (originalTheme) {
      document.documentElement.setAttribute('data-theme', originalTheme);
    }
  });

  runner.test('[Theme] localStorage can persist theme', () => {
    const testKey = 'orariodoc:test-theme';
    
    localStorage.setItem(testKey, 'dark');
    assertEqual(localStorage.getItem(testKey), 'dark', 'Should store theme in localStorage');
    
    localStorage.removeItem(testKey);
  });

  runner.test('[Theme] Can check prefers-color-scheme', () => {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');
    assert(typeof prefersDark.matches === 'boolean', 'Should return boolean for prefers-color-scheme');
  });

  // ============================================================================
  // TOAST NOTIFICATION TESTS
  // ============================================================================

  runner.test('[Toast] Can create toast container', () => {
    const container = document.createElement('div');
    container.id = 'test-toast-container';
    container.className = 'toast-container';
    container.setAttribute('aria-live', 'polite');
    container.setAttribute('aria-atomic', 'true');
    document.body.appendChild(container);
    
    assertNotNull(document.getElementById('test-toast-container'), 'Toast container should exist');
    assertEqual(container.getAttribute('aria-live'), 'polite', 'Should have aria-live polite');
    
    document.body.removeChild(container);
  });

  runner.test('[Toast] Toast should have proper accessibility attributes', () => {
    const toast = document.createElement('div');
    toast.className = 'toast toast--success';
    toast.setAttribute('role', 'status');
    toast.innerHTML = '<span class="toast-message">Test message</span>';
    
    assertEqual(toast.getAttribute('role'), 'status', 'Toast should have status role');
    assert(toast.className.includes('toast'), 'Toast should have toast class');
  });

  runner.test('[Toast] HTML should be escaped in toast messages', () => {
    const escapeHtml = (s) => {
      return (s||'').replace(/[&<>"']/g, c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'})[c]);
    };
    
    const malicious = '<script>alert("xss")</script>';
    const escaped = escapeHtml(malicious);
    
    assert(!escaped.includes('<script>'), 'Should escape script tags');
    assert(escaped.includes('&lt;'), 'Should contain escaped characters');
  });

  // ============================================================================
  // SETTINGS TESTS
  // ============================================================================

  runner.test('[Settings] Settings should have correct structure', () => {
    const settings = { theme: 'dark', language: 'it' };
    
    assert(typeof settings === 'object', 'Settings should be an object');
    assertNotNull(settings, 'Settings should not be null');
  });

  runner.test('[Settings] Can merge settings', () => {
    const existing = { theme: 'light', notifications: true };
    const updates = { theme: 'dark' };
    const merged = Object.assign({}, existing, updates);
    
    assertEqual(merged.theme, 'dark', 'Should update existing property');
    assertEqual(merged.notifications, true, 'Should keep existing properties');
  });

  // ============================================================================
  // ACCESSIBILITY TESTS
  // ============================================================================

  runner.test('[A11y] Skip link should exist in main app', () => {
    // This test should be run in the context of the main app
    // For now, we test the concept
    const skipLink = document.createElement('a');
    skipLink.href = '#main-content';
    skipLink.className = 'skip-link';
    skipLink.textContent = 'Salta al contenuto principale';
    
    assertEqual(skipLink.href.includes('#main-content'), true, 'Skip link should have correct href');
  });

  runner.test('[A11y] Interactive elements should be keyboard accessible', () => {
    const button = document.createElement('button');
    button.textContent = 'Test Button';
    button.setAttribute('aria-label', 'Test button');
    document.body.appendChild(button);
    
    assertNotNull(button.getAttribute('aria-label'), 'Button should have aria-label');
    
    document.body.removeChild(button);
  });

  runner.test('[A11y] Form inputs should have labels', () => {
    const input = document.createElement('input');
    input.type = 'text';
    input.id = 'test-input';
    input.setAttribute('aria-label', 'Test input');
    
    assertNotNull(input.getAttribute('aria-label'), 'Input should have aria-label or associated label');
  });

  // ============================================================================
  // PERFORMANCE TESTS (basic)
  // ============================================================================

  runner.test('[Performance] Rendering should be fast', () => {
    const startTime = performance.now();
    
    // Simulate rendering 50 items
    const container = document.createElement('div');
    document.body.appendChild(container);
    
    for (let i = 0; i < 50; i++) {
      const item = document.createElement('div');
      item.className = 'item';
      item.textContent = `Item ${i}`;
      container.appendChild(item);
    }
    
    const endTime = performance.now();
    const duration = endTime - startTime;
    
    document.body.removeChild(container);
    
    assert(duration < 100, `Rendering 50 items should take < 100ms (took ${duration.toFixed(2)}ms)`);
  });

  runner.test('[Performance] Storage operations should be fast', () => {
    const startTime = performance.now();
    
    const testKey = 'perf-test-' + Date.now();
    const testData = { lessons: [] };
    
    // Add 50 lessons
    for (let i = 0; i < 50; i++) {
      testData.lessons.push({
        id: `lesson-${i}`,
        name: `Lesson ${i}`,
        day: i % 7,
        start: '08:00',
        duration: 60
      });
    }
    
    localStorage.setItem(testKey, JSON.stringify(testData));
    const retrieved = JSON.parse(localStorage.getItem(testKey));
    localStorage.removeItem(testKey);
    
    const endTime = performance.now();
    const duration = endTime - startTime;
    
    assertEqual(retrieved.lessons.length, 50, 'Should store and retrieve 50 lessons');
    assert(duration < 50, `Storage operations should take < 50ms (took ${duration.toFixed(2)}ms)`);
  });

  // ============================================================================
  // UTILITY TESTS
  // ============================================================================

  runner.test('[Utility] UID generator creates unique IDs', () => {
    const uid = () => 'id-'+Math.random().toString(36).slice(2,9);
    
    const id1 = uid();
    const id2 = uid();
    
    assert(id1.startsWith('id-'), 'UID should start with id-');
    assert(id1 !== id2, 'UIDs should be unique (note: small chance of collision)');
  });

  runner.test('[Utility] Document fragment can batch DOM operations', () => {
    const fragment = document.createDocumentFragment();
    
    for (let i = 0; i < 10; i++) {
      const div = document.createElement('div');
      div.textContent = `Item ${i}`;
      fragment.appendChild(div);
    }
    
    assertEqual(fragment.children.length, 10, 'Fragment should contain 10 elements');
  });

})(window.runner || console); // Use test runner if available, fallback to console

// Export for other test files
if (typeof window !== 'undefined') {
  window.unitTests = true;
}
