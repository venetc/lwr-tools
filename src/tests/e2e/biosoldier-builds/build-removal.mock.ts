import type { SeededSquad, SeededUnit } from '../utils/squads';

export const PAGE_PATH = '/builds/biosoldier';

export const BUILD_NAME = 'Sniper';

export const ALPHA = 'Alpha';

export const CANCEL_LABEL = 'Cancel';

export const DELETE_LABEL = 'Delete';

export const NOTE = 'It is in Squads: Alpha (2 Units), Bravo (1 Unit). These 3 Units and their Loadouts will be removed.';

/**
 * Unit of the default Sniper build.
 *
 * @param id Unit id.
 */
const unit = (id: string): SeededUnit => ({
  id,
  build: { kind: 'biosoldier', id: 'default-sniper' },
  loadout: { armor: 1, primary: 1, secondary: null, utility: [null, null, null], modules: [] },
});

/** Squads with the default Sniper build: two Units in Alpha, one in Bravo. */
export const SQUADS: SeededSquad[] = [
  { id: 'alpha', name: 'Alpha', units: [unit('unit-1'), unit('unit-2')] },
  { id: 'bravo', name: 'Bravo', units: [unit('unit-3')] },
];
