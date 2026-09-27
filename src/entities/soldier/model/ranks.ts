import type { SoldierRank } from './types';

import rankCaptainIcon from '@shared/assets/images/ranks/rank_captain.svg?component';
import rankColonelIcon from '@shared/assets/images/ranks/rank_colonel.svg?component';
import rankCorporalIcon from '@shared/assets/images/ranks/rank_corporal.svg?component';
import rankLieutenantIcon from '@shared/assets/images/ranks/rank_lieutenant.svg?component';
import rankMajorIcon from '@shared/assets/images/ranks/rank_major.svg?component';
import rankSergeantIcon from '@shared/assets/images/ranks/rank_sergeant.svg?component';
import rankSquaddieIcon from '@shared/assets/images/ranks/rank_squaddie.svg?component';

import { SOLDIER_RANK_ID } from './soldier-rank-id';

export const SOLDIER_RANKS: SoldierRank[] = [
  { id: SOLDIER_RANK_ID.SPECIALIST, name: 'Specialist', icon: rankSquaddieIcon },
  { id: SOLDIER_RANK_ID.LANCE_CORPORAL, name: 'Lance Corporal', icon: rankCorporalIcon },
  { id: SOLDIER_RANK_ID.CORPORAL, name: 'Corporal', icon: rankSergeantIcon },
  { id: SOLDIER_RANK_ID.SERGEANT, name: 'Sergeant', icon: rankLieutenantIcon },
  { id: SOLDIER_RANK_ID.TECH_SERGEANT, name: 'Tech Sergeant', icon: rankCaptainIcon },
  { id: SOLDIER_RANK_ID.GUNNERY_SERGEANT, name: 'Gunnery Sergeant', icon: rankMajorIcon },
  { id: SOLDIER_RANK_ID.MASTER_SERGEANT, name: 'Master Sergeant', icon: rankColonelIcon },
];
