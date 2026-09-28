import { typedEntries } from '@shared/lib/object';

import { SOLDIER_RANK_CONTENT } from '../config/constants/soldier-rank-content';
import { SOLDIER_RANK_ICON } from '../config/constants/soldier-rank-icons';
import type { SoldierRank } from './types';

export const SOLDIER_RANKS: SoldierRank[] = typedEntries(SOLDIER_RANK_CONTENT)
  .map(([id, content]) => ({ id, name: content.name, icon: SOLDIER_RANK_ICON[id] }));
