import type { DeepReadonly } from '@shared/lib/object';

import type { ArmorId } from '../../model/armors';
import aegisIcon from '../icons/armors/aegis_armor_long_war.png';
import archangelIcon from '../icons/armors/archangel_armor_long_war.png';
import auroraIcon from '../icons/armors/aurora_armor_long_war.png';
import bansheeIcon from '../icons/armors/banshee_armor_long_war.png';
import carapaceIcon from '../icons/armors/carapace_armor_long_war.png';
import corsairIcon from '../icons/armors/corsair_armor_long_war.png';
import mec1PaladinIcon from '../icons/armors/inv_mec1.png';
import lmec2ValiantIcon from '../icons/armors/inv_mec2.png';
import hmec3DauntlessIcon from '../icons/armors/inv_mec3.png';
import hmec2DefenderIcon from '../icons/armors/inv_mec4_long_war.png';
import uhmec3DevastatorIcon from '../icons/armors/inv_mec5_long_war.png';
import ulmec3VanguardIcon from '../icons/armors/inv_mec6_long_war.png';
import lmec3VindicatorIcon from '../icons/armors/inv_mec7_long_war.png';
import kestrelIcon from '../icons/armors/kestrel_armor_long_war.png';
import phalanxIcon from '../icons/armors/phalanx_armor_long_war.png';
import seraphIcon from '../icons/armors/seraphim_armor_long_war.png';
import ghostIcon from '../icons/armors/shadow_armor_long_war.png';
import tacticalArmorIcon from '../icons/armors/tac_armor_long_war.png';
import tacticalVestIcon from '../icons/armors/tac_vest_long_war.png';
import titanIcon from '../icons/armors/titan_armor_long_war.png';
import vortexIcon from '../icons/armors/vortex_armor_long_war.png';

/** Armor images from the game (256×128) by armor id; MEC exoskeletons follow the Long War 1.0 wiki, one image each. */
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
  'mec1-paladin': mec1PaladinIcon,
  'hmec2-defender': hmec2DefenderIcon,
  'lmec2-valiant': lmec2ValiantIcon,
  'hmec3-dauntless': hmec3DauntlessIcon,
  'uhmec3-devastator': uhmec3DevastatorIcon,
  'ulmec3-vanguard': ulmec3VanguardIcon,
  'lmec3-vindicator': lmec3VindicatorIcon,
};
