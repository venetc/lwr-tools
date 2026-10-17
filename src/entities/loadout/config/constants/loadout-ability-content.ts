import type { DeepReadonly } from '@shared/lib/object';

import type { LoadoutAbilityContent } from '../../model/loadout-abilities';
import abilitiesJson from '../data/abilities.json';

/** Non-perk ability records by ability id, from the game data. */
export const LOADOUT_ABILITY_CONTENT: DeepReadonly<typeof abilitiesJson> = abilitiesJson satisfies Record<string, LoadoutAbilityContent>;
