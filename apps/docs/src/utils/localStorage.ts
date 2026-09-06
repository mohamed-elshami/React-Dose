export type StorageValue = string | number | boolean | object | null;

function isBrowserStorageAvailable(): boolean {
  return (
    typeof window !== "undefined" &&
    typeof window.localStorage !== "undefined"
  );
}

/**
 * getStorageItem
 * Reads and parses a value from localStorage.
 *
 * @param key - Storage key to read
 * @returns Parsed value, or `null` when missing or unavailable (SSR)
 *
 * @example
 * const prefs = getStorageItem<{ theme: string }>("prefs");
 */
export function getStorageItem<T = StorageValue>(key: string): T | null {
  if (!isBrowserStorageAvailable()) {
    return null;
  }

  try {
    const raw = window.localStorage.getItem(key);

    if (raw === null) {
      return null;
    }

    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

/**
 * setStorageItem
 * Stores a JSON-serializable value in localStorage.
 *
 * @param key - Storage key
 * @param value - Value to persist
 * @returns `true` if saved successfully, otherwise `false`
 *
 * @example
 * setStorageItem("prefs", { theme: "dark" });
 */
export function setStorageItem<T = StorageValue>(key: string, value: T): boolean {
  if (!isBrowserStorageAvailable()) {
    return false;
  }

  try {
    window.localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch {
    return false;
  }
}

/**
 * updateStorageItem
 * Merges a partial object into an existing stored object.
 *
 * @param key - Storage key
 * @param partial - Fields to merge into the stored object
 * @returns `true` if updated successfully, otherwise `false`
 *
 * @example
 * updateStorageItem("prefs", { theme: "dark" });
 */
export function updateStorageItem<T extends Record<string, unknown>>(
  key: string,
  partial: Partial<T>,
): boolean {
  const current = getStorageItem<T>(key);

  if (current === null || typeof current !== "object") {
    return setStorageItem(key, partial as T);
  }

  return setStorageItem(key, { ...current, ...partial });
}

/**
 * removeStorageItem
 * Deletes a single item from localStorage.
 *
 * @param key - Storage key to remove
 * @returns `true` if removed successfully, otherwise `false`
 *
 * @example
 * removeStorageItem("prefs");
 */
export function removeStorageItem(key: string): boolean {
  if (!isBrowserStorageAvailable()) {
    return false;
  }

  try {
    window.localStorage.removeItem(key);
    return true;
  } catch {
    return false;
  }
}

/**
 * clearStorage
 * Removes all keys from localStorage.
 *
 * @returns `true` if cleared successfully, otherwise `false`
 *
 * @example
 * clearStorage();
 */
export function clearStorage(): boolean {
  if (!isBrowserStorageAvailable()) {
    return false;
  }

  try {
    window.localStorage.clear();
    return true;
  } catch {
    return false;
  }
}

/**
 * hasStorageItem
 * Checks whether a key exists in localStorage.
 *
 * @param key - Storage key
 * @returns `true` if the key exists, otherwise `false`
 *
 * @example
 * if (hasStorageItem("prefs")) { ... }
 */
export function hasStorageItem(key: string): boolean {
  if (!isBrowserStorageAvailable()) {
    return false;
  }

  return window.localStorage.getItem(key) !== null;
}

/**
 * getStorageKeys
 * Lists all keys currently stored in localStorage.
 *
 * @returns Array of storage keys, or `[]` on SSR
 *
 * @example
 * const keys = getStorageKeys();
 */
export function getStorageKeys(): string[] {
  if (!isBrowserStorageAvailable()) {
    return [];
  }

  return Object.keys(window.localStorage);
}
