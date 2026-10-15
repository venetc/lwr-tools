import type { MaybeRefOrGetter } from 'vue';
import { computed, toValue } from 'vue';

import type { ListedBuild, NamedBuildData } from '@features/manage-builds';

/**
 * Requests of the build panel fields to its owner.
 */
export interface BuildPanelFieldRequests {
  /** Requests a new build name. */
  onRename: (name: string) => void
  /** Requests locking or unlocking the build. */
  onLock: (isReadonly: boolean) => void
}

/**
 * Name and lock of the build panel as writable values: they show the build and turn edits into requests.
 *
 * @param build build of the panel.
 * @param requests requests to the panel owner.
 */
export const useBuildPanelFields = (build: MaybeRefOrGetter<Readonly<ListedBuild<NamedBuildData>>>, requests: BuildPanelFieldRequests) => {
  const name = computed({
    get: () => toValue(build).name,
    set: requests.onRename,
  });

  const readonly = computed({
    get: () => toValue(build).readonly,
    set: requests.onLock,
  });

  const isEditable = computed(() => !readonly.value);

  return { name, readonly, isEditable };
};
