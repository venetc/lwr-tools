import { defineStore } from 'pinia';

import type { BiosoldierBuildData, SoldierClass } from '@entities/soldier';
import {
  BIOSOLDIER_CLASSES,
  EMPTY_GENE_MODS,
  selectBiosoldierBuildGeneMod,
  selectBiosoldierBuildOfficerPerk,
  selectBiosoldierBuildPerk,
  selectBiosoldierBuildPsionicAbility,
} from '@entities/soldier';
import { useBuildList } from '@features/manage-builds';
import { decodeBiosoldierBuild, encodeBiosoldierBuild, storedBuildCodec } from '@features/share-build';
import type { LockableItem } from '@shared/lib/stored-list';

import { BIOSOLDIER_BUILD_KEY_PREFIX, BIOSOLDIER_BUILD_ORDER_KEY, DEFAULT_BUILD_ID_PREFIX } from '../config/constants';

/**
 * Saved biosoldier build: build data with its id and lock.
 */
export type BiosoldierBuild = LockableItem<BiosoldierBuildData>;

/**
 * Data of a new build of the class with only the base perk selected, no gene mods, psionic abilities or officer perks.
 *
 * @param soldierClass biosoldier class.
 */
const newBiosoldierBuildData = (soldierClass: SoldierClass): BiosoldierBuildData => ({
  soldierClass,
  perks: [soldierClass.basePerk],
  geneMods: [...EMPTY_GENE_MODS],
  psionicAbilities: [],
  officerPerks: [],
  name: soldierClass.name,
});

/**
 * Default builds: one per class with only the base perk selected, with fixed ids.
 */
const createDefaultBuilds = () => BIOSOLDIER_CLASSES.map((soldierClass): BiosoldierBuild => ({
  ...newBiosoldierBuildData(soldierClass),
  id: `${DEFAULT_BUILD_ID_PREFIX}${soldierClass.id}`,
  readonly: false,
}));

/**
 * Saved biosoldier builds, kept in the local storage and synced between tabs.
 */
export const useBiosoldierBuildsStore = defineStore('build-calculator-biosoldier-builds', () => {
  const buildList = useBuildList<BiosoldierBuildData>({
    orderKey: BIOSOLDIER_BUILD_ORDER_KEY,
    itemKeyPrefix: BIOSOLDIER_BUILD_KEY_PREFIX,
    ...storedBuildCodec(encodeBiosoldierBuild, decodeBiosoldierBuild),
    defaultItems: createDefaultBuilds,
    newData: build => newBiosoldierBuildData(build.soldierClass),
  });

  /**
   * Selects a perk on the rank of an editable build by the tree rules.
   *
   * @param buildId build id.
   * @param rankIndex rank index in the tree.
   * @param perkId selected perk id, or null to clear the rank selection.
   */
  const selectBuildPerk = (buildId: string, rankIndex: number, perkId: string | null) => buildList.editBuild(buildId, build => selectBiosoldierBuildPerk(build, rankIndex, perkId));

  /**
   * Selects a gene mod of the body part of an editable build, or clears the body part.
   *
   * @param buildId build id.
   * @param bodyPartIndex body part index.
   * @param geneModId selected gene mod id, or null to clear the body part.
   */
  const selectBuildGeneMod = (buildId: string, bodyPartIndex: number, geneModId: string | null) => buildList.editBuild(buildId, build => selectBiosoldierBuildGeneMod(build, bodyPartIndex, geneModId));

  /**
   * Selects a psionic ability on the psi level of an editable build, or clears the level and all levels above.
   *
   * @param buildId build id.
   * @param levelIndex psi level index.
   * @param abilityId selected psionic ability id, or null to clear the level.
   */
  const selectBuildPsionicAbility = (buildId: string, levelIndex: number, abilityId: string | null) => buildList.editBuild(buildId, build => selectBiosoldierBuildPsionicAbility(build, levelIndex, abilityId));

  /**
   * Selects an officer perk on the officer rank of an editable build, or clears the officer rank and all officer ranks
   * above.
   *
   * @param buildId build id.
   * @param officerRankIndex officer rank index.
   * @param perkId selected officer perk id, or null to clear the officer rank.
   */
  const selectBuildOfficerPerk = (buildId: string, officerRankIndex: number, perkId: string | null) => buildList.editBuild(buildId, build => selectBiosoldierBuildOfficerPerk(build, officerRankIndex, perkId));

  /**
   * Adds a new build of the class with only the base perk selected.
   *
   * @param soldierClass biosoldier class of the new build.
   *
   * @returns id of the new build.
   */
  const addBuild = (soldierClass: SoldierClass) => buildList.addBuild(newBiosoldierBuildData(soldierClass));

  return {
    builds: buildList.builds,
    selectBuildPerk,
    selectBuildGeneMod,
    selectBuildPsionicAbility,
    selectBuildOfficerPerk,
    setName: buildList.setName,
    setReadonly: buildList.setReadonly,
    addBuild,
    importBuild: buildList.addBuild,
    replaceBuild: buildList.replaceBuild,
    resetBuild: buildList.resetBuild,
    removeBuild: buildList.removeBuild,
  };
});
