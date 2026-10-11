import { markRaw } from 'vue';

import type { DeepReadonly } from '@shared/lib/object';
import type { SvgIcon } from '@shared/ui/svg-icon';

import type { MecClassId } from '../../model/classes';
import goliathIcon from '../icons/classes/class_goliath_long_war.svg?component';
import jaegerIcon from '../icons/classes/class_jaeger_long_war.svg?component';
import marauderIcon from '../icons/classes/class_marauder_long_war.svg?component';
import shogunIcon from '../icons/classes/class_shogun_long_war.svg?component';

/** MEC class icons by class id. */
export const MEC_CLASS_ICON: DeepReadonly<Record<MecClassId, SvgIcon>> = {
  jaeger: markRaw(jaegerIcon),
  marauder: markRaw(marauderIcon),
  goliath: markRaw(goliathIcon),
  shogun: markRaw(shogunIcon),
};
