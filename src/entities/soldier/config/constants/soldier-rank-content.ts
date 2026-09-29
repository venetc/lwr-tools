import type { SoldierRankContent } from '../../model/ranks';
import ranksJson from '../data/ranks.json';

/** Soldier rank records by rank id, in rank order, from the game data. */
export const SOLDIER_RANK_CONTENT = ranksJson satisfies Record<string, SoldierRankContent>;
