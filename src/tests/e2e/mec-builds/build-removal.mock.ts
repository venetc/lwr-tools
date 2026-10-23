import type { SeededSquad, SeededUnit } from '../utils/squads';

export const PAGE_PATH = '/builds/mec';

export const BUILD_NAME = 'Jaeger';

export const ALPHA = 'Alpha';

export const CANCEL_LABEL = 'Cancel';

export const DELETE_LABEL = 'Delete';

export const NOTE = 'It is in Squads: Alpha (2 Units), Bravo (1 Unit). These 3 Units and their Loadouts will be removed.';

/**
 * Unit of the default Jaeger build.
 *
 * @param id Unit id.
 */
const unit = (id: string): SeededUnit => ({
  id,
  build: { kind: 'mec', id: 'default-jaeger' },
  loadout: { armor: 16, primary: 10, secondary: null, utility: [null, null], modules: [null, null] },
});

/** Squads with the default Jaeger build: two Units in Alpha, one in Bravo. */
export const SQUADS: SeededSquad[] = [
  { id: 'alpha', name: 'Alpha', units: [unit('unit-1'), unit('unit-2')] },
  { id: 'bravo', name: 'Bravo', units: [unit('unit-3')] },
];
