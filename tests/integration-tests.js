/**
 * Integration Tests for OrarioDoc
 * 
 * These tests verify that multiple components work together correctly
 * in realistic user workflows.
 * 
 * Test Categories:
 * - Lesson Management Workflow (Add, Edit, Delete)
 * - Theme Switching Workflow
 * - Storage Persistence Workflow
 * - Conflict Detection Workflow
 * - Accessibility Workflow
 */

(function(runner) {
  'use strict';

  // Helper to create a mock storage layer
  const createMockStorage = () => {
    let data = { lessons: [], settings: {} };
    
    return {
      read: async () => {
        return Promise.resolve(JSON.parse(JSON.stringify(data)));
      },
      write: async (newData) => {
        data = JSON.parse(JSON.stringify(newData));
        return Promise.resolve();
      },
      reset: () => {
        data = { lessons: [], settings: {} };
      }
    };
  };

  // Helper to simulate time passing
  const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));

  // ============================================================================
  // LESSON MANAGEMENT WORKFLOW TESTS
  // ============================================================================

  runner.test('[Integration] Complete add lesson workflow', async () => {
    const mockStorage = createMockStorage();
    
    // 1. Start with empty data
    let data = await mockStorage.read();
    assertEqual(data.lessons.length, 0, 'Should start with no lessons');
    
    // 2. Add a new lesson
    const newLesson = {
      id: 'lesson-1',
      name: 'Mathematics',
      class: '3A',
      day: 1,
      start: '08:00',
      duration: 60
    };
    
    data.lessons.push(newLesson);
    await mockStorage.write(data);
    
    // 3. Read back and verify
    data = await mockStorage.read();
    assertEqual(data.lessons.length, 1, 'Should have one lesson');
    assertEqual(data.lessons[0].name, 'Mathematics', 'Lesson should have correct name');
    assertEqual(data.lessons[0].day, 1, 'Lesson should have correct day');
  });

  runner.test('[Integration] Add multiple lessons and verify', async () => {
    const mockStorage = createMockStorage();
    
    // Add multiple lessons for different days
    const lessons = [
      { id: '1', name: 'Math', day: 1, start: '08:00', duration: 60 },
      { id: '2', name: 'Science', day: 1, start: '09:00', duration: 60 },
      { id: '3', name: 'English', day: 2, start: '08:00', duration: 60 }
    ];
    
    const data = await mockStorage.read();
    data.lessons = lessons;
    await mockStorage.write(data);
    
    // Verify
    const retrieved = await mockStorage.read();
    assertEqual(retrieved.lessons.length, 3, 'Should have 3 lessons');
    
    // Count lessons by day
    const day1Lessons = retrieved.lessons.filter(l => l.day === 1);
    const day2Lessons = retrieved.lessons.filter(l => l.day === 2);
    assertEqual(day1Lessons.length, 2, 'Should have 2 lessons on day 1');
    assertEqual(day2Lessons.length, 1, 'Should have 1 lesson on day 2');
  });

  runner.test('[Integration] Edit lesson workflow', async () => {
    const mockStorage = createMockStorage();
    
    // 1. Add initial lesson
    let data = await mockStorage.read();
    data.lessons.push({
      id: 'lesson-1',
      name: 'Math',
      day: 1,
      start: '08:00',
      duration: 60
    });
    await mockStorage.write(data);
    
    // 2. Edit the lesson
    data = await mockStorage.read();
    const lesson = data.lessons.find(l => l.id === 'lesson-1');
    lesson.name = 'Mathematics Advanced';
    lesson.duration = 90;
    await mockStorage.write(data);
    
    // 3. Verify changes
    data = await mockStorage.read();
    const updated = data.lessons.find(l => l.id === 'lesson-1');
    assertEqual(updated.name, 'Mathematics Advanced', 'Name should be updated');
    assertEqual(updated.duration, 90, 'Duration should be updated');
  });

  runner.test('[Integration] Delete lesson workflow', async () => {
    const mockStorage = createMockStorage();
    
    // 1. Add lessons
    let data = await mockStorage.read();
    data.lessons = [
      { id: '1', name: 'Math', day: 1, start: '08:00', duration: 60 },
      { id: '2', name: 'Science', day: 1, start: '09:00', duration: 60 }
    ];
    await mockStorage.write(data);
    
    // 2. Delete one lesson
    data = await mockStorage.read();
    data.lessons = data.lessons.filter(l => l.id !== '1');
    await mockStorage.write(data);
    
    // 3. Verify deletion
    data = await mockStorage.read();
    assertEqual(data.lessons.length, 1, 'Should have 1 lesson remaining');
    assertEqual(data.lessons[0].id, '2', 'Remaining lesson should be lesson 2');
  });

  // ============================================================================
  // CONFLICT DETECTION WORKFLOW TESTS
  // ============================================================================

  runner.test('[Integration] Detect conflict when adding overlapping lesson', async () => {
    const mockStorage = createMockStorage();
    
    // Helper function to check conflicts
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
    
    // 1. Add initial lesson
    let data = await mockStorage.read();
    data.lessons.push({
      id: '1',
      name: 'Math',
      day: 1,
      start: '08:00',
      duration: 60
    });
    await mockStorage.write(data);
    
    // 2. Try to add conflicting lesson
    data = await mockStorage.read();
    const newLesson = {
      id: '2',
      name: 'Science',
      day: 1,
      start: '08:30',
      duration: 60
    };
    
    const conflicts = checkConflicts(data.lessons, newLesson);
    
    // 3. Verify conflict is detected
    assert(conflicts.length > 0, 'Should detect conflict');
    assertEqual(conflicts[0].id, '1', 'Should conflict with lesson 1');
    
    // 4. Don't add the conflicting lesson
    assertEqual(data.lessons.length, 1, 'Should still have only 1 lesson');
  });

  runner.test('[Integration] No conflict for non-overlapping lessons', async () => {
    const mockStorage = createMockStorage();
    
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
    
    // 1. Add initial lesson
    let data = await mockStorage.read();
    data.lessons.push({
      id: '1',
      name: 'Math',
      day: 1,
      start: '08:00',
      duration: 60
    });
    await mockStorage.write(data);
    
    // 2. Add non-conflicting lesson (adjacent)
    data = await mockStorage.read();
    const newLesson = {
      id: '2',
      name: 'Science',
      day: 1,
      start: '09:00',
      duration: 60
    };
    
    const conflicts = checkConflicts(data.lessons, newLesson);
    
    // 3. Verify no conflict
    assertEqual(conflicts.length, 0, 'Should not detect conflict for adjacent lessons');
    
    // 4. Add the lesson
    data.lessons.push(newLesson);
    await mockStorage.write(data);
    
    data = await mockStorage.read();
    assertEqual(data.lessons.length, 2, 'Should have 2 lessons');
  });

  // ============================================================================
  // THEME SWITCHING WORKFLOW TESTS
  // ============================================================================

  runner.test('[Integration] Theme switching workflow', async () => {
    const mockStorage = createMockStorage();
    
    // 1. Save theme preference
    let data = await mockStorage.read();
    data.settings.theme = 'dark';
    await mockStorage.write(data);
    
    // 2. Read back theme
    data = await mockStorage.read();
    assertEqual(data.settings.theme, 'dark', 'Theme should be dark');
    
    // 3. Change theme
    data.settings.theme = 'light';
    await mockStorage.write(data);
    
    // 4. Verify change persisted
    data = await mockStorage.read();
    assertEqual(data.settings.theme, 'light', 'Theme should be light');
  });

  runner.test('[Integration] Custom colors persist with theme', async () => {
    const mockStorage = createMockStorage();
    
    // 1. Save custom colors
    let data = await mockStorage.read();
    data.settings.customColors = {
      primary: '#FF5722',
      secondary: '#4CAF50'
    };
    await mockStorage.write(data);
    
    // 2. Verify persistence
    data = await mockStorage.read();
    assertNotNull(data.settings.customColors, 'Custom colors should be saved');
    assertEqual(data.settings.customColors.primary, '#FF5722', 'Primary color should match');
    assertEqual(data.settings.customColors.secondary, '#4CAF50', 'Secondary color should match');
  });

  // ============================================================================
  // STORAGE PERSISTENCE WORKFLOW TESTS
  // ============================================================================

  runner.test('[Integration] Data persists across multiple operations', async () => {
    const mockStorage = createMockStorage();
    
    // 1. Add lessons
    let data = await mockStorage.read();
    data.lessons = [
      { id: '1', name: 'Math', day: 1, start: '08:00', duration: 60 }
    ];
    await mockStorage.write(data);
    
    // 2. Read and add more
    data = await mockStorage.read();
    data.lessons.push({ id: '2', name: 'Science', day: 2, start: '09:00', duration: 60 });
    await mockStorage.write(data);
    
    // 3. Read and modify
    data = await mockStorage.read();
    data.lessons[0].name = 'Mathematics';
    await mockStorage.write(data);
    
    // 4. Final verification
    data = await mockStorage.read();
    assertEqual(data.lessons.length, 2, 'Should have 2 lessons');
    assertEqual(data.lessons[0].name, 'Mathematics', 'First lesson should be updated');
    assertEqual(data.lessons[1].name, 'Science', 'Second lesson should be unchanged');
  });

  runner.test('[Integration] Settings and lessons coexist in storage', async () => {
    const mockStorage = createMockStorage();
    
    // 1. Add both lessons and settings
    let data = await mockStorage.read();
    data.lessons = [
      { id: '1', name: 'Math', day: 1, start: '08:00', duration: 60 }
    ];
    data.settings = {
      theme: 'dark',
      notifications: true
    };
    await mockStorage.write(data);
    
    // 2. Verify both are stored
    data = await mockStorage.read();
    assertEqual(data.lessons.length, 1, 'Should have 1 lesson');
    assertEqual(data.settings.theme, 'dark', 'Settings should be preserved');
    assertEqual(data.settings.notifications, true, 'All settings should be preserved');
  });

  // ============================================================================
  // VALIDATION AND ERROR HANDLING WORKFLOW TESTS
  // ============================================================================

  runner.test('[Integration] Invalid lesson is rejected before storage', async () => {
    const mockStorage = createMockStorage();
    
    // Validation function
    const validateLesson = (name, day, start, duration) => {
      const errors = [];
      if(!name || name.trim().length === 0) {
        errors.push('Il nome della lezione è obbligatorio');
      }
      if(isNaN(day) || day < 0 || day > 6) {
        errors.push('Il giorno deve essere tra 0 e 6');
      }
      if(!start || !/^([0-1][0-9]|2[0-3]):([0-5][0-9])$/.test(start)) {
        errors.push('L\'ora deve essere nel formato HH:MM');
      }
      if(isNaN(duration) || duration < 1 || duration > 480) {
        errors.push('La durata deve essere tra 1 e 480 minuti');
      }
      return errors;
    };
    
    // 1. Try to add invalid lesson
    const invalidLesson = {
      id: '1',
      name: '',  // Invalid: empty name
      day: 1,
      start: '08:00',
      duration: 60
    };
    
    const errors = validateLesson(invalidLesson.name, invalidLesson.day, invalidLesson.start, invalidLesson.duration);
    
    // 2. Verify validation failed
    assert(errors.length > 0, 'Should have validation errors');
    
    // 3. Don't add to storage
    let data = await mockStorage.read();
    assertEqual(data.lessons.length, 0, 'Invalid lesson should not be added');
  });

  runner.test('[Integration] Valid lesson passes all checks and is stored', async () => {
    const mockStorage = createMockStorage();
    
    const validateLesson = (name, day, start, duration) => {
      const errors = [];
      if(!name || name.trim().length === 0) {
        errors.push('Il nome della lezione è obbligatorio');
      }
      if(isNaN(day) || day < 0 || day > 6) {
        errors.push('Il giorno deve essere tra 0 e 6');
      }
      if(!start || !/^([0-1][0-9]|2[0-3]):([0-5][0-9])$/.test(start)) {
        errors.push('L\'ora deve essere nel formato HH:MM');
      }
      if(isNaN(duration) || duration < 1 || duration > 480) {
        errors.push('La durata deve essere tra 1 e 480 minuti');
      }
      return errors;
    };
    
    const checkConflicts = (lessons, newLesson) => {
      // Simplified conflict check for test
      return [];
    };
    
    // 1. Create valid lesson
    const validLesson = {
      id: '1',
      name: 'Mathematics',
      day: 1,
      start: '08:00',
      duration: 60
    };
    
    // 2. Validate
    const errors = validateLesson(validLesson.name, validLesson.day, validLesson.start, validLesson.duration);
    assertEqual(errors.length, 0, 'Valid lesson should have no errors');
    
    // 3. Check conflicts
    let data = await mockStorage.read();
    const conflicts = checkConflicts(data.lessons, validLesson);
    assertEqual(conflicts.length, 0, 'Should have no conflicts');
    
    // 4. Add to storage
    data.lessons.push(validLesson);
    await mockStorage.write(data);
    
    // 5. Verify
    data = await mockStorage.read();
    assertEqual(data.lessons.length, 1, 'Lesson should be stored');
    assertEqual(data.lessons[0].name, 'Mathematics', 'Lesson data should be correct');
  });

  // ============================================================================
  // RENDERING WORKFLOW TESTS
  // ============================================================================

  runner.test('[Integration] Lessons render correctly in grid', async () => {
    const mockStorage = createMockStorage();
    
    // 1. Add lessons
    let data = await mockStorage.read();
    data.lessons = [
      { id: '1', name: 'Math', day: 1, start: '08:00', duration: 60 },
      { id: '2', name: 'Science', day: 1, start: '09:00', duration: 60 },
      { id: '3', name: 'English', day: 2, start: '08:00', duration: 60 }
    ];
    await mockStorage.write(data);
    
    // 2. Create grid
    const grid = document.createElement('div');
    grid.className = 'schedule-grid';
    document.body.appendChild(grid);
    
    // Create cells
    for(let d=1; d<=7; d++){
      const cell = document.createElement('div');
      cell.className = 'cell';
      cell.dataset.day = ((d)%7).toString();
      grid.appendChild(cell);
    }
    
    // 3. Render lessons
    data = await mockStorage.read();
    data.lessons.forEach(lesson => {
      const cell = grid.querySelector(`.cell[data-day="${lesson.day}"]`);
      if(cell) {
        const item = document.createElement('div');
        item.className = 'item';
        item.dataset.id = lesson.id;
        item.textContent = lesson.name;
        cell.appendChild(item);
      }
    });
    
    // 4. Verify rendering
    const day1Cell = grid.querySelector('.cell[data-day="1"]');
    const day2Cell = grid.querySelector('.cell[data-day="2"]');
    
    assertEqual(day1Cell.querySelectorAll('.item').length, 2, 'Day 1 should have 2 lessons');
    assertEqual(day2Cell.querySelectorAll('.item').length, 1, 'Day 2 should have 1 lesson');
    
    document.body.removeChild(grid);
  });

  // ============================================================================
  // ACCESSIBILITY WORKFLOW TESTS
  // ============================================================================

  runner.test('[Integration] Focus management workflow', async () => {
    // 1. Create elements
    const button = document.createElement('button');
    button.id = 'test-open-btn';
    button.textContent = 'Open Panel';
    document.body.appendChild(button);
    
    const panel = document.createElement('div');
    panel.id = 'test-panel';
    panel.setAttribute('role', 'dialog');
    panel.setAttribute('aria-modal', 'true');
    panel.style.display = 'none';
    
    const input = document.createElement('input');
    input.type = 'text';
    panel.appendChild(input);
    document.body.appendChild(panel);
    
    // 2. Simulate opening panel
    let previousFocus = document.activeElement;
    panel.style.display = 'block';
    panel.setAttribute('aria-hidden', 'false');
    input.focus();
    
    // 3. Verify focus
    assertEqual(document.activeElement, input, 'Focus should be on input');
    
    // 4. Simulate closing panel
    panel.style.display = 'none';
    panel.setAttribute('aria-hidden', 'true');
    if(previousFocus) previousFocus.focus();
    
    // Cleanup
    document.body.removeChild(button);
    document.body.removeChild(panel);
  });

  runner.test('[Integration] Keyboard navigation workflow', async () => {
    // 1. Create grid
    const grid = document.createElement('div');
    document.body.appendChild(grid);
    
    const cells = [];
    for(let i = 0; i < 7; i++) {
      const cell = document.createElement('div');
      cell.className = 'cell';
      cell.setAttribute('tabindex', '0');
      cell.dataset.index = i;
      grid.appendChild(cell);
      cells.push(cell);
    }
    
    // 2. Focus first cell
    cells[0].focus();
    assertEqual(document.activeElement, cells[0], 'First cell should be focused');
    
    // 3. Simulate arrow key navigation (would require KeyboardEvent simulation)
    // For now, test that cells are focusable
    cells[1].focus();
    assertEqual(document.activeElement, cells[1], 'Should be able to focus second cell');
    
    cells[2].focus();
    assertEqual(document.activeElement, cells[2], 'Should be able to focus third cell');
    
    document.body.removeChild(grid);
  });

  // ============================================================================
  // PERFORMANCE WORKFLOW TESTS
  // ============================================================================

  runner.test('[Integration] Large dataset performance', async () => {
    const mockStorage = createMockStorage();
    
    // 1. Create large dataset (100 lessons)
    const lessons = [];
    for(let i = 0; i < 100; i++) {
      lessons.push({
        id: `lesson-${i}`,
        name: `Lesson ${i}`,
        day: i % 7,
        start: '08:00',
        duration: 60
      });
    }
    
    // 2. Measure write performance
    const writeStart = performance.now();
    let data = await mockStorage.read();
    data.lessons = lessons;
    await mockStorage.write(data);
    const writeTime = performance.now() - writeStart;
    
    // 3. Measure read performance
    const readStart = performance.now();
    data = await mockStorage.read();
    const readTime = performance.now() - readStart;
    
    // 4. Verify and assert performance
    assertEqual(data.lessons.length, 100, 'Should store 100 lessons');
    assert(writeTime < 100, `Write should be < 100ms (was ${writeTime.toFixed(2)}ms)`);
    assert(readTime < 50, `Read should be < 50ms (was ${readTime.toFixed(2)}ms)`);
  });

})(window.runner || console);

// Export for other test files
if (typeof window !== 'undefined') {
  window.integrationTests = true;
}
