import type { AbilityContent } from '../../model/types';
import abilitiesJson from '../data/abilities.json';

export const ABILITY_CONTENT = abilitiesJson satisfies Record<string, AbilityContent>;
