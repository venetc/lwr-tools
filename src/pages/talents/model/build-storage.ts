import { decodeSoldierBuild, encodeSoldierBuild } from '@features/share-build';
import { localStorageKeys, readLocalStorage } from '@shared/lib/local-storage';

import {
  BUILD_KEY_PREFIX,
  BUILD_ORDER_KEY,
  BUILD_ORDER_SCHEMA,
  STORED_BUILD_SCHEMA,
} from '../config/constants';
import type { SoldierBuild, SoldierBuildId } from './talents';

/**
 * Parsed JSON value, or null if the text is not valid JSON.
 *
 * @param value JSON text.
 */
const parseJson = (value: string): unknown => {
  try {
    return JSON.parse(value);
  } catch {
    return null;
  }
};

/**
 * Storage key of the build.
 *
 * @param buildId build id.
 */
export const buildStorageKey = (buildId: SoldierBuildId) => `${BUILD_KEY_PREFIX}${buildId}`;

/**
 * Build id of the storage key, or null if the key is not a build key.
 *
 * @param key storage key.
 */
export const buildIdOfKey = (key: string): SoldierBuildId | null => {
  if (!key.startsWith(BUILD_KEY_PREFIX)) return null;

  return key.slice(BUILD_KEY_PREFIX.length);
};

/**
 * Stored record of the build: JSON `{ code, readonly }`; null if the build has no share code.
 *
 * @param build soldier build.
 */
export const serializeBuild = (build: Readonly<SoldierBuild>) => {
  const code = encodeSoldierBuild(build);

  if (code === null) return null;

  return JSON.stringify({ code, readonly: build.readonly });
};

/**
 * Build of the stored record; null if the record is not valid JSON, does not match the schema or has an invalid code.
 *
 * @param buildId build id.
 * @param value stored record.
 */
export const parseBuild = (buildId: SoldierBuildId, value: string): SoldierBuild | null => {
  const record = STORED_BUILD_SCHEMA.safeParse(parseJson(value));

  if (!record.success) return null;

  const data = decodeSoldierBuild(record.data.code);

  if (!data) return null;

  return { ...data, id: buildId, readonly: record.data.readonly };
};

/**
 * Build ids of the stored order, or null if the order is not valid JSON or not an array of strings.
 *
 * @param value stored order.
 */
export const parseBuildOrder = (value: string) => {
  const order = BUILD_ORDER_SCHEMA.safeParse(parseJson(value));

  if (!order.success) return null;

  return order.data;
};

/**
 * Build ids arranged by the order: ids of the order that are present first, without duplicates,
 * then the remaining ids in their own order. Ids of the order that are not present are skipped.
 *
 * @param order build ids in the desired order.
 * @param buildIds present build ids.
 */
export const orderedBuildIds = (order: SoldierBuildId[], buildIds: SoldierBuildId[]) => {
  const presentIds = new Set(buildIds);
  const orderedIds = new Set(order.filter(buildId => presentIds.has(buildId)));

  buildIds.forEach(buildId => orderedIds.add(buildId));

  return [...orderedIds];
};

/**
 * Stored builds in the stored order, records outside the order last; null if nothing has been saved yet.
 * Invalid records are skipped; an invalid order counts as empty.
 */
export const loadBuilds = () => {
  const orderValue = readLocalStorage(BUILD_ORDER_KEY);

  if (orderValue === null) return null;

  const storedIds = localStorageKeys(BUILD_KEY_PREFIX)
    .map(buildIdOfKey)
    .filter(buildId => buildId !== null);

  return orderedBuildIds(parseBuildOrder(orderValue) ?? [], storedIds).reduce((acc, buildId) => {
    const value = readLocalStorage(buildStorageKey(buildId));
    const build = value === null ? null : parseBuild(buildId, value);

    if (build) acc.set(buildId, build);

    return acc;
  }, new Map<SoldierBuildId, SoldierBuild>());
};
