import { defineStore } from 'pinia';
import { computed, markRaw, ref } from 'vue';

import type { SoldierClass, SoldierTalentRank } from '@entities/soldier';
import { SOLDIER_CLASSES, soldierClassTree } from '@entities/soldier';
import { createId } from '@shared/lib/id';
import type { TalentBuild, TalentTreeData } from '@shared/ui/talent-tree';

export type SoldierBuildId = string;

export interface SoldierBuild {
  /** Stable build id, unique among all builds including ones of the same class. */
  id: SoldierBuildId
  /** Soldier class of the build. */
  soldierClass: SoldierClass
  /** Class talent tree; static, kept non-reactive. */
  tree: TalentTreeData<SoldierTalentRank>
  /** Selected talents by rank. */
  talents: TalentBuild
  /** Build name shown in the heading. */
  name: string
  /** Whether the build is locked against editing. */
  readonly: boolean
}

/**
 * New editable build of the class with only the base talents selected.
 *
 * @param soldierClass soldier class.
 */
const createSoldierBuild = (soldierClass: SoldierClass): SoldierBuild => {
  const tree = markRaw(soldierClassTree(soldierClass));

  return {
    id: createId(),
    soldierClass,
    tree,
    talents: [...tree.baseBuild],
    name: soldierClass.name,
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
   * Replaces selected talents of the build.
   *
   * @param buildId build id.
   * @param talents new selected talents.
   */
  const setTalents = (buildId: SoldierBuildId, talents: TalentBuild) => {
    const build = findBuild(buildId);

    if (!build) return;

    build.talents = talents;
  };

  /**
   * Renames the build.
   *
   * @param buildId build id.
   * @param name new build name.
   */
  const setName = (buildId: SoldierBuildId, name: string) => {
    const build = findBuild(buildId);

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
   * Removes the build.
   *
   * @param buildId build id.
   */
  const removeBuild = (buildId: SoldierBuildId) => {
    buildsById.value.delete(buildId);
  };

  return {
    builds: computed<readonly Readonly<SoldierBuild>[]>(() => [...buildsById.value.values()]),
    setTalents,
    setName,
    setReadonly,
    addBuild,
    removeBuild,
  };
});
