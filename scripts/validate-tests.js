#!/usr/bin/env node

/**
 * Simple test validator
 * Checks that test files are properly structured and can be loaded
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 OrarioDoc Test Validator\n');

const testsDir = path.join(__dirname, '../tests');
const testFiles = [
  'test-runner.html',
  'unit-tests.js',
  'integration-tests.js'
];

let allValid = true;

// Check test files exist
console.log('📁 Checking test files...');
testFiles.forEach(file => {
  const fullPath = path.join(testsDir, file);
  if (fs.existsSync(fullPath)) {
    const stats = fs.statSync(fullPath);
    console.log(`  ✅ ${file} (${stats.size} bytes)`);
  } else {
    console.log(`  ❌ ${file} - NOT FOUND`);
    allValid = false;
  }
});

console.log('\n📝 Validating test structure...');

// Check unit-tests.js
const unitTestPath = path.join(testsDir, 'unit-tests.js');
if (fs.existsSync(unitTestPath)) {
  const content = fs.readFileSync(unitTestPath, 'utf8');
  const testCount = (content.match(/runner\.test\(/g) || []).length;
  console.log(`  ✅ unit-tests.js contains ${testCount} tests`);
  
  if (testCount === 0) {
    console.log(`  ⚠️  Warning: No tests found in unit-tests.js`);
    allValid = false;
  }
}

// Check integration-tests.js
const integrationTestPath = path.join(testsDir, 'integration-tests.js');
if (fs.existsSync(integrationTestPath)) {
  const content = fs.readFileSync(integrationTestPath, 'utf8');
  const testCount = (content.match(/runner\.test\(/g) || []).length;
  console.log(`  ✅ integration-tests.js contains ${testCount} tests`);
  
  if (testCount === 0) {
    console.log(`  ⚠️  Warning: No tests found in integration-tests.js`);
    allValid = false;
  }
}

// Check test-runner.html
const testRunnerPath = path.join(testsDir, 'test-runner.html');
if (fs.existsSync(testRunnerPath)) {
  const content = fs.readFileSync(testRunnerPath, 'utf8');
  
  // Check for required scripts
  const hasUnitTests = content.includes('unit-tests.js');
  const hasIntegrationTests = content.includes('integration-tests.js');
  const hasTestRunner = content.includes('class TestRunner');
  
  console.log(`  ${hasUnitTests ? '✅' : '❌'} Loads unit-tests.js`);
  console.log(`  ${hasIntegrationTests ? '✅' : '❌'} Loads integration-tests.js`);
  console.log(`  ${hasTestRunner ? '✅' : '❌'} Has TestRunner class`);
  
  if (!hasUnitTests || !hasIntegrationTests || !hasTestRunner) {
    allValid = false;
  }
}

// Check documentation
console.log('\n📚 Checking documentation...');
const docsDir = path.join(__dirname, '../docs');
const docFiles = [
  'TEST_STRATEGY.md',
  'TEST_EXECUTION.md'
];

docFiles.forEach(file => {
  const fullPath = path.join(docsDir, file);
  if (fs.existsSync(fullPath)) {
    const stats = fs.statSync(fullPath);
    console.log(`  ✅ ${file} (${stats.size} bytes)`);
  } else {
    console.log(`  ❌ ${file} - NOT FOUND`);
    allValid = false;
  }
});

// Check CI/CD
console.log('\n🔄 Checking CI/CD configuration...');
const workflowPath = path.join(__dirname, '../.github/workflows/test.yml');
if (fs.existsSync(workflowPath)) {
  const content = fs.readFileSync(workflowPath, 'utf8');
  const hasPlaywright = content.includes('playwright');
  const hasNodeSetup = content.includes('setup-node');
  const hasTestCommand = content.includes('npm test');
  
  console.log(`  ${hasPlaywright ? '✅' : '❌'} Playwright configured`);
  console.log(`  ${hasNodeSetup ? '✅' : '❌'} Node.js setup`);
  console.log(`  ${hasTestCommand ? '✅' : '❌'} Test command`);
  
  if (!hasPlaywright || !hasNodeSetup || !hasTestCommand) {
    allValid = false;
  }
} else {
  console.log(`  ❌ test.yml - NOT FOUND`);
  allValid = false;
}

// Summary
console.log('\n' + '='.repeat(50));
if (allValid) {
  console.log('✅ All validation checks passed!');
  console.log('\nNext steps:');
  console.log('1. Start server: python3 -m http.server 8080');
  console.log('2. Open: http://localhost:8080/tests/test-runner.html');
  console.log('3. Run E2E tests: npm test');
  process.exit(0);
} else {
  console.log('❌ Some validation checks failed');
  console.log('\nPlease review the errors above and fix them.');
  process.exit(1);
}
