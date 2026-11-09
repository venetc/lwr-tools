import type { MaybeRefOrGetter } from 'vue';
import { computed, toValue } from 'vue';

/** Width of the dialog beyond a phone: regular for forms, wide for content in columns, fit to hug its content. */
export type DialogWidth = 'regular' | 'wide' | 'fit';

/**
 * State of the dialog drawn from its props.
 *
 * @param width width of the dialog beyond a phone.
 * @param isHeaderless whether the dialog draws no header of its own.
 * @param style CSS module of the dialog.
 */
export const useDialog = (
  width: MaybeRefOrGetter<DialogWidth>,
  isHeaderless: MaybeRefOrGetter<boolean>,
  style: Record<string, string>,
) => {
  const contentClass = computed(() => [style.content, style[toValue(width)]]);

  /**
   * Focuses the dialog itself on open when it has no header, instead of the first control of its content, such as a text field that would bring up the keyboard on a phone.
   *
   * @param event auto-focus event of the dialog content, dispatched on the content element.
   */
  const focusOnOpen = (event: Event) => {
    if (!toValue(isHeaderless)) return;

    event.preventDefault();

    if (event.target instanceof HTMLElement) event.target.focus();
  };

  return { contentClass, focusOnOpen };
};
