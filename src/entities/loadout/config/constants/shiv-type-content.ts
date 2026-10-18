import type { DeepReadonly } from '@shared/lib/object';

import type { ShivTypeContent } from '../../model/shiv-types';
import shivTypesJson from '../data/shiv-types.json';

/** SHIV type records by SHIV type id, from the game data. */
export const SHIV_TYPE_CONTENT: DeepReadonly<typeof shivTypesJson> = shivTypesJson satisfies Record<string, ShivTypeContent>;
