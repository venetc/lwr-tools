import type { MaybeRefOrGetter } from 'vue';
import { computed, toValue } from 'vue';

import { OUTDATED_SELECTIONS_DIALOG_TEXT } from '../config/constants';

/**
 * What the Outdated selections dialog confirms: the import of a code or the update of an Outdated build.
 */
export type OutdatedSelectionsDialogMode = keyof typeof OUTDATED_SELECTIONS_DIALOG_TEXT;

/**
 * Texts of the Outdated selections dialog.
 *
 * @param mode what the dialog confirms.
 */
export const useOutdatedSelectionsDialog = (mode: MaybeRefOrGetter<OutdatedSelectionsDialogMode>) => {
  const text = computed(() => OUTDATED_SELECTIONS_DIALOG_TEXT[toValue(mode)]);

  return { text };
};
