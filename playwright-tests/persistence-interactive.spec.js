/**
 * Persistence and Interactive Logic Tests for OrarioDoc
 * 
 * Tests data persistence (IndexedDB/localStorage) and interactive
 * event handling (modal, clicks, keyboard navigation, focus management)
 */

const { test, expect } = require('@playwright/test');

test.describe('Data Persistence', () => {
  
  test('should persist lesson data to storage', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('domcontentloaded');
    
    // Clear any existing data
    await page.evaluate(() => {
      localStorage.clear();
      return indexedDB.deleteDatabase('OrarioDocDB');
    });
    
    // Add a new lesson
    await page.click('#addBtn');
    await page.waitForSelector('#panel:not(.hidden)');
    
    await page.fill('#inputName', 'Matematica');
    await page.fill('#inputClass', '3A');
    await page.selectOption('#inputDay', '1');
    await page.fill('#inputTime', '08:00');
    await page.fill('#inputDuration', '60');
    
    await page.click('#saveBtn');
    await page.waitForSelector('#panel.hidden');
    
    // Verify lesson appears in grid
    const lessonExists = await page.locator('.item:has-text("Matematica")').count();
    expect(lessonExists).toBeGreaterThan(0);
    
    // Reload page and verify data persists
    await page.reload();
    await page.waitForLoadState('domcontentloaded');
    
    const lessonAfterReload = await page.locator('.item:has-text("Matematica")').count();
    expect(lessonAfterReload).toBeGreaterThan(0);
  });

  test('should restore multiple lessons after reload', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('domcontentloaded');
    
    // Clear data
    await page.evaluate(() => {
      localStorage.clear();
      return indexedDB.deleteDatabase('OrarioDocDB');
    });
    
    // Add multiple lessons
    const lessons = [
      { name: 'Matematica', class: '3A', day: '1', time: '08:00', duration: '60' },
      { name: 'Fisica', class: '3B', day: '2', time: '09:00', duration: '60' },
      { name: 'Informatica', class: '3C', day: '3', time: '10:00', duration: '60' }
    ];
    
    for (const lesson of lessons) {
      await page.click('#addBtn');
      await page.waitForSelector('#panel:not(.hidden)');
      
      await page.fill('#inputName', lesson.name);
      await page.fill('#inputClass', lesson.class);
      await page.selectOption('#inputDay', lesson.day);
      await page.fill('#inputTime', lesson.time);
      await page.fill('#inputDuration', lesson.duration);
      
      await page.click('#saveBtn');
      await page.waitForSelector('#panel.hidden');
    }
    
    // Reload and verify all lessons persist
    await page.reload();
    await page.waitForLoadState('domcontentloaded');
    
    for (const lesson of lessons) {
      const count = await page.locator(`.item:has-text("${lesson.name}")`).count();
      expect(count).toBeGreaterThan(0);
    }
  });

  test('should handle IndexedDB migration from localStorage', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('domcontentloaded');
    
    // Set data in localStorage first
    await page.evaluate(() => {
      const data = {
        lessons: [
          { id: 'test-1', name: 'Storia', class: '2A', day: 1, start: '11:00', duration: 60 }
        ],
        settings: {}
      };
      localStorage.setItem('orariodoc:v1', JSON.stringify(data));
      return indexedDB.deleteDatabase('OrarioDocDB');
    });
    
    // Reload to trigger migration
    await page.reload();
    await page.waitForLoadState('domcontentloaded');
    
    // Wait for migration to complete
    await page.waitForTimeout(1000);
    
    // Verify lesson appears (from migrated data)
    const lessonCount = await page.locator('.item:has-text("Storia")').count();
    expect(lessonCount).toBeGreaterThan(0);
  });

  test('should update existing lesson and persist changes', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('domcontentloaded');
    
    // Clear and add a lesson
    await page.evaluate(() => {
      localStorage.clear();
      return indexedDB.deleteDatabase('OrarioDocDB');
    });
    
    await page.click('#addBtn');
    await page.waitForSelector('#panel:not(.hidden)');
    await page.fill('#inputName', 'Chimica');
    await page.fill('#inputClass', '4A');
    await page.click('#saveBtn');
    await page.waitForSelector('#panel.hidden');
    
    // Click lesson to edit
    await page.click('.item:has-text("Chimica")');
    await page.waitForSelector('#panel:not(.hidden)');
    
    // Verify edit mode
    const panelTitle = await page.locator('#panelTitle').textContent();
    expect(panelTitle).toContain('Modifica');
    
    // Update lesson
    await page.fill('#inputName', 'Chimica Organica');
    await page.click('#saveBtn');
    await page.waitForSelector('#panel.hidden');
    
    // Reload and verify update persisted
    await page.reload();
    await page.waitForLoadState('domcontentloaded');
    
    const updatedLesson = await page.locator('.item:has-text("Chimica Organica")').count();
    expect(updatedLesson).toBeGreaterThan(0);
    
    const oldLesson = await page.locator('.item:has-text("Chimica")').count();
    expect(oldLesson).toBe(0);
  });

  test('should delete lesson and persist deletion', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('domcontentloaded');
    
    // Clear and add a lesson
    await page.evaluate(() => {
      localStorage.clear();
      return indexedDB.deleteDatabase('OrarioDocDB');
    });
    
    await page.click('#addBtn');
    await page.waitForSelector('#panel:not(.hidden)');
    await page.fill('#inputName', 'Geografia');
    await page.click('#saveBtn');
    await page.waitForSelector('#panel.hidden');
    
    // Click lesson to edit
    await page.click('.item:has-text("Geografia")');
    await page.waitForSelector('#panel:not(.hidden)');
    
    // Handle confirm dialog
    page.on('dialog', dialog => dialog.accept());
    
    // Delete lesson
    await page.click('#deleteBtn');
    await page.waitForSelector('#panel.hidden');
    
    // Verify lesson is gone
    const lessonCount = await page.locator('.item:has-text("Geografia")').count();
    expect(lessonCount).toBe(0);
    
    // Reload and verify deletion persisted
    await page.reload();
    await page.waitForLoadState('domcontentloaded');
    
    const lessonAfterReload = await page.locator('.item:has-text("Geografia")').count();
    expect(lessonAfterReload).toBe(0);
  });
});

test.describe('Modal Management', () => {
  
  test('should open modal on add button click', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('domcontentloaded');
    
    // Initially modal should be hidden
    const isHidden = await page.locator('#panel').evaluate(el => el.classList.contains('hidden'));
    expect(isHidden).toBe(true);
    
    // Click add button
    await page.click('#addBtn');
    
    // Modal should be visible
    const isVisible = await page.locator('#panel').evaluate(el => !el.classList.contains('hidden'));
    expect(isVisible).toBe(true);
    
    // Check ARIA attributes
    const ariaHidden = await page.locator('#panel').getAttribute('aria-hidden');
    expect(ariaHidden).toBe('false');
  });

  test('should open modal on grid cell click', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('domcontentloaded');
    
    // Click on a grid cell
    await page.click('.cell[data-day="1"]');
    
    // Modal should open
    const isVisible = await page.locator('#panel').evaluate(el => !el.classList.contains('hidden'));
    expect(isVisible).toBe(true);
    
    // Day should be pre-filled
    const dayValue = await page.inputValue('#inputDay');
    expect(dayValue).toBe('1');
  });

  test('should close modal on cancel button', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('domcontentloaded');
    
    // Open modal
    await page.click('#addBtn');
    await page.waitForSelector('#panel:not(.hidden)');
    
    // Close modal
    await page.click('#cancelBtn');
    
    // Modal should be hidden
    const isHidden = await page.locator('#panel').evaluate(el => el.classList.contains('hidden'));
    expect(isHidden).toBe(true);
    
    // Check ARIA attributes
    const ariaHidden = await page.locator('#panel').getAttribute('aria-hidden');
    expect(ariaHidden).toBe('true');
  });

  test('should close modal on Escape key', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('domcontentloaded');
    
    // Open modal
    await page.click('#addBtn');
    await page.waitForSelector('#panel:not(.hidden)');
    
    // Press Escape
    await page.keyboard.press('Escape');
    
    // Modal should be hidden
    const isHidden = await page.locator('#panel').evaluate(el => el.classList.contains('hidden'));
    expect(isHidden).toBe(true);
  });

  test('should focus first input when modal opens', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('domcontentloaded');
    
    // Open modal
    await page.click('#addBtn');
    await page.waitForSelector('#panel:not(.hidden)');
    
    // Wait for focus to be set
    await page.waitForTimeout(200);
    
    // Check that inputName has focus
    const focusedElement = await page.evaluate(() => document.activeElement?.id);
    expect(focusedElement).toBe('inputName');
  });

  test('should restore focus after modal closes', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('domcontentloaded');
    
    // Focus add button
    await page.focus('#addBtn');
    const focusedBeforeModal = await page.evaluate(() => document.activeElement?.id);
    expect(focusedBeforeModal).toBe('addBtn');
    
    // Open and close modal
    await page.click('#addBtn');
    await page.waitForSelector('#panel:not(.hidden)');
    await page.click('#cancelBtn');
    await page.waitForSelector('#panel.hidden');
    
    // Wait for focus restoration
    await page.waitForTimeout(100);
    
    // Focus should be restored to add button
    const focusedAfterModal = await page.evaluate(() => document.activeElement?.id);
    expect(focusedAfterModal).toBe('addBtn');
  });

  test('should trap focus within modal', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('domcontentloaded');
    
    // Open modal
    await page.click('#addBtn');
    await page.waitForSelector('#panel:not(.hidden)');
    
    // Tab through all focusable elements
    await page.keyboard.press('Tab'); // to inputClass
    await page.keyboard.press('Tab'); // to inputDay
    await page.keyboard.press('Tab'); // to inputTime
    await page.keyboard.press('Tab'); // to inputDuration
    await page.keyboard.press('Tab'); // to saveBtn
    await page.keyboard.press('Tab'); // to cancelBtn
    await page.keyboard.press('Tab'); // should wrap to inputName
    
    // Check if we're back at the first input
    const focusedElement = await page.evaluate(() => document.activeElement?.id);
    expect(focusedElement).toBe('inputName');
  });
});

test.describe('Form Validation', () => {
  
  test('should validate empty lesson name', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('domcontentloaded');
    
    // Clear data
    await page.evaluate(() => {
      localStorage.clear();
      return indexedDB.deleteDatabase('OrarioDocDB');
    });
    
    // Open modal and try to save without name
    await page.click('#addBtn');
    await page.waitForSelector('#panel:not(.hidden)');
    await page.fill('#inputName', '');
    await page.click('#saveBtn');
    
    // Modal should still be open (validation failed)
    const isVisible = await page.locator('#panel').evaluate(el => !el.classList.contains('hidden'));
    expect(isVisible).toBe(true);
  });

  test('should validate invalid time format', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('domcontentloaded');
    
    await page.click('#addBtn');
    await page.waitForSelector('#panel:not(.hidden)');
    
    await page.fill('#inputName', 'Test');
    
    // Try invalid time
    await page.evaluate(() => {
      document.getElementById('inputTime').value = '25:00';
    });
    
    await page.click('#saveBtn');
    
    // Modal should still be open
    const isVisible = await page.locator('#panel').evaluate(el => !el.classList.contains('hidden'));
    expect(isVisible).toBe(true);
  });

  test('should detect time conflicts', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('domcontentloaded');
    
    // Clear data
    await page.evaluate(() => {
      localStorage.clear();
      return indexedDB.deleteDatabase('OrarioDocDB');
    });
    
    // Add first lesson
    await page.click('#addBtn');
    await page.waitForSelector('#panel:not(.hidden)');
    await page.fill('#inputName', 'Matematica');
    await page.selectOption('#inputDay', '1');
    await page.fill('#inputTime', '08:00');
    await page.fill('#inputDuration', '60');
    await page.click('#saveBtn');
    await page.waitForSelector('#panel.hidden');
    
    // Try to add conflicting lesson
    await page.click('#addBtn');
    await page.waitForSelector('#panel:not(.hidden)');
    await page.fill('#inputName', 'Fisica');
    await page.selectOption('#inputDay', '1');
    await page.fill('#inputTime', '08:30'); // Overlaps with previous lesson
    await page.fill('#inputDuration', '60');
    await page.click('#saveBtn');
    
    // Modal should still be open (conflict detected)
    const isVisible = await page.locator('#panel').evaluate(el => !el.classList.contains('hidden'));
    expect(isVisible).toBe(true);
    
    // Only first lesson should exist
    const matematicaCount = await page.locator('.item:has-text("Matematica")').count();
    const fisicaCount = await page.locator('.item:has-text("Fisica")').count();
    expect(matematicaCount).toBe(1);
    expect(fisicaCount).toBe(0);
  });
});

test.describe('Keyboard Navigation', () => {
  
  test('should activate cell with Enter key', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('domcontentloaded');
    
    // Focus on first cell
    await page.focus('.cell[data-day="1"]');
    
    // Press Enter
    await page.keyboard.press('Enter');
    
    // Modal should open
    const isVisible = await page.locator('#panel').evaluate(el => !el.classList.contains('hidden'));
    expect(isVisible).toBe(true);
  });

  test('should activate cell with Space key', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('domcontentloaded');
    
    // Focus on first cell
    await page.focus('.cell[data-day="2"]');
    
    // Press Space
    await page.keyboard.press('Space');
    
    // Modal should open
    const isVisible = await page.locator('#panel').evaluate(el => !el.classList.contains('hidden'));
    expect(isVisible).toBe(true);
  });

  test('should navigate cells with arrow keys', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('domcontentloaded');
    
    // Focus first cell
    await page.focus('.cell[data-day="1"]');
    
    // Navigate right
    await page.keyboard.press('ArrowRight');
    let focusedDay = await page.evaluate(() => document.activeElement?.dataset.day);
    expect(focusedDay).toBe('2');
    
    // Navigate left
    await page.keyboard.press('ArrowLeft');
    focusedDay = await page.evaluate(() => document.activeElement?.dataset.day);
    expect(focusedDay).toBe('1');
  });

  test('should activate lesson item with Enter key', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('domcontentloaded');
    
    // Clear and add a lesson
    await page.evaluate(() => {
      localStorage.clear();
      return indexedDB.deleteDatabase('OrarioDocDB');
    });
    
    await page.click('#addBtn');
    await page.waitForSelector('#panel:not(.hidden)');
    await page.fill('#inputName', 'Test Lesson');
    await page.click('#saveBtn');
    await page.waitForSelector('#panel.hidden');
    
    // Focus on lesson item
    await page.focus('.item:has-text("Test Lesson")');
    
    // Press Enter
    await page.keyboard.press('Enter');
    
    // Edit modal should open
    const isVisible = await page.locator('#panel').evaluate(el => !el.classList.contains('hidden'));
    expect(isVisible).toBe(true);
    
    const panelTitle = await page.locator('#panelTitle').textContent();
    expect(panelTitle).toContain('Modifica');
  });
});

test.describe('Accessibility', () => {
  
  test('should have proper ARIA attributes on grid', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('domcontentloaded');
    
    // Check grid role
    const gridRole = await page.locator('#scheduleGrid').getAttribute('role');
    expect(gridRole).toBe('grid');
    
    // Check grid has aria-label
    const ariaLabel = await page.locator('#scheduleGrid').getAttribute('aria-label');
    expect(ariaLabel).toBeTruthy();
  });

  test('should have proper ARIA attributes on cells', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('domcontentloaded');
    
    // Check cell roles
    const cellRole = await page.locator('.cell').first().getAttribute('role');
    expect(cellRole).toBe('gridcell');
    
    // Check cells have aria-label
    const ariaLabel = await page.locator('.cell').first().getAttribute('aria-label');
    expect(ariaLabel).toBeTruthy();
    
    // Check cells are keyboard accessible
    const tabindex = await page.locator('.cell').first().getAttribute('tabindex');
    expect(tabindex).toBe('0');
  });

  test('should have proper ARIA attributes on modal', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('domcontentloaded');
    
    // Check modal role
    const role = await page.locator('#panel').getAttribute('role');
    expect(role).toBe('dialog');
    
    // Check aria-modal
    const ariaModal = await page.locator('#panel').getAttribute('aria-modal');
    expect(ariaModal).toBe('true');
    
    // Check aria-labelledby
    const ariaLabelledBy = await page.locator('#panel').getAttribute('aria-labelledby');
    expect(ariaLabelledBy).toBe('panelTitle');
  });

  test('should have live region for announcements', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('domcontentloaded');
    
    // Check announcements region exists
    const announcementsExists = await page.locator('#announcements').count();
    expect(announcementsExists).toBe(1);
    
    // Check ARIA attributes
    const role = await page.locator('#announcements').getAttribute('role');
    expect(role).toBe('status');
    
    const ariaLive = await page.locator('#announcements').getAttribute('aria-live');
    expect(ariaLive).toBe('polite');
    
    const ariaAtomic = await page.locator('#announcements').getAttribute('aria-atomic');
    expect(ariaAtomic).toBe('true');
  });

  test('should announce actions to screen readers', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('domcontentloaded');
    
    // Clear data
    await page.evaluate(() => {
      localStorage.clear();
      return indexedDB.deleteDatabase('OrarioDocDB');
    });
    
    // Add a lesson and check for announcement
    await page.click('#addBtn');
    await page.waitForSelector('#panel:not(.hidden)');
    await page.fill('#inputName', 'Test');
    await page.click('#saveBtn');
    await page.waitForSelector('#panel.hidden');
    
    // Wait for announcement
    await page.waitForTimeout(500);
    
    // Check announcements region was updated
    const announcement = await page.locator('#announcements').textContent();
    expect(announcement.length).toBeGreaterThan(0);
  });

  test('should have proper labels on form inputs', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('domcontentloaded');
    
    await page.click('#addBtn');
    await page.waitForSelector('#panel:not(.hidden)');
    
    // Check that inputs have associated labels
    const inputs = ['inputName', 'inputClass', 'inputDay', 'inputTime', 'inputDuration'];
    
    for (const inputId of inputs) {
      const hasLabel = await page.evaluate((id) => {
        const input = document.getElementById(id);
        const label = document.querySelector(`label[for="${id}"]`);
        return label !== null || input?.parentElement?.tagName === 'LABEL';
      }, inputId);
      
      expect(hasLabel).toBe(true);
    }
  });

  test('should have skip link for keyboard users', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('domcontentloaded');
    
    // Check skip link exists
    const skipLink = await page.locator('.skip-link').count();
    expect(skipLink).toBe(1);
    
    // Check skip link has href
    const href = await page.locator('.skip-link').getAttribute('href');
    expect(href).toBe('#main-content');
  });
});
