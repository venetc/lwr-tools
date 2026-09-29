import { z } from 'zod';

/**
 * Prefix of all stored keys of the talents page. Keys are never changed: a new shape of stored records
 * gets a new version (`v2`), and loading reads the old one.
 */
export const BUILD_STORAGE_PREFIX = 'lwr-tools.talents.v1.';

/** Key of the stored build order: a JSON array of build ids; its absence means nothing has been saved yet. */
export const BUILD_ORDER_KEY = `${BUILD_STORAGE_PREFIX}order`;

/** Key prefix of a stored build, followed by the build id; the value is JSON `{ code, readonly }`. */
export const BUILD_KEY_PREFIX = `${BUILD_STORAGE_PREFIX}build.`;

/**
 * Id prefix of default builds, followed by the class id. Fixed ids let tabs opened for the first time at once
 * save the same records instead of doubling the list.
 */
export const DEFAULT_BUILD_ID_PREFIX = 'default-';

/** Delay after the last change before builds are saved, in milliseconds. */
export const BUILD_SAVE_DELAY = 300;

/** Longest time changes wait to be saved during continuous editing, in milliseconds. */
export const BUILD_SAVE_MAX_WAIT = 2000;

/** Stored build record: share code of the build and its lock. */
export const STORED_BUILD_SCHEMA = z.object({
  code: z.string(),
  readonly: z.boolean(),
});

/** Stored build order: build ids from first to last. */
export const BUILD_ORDER_SCHEMA = z.array(z.string());
