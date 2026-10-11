import type { MaybeRefOrGetter } from 'vue';
import { computed, toValue } from 'vue';

import type { BiosoldierBuildData } from '@entities/biosoldier';

import type { BiosoldierBuild } from './biosoldier-builds';
import { useBiosoldierBuildsStore } from './biosoldier-builds';

/**
 * Editing of a build through the builds store: name and lock as writable values, perk selection and replacement.
 *
 * @param build biosoldier build.
 */
export const useBiosoldierBuildEditor = (build: MaybeRefOrGetter<Readonly<BiosoldierBuild>>) => {
  const biosoldierBuildsStore = useBiosoldierBuildsStore();

  const name = computed({
    get: () => toValue(build).name,
    set: value => biosoldierBuildsStore.setName(toValue(build).id, value),
  });

  const readonly = computed({
    get: () => toValue(build).readonly,
    set: value => biosoldierBuildsStore.setReadonly(toValue(build).id, value),
  });

  /**
   * Selects a perk on the rank of the build.
   *
   * @param rankIndex rank index in the tree.
   * @param perkId selected perk id, or null to clear the rank selection.
   */
  const selectPerk = (rankIndex: number, perkId: string | null) => {
    biosoldierBuildsStore.selectBuildPerk(toValue(build).id, rankIndex, perkId);
  };

  /**
   * Replaces the build with imported data.
   *
   * @param data imported build data.
   */
  const replace = (data: BiosoldierBuildData) => biosoldierBuildsStore.replaceBuild(toValue(build).id, data);

  return { name, readonly, selectPerk, replace };
};
