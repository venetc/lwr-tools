import { ref, shallowRef } from 'vue';

import type { OutdatedSelectionGroup } from './outdated-selection-cards';
import { outdatedSelectionGroups } from './outdated-selection-cards';
import type { DecodedSquadBuild } from './squad-code';

/**
 * Import of a read share code through the Outdated selections dialog: a code whose builds have Outdated selections
 * opens the dialog, and only its confirmation imports; a code without them imports at once. Closing the dialog without
 * the confirmation drops the read code.
 *
 * @param onImport imports the read code: its builds already without the Outdated selections.
 */
export const useOutdatedImport = <Value extends object>(onImport: (value: Value) => void) => {
  const isOpen = ref(false);

  const groups = shallowRef<OutdatedSelectionGroup[]>([]);

  const pending = shallowRef<Value | null>(null);

  /**
   * Opens or closes the dialog; closing it without the confirmation drops the read code.
   *
   * @param isNextOpen whether the dialog becomes open.
   */
  const setOpen = (isNextOpen: boolean) => {
    isOpen.value = isNextOpen;

    if (!isNextOpen) pending.value = null;
  };

  /**
   * Imports the read code at once, or opens the dialog with the cards of its builds if any of them has Outdated
   * selections.
   *
   * @param builds builds of the code: the build of a Unit or the builds of a Squad.
   * @param value what the code imports.
   */
  const requestImport = (builds: readonly DecodedSquadBuild[], value: Value) => {
    const nextGroups = outdatedSelectionGroups(builds);

    if (!nextGroups.length) {
      onImport(value);

      return;
    }

    groups.value = nextGroups;
    pending.value = value;
    setOpen(true);
  };

  /**
   * Confirms the dialog: closes it and imports the read code.
   */
  const confirm = () => {
    const value = pending.value;

    if (!value) return;

    setOpen(false);
    onImport(value);
  };

  return { isOpen, groups, setOpen, requestImport, confirm };
};
