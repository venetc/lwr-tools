import type { DeepReadonly } from '@shared/lib/object';

import type { EquipmentAbilityId } from '../../model/equipment-abilities';
import ghostIcon from '../icons/abilities/ability_ghost/ability_ghost@4x.png';
import tacticalMobilityIcon from '../icons/abilities/assault_tacticalsense/assault_tacticalsense@4x.png';
import grappleIcon from '../icons/abilities/grapple_eu2012/grapple_eu2012@4x.png';
import damageControlIcon from '../icons/abilities/mec_damage_control/mec_damage_control@4x.png';
import repulsorIcon from '../icons/abilities/mec_shock_absorbent_armor/mec_shock_absorbent_armor@4x.png';

/** Upscaled equipment ability icons by ability id; null for abilities the game shows without an icon. */
export const EQUIPMENT_ABILITY_ICON: DeepReadonly<Record<EquipmentAbilityId, string | null>> = {
  'grapple': grappleIcon,
  'advanced-grapple': grappleIcon,
  'damage-control': damageControlIcon,
  'repulsor': repulsorIcon,
  'sealed': null,
  'flame-resistant': null,
  'tactical-mobility': tacticalMobilityIcon,
  'ghost': ghostIcon,
  'psi-boost': null,
  'advanced-psi-boost': null,
};
