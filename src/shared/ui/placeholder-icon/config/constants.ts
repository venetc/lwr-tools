import cyanIcon from './icons/placeholder@4x.png';
import goldIcon from './icons/placeholder@4x_gold.png';
import greenDimIcon from './icons/placeholder@4x_green-dim.png';
import greenIcon from './icons/placeholder@4x_green.png';
import lilacDimIcon from './icons/placeholder@4x_lilac-dim.png';
import lilacIcon from './icons/placeholder@4x_lilac.png';
import tealDimIcon from './icons/placeholder@4x_teal-dim.png';

/**
 * Upscaled placeholder icon (the question mark the game shows for an ability without an icon) in each tint of the
 * ability icons, for an item whose original icon does not exist.
 */
export const PLACEHOLDER_ICON = {
  /** Original cyan question mark on black. */
  cyan: cyanIcon,
  /** Gold duotone on black. */
  gold: goldIcon,
  /** Dim teal duotone. */
  tealDim: tealDimIcon,
  /** Bright green duotone on black. */
  green: greenIcon,
  /** Dim green duotone. */
  greenDim: greenDimIcon,
  /** Lilac duotone on black. */
  lilac: lilacIcon,
  /** Dim flat lilac duotone. */
  lilacDim: lilacDimIcon,
} as const;
