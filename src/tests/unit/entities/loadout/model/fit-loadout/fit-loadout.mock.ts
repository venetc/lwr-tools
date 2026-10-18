import type { Loadout } from '@entities/loadout/model/loadout';

/**
 * Fresh MEC loadout with its own slot arrays.
 *
 * @param loadout fields that differ from a Paladin, a Minigun, two empty utility slots and an empty Module slot.
 */
export const createMecLoadoutMock = (loadout: Partial<Loadout> = {}): Loadout => ({
  armor: 'mec1-paladin',
  primary: 'minigun',
  secondary: null,
  utility: [null, null],
  modules: [null],
  ...loadout,
});
