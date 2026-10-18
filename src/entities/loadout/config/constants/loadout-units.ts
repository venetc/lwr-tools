import type { DeepReadonly } from '@shared/lib/object';
import { typedEntries } from '@shared/lib/object';

import type { LoadoutUnit } from '../../model/loadout-units';
import { loadoutUnitFromEntry } from '../../model/loadout-units';
import { LOADOUT_UNIT_CONTENT } from './loadout-unit-content';

/** All unit types in `units.json` order, which is by code. */
export const LOADOUT_UNITS: DeepReadonly<LoadoutUnit[]> = typedEntries(LOADOUT_UNIT_CONTENT).map(loadoutUnitFromEntry);
