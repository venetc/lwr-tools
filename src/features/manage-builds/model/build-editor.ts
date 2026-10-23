import type { MaybeRefOrGetter } from 'vue';
import { toValue } from 'vue';

import type { LockableItem } from '@shared/lib/stored-list';

import type { NamedBuildData } from './build-list';

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
  /** Resets an editable build to a new build of its kind; the name stays. */
  resetBuild: (buildId: string) => void
}

/**
 * Editing of one build through its store: handlers of the build panel events for renaming, locking, replacement
 * and reset. Removal is not editing: the owner of the panel decides whether and how a build is removed.
 *
 * @param build build to edit.
 * @param actions store actions.
 */
export const useBuildEditor = <Data>(build: MaybeRefOrGetter<Readonly<LockableItem<NamedBuildData>>>, actions: BuildEditorActions<Data>) => {
  /**
   * Renames the build.
   *
   * @param name new build name.
   */
  const rename = (name: string) => actions.setName(toValue(build).id, name);

  /**
   * Locks or unlocks the build.
   *
   * @param isReadonly whether the build becomes readonly.
   */
  const lock = (isReadonly: boolean) => actions.setReadonly(toValue(build).id, isReadonly);

  /**
   * Replaces the build with imported data.
   *
   * @param data imported build data.
   */
  const replace = (data: Data) => actions.replaceBuild(toValue(build).id, data);

  /**
   * Resets the build to a new build of its kind; the name stays.
   */
  const reset = () => actions.resetBuild(toValue(build).id);

  return { rename, lock, replace, reset };
};
