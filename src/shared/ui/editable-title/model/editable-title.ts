import type { MaybeRefOrGetter, Ref } from 'vue';
import { computed, toValue } from 'vue';

export interface EditableTitleOptions {
  /** Title text. */
  title: Ref<string>
  /** Title restored when the field is left blank. */
  fallback: MaybeRefOrGetter<string>
  /** Whether the title cannot be edited. */
  readonly: MaybeRefOrGetter<boolean>
}

/**
 * Editing of the title: whether it is editable, restoring the fallback for a blank title and finishing on Enter.
 *
 * @param options title, its fallback and the readonly state.
 */
export const useEditableTitle = (options: EditableTitleOptions) => {
  const isEditable = computed(() => !toValue(options.readonly));

  /**
   * Restores the fallback if the field was left blank.
   */
  const restoreBlankTitle = () => {
    if (options.title.value.trim() !== '') return;

    options.title.value = toValue(options.fallback);
  };

  /**
   * Finishes editing by removing focus.
   *
   * @param event key press in the field.
   */
  const finishEditing = (event: KeyboardEvent) => {
    if (event.target instanceof HTMLInputElement) event.target.blur();
  };

  return { isEditable, restoreBlankTitle, finishEditing };
};
