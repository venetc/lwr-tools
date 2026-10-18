import { defineStore } from 'pinia';

import type { ShivBuildData } from '@entities/shiv';
import { selectShivBuildPerk, SHIV_BUILD_NAME, TECHNOLOGY_LEVELS } from '@entities/shiv';
import { useBuildList } from '@features/manage-builds';
import type { StoredBuild } from '@features/share-build';
import { decodeShivBuild, encodeShivBuild, storedBuildCodec } from '@features/share-build';
import { createId } from '@shared/lib/id';

import { DEFAULT_SHIV_BUILD_ID, SHIV_BUILD_KEY_PREFIX, SHIV_BUILD_ORDER_KEY } from '../config/constants';

/** Id of a SHIV build, unique in the build list. */
export type ShivBuildId = string;

/**
 * Saved SHIV build: build data with its id and lock.
 */
export type ShivBuild = StoredBuild<ShivBuildData>;

/**
 * New editable build with no perk selected.
 *
 * @param id build id; random by default.
 */
const createShivBuild = (id: ShivBuildId = createId()): ShivBuild => ({
  id,
  perks: TECHNOLOGY_LEVELS.map(() => null),
  name: SHIV_BUILD_NAME,
  readonly: false,
});

/**
 * Saved SHIV builds, kept in the local storage and synced between tabs.
 */
export const useShivBuildsStore = defineStore('build-calculator-shiv-builds', () => {
  const buildList = useBuildList<ShivBuildData>({
    orderKey: SHIV_BUILD_ORDER_KEY,
    itemKeyPrefix: SHIV_BUILD_KEY_PREFIX,
    ...storedBuildCodec(encodeShivBuild, decodeShivBuild),
    defaultItems: () => [createShivBuild(DEFAULT_SHIV_BUILD_ID)],
  });

  /**
   * Selects a perk on the technology level of an editable build, or clears the level.
   *
   * @param buildId build id.
   * @param levelIndex technology level index in the tree.
   * @param perkId selected perk id, or null to clear the level.
   */
  const selectBuildPerk = (buildId: ShivBuildId, levelIndex: number, perkId: string | null) => {
    const build = buildList.findEditableBuild(buildId);

    if (!build) return;

    selectShivBuildPerk(build, levelIndex, perkId);
    buildList.markBuildChanged(buildId);
  };

  /**
   * Adds a new build with no perk selected.
   */
  const addBuild = () => buildList.addBuild(createShivBuild());

  /**
   * Resets an editable build to a new build with no perk selected; the name stays.
   *
   * @param buildId build id.
   */
  const resetBuild = (buildId: ShivBuildId) => {
    const build = buildList.findEditableBuild(buildId);

    if (!build) return;

    buildList.replaceBuild(buildId, { ...createShivBuild(), name: build.name });
  };

  return {
    builds: buildList.builds,
    selectBuildPerk,
    setName: buildList.setName,
    setReadonly: buildList.setReadonly,
    addBuild,
    importBuild: buildList.importBuild,
    replaceBuild: buildList.replaceBuild,
    resetBuild,
    removeBuild: buildList.removeBuild,
  };
});
