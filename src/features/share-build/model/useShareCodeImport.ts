import { ref } from 'vue';

import { useToastQueue } from '@shared/ui/toast';

import type { ShareCodeDecodeResult } from './share-code';

/**
 * Share code import form: open state, entered code and its validity; a valid code is passed on and closes the form,
 * a code of another unit is reported with a toast and stays in the open form.
 *
 * @param decode decodes a pasted code.
 * @param onImport receives the value of a valid code.
 */
export const useShareCodeImport = <Value>(
  decode: (code: string) => ShareCodeDecodeResult<Value>,
  onImport: (value: Value) => void,
) => {
  const { showToast } = useToastQueue();

  const isOpen = ref(false);

  const code = ref('');

  const isInvalid = ref(false);

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
   * otherwise passes the value on and closes the form.
   */
  const submit = () => {
    const result = decode(code.value);

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

  return { isOpen, code, isInvalid, clearError, setOpen, submit };
};
