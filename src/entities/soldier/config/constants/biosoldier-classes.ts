import type { DeepReadonly } from '@shared/lib/object';
import { typedEntries } from '@shared/lib/object';

import type { SoldierClass } from '../../model/classes';
import { createSoldierClass } from '../../model/classes';
import { BIOSOLDIER_CLASS_CONTENT } from './biosoldier-class-content';
import { BIOSOLDIER_CLASS_ICON } from './biosoldier-class-icons';

/** All biosoldier classes with their icons and perks by rank. */
export const BIOSOLDIER_CLASSES: DeepReadonly<SoldierClass[]> = typedEntries(BIOSOLDIER_CLASS_CONTENT)
  .map(([id, content]) => createSoldierClass(id, content, BIOSOLDIER_CLASS_ICON[id]));

/** Biosoldier classes by their share code number. */
export const BIOSOLDIER_CLASS_BY_CODE: ReadonlyMap<number, DeepReadonly<SoldierClass>> = new Map(BIOSOLDIER_CLASSES.map(soldierClass => [soldierClass.code, soldierClass]));
