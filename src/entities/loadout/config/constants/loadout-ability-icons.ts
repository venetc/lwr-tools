import type { DeepReadonly } from '@shared/lib/object';
import { PLACEHOLDER_ICON } from '@shared/ui/placeholder-icon';

import type { LoadoutAbilityId } from '../../model/loadout-abilities';
import ghostIcon from '../icons/abilities/ability_ghost/ability_ghost@4x.png';
import hardenedIcon from '../icons/abilities/ability_hardened/ability_hardened@4x.png';
import stunIcon from '../icons/abilities/ability_stun/ability_stun@4x.png';
import alienClusterbombIcon from '../icons/abilities/alien_clusterbomb/alien_clusterbomb@4x.png';
import overloadIcon from '../icons/abilities/alien_overload/alien_overload@4x.png';
import burstIcon from '../icons/abilities/assault_flush/assault_flush@4x.png';
import shadowstepIcon from '../icons/abilities/assault_lightningreflexes/assault_lightningreflexes@4x.png';
import maimIcon from '../icons/abilities/assault_rapidfire/assault_rapidfire@4x.png';
import trackerIcon from '../icons/abilities/bioelectric_skin_gene_mod_eu2012/bioelectric_skin_gene_mod_eu2012@4x.png';
import incinerationIcon from '../icons/abilities/burn/burn@4x.png';
import grappleIcon from '../icons/abilities/grapple_eu2012/grapple_eu2012@4x.png';
import dangerZoneIcon from '../icons/abilities/heavy_dangerzone/heavy_dangerzone@4x.png';
import penetratorIcon from '../icons/abilities/heavy_heat_ammo/heavy_heat_ammo@4x.png';
import shredderIcon from '../icons/abilities/heavy_shredder/heavy_shredder@4x.png';
import aerialTrackingIcon from '../icons/abilities/itz_icon/itz_icon@4x.png';
import bulletstormIcon from '../icons/abilities/lwr_bulletstorm/lwr_bulletstorm@4x.png';
import repulsorIcon from '../icons/abilities/lwr_repulsor/lwr_repulsor@4x.png';
import awarenessIcon from '../icons/abilities/mec_automated_threat_assessment/mec_automated_threat_assessment@4x.png';
import bodyShieldIcon from '../icons/abilities/mec_body_shield/mec_body_shield@4x.png';
import sublimatorIcon from '../icons/abilities/mec_collateral_damage/mec_collateral_damage@4x.png';
import damageControlIcon from '../icons/abilities/mec_damage_control/mec_damage_control@4x.png';
import platformStabilityIcon from '../icons/abilities/mec_platform_stability/mec_platform_stability@4x.png';
import ablationIcon from '../icons/abilities/mec_shock_absorbent_armor/mec_shock_absorbent_armor@4x.png';
import breachIcon from '../icons/abilities/sniper_dgg/sniper_dgg@4x.png';
import squadsightIcon from '../icons/abilities/sniper_squadsight/sniper_squadsight@4x.png';
import sprinterIcon from '../icons/abilities/support_sprinter/support_sprinter@4x.png';

/** Upscaled non-perk ability icons by ability id; the placeholder icon for an ability without an original icon. */
export const LOADOUT_ABILITY_ICON: DeepReadonly<Record<LoadoutAbilityId, string>> = {
  'grapple': grappleIcon,
  'advanced-grapple': grappleIcon,
  'damage-control': damageControlIcon,
  'repulsor': repulsorIcon,
  'ablation': ablationIcon,
  'sealed': PLACEHOLDER_ICON.cyan,
  'flame-resistant': PLACEHOLDER_ICON.cyan,
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
  'gear-slot': PLACEHOLDER_ICON.cyan,
  'psi-slot': PLACEHOLDER_ICON.cyan,
  'hardened': hardenedIcon,
  'body-shield': bodyShieldIcon,
  'concussive-blast': PLACEHOLDER_ICON.cyan,
  'explosive-shredder': PLACEHOLDER_ICON.cyan,
  'disorient': PLACEHOLDER_ICON.cyan,
  'in-smoke': PLACEHOLDER_ICON.cyan,
  'corroded': PLACEHOLDER_ICON.cyan,
  'shadow': PLACEHOLDER_ICON.cyan,
  'heal': PLACEHOLDER_ICON.cyan,
  'stabilize': PLACEHOLDER_ICON.cyan,
  'stimmed': PLACEHOLDER_ICON.cyan,
  'dense-carapace': PLACEHOLDER_ICON.cyan,
  'corrosion-resistance': PLACEHOLDER_ICON.cyan,
  'squadsight': squadsightIcon,
  'shadowstep': shadowstepIcon,
  'platform-stability': platformStabilityIcon,
  'breach': breachIcon,
  'shred-resistance': PLACEHOLDER_ICON.cyan,
  'tracker': trackerIcon,
  'unphased-mobility': PLACEHOLDER_ICON.cyan,
  'psiscopic-vision': PLACEHOLDER_ICON.cyan,
  'conduit': PLACEHOLDER_ICON.cyan,
  'holo-sync': PLACEHOLDER_ICON.cyan,
  'incineration': incinerationIcon,
  'sprinter': sprinterIcon,
  'psionic-resistance': PLACEHOLDER_ICON.cyan,
  'awareness': awarenessIcon,
  'cognitive-enhancement': PLACEHOLDER_ICON.cyan,
  'penetrator': penetratorIcon,
  'flak': alienClusterbombIcon,
  'gravity-well': PLACEHOLDER_ICON.cyan,
  'mist': PLACEHOLDER_ICON.cyan,
  'eye-of-the-storm': PLACEHOLDER_ICON.cyan,
};
