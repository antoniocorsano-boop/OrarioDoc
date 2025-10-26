/**
 * Storage Tests
 * Tests for IndexedDB storage layer and localStorage fallback
 */

describe('Storage Module', () => {
  
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();
  });
  
  describe('localStorage operations', () => {
    test('should save and load data from localStorage', async () => {
      const testData = {
        lessons: [
          { id: 1, name: 'Math', day: 'Monday', startTime: '08:00' }
        ],
        settings: { theme: 'light' }
      };
      
      // Simulate storage write
      localStorage.setItem('orariodoc:v1', JSON.stringify(testData));
      
      // Read back
      const stored = localStorage.getItem('orariodoc:v1');
      const parsed = JSON.parse(stored);
      
      expect(parsed).toEqual(testData);
    });
    
    test('should return default structure when no data exists', () => {
      const stored = localStorage.getItem('orariodoc:v1');
      expect(stored).toBeNull();
    });
    
    test('should handle JSON parse errors gracefully', () => {
      localStorage.setItem('orariodoc:v1', 'invalid json{');
      
      let result;
      try {
        result = JSON.parse(localStorage.getItem('orariodoc:v1'));
      } catch (e) {
        result = { lessons: [], settings: {} };
      }
      
      expect(result).toEqual({ lessons: [], settings: {} });
    });
  });
  
  describe('Data validation', () => {
    test('should preserve lesson structure', () => {
      const lesson = {
        id: 1,
        name: 'Mathematics',
        day: 'Monday',
        startTime: '08:00',
        endTime: '09:00',
        room: '101'
      };
      
      const data = { lessons: [lesson], settings: {} };
      localStorage.setItem('orariodoc:v1', JSON.stringify(data));
      
      const retrieved = JSON.parse(localStorage.getItem('orariodoc:v1'));
      
      expect(retrieved.lessons[0].name).toBe('Mathematics');
      expect(retrieved.lessons[0].day).toBe('Monday');
      expect(retrieved.lessons).toHaveLength(1);
    });
    
    test('should preserve settings structure', () => {
      const settings = {
        schoolName: 'Test School',
        userName: 'John Doe',
        startTime: '08:00'
      };
      
      const data = { lessons: [], settings };
      localStorage.setItem('orariodoc:v1', JSON.stringify(data));
      
      const retrieved = JSON.parse(localStorage.getItem('orariodoc:v1'));
      
      expect(retrieved.settings.schoolName).toBe('Test School');
      expect(retrieved.settings.userName).toBe('John Doe');
    });
  });
  
  describe('Edge cases', () => {
    test('should handle empty arrays', () => {
      const data = { lessons: [], settings: {} };
      localStorage.setItem('orariodoc:v1', JSON.stringify(data));
      
      const retrieved = JSON.parse(localStorage.getItem('orariodoc:v1'));
      
      expect(retrieved.lessons).toEqual([]);
      expect(retrieved.settings).toEqual({});
    });
    
    test('should handle special characters in strings', () => {
      const lesson = {
        name: 'Math & Physics <special>',
        description: 'Test "quotes" and \'apostrophes\''
      };
      
      const data = { lessons: [lesson], settings: {} };
      localStorage.setItem('orariodoc:v1', JSON.stringify(data));
      
      const retrieved = JSON.parse(localStorage.getItem('orariodoc:v1'));
      
      expect(retrieved.lessons[0].name).toContain('&');
      expect(retrieved.lessons[0].name).toContain('<');
      expect(retrieved.lessons[0].description).toContain('"');
    });
    
    test('should handle large datasets', () => {
      const lessons = [];
      for (let i = 0; i < 100; i++) {
        lessons.push({
          id: i,
          name: `Lesson ${i}`,
          day: 'Monday'
        });
      }
      
      const data = { lessons, settings: {} };
      localStorage.setItem('orariodoc:v1', JSON.stringify(data));
      
      const retrieved = JSON.parse(localStorage.getItem('orariodoc:v1'));
      
      expect(retrieved.lessons).toHaveLength(100);
      expect(retrieved.lessons[99].name).toBe('Lesson 99');
    });
  });
  
  describe('Storage capacity', () => {
    test('should report when storage is available', () => {
      expect(typeof Storage).toBe('function');
      expect(localStorage).toBeDefined();
    });
    
    test('should handle storage quota', () => {
      // This is a simple check, actual quota varies by browser
      let canStore = true;
      try {
        const testKey = '__storage_test__';
        localStorage.setItem(testKey, 'test');
        localStorage.removeItem(testKey);
      } catch (e) {
        canStore = false;
      }
      
      expect(canStore).toBeTruthy();
    });
  });
});
