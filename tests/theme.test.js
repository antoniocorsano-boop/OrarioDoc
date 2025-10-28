/**
 * Theme Manager Tests
 * Tests for theme management functionality
 */

describe('Theme Manager', () => {
  
  beforeEach(() => {
    // Clear theme-related storage
    localStorage.removeItem('orariodoc:theme');
    localStorage.removeItem('orariodoc:colors');
    
    // Reset document theme attributes
    document.documentElement.removeAttribute('data-theme');
    document.documentElement.removeAttribute('data-user-theme');
  });
  
  describe('Theme constants', () => {
    test('should have all theme constants defined', () => {
      expect(ThemeManager.THEMES).toBeDefined();
      expect(ThemeManager.THEMES.AUTO).toBe('auto');
      expect(ThemeManager.THEMES.LIGHT).toBe('light');
      expect(ThemeManager.THEMES.DARK).toBe('dark');
      expect(ThemeManager.THEMES.EXPRESSIVE).toBe('expressive');
    });
  });
  
  describe('Theme initialization', () => {
    test('should initialize with default theme', () => {
      ThemeManager.init();
      
      const currentTheme = ThemeManager.getCurrentTheme();
      expect(currentTheme).toBeDefined();
      expect(['light', 'dark', 'expressive']).toContain(currentTheme);
    });
    
    test('should load saved theme from localStorage', () => {
      localStorage.setItem('orariodoc:theme', 'dark');
      
      ThemeManager.init();
      
      const userTheme = ThemeManager.getUserTheme();
      expect(userTheme).toBe('dark');
    });
  });
  
  describe('Theme setting and getting', () => {
    test('should set and get light theme', () => {
      ThemeManager.setTheme('light');
      
      const currentTheme = ThemeManager.getCurrentTheme();
      expect(currentTheme).toBe('light');
      
      const savedTheme = localStorage.getItem('orariodoc:theme');
      expect(savedTheme).toBe('light');
    });
    
    test('should set and get dark theme', () => {
      ThemeManager.setTheme('dark');
      
      const currentTheme = ThemeManager.getCurrentTheme();
      expect(currentTheme).toBe('dark');
    });
    
    test('should set and get expressive theme', () => {
      ThemeManager.setTheme('expressive');
      
      const currentTheme = ThemeManager.getCurrentTheme();
      expect(currentTheme).toBe('expressive');
    });
    
    test('should handle auto theme', () => {
      ThemeManager.setTheme('auto');
      
      const userTheme = ThemeManager.getUserTheme();
      expect(userTheme).toBe('auto');
      
      const currentTheme = ThemeManager.getCurrentTheme();
      expect(['light', 'dark']).toContain(currentTheme);
    });
  });
  
  describe('Theme persistence', () => {
    test('should persist theme choice in localStorage', () => {
      ThemeManager.setTheme('dark');
      
      const saved = localStorage.getItem('orariodoc:theme');
      expect(saved).toBe('dark');
    });
    
    test('should maintain theme across page reloads', () => {
      ThemeManager.setTheme('expressive');
      
      // Simulate reload by re-initializing
      ThemeManager.init();
      
      const theme = ThemeManager.getUserTheme();
      expect(theme).toBe('expressive');
    });
  });
  
  describe('DOM updates', () => {
    test('should update data-theme attribute', () => {
      ThemeManager.setTheme('dark');
      
      const themeAttr = document.documentElement.getAttribute('data-theme');
      expect(themeAttr).toBe('dark');
    });
    
    test('should update data-user-theme for manual selection', () => {
      ThemeManager.setTheme('light');
      
      const userThemeAttr = document.documentElement.getAttribute('data-user-theme');
      expect(userThemeAttr).toBe('light');
    });
    
    test('should remove data-user-theme for auto mode', () => {
      ThemeManager.setTheme('light');
      expect(document.documentElement.hasAttribute('data-user-theme')).toBeTruthy();
      
      ThemeManager.setTheme('auto');
      expect(document.documentElement.hasAttribute('data-user-theme')).toBeFalsy();
    });
  });
  
  describe('Custom colors', () => {
    test('should set custom primary color', () => {
      const colors = { primary: '#ff0000' };
      const result = ThemeManager.setCustomColors(colors);
      
      expect(result).toBeTruthy();
      
      const saved = ThemeManager.getCustomColors();
      expect(saved.primary).toBe('#ff0000');
    });
    
    test('should set custom secondary color', () => {
      const colors = { secondary: '#00ff00' };
      const result = ThemeManager.setCustomColors(colors);
      
      expect(result).toBeTruthy();
      
      const saved = ThemeManager.getCustomColors();
      expect(saved.secondary).toBe('#00ff00');
    });
    
    test('should set both primary and secondary colors', () => {
      const colors = { primary: '#ff0000', secondary: '#00ff00' };
      ThemeManager.setCustomColors(colors);
      
      const saved = ThemeManager.getCustomColors();
      expect(saved.primary).toBe('#ff0000');
      expect(saved.secondary).toBe('#00ff00');
    });
    
    test('should persist custom colors', () => {
      const colors = { primary: '#123456' };
      ThemeManager.setCustomColors(colors);
      
      const stored = localStorage.getItem('orariodoc:colors');
      expect(stored).toBeDefined();
      
      const parsed = JSON.parse(stored);
      expect(parsed.primary).toBe('#123456');
    });
    
    test('should reset colors to defaults', () => {
      ThemeManager.setCustomColors({ primary: '#ff0000' });
      expect(ThemeManager.getCustomColors()).toBeDefined();
      
      ThemeManager.resetColors();
      
      const colors = ThemeManager.getCustomColors();
      expect(colors).toBeNull();
    });
    
    test('should reject invalid color input', () => {
      const result = ThemeManager.setCustomColors({});
      expect(result).toBeFalsy();
    });
  });
  
  describe('Event dispatching', () => {
    test('should dispatch theme-changed event', async () => {
      let handler;
      const eventPromise = new Promise((resolve) => {
        handler = (e) => {
          window.removeEventListener('theme-changed', handler);
          resolve(e);
        };
        window.addEventListener('theme-changed', handler);
      });
      try {
        ThemeManager.setTheme('dark');
        const event = await eventPromise;
        expect(event.detail.theme).toBe('dark');
      } finally {
        if (handler) {
          window.removeEventListener('theme-changed', handler);
        }
      }
    });
    
    test('should dispatch colors-changed event', async () => {
      let handler;
      const eventPromise = new Promise((resolve) => {
        handler = (e) => {
          window.removeEventListener('colors-changed', handler);
          resolve(e);
        };
        window.addEventListener('colors-changed', handler);
      });
      try {
        ThemeManager.setCustomColors({ primary: '#ff0000' });
        const event = await eventPromise;
        expect(event.detail.colors.primary).toBe('#ff0000');
      } finally {
        if (handler) {
          window.removeEventListener('colors-changed', handler);
        }
      }
    });
  });
  
  describe('Edge cases', () => {
    test('should handle invalid theme gracefully', () => {
      ThemeManager.setTheme('invalid-theme');
      
      // Should fallback to auto
      const saved = localStorage.getItem('orariodoc:theme');
      expect(saved).toBe('auto');
    });
    
    test('should handle localStorage errors gracefully', () => {
      // Mock localStorage to throw
      const originalSetItem = Storage.prototype.setItem;
      Storage.prototype.setItem = function() {
        throw new Error('Quota exceeded');
      };
      
      // Should not crash
      ThemeManager.setTheme('dark');
      
      // Restore
      Storage.prototype.setItem = originalSetItem;
    });
  });
});
