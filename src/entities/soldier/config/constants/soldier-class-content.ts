import type { DeepReadonly } from '@shared/lib/object';

import type { SoldierClassContent } from '../../model/classes';
import classesJson from '../data/classes.json';

/** Soldier class records by class id, from the game data. */
export const SOLDIER_CLASS_CONTENT: DeepReadonly<typeof classesJson> = classesJson satisfies Record<string, SoldierClassContent>;
