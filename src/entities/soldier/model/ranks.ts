import type { SoldierRank } from './types';

import rankCaptainIcon from '@shared/assets/images/ranks/rank_captain.png';
import rankColonelIcon from '@shared/assets/images/ranks/rank_colonel.png';
import rankCorporalIcon from '@shared/assets/images/ranks/rank_corporal.png';
import rankLieutenantIcon from '@shared/assets/images/ranks/rank_lieutenant.png';
import rankMajorIcon from '@shared/assets/images/ranks/rank_major.png';
import rankSergeantIcon from '@shared/assets/images/ranks/rank_sergeant.png';
import rankSquaddieIcon from '@shared/assets/images/ranks/rank_squaddie.png';

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
