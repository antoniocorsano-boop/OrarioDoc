/**
 * Local Storage utilities for OrarioDoc
 */

const STORAGE_PREFIX = 'orariodoc_';

export const storage = {
  /**
   * Save data to local storage
   * @param {string} key - Storage key
   * @param {any} value - Value to store
   */
  set(key, value) {
    try {
      const serializedValue = JSON.stringify(value);
      localStorage.setItem(STORAGE_PREFIX + key, serializedValue);
      return true;
    } catch (error) {
      console.error('Error saving to storage:', error);
      return false;
    }
  },

  /**
   * Get data from local storage
   * @param {string} key - Storage key
   * @param {any} defaultValue - Default value if key doesn't exist
   * @returns {any} Retrieved value or default
   */
  get(key, defaultValue = null) {
    try {
      const item = localStorage.getItem(STORAGE_PREFIX + key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
      console.error('Error reading from storage:', error);
      return defaultValue;
    }
  },

  /**
   * Remove data from local storage
   * @param {string} key - Storage key
   */
  remove(key) {
    try {
      localStorage.removeItem(STORAGE_PREFIX + key);
      return true;
    } catch (error) {
      console.error('Error removing from storage:', error);
      return false;
    }
  },

  /**
   * Clear all app data from storage
   */
  clear() {
    try {
      Object.keys(localStorage)
        .filter(key => key.startsWith(STORAGE_PREFIX))
        .forEach(key => localStorage.removeItem(key));
      return true;
    } catch (error) {
      console.error('Error clearing storage:', error);
      return false;
    }
  }
};
