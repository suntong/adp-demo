// src/utils/demoUtils.js

/**
 * Formats a Date object or timestamp into YYYY-MM-DD HH:mm:ss string.
 * @param {Date|number} dateInput The date to format.
 * @returns {string} Formatted date string.
 */
export function formatDate(dateInput = new Date()) {
  const date = (dateInput instanceof Date) ? dateInput : new Date(dateInput);
  const Y = date.getFullYear();
  const M = String(date.getMonth() + 1).padStart(2, '0');
  const D = String(date.getDate()).padStart(2, '0');
  const h = String(date.getHours()).padStart(2, '0');
  const m = String(date.getMinutes()).padStart(2, '0');
  const s = String(date.getSeconds()).padStart(2, '0');
  return `${Y}-${M}-${D} ${h}:${m}:${s}`;
}

/**
 * Generates a random number within a specified range (inclusive).
 * @param {number} min Minimum value.
 * @param {number} max Maximum value.
 * @returns {number} Random number.
 */
export function generateRandomNumber(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Add other utility functions as needed by Art Design Pro template or features
// For example, functions for URL parsing, string manipulation, etc.

/**
 * Debounce function
 * @param {Function} func Function to debounce
 * @param {number} wait Wait time in ms
 * @param {boolean} immediate Whether to execute immediately
 * @returns {Function} Debounced function
 */
export function debounce(func, wait, immediate) {
  let timeout;
  return function(...args) {
    const context = this;
    const later = function() {
      timeout = null;
      if (!immediate) func.apply(context, args);
    };
    const callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow) func.apply(context, args);
  };
}

/**
 * Throttle function
 * @param {Function} func Function to throttle
 * @param {number} wait Wait time in ms
 * @returns {Function} Throttled function
 */
export function throttle(func, wait) {
  let timeout = null;
  let previous = 0;
  return function(...args) {
    const context = this;
    const now = Date.now();
    if (!previous && wait === 0) previous = now; // For leading edge execution if wait is 0
    const remaining = wait - (now - previous);
    if (remaining <= 0 || remaining > wait) {
      if (timeout) {
        clearTimeout(timeout);
        timeout = null;
      }
      previous = now;
      func.apply(context, args);
    } else if (!timeout) {
      timeout = setTimeout(() => {
        previous = Date.now();
        timeout = null;
        func.apply(context, args);
      }, remaining);
    }
  };
}
