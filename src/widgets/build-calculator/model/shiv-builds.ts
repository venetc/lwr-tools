import { defineStore } from 'pinia';

import type { ShivBuildData } from '@entities/shiv';
import { defaultShivBuild, selectShivBuildPerk } from '@entities/shiv';
import type { ListedBuild } from '@features/manage-builds';
import { useBuildList } from '@features/manage-builds';
import type { OutdatedSelectionByKind } from '@features/share-build';
import { storedBuildCodec } from '@features/share-build';

import { DEFAULT_SHIV_BUILD_ID, SHIV_BUILD_KEY_PREFIX, SHIV_BUILD_ORDER_KEY } from '../config/constants';

/**
 * Saved SHIV build: build data with its id, lock and Outdated build record.
 */
export type ShivBuild = ListedBuild<ShivBuildData, OutdatedSelectionByKind['shiv']>;

/**
 * Saved SHIV builds, kept in the local storage and synced between tabs.
 */
export const useShivBuildsStore = defineStore('build-calculator-shiv-builds', () => {
  const buildList = useBuildList<ShivBuildData, OutdatedSelectionByKind['shiv']>({
    orderKey: SHIV_BUILD_ORDER_KEY,
    itemKeyPrefix: SHIV_BUILD_KEY_PREFIX,
    ...storedBuildCodec('shiv'),
    defaultItems: () => [{ ...defaultShivBuild(), id: DEFAULT_SHIV_BUILD_ID, readonly: false, outdated: null }],
    newData: defaultShivBuild,
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
  const addBuild = () => buildList.addBuild(defaultShivBuild());

  return {
    builds: buildList.builds,
    selectBuildPerk,
    setName: buildList.setName,
    setReadonly: buildList.setReadonly,
    addBuild,
    importBuild: buildList.addBuild,
    replaceBuild: buildList.replaceBuild,
    resetBuild: buildList.resetBuild,
    updateBuild: buildList.updateBuild,
    removeBuild: buildList.removeBuild,
  };
});
