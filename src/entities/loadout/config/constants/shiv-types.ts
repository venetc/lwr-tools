import type { DeepReadonly } from '@shared/lib/object';
import { typedEntries } from '@shared/lib/object';

import type { ShivType } from '../../model/shiv-types';
import { shivTypeFromEntry } from '../../model/shiv-types';
import { SHIV_TYPE_CONTENT } from './shiv-type-content';

/** All SHIV types in game data order. */
export const SHIV_TYPES: DeepReadonly<ShivType[]> = typedEntries(SHIV_TYPE_CONTENT).map(shivTypeFromEntry);
