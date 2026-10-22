import type { DeepReadonly } from '@shared/lib/object';

import type { OfficerRankContent } from '../../model/officer-ranks';
import officerRanksJson from '../data/officer-ranks.json';

/** Officer rank records by officer rank id, from Lieutenant to Field Commander. */
export const OFFICER_RANK_CONTENT: DeepReadonly<typeof officerRanksJson> = officerRanksJson satisfies Record<string, OfficerRankContent>;
