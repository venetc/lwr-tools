import type { SeededSquad, SeededUnit } from '../utils/squads';

export const PAGE_PATH = '/builds/shiv';

export const BUILD_NAME = 'SHIV';

export const ALPHA = 'Alpha';

export const CANCEL_LABEL = 'Cancel';

export const DELETE_LABEL = 'Delete';

export const NOTE = 'It is in Squads: Alpha (2 Units), Bravo (1 Unit). These 3 Units and their Loadouts will be removed.';

/**
 * Unit of the default SHIV build.
 *
 * @param id Unit id.
 */
const unit = (id: string): SeededUnit => ({
  id,
  build: { kind: 'shiv', id: 'default-shiv' },
  loadout: { armor: 2, primary: 11, secondary: null, utility: [null, null, null, null], modules: [] },
});

/** Squads with the default SHIV build: two Units in Alpha, one in Bravo. */
export const SQUADS: SeededSquad[] = [
  { id: 'alpha', name: 'Alpha', units: [unit('unit-1'), unit('unit-2')] },
  { id: 'bravo', name: 'Bravo', units: [unit('unit-3')] },
];
