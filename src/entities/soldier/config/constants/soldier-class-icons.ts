import { markRaw } from 'vue';

import type { SvgIcon } from '@shared/ui/svg-icon';

import type { SoldierClassId } from '../../model/classes';
import assaultIcon from '../icons/classes/class_assault.svg?component';
import engineerIcon from '../icons/classes/class_engineer_long_war.svg?component';
import gunnerIcon from '../icons/classes/class_heavy.svg?component';
import infantryIcon from '../icons/classes/class_infantry_long_war.svg?component';
import rocketeerIcon from '../icons/classes/class_rocketeer_long_war.svg?component';
import scoutIcon from '../icons/classes/class_scout_long_war.svg?component';
import sniperIcon from '../icons/classes/class_sniper.svg?component';
import medicIcon from '../icons/classes/class_support.svg?component';

/** Soldier class icons by class id. */
export const SOLDIER_CLASS_ICON: Record<SoldierClassId, SvgIcon> = {
  sniper: markRaw(sniperIcon),
  scout: markRaw(scoutIcon),
  infantry: markRaw(infantryIcon),
  assault: markRaw(assaultIcon),
  gunner: markRaw(gunnerIcon),
  rocketeer: markRaw(rocketeerIcon),
  medic: markRaw(medicIcon),
  engineer: markRaw(engineerIcon),
};
