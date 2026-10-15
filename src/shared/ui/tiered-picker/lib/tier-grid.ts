import type { MaybeRefOrGetter } from 'vue';
import { computed, toValue } from 'vue';

import { CENTERED_COLUMNS } from '../config/constants';
import type { TieredPickerTier } from '../model/tiered-picker';

/**
 * Grid of the tier cells: as many columns as the widest tier has options, with shorter tiers centered.
 *
 * @param tiers picker tiers.
 */
export const useTierGrid = (tiers: MaybeRefOrGetter<readonly TieredPickerTier[]>) => {
  const columnCount = computed(() => Math.max(1, ...toValue(tiers).map(tier => tier.options.length)));

  const gridStyle = computed(() => ({ '--tier-columns': columnCount.value }));

  /**
   * Grid column of an option, keeping the options of a shorter tier centered.
   *
   * @param tier tier of the option.
   * @param optionIndex option index in the tier.
   */
  const getOptionStyle = (tier: TieredPickerTier, optionIndex: number) => {
    return { gridColumn: CENTERED_COLUMNS[columnCount.value]?.[tier.options.length]?.[optionIndex] ?? optionIndex + 1 };
  };

  return { gridStyle, getOptionStyle };
};
