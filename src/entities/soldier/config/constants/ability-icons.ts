import type { DeepReadonly } from '@shared/lib/object';

import type { AbilityIcon, AbilityId } from '../../model/abilities';
import aceHoleOriginalIcon from '../icons/abilities/ace_hole/ace_hole@4x.png';
import aceHoleAvailableIcon from '../icons/abilities/ace_hole/ace_hole@4x_available.png';
import aceHoleDisabledIcon from '../icons/abilities/ace_hole/ace_hole@4x_disabled.png';
import alienBullrushOriginalIcon from '../icons/abilities/alien_bullrush/alien_bullrush@4x.png';
import alienBullrushAvailableIcon from '../icons/abilities/alien_bullrush/alien_bullrush@4x_available.png';
import alienBullrushDisabledIcon from '../icons/abilities/alien_bullrush/alien_bullrush@4x_disabled.png';
import alienRepairOriginalIcon from '../icons/abilities/alien_repair/alien_repair@4x.png';
import alienRepairAvailableIcon from '../icons/abilities/alien_repair/alien_repair@4x_available.png';
import alienRepairDisabledIcon from '../icons/abilities/alien_repair/alien_repair@4x_disabled.png';
import assaultAggressionOriginalIcon from '../icons/abilities/assault_aggression/assault_aggression@4x.png';
import assaultAggressionAvailableIcon from '../icons/abilities/assault_aggression/assault_aggression@4x_available.png';
import assaultAggressionDisabledIcon from '../icons/abilities/assault_aggression/assault_aggression@4x_disabled.png';
import assaultBringthemonOriginalIcon from '../icons/abilities/assault_bringthemon/assault_bringthemon@4x.png';
import assaultBringthemonAvailableIcon from '../icons/abilities/assault_bringthemon/assault_bringthemon@4x_available.png';
import assaultBringthemonDisabledIcon from '../icons/abilities/assault_bringthemon/assault_bringthemon@4x_disabled.png';
import assaultClosecombatOriginalIcon from '../icons/abilities/assault_closecombat/assault_closecombat@4x.png';
import assaultClosecombatAvailableIcon from '../icons/abilities/assault_closecombat/assault_closecombat@4x_available.png';
import assaultClosecombatDisabledIcon from '../icons/abilities/assault_closecombat/assault_closecombat@4x_disabled.png';
import assaultClosepersonalOriginalIcon from '../icons/abilities/assault_closepersonal/assault_closepersonal@4x.png';
import assaultClosepersonalAvailableIcon from '../icons/abilities/assault_closepersonal/assault_closepersonal@4x_available.png';
import assaultClosepersonalDisabledIcon from '../icons/abilities/assault_closepersonal/assault_closepersonal@4x_disabled.png';
import assaultExtraconditioningOriginalIcon from '../icons/abilities/assault_extraconditioning/assault_extraconditioning@4x.png';
import assaultExtraconditioningAvailableIcon from '../icons/abilities/assault_extraconditioning/assault_extraconditioning@4x_available.png';
import assaultExtraconditioningDisabledIcon from '../icons/abilities/assault_extraconditioning/assault_extraconditioning@4x_disabled.png';
import assaultKillerinstinctOriginalIcon from '../icons/abilities/assault_killerinstinct/assault_killerinstinct@4x.png';
import assaultKillerinstinctAvailableIcon from '../icons/abilities/assault_killerinstinct/assault_killerinstinct@4x_available.png';
import assaultKillerinstinctDisabledIcon from '../icons/abilities/assault_killerinstinct/assault_killerinstinct@4x_disabled.png';
import assaultLightningreflexesOriginalIcon from '../icons/abilities/assault_lightningreflexes/assault_lightningreflexes@4x.png';
import assaultLightningreflexesAvailableIcon from '../icons/abilities/assault_lightningreflexes/assault_lightningreflexes@4x_available.png';
import assaultLightningreflexesDisabledIcon from '../icons/abilities/assault_lightningreflexes/assault_lightningreflexes@4x_disabled.png';
import assaultRapidfireOriginalIcon from '../icons/abilities/assault_rapidfire/assault_rapidfire@4x.png';
import assaultRapidfireAvailableIcon from '../icons/abilities/assault_rapidfire/assault_rapidfire@4x_available.png';
import assaultRapidfireDisabledIcon from '../icons/abilities/assault_rapidfire/assault_rapidfire@4x_disabled.png';
import assaultResillienceOriginalIcon from '../icons/abilities/assault_resillience/assault_resillience@4x.png';
import assaultResillienceAvailableIcon from '../icons/abilities/assault_resillience/assault_resillience@4x_available.png';
import assaultResillienceDisabledIcon from '../icons/abilities/assault_resillience/assault_resillience@4x_disabled.png';
import assaultRungunOriginalIcon from '../icons/abilities/assault_rungun/assault_rungun@4x.png';
import assaultRungunAvailableIcon from '../icons/abilities/assault_rungun/assault_rungun@4x_available.png';
import assaultRungunDisabledIcon from '../icons/abilities/assault_rungun/assault_rungun@4x_disabled.png';
import bombardTgaOriginalIcon from '../icons/abilities/bombard_tga/bombard_tga@4x.png';
import bombardTgaAvailableIcon from '../icons/abilities/bombard_tga/bombard_tga@4x_available.png';
import bombardTgaDisabledIcon from '../icons/abilities/bombard_tga/bombard_tga@4x_disabled.png';
import commandOriginalIcon from '../icons/abilities/command/command@4x.png';
import commandAvailableIcon from '../icons/abilities/command/command@4x_available.png';
import commandDisabledIcon from '../icons/abilities/command/command@4x_disabled.png';
import councilMedalOfHonor2Eu2012OriginalIcon from '../icons/abilities/council_medal_of_honor_2_eu2012/council_medal_of_honor_2_eu2012@4x.png';
import councilMedalOfHonor2Eu2012AvailableIcon from '../icons/abilities/council_medal_of_honor_2_eu2012/council_medal_of_honor_2_eu2012@4x_available.png';
import councilMedalOfHonor2Eu2012DisabledIcon from '../icons/abilities/council_medal_of_honor_2_eu2012/council_medal_of_honor_2_eu2012@4x_disabled.png';
import dazedOriginalIcon from '../icons/abilities/dazed/dazed@4x.png';
import dazedAvailableIcon from '../icons/abilities/dazed/dazed@4x_available.png';
import dazedDisabledIcon from '../icons/abilities/dazed/dazed@4x_disabled.png';
import defendersMedal1Eu2012OriginalIcon from '../icons/abilities/defenders_medal_1_eu2012/defenders_medal_1_eu2012@4x.png';
import defendersMedal1Eu2012AvailableIcon from '../icons/abilities/defenders_medal_1_eu2012/defenders_medal_1_eu2012@4x_available.png';
import defendersMedal1Eu2012DisabledIcon from '../icons/abilities/defenders_medal_1_eu2012/defenders_medal_1_eu2012@4x_disabled.png';
import fireInTheHoleOriginalIcon from '../icons/abilities/fire_in_the_hole/fire_in_the_hole@4x.png';
import fireInTheHoleAvailableIcon from '../icons/abilities/fire_in_the_hole/fire_in_the_hole@4x_available.png';
import fireInTheHoleDisabledIcon from '../icons/abilities/fire_in_the_hole/fire_in_the_hole@4x_disabled.png';
import heavyBulletswarmOriginalIcon from '../icons/abilities/heavy_bulletswarm/heavy_bulletswarm@4x.png';
import heavyBulletswarmAvailableIcon from '../icons/abilities/heavy_bulletswarm/heavy_bulletswarm@4x_available.png';
import heavyBulletswarmDisabledIcon from '../icons/abilities/heavy_bulletswarm/heavy_bulletswarm@4x_disabled.png';
import heavyFirerocketOriginalIcon from '../icons/abilities/heavy_firerocket/heavy_firerocket@4x.png';
import heavyFirerocketAvailableIcon from '../icons/abilities/heavy_firerocket/heavy_firerocket@4x_available.png';
import heavyFirerocketDisabledIcon from '../icons/abilities/heavy_firerocket/heavy_firerocket@4x_disabled.png';
import heavyGrenadierOriginalIcon from '../icons/abilities/heavy_grenadier/heavy_grenadier@4x.png';
import heavyGrenadierAvailableIcon from '../icons/abilities/heavy_grenadier/heavy_grenadier@4x_available.png';
import heavyGrenadierDisabledIcon from '../icons/abilities/heavy_grenadier/heavy_grenadier@4x_disabled.png';
import heavyHeatAmmoOriginalIcon from '../icons/abilities/heavy_heat_ammo/heavy_heat_ammo@4x.png';
import heavyHeatAmmoAvailableIcon from '../icons/abilities/heavy_heat_ammo/heavy_heat_ammo@4x_available.png';
import heavyHeatAmmoDisabledIcon from '../icons/abilities/heavy_heat_ammo/heavy_heat_ammo@4x_disabled.png';
import heavyHoloOriginalIcon from '../icons/abilities/heavy_holo/heavy_holo@4x.png';
import heavyHoloAvailableIcon from '../icons/abilities/heavy_holo/heavy_holo@4x_available.png';
import heavyHoloDisabledIcon from '../icons/abilities/heavy_holo/heavy_holo@4x_disabled.png';
import heavyMayhemOriginalIcon from '../icons/abilities/heavy_mayhem/heavy_mayhem@4x.png';
import heavyMayhemAvailableIcon from '../icons/abilities/heavy_mayhem/heavy_mayhem@4x_available.png';
import heavyMayhemDisabledIcon from '../icons/abilities/heavy_mayhem/heavy_mayhem@4x_disabled.png';
import heavyRapidreactionOriginalIcon from '../icons/abilities/heavy_rapidreaction/heavy_rapidreaction@4x.png';
import heavyRapidreactionAvailableIcon from '../icons/abilities/heavy_rapidreaction/heavy_rapidreaction@4x_available.png';
import heavyRapidreactionDisabledIcon from '../icons/abilities/heavy_rapidreaction/heavy_rapidreaction@4x_disabled.png';
import heavySuppressionOriginalIcon from '../icons/abilities/heavy_suppression/heavy_suppression@4x.png';
import heavySuppressionAvailableIcon from '../icons/abilities/heavy_suppression/heavy_suppression@4x_available.png';
import heavySuppressionDisabledIcon from '../icons/abilities/heavy_suppression/heavy_suppression@4x_disabled.png';
import heavyWilltosurviveOriginalIcon from '../icons/abilities/heavy_willtosurvive/heavy_willtosurvive@4x.png';
import heavyWilltosurviveAvailableIcon from '../icons/abilities/heavy_willtosurvive/heavy_willtosurvive@4x_available.png';
import heavyWilltosurviveDisabledIcon from '../icons/abilities/heavy_willtosurvive/heavy_willtosurvive@4x_disabled.png';
import honorAOriginalIcon from '../icons/abilities/honor_a/honor_a@4x.png';
import honorAAvailableIcon from '../icons/abilities/honor_a/honor_a@4x_available.png';
import honorADisabledIcon from '../icons/abilities/honor_a/honor_a@4x_disabled.png';
import itzIconOriginalIcon from '../icons/abilities/itz_icon/itz_icon@4x.png';
import itzIconAvailableIcon from '../icons/abilities/itz_icon/itz_icon@4x_available.png';
import itzIconDisabledIcon from '../icons/abilities/itz_icon/itz_icon@4x_disabled.png';
import leadbyexampleOriginalIcon from '../icons/abilities/leadbyexample/leadbyexample@4x.png';
import leadbyexampleAvailableIcon from '../icons/abilities/leadbyexample/leadbyexample@4x_available.png';
import leadbyexampleDisabledIcon from '../icons/abilities/leadbyexample/leadbyexample@4x_disabled.png';
import lwrAceOriginalIcon from '../icons/abilities/lwr_ace/lwr_ace@4x.png';
import lwrAceAvailableIcon from '../icons/abilities/lwr_ace/lwr_ace@4x_available.png';
import lwrAceDisabledIcon from '../icons/abilities/lwr_ace/lwr_ace@4x_disabled.png';
import lwrAcidTechOriginalIcon from '../icons/abilities/lwr_acid_tech/lwr_acid_tech@4x.png';
import lwrAcidTechAvailableIcon from '../icons/abilities/lwr_acid_tech/lwr_acid_tech@4x_available.png';
import lwrAcidTechDisabledIcon from '../icons/abilities/lwr_acid_tech/lwr_acid_tech@4x_disabled.png';
import lwrBlastOriginalIcon from '../icons/abilities/lwr_blast/lwr_blast@4x.png';
import lwrBlastAvailableIcon from '../icons/abilities/lwr_blast/lwr_blast@4x_available.png';
import lwrBlastDisabledIcon from '../icons/abilities/lwr_blast/lwr_blast@4x_disabled.png';
import lwrBrawlerOriginalIcon from '../icons/abilities/lwr_brawler/lwr_brawler@4x.png';
import lwrBrawlerAvailableIcon from '../icons/abilities/lwr_brawler/lwr_brawler@4x_available.png';
import lwrBrawlerDisabledIcon from '../icons/abilities/lwr_brawler/lwr_brawler@4x_disabled.png';
import lwrBreacherOriginalIcon from '../icons/abilities/lwr_breacher/lwr_breacher@4x.png';
import lwrBreacherAvailableIcon from '../icons/abilities/lwr_breacher/lwr_breacher@4x_available.png';
import lwrBreacherDisabledIcon from '../icons/abilities/lwr_breacher/lwr_breacher@4x_disabled.png';
import lwrBullseyeOriginalIcon from '../icons/abilities/lwr_bullseye/lwr_bullseye@4x.png';
import lwrBullseyeAvailableIcon from '../icons/abilities/lwr_bullseye/lwr_bullseye@4x_available.png';
import lwrBullseyeDisabledIcon from '../icons/abilities/lwr_bullseye/lwr_bullseye@4x_disabled.png';
import lwrCriticalSystemTargetingOriginalIcon from '../icons/abilities/lwr_critical_system_targeting/lwr_critical_system_targeting@4x.png';
import lwrCriticalSystemTargetingAvailableIcon from '../icons/abilities/lwr_critical_system_targeting/lwr_critical_system_targeting@4x_available.png';
import lwrCriticalSystemTargetingDisabledIcon from '../icons/abilities/lwr_critical_system_targeting/lwr_critical_system_targeting@4x_disabled.png';
import lwrDampeningShieldOriginalIcon from '../icons/abilities/lwr_dampening_shield/lwr_dampening_shield@4x.png';
import lwrDampeningShieldAvailableIcon from '../icons/abilities/lwr_dampening_shield/lwr_dampening_shield@4x_available.png';
import lwrDampeningShieldDisabledIcon from '../icons/abilities/lwr_dampening_shield/lwr_dampening_shield@4x_disabled.png';
import lwrDashAndBashOriginalIcon from '../icons/abilities/lwr_dash_and_bash/lwr_dash_and_bash@4x.png';
import lwrDashAndBashAvailableIcon from '../icons/abilities/lwr_dash_and_bash/lwr_dash_and_bash@4x_available.png';
import lwrDashAndBashDisabledIcon from '../icons/abilities/lwr_dash_and_bash/lwr_dash_and_bash@4x_disabled.png';
import lwrFirebaseOriginalIcon from '../icons/abilities/lwr_firebase/lwr_firebase@4x.png';
import lwrFirebaseAvailableIcon from '../icons/abilities/lwr_firebase/lwr_firebase@4x_available.png';
import lwrFirebaseDisabledIcon from '../icons/abilities/lwr_firebase/lwr_firebase@4x_disabled.png';
import lwrFragmentationOriginalIcon from '../icons/abilities/lwr_fragmentation/lwr_fragmentation@4x.png';
import lwrFragmentationAvailableIcon from '../icons/abilities/lwr_fragmentation/lwr_fragmentation@4x_available.png';
import lwrFragmentationDisabledIcon from '../icons/abilities/lwr_fragmentation/lwr_fragmentation@4x_disabled.png';
import lwrGattlerOriginalIcon from '../icons/abilities/lwr_gattler/lwr_gattler@4x.png';
import lwrGattlerAvailableIcon from '../icons/abilities/lwr_gattler/lwr_gattler@4x_available.png';
import lwrGattlerDisabledIcon from '../icons/abilities/lwr_gattler/lwr_gattler@4x_disabled.png';
import lwrGuardianOriginalIcon from '../icons/abilities/lwr_guardian/lwr_guardian@4x.png';
import lwrGuardianAvailableIcon from '../icons/abilities/lwr_guardian/lwr_guardian@4x_available.png';
import lwrGuardianDisabledIcon from '../icons/abilities/lwr_guardian/lwr_guardian@4x_disabled.png';
import lwrHeatWarheadsOriginalIcon from '../icons/abilities/lwr_heat_warheads/lwr_heat_warheads@4x.png';
import lwrHeatWarheadsAvailableIcon from '../icons/abilities/lwr_heat_warheads/lwr_heat_warheads@4x_available.png';
import lwrHeatWarheadsDisabledIcon from '../icons/abilities/lwr_heat_warheads/lwr_heat_warheads@4x_disabled.png';
import lwrHitAndRunOriginalIcon from '../icons/abilities/lwr_hit_and_run/lwr_hit_and_run@4x.png';
import lwrHitAndRunAvailableIcon from '../icons/abilities/lwr_hit_and_run/lwr_hit_and_run@4x_available.png';
import lwrHitAndRunDisabledIcon from '../icons/abilities/lwr_hit_and_run/lwr_hit_and_run@4x_disabled.png';
import lwrHunterOriginalIcon from '../icons/abilities/lwr_hunter/lwr_hunter@4x.png';
import lwrHunterAvailableIcon from '../icons/abilities/lwr_hunter/lwr_hunter@4x_available.png';
import lwrHunterDisabledIcon from '../icons/abilities/lwr_hunter/lwr_hunter@4x_disabled.png';
import lwrMagnumOriginalIcon from '../icons/abilities/lwr_magnum/lwr_magnum@4x.png';
import lwrMagnumAvailableIcon from '../icons/abilities/lwr_magnum/lwr_magnum@4x_available.png';
import lwrMagnumDisabledIcon from '../icons/abilities/lwr_magnum/lwr_magnum@4x_disabled.png';
import lwrOnTheReadyOriginalIcon from '../icons/abilities/lwr_on_the_ready/lwr_on_the_ready@4x.png';
import lwrOnTheReadyAvailableIcon from '../icons/abilities/lwr_on_the_ready/lwr_on_the_ready@4x_available.png';
import lwrOnTheReadyDisabledIcon from '../icons/abilities/lwr_on_the_ready/lwr_on_the_ready@4x_disabled.png';
import lwrPathfinderOriginalIcon from '../icons/abilities/lwr_pathfinder/lwr_pathfinder@4x.png';
import lwrPathfinderAvailableIcon from '../icons/abilities/lwr_pathfinder/lwr_pathfinder@4x_available.png';
import lwrPathfinderDisabledIcon from '../icons/abilities/lwr_pathfinder/lwr_pathfinder@4x_disabled.png';
import lwrPayloadOriginalIcon from '../icons/abilities/lwr_payload/lwr_payload@4x.png';
import lwrPayloadAvailableIcon from '../icons/abilities/lwr_payload/lwr_payload@4x_available.png';
import lwrPayloadDisabledIcon from '../icons/abilities/lwr_payload/lwr_payload@4x_disabled.png';
import lwrPistoleroOriginalIcon from '../icons/abilities/lwr_pistolero/lwr_pistolero@4x.png';
import lwrPistoleroAvailableIcon from '../icons/abilities/lwr_pistolero/lwr_pistolero@4x_available.png';
import lwrPistoleroDisabledIcon from '../icons/abilities/lwr_pistolero/lwr_pistolero@4x_disabled.png';
import lwrPyroOriginalIcon from '../icons/abilities/lwr_pyro/lwr_pyro@4x.png';
import lwrPyroAvailableIcon from '../icons/abilities/lwr_pyro/lwr_pyro@4x_available.png';
import lwrPyroDisabledIcon from '../icons/abilities/lwr_pyro/lwr_pyro@4x_disabled.png';
import lwrRakingFireOriginalIcon from '../icons/abilities/lwr_raking_fire/lwr_raking_fire@4x.png';
import lwrRakingFireAvailableIcon from '../icons/abilities/lwr_raking_fire/lwr_raking_fire@4x_available.png';
import lwrRakingFireDisabledIcon from '../icons/abilities/lwr_raking_fire/lwr_raking_fire@4x_disabled.png';
import lwrRapidPincersOriginalIcon from '../icons/abilities/lwr_rapid_pincers/lwr_rapid_pincers@4x.png';
import lwrRapidPincersAvailableIcon from '../icons/abilities/lwr_rapid_pincers/lwr_rapid_pincers@4x_available.png';
import lwrRapidPincersDisabledIcon from '../icons/abilities/lwr_rapid_pincers/lwr_rapid_pincers@4x_disabled.png';
import lwrReconnaissanceOriginalIcon from '../icons/abilities/lwr_reconnaissance/lwr_reconnaissance@4x.png';
import lwrReconnaissanceAvailableIcon from '../icons/abilities/lwr_reconnaissance/lwr_reconnaissance@4x_available.png';
import lwrReconnaissanceDisabledIcon from '../icons/abilities/lwr_reconnaissance/lwr_reconnaissance@4x_disabled.png';
import lwrRepulsorOriginalIcon from '../icons/abilities/lwr_repulsor/lwr_repulsor@4x.png';
import lwrRepulsorAvailableIcon from '../icons/abilities/lwr_repulsor/lwr_repulsor@4x_available.png';
import lwrRepulsorDisabledIcon from '../icons/abilities/lwr_repulsor/lwr_repulsor@4x_disabled.png';
import lwrShockAndAweOriginalIcon from '../icons/abilities/lwr_shock_and_awe/lwr_shock_and_awe@4x.png';
import lwrShockAndAweAvailableIcon from '../icons/abilities/lwr_shock_and_awe/lwr_shock_and_awe@4x_available.png';
import lwrShockAndAweDisabledIcon from '../icons/abilities/lwr_shock_and_awe/lwr_shock_and_awe@4x_disabled.png';
import lwrStayFrostyOriginalIcon from '../icons/abilities/lwr_stay_frosty/lwr_stay_frosty@4x.png';
import lwrStayFrostyAvailableIcon from '../icons/abilities/lwr_stay_frosty/lwr_stay_frosty@4x_available.png';
import lwrStayFrostyDisabledIcon from '../icons/abilities/lwr_stay_frosty/lwr_stay_frosty@4x_disabled.png';
import lwrSurgicalTargetingOriginalIcon from '../icons/abilities/lwr_surgical_targeting/lwr_surgical_targeting@4x.png';
import lwrSurgicalTargetingAvailableIcon from '../icons/abilities/lwr_surgical_targeting/lwr_surgical_targeting@4x_available.png';
import lwrSurgicalTargetingDisabledIcon from '../icons/abilities/lwr_surgical_targeting/lwr_surgical_targeting@4x_disabled.png';
import lwrSustainOriginalIcon from '../icons/abilities/lwr_sustain/lwr_sustain@4x.png';
import lwrSustainAvailableIcon from '../icons/abilities/lwr_sustain/lwr_sustain@4x_available.png';
import lwrSustainDisabledIcon from '../icons/abilities/lwr_sustain/lwr_sustain@4x_disabled.png';
import lwrTandemWarheadsOriginalIcon from '../icons/abilities/lwr_tandem_warheads/lwr_tandem_warheads@4x.png';
import lwrTandemWarheadsAvailableIcon from '../icons/abilities/lwr_tandem_warheads/lwr_tandem_warheads@4x_available.png';
import lwrTandemWarheadsDisabledIcon from '../icons/abilities/lwr_tandem_warheads/lwr_tandem_warheads@4x_disabled.png';
import lwrTenaciousDefenseOriginalIcon from '../icons/abilities/lwr_tenacious_defense/lwr_tenacious_defense@4x.png';
import lwrTenaciousDefenseAvailableIcon from '../icons/abilities/lwr_tenacious_defense/lwr_tenacious_defense@4x_available.png';
import lwrTenaciousDefenseDisabledIcon from '../icons/abilities/lwr_tenacious_defense/lwr_tenacious_defense@4x_disabled.png';
import mecAbsortionFieldsOriginalIcon from '../icons/abilities/mec_absortion_fields/mec_absortion_fields@4x.png';
import mecAbsortionFieldsAvailableIcon from '../icons/abilities/mec_absortion_fields/mec_absortion_fields@4x_available.png';
import mecAbsortionFieldsDisabledIcon from '../icons/abilities/mec_absortion_fields/mec_absortion_fields@4x_disabled.png';
import mecAdvancedFireControlOriginalIcon from '../icons/abilities/mec_advanced_fire_control/mec_advanced_fire_control@4x.png';
import mecAdvancedFireControlAvailableIcon from '../icons/abilities/mec_advanced_fire_control/mec_advanced_fire_control@4x_available.png';
import mecAdvancedFireControlDisabledIcon from '../icons/abilities/mec_advanced_fire_control/mec_advanced_fire_control@4x_disabled.png';
import mecAutomatedThreatAssessmentOriginalIcon from '../icons/abilities/mec_automated_threat_assessment/mec_automated_threat_assessment@4x.png';
import mecAutomatedThreatAssessmentAvailableIcon from '../icons/abilities/mec_automated_threat_assessment/mec_automated_threat_assessment@4x_available.png';
import mecAutomatedThreatAssessmentDisabledIcon from '../icons/abilities/mec_automated_threat_assessment/mec_automated_threat_assessment@4x_disabled.png';
import mecCollateralDamageOriginalIcon from '../icons/abilities/mec_collateral_damage/mec_collateral_damage@4x.png';
import mecCollateralDamageAvailableIcon from '../icons/abilities/mec_collateral_damage/mec_collateral_damage@4x_available.png';
import mecCollateralDamageDisabledIcon from '../icons/abilities/mec_collateral_damage/mec_collateral_damage@4x_disabled.png';
import mecExpandedStorageOriginalIcon from '../icons/abilities/mec_expanded_storage/mec_expanded_storage@4x.png';
import mecExpandedStorageAvailableIcon from '../icons/abilities/mec_expanded_storage/mec_expanded_storage@4x_available.png';
import mecExpandedStorageDisabledIcon from '../icons/abilities/mec_expanded_storage/mec_expanded_storage@4x_disabled.png';
import mecJetBootModuleOriginalIcon from '../icons/abilities/mec_jet_boot_module/mec_jet_boot_module@4x.png';
import mecJetBootModuleAvailableIcon from '../icons/abilities/mec_jet_boot_module/mec_jet_boot_module@4x_available.png';
import mecJetBootModuleDisabledIcon from '../icons/abilities/mec_jet_boot_module/mec_jet_boot_module@4x_disabled.png';
import mecReactiveTargetingSensorsOriginalIcon from '../icons/abilities/mec_reactive_targeting_sensors/mec_reactive_targeting_sensors@4x.png';
import mecReactiveTargetingSensorsAvailableIcon from '../icons/abilities/mec_reactive_targeting_sensors/mec_reactive_targeting_sensors@4x_available.png';
import mecReactiveTargetingSensorsDisabledIcon from '../icons/abilities/mec_reactive_targeting_sensors/mec_reactive_targeting_sensors@4x_disabled.png';
import mecRepairServosOriginalIcon from '../icons/abilities/mec_repair_servos/mec_repair_servos@4x.png';
import mecRepairServosAvailableIcon from '../icons/abilities/mec_repair_servos/mec_repair_servos@4x_available.png';
import mecRepairServosDisabledIcon from '../icons/abilities/mec_repair_servos/mec_repair_servos@4x_disabled.png';
import mecVitalPointTargetingOriginalIcon from '../icons/abilities/mec_vital_point_targeting/mec_vital_point_targeting@4x.png';
import mecVitalPointTargetingAvailableIcon from '../icons/abilities/mec_vital_point_targeting/mec_vital_point_targeting@4x_available.png';
import mecVitalPointTargetingDisabledIcon from '../icons/abilities/mec_vital_point_targeting/mec_vital_point_targeting@4x_disabled.png';
import nationAimOriginalIcon from '../icons/abilities/nation_aim/nation_aim@4x.png';
import nationAimAvailableIcon from '../icons/abilities/nation_aim/nation_aim@4x_available.png';
import nationAimDisabledIcon from '../icons/abilities/nation_aim/nation_aim@4x_disabled.png';
import nationWillOriginalIcon from '../icons/abilities/nation_will/nation_will@4x.png';
import nationWillAvailableIcon from '../icons/abilities/nation_will/nation_will@4x_available.png';
import nationWillDisabledIcon from '../icons/abilities/nation_will/nation_will@4x_disabled.png';
import onslaughtLwrOriginalIcon from '../icons/abilities/onslaught_lwr/onslaught_lwr@4x.png';
import onslaughtLwrAvailableIcon from '../icons/abilities/onslaught_lwr/onslaught_lwr@4x_available.png';
import onslaughtLwrDisabledIcon from '../icons/abilities/onslaught_lwr/onslaught_lwr@4x_disabled.png';
import overdriveOriginalIcon from '../icons/abilities/overdrive/overdrive@4x.png';
import overdriveAvailableIcon from '../icons/abilities/overdrive/overdrive@4x_available.png';
import overdriveDisabledIcon from '../icons/abilities/overdrive/overdrive@4x_disabled.png';
import pheromonesTgaOriginalIcon from '../icons/abilities/pheromones_tga/pheromones_tga@4x.png';
import pheromonesTgaAvailableIcon from '../icons/abilities/pheromones_tga/pheromones_tga@4x_available.png';
import pheromonesTgaDisabledIcon from '../icons/abilities/pheromones_tga/pheromones_tga@4x_disabled.png';
import sentinelModuleIconOriginalIcon from '../icons/abilities/sentinel_module_icon/sentinel_module_icon@4x.png';
import sentinelModuleIconAvailableIcon from '../icons/abilities/sentinel_module_icon/sentinel_module_icon@4x_available.png';
import sentinelModuleIconDisabledIcon from '../icons/abilities/sentinel_module_icon/sentinel_module_icon@4x_disabled.png';
import sniperDggOriginalIcon from '../icons/abilities/sniper_dgg/sniper_dgg@4x.png';
import sniperDggAvailableIcon from '../icons/abilities/sniper_dgg/sniper_dgg@4x_available.png';
import sniperDggDisabledIcon from '../icons/abilities/sniper_dgg/sniper_dgg@4x_disabled.png';
import sniperDisablingshotOriginalIcon from '../icons/abilities/sniper_disablingshot/sniper_disablingshot@4x.png';
import sniperDisablingshotAvailableIcon from '../icons/abilities/sniper_disablingshot/sniper_disablingshot@4x_available.png';
import sniperDisablingshotDisabledIcon from '../icons/abilities/sniper_disablingshot/sniper_disablingshot@4x_disabled.png';
import sniperDoubletapOriginalIcon from '../icons/abilities/sniper_doubletap/sniper_doubletap@4x.png';
import sniperDoubletapAvailableIcon from '../icons/abilities/sniper_doubletap/sniper_doubletap@4x_available.png';
import sniperDoubletapDisabledIcon from '../icons/abilities/sniper_doubletap/sniper_doubletap@4x_disabled.png';
import sniperExecutionerOriginalIcon from '../icons/abilities/sniper_executioner/sniper_executioner@4x.png';
import sniperExecutionerAvailableIcon from '../icons/abilities/sniper_executioner/sniper_executioner@4x_available.png';
import sniperExecutionerDisabledIcon from '../icons/abilities/sniper_executioner/sniper_executioner@4x_disabled.png';
import sniperGunslingerOriginalIcon from '../icons/abilities/sniper_gunslinger/sniper_gunslinger@4x.png';
import sniperGunslingerAvailableIcon from '../icons/abilities/sniper_gunslinger/sniper_gunslinger@4x_available.png';
import sniperGunslingerDisabledIcon from '../icons/abilities/sniper_gunslinger/sniper_gunslinger@4x_disabled.png';
import sniperHeadshotOriginalIcon from '../icons/abilities/sniper_headshot/sniper_headshot@4x.png';
import sniperHeadshotAvailableIcon from '../icons/abilities/sniper_headshot/sniper_headshot@4x_available.png';
import sniperHeadshotDisabledIcon from '../icons/abilities/sniper_headshot/sniper_headshot@4x_disabled.png';
import sniperLowprofileOriginalIcon from '../icons/abilities/sniper_lowprofile/sniper_lowprofile@4x.png';
import sniperLowprofileAvailableIcon from '../icons/abilities/sniper_lowprofile/sniper_lowprofile@4x_available.png';
import sniperLowprofileDisabledIcon from '../icons/abilities/sniper_lowprofile/sniper_lowprofile@4x_disabled.png';
import sniperOpportunistOriginalIcon from '../icons/abilities/sniper_opportunist/sniper_opportunist@4x.png';
import sniperOpportunistAvailableIcon from '../icons/abilities/sniper_opportunist/sniper_opportunist@4x_available.png';
import sniperOpportunistDisabledIcon from '../icons/abilities/sniper_opportunist/sniper_opportunist@4x_disabled.png';
import sniperSnapshotOriginalIcon from '../icons/abilities/sniper_snapshot/sniper_snapshot@4x.png';
import sniperSnapshotAvailableIcon from '../icons/abilities/sniper_snapshot/sniper_snapshot@4x_available.png';
import sniperSnapshotDisabledIcon from '../icons/abilities/sniper_snapshot/sniper_snapshot@4x_disabled.png';
import sniperSquadsightOriginalIcon from '../icons/abilities/sniper_squadsight/sniper_squadsight@4x.png';
import sniperSquadsightAvailableIcon from '../icons/abilities/sniper_squadsight/sniper_squadsight@4x_available.png';
import sniperSquadsightDisabledIcon from '../icons/abilities/sniper_squadsight/sniper_squadsight@4x_disabled.png';
import starAOriginalIcon from '../icons/abilities/star_a/star_a@4x.png';
import starAAvailableIcon from '../icons/abilities/star_a/star_a@4x_available.png';
import starADisabledIcon from '../icons/abilities/star_a/star_a@4x_disabled.png';
import starBOriginalIcon from '../icons/abilities/star_b/star_b@4x.png';
import starBAvailableIcon from '../icons/abilities/star_b/star_b@4x_available.png';
import starBDisabledIcon from '../icons/abilities/star_b/star_b@4x_disabled.png';
import supportCombatdrugsOriginalIcon from '../icons/abilities/support_combatdrugs/support_combatdrugs@4x.png';
import supportCombatdrugsAvailableIcon from '../icons/abilities/support_combatdrugs/support_combatdrugs@4x_available.png';
import supportCombatdrugsDisabledIcon from '../icons/abilities/support_combatdrugs/support_combatdrugs@4x_disabled.png';
import supportDeeppocketsOriginalIcon from '../icons/abilities/support_deeppockets/support_deeppockets@4x.png';
import supportDeeppocketsAvailableIcon from '../icons/abilities/support_deeppockets/support_deeppockets@4x_available.png';
import supportDeeppocketsDisabledIcon from '../icons/abilities/support_deeppockets/support_deeppockets@4x_disabled.png';
import supportDensesmokeOriginalIcon from '../icons/abilities/support_densesmoke/support_densesmoke@4x.png';
import supportDensesmokeAvailableIcon from '../icons/abilities/support_densesmoke/support_densesmoke@4x_available.png';
import supportDensesmokeDisabledIcon from '../icons/abilities/support_densesmoke/support_densesmoke@4x_disabled.png';
import supportFieldmedicOriginalIcon from '../icons/abilities/support_fieldmedic/support_fieldmedic@4x.png';
import supportFieldmedicAvailableIcon from '../icons/abilities/support_fieldmedic/support_fieldmedic@4x_available.png';
import supportFieldmedicDisabledIcon from '../icons/abilities/support_fieldmedic/support_fieldmedic@4x_disabled.png';
import supportReviveOriginalIcon from '../icons/abilities/support_revive/support_revive@4x.png';
import supportReviveAvailableIcon from '../icons/abilities/support_revive/support_revive@4x_available.png';
import supportReviveDisabledIcon from '../icons/abilities/support_revive/support_revive@4x_disabled.png';
import supportSaviorOriginalIcon from '../icons/abilities/support_savior/support_savior@4x.png';
import supportSaviorAvailableIcon from '../icons/abilities/support_savior/support_savior@4x_available.png';
import supportSaviorDisabledIcon from '../icons/abilities/support_savior/support_savior@4x_disabled.png';
import supportSentinelOriginalIcon from '../icons/abilities/support_sentinel/support_sentinel@4x.png';
import supportSentinelAvailableIcon from '../icons/abilities/support_sentinel/support_sentinel@4x_available.png';
import supportSentinelDisabledIcon from '../icons/abilities/support_sentinel/support_sentinel@4x_disabled.png';
import supportSmokemirrorsOriginalIcon from '../icons/abilities/support_smokemirrors/support_smokemirrors@4x.png';
import supportSmokemirrorsAvailableIcon from '../icons/abilities/support_smokemirrors/support_smokemirrors@4x_available.png';
import supportSmokemirrorsDisabledIcon from '../icons/abilities/support_smokemirrors/support_smokemirrors@4x_disabled.png';
import supportSprinterOriginalIcon from '../icons/abilities/support_sprinter/support_sprinter@4x.png';
import supportSprinterAvailableIcon from '../icons/abilities/support_sprinter/support_sprinter@4x_available.png';
import supportSprinterDisabledIcon from '../icons/abilities/support_sprinter/support_sprinter@4x_disabled.png';
import urbanCombatBadge2Eu2012OriginalIcon from '../icons/abilities/urban_combat_badge_2_eu2012/urban_combat_badge_2_eu2012@4x.png';
import urbanCombatBadge2Eu2012AvailableIcon from '../icons/abilities/urban_combat_badge_2_eu2012/urban_combat_badge_2_eu2012@4x_available.png';
import urbanCombatBadge2Eu2012DisabledIcon from '../icons/abilities/urban_combat_badge_2_eu2012/urban_combat_badge_2_eu2012@4x_disabled.png';
import urbanDefenseOriginalIcon from '../icons/abilities/urban_defense/urban_defense@4x.png';
import urbanDefenseAvailableIcon from '../icons/abilities/urban_defense/urban_defense@4x_available.png';
import urbanDefenseDisabledIcon from '../icons/abilities/urban_defense/urban_defense@4x_disabled.png';
import geneModAdrenalNeurosympathyGeneModEu2012OriginalIcon from '../icons/gene-mods/adrenal_neurosympathy_gene_mod_eu2012/adrenal_neurosympathy_gene_mod_eu2012@4x.png';
import geneModAdrenalNeurosympathyGeneModEu2012DisabledIcon from '../icons/gene-mods/adrenal_neurosympathy_gene_mod_eu2012/adrenal_neurosympathy_gene_mod_eu2012@4x_disabled.png';
import geneModAdrenalNeurosympathyGeneModEu2012SelectedIcon from '../icons/gene-mods/adrenal_neurosympathy_gene_mod_eu2012/adrenal_neurosympathy_gene_mod_eu2012@4x_selected.png';
import geneModBioelectricSkinGeneModEu2012OriginalIcon from '../icons/gene-mods/bioelectric_skin_gene_mod_eu2012/bioelectric_skin_gene_mod_eu2012@4x.png';
import geneModBioelectricSkinGeneModEu2012DisabledIcon from '../icons/gene-mods/bioelectric_skin_gene_mod_eu2012/bioelectric_skin_gene_mod_eu2012@4x_disabled.png';
import geneModBioelectricSkinGeneModEu2012SelectedIcon from '../icons/gene-mods/bioelectric_skin_gene_mod_eu2012/bioelectric_skin_gene_mod_eu2012@4x_selected.png';
import geneModDefendersMedal2Eu2012OriginalIcon from '../icons/gene-mods/defenders_medal_2_eu2012/defenders_medal_2_eu2012@4x.png';
import geneModDefendersMedal2Eu2012DisabledIcon from '../icons/gene-mods/defenders_medal_2_eu2012/defenders_medal_2_eu2012@4x_disabled.png';
import geneModDefendersMedal2Eu2012SelectedIcon from '../icons/gene-mods/defenders_medal_2_eu2012/defenders_medal_2_eu2012@4x_selected.png';
import geneModDepthPerceptionGeneModEu2012OriginalIcon from '../icons/gene-mods/depth_perception_gene_mod_eu2012/depth_perception_gene_mod_eu2012@4x.png';
import geneModDepthPerceptionGeneModEu2012DisabledIcon from '../icons/gene-mods/depth_perception_gene_mod_eu2012/depth_perception_gene_mod_eu2012@4x_disabled.png';
import geneModDepthPerceptionGeneModEu2012SelectedIcon from '../icons/gene-mods/depth_perception_gene_mod_eu2012/depth_perception_gene_mod_eu2012@4x_selected.png';
import geneModHyperReactivePupilsGeneModEu2012OriginalIcon from '../icons/gene-mods/hyper_reactive_pupils_gene_mod_eu2012/hyper_reactive_pupils_gene_mod_eu2012@4x.png';
import geneModHyperReactivePupilsGeneModEu2012DisabledIcon from '../icons/gene-mods/hyper_reactive_pupils_gene_mod_eu2012/hyper_reactive_pupils_gene_mod_eu2012@4x_disabled.png';
import geneModHyperReactivePupilsGeneModEu2012SelectedIcon from '../icons/gene-mods/hyper_reactive_pupils_gene_mod_eu2012/hyper_reactive_pupils_gene_mod_eu2012@4x_selected.png';
import geneModIronSkinGeneModEu2012OriginalIcon from '../icons/gene-mods/iron_skin_gene_mod_eu2012/iron_skin_gene_mod_eu2012@4x.png';
import geneModIronSkinGeneModEu2012DisabledIcon from '../icons/gene-mods/iron_skin_gene_mod_eu2012/iron_skin_gene_mod_eu2012@4x_disabled.png';
import geneModIronSkinGeneModEu2012SelectedIcon from '../icons/gene-mods/iron_skin_gene_mod_eu2012/iron_skin_gene_mod_eu2012@4x_selected.png';
import geneModLwrRegenesisOriginalIcon from '../icons/gene-mods/lwr_regenesis/lwr_regenesis@4x.png';
import geneModLwrRegenesisDisabledIcon from '../icons/gene-mods/lwr_regenesis/lwr_regenesis@4x_disabled.png';
import geneModLwrRegenesisSelectedIcon from '../icons/gene-mods/lwr_regenesis/lwr_regenesis@4x_selected.png';
import geneModMuscleFiberDensityGeneModEu2012OriginalIcon from '../icons/gene-mods/muscle_fiber_density_gene_mod_eu2012/muscle_fiber_density_gene_mod_eu2012@4x.png';
import geneModMuscleFiberDensityGeneModEu2012DisabledIcon from '../icons/gene-mods/muscle_fiber_density_gene_mod_eu2012/muscle_fiber_density_gene_mod_eu2012@4x_disabled.png';
import geneModMuscleFiberDensityGeneModEu2012SelectedIcon from '../icons/gene-mods/muscle_fiber_density_gene_mod_eu2012/muscle_fiber_density_gene_mod_eu2012@4x_selected.png';
import geneModNeuralDampingGeneModEu2012OriginalIcon from '../icons/gene-mods/neural_damping_gene_mod_eu2012/neural_damping_gene_mod_eu2012@4x.png';
import geneModNeuralDampingGeneModEu2012DisabledIcon from '../icons/gene-mods/neural_damping_gene_mod_eu2012/neural_damping_gene_mod_eu2012@4x_disabled.png';
import geneModNeuralDampingGeneModEu2012SelectedIcon from '../icons/gene-mods/neural_damping_gene_mod_eu2012/neural_damping_gene_mod_eu2012@4x_selected.png';
import geneModSecondaryHeartGeneModEu2012OriginalIcon from '../icons/gene-mods/secondary_heart_gene_mod_eu2012/secondary_heart_gene_mod_eu2012@4x.png';
import geneModSecondaryHeartGeneModEu2012DisabledIcon from '../icons/gene-mods/secondary_heart_gene_mod_eu2012/secondary_heart_gene_mod_eu2012@4x_disabled.png';
import geneModSecondaryHeartGeneModEu2012SelectedIcon from '../icons/gene-mods/secondary_heart_gene_mod_eu2012/secondary_heart_gene_mod_eu2012@4x_selected.png';
import psionicBurnDisabledIcon from '../icons/psionic/burn/burn@4x_disabled.png';
import psionicBurnSelectedIcon from '../icons/psionic/burn/burn@4x_selected.png';
import psionicLwrKineticBlastDisabledIcon from '../icons/psionic/lwr_kinetic_blast/lwr_kinetic_blast@4x_disabled.png';
import psionicLwrKineticBlastSelectedIcon from '../icons/psionic/lwr_kinetic_blast/lwr_kinetic_blast@4x_selected.png';
import psionicLwrPsiMasteryDisabledIcon from '../icons/psionic/lwr_psi_mastery/lwr_psi_mastery@4x_disabled.png';
import psionicLwrPsiMasterySelectedIcon from '../icons/psionic/lwr_psi_mastery/lwr_psi_mastery@4x_selected.png';
import psionicMindmergeTga2DisabledIcon from '../icons/psionic/mindmerge_tga2/mindmerge_tga2@4x_disabled.png';
import psionicMindmergeTga2SelectedIcon from '../icons/psionic/mindmerge_tga2/mindmerge_tga2@4x_selected.png';
import psionicNeuralfeedbackTga2DisabledIcon from '../icons/psionic/neuralfeedback_tga2/neuralfeedback_tga2@4x_disabled.png';
import psionicNeuralfeedbackTga2SelectedIcon from '../icons/psionic/neuralfeedback_tga2/neuralfeedback_tga2@4x_selected.png';
import psionicPsiInspirationTga2DisabledIcon from '../icons/psionic/psi_inspiration_tga2/psi_inspiration_tga2@4x_disabled.png';
import psionicPsiInspirationTga2SelectedIcon from '../icons/psionic/psi_inspiration_tga2/psi_inspiration_tga2@4x_selected.png';
import psionicPsiMindfrayTga2DisabledIcon from '../icons/psionic/psi_mindfray_tga2/psi_mindfray_tga2@4x_disabled.png';
import psionicPsiMindfrayTga2SelectedIcon from '../icons/psionic/psi_mindfray_tga2/psi_mindfray_tga2@4x_selected.png';
import psionicPsiPanicTga2DisabledIcon from '../icons/psionic/psi_panic_tga2/psi_panic_tga2@4x_disabled.png';
import psionicPsiPanicTga2SelectedIcon from '../icons/psionic/psi_panic_tga2/psi_panic_tga2@4x_selected.png';
import psionicPsiTelekineticfieldTga2DisabledIcon from '../icons/psionic/psi_telekineticfield_tga2/psi_telekineticfield_tga2@4x_disabled.png';
import psionicPsiTelekineticfieldTga2SelectedIcon from '../icons/psionic/psi_telekineticfield_tga2/psi_telekineticfield_tga2@4x_selected.png';

const aceHoleIcon: AbilityIcon = { selected: aceHoleOriginalIcon, available: aceHoleAvailableIcon, disabled: aceHoleDisabledIcon };
const alienBullrushIcon: AbilityIcon = { selected: alienBullrushOriginalIcon, available: alienBullrushAvailableIcon, disabled: alienBullrushDisabledIcon };
const alienRepairIcon: AbilityIcon = { selected: alienRepairOriginalIcon, available: alienRepairAvailableIcon, disabled: alienRepairDisabledIcon };
const assaultAggressionIcon: AbilityIcon = { selected: assaultAggressionOriginalIcon, available: assaultAggressionAvailableIcon, disabled: assaultAggressionDisabledIcon };
const assaultBringthemonIcon: AbilityIcon = { selected: assaultBringthemonOriginalIcon, available: assaultBringthemonAvailableIcon, disabled: assaultBringthemonDisabledIcon };
const assaultClosecombatIcon: AbilityIcon = { selected: assaultClosecombatOriginalIcon, available: assaultClosecombatAvailableIcon, disabled: assaultClosecombatDisabledIcon };
const assaultClosepersonalIcon: AbilityIcon = { selected: assaultClosepersonalOriginalIcon, available: assaultClosepersonalAvailableIcon, disabled: assaultClosepersonalDisabledIcon };
const assaultExtraconditioningIcon: AbilityIcon = { selected: assaultExtraconditioningOriginalIcon, available: assaultExtraconditioningAvailableIcon, disabled: assaultExtraconditioningDisabledIcon };
const assaultKillerinstinctIcon: AbilityIcon = { selected: assaultKillerinstinctOriginalIcon, available: assaultKillerinstinctAvailableIcon, disabled: assaultKillerinstinctDisabledIcon };
const assaultLightningreflexesIcon: AbilityIcon = { selected: assaultLightningreflexesOriginalIcon, available: assaultLightningreflexesAvailableIcon, disabled: assaultLightningreflexesDisabledIcon };
const assaultRapidfireIcon: AbilityIcon = { selected: assaultRapidfireOriginalIcon, available: assaultRapidfireAvailableIcon, disabled: assaultRapidfireDisabledIcon };
const assaultResillienceIcon: AbilityIcon = { selected: assaultResillienceOriginalIcon, available: assaultResillienceAvailableIcon, disabled: assaultResillienceDisabledIcon };
const assaultRungunIcon: AbilityIcon = { selected: assaultRungunOriginalIcon, available: assaultRungunAvailableIcon, disabled: assaultRungunDisabledIcon };
const bombardTgaIcon: AbilityIcon = { selected: bombardTgaOriginalIcon, available: bombardTgaAvailableIcon, disabled: bombardTgaDisabledIcon };
const commandIcon: AbilityIcon = { selected: commandOriginalIcon, available: commandAvailableIcon, disabled: commandDisabledIcon };
const councilMedalOfHonor2Eu2012Icon: AbilityIcon = { selected: councilMedalOfHonor2Eu2012OriginalIcon, available: councilMedalOfHonor2Eu2012AvailableIcon, disabled: councilMedalOfHonor2Eu2012DisabledIcon };
const dazedIcon: AbilityIcon = { selected: dazedOriginalIcon, available: dazedAvailableIcon, disabled: dazedDisabledIcon };
const defendersMedal1Eu2012Icon: AbilityIcon = { selected: defendersMedal1Eu2012OriginalIcon, available: defendersMedal1Eu2012AvailableIcon, disabled: defendersMedal1Eu2012DisabledIcon };
const fireInTheHoleIcon: AbilityIcon = { selected: fireInTheHoleOriginalIcon, available: fireInTheHoleAvailableIcon, disabled: fireInTheHoleDisabledIcon };
const heavyBulletswarmIcon: AbilityIcon = { selected: heavyBulletswarmOriginalIcon, available: heavyBulletswarmAvailableIcon, disabled: heavyBulletswarmDisabledIcon };
const heavyFirerocketIcon: AbilityIcon = { selected: heavyFirerocketOriginalIcon, available: heavyFirerocketAvailableIcon, disabled: heavyFirerocketDisabledIcon };
const heavyGrenadierIcon: AbilityIcon = { selected: heavyGrenadierOriginalIcon, available: heavyGrenadierAvailableIcon, disabled: heavyGrenadierDisabledIcon };
const heavyHeatAmmoIcon: AbilityIcon = { selected: heavyHeatAmmoOriginalIcon, available: heavyHeatAmmoAvailableIcon, disabled: heavyHeatAmmoDisabledIcon };
const heavyHoloIcon: AbilityIcon = { selected: heavyHoloOriginalIcon, available: heavyHoloAvailableIcon, disabled: heavyHoloDisabledIcon };
const heavyMayhemIcon: AbilityIcon = { selected: heavyMayhemOriginalIcon, available: heavyMayhemAvailableIcon, disabled: heavyMayhemDisabledIcon };
const heavyRapidreactionIcon: AbilityIcon = { selected: heavyRapidreactionOriginalIcon, available: heavyRapidreactionAvailableIcon, disabled: heavyRapidreactionDisabledIcon };
const heavySuppressionIcon: AbilityIcon = { selected: heavySuppressionOriginalIcon, available: heavySuppressionAvailableIcon, disabled: heavySuppressionDisabledIcon };
const heavyWilltosurviveIcon: AbilityIcon = { selected: heavyWilltosurviveOriginalIcon, available: heavyWilltosurviveAvailableIcon, disabled: heavyWilltosurviveDisabledIcon };
const honorAIcon: AbilityIcon = { selected: honorAOriginalIcon, available: honorAAvailableIcon, disabled: honorADisabledIcon };
const itzIconIcon: AbilityIcon = { selected: itzIconOriginalIcon, available: itzIconAvailableIcon, disabled: itzIconDisabledIcon };
const leadbyexampleIcon: AbilityIcon = { selected: leadbyexampleOriginalIcon, available: leadbyexampleAvailableIcon, disabled: leadbyexampleDisabledIcon };
const lwrAceIcon: AbilityIcon = { selected: lwrAceOriginalIcon, available: lwrAceAvailableIcon, disabled: lwrAceDisabledIcon };
const lwrAcidTechIcon: AbilityIcon = { selected: lwrAcidTechOriginalIcon, available: lwrAcidTechAvailableIcon, disabled: lwrAcidTechDisabledIcon };
const lwrBlastIcon: AbilityIcon = { selected: lwrBlastOriginalIcon, available: lwrBlastAvailableIcon, disabled: lwrBlastDisabledIcon };
const lwrBrawlerIcon: AbilityIcon = { selected: lwrBrawlerOriginalIcon, available: lwrBrawlerAvailableIcon, disabled: lwrBrawlerDisabledIcon };
const lwrBreacherIcon: AbilityIcon = { selected: lwrBreacherOriginalIcon, available: lwrBreacherAvailableIcon, disabled: lwrBreacherDisabledIcon };
const lwrBullseyeIcon: AbilityIcon = { selected: lwrBullseyeOriginalIcon, available: lwrBullseyeAvailableIcon, disabled: lwrBullseyeDisabledIcon };
const lwrCriticalSystemTargetingIcon: AbilityIcon = { selected: lwrCriticalSystemTargetingOriginalIcon, available: lwrCriticalSystemTargetingAvailableIcon, disabled: lwrCriticalSystemTargetingDisabledIcon };
const lwrDampeningShieldIcon: AbilityIcon = { selected: lwrDampeningShieldOriginalIcon, available: lwrDampeningShieldAvailableIcon, disabled: lwrDampeningShieldDisabledIcon };
const lwrDashAndBashIcon: AbilityIcon = { selected: lwrDashAndBashOriginalIcon, available: lwrDashAndBashAvailableIcon, disabled: lwrDashAndBashDisabledIcon };
const lwrFirebaseIcon: AbilityIcon = { selected: lwrFirebaseOriginalIcon, available: lwrFirebaseAvailableIcon, disabled: lwrFirebaseDisabledIcon };
const lwrFragmentationIcon: AbilityIcon = { selected: lwrFragmentationOriginalIcon, available: lwrFragmentationAvailableIcon, disabled: lwrFragmentationDisabledIcon };
const lwrGattlerIcon: AbilityIcon = { selected: lwrGattlerOriginalIcon, available: lwrGattlerAvailableIcon, disabled: lwrGattlerDisabledIcon };
const lwrGuardianIcon: AbilityIcon = { selected: lwrGuardianOriginalIcon, available: lwrGuardianAvailableIcon, disabled: lwrGuardianDisabledIcon };
const lwrHeatWarheadsIcon: AbilityIcon = { selected: lwrHeatWarheadsOriginalIcon, available: lwrHeatWarheadsAvailableIcon, disabled: lwrHeatWarheadsDisabledIcon };
const lwrHitAndRunIcon: AbilityIcon = { selected: lwrHitAndRunOriginalIcon, available: lwrHitAndRunAvailableIcon, disabled: lwrHitAndRunDisabledIcon };
const lwrHunterIcon: AbilityIcon = { selected: lwrHunterOriginalIcon, available: lwrHunterAvailableIcon, disabled: lwrHunterDisabledIcon };
const lwrMagnumIcon: AbilityIcon = { selected: lwrMagnumOriginalIcon, available: lwrMagnumAvailableIcon, disabled: lwrMagnumDisabledIcon };
const lwrOnTheReadyIcon: AbilityIcon = { selected: lwrOnTheReadyOriginalIcon, available: lwrOnTheReadyAvailableIcon, disabled: lwrOnTheReadyDisabledIcon };
const lwrPathfinderIcon: AbilityIcon = { selected: lwrPathfinderOriginalIcon, available: lwrPathfinderAvailableIcon, disabled: lwrPathfinderDisabledIcon };
const lwrPayloadIcon: AbilityIcon = { selected: lwrPayloadOriginalIcon, available: lwrPayloadAvailableIcon, disabled: lwrPayloadDisabledIcon };
const lwrPistoleroIcon: AbilityIcon = { selected: lwrPistoleroOriginalIcon, available: lwrPistoleroAvailableIcon, disabled: lwrPistoleroDisabledIcon };
const lwrPyroIcon: AbilityIcon = { selected: lwrPyroOriginalIcon, available: lwrPyroAvailableIcon, disabled: lwrPyroDisabledIcon };
const lwrRakingFireIcon: AbilityIcon = { selected: lwrRakingFireOriginalIcon, available: lwrRakingFireAvailableIcon, disabled: lwrRakingFireDisabledIcon };
const lwrRapidPincersIcon: AbilityIcon = { selected: lwrRapidPincersOriginalIcon, available: lwrRapidPincersAvailableIcon, disabled: lwrRapidPincersDisabledIcon };
const lwrReconnaissanceIcon: AbilityIcon = { selected: lwrReconnaissanceOriginalIcon, available: lwrReconnaissanceAvailableIcon, disabled: lwrReconnaissanceDisabledIcon };
const lwrRepulsorIcon: AbilityIcon = { selected: lwrRepulsorOriginalIcon, available: lwrRepulsorAvailableIcon, disabled: lwrRepulsorDisabledIcon };
const lwrShockAndAweIcon: AbilityIcon = { selected: lwrShockAndAweOriginalIcon, available: lwrShockAndAweAvailableIcon, disabled: lwrShockAndAweDisabledIcon };
const lwrStayFrostyIcon: AbilityIcon = { selected: lwrStayFrostyOriginalIcon, available: lwrStayFrostyAvailableIcon, disabled: lwrStayFrostyDisabledIcon };
const lwrSurgicalTargetingIcon: AbilityIcon = { selected: lwrSurgicalTargetingOriginalIcon, available: lwrSurgicalTargetingAvailableIcon, disabled: lwrSurgicalTargetingDisabledIcon };
const lwrSustainIcon: AbilityIcon = { selected: lwrSustainOriginalIcon, available: lwrSustainAvailableIcon, disabled: lwrSustainDisabledIcon };
const lwrTandemWarheadsIcon: AbilityIcon = { selected: lwrTandemWarheadsOriginalIcon, available: lwrTandemWarheadsAvailableIcon, disabled: lwrTandemWarheadsDisabledIcon };
const lwrTenaciousDefenseIcon: AbilityIcon = { selected: lwrTenaciousDefenseOriginalIcon, available: lwrTenaciousDefenseAvailableIcon, disabled: lwrTenaciousDefenseDisabledIcon };
const mecAbsortionFieldsIcon: AbilityIcon = { selected: mecAbsortionFieldsOriginalIcon, available: mecAbsortionFieldsAvailableIcon, disabled: mecAbsortionFieldsDisabledIcon };
const mecAdvancedFireControlIcon: AbilityIcon = { selected: mecAdvancedFireControlOriginalIcon, available: mecAdvancedFireControlAvailableIcon, disabled: mecAdvancedFireControlDisabledIcon };
const mecAutomatedThreatAssessmentIcon: AbilityIcon = { selected: mecAutomatedThreatAssessmentOriginalIcon, available: mecAutomatedThreatAssessmentAvailableIcon, disabled: mecAutomatedThreatAssessmentDisabledIcon };
const mecCollateralDamageIcon: AbilityIcon = { selected: mecCollateralDamageOriginalIcon, available: mecCollateralDamageAvailableIcon, disabled: mecCollateralDamageDisabledIcon };
const mecExpandedStorageIcon: AbilityIcon = { selected: mecExpandedStorageOriginalIcon, available: mecExpandedStorageAvailableIcon, disabled: mecExpandedStorageDisabledIcon };
const mecJetBootModuleIcon: AbilityIcon = { selected: mecJetBootModuleOriginalIcon, available: mecJetBootModuleAvailableIcon, disabled: mecJetBootModuleDisabledIcon };
const mecReactiveTargetingSensorsIcon: AbilityIcon = { selected: mecReactiveTargetingSensorsOriginalIcon, available: mecReactiveTargetingSensorsAvailableIcon, disabled: mecReactiveTargetingSensorsDisabledIcon };
const mecRepairServosIcon: AbilityIcon = { selected: mecRepairServosOriginalIcon, available: mecRepairServosAvailableIcon, disabled: mecRepairServosDisabledIcon };
const mecVitalPointTargetingIcon: AbilityIcon = { selected: mecVitalPointTargetingOriginalIcon, available: mecVitalPointTargetingAvailableIcon, disabled: mecVitalPointTargetingDisabledIcon };
const nationAimIcon: AbilityIcon = { selected: nationAimOriginalIcon, available: nationAimAvailableIcon, disabled: nationAimDisabledIcon };
const nationWillIcon: AbilityIcon = { selected: nationWillOriginalIcon, available: nationWillAvailableIcon, disabled: nationWillDisabledIcon };
const onslaughtLwrIcon: AbilityIcon = { selected: onslaughtLwrOriginalIcon, available: onslaughtLwrAvailableIcon, disabled: onslaughtLwrDisabledIcon };
const overdriveIcon: AbilityIcon = { selected: overdriveOriginalIcon, available: overdriveAvailableIcon, disabled: overdriveDisabledIcon };
const pheromonesTgaIcon: AbilityIcon = { selected: pheromonesTgaOriginalIcon, available: pheromonesTgaAvailableIcon, disabled: pheromonesTgaDisabledIcon };
const sentinelModuleIconIcon: AbilityIcon = { selected: sentinelModuleIconOriginalIcon, available: sentinelModuleIconAvailableIcon, disabled: sentinelModuleIconDisabledIcon };
const sniperDggIcon: AbilityIcon = { selected: sniperDggOriginalIcon, available: sniperDggAvailableIcon, disabled: sniperDggDisabledIcon };
const sniperDisablingshotIcon: AbilityIcon = { selected: sniperDisablingshotOriginalIcon, available: sniperDisablingshotAvailableIcon, disabled: sniperDisablingshotDisabledIcon };
const sniperDoubletapIcon: AbilityIcon = { selected: sniperDoubletapOriginalIcon, available: sniperDoubletapAvailableIcon, disabled: sniperDoubletapDisabledIcon };
const sniperExecutionerIcon: AbilityIcon = { selected: sniperExecutionerOriginalIcon, available: sniperExecutionerAvailableIcon, disabled: sniperExecutionerDisabledIcon };
const sniperGunslingerIcon: AbilityIcon = { selected: sniperGunslingerOriginalIcon, available: sniperGunslingerAvailableIcon, disabled: sniperGunslingerDisabledIcon };
const sniperHeadshotIcon: AbilityIcon = { selected: sniperHeadshotOriginalIcon, available: sniperHeadshotAvailableIcon, disabled: sniperHeadshotDisabledIcon };
const sniperLowprofileIcon: AbilityIcon = { selected: sniperLowprofileOriginalIcon, available: sniperLowprofileAvailableIcon, disabled: sniperLowprofileDisabledIcon };
const sniperOpportunistIcon: AbilityIcon = { selected: sniperOpportunistOriginalIcon, available: sniperOpportunistAvailableIcon, disabled: sniperOpportunistDisabledIcon };
const sniperSnapshotIcon: AbilityIcon = { selected: sniperSnapshotOriginalIcon, available: sniperSnapshotAvailableIcon, disabled: sniperSnapshotDisabledIcon };
const sniperSquadsightIcon: AbilityIcon = { selected: sniperSquadsightOriginalIcon, available: sniperSquadsightAvailableIcon, disabled: sniperSquadsightDisabledIcon };
const starAIcon: AbilityIcon = { selected: starAOriginalIcon, available: starAAvailableIcon, disabled: starADisabledIcon };
const starBIcon: AbilityIcon = { selected: starBOriginalIcon, available: starBAvailableIcon, disabled: starBDisabledIcon };
const supportCombatdrugsIcon: AbilityIcon = { selected: supportCombatdrugsOriginalIcon, available: supportCombatdrugsAvailableIcon, disabled: supportCombatdrugsDisabledIcon };
const supportDeeppocketsIcon: AbilityIcon = { selected: supportDeeppocketsOriginalIcon, available: supportDeeppocketsAvailableIcon, disabled: supportDeeppocketsDisabledIcon };
const supportDensesmokeIcon: AbilityIcon = { selected: supportDensesmokeOriginalIcon, available: supportDensesmokeAvailableIcon, disabled: supportDensesmokeDisabledIcon };
const supportFieldmedicIcon: AbilityIcon = { selected: supportFieldmedicOriginalIcon, available: supportFieldmedicAvailableIcon, disabled: supportFieldmedicDisabledIcon };
const supportReviveIcon: AbilityIcon = { selected: supportReviveOriginalIcon, available: supportReviveAvailableIcon, disabled: supportReviveDisabledIcon };
const supportSaviorIcon: AbilityIcon = { selected: supportSaviorOriginalIcon, available: supportSaviorAvailableIcon, disabled: supportSaviorDisabledIcon };
const supportSentinelIcon: AbilityIcon = { selected: supportSentinelOriginalIcon, available: supportSentinelAvailableIcon, disabled: supportSentinelDisabledIcon };
const supportSmokemirrorsIcon: AbilityIcon = { selected: supportSmokemirrorsOriginalIcon, available: supportSmokemirrorsAvailableIcon, disabled: supportSmokemirrorsDisabledIcon };
const supportSprinterIcon: AbilityIcon = { selected: supportSprinterOriginalIcon, available: supportSprinterAvailableIcon, disabled: supportSprinterDisabledIcon };
const urbanCombatBadge2Eu2012Icon: AbilityIcon = { selected: urbanCombatBadge2Eu2012OriginalIcon, available: urbanCombatBadge2Eu2012AvailableIcon, disabled: urbanCombatBadge2Eu2012DisabledIcon };
const urbanDefenseIcon: AbilityIcon = { selected: urbanDefenseOriginalIcon, available: urbanDefenseAvailableIcon, disabled: urbanDefenseDisabledIcon };
const geneModNeuralDampingGeneModEu2012Icon: AbilityIcon = { selected: geneModNeuralDampingGeneModEu2012SelectedIcon, available: geneModNeuralDampingGeneModEu2012OriginalIcon, disabled: geneModNeuralDampingGeneModEu2012DisabledIcon };
const geneModDefendersMedal2Eu2012Icon: AbilityIcon = { selected: geneModDefendersMedal2Eu2012SelectedIcon, available: geneModDefendersMedal2Eu2012OriginalIcon, disabled: geneModDefendersMedal2Eu2012DisabledIcon };
const geneModHyperReactivePupilsGeneModEu2012Icon: AbilityIcon = { selected: geneModHyperReactivePupilsGeneModEu2012SelectedIcon, available: geneModHyperReactivePupilsGeneModEu2012OriginalIcon, disabled: geneModHyperReactivePupilsGeneModEu2012DisabledIcon };
const geneModDepthPerceptionGeneModEu2012Icon: AbilityIcon = { selected: geneModDepthPerceptionGeneModEu2012SelectedIcon, available: geneModDepthPerceptionGeneModEu2012OriginalIcon, disabled: geneModDepthPerceptionGeneModEu2012DisabledIcon };
const geneModSecondaryHeartGeneModEu2012Icon: AbilityIcon = { selected: geneModSecondaryHeartGeneModEu2012SelectedIcon, available: geneModSecondaryHeartGeneModEu2012OriginalIcon, disabled: geneModSecondaryHeartGeneModEu2012DisabledIcon };
const geneModAdrenalNeurosympathyGeneModEu2012Icon: AbilityIcon = { selected: geneModAdrenalNeurosympathyGeneModEu2012SelectedIcon, available: geneModAdrenalNeurosympathyGeneModEu2012OriginalIcon, disabled: geneModAdrenalNeurosympathyGeneModEu2012DisabledIcon };
const geneModBioelectricSkinGeneModEu2012Icon: AbilityIcon = { selected: geneModBioelectricSkinGeneModEu2012SelectedIcon, available: geneModBioelectricSkinGeneModEu2012OriginalIcon, disabled: geneModBioelectricSkinGeneModEu2012DisabledIcon };
const geneModIronSkinGeneModEu2012Icon: AbilityIcon = { selected: geneModIronSkinGeneModEu2012SelectedIcon, available: geneModIronSkinGeneModEu2012OriginalIcon, disabled: geneModIronSkinGeneModEu2012DisabledIcon };
const geneModMuscleFiberDensityGeneModEu2012Icon: AbilityIcon = { selected: geneModMuscleFiberDensityGeneModEu2012SelectedIcon, available: geneModMuscleFiberDensityGeneModEu2012OriginalIcon, disabled: geneModMuscleFiberDensityGeneModEu2012DisabledIcon };
const geneModLwrRegenesisIcon: AbilityIcon = { selected: geneModLwrRegenesisSelectedIcon, available: geneModLwrRegenesisOriginalIcon, disabled: geneModLwrRegenesisDisabledIcon };
const psionicBurnIcon: AbilityIcon = { selected: psionicBurnSelectedIcon, available: psionicBurnDisabledIcon, disabled: psionicBurnDisabledIcon };
const psionicMindmergeTga2Icon: AbilityIcon = { selected: psionicMindmergeTga2SelectedIcon, available: psionicMindmergeTga2DisabledIcon, disabled: psionicMindmergeTga2DisabledIcon };
const psionicNeuralfeedbackTga2Icon: AbilityIcon = { selected: psionicNeuralfeedbackTga2SelectedIcon, available: psionicNeuralfeedbackTga2DisabledIcon, disabled: psionicNeuralfeedbackTga2DisabledIcon };
const psionicLwrKineticBlastIcon: AbilityIcon = { selected: psionicLwrKineticBlastSelectedIcon, available: psionicLwrKineticBlastDisabledIcon, disabled: psionicLwrKineticBlastDisabledIcon };
const psionicPsiInspirationTga2Icon: AbilityIcon = { selected: psionicPsiInspirationTga2SelectedIcon, available: psionicPsiInspirationTga2DisabledIcon, disabled: psionicPsiInspirationTga2DisabledIcon };
const psionicPsiMindfrayTga2Icon: AbilityIcon = { selected: psionicPsiMindfrayTga2SelectedIcon, available: psionicPsiMindfrayTga2DisabledIcon, disabled: psionicPsiMindfrayTga2DisabledIcon };
const psionicPsiPanicTga2Icon: AbilityIcon = { selected: psionicPsiPanicTga2SelectedIcon, available: psionicPsiPanicTga2DisabledIcon, disabled: psionicPsiPanicTga2DisabledIcon };
const psionicPsiTelekineticfieldTga2Icon: AbilityIcon = { selected: psionicPsiTelekineticfieldTga2SelectedIcon, available: psionicPsiTelekineticfieldTga2DisabledIcon, disabled: psionicPsiTelekineticfieldTga2DisabledIcon };
const psionicLwrPsiMasteryIcon: AbilityIcon = { selected: psionicLwrPsiMasterySelectedIcon, available: psionicLwrPsiMasteryDisabledIcon, disabled: psionicLwrPsiMasteryDisabledIcon };

/** Icon variants by ability id. */
export const ABILITY_ICON: DeepReadonly<Record<AbilityId, AbilityIcon>> = {
  'absorption-fields': mecAbsortionFieldsIcon,
  'ace': lwrAceIcon,
  'acid-tech': lwrAcidTechIcon,
  'adrenal-neurosympathy': geneModAdrenalNeurosympathyGeneModEu2012Icon,
  'advanced-perception': geneModHyperReactivePupilsGeneModEu2012Icon,
  'aggression': assaultAggressionIcon,
  'arsenal': mecExpandedStorageIcon,
  'awareness': mecAutomatedThreatAssessmentIcon,
  'blast': lwrBlastIcon,
  'brawler': lwrBrawlerIcon,
  'breacher': lwrBreacherIcon,
  'bring-em-on': assaultBringthemonIcon,
  'bullseye': lwrBullseyeIcon,
  'camaraderie': honorAIcon,
  'close-combat-specialist': assaultClosecombatIcon,
  'close-encounters': assaultClosepersonalIcon,
  'clutch-leadership': nationAimIcon,
  'collateral-damage': mecCollateralDamageIcon,
  'combat-drugs': supportCombatdrugsIcon,
  'combined-arms': fireInTheHoleIcon,
  'command': commandIcon,
  'commanding-officer': leadbyexampleIcon,
  'countercharge': psionicNeuralfeedbackTga2Icon,
  'cover-tactics': urbanDefenseIcon,
  'cover-tenacity': overdriveIcon,
  'critical-system-targeting': lwrCriticalSystemTargetingIcon,
  'dampening-shield': lwrDampeningShieldIcon,
  'dash-and-bash': lwrDashAndBashIcon,
  'dense-smoke': supportDensesmokeIcon,
  'disabling-shot': sniperDisablingshotIcon,
  'double-tap': sniperDoubletapIcon,
  'dual-heart': geneModSecondaryHeartGeneModEu2012Icon,
  'enhanced-metabolism': geneModBioelectricSkinGeneModEu2012Icon,
  'executioner': sniperExecutionerIcon,
  'extra-conditioning': assaultExtraconditioningIcon,
  'fervor': psionicMindmergeTga2Icon,
  'field-medic': supportFieldmedicIcon,
  'fire-rocket': heavyFirerocketIcon,
  'firebase': lwrFirebaseIcon,
  'fortified': assaultResillienceIcon,
  'fragmentation': lwrFragmentationIcon,
  'gattler': lwrGattlerIcon,
  'grenadier': heavyGrenadierIcon,
  'grit': pheromonesTgaIcon,
  'guardian': lwrGuardianIcon,
  'heat-warheads': lwrHeatWarheadsIcon,
  'hit-and-run': lwrHitAndRunIcon,
  'holo-rounds': heavyHoloIcon,
  'hunter': lwrHunterIcon,
  'impact': sniperDggIcon,
  'in-the-zone': itzIconIcon,
  'inner-fire': psionicBurnIcon,
  'iron-skin': geneModIronSkinGeneModEu2012Icon,
  'jetboot-module': mecJetBootModuleIcon,
  'killer-instinct': assaultKillerinstinctIcon,
  'kinetic-blast': psionicLwrKineticBlastIcon,
  'kitted': supportSaviorIcon,
  'light-em-up': heavyBulletswarmIcon,
  'lock-n-load': supportDeeppocketsIcon,
  'lone-wolf': councilMedalOfHonor2Eu2012Icon,
  'low-profile': sniperLowprofileIcon,
  'magnum': lwrMagnumIcon,
  'master-mechanic': alienRepairIcon,
  'mayhem': heavyMayhemIcon,
  'mechanic': sentinelModuleIconIcon,
  'mind-fray': psionicPsiMindfrayTga2Icon,
  'muscle-amp': geneModMuscleFiberDensityGeneModEu2012Icon,
  'natural-leadership': starAIcon,
  'neural-damping': geneModNeuralDampingGeneModEu2012Icon,
  'on-the-ready': lwrOnTheReadyIcon,
  'onslaught': onslaughtLwrIcon,
  'opportunist': sniperOpportunistIcon,
  'pathfinder': lwrPathfinderIcon,
  'payload': lwrPayloadIcon,
  'penetrator': heavyHeatAmmoIcon,
  'pistolero': lwrPistoleroIcon,
  'precision-shot': sniperHeadshotIcon,
  'predictive-tracking': geneModDepthPerceptionGeneModEu2012Icon,
  'psi-inspire': psionicPsiInspirationTga2Icon,
  'psi-mastery': psionicLwrPsiMasteryIcon,
  'psi-panic': psionicPsiPanicTga2Icon,
  'pyro': lwrPyroIcon,
  'raking-fire': lwrRakingFireIcon,
  'ram': alienBullrushIcon,
  'ranger': sniperGunslingerIcon,
  'rapid-fire': assaultRapidfireIcon,
  'rapid-pincers': lwrRapidPincersIcon,
  'reactive-targeting-sensors': mecReactiveTargetingSensorsIcon,
  'ready-for-anything': mecAdvancedFireControlIcon,
  'reconnaissance': lwrReconnaissanceIcon,
  'regenesis': geneModLwrRegenesisIcon,
  'repair': alienRepairIcon,
  'repair-servos': mecRepairServosIcon,
  'repulsor': lwrRepulsorIcon,
  'revive': supportReviveIcon,
  'run-and-gun': assaultRungunIcon,
  'sapper': aceHoleIcon,
  'savior': supportReviveIcon,
  'sentinel': supportSentinelIcon,
  'sentry': heavyRapidreactionIcon,
  'shadowstep': assaultLightningreflexesIcon,
  'sharpshooter': urbanCombatBadge2Eu2012Icon,
  'shock-and-awe': lwrShockAndAweIcon,
  'show-em-the-ropes': dazedIcon,
  'smart-macrophages': geneModDefendersMedal2Eu2012Icon,
  'smoke-and-mirrors': supportSmokemirrorsIcon,
  'snapshot': sniperSnapshotIcon,
  'sprinter': supportSprinterIcon,
  'squadsight': sniperSquadsightIcon,
  'stay-frosty': lwrStayFrostyIcon,
  'steadfast': defendersMedal1Eu2012Icon,
  'strength-in-numbers': nationWillIcon,
  'suppression': heavySuppressionIcon,
  'surgical-targeting': lwrSurgicalTargetingIcon,
  'sustain': lwrSustainIcon,
  'tandem-warheads': lwrTandemWarheadsIcon,
  'telekinetic-field': psionicPsiTelekineticfieldTga2Icon,
  'tenacious-defense': lwrTenaciousDefenseIcon,
  'tinker': bombardTgaIcon,
  'tricks-of-the-trade': starBIcon,
  'vital-point-targeting': mecVitalPointTargetingIcon,
  'will-to-survive': heavyWilltosurviveIcon,
};
