import { markRaw } from 'vue';

import type { DeepReadonly } from '@shared/lib/object';
import type { SvgIcon } from '@shared/ui/svg-icon';

import type { TechnologyLevelId } from '../../model/technology-levels';
import rankCorporalIcon from '../icons/levels/rank_corporal.svg?component';
import rankLieutenantIcon from '../icons/levels/rank_lieutenant.svg?component';
import rankSergeantIcon from '../icons/levels/rank_sergeant.svg?component';
import rankSquaddieIcon from '../icons/levels/rank_squaddie.svg?component';

/** Technology level icons by level id: the vanilla rank icons the wiki shows next to the SHIV tree rows. */
export const TECHNOLOGY_LEVEL_ICON: DeepReadonly<Record<TechnologyLevelId, SvgIcon>> = {
  'base-configuration': markRaw(rankSquaddieIcon),
  'advancements-1': markRaw(rankCorporalIcon),
  'advancements-2': markRaw(rankSergeantIcon),
  'advancements-3a': markRaw(rankLieutenantIcon),
  'advancements-3b': markRaw(rankLieutenantIcon),
};
