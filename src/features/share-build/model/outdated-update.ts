import type { MaybeRefOrGetter } from 'vue';
import { computed, ref, toValue } from 'vue';

import type { LoadoutUnitId } from '@entities/loadout';

import type { StoredOutdatedBuild } from './build-code';
import { outdatedUpdateGroups } from './outdated-selection-cards';

/**
 * Update of an Outdated build through the «Update build» dialog: the dialog shows the cards of its Outdated selections,
 * and only its confirmation updates the build.
 *
 * @param kind unit type of the build.
 * @param outdated stored record of the Outdated build; null for a build without Outdated selections.
 * @param onUpdate updates the build.
 */
export const useOutdatedUpdate = <Kind extends LoadoutUnitId>(
  kind: MaybeRefOrGetter<Kind>,
  outdated: MaybeRefOrGetter<StoredOutdatedBuild<Kind> | null>,
  onUpdate: () => void,
) => {
  const isOpen = ref(false);

  const groups = computed(() => outdatedUpdateGroups(toValue(kind), toValue(outdated)?.selections ?? []));

  /**
   * Opens the dialog.
   */
  const open = () => {
    isOpen.value = true;
  };

  /**
   * Confirms the dialog: closes it and updates the build.
   */
  const confirm = () => {
    isOpen.value = false;
    onUpdate();
  };

  return { isOpen, groups, open, confirm };
};
