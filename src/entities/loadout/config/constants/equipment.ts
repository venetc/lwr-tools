import type { DeepReadonly } from '@shared/lib/object';
import { typedEntries } from '@shared/lib/object';

import type { Equipment, EquipmentId } from '../../model/equipment';
import { equipmentFromEntry } from '../../model/equipment';
import type { LoadoutItemId } from '../../model/loadout';
import { EQUIPMENT_CONTENT } from './equipment-content';

/** All equipment and Modules in game data order; records with an unknown unit, slot, requirement, group, weapon category or Module are skipped. */
export const EQUIPMENT: DeepReadonly<Equipment[]> = typedEntries(EQUIPMENT_CONTENT).flatMap(equipmentFromEntry);

/** Equipment and Modules by equipment id; any other Loadout item id finds none. */
export const EQUIPMENT_BY_ID: ReadonlyMap<LoadoutItemId, DeepReadonly<Equipment>> = new Map(EQUIPMENT.map(item => [item.id, item]));

/** Equipment and Module ids by their stable code. */
export const EQUIPMENT_ID_BY_CODE: ReadonlyMap<number, EquipmentId> = new Map(EQUIPMENT.map(item => [item.code, item.id]));
