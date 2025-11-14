#!/usr/bin/env node

/**
 * Basic validation script for OrarioDoc
 * Validates file structure, syntax, and exports
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 OrarioDoc Validation Script\n');

const checks = [];
let passed = 0;
let failed = 0;

function check(name, condition, details = '') {
  if (condition) {
    console.log(`✅ ${name}`);
    passed++;
  } else {
    console.log(`❌ ${name}`);
    if (details) console.log(`   ${details}`);
    failed++;
  }
  checks.push({ name, passed: condition });
}

// File existence checks
console.log('📁 File Structure Checks:\n');

const criticalFiles = [
  'index.html',
  'src/main.js',
  'src/schedule-grid.js',
  'src/storage.js',
  'src/storage/indexeddb.js',
  'docs/SCHEDULE_GRID.md',
  'docs/DATA_PERSISTENCE.md',
  'docs/VALIDATION_CHECKLIST.md',
  'playwright-tests/persistence-interactive.spec.js'
];

criticalFiles.forEach(file => {
  const exists = fs.existsSync(path.join(__dirname, '..', file));
  check(`File exists: ${file}`, exists);
});

console.log('\n📝 Content Validation:\n');

// Check schedule-grid.js exports
try {
  const scheduleGridContent = fs.readFileSync('src/schedule-grid.js', 'utf8');
  check('schedule-grid.js has createGrid', scheduleGridContent.includes('createGrid'));
  check('schedule-grid.js has renderLessons', scheduleGridContent.includes('renderLessons'));
  check('schedule-grid.js exports ScheduleGrid', scheduleGridContent.includes('window.ScheduleGrid'));
} catch (e) {
  if (e.code === 'ENOENT') {
    check('schedule-grid.js exists', false, 'File not found');
  } else {
    check('schedule-grid.js readable', false, `Read error: ${e.message}`);
  }
}

// Check storage.js exports
try {
  const storageContent = fs.readFileSync('src/storage.js', 'utf8');
  check('storage.js has read method', storageContent.includes('read'));
  check('storage.js has write method', storageContent.includes('write'));
  check('storage.js exports Storage', storageContent.includes('Storage'));
} catch (e) {
  if (e.code === 'ENOENT') {
    check('storage.js exists', false, 'File not found');
  } else {
    check('storage.js readable', false, `Read error: ${e.message}`);
  }
}

// Check indexeddb.js exports
try {
  const indexedDBContent = fs.readFileSync('src/storage/indexeddb.js', 'utf8');
  check('indexeddb.js has initDB', indexedDBContent.includes('initDB'));
  check('indexeddb.js has migrateFromLocalStorage', indexedDBContent.includes('migrateFromLocalStorage'));
  check('indexeddb.js exports IndexedDBStorage', indexedDBContent.includes('window.IndexedDBStorage'));
} catch (e) {
  if (e.code === 'ENOENT') {
    check('indexeddb.js exists', false, 'File not found');
  } else {
    check('indexeddb.js readable', false, `Read error: ${e.message}`);
  }
}

// Check main.js has required functions
try {
  const mainContent = fs.readFileSync('src/main.js', 'utf8');
  check('main.js has load function', mainContent.includes('function load()'));
  check('main.js has save function', mainContent.includes('function save('));
  check('main.js has validateLesson', mainContent.includes('validateLesson'));
  check('main.js has checkConflicts', mainContent.includes('checkConflicts'));
  check('main.js has showPanel', mainContent.includes('showPanel'));
  check('main.js has hidePanel', mainContent.includes('hidePanel'));
  check('main.js has trapFocus', mainContent.includes('trapFocus'));
} catch (e) {
  if (e.code === 'ENOENT') {
    check('main.js exists', false, 'File not found');
  } else {
    check('main.js readable', false, `Read error: ${e.message}`);
  }
}

console.log('\n🎯 Test File Validation:\n');

// Check test file structure
try {
  const testContent = fs.readFileSync('playwright-tests/persistence-interactive.spec.js', 'utf8');
  check('Tests have Data Persistence tests', testContent.includes('Data Persistence'));
  check('Tests have Modal Management tests', testContent.includes('Modal Management'));
  check('Tests have Form Validation tests', testContent.includes('Form Validation'));
  check('Tests have Keyboard Navigation tests', testContent.includes('Keyboard Navigation'));
  check('Tests have Accessibility tests', testContent.includes('Accessibility'));
  
  // Count test cases
  const testMatches = testContent.match(/test\(/g);
  const testCount = testMatches ? testMatches.length : 0;
  check(`Test file has multiple test cases (${testCount} found)`, testCount > 20);
} catch (e) {
  if (e.code === 'ENOENT') {
    check('Test file exists', false, 'File not found');
  } else {
    check('Test file readable', false, `Read error: ${e.message}`);
  }
}

console.log('\n📚 Documentation Validation:\n');

// Check documentation completeness
try {
  const scheduleGridDoc = fs.readFileSync('docs/SCHEDULE_GRID.md', 'utf8');
  check('SCHEDULE_GRID.md has API section', scheduleGridDoc.includes('API Pubblica'));
  check('SCHEDULE_GRID.md has accessibility section', scheduleGridDoc.includes('Accessibilità'));
  check('SCHEDULE_GRID.md has examples', scheduleGridDoc.includes('Esempio'));
} catch (e) {
  if (e.code === 'ENOENT') {
    check('SCHEDULE_GRID.md exists', false, 'File not found');
  } else {
    check('SCHEDULE_GRID.md readable', false, `Read error: ${e.message}`);
  }
}

try {
  const persistenceDoc = fs.readFileSync('docs/DATA_PERSISTENCE.md', 'utf8');
  check('DATA_PERSISTENCE.md has architecture section', persistenceDoc.includes('Architettura'));
  check('DATA_PERSISTENCE.md has API usage', persistenceDoc.includes('API Usage'));
  check('DATA_PERSISTENCE.md has fallback strategy', persistenceDoc.includes('Fallback Strategy'));
} catch (e) {
  if (e.code === 'ENOENT') {
    check('DATA_PERSISTENCE.md exists', false, 'File not found');
  } else {
    check('DATA_PERSISTENCE.md readable', false, `Read error: ${e.message}`);
  }
}

try {
  const validationDoc = fs.readFileSync('docs/VALIDATION_CHECKLIST.md', 'utf8');
  check('VALIDATION_CHECKLIST.md has test categories', validationDoc.includes('Test Categories'));
  check('VALIDATION_CHECKLIST.md has checklist items', validationDoc.includes('- [ ]'));
} catch (e) {
  if (e.code === 'ENOENT') {
    check('VALIDATION_CHECKLIST.md exists', false, 'File not found');
  } else {
    check('VALIDATION_CHECKLIST.md readable', false, `Read error: ${e.message}`);
  }
}

console.log('\n' + '='.repeat(50));
console.log(`\n📊 Summary: ${passed} passed, ${failed} failed\n`);

if (failed === 0) {
  console.log('✨ All validation checks passed!\n');
  process.exit(0);
} else {
  console.log('⚠️  Some validation checks failed. Please review.\n');
  process.exit(1);
}
