import type { TieredPickerOption, TieredPickerTier } from './tiered-picker';

/**
 * Selection rules of the picker: what a toggle on a tier requests and which options cannot be toggled.
 *
 * @param onSelect receives the tier index and the selected item id; null clears the tier.
 */
export const useTierSelection = (onSelect: (tierIndex: number, itemId: string | null) => void) => {
  /**
   * Checks whether the option is shown selected on its tier.
   *
   * @param option tier option.
   */
  const isPressed = (option: TieredPickerOption) => option.appearance === 'selected';

  /**
   * Requests an item selection on an editable tier: the selected option clears the tier, any other one replaces
   * the selection. A disabled tier ignores the request, and so does a disabled item that would be selected, cleared
   * or replaced.
   *
   * @param tier tier whose selection is toggled.
   * @param tierIndex tier index in the picker.
   * @param option toggled option.
   */
  const toggle = (tier: TieredPickerTier, tierIndex: number, option: TieredPickerOption) => {
    if (tier.isDisabled) return;

    const itemId = isPressed(option) ? null : option.item.id;
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
  const getAriaDisabled = (tier: TieredPickerTier, option: TieredPickerOption) => tier.isDisabled || option.isDisabled;

  return { isPressed, toggle, getAriaDisabled };
};
