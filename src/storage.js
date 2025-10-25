// Storage layer using localStorage
const STORAGE_KEY = 'orariodoc:v1';

const Storage = {
  // Read all lessons from localStorage
  read() {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error reading from localStorage:', error);
      return [];
    }
  },

  // Write lessons to localStorage
  write(lessons) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(lessons));
      return true;
    } catch (error) {
      console.error('Error writing to localStorage:', error);
      return false;
    }
  },

  // Add a new lesson
  add(lesson) {
    const lessons = this.read();
    const newLesson = {
      id: Date.now(),
      ...lesson
    };
    lessons.push(newLesson);
    this.write(lessons);
    return newLesson;
  },

  // Remove a lesson by id
  remove(id) {
    const lessons = this.read();
    const filtered = lessons.filter(lesson => lesson.id !== id);
    this.write(filtered);
    return true;
  },

  // Clear all lessons
  clear() {
    localStorage.removeItem(STORAGE_KEY);
    return true;
  }
};

// Make Storage available globally
window.Storage = Storage;
