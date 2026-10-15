import type { DeepReadonly } from '@shared/lib/object';

import type { TieredPickerAppearance } from '../model/tiered-picker';

/**
 * One-based grid columns of the items of a shorter tier, by grid column count and then by item count, keeping them
 * centered; a tier filling the grid, or a case not listed, takes the columns in order.
 */
export const CENTERED_COLUMNS: DeepReadonly<Record<number, Record<number, number[]>>> = { 3: { 1: [2], 2: [1, 3] } };

/**
 * All variants are rendered at once so switching the state never waits for a network request.
 */
export const ICON_VARIANTS: DeepReadonly<TieredPickerAppearance[]> = ['selected', 'available', 'disabled'];
