import { markRaw } from 'vue';

import rankCaptainIcon from '@shared/assets/images/ranks/rank_captain.svg?component';
import rankColonelIcon from '@shared/assets/images/ranks/rank_colonel.svg?component';
import rankCorporalIcon from '@shared/assets/images/ranks/rank_corporal.svg?component';
import rankLieutenantIcon from '@shared/assets/images/ranks/rank_lieutenant.svg?component';
import rankMajorIcon from '@shared/assets/images/ranks/rank_major.svg?component';
import rankSergeantIcon from '@shared/assets/images/ranks/rank_sergeant.svg?component';
import rankSquaddieIcon from '@shared/assets/images/ranks/rank_squaddie.svg?component';
import type { SvgIcon } from '@shared/types';

import type { SoldierRankId } from '../../model/types';

export const SOLDIER_RANK_ICON: Record<SoldierRankId, SvgIcon> = {
  'specialist': markRaw(rankSquaddieIcon),
  'lance-corporal': markRaw(rankCorporalIcon),
  'corporal': markRaw(rankSergeantIcon),
  'sergeant': markRaw(rankLieutenantIcon),
  'tech-sergeant': markRaw(rankCaptainIcon),
  'gunnery-sergeant': markRaw(rankMajorIcon),
  'master-sergeant': markRaw(rankColonelIcon),
};
