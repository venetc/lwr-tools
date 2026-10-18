import type { DeepReadonly } from '@shared/lib/object';

import type { EquipmentId } from '../../model/equipment';
import alienGrenadeIcon from '../icons/equipment/alien_grenade_long_war.png';
import alienTrophyIcon from '../icons/equipment/alien_trophy_long_war.png';
import alloyBipodIcon from '../icons/equipment/alloy_bipod_long_war.png';
import alloyCarbidePlatingIcon from '../icons/equipment/alloy_carbide_plating_long_war.png';
import alloyEnhancedRoundsIcon from '../icons/equipment/alloy_jacketed_rounds_long_war.png';
import alloyPlatingIcon from '../icons/equipment/alloy_plating_long_war.png';
import apGrenadeIcon from '../icons/equipment/ap_grenade_long_war.png';
import armorPiercingAmmoIcon from '../icons/equipment/armor_piercing_ammo_long_war.png';
import battleComputerIcon from '../icons/equipment/battle_computer_long_war.png';
import battleScannerIcon from '../icons/equipment/battle_scanner_long_war.png';
import breachingAmmoIcon from '../icons/equipment/breaching_ammo_long_war.png';
import ceramicPlatingIcon from '../icons/equipment/ceramic_plates_long_war.png';
import chameleonVestIcon from '../icons/equipment/chameleon_suit_long_war.png';
import acidGrenadeIcon from '../icons/equipment/chem_grenade_long_war.png';
import chitinPlatingIcon from '../icons/equipment/chittin_plating_long_war.png';
import cognitiveEnhancerIcon from '../icons/equipment/cognitive_enchancer_long_war.png';
import combatStimsIcon from '../icons/equipment/combat_stims_long_war.png';
import corePlatingIcon from '../icons/equipment/core_armoring_long_war.png';
import drumMagsIcon from '../icons/equipment/drum_mags_long_war.png';
import electropulseIcon from '../icons/equipment/electro_pulse_long_war.png';
import eleriumTurbosIcon from '../icons/equipment/elerium_turbos_long_war.png';
import enhancedBeamOpticsIcon from '../icons/equipment/enchanced_beam_optics_long_war.png';
import flakAmmoIcon from '../icons/equipment/flak_ammo_long_war.png';
import flamethrowerIcon from '../icons/equipment/flamethrower_long_war.png';
import concussionGrenadeIcon from '../icons/equipment/flashbang_grenade_long_war.png';
import conduitIcon from '../icons/equipment/fuel_cell_long_war.png';
import shadowGrenadeIcon from '../icons/equipment/ghost_grenade_long_war.png';
import grenadeLauncherIcon from '../icons/equipment/grenade_launcher_long_war.png';
import heGrenadeIcon from '../icons/equipment/he_grenade_long_war.png';
import heavyMagsIcon from '../icons/equipment/heat_ammo_long_war.png';
import highCapMagsIcon from '../icons/equipment/hi_cap_mags_long_war.png';
import illuminatorScopeIcon from '../icons/equipment/illuminator_gunsight_long_war.png';
import regenerativePlatingIcon from '../icons/equipment/impact_vest_long_war.png';
import incineratorAmpIcon from '../icons/equipment/incinerator_module_long_war.png';
import kineticStrikeModuleIcon from '../icons/equipment/kinetic_strike_module_long_war.png';
import laserSightIcon from '../icons/equipment/laser_sight_long_war.png';
import marksmanScopeIcon from '../icons/equipment/marksman_scope_long_war.png';
import medikitIcon from '../icons/equipment/medkit_long_war.png';
import predictionComputerIcon from '../icons/equipment/mimic_beacon_long_war.png';
import psiFrayerIcon from '../icons/equipment/mind_shield_long_war.png';
import motionTrackerIcon from '../icons/equipment/motion_tracker_long_war.png';
import neuroregulatorIcon from '../icons/equipment/neural_gunlink_long_war.png';
import neuralScopeIcon from '../icons/equipment/neuroregulator_long_war.png';
import plasmaStelleratorIcon from '../icons/equipment/plasma_stellerator_long_war.png';
import gravityMineLauncherIcon from '../icons/equipment/proximity_mine_launcher_long_war.png';
import psiGrenadeIcon from '../icons/equipment/psi_grenade_long_war.png';
import psiDefenderIcon from '../icons/equipment/psi_screen_long_war.png';
import reaperAmmoIcon from '../icons/equipment/reaper_ammo_lwr.png';
import reinforcedPlatingIcon from '../icons/equipment/reinforced_armor_long_war.png';
import respiratorImplantIcon from '../icons/equipment/respirator_implant_long_war.png';
import restorativeMistIcon from '../icons/equipment/restorative_mist_long_war.png';
import airburstActuatorsIcon from '../icons/equipment/rocket_long_war.png';
import scopeIcon from '../icons/equipment/scope_long_war.png';
import shredderAmmoIcon from '../icons/equipment/shredder_ammo.png';
import javelinRocketIcon from '../icons/equipment/shredder_rocket_long_war.png';
import smokeGrenadeIcon from '../icons/equipment/smoke_grenade_long_war.png';
import proximitySensorIcon from '../icons/equipment/tactical_sensors_long_war.png';
import arTargeterIcon from '../icons/equipment/targeting_module_long_war.png';
import theThumperIcon from '../icons/equipment/the_thumper_long_war.png';
import walkerServosIcon from '../icons/equipment/walker_servos_long_war.png';

/** Equipment and Module images from the game (256×128; Reaper Ammo 211×174, its only original) by equipment id; items share an image where the wiki does. */
export const EQUIPMENT_ICON: DeepReadonly<Record<EquipmentId, string>> = {
  'he-grenade': heGrenadeIcon,
  'ap-grenade': apGrenadeIcon,
  'concussion-grenade': concussionGrenadeIcon,
  'smoke-grenade': smokeGrenadeIcon,
  'battle-scanner': battleScannerIcon,
  'alien-grenade': alienGrenadeIcon,
  'plasma-grenade': alienGrenadeIcon,
  'acid-grenade': acidGrenadeIcon,
  'shadow-grenade': shadowGrenadeIcon,
  'psi-grenade': psiGrenadeIcon,
  'medikit': medikitIcon,
  'combat-stims': combatStimsIcon,
  'chitin-plating': chitinPlatingIcon,
  'alloy-plating': alloyPlatingIcon,
  'psi-frayer': psiFrayerIcon,
  'respirator-implant': respiratorImplantIcon,
  'prediction-computer': predictionComputerIcon,
  'marksman-scope': marksmanScopeIcon,
  'airburst-actuators': airburstActuatorsIcon,
  'javelin-rocket': javelinRocketIcon,
  'high-cap-mags': highCapMagsIcon,
  'chameleon-vest': chameleonVestIcon,
  'ceramic-plating': ceramicPlatingIcon,
  'drum-mags': drumMagsIcon,
  'alloy-bipod': alloyBipodIcon,
  'breaching-ammo': breachingAmmoIcon,
  'regenerative-plating': regenerativePlatingIcon,
  'proximity-sensor': proximitySensorIcon,
  'walker-servos': walkerServosIcon,
  'neural-scope': neuralScopeIcon,
  'shredder-ammo': shredderAmmoIcon,
  'psi-defender': psiDefenderIcon,
  'conduit': conduitIcon,
  'reinforced-plating': reinforcedPlatingIcon,
  'neuroregulator': neuroregulatorIcon,
  'ar-targeter': arTargeterIcon,
  'the-thumper': theThumperIcon,
  'incinerator-amp': incineratorAmpIcon,
  'elerium-turbos': eleriumTurbosIcon,
  'motion-tracker': motionTrackerIcon,
  'battle-computer': battleComputerIcon,
  'heavy-mags': heavyMagsIcon,
  'core-plating': corePlatingIcon,
  'alloy-carbide-plating': alloyCarbidePlatingIcon,
  'alien-trophy': alienTrophyIcon,
  'cognitive-enhancer': cognitiveEnhancerIcon,
  'scope': scopeIcon,
  'reaper-ammo': reaperAmmoIcon,
  'alloy-enhanced-rounds': alloyEnhancedRoundsIcon,
  'enhanced-beam-optics': enhancedBeamOpticsIcon,
  'plasma-stellerator': plasmaStelleratorIcon,
  'laser-sight': laserSightIcon,
  'armor-piercing-ammo': armorPiercingAmmoIcon,
  'illuminator-scope': illuminatorScopeIcon,
  'flak-ammo': flakAmmoIcon,
  'flamethrower': flamethrowerIcon,
  'kinetic-strike-module': kineticStrikeModuleIcon,
  'gravity-mine-launcher': gravityMineLauncherIcon,
  'electropulse': electropulseIcon,
  'grenade-launcher': grenadeLauncherIcon,
  'advanced-launcher': grenadeLauncherIcon,
  'restorative-mist': restorativeMistIcon,
};
