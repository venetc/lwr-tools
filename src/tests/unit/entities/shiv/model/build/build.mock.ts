import type { ShivBuildData } from '@entities/shiv/model/build';

export const EMPTY_PERKS = [null, null, null];

export const FILLED_PERKS = ['left', 'middle', 'right'];

/**
 * Fresh SHIV build with its own perks array.
 *
 * @param perks selected perk ids by technology level, null for an empty level.
 */
export const createBuildMock = (perks: (string | null)[]): ShivBuildData => ({
  perks: [...perks],
  name: 'SHIV',
});
