import type { DecodedLoadout } from '@entities/loadout';
import type { SquadUnit } from '@features/manage-squads';

const LOADOUT: DecodedLoadout = { armor: 'tactical-vest', primary: 'assault-rifle', secondary: null, utility: [null, null], modules: [] };

export const BUILD = { kind: 'biosoldier', id: 'build-1' } as const;

export const CHECKED_UNITS: SquadUnit[] = [
  { id: 'unit-2', build: { kind: 'mec', id: 'build-2' }, loadout: { armor: 'mec1-paladin', primary: 'minigun', secondary: null, utility: [null], modules: [null] } },
  { id: 'unit-3', build: { kind: 'biosoldier', id: 'build-1' }, loadout: LOADOUT },
];

export const UNIT_LOADOUT = LOADOUT;

/**
 * Page object the stored list listens to for saving and syncing tabs: it takes listeners and never fires.
 */
export const createPageTargetMock = () => new EventTarget();
