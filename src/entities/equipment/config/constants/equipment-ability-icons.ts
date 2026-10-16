import type { DeepReadonly } from '@shared/lib/object';
import { PLACEHOLDER_ICON } from '@shared/ui/placeholder-icon';

import type { EquipmentAbilityId } from '../../model/equipment-abilities';
import ghostIcon from '../icons/abilities/ability_ghost/ability_ghost@4x.png';
import stunIcon from '../icons/abilities/ability_stun/ability_stun@4x.png';
import bulletstormIcon from '../icons/abilities/alien_clusterbomb/alien_clusterbomb@4x.png';
import overloadIcon from '../icons/abilities/alien_overload/alien_overload@4x.png';
import burstIcon from '../icons/abilities/assault_flush/assault_flush@4x.png';
import maimIcon from '../icons/abilities/assault_rapidfire/assault_rapidfire@4x.png';
import tacticalMobilityIcon from '../icons/abilities/assault_tacticalsense/assault_tacticalsense@4x.png';
import grappleIcon from '../icons/abilities/grapple_eu2012/grapple_eu2012@4x.png';
import dangerZoneIcon from '../icons/abilities/heavy_dangerzone/heavy_dangerzone@4x.png';
import shredderIcon from '../icons/abilities/heavy_shredder/heavy_shredder@4x.png';
import aerialTrackingIcon from '../icons/abilities/itz_icon/itz_icon@4x.png';
import sublimatorIcon from '../icons/abilities/mec_collateral_damage/mec_collateral_damage@4x.png';
import damageControlIcon from '../icons/abilities/mec_damage_control/mec_damage_control@4x.png';
import repulsorIcon from '../icons/abilities/mec_shock_absorbent_armor/mec_shock_absorbent_armor@4x.png';

/** Upscaled equipment ability icons by ability id; the placeholder icon for an ability without an original icon. */
export const EQUIPMENT_ABILITY_ICON: DeepReadonly<Record<EquipmentAbilityId, string>> = {
  'grapple': grappleIcon,
  'advanced-grapple': grappleIcon,
  'damage-control': damageControlIcon,
  'repulsor': repulsorIcon,
  'sealed': PLACEHOLDER_ICON.cyan,
  'flame-resistant': PLACEHOLDER_ICON.cyan,
  'tactical-mobility': tacticalMobilityIcon,
  'ghost': ghostIcon,
  'psi-boost': PLACEHOLDER_ICON.cyan,
  'advanced-psi-boost': PLACEHOLDER_ICON.cyan,
  'steady-weapon': PLACEHOLDER_ICON.cyan,
  'aerial-precision': PLACEHOLDER_ICON.cyan,
  'burst': burstIcon,
  'volume-fire': PLACEHOLDER_ICON.cyan,
  'hip-fire': PLACEHOLDER_ICON.cyan,
  'bulletstorm': bulletstormIcon,
  'shredder': shredderIcon,
  'danger-zone': dangerZoneIcon,
  'maim': maimIcon,
  'light-volume-fire': PLACEHOLDER_ICON.cyan,
  'overload': overloadIcon,
  'stun': stunIcon,
  'ether-shredder': shredderIcon,
  'sublimator': sublimatorIcon,
  'panzer-shredder': shredderIcon,
  'aerial-shredder': shredderIcon,
  'aerial-tracking': aerialTrackingIcon,
  'carapace-shredder': shredderIcon,
  'prototype-rigging': PLACEHOLDER_ICON.cyan,
  'gear-mounts': PLACEHOLDER_ICON.cyan,
  'gear-mount': PLACEHOLDER_ICON.cyan,
  'psi-mount': PLACEHOLDER_ICON.cyan,
};
