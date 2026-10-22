import type { DeepReadonly } from '@shared/lib/object';
import { typedEntries } from '@shared/lib/object';

import type { OfficerRank } from '../../model/officer-ranks';
import { createOfficerRank } from '../../model/officer-ranks';
import { OFFICER_RANK_CONTENT } from './officer-rank-content';

/** Officer ranks from Lieutenant to Field Commander with their officer perks; unknown ability ids are skipped. */
export const OFFICER_RANKS: DeepReadonly<OfficerRank[]> = typedEntries(OFFICER_RANK_CONTENT).map(([id, content]) => createOfficerRank(id, content));
