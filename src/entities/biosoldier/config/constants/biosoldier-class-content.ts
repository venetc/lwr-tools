import type { DeepReadonly } from '@shared/lib/object';

import type { BiosoldierClassContent } from '../../model/classes';
import classesJson from '../data/classes.json';

/** Biosoldier class records by class id, from the game data. */
export const BIOSOLDIER_CLASS_CONTENT: DeepReadonly<typeof classesJson> = classesJson satisfies Record<string, BiosoldierClassContent>;
