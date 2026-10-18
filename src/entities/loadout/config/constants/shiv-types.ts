import type { DeepReadonly } from '@shared/lib/object';
import { typedEntries } from '@shared/lib/object';

import type { LoadoutItemId } from '../../model/loadout';
import type { ShivType, ShivTypeId } from '../../model/shiv-types';
import { shivTypeFromEntry } from '../../model/shiv-types';
import { SHIV_TYPE_CONTENT } from './shiv-type-content';

/** All SHIV types in game data order. */
export const SHIV_TYPES: DeepReadonly<ShivType[]> = typedEntries(SHIV_TYPE_CONTENT).map(shivTypeFromEntry);

/** SHIV types by SHIV type id; any other Loadout item id finds none. */
export const SHIV_TYPE_BY_ID: ReadonlyMap<LoadoutItemId, DeepReadonly<ShivType>> = new Map(SHIV_TYPES.map(shivType => [shivType.id, shivType]));

/** SHIV type ids by their stable code. */
export const SHIV_TYPE_ID_BY_CODE: ReadonlyMap<number, ShivTypeId> = new Map(SHIV_TYPES.map(shivType => [shivType.code, shivType.id]));
