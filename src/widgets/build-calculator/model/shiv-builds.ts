import { defineStore } from 'pinia';

import type { ShivBuildData } from '@entities/shiv';
import { selectShivBuildPerk, SHIV_BUILD_NAME, TECHNOLOGY_LEVELS } from '@entities/shiv';
import { useBuildList } from '@features/manage-builds';
import { storedBuildCodec } from '@features/share-build';
import type { LockableItem } from '@shared/lib/stored-list';

import { DEFAULT_SHIV_BUILD_ID, SHIV_BUILD_KEY_PREFIX, SHIV_BUILD_ORDER_KEY } from '../config/constants';

/**
 * Saved SHIV build: build data with its id and lock.
 */
export type ShivBuild = LockableItem<ShivBuildData>;

/**
 * Data of a new build with no perk selected.
 */
const newShivBuildData = (): ShivBuildData => ({
  perks: TECHNOLOGY_LEVELS.map(() => null),
  name: SHIV_BUILD_NAME,
});

/**
 * Saved SHIV builds, kept in the local storage and synced between tabs.
 */
export const useShivBuildsStore = defineStore('build-calculator-shiv-builds', () => {
  const buildList = useBuildList<ShivBuildData>({
    orderKey: SHIV_BUILD_ORDER_KEY,
    itemKeyPrefix: SHIV_BUILD_KEY_PREFIX,
    ...storedBuildCodec('shiv'),
    defaultItems: () => [{ ...newShivBuildData(), id: DEFAULT_SHIV_BUILD_ID, readonly: false }],
    newData: newShivBuildData,
  });

  /**
   * Selects a perk on the technology level of an editable build, or clears the level.
   *
   * @param buildId build id.
   * @param levelIndex technology level index in the tree.
   * @param perkId selected perk id, or null to clear the level.
   */
  const selectBuildPerk = (buildId: string, levelIndex: number, perkId: string | null) => buildList.editBuild(buildId, build => selectShivBuildPerk(build, levelIndex, perkId));

  /**
   * Adds a new build with no perk selected.
   *
   * @returns id of the new build.
   */
  const addBuild = () => buildList.addBuild(newShivBuildData());

  return {
    builds: buildList.builds,
    selectBuildPerk,
    setName: buildList.setName,
    setReadonly: buildList.setReadonly,
    addBuild,
    importBuild: buildList.addBuild,
    replaceBuild: buildList.replaceBuild,
    resetBuild: buildList.resetBuild,
    removeBuild: buildList.removeBuild,
  };
});
