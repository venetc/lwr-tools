import { computed, ref } from 'vue';

import { createId } from '@shared/lib/id';

/**
 * Share code field of the Squad planner: the entered code and the message of a code the field does not take, an invalid
 * code or a code of another place, linked to the field while shown.
 */
export const useShareCodeField = () => {
  const code = ref('');

  const error = ref<string | null>(null);

  const isInvalid = computed(() => error.value !== null);

  const errorId = createId();

  const errorDescribedBy = computed(() => (error.value ? errorId : null));

  /**
   * Shows why the field does not take the code.
   *
   * @param text message under the field.
   */
  const showError = (text: string) => {
    error.value = text;
  };

  /**
   * Hides the message once the code is edited.
   */
  const clearError = () => {
    error.value = null;
  };

  /**
   * Clears the code and the message.
   */
  const reset = () => {
    code.value = '';
    clearError();
  };

  return { code, error, isInvalid, errorId, errorDescribedBy, showError, clearError, reset };
};
