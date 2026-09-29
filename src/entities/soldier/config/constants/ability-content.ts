import type { AbilityContent } from '../../model/abilities';
import abilitiesJson from '../data/abilities.json';

/** Ability records by ability id, from the game data. */
export const ABILITY_CONTENT = abilitiesJson satisfies Record<string, AbilityContent>;
