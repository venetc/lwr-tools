import type { DeepReadonly } from '@shared/lib/object';

import type { ArmorId } from '../../model/armors';
import aegisIcon from '../icons/armors/aegis_armor_long_war.png';
import archangelIcon from '../icons/armors/archangel_armor_long_war.png';
import auroraIcon from '../icons/armors/aurora_armor_long_war.png';
import bansheeIcon from '../icons/armors/banshee_armor_long_war.png';
import carapaceIcon from '../icons/armors/carapace_armor_long_war.png';
import corsairIcon from '../icons/armors/corsair_armor_long_war.png';
import kestrelIcon from '../icons/armors/kestrel_armor_long_war.png';
import phalanxIcon from '../icons/armors/phalanx_armor_long_war.png';
import seraphIcon from '../icons/armors/seraphim_armor_long_war.png';
import ghostIcon from '../icons/armors/shadow_armor_long_war.png';
import tacticalArmorIcon from '../icons/armors/tac_armor_long_war.png';
import tacticalVestIcon from '../icons/armors/tac_vest_long_war.png';
import titanIcon from '../icons/armors/titan_armor_long_war.png';
import vortexIcon from '../icons/armors/vortex_armor_long_war.png';

/** Armor images from the game (256×128) by armor id. */
export const ARMOR_ICON: DeepReadonly<Record<ArmorId, string>> = {
  'tactical-vest': tacticalVestIcon,
  'tactical-armor': tacticalArmorIcon,
  'phalanx-armor': phalanxIcon,
  'carapace-armor': carapaceIcon,
  'kestrel-armor': kestrelIcon,
  'aegis-armor': aegisIcon,
  'banshee-armor': bansheeIcon,
  'corsair-armor': corsairIcon,
  'titan-armor': titanIcon,
  'seraph-armor': seraphIcon,
  'archangel-armor': archangelIcon,
  'ghost-armor': ghostIcon,
  'aurora-armor': auroraIcon,
  'vortex-armor': vortexIcon,
};
