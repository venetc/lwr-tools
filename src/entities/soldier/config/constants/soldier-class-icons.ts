import { markRaw } from 'vue';

import assaultIcon from '@shared/assets/images/classes/class_assault.svg?component';
import engineerIcon from '@shared/assets/images/classes/class_engineer_long_war.svg?component';
import gunnerIcon from '@shared/assets/images/classes/class_heavy.svg?component';
import infantryIcon from '@shared/assets/images/classes/class_infantry_long_war.svg?component';
import rocketeerIcon from '@shared/assets/images/classes/class_rocketeer_long_war.svg?component';
import scoutIcon from '@shared/assets/images/classes/class_scout_long_war.svg?component';
import sniperIcon from '@shared/assets/images/classes/class_sniper.svg?component';
import medicIcon from '@shared/assets/images/classes/class_support.svg?component';
import type { SvgIcon } from '@shared/types';

import type { SoldierClassId } from '../../model/types';

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
