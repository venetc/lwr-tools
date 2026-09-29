import { markRaw } from 'vue';

import type { SvgIcon } from '@shared/ui/svg-icon';

import type { SoldierRankId } from '../../model/ranks';
import rankCaptainIcon from '../icons/ranks/rank_captain.svg?component';
import rankColonelIcon from '../icons/ranks/rank_colonel.svg?component';
import rankCorporalIcon from '../icons/ranks/rank_corporal.svg?component';
import rankLieutenantIcon from '../icons/ranks/rank_lieutenant.svg?component';
import rankMajorIcon from '../icons/ranks/rank_major.svg?component';
import rankSergeantIcon from '../icons/ranks/rank_sergeant.svg?component';
import rankSquaddieIcon from '../icons/ranks/rank_squaddie.svg?component';

/** Soldier rank icons by rank id. */
export const SOLDIER_RANK_ICON: Record<SoldierRankId, SvgIcon> = {
  'specialist': markRaw(rankSquaddieIcon),
  'lance-corporal': markRaw(rankCorporalIcon),
  'corporal': markRaw(rankSergeantIcon),
  'sergeant': markRaw(rankLieutenantIcon),
  'tech-sergeant': markRaw(rankCaptainIcon),
  'gunnery-sergeant': markRaw(rankMajorIcon),
  'master-sergeant': markRaw(rankColonelIcon),
};
