import { ref } from 'vue';

import { useSquadsStore } from '@features/manage-squads';
import { readShareCode } from '@features/share-build';
import { useToastQueue } from '@shared/ui/toast';

import { INVALID_SHARE_CODE_TEXT, UNIT_CODE_IN_SQUAD_IMPORT_TEXT } from '../config/constants';
import { importSquadBuild } from './squad-builds';
import { importUnits, squadImportToast } from './unit-import';

/**
 * Squad import dialog of the toolbar: a Squad code becomes a new Squad with new builds in the Build calculators, which
 * opens; Units of one build share one new build, and their Loadouts are brought to the rules by the Unit check. A Unit
 * code or a build code is sent to an empty cell and an invalid code shows the error, both under the field.
 */
export const useSquadImport = () => {
  const squadsStore = useSquadsStore();

  const { showToast } = useToastQueue();

  const code = ref('');

  const error = ref<string | null>(null);

  const isOpen = ref(false);

  /**
   * Opens or closes the dialog; closing clears the code and the error.
   *
   * @param isNextOpen whether the dialog becomes open.
   */
  const setOpen = (isNextOpen: boolean) => {
    isOpen.value = isNextOpen;

    if (isNextOpen) return;

    code.value = '';
    error.value = null;
  };

  /**
   * Imports the entered Squad code as a new Squad and opens it, closing the dialog; tells where the builds went and
   * what the Unit check took off.
   */
  const importSquadCode = () => {
    const result = readShareCode(code.value);

    if (result.status !== 'squad') {
      error.value = result.status === 'unit' ? UNIT_CODE_IN_SQUAD_IMPORT_TEXT : INVALID_SHARE_CODE_TEXT;

      return;
    }

    const units = importUnits(result.squad, importSquadBuild);

    squadsStore.importSquad(result.squad.name, units);
    setOpen(false);
    showToast(squadImportToast(squadsStore.openSquad?.name ?? result.squad.name, units));
  };

  return { isOpen, code, error, setOpen, importSquadCode };
};
