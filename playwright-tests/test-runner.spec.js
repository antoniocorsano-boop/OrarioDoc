const { test, expect } = require('@playwright/test');
const fs = require('fs');
const path = require('path');

test('OrarioDoc automated tests', async ({ page }) => {
  const resultsDir = path.join(process.cwd(), 'test-results');
  if (!fs.existsSync(resultsDir)) fs.mkdirSync(resultsDir, { recursive: true });

  const logs = [];
  page.on('console', msg => {
    try { logs.push(`console.${msg.type()}: ${msg.text()}`); console.log('PAGE LOG:', msg.text()); } catch (e) {}
  });
  page.on('pageerror', err => { logs.push(`pageerror: ${err.message}\n${err.stack}`); });
  page.on('requestfailed', req => { logs.push(`requestfailed: ${req.url()} ${req.failure()?.errorText || ''}`); });

  const writeDiagnostics = async (stats) => {
    await page.screenshot({ path: path.join(resultsDir, 'test-runner-screenshot.png'), fullPage: true }).catch(() => {});
    fs.writeFileSync(path.join(resultsDir, 'page-console.log'), logs.join('\n'), 'utf8');
    fs.writeFileSync(path.join(resultsDir, 'test-runner-result.html'), await page.content(), 'utf8');
    if (stats) fs.writeFileSync(path.join(resultsDir, 'test-results.json'), JSON.stringify(stats, null, 2), 'utf8');
  };

  await page.goto('/tests/test-runner.html', { waitUntil: 'domcontentloaded' });
  await page.waitForLoadState('domcontentloaded');
  await page.waitForSelector('#run-tests', { timeout: 15000 });
  await page.click('#run-tests');

  try {
    await page.waitForSelector('.status.success, .status.failed', { timeout: 120000 });
  } catch (err) {
    await page.screenshot({ path: path.join(resultsDir, 'test-failure-debug.png'), fullPage: true }).catch(() => {});
    await writeDiagnostics();
    throw err;
  }

  const stats = await page.evaluate(() => {
    const get = (id) => {
      try {
        const el = document.getElementById(id);
        if (!el || !el.textContent) return 0;
        const n = parseInt(el.textContent.trim(), 10);
        return Number.isFinite(n) ? n : 0;
      } catch (e) { return 0; }
    };
    const failedItems = Array.from(document.querySelectorAll('.test.fail')).map(el => {
      const nameEl = el.querySelector('.test-name');
      const errorEl = el.querySelector('.test-error');
      return `${nameEl ? nameEl.textContent : 'Unknown'}: ${errorEl ? errorEl.textContent : 'No error details'}`;
    });
    return {
      total: get('stat-total'),
      passed: get('stat-passed'),
      failed: get('stat-failed'),
      skipped: get('stat-skipped'),
      failedItems
    };
  });

  await writeDiagnostics(stats);

  console.log('Test Results:', stats);
  if (stats.failedItems && stats.failedItems.length) {
    console.error('=== FAILED ITEMS START ===\n' + stats.failedItems.join('\n---\n') + '\n=== FAILED ITEMS END ===');
    // Append failures to GitHub Actions summary for quick access in CI
    const summaryPath = process.env.GITHUB_STEP_SUMMARY;
    if (summaryPath) {
      try {
        const text = ['## Test failures', '', ...stats.failedItems.map((s, i) => `${i + 1}. ${s}`)].join('\n');
        fs.appendFileSync(summaryPath, text + '\n');
      } catch (e) { console.warn('Could not write to GITHUB_STEP_SUMMARY', e); }
    }
  }

  expect(stats.failed).toBe(0);
  expect(stats.passed).toBeGreaterThan(0);
});

