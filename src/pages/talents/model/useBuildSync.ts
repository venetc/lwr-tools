import { useDebounceFn, useEventListener } from '@vueuse/core';
import type { Ref } from 'vue';

import { removeLocalStorage, writeLocalStorage } from '@shared/lib/local-storage';

import { BUILD_ORDER_KEY, BUILD_SAVE_DELAY, BUILD_SAVE_MAX_WAIT } from '../config/constants';
import {
  buildIdOfKey,
  buildStorageKey,
  orderedBuildIds,
  parseBuild,
  parseBuildOrder,
  serializeBuild,
} from './build-storage';
import type { SoldierBuild, SoldierBuildId } from './talents';

/**
 * Saving of builds to the local storage after changes and applying changes saved by other tabs.
 * Changes are saved with a debounce and flushed when the page is hidden or closed; changes from other tabs
 * are applied directly to the builds and are not saved back.
 *
 * @param buildsById builds by id in display order; replaced when another tab changes the order.
 */
export const useBuildSync = (buildsById: Ref<Map<SoldierBuildId, SoldierBuild>>) => {
  const changedKeys = new Set<string>();

  /**
   * Saves the current value of the key: the build order, or the build record; removes the record of a removed build.
   * A build without a share code keeps its previous record.
   *
   * @param key storage key.
   */
  const saveKey = (key: string) => {
    if (key === BUILD_ORDER_KEY) {
      writeLocalStorage(key, JSON.stringify([...buildsById.value.keys()]));
      return;
    }

    const buildId = buildIdOfKey(key);

    if (buildId === null) return;

    const build = buildsById.value.get(buildId) ?? null;

    if (!build) {
      removeLocalStorage(key);
      return;
    }

    const value = serializeBuild(build);

    if (value === null) return;

    writeLocalStorage(key, value);
  };

  /**
   * Saves all changed keys.
   */
  const save = () => {
    changedKeys.forEach(saveKey);
    changedKeys.clear();
  };

  const scheduleSave = useDebounceFn(save, BUILD_SAVE_DELAY, { maxWait: BUILD_SAVE_MAX_WAIT });

  /**
   * Marks the key as changed and schedules saving.
   *
   * @param key storage key.
   */
  const markKeyChanged = (key: string) => {
    changedKeys.add(key);
    scheduleSave();
  };

  /**
   * Marks the build as changed, removed builds included, and schedules saving.
   *
   * @param buildId build id.
   */
  const markBuildChanged = (buildId: SoldierBuildId) => markKeyChanged(buildStorageKey(buildId));

  /**
   * Marks the build order as changed and schedules saving.
   */
  const markOrderChanged = () => markKeyChanged(BUILD_ORDER_KEY);

  /**
   * Applies a build record saved by another tab: removes the build if the record is removed,
   * otherwise replaces it in place or adds it last. An invalid record is ignored.
   *
   * @param buildId build id.
   * @param value new record, or null if it is removed.
   */
  const applyStoredBuild = (buildId: SoldierBuildId, value: string | null) => {
    if (value === null) {
      buildsById.value.delete(buildId);
      return;
    }

    const build = parseBuild(buildId, value);

    if (!build) return;

    buildsById.value.set(buildId, build);
  };

  /**
   * Arranges builds by the order saved by another tab. Builds missing from it stay last, and then the merged order
   * is saved back; ids of builds unknown here are not saved back, so tabs do not overwrite each other in turn.
   * An invalid or removed order is ignored.
   *
   * @param value new order, or null if it is removed.
   */
  const applyStoredOrder = (value: string | null) => {
    const order = value === null ? null : parseBuildOrder(value);

    if (!order) return;

    const builds = buildsById.value;
    const orderedIds = new Set(order);
    const hasMissingBuilds = [...builds.keys()].some(buildId => !orderedIds.has(buildId));

    buildsById.value = orderedBuildIds(order, [...builds.keys()]).reduce((acc, buildId) => {
      const build = builds.get(buildId) ?? null;

      if (build) acc.set(buildId, build);

      return acc;
    }, new Map<SoldierBuildId, SoldierBuild>());

    if (hasMissingBuilds) markOrderChanged();
  };

  /**
   * Applies a change of the storage made by another tab; keys of other apps and clearing are ignored.
   *
   * @param event storage change.
   */
  const applyStorageChange = (event: StorageEvent) => {
    if (event.key === null) return;

    if (event.key === BUILD_ORDER_KEY) {
      applyStoredOrder(event.newValue);
      return;
    }

    const buildId = buildIdOfKey(event.key);

    if (buildId === null) return;

    applyStoredBuild(buildId, event.newValue);
    changedKeys.delete(event.key);
  };

  /**
   * Saves pending changes right away when the page is hidden: it may be closed without further events.
   */
  const flushOnHide = () => {
    if (document.visibilityState !== 'hidden') return;

    scheduleSave.flush();
  };

  useEventListener(window, 'storage', applyStorageChange);
  useEventListener(window, 'pagehide', scheduleSave.flush);
  useEventListener(document, 'visibilitychange', flushOnHide);

  return { markBuildChanged, markOrderChanged };
};
