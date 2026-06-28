function isBrowserStorageAvailable() {
  return (
    typeof window !== "undefined" &&
    typeof window.localStorage !== "undefined"
  );
}

/**
 * getStorageItem
 * Reads and parses a value from localStorage.
 *
 * @param {string} key - Storage key to read
 * @returns {*|null} Parsed value, or `null` when missing or unavailable (SSR)
 *
 * @example
 * const prefs = getStorageItem("prefs");
 */
export function getStorageItem(key) {
  if (!isBrowserStorageAvailable()) {
    return null;
  }

  try {
    const raw = window.localStorage.getItem(key);

    if (raw === null) {
      return null;
    }

    return JSON.parse(raw);
  } catch {
    return null;
  }
}

/**
 * setStorageItem
 * Stores a JSON-serializable value in localStorage.
 *
 * @param {string} key - Storage key
 * @param {*} value - Value to persist
 * @returns {boolean} `true` if saved successfully, otherwise `false`
 *
 * @example
 * setStorageItem("prefs", { theme: "dark" });
 */
export function setStorageItem(key, value) {
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
 * @param {string} key - Storage key
 * @param {Object} partial - Fields to merge into the stored object
 * @returns {boolean} `true` if updated successfully, otherwise `false`
 *
 * @example
 * updateStorageItem("prefs", { theme: "dark" });
 */
export function updateStorageItem(key, partial) {
  const current = getStorageItem(key);

  if (current === null || typeof current !== "object") {
    return setStorageItem(key, partial);
  }

  return setStorageItem(key, { ...current, ...partial });
}

/**
 * removeStorageItem
 * Deletes a single item from localStorage.
 *
 * @param {string} key - Storage key to remove
 * @returns {boolean} `true` if removed successfully, otherwise `false`
 *
 * @example
 * removeStorageItem("prefs");
 */
export function removeStorageItem(key) {
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
 * @returns {boolean} `true` if cleared successfully, otherwise `false`
 *
 * @example
 * clearStorage();
 */
export function clearStorage() {
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
 * @param {string} key - Storage key
 * @returns {boolean} `true` if the key exists, otherwise `false`
 *
 * @example
 * if (hasStorageItem("prefs")) { ... }
 */
export function hasStorageItem(key) {
  if (!isBrowserStorageAvailable()) {
    return false;
  }

  return window.localStorage.getItem(key) !== null;
}

/**
 * getStorageKeys
 * Lists all keys currently stored in localStorage.
 *
 * @returns {string[]} Array of storage keys, or `[]` on SSR
 *
 * @example
 * const keys = getStorageKeys();
 */
export function getStorageKeys() {
  if (!isBrowserStorageAvailable()) {
    return [];
  }

  return Object.keys(window.localStorage);
}
