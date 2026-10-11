import type { DeepReadonly } from '@shared/lib/object';

import type { SoldierClassContent } from '../../model/classes';
import mecClassesJson from '../data/mec-classes.json';

/** MEC class records by class id, from the game data. */
export const MEC_CLASS_CONTENT: DeepReadonly<typeof mecClassesJson> = mecClassesJson satisfies Record<string, SoldierClassContent>;
