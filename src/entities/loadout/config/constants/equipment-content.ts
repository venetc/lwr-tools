import type { DeepReadonly } from '@shared/lib/object';

import type { EquipmentContent } from '../../model/equipment';
import equipmentJson from '../data/equipment.json';

/** Equipment and Module records by equipment id, from the game data. */
export const EQUIPMENT_CONTENT: DeepReadonly<typeof equipmentJson> = equipmentJson satisfies Record<string, EquipmentContent>;
