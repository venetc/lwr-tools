import { TECHNOLOGY_LEVELS } from '@entities/shiv';
import type { DeepReadonly } from '@shared/lib/object';
import type { TieredPickerItem } from '@shared/ui/tiered-picker';

import { shivPerkItem } from '../model/perk-item';

/**
 * Prefix of all stored keys of the SHIV Build calculator. Keys are never changed: a new shape of stored records
 * gets a new version (`v2`), and loading reads the old one.
 */
export const BUILD_STORAGE_PREFIX = 'lwr-tools.shiv-builds.v1.';

/** Key of the stored build order: a JSON array of build ids; its absence means nothing has been saved yet. */
export const BUILD_ORDER_KEY = `${BUILD_STORAGE_PREFIX}order`;

/** Key prefix of a stored build, followed by the build id; the value is JSON `{ code, readonly }`. */
export const BUILD_KEY_PREFIX = `${BUILD_STORAGE_PREFIX}build.`;

/**
 * Id of the default build. A fixed id lets tabs opened for the first time at once save the same record
 * instead of doubling the list.
 */
export const DEFAULT_BUILD_ID = 'default-shiv';

/** Picker items of the SHIV tree by technology level, built once: the tree is static. */
export const TECHNOLOGY_LEVEL_ITEMS: DeepReadonly<TieredPickerItem[][]> = TECHNOLOGY_LEVELS.map(level => level.perks.map(shivPerkItem));

/** Picker items of SHIV perks by perk id. */
export const SHIV_PERK_ITEM_BY_ID: ReadonlyMap<string, DeepReadonly<TieredPickerItem>> = new Map(
  TECHNOLOGY_LEVEL_ITEMS.flat().map(item => [item.id, item]),
);

/** Id of the only tier group of a SHIV build panel: the SHIV tree. */
export const SHIV_TREE_GROUP_ID = 'shiv-tree';
