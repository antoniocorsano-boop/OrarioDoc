/**
 * Simple Test Framework for OrarioDoc
 * Browser-based testing without Node.js dependencies
 * 
 * Usage:
 *   describe('Module', () => {
 *     test('should do something', () => {
 *       expect(actual).toBe(expected);
 *     });
 *   });
 */

(function(global) {
  'use strict';
  
  // Test state
  const state = {
    suites: [],
    currentSuite: null,
    stats: {
      total: 0,
      passed: 0,
      failed: 0,
      skipped: 0
    },
    results: []
  };
  
  // Test runner
  const TestRunner = {
    // Define a test suite
    describe(name, fn) {
      const suite = {
        name,
        tests: [],
        beforeEach: null,
        afterEach: null
      };
      
      state.suites.push(suite);
      state.currentSuite = suite;
      
      fn();
      
      state.currentSuite = null;
    },
    
    // Define a test case
    test(description, fn) {
      if (!state.currentSuite) {
        throw new Error('test() must be called inside describe()');
      }
      
      state.currentSuite.tests.push({
        description,
        fn,
        skip: false
      });
    },
    
    // Skip a test
    skip(description, fn) {
      if (!state.currentSuite) {
        throw new Error('skip() must be called inside describe()');
      }
      
      state.currentSuite.tests.push({
        description,
        fn,
        skip: true
      });
    },
    
    // beforeEach hook
    beforeEach(fn) {
      if (!state.currentSuite) {
        throw new Error('beforeEach() must be called inside describe()');
      }
      state.currentSuite.beforeEach = fn;
    },
    
    // afterEach hook
    afterEach(fn) {
      if (!state.currentSuite) {
        throw new Error('afterEach() must be called inside describe()');
      }
      state.currentSuite.afterEach = fn;
    },
    
    // Run all tests
    async run() {
      state.stats = { total: 0, passed: 0, failed: 0, skipped: 0 };
      state.results = [];
      
      console.log('🧪 Running tests...\n');
      
      for (const suite of state.suites) {
        console.log(`\n📦 ${suite.name}`);
        
        for (const test of suite.tests) {
          state.stats.total++;
          
          if (test.skip) {
            state.stats.skipped++;
            console.log(`  ⊘ ${test.description} (skipped)`);
            state.results.push({
              suite: suite.name,
              test: test.description,
              status: 'skipped'
            });
            continue;
          }
          
          try {
            // Run beforeEach hook
            if (suite.beforeEach) {
              await suite.beforeEach();
            }
            
            // Run test
            await test.fn();
            
            // Run afterEach hook
            if (suite.afterEach) {
              await suite.afterEach();
            }
            
            state.stats.passed++;
            console.log(`  ✓ ${test.description}`);
            state.results.push({
              suite: suite.name,
              test: test.description,
              status: 'passed'
            });
          } catch (error) {
            state.stats.failed++;
            console.error(`  ✗ ${test.description}`);
            console.error(`    ${error.message}`);
            if (error.stack) {
              console.error(`    ${error.stack}`);
            }
            state.results.push({
              suite: suite.name,
              test: test.description,
              status: 'failed',
              error: error.message,
              stack: error.stack
            });
          }
        }
      }
      
      // Print summary
      console.log('\n' + '='.repeat(50));
      console.log(`\n📊 Test Summary:`);
      console.log(`   Total:   ${state.stats.total}`);
      console.log(`   ✓ Passed: ${state.stats.passed}`);
      console.log(`   ✗ Failed: ${state.stats.failed}`);
      console.log(`   ⊘ Skipped: ${state.stats.skipped}`);
      
      const passRate = state.stats.total > 0 
        ? ((state.stats.passed / state.stats.total) * 100).toFixed(1)
        : 0;
      console.log(`   Pass Rate: ${passRate}%\n`);
      
      return state.stats;
    },
    
    // Get results
    getResults() {
      return {
        stats: state.stats,
        results: state.results
      };
    }
  };
  
  // Assertion library
  const expect = (actual) => {
    return {
      toBe(expected) {
        if (actual !== expected) {
          throw new Error(`Expected ${JSON.stringify(expected)} but got ${JSON.stringify(actual)}`);
        }
      },
      
      toEqual(expected) {
        const actualStr = JSON.stringify(actual);
        const expectedStr = JSON.stringify(expected);
        if (actualStr !== expectedStr) {
          throw new Error(`Expected ${expectedStr} but got ${actualStr}`);
        }
      },
      
      toBeTruthy() {
        if (!actual) {
          throw new Error(`Expected truthy value but got ${JSON.stringify(actual)}`);
        }
      },
      
      toBeFalsy() {
        if (actual) {
          throw new Error(`Expected falsy value but got ${JSON.stringify(actual)}`);
        }
      },
      
      toBeNull() {
        if (actual !== null) {
          throw new Error(`Expected null but got ${JSON.stringify(actual)}`);
        }
      },
      
      toBeUndefined() {
        if (actual !== undefined) {
          throw new Error(`Expected undefined but got ${JSON.stringify(actual)}`);
        }
      },
      
      toBeDefined() {
        if (actual === undefined) {
          throw new Error('Expected value to be defined');
        }
      },
      
      toContain(item) {
        if (typeof actual === 'string') {
          if (!actual.includes(item)) {
            throw new Error(`Expected "${actual}" to contain "${item}"`);
          }
        } else if (Array.isArray(actual)) {
          if (!actual.includes(item)) {
            throw new Error(`Expected array to contain ${JSON.stringify(item)}`);
          }
        } else {
          throw new Error('toContain() requires string or array');
        }
      },
      
      toHaveLength(length) {
        if (!actual || typeof actual.length !== 'number') {
          throw new Error('Expected value with length property');
        }
        if (actual.length !== length) {
          throw new Error(`Expected length ${length} but got ${actual.length}`);
        }
      },
      
      toThrow() {
        if (typeof actual !== 'function') {
          throw new Error('toThrow() requires a function');
        }
        try {
          actual();
          throw new Error('Expected function to throw but it did not');
        } catch (error) {
          // Expected to throw
        }
      },
      
      toBeGreaterThan(value) {
        if (actual <= value) {
          throw new Error(`Expected ${actual} to be greater than ${value}`);
        }
      },
      
      toBeLessThan(value) {
        if (actual >= value) {
          throw new Error(`Expected ${actual} to be less than ${value}`);
        }
      },
      
      toMatch(pattern) {
        if (typeof actual !== 'string') {
          throw new Error('toMatch() requires a string');
        }
        if (!pattern.test(actual)) {
          throw new Error(`Expected "${actual}" to match pattern ${pattern}`);
        }
      },
      
      // Async matchers
      async resolves() {
        if (!(actual instanceof Promise)) {
          throw new Error('resolves requires a Promise');
        }
        try {
          return await actual;
        } catch (error) {
          throw new Error(`Expected promise to resolve but it rejected with: ${error.message}`);
        }
      },
      
      async rejects() {
        if (!(actual instanceof Promise)) {
          throw new Error('rejects requires a Promise');
        }
        try {
          await actual;
          throw new Error('Expected promise to reject but it resolved');
        } catch (error) {
          // Expected to reject
        }
      }
    };
  };
  
  // Mock helpers
  const mock = {
    fn() {
      const calls = [];
      const mockFn = function(...args) {
        calls.push(args);
        return mockFn.mockReturnValue;
      };
      mockFn.calls = calls;
      mockFn.mockReturnValue = undefined;
      mockFn.mockReturnValueOnce = (value) => {
        mockFn.mockReturnValue = value;
        return mockFn;
      };
      return mockFn;
    }
  };
  
  // Export to global
  global.describe = TestRunner.describe.bind(TestRunner);
  global.test = TestRunner.test.bind(TestRunner);
  global.skip = TestRunner.skip.bind(TestRunner);
  global.beforeEach = TestRunner.beforeEach.bind(TestRunner);
  global.afterEach = TestRunner.afterEach.bind(TestRunner);
  global.expect = expect;
  global.mock = mock;
  global.TestRunner = TestRunner;
  
})(window);
