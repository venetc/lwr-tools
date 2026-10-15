/**
 * Prefix of all stored keys of the Biosoldier Build calculator. Keys are never changed: a new shape of stored records
 * gets a new version (`v2`), and loading reads the old one.
 */
export const BUILD_STORAGE_PREFIX = 'lwr-tools.biosoldier-builds.v1.';

/** Key of the stored build order: a JSON array of build ids; its absence means nothing has been saved yet. */
export const BUILD_ORDER_KEY = `${BUILD_STORAGE_PREFIX}order`;

/** Key prefix of a stored build, followed by the build id; the value is JSON `{ code, readonly }`. */
export const BUILD_KEY_PREFIX = `${BUILD_STORAGE_PREFIX}build.`;

/**
 * Id prefix of default builds, followed by the class id. Fixed ids let tabs opened for the first time at once
 * save the same records instead of doubling the list.
 */
export const DEFAULT_BUILD_ID_PREFIX = 'default-';

/** Tab titles of the branches of a biosoldier build panel, in tab order. */
export const BRANCH_TITLE = {
  'class-tree': 'Class tree',
  'gene-mods': 'Gene mods',
} as const;
