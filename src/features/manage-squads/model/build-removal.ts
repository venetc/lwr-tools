import { storeToRefs } from 'pinia';
import { computed, ref, shallowRef } from 'vue';

import type { LoadoutUnitId } from '@entities/loadout';

import { DELETE_WORD } from '../config/constants';
import type { BuildSquad } from './build-squads';
import { buildRemovalNote, buildSquads } from './build-squads';
import { useSquadsStore } from './squads';

/**
 * Build of a Build calculator, as its removal sees it.
 */
export interface RemovableBuild {
  /** Build id. */
  id: string
  /** Build name. */
  name: string
}

/**
 * Builds of a Build calculator and their removal, as the build removal works through them.
 */
export interface BuildRemovalActions {
  /** Builds of the Build calculator. */
  builds: readonly RemovableBuild[]
  /** Removes the build from its Build calculator. */
  removeBuild: (buildId: string) => void
}

/**
 * Build the dialog asks about, as it was when its removal was requested: the dialog text stays while it closes.
 */
interface PendingRemoval {
  /** Build id. */
  id: string
  /** Build name. */
  name: string
  /** Squads the build stands in. */
  squads: BuildSquad[]
}

/**
 * Removal of a build of a Build calculator that keeps Squads from breaking by accident: a build in no Squad is
 * removed at once, a build in Squads opens a dialog that lists them, and Delete removes the build with its Units;
 * closing the dialog keeps the build.
 *
 * @param kind kind of the builds: the unit type of the Build calculator.
 * @param actions builds of the Build calculator and their removal.
 */
export const useBuildRemoval = (kind: LoadoutUnitId, actions: BuildRemovalActions) => {
  const squadsStore = useSquadsStore();

  const { squads } = storeToRefs(squadsStore);

  const isDialogOpen = ref(false);

  const pendingRemoval = shallowRef<PendingRemoval | null>(null);

  const title = computed(() => `${DELETE_WORD} «${pendingRemoval.value?.name ?? ''}»?`);

  const note = computed(() => buildRemovalNote(pendingRemoval.value?.squads ?? []));

  /**
   * Removes a build in no Squad at once; for a build in Squads opens the dialog instead.
   *
   * @param id build id.
   */
  const removeBuild = (id: string) => {
    const squadsOfBuild = buildSquads(squads.value, { kind, id });

    if (!squadsOfBuild.length) {
      actions.removeBuild(id);
      return;
    }

    pendingRemoval.value = { id, name: actions.builds.find(build => build.id === id)?.name ?? '', squads: squadsOfBuild };
    isDialogOpen.value = true;
  };

  /**
   * Removes the build of the open dialog with its Units and their Loadouts, and closes the dialog.
   */
  const confirmRemoval = () => {
    if (!isDialogOpen.value || !pendingRemoval.value) return;

    squadsStore.removeBuildUnits({ kind, id: pendingRemoval.value.id });
    actions.removeBuild(pendingRemoval.value.id);
    isDialogOpen.value = false;
  };

  return { isDialogOpen, title, note, removeBuild, confirmRemoval };
};
