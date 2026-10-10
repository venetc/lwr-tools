import { defineStore } from 'pinia';
import { computed, ref } from 'vue';

import type { BiosoldierBuildData, BiosoldierClass } from '@entities/biosoldier';
import { BIOSOLDIER_CLASSES, selectBiosoldierBuildTalent } from '@entities/biosoldier';
import { createId } from '@shared/lib/id';

import { DEFAULT_BUILD_ID_PREFIX } from '../config/constants';
import { loadBuilds } from './build-storage';
import { useBuildSync } from './useBuildSync';

export type BiosoldierBuildId = string;

export interface BiosoldierBuild extends BiosoldierBuildData {
  /** Stable build id, unique among all builds including ones of the same class. */
  id: BiosoldierBuildId
  /** Whether the build is locked against editing. */
  readonly: boolean
}

/**
 * New editable build of the class with only the base talents selected.
 *
 * @param biosoldierClass biosoldier class.
 * @param id build id; random by default.
 */
const createBiosoldierBuild = (biosoldierClass: BiosoldierClass, id: BiosoldierBuildId = createId()): BiosoldierBuild => {
  return {
    id,
    biosoldierClass,
    talents: [...biosoldierClass.baseBuild],
    name: biosoldierClass.name,
    readonly: false,
  };
};

/**
 * Default builds: one per class with only the base talents selected, with fixed ids.
 */
const createDefaultBuilds = () => BIOSOLDIER_CLASSES.reduce((acc, biosoldierClass) => {
  const build = createBiosoldierBuild(biosoldierClass, `${DEFAULT_BUILD_ID_PREFIX}${biosoldierClass.id}`);

  acc.set(build.id, build);

  return acc;
}, new Map<BiosoldierBuildId, BiosoldierBuild>());

/**
 * Builds of the Biosoldier Build calculator, saved to the local storage and synced between tabs.
 */
export const useBiosoldierBuildsStore = defineStore('pages-biosoldier-builds', () => {
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
  const findEditableBuild = (buildId: BiosoldierBuildId) => {
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
  const selectBuildTalent = (buildId: BiosoldierBuildId, rankIndex: number, talentId: string | null) => {
    const build = findEditableBuild(buildId);

    if (!build) return;

    selectBiosoldierBuildTalent(build, rankIndex, talentId);
    markBuildChanged(buildId);
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
    markBuildChanged(buildId);
  };

  /**
   * Locks or unlocks the build against editing.
   *
   * @param buildId build id.
   * @param isReadonly whether the build is locked.
   */
  const setReadonly = (buildId: BiosoldierBuildId, isReadonly: boolean) => {
    const build = buildsById.value.get(buildId) ?? null;

    if (!build) return;

    build.readonly = isReadonly;
    markBuildChanged(buildId);
  };

  /**
   * Adds a new build of the class with only the base talents selected.
   *
   * @param biosoldierClass biosoldier class of the new build.
   */
  const addBuild = (biosoldierClass: BiosoldierClass) => {
    const build = createBiosoldierBuild(biosoldierClass);

    buildsById.value.set(build.id, build);
    markBuildChanged(build.id);
    markOrderChanged();
  };

  /**
   * Adds a new editable build from imported data.
   *
   * @param data imported build data.
   */
  const importBuild = (data: BiosoldierBuildData) => {
    const build = createBiosoldierBuild(data.biosoldierClass);

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
  const replaceBuild = (buildId: BiosoldierBuildId, data: BiosoldierBuildData) => {
    const build = findEditableBuild(buildId);

    if (!build) return;

    build.biosoldierClass = data.biosoldierClass;
    build.talents = [...data.talents];
    build.name = data.name;
    markBuildChanged(buildId);
  };

  /**
   * Removes the build.
   *
   * @param buildId build id.
   */
  const removeBuild = (buildId: BiosoldierBuildId) => {
    buildsById.value.delete(buildId);
    markBuildChanged(buildId);
    markOrderChanged();
  };

  return {
    builds: computed<readonly Readonly<BiosoldierBuild>[]>(() => [...buildsById.value.values()]),
    selectBuildTalent,
    setName,
    setReadonly,
    addBuild,
    importBuild,
    replaceBuild,
    removeBuild,
  };
});
