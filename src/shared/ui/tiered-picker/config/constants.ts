import type { TieredPickerAppearance, TieredPickerIconVariant } from '../model/tiered-picker';

/** One-based grid columns of the tier items by item count, keeping them centered. */
export const COLUMNS: Record<number, number[]> = { 1: [2], 2: [1, 3], 3: [1, 2, 3] };

/** Icon variant shown for each item cell look. */
export const ICON_VARIANT: Record<TieredPickerAppearance, TieredPickerIconVariant> = {
  selected: 'original',
  available: 'available',
  disabled: 'disabled',
};

/**
 * All variants are rendered at once so switching the state never waits for a network request.
 */
export const ICON_VARIANTS: TieredPickerIconVariant[] = ['original', 'available', 'disabled'];
