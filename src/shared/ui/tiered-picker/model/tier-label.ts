import type { MaybeRefOrGetter } from 'vue';
import { computed, toValue } from 'vue';

/**
 * Class lists of the tier label: the icon in the label color when highlighted and in the accent otherwise,
 * and the image faded or regular.
 *
 * @param options label state and styles.
 * @param options.highlighted whether the icon takes the label color.
 * @param options.faded whether the image is faded.
 * @param options.style CSS module of the label.
 */
export const useTierLabelClasses = (options: {
  highlighted: MaybeRefOrGetter<boolean>
  faded: MaybeRefOrGetter<boolean>
  style: Record<string, string>
}) => {
  const { highlighted, faded, style } = options;

  const iconClass = computed(() => [style.icon, toValue(highlighted) ? style.iconHighlighted : style.iconRegular]);

  const imageClass = computed(() => [style.image, toValue(faded) ? style.imageFaded : style.imageRegular]);

  return { iconClass, imageClass };
};
