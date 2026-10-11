import type { DeepReadonly } from '@shared/lib/object';

import type { SoldierClass } from '../../model/classes';
import { BIOSOLDIER_CLASSES } from './biosoldier-classes';

/** Soldier classes of every kind by their share code number. */
export const SOLDIER_CLASS_BY_CODE: ReadonlyMap<number, DeepReadonly<SoldierClass>> = new Map(BIOSOLDIER_CLASSES.map(soldierClass => [soldierClass.code, soldierClass]));
