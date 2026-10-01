import type { DeepReadonly } from '@shared/lib/object';

import type { SoldierRankContent } from '../../model/ranks';
import ranksJson from '../data/ranks.json';

/** Soldier rank records by rank id, in rank order, from the game data. */
export const SOLDIER_RANK_CONTENT: DeepReadonly<typeof ranksJson> = ranksJson satisfies Record<string, SoldierRankContent>;
