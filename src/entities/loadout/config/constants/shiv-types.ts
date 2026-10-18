import type { DeepReadonly } from '@shared/lib/object';
import { typedEntries } from '@shared/lib/object';

import type { ShivType, ShivTypeId } from '../../model/shiv-types';
import { shivTypeFromEntry } from '../../model/shiv-types';
import { SHIV_TYPE_CONTENT } from './shiv-type-content';

/** All SHIV types in game data order. */
export const SHIV_TYPES: DeepReadonly<ShivType[]> = typedEntries(SHIV_TYPE_CONTENT).map(shivTypeFromEntry);

/** SHIV types by SHIV type id. */
export const SHIV_TYPE_BY_ID: ReadonlyMap<ShivTypeId, DeepReadonly<ShivType>> = new Map(SHIV_TYPES.map(shivType => [shivType.id, shivType]));
