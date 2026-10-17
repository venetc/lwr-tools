import type { DeepReadonly } from '@shared/lib/object';

import type { LoadoutUnitContent } from '../../model/loadout-units';
import unitsJson from '../data/units.json';

/** Unit type records by unit id, from the game data: each armor, weapon or item is made for some of them. */
export const LOADOUT_UNIT_CONTENT: DeepReadonly<typeof unitsJson> = unitsJson satisfies Record<string, LoadoutUnitContent>;
