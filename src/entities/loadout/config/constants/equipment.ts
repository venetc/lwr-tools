import type { DeepReadonly } from '@shared/lib/object';
import { typedEntries } from '@shared/lib/object';

import type { Equipment } from '../../model/equipment';
import { equipmentFromEntry } from '../../model/equipment';
import { EQUIPMENT_CONTENT } from './equipment-content';

/** All equipment and Modules in game data order; records with an unknown unit, slot, requirement, group, weapon category or Module are skipped. */
export const EQUIPMENT: DeepReadonly<Equipment[]> = typedEntries(EQUIPMENT_CONTENT).flatMap(equipmentFromEntry);
