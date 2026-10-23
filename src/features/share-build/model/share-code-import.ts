import type { MaybeRefOrGetter } from 'vue';
import { ref, toValue } from 'vue';

import type { LoadoutUnitId } from '@entities/loadout';
import { LOADOUT_UNITS } from '@entities/loadout';
import { useToastQueue } from '@shared/ui/toast';

import { INVALID_CODE_TEXT } from '../config/constants';
import type { BuildDataByKind } from './build-code';
import { useOutdatedImport } from './outdated-import';
import { readShareCode } from './share-code';
import { isUnitOf } from './unit-code';

/**
 * Share code import form: open state, entered code and its error; a valid code is passed on and closes the form, a
 * code of another unit or a Squad code is reported with a toast and stays in the open form, and an invalid code shows
 * the error under the field. A code with Outdated selections opens the Outdated selections dialog over the form: its
 * confirmation passes the build without them on and closes both, its cancel closes the dialog only.
 *
 * @param kind kind of build code the form accepts.
 * @param onImport receives the build of a valid code.
 */
export const useShareCodeImport = <Kind extends LoadoutUnitId>(
  kind: MaybeRefOrGetter<Kind>,
  onImport: (build: BuildDataByKind[Kind]) => void,
) => {
  const { showToast } = useToastQueue();

  const isOpen = ref(false);

  const code = ref('');

  const error = ref<string | null>(null);

  /**
   * Closes the form and clears the code and the error.
   */
  const closeForm = () => {
    isOpen.value = false;
    code.value = '';
    error.value = null;
  };

  const {
    isOpen: isOutdatedOpen,
    groups: outdatedGroups,
    setOpen: setOutdatedOpen,
    requestImport,
    confirm: confirmOutdated,
  } = useOutdatedImport<{ build: BuildDataByKind[Kind] }>(({ build }) => {
    onImport(build);
    closeForm();
  });

  /**
   * Opens or closes the form; closing clears the code and the error. The form stays open under the Outdated selections
   * dialog, which takes the focus from it.
   *
   * @param isNextOpen whether the form becomes open.
   */
  const setOpen = (isNextOpen: boolean) => {
    if (isNextOpen) {
      isOpen.value = true;

      return;
    }

    if (!isOutdatedOpen.value) closeForm();
  };

  /**
   * Reads the entered code: a Build code or a Unit code of the kind passes its build on and closes the form, or opens
   * the Outdated selections dialog if the code has them; one of another unit or a Squad code is reported with a toast;
   * anything else marks the code invalid.
   */
  const submit = () => {
    const result = readShareCode(code.value);

    if (result.status === 'invalid') {
      error.value = INVALID_CODE_TEXT;

      return;
    }

    if (result.status === 'squad') {
      showToast({ title: 'This is a Squad code', description: 'Import it in the Squad planner.' });

      return;
    }

    if (!isUnitOf(result.unit, toValue(kind))) {
      const unitName = LOADOUT_UNITS.find(unit => unit.id === result.unit.kind)?.name;

      showToast({ title: `This is a ${unitName} build code`, description: `Import it in the ${unitName} Build calculator.` });

      return;
    }

    requestImport([result.unit], result.unit);
  };

  return { isOpen, code, error, isOutdatedOpen, outdatedGroups, setOpen, setOutdatedOpen, confirmOutdated, submit };
};
