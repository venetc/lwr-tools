import type { MaybeRefOrGetter } from 'vue';
import { computed, toValue } from 'vue';

import type { SoldierBuildData } from '@entities/soldier';

import type { SoldierBuild } from './talents';
import { useTalentsStore } from './talents';

/**
 * Editing of a build through the talents store: name and lock as writable values, talent selection and replacement.
 *
 * @param build soldier build.
 */
export const useSoldierBuildEditor = (build: MaybeRefOrGetter<Readonly<SoldierBuild>>) => {
  const talentsStore = useTalentsStore();

  const name = computed({
    get: () => toValue(build).name,
    set: value => talentsStore.setName(toValue(build).id, value),
  });

  const readonly = computed({
    get: () => toValue(build).readonly,
    set: value => talentsStore.setReadonly(toValue(build).id, value),
  });

  /**
   * Selects a talent on the rank of the build.
   *
   * @param rankIndex rank index in the tree.
   * @param talentId selected talent id, or null to clear the rank selection.
   */
  const selectTalent = (rankIndex: number, talentId: string | null) => {
    talentsStore.selectBuildTalent(toValue(build).id, rankIndex, talentId);
  };

  /**
   * Replaces the build with imported data.
   *
   * @param data imported build data.
   */
  const replace = (data: SoldierBuildData) => talentsStore.replaceBuild(toValue(build).id, data);

  return { name, readonly, selectTalent, replace };
};
