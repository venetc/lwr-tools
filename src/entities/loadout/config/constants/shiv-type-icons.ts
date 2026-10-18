import type { DeepReadonly } from '@shared/lib/object';

import type { ShivTypeId } from '../../model/shiv-types';
import shivIcon from '../icons/shiv-types/inv_shiv1.png';
import alloyShivIcon from '../icons/shiv-types/inv_shiv2.png';
import hoverShivIcon from '../icons/shiv-types/inv_shiv3.png';

/** SHIV type images from the game (256×128) by SHIV type id. */
export const SHIV_TYPE_ICON: DeepReadonly<Record<ShivTypeId, string>> = {
  'shiv': shivIcon,
  'alloy-shiv': alloyShivIcon,
  'hover-shiv': hoverShivIcon,
};
