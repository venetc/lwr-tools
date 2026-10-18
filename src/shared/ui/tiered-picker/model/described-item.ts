import type { MaybeRefOrGetter } from 'vue';
import { computed, shallowRef, toValue } from 'vue';

import type { TieredPickerItem, TieredPickerOption, TieredPickerTier } from './tiered-picker';

/**
 * Inspected option, kept by ids so its description follows the current tiers.
 */
interface InspectedOption {
  /** Id of the option tier. */
  tierId: string
  /** Id of the option item. */
  itemId: string
}

/**
 * Item shown in the description panel with the note of its option: the last inspected one as the current tiers have it,
 * otherwise the default one.
 *
 * @param tiers current picker tiers.
 * @param defaultItem item described while none is inspected.
 */
export const useDescribedItem = (
  tiers: MaybeRefOrGetter<readonly TieredPickerTier[]>,
  defaultItem: MaybeRefOrGetter<TieredPickerItem | null>,
) => {
  const inspected = shallowRef<InspectedOption | null>(null);

  const inspectedOption = computed((): TieredPickerOption | null => {
    const inspectedIds = inspected.value;

    if (!inspectedIds) return null;

    const tier = toValue(tiers).find(({ id }) => id === inspectedIds.tierId);

    return tier?.options.find(({ item }) => item.id === inspectedIds.itemId) ?? null;
  });

  const defaultOption = computed((): TieredPickerOption | null => {
    const itemId = toValue(defaultItem)?.id;

    if (!itemId) return null;

    return toValue(tiers).flatMap(tier => tier.options).find(({ item }) => item.id === itemId) ?? null;
  });

  const describedItem = computed(() => inspectedOption.value?.item ?? toValue(defaultItem));

  const describedNote = computed(() => (inspectedOption.value ?? defaultOption.value)?.note ?? null);

  const hasRelated = computed(() => (describedItem.value?.related.length ?? 0) > 0);

  /**
   * Shows the option item in the description panel.
   *
   * @param tier tier of the option.
   * @param option option inspected by the user.
   */
  const describe = (tier: TieredPickerTier, option: TieredPickerOption) => {
    inspected.value = { tierId: tier.id, itemId: option.item.id };
  };

  /**
   * Drops the inspected option, so the default item is described.
   */
  const forget = () => {
    inspected.value = null;
  };

  return { describedItem, describedNote, hasRelated, describe, forget };
};
