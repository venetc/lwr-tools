import type { DeepReadonly } from '@shared/lib/object';
import { typedEntries } from '@shared/lib/object';

import type { Armor } from '../../model/armors';
import { armorsFromEntry } from '../../model/armors';
import { ARMOR_CONTENT } from './armor-content';

/** All armors in game data order; records with an unknown unit or category are skipped. */
export const ARMORS: DeepReadonly<Armor[]> = typedEntries(ARMOR_CONTENT).flatMap(armorsFromEntry);
