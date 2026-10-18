import type { MaybeRefOrGetter } from 'vue';
import { computed, ref, toValue } from 'vue';

import { createId } from '@shared/lib/id';
import { useToastQueue } from '@shared/ui/toast';

import type { BuildCodeKind, BuildDataByKind } from './build-codecs';
import { BUILD_CODECS } from './build-codecs';

/**
 * Share code import form: open state, entered code and its validity; a valid code is passed on and closes the form,
 * a code of another unit is reported with a toast and stays in the open form. The error is linked to the field while shown.
 *
 * @param kind kind of build code the form accepts.
 * @param onImport receives the build of a valid code.
 */
export const useShareCodeImport = <Kind extends BuildCodeKind>(
  kind: MaybeRefOrGetter<Kind>,
  onImport: (build: BuildDataByKind[Kind]) => void,
) => {
  const { showToast } = useToastQueue();

  const isOpen = ref(false);

  const code = ref('');

  const isInvalid = ref(false);

  const errorId = createId();

  const errorDescribedBy = computed(() => isInvalid.value ? errorId : null);

  /**
   * Hides the error once the code is edited.
   */
  const clearError = () => {
    isInvalid.value = false;
  };

  /**
   * Opens or closes the form; closing clears the code and the error.
   *
   * @param isNextOpen whether the form becomes open.
   */
  const setOpen = (isNextOpen: boolean) => {
    isOpen.value = isNextOpen;

    if (isNextOpen) return;

    code.value = '';
    clearError();
  };

  /**
   * Decodes the entered code: marks an invalid code, reports a code of another unit,
   * otherwise passes the build on and closes the form.
   */
  const submit = () => {
    const result = BUILD_CODECS[toValue(kind)].decode(code.value);

    if (result.status === 'invalid') {
      isInvalid.value = true;

      return;
    }

    if (result.status === 'other-unit') {
      showToast({ title: `This is a ${result.unit} build code`, description: `Import it in the ${result.unit} Build calculator.` });

      return;
    }

    onImport(result.build);
    setOpen(false);
  };

  return { isOpen, code, isInvalid, errorId, errorDescribedBy, clearError, setOpen, submit };
};
