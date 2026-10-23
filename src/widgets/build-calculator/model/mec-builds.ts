import { defineStore } from 'pinia';

import type { SoldierBuildData, SoldierClass } from '@entities/soldier';
import { MEC_CLASSES, selectSoldierBuildPerk } from '@entities/soldier';
import { useBuildList } from '@features/manage-builds';
import { decodeMecBuild, encodeMecBuild, storedBuildCodec } from '@features/share-build';
import type { LockableItem } from '@shared/lib/stored-list';

import { DEFAULT_BUILD_ID_PREFIX, MEC_BUILD_KEY_PREFIX, MEC_BUILD_ORDER_KEY } from '../config/constants';

/**
 * Saved MEC build: build data with its id and lock.
 */
export type MecBuild = LockableItem<SoldierBuildData>;

/**
 * Data of a new build of the class with only the base perk selected.
 *
 * @param soldierClass MEC class.
 */
const newMecBuildData = (soldierClass: SoldierClass): SoldierBuildData => ({
  soldierClass,
  perks: [soldierClass.basePerk],
  name: soldierClass.name,
});

/**
 * Default builds: one per class with only the base perk selected, with fixed ids.
 */
const createDefaultBuilds = () => MEC_CLASSES.map((soldierClass): MecBuild => ({
  ...newMecBuildData(soldierClass),
  id: `${DEFAULT_BUILD_ID_PREFIX}${soldierClass.id}`,
  readonly: false,
}));

/**
 * Saved MEC builds, kept in the local storage and synced between tabs.
 */
export const useMecBuildsStore = defineStore('build-calculator-mec-builds', () => {
  const buildList = useBuildList<SoldierBuildData>({
    orderKey: MEC_BUILD_ORDER_KEY,
    itemKeyPrefix: MEC_BUILD_KEY_PREFIX,
    ...storedBuildCodec(encodeMecBuild, decodeMecBuild),
    defaultItems: createDefaultBuilds,
    newData: build => newMecBuildData(build.soldierClass),
  });

  /**
   * Selects a perk on the rank of an editable build by the tree rules.
   *
   * @param buildId build id.
   * @param rankIndex rank index in the tree.
   * @param perkId selected perk id, or null to clear the rank selection.
   */
  const selectBuildPerk = (buildId: string, rankIndex: number, perkId: string | null) => buildList.editBuild(buildId, build => selectSoldierBuildPerk(build, rankIndex, perkId));

  /**
   * Adds a new build of the class with only the base perk selected.
   *
   * @param soldierClass MEC class of the new build.
   *
   * @returns id of the new build.
   */
  const addBuild = (soldierClass: SoldierClass) => buildList.addBuild(newMecBuildData(soldierClass));

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
