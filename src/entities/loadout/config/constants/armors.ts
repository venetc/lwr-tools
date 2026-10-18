import type { DeepReadonly } from '@shared/lib/object';
import { typedEntries } from '@shared/lib/object';

import type { Armor } from '../../model/armors';
import { armorsFromEntry } from '../../model/armors';
import type { LoadoutItemId } from '../../model/loadout';
import { ARMOR_CONTENT } from './armor-content';

/** All armors in game data order; records with an unknown unit, category or requirement are skipped. */
export const ARMORS: DeepReadonly<Armor[]> = typedEntries(ARMOR_CONTENT).flatMap(armorsFromEntry);

/** Armors by armor id; any other Loadout item id finds none. */
export const ARMOR_BY_ID: ReadonlyMap<LoadoutItemId, DeepReadonly<Armor>> = new Map(ARMORS.map(armor => [armor.id, armor]));
