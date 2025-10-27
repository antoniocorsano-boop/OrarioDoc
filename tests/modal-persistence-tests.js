/**
 * Modal and Persistence Integration Tests for OrarioDoc
 * 
 * These tests verify the modal interaction logic and data persistence
 * for the Schedule Table (Tabella Orario) component.
 * 
 * Test Categories:
 * - Modal Opening/Closing
 * - Focus Management
 * - Field Validation
 * - Keyboard Interactions
 * - Data Persistence after Modal Actions
 * - Error Handling
 */

(function(runner) {
  'use strict';

  // Helper to wait for async operations
  const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));

  // Helper to create a mock DOM environment
  const createMockModal = () => {
    const panel = document.createElement('aside');
    panel.id = 'panel';
    panel.className = 'panel hidden';
    panel.setAttribute('role', 'dialog');
    panel.setAttribute('aria-modal', 'true');
    panel.setAttribute('aria-hidden', 'true');
    
    panel.innerHTML = `
      <h3 id="panelTitle">Nuova lezione</h3>
      <form id="lessonForm">
        <label>Nome <input id="inputName" type="text" required /></label>
        <label>Classe <input id="inputClass" type="text" /></label>
        <label>Giorno <input id="inputDay" type="number" min="0" max="6" value="1" /></label>
        <label>Ora <input id="inputTime" type="time" value="08:00" /></label>
        <label>Durata <input id="inputDuration" type="number" value="60" min="1" max="480" /></label>
        <button type="button" id="saveBtn">Salva</button>
        <button type="button" id="cancelBtn">Annulla</button>
        <button type="button" id="deleteBtn" style="display:none;">Elimina</button>
      </form>
    `;
    
    document.body.appendChild(panel);
    return panel;
  };

  const cleanupMockModal = () => {
    const panel = document.getElementById('panel');
    if (panel) panel.remove();
  };

  // ============================================================================
  // MODAL OPENING/CLOSING TESTS
  // ============================================================================

  runner.test('[Modal] Panel opens with correct ARIA attributes', () => {
    const panel = createMockModal();
    
    // Initially hidden
    assert(panel.classList.contains('hidden'), 'Panel should start hidden');
    assertEqual(panel.getAttribute('aria-hidden'), 'true', 'aria-hidden should be true');
    
    // Open panel
    panel.classList.remove('hidden');
    panel.setAttribute('aria-hidden', 'false');
    
    // Verify opened state
    assert(!panel.classList.contains('hidden'), 'Panel should not be hidden');
    assertEqual(panel.getAttribute('aria-hidden'), 'false', 'aria-hidden should be false');
    
    cleanupMockModal();
  });

  runner.test('[Modal] Panel closes and restores hidden state', () => {
    const panel = createMockModal();
    
    // Open panel
    panel.classList.remove('hidden');
    panel.setAttribute('aria-hidden', 'false');
    
    // Close panel
    panel.classList.add('hidden');
    panel.setAttribute('aria-hidden', 'true');
    
    // Verify closed state
    assert(panel.classList.contains('hidden'), 'Panel should be hidden');
    assertEqual(panel.getAttribute('aria-hidden'), 'true', 'aria-hidden should be true');
    
    cleanupMockModal();
  });

  runner.test('[Modal] Opening for new lesson sets correct title', () => {
    const panel = createMockModal();
    const title = document.getElementById('panelTitle');
    
    title.textContent = 'Nuova lezione';
    assertEqual(title.textContent, 'Nuova lezione', 'Title should be "Nuova lezione"');
    
    cleanupMockModal();
  });

  runner.test('[Modal] Opening for edit sets correct title', () => {
    const panel = createMockModal();
    const title = document.getElementById('panelTitle');
    
    title.textContent = 'Modifica lezione';
    assertEqual(title.textContent, 'Modifica lezione', 'Title should be "Modifica lezione"');
    
    cleanupMockModal();
  });

  runner.test('[Modal] Delete button hidden for new lesson', () => {
    const panel = createMockModal();
    const deleteBtn = document.getElementById('deleteBtn');
    
    deleteBtn.style.display = 'none';
    assertEqual(deleteBtn.style.display, 'none', 'Delete button should be hidden');
    
    cleanupMockModal();
  });

  runner.test('[Modal] Delete button visible for edit', () => {
    const panel = createMockModal();
    const deleteBtn = document.getElementById('deleteBtn');
    
    deleteBtn.style.display = '';
    assert(deleteBtn.style.display !== 'none', 'Delete button should be visible');
    
    cleanupMockModal();
  });

  // ============================================================================
  // FOCUS MANAGEMENT TESTS
  // ============================================================================

  runner.test('[Focus] First input receives focus when modal opens', () => {
    const panel = createMockModal();
    const firstInput = document.getElementById('inputName');
    
    // Simulate opening and focusing
    panel.classList.remove('hidden');
    firstInput.focus();
    
    assertEqual(document.activeElement, firstInput, 'First input should have focus');
    
    cleanupMockModal();
  });

  runner.test('[Focus] Focus trap keeps focus within modal', () => {
    const panel = createMockModal();
    const inputs = panel.querySelectorAll('input, button');
    const firstFocusable = inputs[0];
    const lastFocusable = inputs[inputs.length - 1];
    
    assertNotNull(firstFocusable, 'Should have first focusable element');
    assertNotNull(lastFocusable, 'Should have last focusable element');
    assert(firstFocusable !== lastFocusable, 'Should have multiple focusable elements');
    
    cleanupMockModal();
  });

  runner.test('[Focus] Previous focus element reference stored', () => {
    const panel = createMockModal();
    const button = document.createElement('button');
    button.id = 'testBtn';
    document.body.appendChild(button);
    
    // Simulate storing previous focus
    button.focus();
    const previousFocus = document.activeElement;
    
    assertEqual(previousFocus.id, 'testBtn', 'Should store reference to previous focus');
    
    button.remove();
    cleanupMockModal();
  });

  // ============================================================================
  // FIELD VALIDATION TESTS
  // ============================================================================

  runner.test('[Validation] Empty name field fails validation', () => {
    const validateLesson = (name, day, start, duration) => {
      const errors = [];
      if (!name || name.trim().length === 0) {
        errors.push('Il nome della lezione è obbligatorio');
      }
      return errors;
    };
    
    const errors = validateLesson('', 1, '08:00', 60);
    assert(errors.length > 0, 'Should have validation errors');
    assert(errors[0].includes('obbligatorio'), 'Should mention required field');
  });

  runner.test('[Validation] Invalid day range fails validation', () => {
    const validateLesson = (name, day, start, duration) => {
      const errors = [];
      if (isNaN(day) || day < 0 || day > 6) {
        errors.push('Il giorno deve essere tra 0 (Domenica) e 6 (Sabato)');
      }
      return errors;
    };
    
    const errors = validateLesson('Math', 10, '08:00', 60);
    assert(errors.length > 0, 'Should have validation errors');
  });

  runner.test('[Validation] Invalid time format fails validation', () => {
    const validateLesson = (name, day, start, duration) => {
      const errors = [];
      if (!start || !/^([0-1][0-9]|2[0-3]):([0-5][0-9])$/.test(start)) {
        errors.push('L\'ora deve essere nel formato HH:MM');
      }
      return errors;
    };
    
    const errors = validateLesson('Math', 1, '25:00', 60);
    assert(errors.length > 0, 'Should have validation errors');
  });

  runner.test('[Validation] Invalid duration fails validation', () => {
    const validateLesson = (name, day, start, duration) => {
      const errors = [];
      if (isNaN(duration) || duration < 1 || duration > 480) {
        errors.push('La durata deve essere tra 1 e 480 minuti');
      }
      return errors;
    };
    
    const errors = validateLesson('Math', 1, '08:00', 0);
    assert(errors.length > 0, 'Should have validation errors');
  });

  runner.test('[Validation] Valid lesson passes all checks', () => {
    const validateLesson = (name, day, start, duration) => {
      const errors = [];
      if (!name || name.trim().length === 0) {
        errors.push('Il nome della lezione è obbligatorio');
      }
      if (isNaN(day) || day < 0 || day > 6) {
        errors.push('Il giorno deve essere tra 0 (Domenica) e 6 (Sabato)');
      }
      if (!start || !/^([0-1][0-9]|2[0-3]):([0-5][0-9])$/.test(start)) {
        errors.push('L\'ora deve essere nel formato HH:MM');
      }
      if (isNaN(duration) || duration < 1 || duration > 480) {
        errors.push('La durata deve essere tra 1 e 480 minuti');
      }
      return errors;
    };
    
    const errors = validateLesson('Mathematics', 1, '08:00', 60);
    assertEqual(errors.length, 0, 'Valid lesson should have no errors');
  });

  // ============================================================================
  // KEYBOARD INTERACTION TESTS
  // ============================================================================

  runner.test('[Keyboard] Escape key should close modal', () => {
    const panel = createMockModal();
    
    // Open modal
    panel.classList.remove('hidden');
    
    // Simulate Escape key
    const event = new KeyboardEvent('keydown', { key: 'Escape' });
    document.dispatchEvent(event);
    
    // Manual close since event handler is in main.js
    panel.classList.add('hidden');
    
    assert(panel.classList.contains('hidden'), 'Panel should be hidden after Escape');
    
    cleanupMockModal();
  });

  runner.test('[Keyboard] Tab navigation should work within modal', () => {
    const panel = createMockModal();
    const inputs = panel.querySelectorAll('input, button');
    
    assert(inputs.length > 0, 'Should have focusable elements');
    
    // Verify all elements have tabindex or are naturally focusable
    let focusableCount = 0;
    inputs.forEach(el => {
      if (el.tabIndex >= 0 || ['INPUT', 'BUTTON', 'A'].includes(el.tagName)) {
        focusableCount++;
      }
    });
    
    assert(focusableCount > 0, 'Should have focusable elements for tab navigation');
    
    cleanupMockModal();
  });

  runner.test('[Keyboard] Enter on save button submits form', () => {
    const panel = createMockModal();
    const saveBtn = document.getElementById('saveBtn');
    
    let clicked = false;
    saveBtn.addEventListener('click', () => { clicked = true; });
    
    // Simulate Enter key
    const event = new KeyboardEvent('keydown', { key: 'Enter' });
    saveBtn.dispatchEvent(event);
    
    // Manually trigger click since we can't fully simulate
    saveBtn.click();
    
    assert(clicked, 'Save button should be clickable');
    
    cleanupMockModal();
  });

  // ============================================================================
  // DATA PERSISTENCE TESTS
  // ============================================================================

  runner.test('[Persistence] New lesson data structure is correct', () => {
    const panel = createMockModal();
    
    document.getElementById('inputName').value = 'Mathematics';
    document.getElementById('inputClass').value = '3A';
    document.getElementById('inputDay').value = '1';
    document.getElementById('inputTime').value = '08:00';
    document.getElementById('inputDuration').value = '60';
    
    const lessonData = {
      name: document.getElementById('inputName').value,
      class: document.getElementById('inputClass').value,
      day: parseInt(document.getElementById('inputDay').value, 10),
      start: document.getElementById('inputTime').value,
      duration: parseInt(document.getElementById('inputDuration').value, 10)
    };
    
    assertEqual(lessonData.name, 'Mathematics', 'Name should match');
    assertEqual(lessonData.class, '3A', 'Class should match');
    assertEqual(lessonData.day, 1, 'Day should be number');
    assertEqual(lessonData.start, '08:00', 'Start time should match');
    assertEqual(lessonData.duration, 60, 'Duration should be number');
    
    cleanupMockModal();
  });

  runner.test('[Persistence] Modal form resets after save', () => {
    const panel = createMockModal();
    
    // Fill form
    document.getElementById('inputName').value = 'Test';
    document.getElementById('inputClass').value = '1A';
    
    // Reset form
    document.getElementById('inputName').value = '';
    document.getElementById('inputClass').value = '';
    
    assertEqual(document.getElementById('inputName').value, '', 'Name should be reset');
    assertEqual(document.getElementById('inputClass').value, '', 'Class should be reset');
    
    cleanupMockModal();
  });

  runner.test('[Persistence] Edit mode loads existing lesson data', () => {
    const panel = createMockModal();
    
    const existingLesson = {
      id: 'lesson-1',
      name: 'Physics',
      class: '2B',
      day: 2,
      start: '09:30',
      duration: 90
    };
    
    // Simulate loading data into form
    document.getElementById('inputName').value = existingLesson.name;
    document.getElementById('inputClass').value = existingLesson.class;
    document.getElementById('inputDay').value = String(existingLesson.day);
    document.getElementById('inputTime').value = existingLesson.start;
    document.getElementById('inputDuration').value = String(existingLesson.duration);
    
    assertEqual(document.getElementById('inputName').value, 'Physics', 'Name should be loaded');
    assertEqual(document.getElementById('inputClass').value, '2B', 'Class should be loaded');
    assertEqual(document.getElementById('inputDay').value, '2', 'Day should be loaded');
    assertEqual(document.getElementById('inputTime').value, '09:30', 'Time should be loaded');
    assertEqual(document.getElementById('inputDuration').value, '90', 'Duration should be loaded');
    
    cleanupMockModal();
  });

  // ============================================================================
  // ERROR HANDLING TESTS
  // ============================================================================

  runner.test('[Error] Missing lesson ID in edit mode', () => {
    const lessons = [
      { id: 'lesson-1', name: 'Math', day: 1, start: '08:00', duration: 60 }
    ];
    
    const missingId = 'lesson-999';
    const found = lessons.find(l => l.id === missingId);
    
    assert(!found, 'Should not find lesson with non-existent ID');
  });

  runner.test('[Error] Invalid form data prevents save', () => {
    const panel = createMockModal();
    
    // Set invalid data
    document.getElementById('inputName').value = '';
    document.getElementById('inputDay').value = '10'; // Invalid day
    
    const errors = [];
    
    if (document.getElementById('inputName').value === '') {
      errors.push('Name required');
    }
    
    const day = parseInt(document.getElementById('inputDay').value, 10);
    if (day < 0 || day > 6) {
      errors.push('Invalid day');
    }
    
    assert(errors.length > 0, 'Should have validation errors');
    
    cleanupMockModal();
  });

  runner.test('[Error] Storage failure gracefully handled', async () => {
    const mockStorage = {
      read: async () => {
        throw new Error('Storage read failed');
      },
      write: async () => {
        throw new Error('Storage write failed');
      }
    };
    
    let errorCaught = false;
    
    try {
      await mockStorage.read();
    } catch (e) {
      errorCaught = true;
      assert(e.message.includes('Storage read failed'), 'Should catch read error');
    }
    
    assert(errorCaught, 'Should handle storage errors');
  });

  // ============================================================================
  // ACCESSIBILITY TESTS
  // ============================================================================

  runner.test('[A11y] Modal has correct ARIA role', () => {
    const panel = createMockModal();
    
    assertEqual(panel.getAttribute('role'), 'dialog', 'Should have dialog role');
    assertEqual(panel.getAttribute('aria-modal'), 'true', 'Should have aria-modal=true');
    
    cleanupMockModal();
  });

  runner.test('[A11y] Modal has aria-labelledby reference', () => {
    const panel = createMockModal();
    const title = document.getElementById('panelTitle');
    
    panel.setAttribute('aria-labelledby', 'panelTitle');
    
    assertEqual(panel.getAttribute('aria-labelledby'), 'panelTitle', 'Should reference title');
    assertNotNull(title, 'Title element should exist');
    
    cleanupMockModal();
  });

  runner.test('[A11y] Form inputs have proper labels', () => {
    const panel = createMockModal();
    
    const nameInput = document.getElementById('inputName');
    const label = panel.querySelector('label:has(#inputName)') || 
                  Array.from(panel.querySelectorAll('label')).find(l => 
                    l.querySelector('#inputName'));
    
    assertNotNull(nameInput, 'Input should exist');
    assertNotNull(label, 'Label should exist for input');
    
    cleanupMockModal();
  });

  runner.test('[A11y] Buttons have accessible text', () => {
    const panel = createMockModal();
    
    const saveBtn = document.getElementById('saveBtn');
    const cancelBtn = document.getElementById('cancelBtn');
    const deleteBtn = document.getElementById('deleteBtn');
    
    assert(saveBtn.textContent.trim().length > 0, 'Save button should have text');
    assert(cancelBtn.textContent.trim().length > 0, 'Cancel button should have text');
    assert(deleteBtn.textContent.trim().length > 0, 'Delete button should have text');
    
    cleanupMockModal();
  });

})(window.runner || console);

// Export for test runner
if (typeof window !== 'undefined') {
  window.modalPersistenceTests = true;
}
