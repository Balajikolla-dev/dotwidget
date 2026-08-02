// shared/js/storage.js
const Storage = {
  get(key, fallback = null) {
    try {
      const item = localStorage.getItem(`dw_${key}`);
      return item ? JSON.parse(item) : fallback;
    } catch (e) {
      console.error('Error reading from localStorage', e);
      return fallback;
    }
  },

  set(key, value) {
    try {
      localStorage.setItem(`dw_${key}`, JSON.stringify(value));
    } catch (e) {
      console.error('Error writing to localStorage', e);
    }
  },

  remove(key) {
    localStorage.removeItem(`dw_${key}`);
  }
};