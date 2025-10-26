const { test, expect } = require('@playwright/test');
const fs = require('fs');

test('OrarioDoc automated tests', async ({ page }) => {
  // Collect console and page errors
  const logs = [];
  page.on('console', msg => {
    try {
      logs.push(`console.${msg.type()}: ${msg.text()}`);
      console.log('PAGE LOG:', msg.text());
    } catch (e) {}
  });
  page.on('pageerror', err => {
    logs.push(`pageerror: ${err.message}\n${err.stack}`);
  });
  page.on('requestfailed', req => {
    logs.push(`requestfailed: ${req.url()} ${req.failure()?.errorText || ''}`);
  });

  // Helper function to write diagnostic artifacts
  const writeDiagnostics = async (stats) => {
    await page.screenshot({ path: 'test-results.png', fullPage: true }).catch(() => {});
    fs.writeFileSync('page-console.log', logs.join('\n'), 'utf8');
    fs.writeFileSync('test-runner.html', await page.content(), 'utf8');
    if (stats) {
      fs.writeFileSync('test-results.json', JSON.stringify(stats, null, 2), 'utf8');
    }
  };

  // Navigate to the browser-native test runner served by a static server (CI starts python -m http.server)
  await page.goto('http://127.0.0.1:8080/tests/test-runner.html', { waitUntil: 'domcontentloaded' });

  // Click run-tests button and wait for the status element to show success or failed
  await page.click('#run-tests');

  try {
    await page.waitForSelector('.status.success, .status.failed', { timeout: 120000 });
  } catch (err) {
    // Capture debug artifacts when waiting for status times out
    await page.screenshot({ path: 'test-failure-debug.png', fullPage: true }).catch(() => {});
    await writeDiagnostics();
    throw err;
  }

  // Defensive parsing of stats (handles missing elements and non-numeric content)
  const stats = await page.evaluate(() => {
    const get = (id) => {
      try {
        const el = document.getElementById(id);
        if (!el || !el.textContent) return 0;
        const n = parseInt(el.textContent.trim(), 10);
        return Number.isFinite(n) ? n : 0;
      } catch (e) { return 0; }
    };
    // Also attempt to collect failure details from DOM if available
    const failedItems = Array.from(document.querySelectorAll('.test.failed, .failed-item')).map(el => el.innerText || el.textContent || '');
    return {
      total: get('stat-total'),
      passed: get('stat-passed'),
      failed: get('stat-failed'),
      skipped: get('stat-skipped'),
      failedItems
    };
  });

  // Always persist diagnostic artifacts
  await writeDiagnostics(stats);

  console.log('Test Results:', stats);
  if (stats.failedItems && stats.failedItems.length) {
    console.log('Failed items snapshot:\n', stats.failedItems.join('\n---\n'));
  }

  // Assertions
  expect(stats.failed).toBe(0);
  expect(stats.passed).toBeGreaterThan(0);
});
