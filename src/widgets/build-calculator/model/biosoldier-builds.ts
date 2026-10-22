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
import type { StoredBuild } from '@features/share-build';
import { decodeBiosoldierBuild, encodeBiosoldierBuild, storedBuildCodec } from '@features/share-build';
import { createId } from '@shared/lib/id';

import { BIOSOLDIER_BUILD_KEY_PREFIX, BIOSOLDIER_BUILD_ORDER_KEY, DEFAULT_BUILD_ID_PREFIX } from '../config/constants';

/** Id of a biosoldier build, unique in the build list. */
export type BiosoldierBuildId = string;

/**
 * Saved biosoldier build: build data with its id and lock.
 */
export type BiosoldierBuild = StoredBuild<BiosoldierBuildData>;

/**
 * New editable build of the class with only the base perk selected, no gene mods, psionic abilities or officer perks.
 *
 * @param soldierClass biosoldier class.
 * @param id build id; random by default.
 */
const createBiosoldierBuild = (soldierClass: SoldierClass, id: BiosoldierBuildId = createId()): BiosoldierBuild => {
  return {
    id,
    soldierClass,
    perks: [soldierClass.basePerk],
    geneMods: [...EMPTY_GENE_MODS],
    psionicAbilities: [],
    officerPerks: [],
    name: soldierClass.name,
    readonly: false,
  };
};

/**
 * Default builds: one per class with only the base perk selected, with fixed ids.
 */
const createDefaultBuilds = () => BIOSOLDIER_CLASSES.map(soldierClass => (
  createBiosoldierBuild(soldierClass, `${DEFAULT_BUILD_ID_PREFIX}${soldierClass.id}`)
));

/**
 * Saved biosoldier builds, kept in the local storage and synced between tabs.
 */
export const useBiosoldierBuildsStore = defineStore('build-calculator-biosoldier-builds', () => {
  const buildList = useBuildList<BiosoldierBuildData>({
    orderKey: BIOSOLDIER_BUILD_ORDER_KEY,
    itemKeyPrefix: BIOSOLDIER_BUILD_KEY_PREFIX,
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
   * Selects a gene mod of the body part of an editable build, or clears the body part.
   *
   * @param buildId build id.
   * @param bodyPartIndex body part index.
   * @param geneModId selected gene mod id, or null to clear the body part.
   */
  const selectBuildGeneMod = (buildId: BiosoldierBuildId, bodyPartIndex: number, geneModId: string | null) => {
    const build = buildList.findEditableBuild(buildId);

    if (!build) return;

    selectBiosoldierBuildGeneMod(build, bodyPartIndex, geneModId);
    buildList.markBuildChanged(buildId);
  };

  /**
   * Selects a psionic ability on the psi level of an editable build, or clears the level and all levels above.
   *
   * @param buildId build id.
   * @param levelIndex psi level index.
   * @param abilityId selected psionic ability id, or null to clear the level.
   */
  const selectBuildPsionicAbility = (buildId: BiosoldierBuildId, levelIndex: number, abilityId: string | null) => {
    const build = buildList.findEditableBuild(buildId);

    if (!build) return;

    selectBiosoldierBuildPsionicAbility(build, levelIndex, abilityId);
    buildList.markBuildChanged(buildId);
  };

  /**
   * Selects an officer perk on the officer rank of an editable build, or clears the officer rank and all officer ranks
   * above.
   *
   * @param buildId build id.
   * @param officerRankIndex officer rank index.
   * @param perkId selected officer perk id, or null to clear the officer rank.
   */
  const selectBuildOfficerPerk = (buildId: BiosoldierBuildId, officerRankIndex: number, perkId: string | null) => {
    const build = buildList.findEditableBuild(buildId);

    if (!build) return;

    selectBiosoldierBuildOfficerPerk(build, officerRankIndex, perkId);
    buildList.markBuildChanged(buildId);
  };

  /**
   * Adds a new build of the class with only the base perk selected.
   *
   * @param soldierClass biosoldier class of the new build.
   *
   * @returns id of the new build.
   */
  const addBuild = (soldierClass: SoldierClass) => {
    const build = createBiosoldierBuild(soldierClass);

    buildList.addBuild(build);

    return build.id;
  };

  /**
   * Resets an editable build to a new build of its class: only the base perk, no gene mods, psionic abilities or officer perks; the name stays.
   *
   * @param buildId build id.
   */
  const resetBuild = (buildId: BiosoldierBuildId) => {
    const build = buildList.findEditableBuild(buildId);

    if (!build) return;

    buildList.replaceBuild(buildId, { ...createBiosoldierBuild(build.soldierClass), name: build.name });
  };

  return {
    builds: buildList.builds,
    selectBuildPerk,
    selectBuildGeneMod,
    selectBuildPsionicAbility,
    selectBuildOfficerPerk,
    setName: buildList.setName,
    setReadonly: buildList.setReadonly,
    addBuild,
    importBuild: buildList.importBuild,
    replaceBuild: buildList.replaceBuild,
    resetBuild,
    removeBuild: buildList.removeBuild,
  };
});
