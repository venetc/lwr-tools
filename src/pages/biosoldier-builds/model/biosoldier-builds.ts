import { defineStore } from 'pinia';

import type { BiosoldierBuildData, BiosoldierClass } from '@entities/biosoldier';
import { BIOSOLDIER_CLASSES, selectBiosoldierBuildPerk } from '@entities/biosoldier';
import { useBuildList } from '@features/manage-builds';
import type { StoredBuild } from '@features/share-build';
import { decodeBiosoldierBuild, encodeBiosoldierBuild, storedBuildCodec } from '@features/share-build';
import { createId } from '@shared/lib/id';

import { BUILD_KEY_PREFIX, BUILD_ORDER_KEY, DEFAULT_BUILD_ID_PREFIX } from '../config/constants';

export type BiosoldierBuildId = string;

/**
 * Biosoldier build of the calculator: build data with its id and lock.
 */
export type BiosoldierBuild = StoredBuild<BiosoldierBuildData>;

/**
 * New editable build of the class with only the base perk selected.
 *
 * @param biosoldierClass biosoldier class.
 * @param id build id; random by default.
 */
const createBiosoldierBuild = (biosoldierClass: BiosoldierClass, id: BiosoldierBuildId = createId()): BiosoldierBuild => {
  return {
    id,
    biosoldierClass,
    perks: [biosoldierClass.basePerk],
    name: biosoldierClass.name,
    readonly: false,
  };
};

/**
 * Default builds: one per class with only the base perk selected, with fixed ids.
 */
const createDefaultBuilds = () => BIOSOLDIER_CLASSES.map(biosoldierClass => (
  createBiosoldierBuild(biosoldierClass, `${DEFAULT_BUILD_ID_PREFIX}${biosoldierClass.id}`)
));

/**
 * Builds of the Biosoldier Build calculator, saved to the local storage and synced between tabs.
 */
export const useBiosoldierBuildsStore = defineStore('pages-biosoldier-builds', () => {
  const buildList = useBuildList<BiosoldierBuildData>({
    orderKey: BUILD_ORDER_KEY,
    itemKeyPrefix: BUILD_KEY_PREFIX,
    ...storedBuildCodec(encodeBiosoldierBuild, decodeBiosoldierBuild),
    defaultItems: createDefaultBuilds,
  });

  /**
   * Selects a perk on the rank of an editable build by the tree rules.
   *
   * @param buildId build id.
   * @param rankIndex rank index in the tree.
   * @param perkId selected perk id, or null to clear the rank selection.
   */
  const selectBuildPerk = (buildId: BiosoldierBuildId, rankIndex: number, perkId: string | null) => {
    const build = buildList.findEditableBuild(buildId);

    if (!build) return;

    selectBiosoldierBuildPerk(build, rankIndex, perkId);
    buildList.markBuildChanged(buildId);
  };

  /**
   * Adds a new build of the class with only the base perk selected.
   *
   * @param biosoldierClass biosoldier class of the new build.
   */
  const addBuild = (biosoldierClass: BiosoldierClass) => buildList.addBuild(createBiosoldierBuild(biosoldierClass));

  return {
    builds: buildList.builds,
    selectBuildPerk,
    setName: buildList.setName,
    setReadonly: buildList.setReadonly,
    addBuild,
    importBuild: buildList.importBuild,
    replaceBuild: buildList.replaceBuild,
    removeBuild: buildList.removeBuild,
  };
});
