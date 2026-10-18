import type { TieredPickerTier } from './tiered-picker';

/**
 * Look of the tiers: the tier class for its state.
 *
 * @param style CSS module of the tiers.
 */
export const useTierAppearance = (style: Record<string, string>) => {
  /**
   * Tier classes based on its state.
   *
   * @param tier tier with its state.
   */
  const getTierClass = (tier: TieredPickerTier) => [style.tier, style[tier.state]];

  return { getTierClass };
};
