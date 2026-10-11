import type { MaybeRefOrGetter } from 'vue';
import { computed, toValue } from 'vue';

import type { ListedBuild, NamedBuildData } from './build-list';

/**
 * Store actions a build editor works through.
 */
export interface BuildEditorActions<Data> {
  /** Renames an editable build. */
  setName: (buildId: string, name: string) => void
  /** Locks or unlocks a build. */
  setReadonly: (buildId: string, isReadonly: boolean) => void
  /** Replaces an editable build with imported data. */
  replaceBuild: (buildId: string, data: Data) => void
  /** Selects a perk on a tier of an editable build, or clears the tier. */
  selectBuildPerk: (buildId: string, tierIndex: number, perkId: string | null) => void
  /** Removes a build. */
  removeBuild: (buildId: string) => void
}

/**
 * Editing of one build through its store: name and lock as writable values, perk selection, replacement and removal.
 *
 * @param build build to edit.
 * @param actions store actions.
 */
export const useBuildEditor = <Data>(build: MaybeRefOrGetter<Readonly<ListedBuild<NamedBuildData>>>, actions: BuildEditorActions<Data>) => {
  const name = computed({
    get: () => toValue(build).name,
    set: value => actions.setName(toValue(build).id, value),
  });

  const readonly = computed({
    get: () => toValue(build).readonly,
    set: value => actions.setReadonly(toValue(build).id, value),
  });

  /**
   * Selects a perk on the tier of the build, or clears the tier.
   *
   * @param tierIndex tier index in the tree.
   * @param perkId selected perk id, or null to clear the tier.
   */
  const selectPerk = (tierIndex: number, perkId: string | null) => {
    actions.selectBuildPerk(toValue(build).id, tierIndex, perkId);
  };

  /**
   * Replaces the build with imported data.
   *
   * @param data imported build data.
   */
  const replace = (data: Data) => actions.replaceBuild(toValue(build).id, data);

  /**
   * Removes the build.
   */
  const remove = () => actions.removeBuild(toValue(build).id);

  return { name, readonly, selectPerk, replace, remove };
};
