import type { MaybeRefOrGetter } from 'vue';
import { computed, shallowRef, toValue } from 'vue';

import { useDescribedItem } from './described-item';
import type { TieredPickerGroup } from './tiered-picker';

/**
 * Groups of the picker: the one shown, starting with the first, and the description of its items: the described item
 * with its group, the note and whether related items follow.
 * Switching the group drops the inspected item, so the description falls back to the default of the new group.
 *
 * @param groups picker groups, at least one.
 * @param onSelect receives the group id, the tier index and the selected item id; null clears the tier.
 */
export const usePickerGroups = <Group extends TieredPickerGroup>(
  groups: MaybeRefOrGetter<readonly Group[]>,
  onSelect: (groupId: string, tierIndex: number, itemId: string | null) => void,
) => {
  const chosenGroupId = shallowRef<string | null>(null);

  const activeGroup = computed(() => {
    const allGroups = toValue(groups);

    return allGroups.find(({ id }) => id === chosenGroupId.value) ?? allGroups[0] ?? null;
  });

  const hasTabs = computed(() => toValue(groups).length > 1);

  const description = useDescribedItem(() => activeGroup.value?.tiers ?? [], () => activeGroup.value?.defaultItem ?? null);

  const activeGroupId = computed({
    get: () => activeGroup.value?.id ?? '',
    set: (groupId: string | number) => {
      chosenGroupId.value = String(groupId);
      description.forget();
    },
  });

  const described = computed(() => {
    const item = description.describedItem.value;
    const group = activeGroup.value;

    if (!item || !group) return null;

    return { item, group };
  });

  /**
   * Requests an item selection on a tier of the shown group; only the shown group has its tiers on the page.
   *
   * @param tierIndex tier index in the group.
   * @param itemId selected item id, or null to clear the tier.
   */
  const select = (tierIndex: number, itemId: string | null) => {
    if (!activeGroup.value) return;

    onSelect(activeGroup.value.id, tierIndex, itemId);
  };

  return {
    activeGroup,
    activeGroupId,
    hasTabs,
    described,
    describedNote: description.describedNote,
    hasRelated: description.hasRelated,
    describe: description.describe,
    select,
  };
};
