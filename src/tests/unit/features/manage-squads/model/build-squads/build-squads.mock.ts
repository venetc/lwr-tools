import type { DecodedLoadout } from '@entities/loadout';
import type { Squad, SquadUnit } from '@features/manage-squads';

const LOADOUT: DecodedLoadout = { armor: 'tactical-vest', primary: 'assault-rifle', secondary: null, utility: [null, null], modules: [] };

export const BUILD = { kind: 'biosoldier', id: 'build-1' } as const;

/**
 * Unit of a build with the default Loadout.
 *
 * @param id Unit id.
 * @param kind kind of the build.
 * @param buildId build id.
 */
const unit = (id: string, kind: SquadUnit['build']['kind'], buildId: string): SquadUnit => ({ id, build: { kind, id: buildId }, loadout: LOADOUT });

export const SQUADS: Squad[] = [
  { id: 'alpha', name: 'Alpha', units: [unit('unit-1', 'biosoldier', 'build-1'), unit('unit-2', 'mec', 'build-2'), unit('unit-3', 'biosoldier', 'build-1')] },
  { id: 'charlie', name: 'Charlie', units: [unit('unit-4', 'mec', 'build-1')] },
  { id: 'bravo', name: 'Bravo', units: [unit('unit-5', 'biosoldier', 'build-1')] },
];

export const BUILD_SQUADS = [
  { id: 'alpha', name: 'Alpha', unitCount: 2 },
  { id: 'bravo', name: 'Bravo', unitCount: 1 },
];

export const BUILD_SQUADS_NOTE = 'It is in Squads: Alpha (2 Units), Bravo (1 Unit). These 3 Units and their Loadouts will be removed.';

export const ONE_UNIT_SQUADS = [{ id: 'bravo', name: 'Bravo', unitCount: 1 }];

export const ONE_UNIT_NOTE = 'It is in Squads: Bravo (1 Unit). This Unit and its Loadout will be removed.';
