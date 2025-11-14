/**
 * Smoke Tests for OrarioDoc Schedule Table
 * 
 * Simplified test suite to verify critical persistence and interactive functionality.
 * For comprehensive testing, see docs/VALIDATION_CHECKLIST.md
 */

const { test, expect } = require('@playwright/test');

test.describe('Critical Functionality Smoke Tests', () => {
  
  test('should load application and display schedule grid', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Verify main elements exist
    await expect(page.locator('#scheduleGrid')).toBeVisible();
    await expect(page.locator('#addBtn')).toBeVisible();
  });

  test('should add and persist a lesson', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Clear any existing data
    await page.evaluate(() => {
      localStorage.clear();
      return indexedDB.deleteDatabase('OrarioDocDB');
    });
    
    // Add a new lesson
    await page.click('#addBtn');
    await page.waitForSelector('#panel:not(.hidden)');
    
    await page.fill('#inputName', 'Test Lesson');
    await page.fill('#inputDay', '1');
    await page.fill('#inputTime', '08:00');
    await page.fill('#inputDuration', '60');
    
    await page.click('#saveBtn');
    await page.waitForSelector('#panel.hidden');
    
    // Verify lesson appears
    await expect(page.locator('.item:has-text("Test Lesson")')).toBeVisible();
    
    // Reload and verify persistence
    await page.reload();
    await page.waitForLoadState('networkidle');
    
    await expect(page.locator('.item:has-text("Test Lesson")')).toBeVisible();
  });

  test('should open and close modal with keyboard (Escape)', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Open modal
    await page.click('#addBtn');
    await page.waitForSelector('#panel:not(.hidden)');
    
    // Close with Escape
    await page.keyboard.press('Escape');
    await page.waitForSelector('#panel.hidden');
    
    const isHidden = await page.locator('#panel').evaluate(el => el.classList.contains('hidden'));
    expect(isHidden).toBe(true);
  });

  test('should validate required fields', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Try to save without filling required name field
    await page.click('#addBtn');
    await page.waitForSelector('#panel:not(.hidden)');
    
    // Leave name empty, click save
    await page.click('#saveBtn');
    
    // Modal should stay open (validation failed)
    await page.waitForTimeout(300); // Brief wait for validation
    const isVisible = await page.locator('#panel').evaluate(el => !el.classList.contains('hidden'));
    expect(isVisible).toBe(true);
  });

  test('should have accessible ARIA attributes', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Check grid has proper role
    const gridRole = await page.locator('#scheduleGrid').getAttribute('role');
    expect(gridRole).toBe('grid');
    
    // Check modal has proper attributes
    await page.click('#addBtn');
    await page.waitForSelector('#panel:not(.hidden)');
    
    const panelRole = await page.locator('#panel').getAttribute('role');
    expect(panelRole).toBe('dialog');
    
    const ariaModal = await page.locator('#panel').getAttribute('aria-modal');
    expect(ariaModal).toBe('true');
  });
});
