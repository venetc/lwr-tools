import type { DeepReadonly } from '@shared/lib/object';

import type { ShivPerkIcon, ShivPerkId } from '../../model/perks';
import adaptiveBoneMarrowGeneModEu2012OriginalIcon from '../icons/perks/adaptive_bone_marrow_gene_mod_eu2012/adaptive_bone_marrow_gene_mod_eu2012@4x.png';
import adaptiveBoneMarrowGeneModEu2012AvailableIcon from '../icons/perks/adaptive_bone_marrow_gene_mod_eu2012/adaptive_bone_marrow_gene_mod_eu2012@4x_available.png';
import adaptiveBoneMarrowGeneModEu2012DisabledIcon from '../icons/perks/adaptive_bone_marrow_gene_mod_eu2012/adaptive_bone_marrow_gene_mod_eu2012@4x_disabled.png';
import assaultBringthemonOriginalIcon from '../icons/perks/assault_bringthemon/assault_bringthemon@4x.png';
import assaultBringthemonAvailableIcon from '../icons/perks/assault_bringthemon/assault_bringthemon@4x_available.png';
import assaultBringthemonDisabledIcon from '../icons/perks/assault_bringthemon/assault_bringthemon@4x_disabled.png';
import assaultClosecombatOriginalIcon from '../icons/perks/assault_closecombat/assault_closecombat@4x.png';
import assaultClosecombatAvailableIcon from '../icons/perks/assault_closecombat/assault_closecombat@4x_available.png';
import assaultClosecombatDisabledIcon from '../icons/perks/assault_closecombat/assault_closecombat@4x_disabled.png';
import assaultResillienceOriginalIcon from '../icons/perks/assault_resillience/assault_resillience@4x.png';
import assaultResillienceAvailableIcon from '../icons/perks/assault_resillience/assault_resillience@4x_available.png';
import assaultResillienceDisabledIcon from '../icons/perks/assault_resillience/assault_resillience@4x_disabled.png';
import defendersMedal2Eu2012OriginalIcon from '../icons/perks/defenders_medal_2_eu2012/defenders_medal_2_eu2012@4x.png';
import defendersMedal2Eu2012AvailableIcon from '../icons/perks/defenders_medal_2_eu2012/defenders_medal_2_eu2012@4x_available.png';
import defendersMedal2Eu2012DisabledIcon from '../icons/perks/defenders_medal_2_eu2012/defenders_medal_2_eu2012@4x_disabled.png';
import heavyBulletswarmOriginalIcon from '../icons/perks/heavy_bulletswarm/heavy_bulletswarm@4x.png';
import heavyBulletswarmAvailableIcon from '../icons/perks/heavy_bulletswarm/heavy_bulletswarm@4x_available.png';
import heavyBulletswarmDisabledIcon from '../icons/perks/heavy_bulletswarm/heavy_bulletswarm@4x_disabled.png';
import heavyHoloOriginalIcon from '../icons/perks/heavy_holo/heavy_holo@4x.png';
import heavyHoloAvailableIcon from '../icons/perks/heavy_holo/heavy_holo@4x_available.png';
import heavyHoloDisabledIcon from '../icons/perks/heavy_holo/heavy_holo@4x_disabled.png';
import heavyShredderOriginalIcon from '../icons/perks/heavy_shredder/heavy_shredder@4x.png';
import heavyShredderAvailableIcon from '../icons/perks/heavy_shredder/heavy_shredder@4x_available.png';
import heavyShredderDisabledIcon from '../icons/perks/heavy_shredder/heavy_shredder@4x_disabled.png';
import mecAbsortionFieldsOriginalIcon from '../icons/perks/mec_absortion_fields/mec_absortion_fields@4x.png';
import mecAbsortionFieldsAvailableIcon from '../icons/perks/mec_absortion_fields/mec_absortion_fields@4x_available.png';
import mecAbsortionFieldsDisabledIcon from '../icons/perks/mec_absortion_fields/mec_absortion_fields@4x_disabled.png';
import mecDamageControlOriginalIcon from '../icons/perks/mec_damage_control/mec_damage_control@4x.png';
import mecDamageControlAvailableIcon from '../icons/perks/mec_damage_control/mec_damage_control@4x_available.png';
import mecDamageControlDisabledIcon from '../icons/perks/mec_damage_control/mec_damage_control@4x_disabled.png';
import mecPlatformStabilityOriginalIcon from '../icons/perks/mec_platform_stability/mec_platform_stability@4x.png';
import mecPlatformStabilityAvailableIcon from '../icons/perks/mec_platform_stability/mec_platform_stability@4x_available.png';
import mecPlatformStabilityDisabledIcon from '../icons/perks/mec_platform_stability/mec_platform_stability@4x_disabled.png';
import mecReactiveTargetingSensorsOriginalIcon from '../icons/perks/mec_reactive_targeting_sensors/mec_reactive_targeting_sensors@4x.png';
import mecReactiveTargetingSensorsAvailableIcon from '../icons/perks/mec_reactive_targeting_sensors/mec_reactive_targeting_sensors@4x_available.png';
import mecReactiveTargetingSensorsDisabledIcon from '../icons/perks/mec_reactive_targeting_sensors/mec_reactive_targeting_sensors@4x_disabled.png';
import mecRepairServosOriginalIcon from '../icons/perks/mec_repair_servos/mec_repair_servos@4x.png';
import mecRepairServosAvailableIcon from '../icons/perks/mec_repair_servos/mec_repair_servos@4x_available.png';
import mecRepairServosDisabledIcon from '../icons/perks/mec_repair_servos/mec_repair_servos@4x_disabled.png';
import mecVitalPointTargetingOriginalIcon from '../icons/perks/mec_vital_point_targeting/mec_vital_point_targeting@4x.png';
import mecVitalPointTargetingAvailableIcon from '../icons/perks/mec_vital_point_targeting/mec_vital_point_targeting@4x_available.png';
import mecVitalPointTargetingDisabledIcon from '../icons/perks/mec_vital_point_targeting/mec_vital_point_targeting@4x_disabled.png';
import supportDeeppocketsOriginalIcon from '../icons/perks/support_deeppockets/support_deeppockets@4x.png';
import supportDeeppocketsAvailableIcon from '../icons/perks/support_deeppockets/support_deeppockets@4x_available.png';
import supportDeeppocketsDisabledIcon from '../icons/perks/support_deeppockets/support_deeppockets@4x_disabled.png';

const adaptiveBoneMarrowGeneModEu2012Icon: ShivPerkIcon = { selected: adaptiveBoneMarrowGeneModEu2012OriginalIcon, available: adaptiveBoneMarrowGeneModEu2012AvailableIcon, disabled: adaptiveBoneMarrowGeneModEu2012DisabledIcon };
const assaultBringthemonIcon: ShivPerkIcon = { selected: assaultBringthemonOriginalIcon, available: assaultBringthemonAvailableIcon, disabled: assaultBringthemonDisabledIcon };
const assaultClosecombatIcon: ShivPerkIcon = { selected: assaultClosecombatOriginalIcon, available: assaultClosecombatAvailableIcon, disabled: assaultClosecombatDisabledIcon };
const assaultResillienceIcon: ShivPerkIcon = { selected: assaultResillienceOriginalIcon, available: assaultResillienceAvailableIcon, disabled: assaultResillienceDisabledIcon };
const defendersMedal2Eu2012Icon: ShivPerkIcon = { selected: defendersMedal2Eu2012OriginalIcon, available: defendersMedal2Eu2012AvailableIcon, disabled: defendersMedal2Eu2012DisabledIcon };
const heavyBulletswarmIcon: ShivPerkIcon = { selected: heavyBulletswarmOriginalIcon, available: heavyBulletswarmAvailableIcon, disabled: heavyBulletswarmDisabledIcon };
const heavyHoloIcon: ShivPerkIcon = { selected: heavyHoloOriginalIcon, available: heavyHoloAvailableIcon, disabled: heavyHoloDisabledIcon };
const heavyShredderIcon: ShivPerkIcon = { selected: heavyShredderOriginalIcon, available: heavyShredderAvailableIcon, disabled: heavyShredderDisabledIcon };
const mecAbsortionFieldsIcon: ShivPerkIcon = { selected: mecAbsortionFieldsOriginalIcon, available: mecAbsortionFieldsAvailableIcon, disabled: mecAbsortionFieldsDisabledIcon };
const mecDamageControlIcon: ShivPerkIcon = { selected: mecDamageControlOriginalIcon, available: mecDamageControlAvailableIcon, disabled: mecDamageControlDisabledIcon };
const mecPlatformStabilityIcon: ShivPerkIcon = { selected: mecPlatformStabilityOriginalIcon, available: mecPlatformStabilityAvailableIcon, disabled: mecPlatformStabilityDisabledIcon };
const mecReactiveTargetingSensorsIcon: ShivPerkIcon = { selected: mecReactiveTargetingSensorsOriginalIcon, available: mecReactiveTargetingSensorsAvailableIcon, disabled: mecReactiveTargetingSensorsDisabledIcon };
const mecRepairServosIcon: ShivPerkIcon = { selected: mecRepairServosOriginalIcon, available: mecRepairServosAvailableIcon, disabled: mecRepairServosDisabledIcon };
const mecVitalPointTargetingIcon: ShivPerkIcon = { selected: mecVitalPointTargetingOriginalIcon, available: mecVitalPointTargetingAvailableIcon, disabled: mecVitalPointTargetingDisabledIcon };
const supportDeeppocketsIcon: ShivPerkIcon = { selected: supportDeeppocketsOriginalIcon, available: supportDeeppocketsAvailableIcon, disabled: supportDeeppocketsDisabledIcon };

/** Icon variants by SHIV perk id: wiki icons upscaled and tinted green as on the game's SHIV screen. */
export const SHIV_PERK_ICON: DeepReadonly<Record<ShivPerkId, ShivPerkIcon>> = {
  'lock-n-load': supportDeeppocketsIcon,
  'repair-servos': mecRepairServosIcon,
  'platform-stability': mecPlatformStabilityIcon,
  'holo-rounds': heavyHoloIcon,
  'shredder': heavyShredderIcon,
  'damage-control': mecDamageControlIcon,
  'reactive-targeting-sensors': mecReactiveTargetingSensorsIcon,
  'light-em-up': heavyBulletswarmIcon,
  'close-combat-specialist': assaultClosecombatIcon,
  'critical-system-targeting': adaptiveBoneMarrowGeneModEu2012Icon,
  'fortified': assaultResillienceIcon,
  'absorption-fields': mecAbsortionFieldsIcon,
  'vital-point-targeting': mecVitalPointTargetingIcon,
  'bring-em-on': assaultBringthemonIcon,
  'smart-macrophages': defendersMedal2Eu2012Icon,
};
