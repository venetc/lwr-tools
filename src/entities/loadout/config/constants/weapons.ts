import type { DeepReadonly } from '@shared/lib/object';
import { typedEntries } from '@shared/lib/object';

import type { Weapon } from '../../model/weapons';
import { weaponsFromEntry } from '../../model/weapons';
import { WEAPON_CONTENT } from './weapon-content';

/** All weapons in game data order; records with an unknown unit, tier, type or slot are skipped. */
export const WEAPONS: DeepReadonly<Weapon[]> = typedEntries(WEAPON_CONTENT).flatMap(weaponsFromEntry);
