import type { MaybeRefOrGetter } from 'vue';
import { computed, toValue } from 'vue';

/**
 * Class list of the tier label icon: the label color when highlighted, the accent otherwise.
 *
 * @param highlighted whether the icon takes the label color.
 * @param style CSS module of the label.
 */
export const useTierLabelIconClass = (highlighted: MaybeRefOrGetter<boolean>, style: Record<string, string>) => {
  return computed(() => [style.icon, toValue(highlighted) ? style.iconHighlighted : style.iconRegular]);
};
