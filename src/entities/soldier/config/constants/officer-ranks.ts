import type { DeepReadonly } from '@shared/lib/object';
import { typedEntries } from '@shared/lib/object';

import type { AbilityId } from '../../model/abilities';
import type { OfficerRank, SelectedOfficerPerks } from '../../model/officer-ranks';
import { createOfficerRank } from '../../model/officer-ranks';
import { OFFICER_RANK_CONTENT } from './officer-rank-content';

/** Officer ranks from Lieutenant to Field Commander with their officer perks; unknown ability ids are skipped. */
export const OFFICER_RANKS: DeepReadonly<OfficerRank[]> = typedEntries(OFFICER_RANK_CONTENT).map(([id, content]) => createOfficerRank(id, content));

/** Officer perks of a build without any: null for every officer rank. A build takes a copy. */
export const EMPTY_OFFICER_PERKS: DeepReadonly<SelectedOfficerPerks> = OFFICER_RANKS.map(() => null);

/** Officer perks offered on each officer rank, in officer rank order: the variants of the steps of Officer. */
export const OFFICER_PERKS_BY_OFFICER_RANK: DeepReadonly<AbilityId[][]> = OFFICER_RANKS.map(officerRank => officerRank.perks);
