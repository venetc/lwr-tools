import type { MaybeRefOrGetter } from 'vue';
import { computed, toValue } from 'vue';

/**
 * Class list of the dialog content for its width.
 *
 * @param isWide whether the dialog takes the wide width.
 * @param style CSS module of the dialog.
 */
export const useDialogContentClass = (isWide: MaybeRefOrGetter<boolean>, style: Record<string, string>) => {
  return computed(() => [style.content, toValue(isWide) ? style.wide : style.regular]);
};
