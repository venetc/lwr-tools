import type { DeepReadonly } from '@shared/lib/object';

import type { SoldierClassContent } from '../../model/classes';
import biosoldierClassesJson from '../data/biosoldier-classes.json';

/** Biosoldier class records by class id, from the game data. */
export const BIOSOLDIER_CLASS_CONTENT: DeepReadonly<typeof biosoldierClassesJson> = biosoldierClassesJson satisfies Record<string, SoldierClassContent>;
