import type { DeepReadonly } from '@shared/lib/object';

import type { AbilityContent } from '../../model/abilities';
import abilitiesJson from '../data/abilities.json';

/** Ability records by ability id, from the game data. */
export const ABILITY_CONTENT: DeepReadonly<typeof abilitiesJson> = abilitiesJson satisfies Record<string, AbilityContent>;
