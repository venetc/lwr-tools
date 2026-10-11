import type { DeepReadonly } from '@shared/lib/object';
import { typedEntries } from '@shared/lib/object';

import type { SoldierClass } from '../../model/classes';
import { createSoldierClass } from '../../model/classes';
import { MEC_CLASS_CONTENT } from './mec-class-content';
import { MEC_CLASS_ICON } from './mec-class-icons';

/** All MEC classes with their icons and perks by rank. */
export const MEC_CLASSES: DeepReadonly<SoldierClass[]> = typedEntries(MEC_CLASS_CONTENT)
  .map(([id, content]) => createSoldierClass(id, content, MEC_CLASS_ICON[id]));

/** MEC classes by their share code number. */
export const MEC_CLASS_BY_CODE: ReadonlyMap<number, DeepReadonly<SoldierClass>> = new Map(MEC_CLASSES.map(soldierClass => [soldierClass.code, soldierClass]));
