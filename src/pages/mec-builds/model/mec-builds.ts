import { defineStore } from 'pinia';

import type { SoldierBuildData, SoldierClass } from '@entities/soldier';
import { MEC_CLASSES, selectSoldierBuildPerk } from '@entities/soldier';
import { useBuildList } from '@features/manage-builds';
import type { StoredBuild } from '@features/share-build';
import { decodeMecBuild, encodeMecBuild, storedBuildCodec } from '@features/share-build';
import { createId } from '@shared/lib/id';

import { BUILD_KEY_PREFIX, BUILD_ORDER_KEY, DEFAULT_BUILD_ID_PREFIX } from '../config/constants';

/** Id of a MEC build, unique in the calculator list. */
export type MecBuildId = string;

/**
 * MEC build of the calculator: build data with its id and lock.
 */
export type MecBuild = StoredBuild<SoldierBuildData>;

/**
 * New editable build of the class with only the base perk selected.
 *
 * @param soldierClass MEC class.
 * @param id build id; random by default.
 */
const createMecBuild = (soldierClass: SoldierClass, id: MecBuildId = createId()): MecBuild => {
  return {
    id,
    soldierClass,
    perks: [soldierClass.basePerk],
    name: soldierClass.name,
    readonly: false,
  };
};

/**
 * Default builds: one per class with only the base perk selected, with fixed ids.
 */
const createDefaultBuilds = () => MEC_CLASSES.map(soldierClass => (
  createMecBuild(soldierClass, `${DEFAULT_BUILD_ID_PREFIX}${soldierClass.id}`)
));

/**
 * Builds of the MEC Build calculator, saved to the local storage and synced between tabs.
 */
export const useMecBuildsStore = defineStore('pages-mec-builds', () => {
  const buildList = useBuildList<SoldierBuildData>({
    orderKey: BUILD_ORDER_KEY,
    itemKeyPrefix: BUILD_KEY_PREFIX,
    ...storedBuildCodec(encodeMecBuild, decodeMecBuild),
    defaultItems: createDefaultBuilds,
  });

  /**
   * Selects a perk on the rank of an editable build by the tree rules.
   *
   * @param buildId build id.
   * @param rankIndex rank index in the tree.
   * @param perkId selected perk id, or null to clear the rank selection.
   */
  const selectBuildPerk = (buildId: MecBuildId, rankIndex: number, perkId: string | null) => {
    const build = buildList.findEditableBuild(buildId);

    if (!build) return;

    selectSoldierBuildPerk(build, rankIndex, perkId);
    buildList.markBuildChanged(buildId);
  };

  /**
   * Adds a new build of the class with only the base perk selected.
   *
   * @param soldierClass MEC class of the new build.
   */
  const addBuild = (soldierClass: SoldierClass) => buildList.addBuild(createMecBuild(soldierClass));

  /**
   * Resets an editable build to a new build of its class with only the base perk selected; the name stays.
   *
   * @param buildId build id.
   */
  const resetBuild = (buildId: MecBuildId) => {
    const build = buildList.findEditableBuild(buildId);

    if (!build) return;

    buildList.replaceBuild(buildId, { ...createMecBuild(build.soldierClass), name: build.name });
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
