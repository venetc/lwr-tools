import { expect } from 'vitest';

import type { DecodedLoadout } from '@entities/loadout';
import type { SquadUnit } from '@features/manage-squads';

const LOADOUT: DecodedLoadout = { armor: 'tactical-vest', primary: 'assault-rifle', secondary: null, utility: [null, null], modules: [] };

export const BUILD = { kind: 'biosoldier', id: 'build-1' } as const;

export const CHECKED_UNITS: SquadUnit[] = [
  { id: 'unit-2', build: { kind: 'mec', id: 'build-2' }, loadout: { armor: 'mec1-paladin', primary: 'minigun', secondary: null, utility: [null], modules: [null] } },
  { id: 'unit-3', build: { kind: 'biosoldier', id: 'build-1' }, loadout: LOADOUT },
];

export const UNIT_LOADOUT = LOADOUT;

/** Key prefix of a stored Squad, followed by the Squad id. */
export const SQUAD_KEY_PREFIX = 'lwr-tools.squads.v1.squad.';

/** Storage where the open Squad is one that is no longer stored. */
export const GONE_OPEN_SQUAD_STORAGE = {
  'lwr-tools.squads.v1.order': '["squad-1","squad-2"]',
  'lwr-tools.squads.v1.squad.squad-1': '{"name":"Alpha","units":[]}',
  'lwr-tools.squads.v1.squad.squad-2': '{"name":"Bravo","units":[]}',
  'lwr-tools.squads.v1.open': 'squad-gone',
};

export const EMPTY_SQUAD_1 = { id: expect.any(String), name: 'Squad 1', units: [] };

export const OTHER_KIND_BUILD = { kind: 'mec', id: 'build-1' } as const;
