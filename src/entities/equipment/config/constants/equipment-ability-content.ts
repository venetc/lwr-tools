import type { DeepReadonly } from '@shared/lib/object';

import type { EquipmentAbilityContent } from '../../model/equipment-abilities';
import abilitiesJson from '../data/abilities.json';

/** Equipment ability records by ability id, from the game data. */
export const EQUIPMENT_ABILITY_CONTENT: DeepReadonly<typeof abilitiesJson> = abilitiesJson satisfies Record<string, EquipmentAbilityContent>;
