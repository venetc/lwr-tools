import type { MaybeRefOrGetter } from 'vue';
import { toValue } from 'vue';

import type { TieredPickerAppearance } from './tiered-picker';

export interface CellVariantsOptions {
  /** Look of the cell. */
  appearance: MaybeRefOrGetter<TieredPickerAppearance>
  /** Item name. */
  name: MaybeRefOrGetter<string>
  /** CSS module of the cell. */
  style: Record<string, string>
}

/**
 * Icon variants of the cell: only the variant of the cell look is visible and named, hidden ones are decorative.
 *
 * @param options cell look, item name and styles of the cell.
 */
export const useCellVariants = (options: CellVariantsOptions) => {
  const { style } = options;

  /**
   * Checks whether the variant matches the cell look.
   *
   * @param variant icon variant.
   */
  const isActive = (variant: TieredPickerAppearance) => variant === toValue(options.appearance);

  /**
   * Class list for the variant image: only the active one is visible.
   *
   * @param variant icon variant.
   */
  const getImageClass = (variant: TieredPickerAppearance) => [style.image, isActive(variant) ? style.shown : style.concealed];

  /**
   * Alt text only for the visible variant, hidden ones are decorative.
   *
   * @param variant icon variant.
   */
  const getImageAlt = (variant: TieredPickerAppearance) => isActive(variant) ? toValue(options.name) : '';

  return { getImageClass, getImageAlt };
};
