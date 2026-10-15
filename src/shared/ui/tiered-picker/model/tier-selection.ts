import type { AcceptableValue } from 'reka-ui';

import type { TieredPickerOption, TieredPickerTier } from './tiered-picker';

/**
 * Selection rules of the picker: what a toggle on a tier requests and which options cannot be toggled.
 *
 * @param onSelect receives the tier index and the selected item id; null clears the tier.
 */
export const useTierSelection = (onSelect: (tierIndex: number, itemId: string | null) => void) => {
  /**
   * Requests an item selection on an editable tier; a disabled tier ignores the request, and so does a disabled item
   * that would be selected, cleared or replaced.
   *
   * @param tier tier whose selection is toggled.
   * @param tierIndex tier index in the picker.
   * @param toggledValue selected item id; null or empty means the selection was cleared.
   */
  const toggle = (tier: TieredPickerTier, tierIndex: number, toggledValue: AcceptableValue | null) => {
    if (tier.isDisabled) return;

    const itemId = typeof toggledValue === 'string' ? toggledValue : null;
    const isAffectedItemDisabled = tier.options.some(({ item, isDisabled }) => (
      isDisabled && (item.id === itemId || item.id === tier.selectedId)
    ));

    if (isAffectedItemDisabled) return;

    onSelect(tierIndex, itemId);
  };

  /**
   * aria-disabled for an option of a disabled tier or a disabled option.
   *
   * @param tier tier of the option.
   * @param option tier option.
   */
  const getAriaDisabled = (tier: TieredPickerTier, option: TieredPickerOption) => {
    return tier.isDisabled || option.isDisabled ? 'true' : null;
  };

  return { toggle, getAriaDisabled };
};
