import { defineStore } from 'pinia';

import type { BiosoldierBuildData, BiosoldierClass } from '@entities/biosoldier';
import { BIOSOLDIER_CLASSES, selectBiosoldierBuildPerk } from '@entities/biosoldier';
import { createId } from '@shared/lib/id';
import { useStoredList } from '@shared/lib/stored-list';

import { BUILD_KEY_PREFIX, BUILD_ORDER_KEY, DEFAULT_BUILD_ID_PREFIX } from '../config/constants';
import { parseBuild, serializeBuild } from './build-storage';

export type BiosoldierBuildId = string;

export interface BiosoldierBuild extends BiosoldierBuildData {
  /** Stable build id, unique among all builds including ones of the same class. */
  id: BiosoldierBuildId
  /** Whether the build is locked against editing. */
  readonly: boolean
}

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
  const buildList = useStoredList<BiosoldierBuild>({
    orderKey: BUILD_ORDER_KEY,
    itemKeyPrefix: BUILD_KEY_PREFIX,
    serialize: serializeBuild,
    parse: parseBuild,
    defaultItems: createDefaultBuilds,
  });

  /**
   * Editable build by id: null for a missing or locked build.
   *
   * @param buildId build id.
   */
  const findEditableBuild = (buildId: BiosoldierBuildId) => {
    const build = buildList.getItem(buildId);

    if (!build || build.readonly) return null;

    return build;
  };

  /**
   * Selects a perk on the rank of an editable build by the tree rules.
   *
   * @param buildId build id.
   * @param rankIndex rank index in the tree.
   * @param perkId selected perk id, or null to clear the rank selection.
   */
  const selectBuildPerk = (buildId: BiosoldierBuildId, rankIndex: number, perkId: string | null) => {
    const build = findEditableBuild(buildId);

    if (!build) return;

    selectBiosoldierBuildPerk(build, rankIndex, perkId);
    buildList.markItemChanged(buildId);
  };

  /**
   * Renames an editable build.
   *
   * @param buildId build id.
   * @param name new build name.
   */
  const setName = (buildId: BiosoldierBuildId, name: string) => {
    const build = findEditableBuild(buildId);

    if (!build) return;

    build.name = name;
    buildList.markItemChanged(buildId);
  };

  /**
   * Locks or unlocks the build against editing.
   *
   * @param buildId build id.
   * @param isReadonly whether the build is locked.
   */
  const setReadonly = (buildId: BiosoldierBuildId, isReadonly: boolean) => {
    const build = buildList.getItem(buildId);

    if (!build) return;

    build.readonly = isReadonly;
    buildList.markItemChanged(buildId);
  };

  /**
   * Adds a new build of the class with only the base perk selected.
   *
   * @param biosoldierClass biosoldier class of the new build.
   */
  const addBuild = (biosoldierClass: BiosoldierClass) => {
    buildList.addItem(createBiosoldierBuild(biosoldierClass));
  };

  /**
   * Adds a new editable build from imported data.
   *
   * @param data imported build data.
   */
  const importBuild = (data: BiosoldierBuildData) => {
    const build = createBiosoldierBuild(data.biosoldierClass);

    build.perks = [...data.perks];
    build.name = data.name;
    buildList.addItem(build);
  };

  /**
   * Replaces class, perks and name of an editable build with imported data; id and lock stay.
   *
   * @param buildId build id.
   * @param data imported build data.
   */
  const replaceBuild = (buildId: BiosoldierBuildId, data: BiosoldierBuildData) => {
    const build = findEditableBuild(buildId);

    if (!build) return;

    build.biosoldierClass = data.biosoldierClass;
    build.perks = [...data.perks];
    build.name = data.name;
    buildList.markItemChanged(buildId);
  };

  /**
   * Removes the build.
   *
   * @param buildId build id.
   */
  const removeBuild = (buildId: BiosoldierBuildId) => buildList.removeItem(buildId);

  return {
    builds: buildList.items,
    selectBuildPerk,
    setName,
    setReadonly,
    addBuild,
    importBuild,
    replaceBuild,
    removeBuild,
  };
});
