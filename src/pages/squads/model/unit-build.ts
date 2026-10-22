import type { MaybeRefOrGetter } from 'vue';
import { computed, ref, toValue } from 'vue';

import { CLOSE_NOTE_TOAST_TITLE } from '../config/constants';
import type { SquadBuild } from './squad-build';

/**
 * Build of a Unit by its kind: the build of the kind it is, null for the other kinds.
 *
 * @param squadBuild build of the Unit.
 */
export const useKindBuilds = (squadBuild: MaybeRefOrGetter<SquadBuild>) => {
  const biosoldierBuild = computed(() => {
    const value = toValue(squadBuild);

    return value.kind === 'biosoldier' ? value.build : null;
  });

  const mecBuild = computed(() => {
    const value = toValue(squadBuild);

    return value.kind === 'mec' ? value.build : null;
  });

  const shivBuild = computed(() => {
    const value = toValue(squadBuild);

    return value.kind === 'shiv' ? value.build : null;
  });

  return { biosoldierBuild, mecBuild, shivBuild };
};

/**
 * Build of a Unit card: the build of its kind for the mini-tree and the Build dialog, whether the dialog is open, and
 * what closing it takes off as screen readers announce it.
 *
 * @param squadBuild build of the Unit.
 * @param closeNote what closing the Build dialog takes off the Units of the Build; null if nothing.
 * @param onClose tells that the Build dialog closed.
 */
export const useUnitBuild = (squadBuild: MaybeRefOrGetter<SquadBuild>, closeNote: MaybeRefOrGetter<string | null>, onClose: () => void) => {
  const { biosoldierBuild, mecBuild, shivBuild } = useKindBuilds(squadBuild);

  const isDialogOpen = ref(false);

  const isOpen = computed({
    get: () => isDialogOpen.value,
    set: (value: boolean) => {
      const wasOpen = isDialogOpen.value;

      isDialogOpen.value = value;

      if (value || !wasOpen) return;

      onClose();
    },
  });

  const closeNoteAnnouncement = computed(() => {
    const note = toValue(closeNote);

    return note ? `${CLOSE_NOTE_TOAST_TITLE}: ${note}` : '';
  });

  /**
   * Opens the Build dialog.
   */
  const openBuild = () => {
    isOpen.value = true;
  };

  return { biosoldierBuild, mecBuild, shivBuild, isOpen, openBuild, closeNoteAnnouncement };
};
