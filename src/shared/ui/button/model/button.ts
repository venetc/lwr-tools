import type { MaybeRefOrGetter } from 'vue';
import { computed, toValue } from 'vue';

export type ButtonVariant = 'primary' | 'secondary' | 'danger';

/**
 * Class list of the button for its variant.
 *
 * @param variant visual variant.
 * @param style CSS module of the button.
 */
export const useButtonClass = (variant: MaybeRefOrGetter<ButtonVariant>, style: Record<string, string>) => {
  return computed(() => [style.button, style[toValue(variant)]]);
};
