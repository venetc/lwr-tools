import { typedEntries } from '@shared/lib/object';

import type { SoldierRank } from '../../model/ranks';
import { SOLDIER_RANK_CONTENT } from './soldier-rank-content';
import { SOLDIER_RANK_ICON } from './soldier-rank-icons';

/** All soldier ranks in rank order, with their icons. */
export const SOLDIER_RANKS: SoldierRank[] = typedEntries(SOLDIER_RANK_CONTENT)
  .map(([id, content]) => ({ id, name: content.name, icon: SOLDIER_RANK_ICON[id] }));
