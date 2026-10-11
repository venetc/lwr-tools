import type { DeepReadonly } from '@shared/lib/object';

import type { ShivPerkContent } from '../../model/perks';
import perksJson from '../data/perks.json';

/** SHIV perk records by perk id, from the game data. */
export const SHIV_PERK_CONTENT: DeepReadonly<typeof perksJson> = perksJson satisfies Record<string, ShivPerkContent>;
