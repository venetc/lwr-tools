import { ref } from 'vue';

/**
 * Share code import form: open state, entered code and its validity; a valid code is passed on and closes the form.
 *
 * @param decode decodes a pasted code; null for an invalid code.
 * @param onImport receives the value of a valid code.
 */
export const useShareCodeImport = <Value>(decode: (code: string) => Value | null, onImport: (value: Value) => void) => {
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
   * Decodes the entered code: marks an invalid code, otherwise passes the value on and closes the form.
   */
  const submit = () => {
    const value = decode(code.value);

    if (value === null) {
      isInvalid.value = true;

      return;
    }

    onImport(value);
    setOpen(false);
  };

  return { isOpen, code, isInvalid, clearError, setOpen, submit };
};
