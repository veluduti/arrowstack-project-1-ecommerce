/**
 * Safe local storage utility with SSR support, JSON parsing, quota detection, and graceful error handling.
 */

export const STORAGE_KEYS = {
  CART: 'shopease_cart_items',
  LAST_ORDER: 'shopease_last_order',
  ORDERS: 'shopease_order_history',
} as const;

/**
 * Checks if localStorage is fully accessible and writable without throwing SecurityError.
 */
export function isStorageAvailable(): boolean {
  if (typeof window === 'undefined') return false;
  try {
    const testKey = '__shopease_storage_test__';
    window.localStorage.setItem(testKey, testKey);
    window.localStorage.removeItem(testKey);
    return true;
  } catch {
    return false;
  }
}

export function getFromStorage<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback;
  try {
    if (!isStorageAvailable()) return fallback;
    const item = window.localStorage.getItem(key);
    if (!item) return fallback;
    return JSON.parse(item) as T;
  } catch (error) {
    console.warn(`Error reading or parsing localStorage key "${key}":`, error);
    return fallback;
  }
}

export function saveToStorage<T>(key: string, value: T): boolean {
  if (typeof window === 'undefined') return false;
  try {
    if (!isStorageAvailable()) return false;
    window.localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (error) {
    console.warn(`Error saving to localStorage key "${key}":`, error);
    return false;
  }
}

export function removeFromStorage(key: string): boolean {
  if (typeof window === 'undefined') return false;
  try {
    if (!isStorageAvailable()) return false;
    window.localStorage.removeItem(key);
    return true;
  } catch (error) {
    console.warn(`Error removing from localStorage key "${key}":`, error);
    return false;
  }
}
