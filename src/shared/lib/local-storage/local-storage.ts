/**
 * Stored value of the key; null if the key is absent or the storage is unavailable.
 *
 * @param key storage key.
 */
export const readLocalStorage = (key: string) => {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
};

/**
 * Stores the value under the key; false if the storage is unavailable or full.
 *
 * @param key storage key.
 * @param value stored value.
 */
export const writeLocalStorage = (key: string, value: string) => {
  try {
    localStorage.setItem(key, value);

    return true;
  } catch {
    return false;
  }
};

/**
 * Removes the key; false if the storage is unavailable.
 *
 * @param key storage key.
 */
export const removeLocalStorage = (key: string) => {
  try {
    localStorage.removeItem(key);

    return true;
  } catch {
    return false;
  }
};

/**
 * Stored keys that start with the prefix, in storage order; empty if the storage is unavailable.
 *
 * @param prefix key prefix.
 */
export const localStorageKeys = (prefix: string) => {
  try {
    return Array.from({ length: localStorage.length }, (_, index) => localStorage.key(index))
      .filter(key => key !== null)
      .filter(key => key.startsWith(prefix));
  } catch {
    return [];
  }
};
