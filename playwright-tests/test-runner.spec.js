const { test, expect } = require('@playwright/test');

test('OrarioDoc automated tests', async ({ page }) => {
  // Capture page console logs for debugging
  const logs = [];
  page.on('console', (msg) => {
    try {
      logs.push(`${msg.type()}: ${msg.text()}`);
      console.log('PAGE LOG:', msg.text());
    } catch (e) {
      // ignore
    }
  });

  // Navigate to the browser-native test runner served by a static server (CI starts python -m http.server)
  await page.goto('http://127.0.0.1:8080/tests/test-runner.html', { waitUntil: 'domcontentloaded' });

  // Click the run-tests button and wait for the status element to show success or failed
  await page.click('#run-tests');

  try {
    await page.waitForSelector('.status.success, .status.failed', { timeout: 60000 });
  } catch (err) {
    // Capture debug artifacts when waiting for status times out
    await page.screenshot({ path: 'test-failure-debug.png', fullPage: true }).catch(() => {
      // Screenshot is a diagnostic tool; failure to capture it should not fail the test
    });
    console.error('Timed out waiting for test status. Page console logs:\n', logs.join('\n'));
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
    return {
      total: get('stat-total'),
      passed: get('stat-passed'),
      failed: get('stat-failed'),
      skipped: get('stat-skipped')
    };
  });

  // Always persist a screenshot for the run
  await page.screenshot({ path: 'test-results.png', fullPage: true }).catch(() => {
    // Screenshot is a diagnostic tool; failure to capture it should not fail the test
  });

  console.log('Test Results:', stats);

  // Assert condition: no failed tests and at least one passed
  expect(stats.failed).toBe(0);
  expect(stats.passed).toBeGreaterThan(0);
});
