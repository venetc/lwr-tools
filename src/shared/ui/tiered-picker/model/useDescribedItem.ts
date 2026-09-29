import type { MaybeRefOrGetter } from 'vue';
import { computed, shallowRef, toValue } from 'vue';

import type { TieredPickerItem } from './tiered-picker';

/**
 * Item shown in the description panel: the last inspected one, otherwise the default one.
 *
 * @param defaultItem item described while none is inspected.
 */
export const useDescribedItem = (defaultItem: MaybeRefOrGetter<TieredPickerItem | null>) => {
  const inspectedItem = shallowRef<TieredPickerItem | null>(null);

  const describedItem = computed(() => inspectedItem.value ?? toValue(defaultItem));

  const hasRelated = computed(() => (describedItem.value?.related.length ?? 0) > 0);

  /**
   * Shows the item in the description panel.
   *
   * @param item item inspected by the user.
   */
  const describe = (item: TieredPickerItem) => {
    inspectedItem.value = item;
  };

  return { describedItem, hasRelated, describe };
};
