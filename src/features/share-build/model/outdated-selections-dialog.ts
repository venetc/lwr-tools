import type { MaybeRefOrGetter } from 'vue';
import { computed, toValue } from 'vue';

import { OUTDATED_SELECTIONS_DIALOG_TEXT } from '../config/constants';
import type { OutdatedSelectionGroup } from './outdated-selection-cards';

/**
 * What the Outdated selections dialog confirms: the import of a code or the update of an Outdated build.
 */
export type OutdatedSelectionsDialogMode = keyof typeof OUTDATED_SELECTIONS_DIALOG_TEXT;

/**
 * Texts of the Outdated selections dialog and whether its groups get Unit headings: only several groups do.
 *
 * @param mode what the dialog confirms.
 * @param groups card groups of the dialog.
 */
export const useOutdatedSelectionsDialog = (
  mode: MaybeRefOrGetter<OutdatedSelectionsDialogMode>,
  groups: MaybeRefOrGetter<readonly OutdatedSelectionGroup[]>,
) => {
  const text = computed(() => OUTDATED_SELECTIONS_DIALOG_TEXT[toValue(mode)]);

  const hasGroupHeadings = computed(() => toValue(groups).length > 1);

  return { text, hasGroupHeadings };
};
