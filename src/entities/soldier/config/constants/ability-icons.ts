import type { DeepReadonly } from '@shared/lib/object';

import type { AbilityIcon, AbilityId } from '../../model/abilities';
import aceHoleOriginalIcon from '../icons/abilities/ace_hole/ace_hole@4x.png';
import aceHoleAvailableIcon from '../icons/abilities/ace_hole/ace_hole@4x_available.png';
import aceHoleDisabledIcon from '../icons/abilities/ace_hole/ace_hole@4x_disabled.png';
import adaptiveBoneMarrowGeneModEu2012OriginalIcon from '../icons/abilities/adaptive_bone_marrow_gene_mod_eu2012/adaptive_bone_marrow_gene_mod_eu2012@4x.png';
import adaptiveBoneMarrowGeneModEu2012AvailableIcon from '../icons/abilities/adaptive_bone_marrow_gene_mod_eu2012/adaptive_bone_marrow_gene_mod_eu2012@4x_available.png';
import adaptiveBoneMarrowGeneModEu2012DisabledIcon from '../icons/abilities/adaptive_bone_marrow_gene_mod_eu2012/adaptive_bone_marrow_gene_mod_eu2012@4x_disabled.png';
import alienBullrushOriginalIcon from '../icons/abilities/alien_bullrush/alien_bullrush@4x.png';
import alienBullrushAvailableIcon from '../icons/abilities/alien_bullrush/alien_bullrush@4x_available.png';
import alienBullrushDisabledIcon from '../icons/abilities/alien_bullrush/alien_bullrush@4x_disabled.png';
import alienClusterbombOriginalIcon from '../icons/abilities/alien_clusterbomb/alien_clusterbomb@4x.png';
import alienClusterbombAvailableIcon from '../icons/abilities/alien_clusterbomb/alien_clusterbomb@4x_available.png';
import alienClusterbombDisabledIcon from '../icons/abilities/alien_clusterbomb/alien_clusterbomb@4x_disabled.png';
import alienDeathblossomOriginalIcon from '../icons/abilities/alien_deathblossom/alien_deathblossom@4x.png';
import alienDeathblossomAvailableIcon from '../icons/abilities/alien_deathblossom/alien_deathblossom@4x_available.png';
import alienDeathblossomDisabledIcon from '../icons/abilities/alien_deathblossom/alien_deathblossom@4x_disabled.png';
import alienIntimidateOriginalIcon from '../icons/abilities/alien_intimidate/alien_intimidate@4x.png';
import alienIntimidateAvailableIcon from '../icons/abilities/alien_intimidate/alien_intimidate@4x_available.png';
import alienIntimidateDisabledIcon from '../icons/abilities/alien_intimidate/alien_intimidate@4x_disabled.png';
import alienLaunchOriginalIcon from '../icons/abilities/alien_launch/alien_launch@4x.png';
import alienLaunchAvailableIcon from '../icons/abilities/alien_launch/alien_launch@4x_available.png';
import alienLaunchDisabledIcon from '../icons/abilities/alien_launch/alien_launch@4x_disabled.png';
import alienLeapOriginalIcon from '../icons/abilities/alien_leap/alien_leap@4x.png';
import alienLeapAvailableIcon from '../icons/abilities/alien_leap/alien_leap@4x_available.png';
import alienLeapDisabledIcon from '../icons/abilities/alien_leap/alien_leap@4x_disabled.png';
import alienOverloadOriginalIcon from '../icons/abilities/alien_overload/alien_overload@4x.png';
import alienOverloadAvailableIcon from '../icons/abilities/alien_overload/alien_overload@4x_available.png';
import alienOverloadDisabledIcon from '../icons/abilities/alien_overload/alien_overload@4x_disabled.png';
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
import burnOriginalIcon from '../icons/abilities/burn/burn@4x.png';
import burnAvailableIcon from '../icons/abilities/burn/burn@4x_available.png';
import burnDisabledIcon from '../icons/abilities/burn/burn@4x_disabled.png';
import councilMedalOfHonor2Eu2012OriginalIcon from '../icons/abilities/council_medal_of_honor_2_eu2012/council_medal_of_honor_2_eu2012@4x.png';
import councilMedalOfHonor2Eu2012AvailableIcon from '../icons/abilities/council_medal_of_honor_2_eu2012/council_medal_of_honor_2_eu2012@4x_available.png';
import councilMedalOfHonor2Eu2012DisabledIcon from '../icons/abilities/council_medal_of_honor_2_eu2012/council_medal_of_honor_2_eu2012@4x_disabled.png';
import defendersMedal1Eu2012OriginalIcon from '../icons/abilities/defenders_medal_1_eu2012/defenders_medal_1_eu2012@4x.png';
import defendersMedal1Eu2012AvailableIcon from '../icons/abilities/defenders_medal_1_eu2012/defenders_medal_1_eu2012@4x_available.png';
import defendersMedal1Eu2012DisabledIcon from '../icons/abilities/defenders_medal_1_eu2012/defenders_medal_1_eu2012@4x_disabled.png';
import fireInTheHoleOriginalIcon from '../icons/abilities/fire_in_the_hole/fire_in_the_hole@4x.png';
import fireInTheHoleAvailableIcon from '../icons/abilities/fire_in_the_hole/fire_in_the_hole@4x_available.png';
import fireInTheHoleDisabledIcon from '../icons/abilities/fire_in_the_hole/fire_in_the_hole@4x_disabled.png';
import heavyBulletswarmOriginalIcon from '../icons/abilities/heavy_bulletswarm/heavy_bulletswarm@4x.png';
import heavyBulletswarmAvailableIcon from '../icons/abilities/heavy_bulletswarm/heavy_bulletswarm@4x_available.png';
import heavyBulletswarmDisabledIcon from '../icons/abilities/heavy_bulletswarm/heavy_bulletswarm@4x_disabled.png';
import heavyDangerzoneOriginalIcon from '../icons/abilities/heavy_dangerzone/heavy_dangerzone@4x.png';
import heavyDangerzoneAvailableIcon from '../icons/abilities/heavy_dangerzone/heavy_dangerzone@4x_available.png';
import heavyDangerzoneDisabledIcon from '../icons/abilities/heavy_dangerzone/heavy_dangerzone@4x_disabled.png';
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
import heavyRocketeerOriginalIcon from '../icons/abilities/heavy_rocketeer/heavy_rocketeer@4x.png';
import heavyRocketeerAvailableIcon from '../icons/abilities/heavy_rocketeer/heavy_rocketeer@4x_available.png';
import heavyRocketeerDisabledIcon from '../icons/abilities/heavy_rocketeer/heavy_rocketeer@4x_disabled.png';
import heavySuppressionOriginalIcon from '../icons/abilities/heavy_suppression/heavy_suppression@4x.png';
import heavySuppressionAvailableIcon from '../icons/abilities/heavy_suppression/heavy_suppression@4x_available.png';
import heavySuppressionDisabledIcon from '../icons/abilities/heavy_suppression/heavy_suppression@4x_disabled.png';
import heavyWilltosurviveOriginalIcon from '../icons/abilities/heavy_willtosurvive/heavy_willtosurvive@4x.png';
import heavyWilltosurviveAvailableIcon from '../icons/abilities/heavy_willtosurvive/heavy_willtosurvive@4x_available.png';
import heavyWilltosurviveDisabledIcon from '../icons/abilities/heavy_willtosurvive/heavy_willtosurvive@4x_disabled.png';
import itzIconOriginalIcon from '../icons/abilities/itz_icon/itz_icon@4x.png';
import itzIconAvailableIcon from '../icons/abilities/itz_icon/itz_icon@4x_available.png';
import itzIconDisabledIcon from '../icons/abilities/itz_icon/itz_icon@4x_disabled.png';
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
import mecShockAbsorbentArmorOriginalIcon from '../icons/abilities/mec_shock_absorbent_armor/mec_shock_absorbent_armor@4x.png';
import mecShockAbsorbentArmorAvailableIcon from '../icons/abilities/mec_shock_absorbent_armor/mec_shock_absorbent_armor@4x_available.png';
import mecShockAbsorbentArmorDisabledIcon from '../icons/abilities/mec_shock_absorbent_armor/mec_shock_absorbent_armor@4x_disabled.png';
import mecVitalPointTargetingOriginalIcon from '../icons/abilities/mec_vital_point_targeting/mec_vital_point_targeting@4x.png';
import mecVitalPointTargetingAvailableIcon from '../icons/abilities/mec_vital_point_targeting/mec_vital_point_targeting@4x_available.png';
import mecVitalPointTargetingDisabledIcon from '../icons/abilities/mec_vital_point_targeting/mec_vital_point_targeting@4x_disabled.png';
import onslaughtLwrOriginalIcon from '../icons/abilities/onslaught_lwr/onslaught_lwr@4x.png';
import onslaughtLwrAvailableIcon from '../icons/abilities/onslaught_lwr/onslaught_lwr@4x_available.png';
import onslaughtLwrDisabledIcon from '../icons/abilities/onslaught_lwr/onslaught_lwr@4x_disabled.png';
import pheromonesTgaOriginalIcon from '../icons/abilities/pheromones_tga/pheromones_tga@4x.png';
import pheromonesTgaAvailableIcon from '../icons/abilities/pheromones_tga/pheromones_tga@4x_available.png';
import pheromonesTgaDisabledIcon from '../icons/abilities/pheromones_tga/pheromones_tga@4x_disabled.png';
import reconLwrOriginalIcon from '../icons/abilities/recon_lwr/recon_lwr@4x.png';
import reconLwrAvailableIcon from '../icons/abilities/recon_lwr/recon_lwr@4x_available.png';
import reconLwrDisabledIcon from '../icons/abilities/recon_lwr/recon_lwr@4x_disabled.png';
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
import geneModAdrenalNeurosympathyGeneModEu2012OriginalIcon from '../icons/gene-mods/adrenal_neurosympathy_gene_mod_eu2012/adrenal_neurosympathy_gene_mod_eu2012@4x.png';
import geneModAdrenalNeurosympathyGeneModEu2012DisabledIcon from '../icons/gene-mods/adrenal_neurosympathy_gene_mod_eu2012/adrenal_neurosympathy_gene_mod_eu2012@4x_disabled.png';
import geneModAdrenalNeurosympathyGeneModEu2012SelectedIcon from '../icons/gene-mods/adrenal_neurosympathy_gene_mod_eu2012/adrenal_neurosympathy_gene_mod_eu2012@4x_selected.png';
import geneModBattlefatigueOriginalIcon from '../icons/gene-mods/battlefatigue/battlefatigue@4x.png';
import geneModBattlefatigueDisabledIcon from '../icons/gene-mods/battlefatigue/battlefatigue@4x_disabled.png';
import geneModBattlefatigueSelectedIcon from '../icons/gene-mods/battlefatigue/battlefatigue@4x_selected.png';
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
import psionicMindmergeTga2DisabledIcon from '../icons/psionic/mindmerge_tga2/mindmerge_tga2@4x_disabled.png';
import psionicMindmergeTga2SelectedIcon from '../icons/psionic/mindmerge_tga2/mindmerge_tga2@4x_selected.png';
import psionicNeuralfeedbackTga2DisabledIcon from '../icons/psionic/neuralfeedback_tga2/neuralfeedback_tga2@4x_disabled.png';
import psionicNeuralfeedbackTga2SelectedIcon from '../icons/psionic/neuralfeedback_tga2/neuralfeedback_tga2@4x_selected.png';
import psionicPsiDrainTga2DisabledIcon from '../icons/psionic/psi_drain_tga2/psi_drain_tga2@4x_disabled.png';
import psionicPsiDrainTga2SelectedIcon from '../icons/psionic/psi_drain_tga2/psi_drain_tga2@4x_selected.png';
import psionicPsiInspirationTga2DisabledIcon from '../icons/psionic/psi_inspiration_tga2/psi_inspiration_tga2@4x_disabled.png';
import psionicPsiInspirationTga2SelectedIcon from '../icons/psionic/psi_inspiration_tga2/psi_inspiration_tga2@4x_selected.png';
import psionicPsiMindfrayTga2DisabledIcon from '../icons/psionic/psi_mindfray_tga2/psi_mindfray_tga2@4x_disabled.png';
import psionicPsiMindfrayTga2SelectedIcon from '../icons/psionic/psi_mindfray_tga2/psi_mindfray_tga2@4x_selected.png';
import psionicPsiPanicTga2DisabledIcon from '../icons/psionic/psi_panic_tga2/psi_panic_tga2@4x_disabled.png';
import psionicPsiPanicTga2SelectedIcon from '../icons/psionic/psi_panic_tga2/psi_panic_tga2@4x_selected.png';
import psionicPsiTelekineticfieldTga2DisabledIcon from '../icons/psionic/psi_telekineticfield_tga2/psi_telekineticfield_tga2@4x_disabled.png';
import psionicPsiTelekineticfieldTga2SelectedIcon from '../icons/psionic/psi_telekineticfield_tga2/psi_telekineticfield_tga2@4x_selected.png';
import psionicPsimindcontrolDisabledIcon from '../icons/psionic/psimindcontrol/psimindcontrol@4x_disabled.png';
import psionicPsimindcontrolSelectedIcon from '../icons/psionic/psimindcontrol/psimindcontrol@4x_selected.png';

const aceHoleIcon: AbilityIcon = { selected: aceHoleOriginalIcon, available: aceHoleAvailableIcon, disabled: aceHoleDisabledIcon };
const adaptiveBoneMarrowGeneModEu2012Icon: AbilityIcon = { selected: adaptiveBoneMarrowGeneModEu2012OriginalIcon, available: adaptiveBoneMarrowGeneModEu2012AvailableIcon, disabled: adaptiveBoneMarrowGeneModEu2012DisabledIcon };
const alienBullrushIcon: AbilityIcon = { selected: alienBullrushOriginalIcon, available: alienBullrushAvailableIcon, disabled: alienBullrushDisabledIcon };
const alienClusterbombIcon: AbilityIcon = { selected: alienClusterbombOriginalIcon, available: alienClusterbombAvailableIcon, disabled: alienClusterbombDisabledIcon };
const alienDeathblossomIcon: AbilityIcon = { selected: alienDeathblossomOriginalIcon, available: alienDeathblossomAvailableIcon, disabled: alienDeathblossomDisabledIcon };
const alienIntimidateIcon: AbilityIcon = { selected: alienIntimidateOriginalIcon, available: alienIntimidateAvailableIcon, disabled: alienIntimidateDisabledIcon };
const alienLaunchIcon: AbilityIcon = { selected: alienLaunchOriginalIcon, available: alienLaunchAvailableIcon, disabled: alienLaunchDisabledIcon };
const alienLeapIcon: AbilityIcon = { selected: alienLeapOriginalIcon, available: alienLeapAvailableIcon, disabled: alienLeapDisabledIcon };
const alienOverloadIcon: AbilityIcon = { selected: alienOverloadOriginalIcon, available: alienOverloadAvailableIcon, disabled: alienOverloadDisabledIcon };
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
const burnIcon: AbilityIcon = { selected: burnOriginalIcon, available: burnAvailableIcon, disabled: burnDisabledIcon };
const councilMedalOfHonor2Eu2012Icon: AbilityIcon = { selected: councilMedalOfHonor2Eu2012OriginalIcon, available: councilMedalOfHonor2Eu2012AvailableIcon, disabled: councilMedalOfHonor2Eu2012DisabledIcon };
const defendersMedal1Eu2012Icon: AbilityIcon = { selected: defendersMedal1Eu2012OriginalIcon, available: defendersMedal1Eu2012AvailableIcon, disabled: defendersMedal1Eu2012DisabledIcon };
const fireInTheHoleIcon: AbilityIcon = { selected: fireInTheHoleOriginalIcon, available: fireInTheHoleAvailableIcon, disabled: fireInTheHoleDisabledIcon };
const heavyBulletswarmIcon: AbilityIcon = { selected: heavyBulletswarmOriginalIcon, available: heavyBulletswarmAvailableIcon, disabled: heavyBulletswarmDisabledIcon };
const heavyDangerzoneIcon: AbilityIcon = { selected: heavyDangerzoneOriginalIcon, available: heavyDangerzoneAvailableIcon, disabled: heavyDangerzoneDisabledIcon };
const heavyFirerocketIcon: AbilityIcon = { selected: heavyFirerocketOriginalIcon, available: heavyFirerocketAvailableIcon, disabled: heavyFirerocketDisabledIcon };
const heavyGrenadierIcon: AbilityIcon = { selected: heavyGrenadierOriginalIcon, available: heavyGrenadierAvailableIcon, disabled: heavyGrenadierDisabledIcon };
const heavyHeatAmmoIcon: AbilityIcon = { selected: heavyHeatAmmoOriginalIcon, available: heavyHeatAmmoAvailableIcon, disabled: heavyHeatAmmoDisabledIcon };
const heavyHoloIcon: AbilityIcon = { selected: heavyHoloOriginalIcon, available: heavyHoloAvailableIcon, disabled: heavyHoloDisabledIcon };
const heavyMayhemIcon: AbilityIcon = { selected: heavyMayhemOriginalIcon, available: heavyMayhemAvailableIcon, disabled: heavyMayhemDisabledIcon };
const heavyRapidreactionIcon: AbilityIcon = { selected: heavyRapidreactionOriginalIcon, available: heavyRapidreactionAvailableIcon, disabled: heavyRapidreactionDisabledIcon };
const heavyRocketeerIcon: AbilityIcon = { selected: heavyRocketeerOriginalIcon, available: heavyRocketeerAvailableIcon, disabled: heavyRocketeerDisabledIcon };
const heavySuppressionIcon: AbilityIcon = { selected: heavySuppressionOriginalIcon, available: heavySuppressionAvailableIcon, disabled: heavySuppressionDisabledIcon };
const heavyWilltosurviveIcon: AbilityIcon = { selected: heavyWilltosurviveOriginalIcon, available: heavyWilltosurviveAvailableIcon, disabled: heavyWilltosurviveDisabledIcon };
const itzIconIcon: AbilityIcon = { selected: itzIconOriginalIcon, available: itzIconAvailableIcon, disabled: itzIconDisabledIcon };
const mecAbsortionFieldsIcon: AbilityIcon = { selected: mecAbsortionFieldsOriginalIcon, available: mecAbsortionFieldsAvailableIcon, disabled: mecAbsortionFieldsDisabledIcon };
const mecAdvancedFireControlIcon: AbilityIcon = { selected: mecAdvancedFireControlOriginalIcon, available: mecAdvancedFireControlAvailableIcon, disabled: mecAdvancedFireControlDisabledIcon };
const mecAutomatedThreatAssessmentIcon: AbilityIcon = { selected: mecAutomatedThreatAssessmentOriginalIcon, available: mecAutomatedThreatAssessmentAvailableIcon, disabled: mecAutomatedThreatAssessmentDisabledIcon };
const mecCollateralDamageIcon: AbilityIcon = { selected: mecCollateralDamageOriginalIcon, available: mecCollateralDamageAvailableIcon, disabled: mecCollateralDamageDisabledIcon };
const mecExpandedStorageIcon: AbilityIcon = { selected: mecExpandedStorageOriginalIcon, available: mecExpandedStorageAvailableIcon, disabled: mecExpandedStorageDisabledIcon };
const mecJetBootModuleIcon: AbilityIcon = { selected: mecJetBootModuleOriginalIcon, available: mecJetBootModuleAvailableIcon, disabled: mecJetBootModuleDisabledIcon };
const mecReactiveTargetingSensorsIcon: AbilityIcon = { selected: mecReactiveTargetingSensorsOriginalIcon, available: mecReactiveTargetingSensorsAvailableIcon, disabled: mecReactiveTargetingSensorsDisabledIcon };
const mecRepairServosIcon: AbilityIcon = { selected: mecRepairServosOriginalIcon, available: mecRepairServosAvailableIcon, disabled: mecRepairServosDisabledIcon };
const mecShockAbsorbentArmorIcon: AbilityIcon = { selected: mecShockAbsorbentArmorOriginalIcon, available: mecShockAbsorbentArmorAvailableIcon, disabled: mecShockAbsorbentArmorDisabledIcon };
const mecVitalPointTargetingIcon: AbilityIcon = { selected: mecVitalPointTargetingOriginalIcon, available: mecVitalPointTargetingAvailableIcon, disabled: mecVitalPointTargetingDisabledIcon };
const onslaughtLwrIcon: AbilityIcon = { selected: onslaughtLwrOriginalIcon, available: onslaughtLwrAvailableIcon, disabled: onslaughtLwrDisabledIcon };
const pheromonesTgaIcon: AbilityIcon = { selected: pheromonesTgaOriginalIcon, available: pheromonesTgaAvailableIcon, disabled: pheromonesTgaDisabledIcon };
const reconLwrIcon: AbilityIcon = { selected: reconLwrOriginalIcon, available: reconLwrAvailableIcon, disabled: reconLwrDisabledIcon };
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
const geneModNeuralDampingGeneModEu2012Icon: AbilityIcon = { selected: geneModNeuralDampingGeneModEu2012SelectedIcon, available: geneModNeuralDampingGeneModEu2012OriginalIcon, disabled: geneModNeuralDampingGeneModEu2012DisabledIcon };
const geneModDefendersMedal2Eu2012Icon: AbilityIcon = { selected: geneModDefendersMedal2Eu2012SelectedIcon, available: geneModDefendersMedal2Eu2012OriginalIcon, disabled: geneModDefendersMedal2Eu2012DisabledIcon };
const geneModHyperReactivePupilsGeneModEu2012Icon: AbilityIcon = { selected: geneModHyperReactivePupilsGeneModEu2012SelectedIcon, available: geneModHyperReactivePupilsGeneModEu2012OriginalIcon, disabled: geneModHyperReactivePupilsGeneModEu2012DisabledIcon };
const geneModDepthPerceptionGeneModEu2012Icon: AbilityIcon = { selected: geneModDepthPerceptionGeneModEu2012SelectedIcon, available: geneModDepthPerceptionGeneModEu2012OriginalIcon, disabled: geneModDepthPerceptionGeneModEu2012DisabledIcon };
const geneModSecondaryHeartGeneModEu2012Icon: AbilityIcon = { selected: geneModSecondaryHeartGeneModEu2012SelectedIcon, available: geneModSecondaryHeartGeneModEu2012OriginalIcon, disabled: geneModSecondaryHeartGeneModEu2012DisabledIcon };
const geneModAdrenalNeurosympathyGeneModEu2012Icon: AbilityIcon = { selected: geneModAdrenalNeurosympathyGeneModEu2012SelectedIcon, available: geneModAdrenalNeurosympathyGeneModEu2012OriginalIcon, disabled: geneModAdrenalNeurosympathyGeneModEu2012DisabledIcon };
const geneModBioelectricSkinGeneModEu2012Icon: AbilityIcon = { selected: geneModBioelectricSkinGeneModEu2012SelectedIcon, available: geneModBioelectricSkinGeneModEu2012OriginalIcon, disabled: geneModBioelectricSkinGeneModEu2012DisabledIcon };
const geneModIronSkinGeneModEu2012Icon: AbilityIcon = { selected: geneModIronSkinGeneModEu2012SelectedIcon, available: geneModIronSkinGeneModEu2012OriginalIcon, disabled: geneModIronSkinGeneModEu2012DisabledIcon };
const geneModMuscleFiberDensityGeneModEu2012Icon: AbilityIcon = { selected: geneModMuscleFiberDensityGeneModEu2012SelectedIcon, available: geneModMuscleFiberDensityGeneModEu2012OriginalIcon, disabled: geneModMuscleFiberDensityGeneModEu2012DisabledIcon };
const geneModBattlefatigueIcon: AbilityIcon = { selected: geneModBattlefatigueSelectedIcon, available: geneModBattlefatigueOriginalIcon, disabled: geneModBattlefatigueDisabledIcon };
const psionicBurnIcon: AbilityIcon = { selected: psionicBurnSelectedIcon, available: psionicBurnDisabledIcon, disabled: psionicBurnDisabledIcon };
const psionicMindmergeTga2Icon: AbilityIcon = { selected: psionicMindmergeTga2SelectedIcon, available: psionicMindmergeTga2DisabledIcon, disabled: psionicMindmergeTga2DisabledIcon };
const psionicNeuralfeedbackTga2Icon: AbilityIcon = { selected: psionicNeuralfeedbackTga2SelectedIcon, available: psionicNeuralfeedbackTga2DisabledIcon, disabled: psionicNeuralfeedbackTga2DisabledIcon };
const psionicPsiDrainTga2Icon: AbilityIcon = { selected: psionicPsiDrainTga2SelectedIcon, available: psionicPsiDrainTga2DisabledIcon, disabled: psionicPsiDrainTga2DisabledIcon };
const psionicPsiInspirationTga2Icon: AbilityIcon = { selected: psionicPsiInspirationTga2SelectedIcon, available: psionicPsiInspirationTga2DisabledIcon, disabled: psionicPsiInspirationTga2DisabledIcon };
const psionicPsiMindfrayTga2Icon: AbilityIcon = { selected: psionicPsiMindfrayTga2SelectedIcon, available: psionicPsiMindfrayTga2DisabledIcon, disabled: psionicPsiMindfrayTga2DisabledIcon };
const psionicPsiPanicTga2Icon: AbilityIcon = { selected: psionicPsiPanicTga2SelectedIcon, available: psionicPsiPanicTga2DisabledIcon, disabled: psionicPsiPanicTga2DisabledIcon };
const psionicPsiTelekineticfieldTga2Icon: AbilityIcon = { selected: psionicPsiTelekineticfieldTga2SelectedIcon, available: psionicPsiTelekineticfieldTga2DisabledIcon, disabled: psionicPsiTelekineticfieldTga2DisabledIcon };
const psionicPsimindcontrolIcon: AbilityIcon = { selected: psionicPsimindcontrolSelectedIcon, available: psionicPsimindcontrolDisabledIcon, disabled: psionicPsimindcontrolDisabledIcon };

/** Icon variants by ability id. */
export const ABILITY_ICON: DeepReadonly<Record<AbilityId, AbilityIcon>> = {
  'absorption-fields': mecAbsortionFieldsIcon,
  'ace': sniperHeadshotIcon,
  'acid-tech': bombardTgaIcon,
  'adrenal-neurosympathy': geneModAdrenalNeurosympathyGeneModEu2012Icon,
  'advanced-perception': geneModHyperReactivePupilsGeneModEu2012Icon,
  'aggression': assaultAggressionIcon,
  'arsenal': mecExpandedStorageIcon,
  'awareness': mecAutomatedThreatAssessmentIcon,
  'blast': heavyDangerzoneIcon,
  'brawler': alienIntimidateIcon,
  'breacher': heavyGrenadierIcon,
  'bring-em-on': assaultBringthemonIcon,
  'bullseye': alienBullrushIcon,
  'close-combat-specialist': assaultClosecombatIcon,
  'close-encounters': assaultClosepersonalIcon,
  'collateral-damage': mecCollateralDamageIcon,
  'combat-drugs': supportCombatdrugsIcon,
  'combined-arms': fireInTheHoleIcon,
  'countercharge': psionicNeuralfeedbackTga2Icon,
  'critical-system-targeting': adaptiveBoneMarrowGeneModEu2012Icon,
  'dampening-shield': mecAbsortionFieldsIcon,
  'dash-and-bash': assaultRungunIcon,
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
  'firebase': heavyMayhemIcon,
  'fortified': assaultResillienceIcon,
  'fragmentation': alienClusterbombIcon,
  'gattler': heavyRocketeerIcon,
  'grenadier': heavyGrenadierIcon,
  'grit': pheromonesTgaIcon,
  'guardian': supportSaviorIcon,
  'heat-warheads': heavyHeatAmmoIcon,
  'hit-and-run': alienLeapIcon,
  'holo-rounds': heavyHoloIcon,
  'hunter': alienLaunchIcon,
  'impact': sniperDggIcon,
  'in-the-zone': itzIconIcon,
  'inner-fire': psionicBurnIcon,
  'iron-skin': geneModIronSkinGeneModEu2012Icon,
  'jetboot-module': mecJetBootModuleIcon,
  'killer-instinct': alienDeathblossomIcon,
  'kinetic-blast': psionicPsiDrainTga2Icon,
  'kitted': supportSaviorIcon,
  'light-em-up': heavyBulletswarmIcon,
  'lock-n-load': supportDeeppocketsIcon,
  'lone-wolf': councilMedalOfHonor2Eu2012Icon,
  'low-profile': sniperLowprofileIcon,
  'magnum': heavyMayhemIcon,
  'master-mechanic': alienRepairIcon,
  'mayhem': heavyMayhemIcon,
  'mechanic': sentinelModuleIconIcon,
  'mind-fray': psionicPsiMindfrayTga2Icon,
  'muscle-amp': geneModMuscleFiberDensityGeneModEu2012Icon,
  'neural-damping': geneModNeuralDampingGeneModEu2012Icon,
  'on-the-ready': mecAdvancedFireControlIcon,
  'onslaught': onslaughtLwrIcon,
  'opportunist': sniperOpportunistIcon,
  'pathfinder': supportSprinterIcon,
  'payload': heavyMayhemIcon,
  'penetrator': heavyHeatAmmoIcon,
  'pistolero': assaultClosecombatIcon,
  'precision-shot': sniperHeadshotIcon,
  'predictive-tracking': geneModDepthPerceptionGeneModEu2012Icon,
  'psi-inspire': psionicPsiInspirationTga2Icon,
  'psi-mastery': psionicPsimindcontrolIcon,
  'psi-panic': psionicPsiPanicTga2Icon,
  'pyro': burnIcon,
  'raking-fire': supportSentinelIcon,
  'ram': alienBullrushIcon,
  'ranger': sniperGunslingerIcon,
  'rapid-fire': assaultRapidfireIcon,
  'rapid-pincers': assaultClosepersonalIcon,
  'reactive-targeting-sensors': mecReactiveTargetingSensorsIcon,
  'ready-for-anything': mecAdvancedFireControlIcon,
  'reconnaissance': reconLwrIcon,
  'regenesis': geneModBattlefatigueIcon,
  'repair': alienRepairIcon,
  'repair-servos': mecRepairServosIcon,
  'repulsor': mecShockAbsorbentArmorIcon,
  'revive': supportReviveIcon,
  'run-and-gun': assaultRungunIcon,
  'sapper': aceHoleIcon,
  'savior': supportReviveIcon,
  'sentinel': supportSentinelIcon,
  'sentry': heavyRapidreactionIcon,
  'shadowstep': assaultLightningreflexesIcon,
  'sharpshooter': urbanCombatBadge2Eu2012Icon,
  'shock-and-awe': heavyRocketeerIcon,
  'smart-macrophages': geneModDefendersMedal2Eu2012Icon,
  'smoke-and-mirrors': supportSmokemirrorsIcon,
  'snapshot': sniperSnapshotIcon,
  'sprinter': supportSprinterIcon,
  'squadsight': sniperSquadsightIcon,
  'steadfast': defendersMedal1Eu2012Icon,
  'suppression': heavySuppressionIcon,
  'surgical-targeting': heavyMayhemIcon,
  'sustain': mecExpandedStorageIcon,
  'tandem-warheads': alienOverloadIcon,
  'telekinetic-field': psionicPsiTelekineticfieldTga2Icon,
  'tenacious-defense': assaultKillerinstinctIcon,
  'tinker': bombardTgaIcon,
  'vital-point-targeting': mecVitalPointTargetingIcon,
  'will-to-survive': heavyWilltosurviveIcon,
};
