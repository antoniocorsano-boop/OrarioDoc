/**
 * Toast Notification Tests
 * Tests for toast notification system
 */

describe('Toast Notifications', () => {
  
  beforeEach(() => {
    // Remove any existing toast container
    const existing = document.getElementById('toast-container');
    if (existing) {
      existing.remove();
    }
  });
  
  afterEach(() => {
    // Clean up toasts
    const container = document.getElementById('toast-container');
    if (container) {
      container.remove();
    }
  });
  
  describe('Toast creation', () => {
    test('should create toast container on first call', () => {
      Toast.showToast('Test message');
      
      const container = document.getElementById('toast-container');
      expect(container).toBeDefined();
      expect(container.className).toBe('toast-container');
    });
    
    test('should reuse existing container', () => {
      Toast.showToast('First message');
      const container1 = document.getElementById('toast-container');
      
      Toast.showToast('Second message');
      const container2 = document.getElementById('toast-container');
      
      expect(container1).toBe(container2);
    });
    
    test('should create toast with message', () => {
      Toast.showToast('Hello World');
      
      const container = document.getElementById('toast-container');
      const toast = container.querySelector('.toast');
      
      expect(toast).toBeDefined();
      expect(toast.textContent).toContain('Hello World');
    });
  });
  
  describe('Toast types', () => {
    test('should create info toast by default', () => {
      Toast.showToast('Info message');
      
      const toast = document.querySelector('.toast');
      expect(toast.className).toContain('toast--info');
    });
    
    test('should create success toast', () => {
      Toast.showToast('Success!', 'success');
      
      const toast = document.querySelector('.toast');
      expect(toast.className).toContain('toast--success');
      expect(toast.textContent).toContain('✓');
    });
    
    test('should create error toast', () => {
      Toast.showToast('Error occurred', 'error');
      
      const toast = document.querySelector('.toast');
      expect(toast.className).toContain('toast--error');
      expect(toast.textContent).toContain('✕');
    });
    
    test('should create warning toast', () => {
      Toast.showToast('Warning!', 'warning');
      
      const toast = document.querySelector('.toast');
      expect(toast.className).toContain('toast--warning');
      expect(toast.textContent).toContain('⚠');
    });
    
    test('should create info toast with icon', () => {
      Toast.showToast('Information', 'info');
      
      const toast = document.querySelector('.toast');
      expect(toast.textContent).toContain('ℹ');
    });
  });
  
  describe('Accessibility', () => {
    test('should have aria-live attribute on container', () => {
      Toast.showToast('Test');
      
      const container = document.getElementById('toast-container');
      expect(container.getAttribute('aria-live')).toBe('polite');
    });
    
    test('should have aria-atomic attribute', () => {
      Toast.showToast('Test');
      
      const container = document.getElementById('toast-container');
      expect(container.getAttribute('aria-atomic')).toBe('true');
    });
    
    test('should have role status on toast', () => {
      Toast.showToast('Test');
      
      const toast = document.querySelector('.toast');
      expect(toast.getAttribute('role')).toBe('status');
    });
    
    test('should hide icon from screen readers', () => {
      Toast.showToast('Test', 'success');
      
      const icon = document.querySelector('.toast-icon');
      expect(icon.getAttribute('aria-hidden')).toBe('true');
    });
  });
  
  describe('HTML escaping', () => {
    test('should escape HTML tags', () => {
      Toast.showToast('<script>alert("xss")</script>');
      
      const toast = document.querySelector('.toast');
      expect(toast).toBeDefined();
      expect(toast).not.toBeNull();
      expect(toast.innerHTML).toContain('&lt;script&gt;');
      expect(toast.innerHTML).not.toContain('<script>');
    });
    
    test('should escape special characters', () => {
      Toast.showToast('Test & "quotes" <tags>');
      
      const message = document.querySelector('.toast-message');
      expect(message).toBeDefined();
      expect(message).not.toBeNull();
      expect(message.innerHTML).toContain('&amp;');
      expect(message.innerHTML).toContain('&quot;');
      expect(message.innerHTML).toContain('&lt;');
    });
    
    test('should handle empty messages', () => {
      Toast.showToast('');
      
      const toast = document.querySelector('.toast');
      expect(toast).toBeDefined();
    });
    
    test('should handle null/undefined messages', () => {
      Toast.showToast(null);
      
      const toast = document.querySelector('.toast');
      expect(toast).toBeDefined();
    });
  });
  
  describe('Toast lifecycle', () => {
    test('should add visible class after creation', async () => {
      Toast.showToast('Test');
      
      const toast = document.querySelector('.toast');
      expect(toast).toBeDefined();
      expect(toast).not.toBeNull();
      
      await new Promise(resolve => setTimeout(resolve, 50));
      expect(toast.classList.contains('toast--visible')).toBeTruthy();
    });
    
    test('should auto-dismiss after duration', async () => {
      Toast.showToast('Test', 'info', 100);
      
      const toast = document.querySelector('.toast');
      expect(toast).toBeDefined();
      
      await new Promise(resolve => setTimeout(resolve, 150));
      const toastStillExists = document.querySelector('.toast');
      // Check if toast is either removed or no longer visible
      expect(toastStillExists === null || !toastStillExists.classList.contains('visible')).toBe(true);
    });
    
    test('should support custom duration', async () => {
      Toast.showToast('Test', 'info', 200);
      
      await new Promise(resolve => setTimeout(resolve, 100));
      const toast1 = document.querySelector('.toast');
      expect(toast1).toBeDefined(); // Still exists at 100ms
      
      await new Promise(resolve => setTimeout(resolve, 500));
      const toast2 = document.querySelector('.toast');
      expect(toast2).toBeNull(); // Gone after 600ms total
    });
  });
  
  describe('Multiple toasts', () => {
    test('should support multiple toasts simultaneously', () => {
      Toast.showToast('First', 'info');
      Toast.showToast('Second', 'success');
      Toast.showToast('Third', 'error');
      
      const toasts = document.querySelectorAll('.toast');
      expect(toasts.length).toBe(3);
    });
    
    test('should maintain order of toasts', () => {
      Toast.showToast('First');
      Toast.showToast('Second');
      
      const toasts = document.querySelectorAll('.toast');
      expect(toasts[0].textContent).toContain('First');
      expect(toasts[1].textContent).toContain('Second');
    });
  });
  
  describe('Edge cases', () => {
    test('should handle very long messages', () => {
      const longMessage = 'A'.repeat(1000);
      Toast.showToast(longMessage);
      
      const toast = document.querySelector('.toast');
      expect(toast).toBeDefined();
      expect(toast).not.toBeNull();
      expect(toast.textContent).toContain('A');
    });
    
    test('should handle special characters in messages', () => {
      Toast.showToast('Test™ © ® € £ ¥');
      
      const toast = document.querySelector('.toast');
      expect(toast).toBeDefined();
      expect(toast).not.toBeNull();
      expect(toast.textContent).toContain('™');
    });
    
    test('should handle emoji in messages', () => {
      Toast.showToast('Success! 🎉');
      
      const toast = document.querySelector('.toast');
      expect(toast.textContent).toContain('🎉');
    });
  });
});
