import { TECHNOLOGY_LEVELS } from '@entities/shiv';
import type { DeepReadonly } from '@shared/lib/object';
import type { TieredPickerItem } from '@shared/ui/tiered-picker';

import { shivPerkPickerItem } from '../model/shiv-perk-picker-item';

/**
 * Prefix of all stored keys of Biosoldier builds. Keys are never changed: a new shape of stored records
 * gets a new version (`v2`), and loading reads the old one.
 */
export const BIOSOLDIER_BUILD_STORAGE_PREFIX = 'lwr-tools.biosoldier-builds.v1.';

/** Key of the stored order of Biosoldier builds: a JSON array of build ids; its absence means nothing has been saved yet. */
export const BIOSOLDIER_BUILD_ORDER_KEY = `${BIOSOLDIER_BUILD_STORAGE_PREFIX}order`;

/** Key prefix of a stored Biosoldier build, followed by the build id; the value is JSON `{ code, readonly }`. */
export const BIOSOLDIER_BUILD_KEY_PREFIX = `${BIOSOLDIER_BUILD_STORAGE_PREFIX}build.`;

/**
 * Prefix of all stored keys of MEC builds. Keys are never changed: a new shape of stored records
 * gets a new version (`v2`), and loading reads the old one.
 */
export const MEC_BUILD_STORAGE_PREFIX = 'lwr-tools.mec-builds.v1.';

/** Key of the stored order of MEC builds: a JSON array of build ids; its absence means nothing has been saved yet. */
export const MEC_BUILD_ORDER_KEY = `${MEC_BUILD_STORAGE_PREFIX}order`;

/** Key prefix of a stored MEC build, followed by the build id; the value is JSON `{ code, readonly }`. */
export const MEC_BUILD_KEY_PREFIX = `${MEC_BUILD_STORAGE_PREFIX}build.`;

/**
 * Prefix of all stored keys of SHIV builds. Keys are never changed: a new shape of stored records
 * gets a new version (`v2`), and loading reads the old one.
 */
export const SHIV_BUILD_STORAGE_PREFIX = 'lwr-tools.shiv-builds.v1.';

/** Key of the stored order of SHIV builds: a JSON array of build ids; its absence means nothing has been saved yet. */
export const SHIV_BUILD_ORDER_KEY = `${SHIV_BUILD_STORAGE_PREFIX}order`;

/** Key prefix of a stored SHIV build, followed by the build id; the value is JSON `{ code, readonly }`. */
export const SHIV_BUILD_KEY_PREFIX = `${SHIV_BUILD_STORAGE_PREFIX}build.`;

/**
 * Id prefix of default Biosoldier and MEC builds, followed by the class id. Fixed ids let tabs opened for the first
 * time at once save the same records instead of doubling the list.
 */
export const DEFAULT_BUILD_ID_PREFIX = 'default-';

/**
 * Id of the default SHIV build. A fixed id lets tabs opened for the first time at once save the same record
 * instead of doubling the list.
 */
export const DEFAULT_SHIV_BUILD_ID = 'default-shiv';

/** Tab titles of the branches of a Biosoldier build panel, in tab order. */
export const BIOSOLDIER_BRANCH_TITLE = {
  'class-tree': 'Class tree',
  'gene-mods': 'Gene mods',
  'psionic': 'Psionic',
} as const;

/** Id of the only tier group of a MEC build panel: the class tree. */
export const MEC_TREE_GROUP_ID = 'class-tree';

/** Id of the only tier group of a SHIV build panel: the SHIV tree. */
export const SHIV_TREE_GROUP_ID = 'shiv-tree';

/** Picker items of the SHIV tree by technology level, built once: the tree is static. */
export const TECHNOLOGY_LEVEL_PICKER_ITEMS: DeepReadonly<TieredPickerItem[][]> = TECHNOLOGY_LEVELS.map(level => level.perks.map(shivPerkPickerItem));

/** Picker items of SHIV perks by perk id. */
export const SHIV_PERK_PICKER_ITEM_BY_ID: ReadonlyMap<string, DeepReadonly<TieredPickerItem>> = new Map(
  TECHNOLOGY_LEVEL_PICKER_ITEMS.flat().map(item => [item.id, item]),
);
