import { defineStore } from 'pinia';
import { computed, ref } from 'vue';

import type { SoldierBuildData, SoldierClass } from '@entities/soldier';
import { SOLDIER_CLASSES, soldierBuildName, soldierClassBaseBuild, soldierClassTalentTree } from '@entities/soldier';
import { createId } from '@shared/lib/id';
import { selectTalent } from '@shared/lib/talent-tree';

export type SoldierBuildId = string;

export interface SoldierBuild extends SoldierBuildData {
  /** Stable build id, unique among all builds including ones of the same class. */
  id: SoldierBuildId
  /** Whether the build is locked against editing. */
  readonly: boolean
}

/**
 * New editable build of the class with only the base talents selected.
 *
 * @param soldierClass soldier class.
 */
const createSoldierBuild = (soldierClass: SoldierClass): SoldierBuild => {
  return {
    id: createId(),
    soldierClass,
    talents: soldierClassBaseBuild(soldierClass),
    name: soldierBuildName(soldierClass, ''),
    readonly: false,
  };
};

/**
 * Soldier builds of the talents page.
 */
export const useTalentsStore = defineStore('pages-talents', () => {
  const buildsById = ref(SOLDIER_CLASSES.reduce((acc, soldierClass) => {
    const build = createSoldierBuild(soldierClass);

    acc.set(build.id, build);

    return acc;
  }, new Map<SoldierBuildId, SoldierBuild>()));

  /**
   * Build by id.
   *
   * @param buildId build id.
   */
  const findBuild = (buildId: SoldierBuildId) => buildsById.value.get(buildId) ?? null;

  /**
   * Editable build by id: null for a missing or locked build.
   *
   * @param buildId build id.
   */
  const findEditableBuild = (buildId: SoldierBuildId) => {
    const build = findBuild(buildId);

    if (!build || build.readonly) return null;

    return build;
  };

  /**
   * Selects a talent on the rank of an editable build by the tree rules.
   *
   * @param buildId build id.
   * @param rankIndex rank index in the tree.
   * @param talentId selected talent id, or null to clear the rank selection.
   */
  const selectBuildTalent = (buildId: SoldierBuildId, rankIndex: number, talentId: string | null) => {
    const build = findEditableBuild(buildId);

    if (!build) return;

    selectTalent(soldierClassTalentTree(build.soldierClass), build.talents, rankIndex, talentId);
  };

  /**
   * Renames an editable build.
   *
   * @param buildId build id.
   * @param name new build name.
   */
  const setName = (buildId: SoldierBuildId, name: string) => {
    const build = findEditableBuild(buildId);

    if (!build) return;

    build.name = name;
  };

  /**
   * Locks or unlocks the build against editing.
   *
   * @param buildId build id.
   * @param isReadonly whether the build is locked.
   */
  const setReadonly = (buildId: SoldierBuildId, isReadonly: boolean) => {
    const build = findBuild(buildId);

    if (!build) return;

    build.readonly = isReadonly;
  };

  /**
   * Adds a new build of the class with only the base talents selected.
   *
   * @param soldierClass soldier class of the new build.
   */
  const addBuild = (soldierClass: SoldierClass) => {
    const build = createSoldierBuild(soldierClass);

    buildsById.value.set(build.id, build);
  };

  /**
   * Adds a new editable build from imported data.
   *
   * @param data imported build data.
   */
  const importBuild = (data: SoldierBuildData) => {
    const build = createSoldierBuild(data.soldierClass);

    build.talents = [...data.talents];
    build.name = data.name;
    buildsById.value.set(build.id, build);

    return build.id;
  };

  /**
   * Replaces class, talents and name of an editable build with imported data; id and lock stay.
   *
   * @param buildId build id.
   * @param data imported build data.
   */
  const replaceBuild = (buildId: SoldierBuildId, data: SoldierBuildData) => {
    const build = findEditableBuild(buildId);

    if (!build) return;

    build.soldierClass = data.soldierClass;
    build.talents = [...data.talents];
    build.name = data.name;
  };

  /**
   * Removes the build.
   *
   * @param buildId build id.
   */
  const removeBuild = (buildId: SoldierBuildId) => {
    buildsById.value.delete(buildId);
  };

  return {
    builds: computed<readonly Readonly<SoldierBuild>[]>(() => [...buildsById.value.values()]),
    selectBuildTalent,
    setName,
    setReadonly,
    addBuild,
    importBuild,
    replaceBuild,
    removeBuild,
  };
});
