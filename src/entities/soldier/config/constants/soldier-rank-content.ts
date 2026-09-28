import type { SoldierRankContent } from '../../model/types';
import ranksJson from '../data/ranks.json';

export const SOLDIER_RANK_CONTENT = ranksJson satisfies Record<string, SoldierRankContent>;
