import type { MaybeRefOrGetter } from 'vue';
import { computed, ref, toValue } from 'vue';

import { CLOSE_NOTE_TOAST_TITLE } from '../config/constants';
import type { SquadBuild } from './squad-build';
import { squadBuildClassIcon } from './squad-build';
import { SQUAD_BUILD_KINDS } from './squad-build-kinds';

/**
 * How a Unit card shows the build of its kind: the mini-tree, the tree of the Build dialog, the class icon and the
 * officer rank badge.
 *
 * @param squadBuild build of the Unit.
 */
export const useSquadBuildViews = (squadBuild: MaybeRefOrGetter<SquadBuild>) => {
  const miniTree = computed(() => SQUAD_BUILD_KINDS[toValue(squadBuild).kind].miniTree);

  const buildTree = computed(() => SQUAD_BUILD_KINDS[toValue(squadBuild).kind].buildTree);

  const buildIcon = computed(() => SQUAD_BUILD_KINDS[toValue(squadBuild).kind].buildIcon);

  const classIcon = computed(() => squadBuildClassIcon(toValue(squadBuild)));

  const officerRankBadge = computed(() => SQUAD_BUILD_KINDS[toValue(squadBuild).kind].officerRankBadge);

  return { miniTree, buildTree, buildIcon, classIcon, officerRankBadge };
};

/**
 * Build of a Unit card: the mini-tree and the tree of the Build dialog of its kind, whether the dialog is open, and
 * what closing it takes off as screen readers announce it.
 *
 * @param squadBuild build of the Unit.
 * @param closeNote what closing the Build dialog takes off the Units of the Build; null if nothing.
 * @param onClose tells that the Build dialog closed.
 */
export const useUnitBuild = (squadBuild: MaybeRefOrGetter<SquadBuild>, closeNote: MaybeRefOrGetter<string | null>, onClose: () => void) => {
  const { miniTree, buildTree } = useSquadBuildViews(squadBuild);

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

  return { miniTree, buildTree, isOpen, openBuild, closeNoteAnnouncement };
};
