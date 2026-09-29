import { defineStore } from 'pinia';
import { computed, ref } from 'vue';

import type { SoldierBuildData, SoldierClass } from '@entities/soldier';
import { selectSoldierBuildTalent, SOLDIER_CLASSES } from '@entities/soldier';
import { createId } from '@shared/lib/id';

import { DEFAULT_BUILD_ID_PREFIX } from '../config/constants';
import { loadBuilds } from './build-storage';
import { useBuildSync } from './useBuildSync';

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
 * @param id build id; random by default.
 */
const createSoldierBuild = (soldierClass: SoldierClass, id: SoldierBuildId = createId()): SoldierBuild => {
  return {
    id,
    soldierClass,
    talents: [...soldierClass.baseBuild],
    name: soldierClass.name,
    readonly: false,
  };
};

/**
 * Default builds: one per class with only the base talents selected, with fixed ids.
 */
const createDefaultBuilds = () => SOLDIER_CLASSES.reduce((acc, soldierClass) => {
  const build = createSoldierBuild(soldierClass, `${DEFAULT_BUILD_ID_PREFIX}${soldierClass.id}`);

  acc.set(build.id, build);

  return acc;
}, new Map<SoldierBuildId, SoldierBuild>());

/**
 * Soldier builds of the talents page, saved to the local storage and synced between tabs.
 */
export const useTalentsStore = defineStore('pages-talents', () => {
  const storedBuilds = loadBuilds();

  const buildsById = ref(storedBuilds ?? createDefaultBuilds());

  const { markBuildChanged, markOrderChanged } = useBuildSync(buildsById);

  if (!storedBuilds) {
    buildsById.value.forEach(build => markBuildChanged(build.id));
    markOrderChanged();
  }

  /**
   * Editable build by id: null for a missing or locked build.
   *
   * @param buildId build id.
   */
  const findEditableBuild = (buildId: SoldierBuildId) => {
    const build = buildsById.value.get(buildId) ?? null;

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

    selectSoldierBuildTalent(build, rankIndex, talentId);
    markBuildChanged(buildId);
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
    markBuildChanged(buildId);
  };

  /**
   * Locks or unlocks the build against editing.
   *
   * @param buildId build id.
   * @param isReadonly whether the build is locked.
   */
  const setReadonly = (buildId: SoldierBuildId, isReadonly: boolean) => {
    const build = buildsById.value.get(buildId) ?? null;

    if (!build) return;

    build.readonly = isReadonly;
    markBuildChanged(buildId);
  };

  /**
   * Adds a new build of the class with only the base talents selected.
   *
   * @param soldierClass soldier class of the new build.
   */
  const addBuild = (soldierClass: SoldierClass) => {
    const build = createSoldierBuild(soldierClass);

    buildsById.value.set(build.id, build);
    markBuildChanged(build.id);
    markOrderChanged();
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
    markBuildChanged(build.id);
    markOrderChanged();
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
    markBuildChanged(buildId);
  };

  /**
   * Removes the build.
   *
   * @param buildId build id.
   */
  const removeBuild = (buildId: SoldierBuildId) => {
    buildsById.value.delete(buildId);
    markBuildChanged(buildId);
    markOrderChanged();
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
