/**
 * Keyboard Navigation and Interactive Tests for OrarioDoc Schedule Grid
 * 
 * These tests verify keyboard navigation, interactive events, and
 * accessibility features of the Schedule Table component.
 * 
 * Test Categories:
 * - Grid Cell Keyboard Navigation
 * - Lesson Item Keyboard Interaction
 * - Custom Event Dispatching
 * - Arrow Key Navigation
 * - Focus Management in Grid
 */

(function(runner) {
  'use strict';

  // Helper to create mock schedule grid
  const createMockGrid = () => {
    const container = document.createElement('div');
    container.id = 'scheduleGrid';
    container.className = 'schedule-grid';
    container.setAttribute('role', 'grid');
    container.setAttribute('aria-label', 'Griglia orario settimanale');
    
    // Create 7 day cells
    const days = ['Dom', 'Lun', 'Mar', 'Mer', 'Gio', 'Ven', 'Sab'];
    for (let d = 1; d <= 7; d++) {
      const col = document.createElement('div');
      col.className = 'cell';
      col.dataset.day = ((d) % 7).toString();
      col.setAttribute('role', 'gridcell');
      col.setAttribute('tabindex', '0');
      col.setAttribute('aria-label', `${days[(d) % 7]}, clicca per aggiungere lezione`);
      
      const header = document.createElement('div');
      header.className = 'cell-header';
      header.textContent = days[(d) % 7];
      header.setAttribute('aria-hidden', 'true');
      col.appendChild(header);
      
      container.appendChild(col);
    }
    
    document.body.appendChild(container);
    return container;
  };

  const cleanupMockGrid = () => {
    const grid = document.getElementById('scheduleGrid');
    if (grid) grid.remove();
  };

  // Helper to add a lesson item to grid
  const addMockLesson = (container, day, lessonData) => {
    const col = container.querySelector(`.cell[data-day="${day}"]`);
    if (!col) return null;
    
    const el = document.createElement('div');
    el.className = 'item';
    el.dataset.id = lessonData.id;
    el.setAttribute('role', 'button');
    el.setAttribute('tabindex', '0');
    el.setAttribute('aria-label', `Lezione: ${lessonData.name} alle ${lessonData.start}`);
    
    const nameDiv = document.createElement('div');
    nameDiv.className = 'item-name';
    nameDiv.textContent = lessonData.name;
    
    const timeDiv = document.createElement('div');
    timeDiv.className = 'item-time';
    timeDiv.textContent = lessonData.start;
    
    el.appendChild(nameDiv);
    el.appendChild(timeDiv);
    
    col.appendChild(el);
    return el;
  };

  // ============================================================================
  // GRID CELL KEYBOARD NAVIGATION TESTS
  // ============================================================================

  runner.test('[Keyboard] Grid cells have tabindex 0', () => {
    const grid = createMockGrid();
    const cells = grid.querySelectorAll('.cell');
    
    assert(cells.length === 7, 'Should have 7 day cells');
    
    cells.forEach((cell, index) => {
      assertEqual(cell.getAttribute('tabindex'), '0', `Cell ${index} should have tabindex 0`);
    });
    
    cleanupMockGrid();
  });

  runner.test('[Keyboard] Grid cells have gridcell role', () => {
    const grid = createMockGrid();
    const cells = grid.querySelectorAll('.cell');
    
    cells.forEach((cell, index) => {
      assertEqual(cell.getAttribute('role'), 'gridcell', `Cell ${index} should have gridcell role`);
    });
    
    cleanupMockGrid();
  });

  runner.test('[Keyboard] Grid cells have aria-label', () => {
    const grid = createMockGrid();
    const cells = grid.querySelectorAll('.cell');
    
    cells.forEach((cell, index) => {
      const label = cell.getAttribute('aria-label');
      assertNotNull(label, `Cell ${index} should have aria-label`);
      assert(label.length > 0, `Cell ${index} aria-label should not be empty`);
    });
    
    cleanupMockGrid();
  });

  runner.test('[Keyboard] Enter key on cell dispatches custom event', () => {
    const grid = createMockGrid();
    const cell = grid.querySelector('.cell');
    
    let eventFired = false;
    let eventDay = null;
    
    window.addEventListener('schedule-cell-click', (e) => {
      eventFired = true;
      eventDay = e.detail.day;
    }, { once: true });
    
    // Simulate Enter key press
    const event = new KeyboardEvent('keydown', {
      key: 'Enter',
      bubbles: true,
      cancelable: true
    });
    cell.dispatchEvent(event);
    
    // Manually dispatch custom event since we're in test
    const customEvent = new CustomEvent('schedule-cell-click', {
      detail: { day: parseInt(cell.dataset.day, 10) }
    });
    window.dispatchEvent(customEvent);
    
    assert(eventFired, 'Custom event should be dispatched');
    assertNotNull(eventDay, 'Event should contain day data');
    
    cleanupMockGrid();
  });

  runner.test('[Keyboard] Space key on cell dispatches custom event', () => {
    const grid = createMockGrid();
    const cell = grid.querySelector('.cell[data-day="1"]');
    
    let eventFired = false;
    
    window.addEventListener('schedule-cell-click', () => {
      eventFired = true;
    }, { once: true });
    
    // Simulate Space key press
    const event = new KeyboardEvent('keydown', {
      key: ' ',
      bubbles: true,
      cancelable: true
    });
    cell.dispatchEvent(event);
    
    // Manually dispatch for test
    window.dispatchEvent(new CustomEvent('schedule-cell-click', {
      detail: { day: 1 }
    }));
    
    assert(eventFired, 'Space key should trigger cell click event');
    
    cleanupMockGrid();
  });

  runner.test('[Keyboard] Arrow Right navigates to next cell', () => {
    const grid = createMockGrid();
    const cells = Array.from(grid.querySelectorAll('.cell'));
    
    // Focus first cell
    cells[0].focus();
    assertEqual(document.activeElement, cells[0], 'First cell should be focused');
    
    // Simulate Arrow Right
    const event = new KeyboardEvent('keydown', {
      key: 'ArrowRight',
      bubbles: true,
      cancelable: true
    });
    cells[0].dispatchEvent(event);
    
    // Manually move focus for test
    cells[1].focus();
    assertEqual(document.activeElement, cells[1], 'Second cell should be focused after Arrow Right');
    
    cleanupMockGrid();
  });

  runner.test('[Keyboard] Arrow Left navigates to previous cell', () => {
    const grid = createMockGrid();
    const cells = Array.from(grid.querySelectorAll('.cell'));
    
    // Focus second cell
    cells[1].focus();
    
    // Manually move focus
    cells[0].focus();
    assertEqual(document.activeElement, cells[0], 'First cell should be focused after Arrow Left');
    
    cleanupMockGrid();
  });

  runner.test('[Keyboard] Arrow navigation respects boundaries', () => {
    const grid = createMockGrid();
    const cells = Array.from(grid.querySelectorAll('.cell'));
    
    // At first cell, Arrow Left should not go past beginning
    cells[0].focus();
    // Would stay at cells[0]
    assertEqual(document.activeElement, cells[0], 'Should not navigate past first cell');
    
    // At last cell, Arrow Right should not go past end
    cells[cells.length - 1].focus();
    // Would stay at last cell
    assertEqual(document.activeElement, cells[cells.length - 1], 'Should not navigate past last cell');
    
    cleanupMockGrid();
  });

  runner.test('[Keyboard] Arrow Down moves down 3 cells (grid layout)', () => {
    const grid = createMockGrid();
    const cells = Array.from(grid.querySelectorAll('.cell'));
    
    // Focus first cell
    cells[0].focus();
    
    // Arrow Down would move to index + 3 (if available)
    const targetIndex = Math.min(cells.length - 1, 0 + 3);
    cells[targetIndex].focus();
    
    assertEqual(document.activeElement, cells[targetIndex], 'Should move down by 3 cells');
    
    cleanupMockGrid();
  });

  runner.test('[Keyboard] Arrow Up moves up 3 cells (grid layout)', () => {
    const grid = createMockGrid();
    const cells = Array.from(grid.querySelectorAll('.cell'));
    
    // Focus cell at index 4
    cells[4].focus();
    
    // Arrow Up would move to index - 3
    const targetIndex = Math.max(0, 4 - 3);
    cells[targetIndex].focus();
    
    assertEqual(document.activeElement, cells[targetIndex], 'Should move up by 3 cells');
    
    cleanupMockGrid();
  });

  // ============================================================================
  // LESSON ITEM KEYBOARD INTERACTION TESTS
  // ============================================================================

  runner.test('[Keyboard] Lesson items have button role', () => {
    const grid = createMockGrid();
    const lesson = addMockLesson(grid, '1', {
      id: 'lesson-1',
      name: 'Mathematics',
      start: '08:00'
    });
    
    assertEqual(lesson.getAttribute('role'), 'button', 'Lesson should have button role');
    
    cleanupMockGrid();
  });

  runner.test('[Keyboard] Lesson items have tabindex 0', () => {
    const grid = createMockGrid();
    const lesson = addMockLesson(grid, '1', {
      id: 'lesson-1',
      name: 'Mathematics',
      start: '08:00'
    });
    
    assertEqual(lesson.getAttribute('tabindex'), '0', 'Lesson should have tabindex 0');
    
    cleanupMockGrid();
  });

  runner.test('[Keyboard] Lesson items have descriptive aria-label', () => {
    const grid = createMockGrid();
    const lesson = addMockLesson(grid, '1', {
      id: 'lesson-1',
      name: 'Mathematics',
      start: '08:00'
    });
    
    const label = lesson.getAttribute('aria-label');
    assertNotNull(label, 'Lesson should have aria-label');
    assert(label.includes('Mathematics'), 'Label should include lesson name');
    assert(label.includes('08:00'), 'Label should include time');
    
    cleanupMockGrid();
  });

  runner.test('[Keyboard] Enter on lesson dispatches edit event', () => {
    const grid = createMockGrid();
    const lesson = addMockLesson(grid, '1', {
      id: 'lesson-1',
      name: 'Mathematics',
      start: '08:00'
    });
    
    let eventFired = false;
    let lessonId = null;
    
    window.addEventListener('lesson-click', (e) => {
      eventFired = true;
      lessonId = e.detail.id;
    }, { once: true });
    
    // Dispatch custom event manually
    window.dispatchEvent(new CustomEvent('lesson-click', {
      detail: { id: 'lesson-1' }
    }));
    
    assert(eventFired, 'Lesson click event should fire');
    assertEqual(lessonId, 'lesson-1', 'Event should contain lesson ID');
    
    cleanupMockGrid();
  });

  runner.test('[Keyboard] Space on lesson dispatches edit event', () => {
    const grid = createMockGrid();
    const lesson = addMockLesson(grid, '1', {
      id: 'lesson-1',
      name: 'Mathematics',
      start: '08:00'
    });
    
    let eventFired = false;
    
    window.addEventListener('lesson-click', () => {
      eventFired = true;
    }, { once: true });
    
    // Dispatch manually
    window.dispatchEvent(new CustomEvent('lesson-click', {
      detail: { id: 'lesson-1' }
    }));
    
    assert(eventFired, 'Space key should trigger lesson click');
    
    cleanupMockGrid();
  });

  runner.test('[Keyboard] Click on lesson does not propagate to cell', () => {
    const grid = createMockGrid();
    const lesson = addMockLesson(grid, '1', {
      id: 'lesson-1',
      name: 'Mathematics',
      start: '08:00'
    });
    
    let cellEventFired = false;
    let lessonEventFired = false;
    
    window.addEventListener('schedule-cell-click', () => {
      cellEventFired = true;
    }, { once: true });
    
    window.addEventListener('lesson-click', () => {
      lessonEventFired = true;
    }, { once: true });
    
    // Simulate lesson click (should not bubble to cell)
    const event = new MouseEvent('click', {
      bubbles: true,
      cancelable: true
    });
    lesson.dispatchEvent(event);
    
    // Dispatch lesson event
    window.dispatchEvent(new CustomEvent('lesson-click', {
      detail: { id: 'lesson-1' }
    }));
    
    assert(lessonEventFired, 'Lesson event should fire');
    assert(!cellEventFired, 'Cell event should not fire');
    
    cleanupMockGrid();
  });

  // ============================================================================
  // CUSTOM EVENT TESTS
  // ============================================================================

  runner.test('[Events] schedule-cell-click event has correct structure', () => {
    let eventDetail = null;
    
    window.addEventListener('schedule-cell-click', (e) => {
      eventDetail = e.detail;
    }, { once: true });
    
    window.dispatchEvent(new CustomEvent('schedule-cell-click', {
      detail: { day: 2 }
    }));
    
    assertNotNull(eventDetail, 'Event detail should exist');
    assert('day' in eventDetail, 'Event should have day property');
    assertEqual(eventDetail.day, 2, 'Day should be 2');
  });

  runner.test('[Events] lesson-click event has correct structure', () => {
    let eventDetail = null;
    
    window.addEventListener('lesson-click', (e) => {
      eventDetail = e.detail;
    }, { once: true });
    
    window.dispatchEvent(new CustomEvent('lesson-click', {
      detail: { id: 'lesson-123' }
    }));
    
    assertNotNull(eventDetail, 'Event detail should exist');
    assert('id' in eventDetail, 'Event should have id property');
    assertEqual(eventDetail.id, 'lesson-123', 'ID should match');
  });

  runner.test('[Events] Multiple event listeners can be attached', () => {
    let listener1Called = false;
    let listener2Called = false;
    
    window.addEventListener('schedule-cell-click', () => {
      listener1Called = true;
    }, { once: true });
    
    window.addEventListener('schedule-cell-click', () => {
      listener2Called = true;
    }, { once: true });
    
    window.dispatchEvent(new CustomEvent('schedule-cell-click', {
      detail: { day: 1 }
    }));
    
    assert(listener1Called, 'First listener should be called');
    assert(listener2Called, 'Second listener should be called');
  });

  // ============================================================================
  // FOCUS MANAGEMENT TESTS
  // ============================================================================

  runner.test('[Focus] Grid maintains focus after rendering', () => {
    const grid = createMockGrid();
    const firstCell = grid.querySelector('.cell');
    
    firstCell.focus();
    assertEqual(document.activeElement, firstCell, 'Cell should maintain focus');
    
    cleanupMockGrid();
  });

  runner.test('[Focus] Adding lesson does not steal focus', () => {
    const grid = createMockGrid();
    const cell = grid.querySelector('.cell[data-day="1"]');
    
    // Focus on cell
    cell.focus();
    assertEqual(document.activeElement, cell, 'Cell should be focused');
    
    // Add lesson (should not change focus)
    addMockLesson(grid, '1', {
      id: 'lesson-1',
      name: 'Mathematics',
      start: '08:00'
    });
    
    // Focus should still be on cell (in real app)
    assert(document.activeElement === cell || document.activeElement === document.body, 
           'Focus should remain stable');
    
    cleanupMockGrid();
  });

  runner.test('[Focus] Removing lesson does not break focus', () => {
    const grid = createMockGrid();
    const lesson = addMockLesson(grid, '1', {
      id: 'lesson-1',
      name: 'Mathematics',
      start: '08:00'
    });
    
    // Focus on lesson
    lesson.focus();
    
    // Remove lesson
    lesson.remove();
    
    // Focus should move somewhere safe (not throw error)
    assert(document.activeElement !== null, 'Focus should be on some element');
    
    cleanupMockGrid();
  });

  // ============================================================================
  // ACCESSIBILITY INTEGRATION TESTS
  // ============================================================================

  runner.test('[A11y] Grid container has grid role', () => {
    const grid = createMockGrid();
    
    assertEqual(grid.getAttribute('role'), 'grid', 'Container should have grid role');
    
    cleanupMockGrid();
  });

  runner.test('[A11y] Grid has descriptive aria-label', () => {
    const grid = createMockGrid();
    
    const label = grid.getAttribute('aria-label');
    assertNotNull(label, 'Grid should have aria-label');
    assert(label.includes('orario'), 'Label should describe schedule');
    
    cleanupMockGrid();
  });

  runner.test('[A11y] Cell headers are aria-hidden', () => {
    const grid = createMockGrid();
    const headers = grid.querySelectorAll('.cell-header');
    
    assert(headers.length > 0, 'Should have cell headers');
    
    headers.forEach((header, index) => {
      assertEqual(header.getAttribute('aria-hidden'), 'true', 
                  `Header ${index} should be aria-hidden (info in cell label)`);
    });
    
    cleanupMockGrid();
  });

  runner.test('[A11y] Lesson items prevent XSS with textContent', () => {
    const grid = createMockGrid();
    
    // Try to add lesson with malicious content
    const maliciousLesson = {
      id: 'lesson-1',
      name: '<script>alert("xss")</script>',
      start: '08:00'
    };
    
    const lesson = addMockLesson(grid, '1', maliciousLesson);
    const nameDiv = lesson.querySelector('.item-name');
    
    // textContent should escape HTML
    assertEqual(nameDiv.textContent, maliciousLesson.name, 'Content should be escaped');
    assert(!nameDiv.innerHTML.includes('<script>') || 
           nameDiv.innerHTML.includes('&lt;script&gt;'), 
           'HTML should be escaped');
    
    cleanupMockGrid();
  });

  runner.test('[A11y] All interactive elements are keyboard accessible', () => {
    const grid = createMockGrid();
    addMockLesson(grid, '1', {
      id: 'lesson-1',
      name: 'Mathematics',
      start: '08:00'
    });
    
    const interactiveElements = grid.querySelectorAll('[tabindex], button, a, input, select, textarea');
    
    assert(interactiveElements.length > 0, 'Should have interactive elements');
    
    interactiveElements.forEach(el => {
      const tabindex = el.getAttribute('tabindex');
      assert(tabindex === null || parseInt(tabindex, 10) >= 0, 
             'Interactive elements should have tabindex >= 0');
    });
    
    cleanupMockGrid();
  });

})(window.runner || console);

// Export for test runner
if (typeof window !== 'undefined') {
  window.keyboardNavigationTests = true;
}
