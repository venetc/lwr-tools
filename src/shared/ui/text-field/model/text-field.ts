import type { Ref } from 'vue';
import { computed } from 'vue';

import { createId } from '@shared/lib/id';

/**
 * Error of a text field: ids of the field and of its message, the link between them while the message is shown, and
 * hiding the message once the text is edited.
 *
 * @param error message under the field; null without one.
 */
export const useTextField = (error: Ref<string | null>) => {
  const inputId = createId();

  const errorId = createId();

  const isInvalid = computed(() => error.value !== null);

  const errorDescribedBy = computed(() => (isInvalid.value ? errorId : null));

  /**
   * Hides the message once the text is edited.
   */
  const clearError = () => {
    error.value = null;
  };

  return { inputId, errorId, isInvalid, errorDescribedBy, clearError };
};
