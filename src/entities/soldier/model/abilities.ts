import type { Ability, AbilityId } from './types';

import aceHoleIcon from '@shared/assets/images/abilities/ace_hole.png';
import adaptiveBoneMarrowGeneModEu2012Icon from '@shared/assets/images/abilities/adaptive_bone_marrow_gene_mod_eu2012.png';
import alienBullrushIcon from '@shared/assets/images/abilities/alien_bullrush.png';
import alienClusterbombIcon from '@shared/assets/images/abilities/alien_clusterbomb.png';
import alienDeathblossomIcon from '@shared/assets/images/abilities/alien_deathblossom.png';
import alienIntimidateIcon from '@shared/assets/images/abilities/alien_intimidate.png';
import alienLeapIcon from '@shared/assets/images/abilities/alien_leap.png';
import alienOverloadIcon from '@shared/assets/images/abilities/alien_overload.png';
import alienRepairIcon from '@shared/assets/images/abilities/alien_repair.png';
import assaultAggressionIcon from '@shared/assets/images/abilities/assault_aggression.png';
import assaultBringthemonIcon from '@shared/assets/images/abilities/assault_bringthemon@4x.png';
import assaultClosecombatIcon from '@shared/assets/images/abilities/assault_closecombat.png';
import assaultClosepersonalIcon from '@shared/assets/images/abilities/assault_closepersonal.png';
import assaultExtraconditioningIcon from '@shared/assets/images/abilities/assault_extraconditioning@4x.png';
import assaultKillerinstinctIcon from '@shared/assets/images/abilities/assault_killerinstinct.png';
import assaultLightningreflexesIcon from '@shared/assets/images/abilities/assault_lightningreflexes@4x.png';
import assaultRapidfireIcon from '@shared/assets/images/abilities/assault_rapidfire.png';
import assaultRungunIcon from '@shared/assets/images/abilities/assault_rungun.png';
import bombardTgaIcon from '@shared/assets/images/abilities/bombard_tga.png';
import councilMedalOfHonor2Eu2012Icon from '@shared/assets/images/abilities/council_medal_of_honor_2_eu2012@4x.png';
import defendersMedal1Eu2012Icon from '@shared/assets/images/abilities/defenders_medal_1_eu2012.png';
import heavyBulletswarmIcon from '@shared/assets/images/abilities/heavy_bulletswarm.png';
import heavyDangerzoneIcon from '@shared/assets/images/abilities/heavy_dangerzone.png';
import heavyFirerocketIcon from '@shared/assets/images/abilities/heavy_firerocket.png';
import heavyGrenadierIcon from '@shared/assets/images/abilities/heavy_grenadier.png';
import heavyHeatAmmoIcon from '@shared/assets/images/abilities/heavy_heat_ammo.png';
import heavyHoloIcon from '@shared/assets/images/abilities/heavy_holo.png';
import heavyMayhemIcon from '@shared/assets/images/abilities/heavy_mayhem@4x.png';
import heavyRocketeerIcon from '@shared/assets/images/abilities/heavy_rocketeer.png';
import heavySuppressionIcon from '@shared/assets/images/abilities/heavy_suppression.png';
import heavyWilltosurviveIcon from '@shared/assets/images/abilities/heavy_willtosurvive.png';
import itzIconIcon from '@shared/assets/images/abilities/itz_icon@4x.png';
import mecAdvancedFireControlIcon from '@shared/assets/images/abilities/mec_advanced_fire_control@4x.png';
import mecExpandedStorageIcon from '@shared/assets/images/abilities/mec_expanded_storage.png';
import mecVitalPointTargetingIcon from '@shared/assets/images/abilities/mec_vital_point_targeting@4x.png';
import pheromonesTgaIcon from '@shared/assets/images/abilities/pheromones_tga.png';
import reconLwrIcon from '@shared/assets/images/abilities/recon_lwr.png';
import sentinelModuleIconIcon from '@shared/assets/images/abilities/sentinel_module_icon.png';
import sniperDggIcon from '@shared/assets/images/abilities/sniper_dgg@4x.png';
import sniperDisablingshotIcon from '@shared/assets/images/abilities/sniper_disablingshot@4x.png';
import sniperDoubletapIcon from '@shared/assets/images/abilities/sniper_doubletap.png';
import sniperExecutionerIcon from '@shared/assets/images/abilities/sniper_executioner@4x.png';
import sniperGunslingerIcon from '@shared/assets/images/abilities/sniper_gunslinger@4x.png';
import sniperHeadshotIcon from '@shared/assets/images/abilities/sniper_headshot@4x.png';
import sniperLowprofileIcon from '@shared/assets/images/abilities/sniper_lowprofile.png';
import sniperOpportunistIcon from '@shared/assets/images/abilities/sniper_opportunist@4x.png';
import sniperSnapshotIcon from '@shared/assets/images/abilities/sniper_snapshot.png';
import sniperSquadsightIcon from '@shared/assets/images/abilities/sniper_squadsight@4x.png';
import supportCombatdrugsIcon from '@shared/assets/images/abilities/support_combatdrugs.png';
import supportDeeppocketsIcon from '@shared/assets/images/abilities/support_deeppockets.png';
import supportDensesmokeIcon from '@shared/assets/images/abilities/support_densesmoke.png';
import supportFieldmedicIcon from '@shared/assets/images/abilities/support_fieldmedic.png';
import supportReviveIcon from '@shared/assets/images/abilities/support_revive.png';
import supportSaviorIcon from '@shared/assets/images/abilities/support_savior.png';
import supportSentinelIcon from '@shared/assets/images/abilities/support_sentinel.png';
import supportSmokemirrorsIcon from '@shared/assets/images/abilities/support_smokemirrors.png';
import supportSprinterIcon from '@shared/assets/images/abilities/support_sprinter.png';
import urbanCombatBadge2Eu2012Icon from '@shared/assets/images/abilities/urban_combat_badge_2_eu2012@4x.png';

import { ABILITY_ID } from './ability-id';

export const ABILITIES: Record<AbilityId, Ability> = {
  [ABILITY_ID.ACE]: {
    id: ABILITY_ID.ACE,
    name: 'Ace',
    description: 'If this unit has not moved, the first standard shot costs 0 AP. Grants +1 small equipment slots.',
    icon: sniperHeadshotIcon,
  },
  [ABILITY_ID.ACID_TECH]: {
    id: ABILITY_ID.ACID_TECH,
    name: 'Acid Tech',
    description: 'Acid grenades/spit damage armor on impact equal to 25% of armor HP (max 5, bypasses DR). Shots gain a 35% chance (100% if steadied) to apply corrosion.',
    icon: bombardTgaIcon,
  },
  [ABILITY_ID.AGGRESSION]: {
    id: ABILITY_ID.AGGRESSION,
    name: 'Aggression',
    description: 'Shots gain +10% crit damage per enemy in sight.',
    icon: assaultAggressionIcon,
  },
  [ABILITY_ID.BLAST]: {
    id: ABILITY_ID.BLAST,
    name: 'Blast',
    description: 'Grants +20% radius and +1 damage to explosives. Does not affect Gravity Mines.',
    icon: heavyDangerzoneIcon,
  },
  [ABILITY_ID.BRAWLER]: {
    id: ABILITY_ID.BRAWLER,
    name: 'Brawler',
    description: 'While idle: Melee attacks graze (dealing only half of the original damage) and, if undamaged this turn, incoming shots within 4 tiles also graze.',
    icon: alienIntimidateIcon,
  },
  [ABILITY_ID.BREACHER]: {
    id: ABILITY_ID.BREACHER,
    name: 'Breacher',
    description: 'The first grenade use each turn costs 0 AP but reduces mobility to 3.3 tiles until it has no AP remaining or the end of the turn. This soldier\'s grenades do not damage this soldier and gain +70% weapon damage but have -70% range. Equipped grenades receive an additional use and have no weight.',
    icon: heavyGrenadierIcon,
  },
  [ABILITY_ID.BRING_EM_ON]: {
    id: ABILITY_ID.BRING_EM_ON,
    name: 'Bring \'Em On',
    description: 'This unit gains +0.5 damage on standard shots and incoming non-psionic attacks have a +5% graze chance for each enemy in sight.',
    icon: assaultBringthemonIcon,
  },
  [ABILITY_ID.BULLSEYE]: {
    id: ABILITY_ID.BULLSEYE,
    name: 'Bullseye',
    description: 'Grants +20 aim, +20 crit, +20% crit dmg, and +20 pen to shots fired at 2AP or shots at preoccupied targets (double if both). Grants +1 ammo to primary weapons.',
    icon: alienBullrushIcon,
  },
  [ABILITY_ID.CLOSE_ENCOUNTERS]: {
    id: ABILITY_ID.CLOSE_ENCOUNTERS,
    name: 'Close Encounters',
    description: 'The first standard shot against an enemy within 4 tiles will leave this unit with 1 AP but reduces mobility to 3.3 tiles during their next action. Grants immunity to critical hits and reaction fire from enemies within 4 tiles.',
    icon: assaultClosepersonalIcon,
  },
  [ABILITY_ID.COMBAT_DRUGS]: {
    id: ABILITY_ID.COMBAT_DRUGS,
    name: 'Combat Drugs',
    description: 'Smoke grenades grant +25 aim and +15 crit. On detonation, if this unit is in the Area of Effect, they Enrage. Smoke grenades also passively heal 2 HP at the end of the turn. Only affects units that are breathing the smoke. Does not work in dense smoke.',
    icon: supportCombatdrugsIcon,
  },
  [ABILITY_ID.CRITICAL_SYSTEM_TARGETING]: {
    id: ABILITY_ID.CRITICAL_SYSTEM_TARGETING,
    name: 'Critical System Targeting',
    description: 'Shots against autopsied mechanical units deal +30% damage and gain +30 penetration (+60% damage and +60 penetration if steadied). Does not work with Arc Weapons.',
    icon: adaptiveBoneMarrowGeneModEu2012Icon,
  },
  [ABILITY_ID.DENSE_SMOKE]: {
    id: ABILITY_ID.DENSE_SMOKE,
    name: 'Dense Smoke',
    description: 'Smoke grenades grant an additional +20 defense (+50 defense total -- defense affects psi as well).',
    icon: supportDensesmokeIcon,
  },
  [ABILITY_ID.DISABLING_SHOT]: {
    id: ABILITY_ID.DISABLING_SHOT,
    name: 'Disabling Shot',
    description: 'Fire a 0 AP 1 damage shot that disables the target\'s main weapon. Grants +1 ammo to primary weapons. Does not work against mechanical targets (except SHIVs). Cannot be used after activating In The Zone. 3 turn cooldown. Only for Sniper/Strike Rifles.',
    icon: sniperDisablingshotIcon,
  },
  [ABILITY_ID.DOUBLE_TAP]: {
    id: ABILITY_ID.DOUBLE_TAP,
    name: 'Double Tap',
    description: 'Shooting allows this unit to fire an extra shot if not out of ammo or targets. Any follow-up shots (from Double Tap or not) on a previous target this turn gains +20 aim/crit/pen. 1 turn cooldown after 2nd shot is used. Grants +1 ammo to primary weapons.',
    icon: sniperDoubletapIcon,
  },
  [ABILITY_ID.EXECUTIONER]: {
    id: ABILITY_ID.EXECUTIONER,
    name: 'Executioner',
    description: 'Grants +1 damage and +20 aim against targets at or below half HP. Double the effects if using a sidearm.',
    icon: sniperExecutionerIcon,
  },
  [ABILITY_ID.EXTRA_CONDITIONING]: {
    id: ABILITY_ID.EXTRA_CONDITIONING,
    name: 'Extra Conditioning',
    description: 'Grants +2 armor HP and +0.6 mobility, and a 10% chance for all end-in-idle actions to cost 0 AP.',
    icon: assaultExtraconditioningIcon,
  },
  [ABILITY_ID.FIELD_MEDIC]: {
    id: ABILITY_ID.FIELD_MEDIC,
    name: 'Field Medic',
    description: 'Grants 2 medikits. Medikits heal +1 HP when used on an ally. Medikits heal +1 HP when an idle Engineer is within 4 tiles. Stabilization costs 0 AP and no longer consumes a medikit (but still requires one to be available).',
    icon: supportFieldmedicIcon,
  },
  [ABILITY_ID.FIRE_ROCKET]: {
    id: ABILITY_ID.FIRE_ROCKET,
    name: 'Fire Rocket',
    description: 'Grants the ability to use and equip a rocket launcher. Rocket scatter is affected by max base HP. Firing a rocket with 1 AP triples scatter and decreases range by 20%. 2 turn cooldown.',
    icon: heavyFirerocketIcon,
  },
  [ABILITY_ID.FIREBASE]: {
    id: ABILITY_ID.FIREBASE,
    name: 'Firebase',
    description: 'When in partial cover: Steadied shots are not broken by damage and deal +50% base weapon damage. If also adjacent to a SHIV: Gain +20% throw range and automatically Steady Weapon if idle at the end of the turn.',
    icon: heavyMayhemIcon,
  },
  [ABILITY_ID.FRAGMENTATION]: {
    id: ABILITY_ID.FRAGMENTATION,
    name: 'Fragmentation',
    description: 'Explosives critically hit exposed targets and have +50% the chance to cause bleeding.',
    icon: alienClusterbombIcon,
  },
  [ABILITY_ID.GRENADIER]: {
    id: ABILITY_ID.GRENADIER,
    name: 'Grenadier',
    description: 'Using a destructive grenade deals +1 damage and costs only 1 AP. Equipped destructive grenades and MEC launchers receive an additional use and have no weight.',
    icon: heavyGrenadierIcon,
  },
  [ABILITY_ID.GRIT]: {
    id: ABILITY_ID.GRIT,
    name: 'Grit',
    description: 'Grants +4 armor HP and %DR equal to a quarter of the % total HP lost.',
    icon: pheromonesTgaIcon,
  },
  [ABILITY_ID.GUARDIAN]: {
    id: ABILITY_ID.GUARDIAN,
    name: 'Guardian',
    description: 'Grants a free medikit and +1 ammo to primary weapons. Medikits heal +2 HP if not self-applied. If this unit\'s last action was using a medikit, overwatch activates at the end of the turn (except when at risk of triggering reaction fire).',
    icon: supportSaviorIcon,
  },
  [ABILITY_ID.HEAT_WARHEADS]: {
    id: ABILITY_ID.HEAT_WARHEADS,
    name: 'HEAT Warheads',
    description: 'Explosives gain +30 penetration and apply 50% more shred.',
    icon: heavyHeatAmmoIcon,
  },
  [ABILITY_ID.HIT_AND_RUN]: {
    id: ABILITY_ID.HIT_AND_RUN,
    name: 'Hit and Run',
    description: 'The first shot each turn that\'s a Pincer, or that\'s aimed at a preoccupied target, or a unit damaged this turn, leaves you with 1 AP. That point can only be spent on movement, officer, psionic, or non-arm MEC actions (you can\'t fire again).',
    icon: alienLeapIcon,
  },
  [ABILITY_ID.HOLO_ROUNDS]: {
    id: ABILITY_ID.HOLO_ROUNDS,
    name: 'Holo Rounds',
    description: 'Firing at a target holos them for 3 turns [Prevents stealth, incoming shots gain +10 aim and +10 penetration].',
    icon: heavyHoloIcon,
  },
  [ABILITY_ID.IMPACT]: {
    id: ABILITY_ID.IMPACT,
    name: 'Impact',
    description: 'Shots gain +10 penetration. Non-reaction shots disable their target\'s Overwatch and Reactive Targeting Sensors.',
    icon: sniperDggIcon,
  },
  [ABILITY_ID.IN_THE_ZONE]: {
    id: ABILITY_ID.IN_THE_ZONE,
    name: 'In The Zone',
    description: 'Shots gain aim equal to the percent of HP the target is missing. Shooting with a steadied weapon allows this unit to fire chain shots (with a stacking -10 max hit chance) until they run out of ammo or targets. Standard shots (outside an ITZ chain) trigger a free reload.',
    icon: itzIconIcon,
  },
  [ABILITY_ID.KILLER_INSTINCT]: {
    id: ABILITY_ID.KILLER_INSTINCT,
    name: 'Killer Instinct',
    description: 'Grants +30% crit damage.',
    icon: alienDeathblossomIcon,
  },
  [ABILITY_ID.KITTED]: {
    id: ABILITY_ID.KITTED,
    name: 'Kitted',
    description: 'Grants a medikit and a smoke grenade. If this unit does not have a scope, it gains a generic scope (+10 aim). If this unit does not have a plating, it gains a generic plating (+2 armor HP).',
    icon: supportSaviorIcon,
  },
  [ABILITY_ID.LIGHT_EM_UP]: {
    id: ABILITY_ID.LIGHT_EM_UP,
    name: 'Light \'Em Up',
    description: 'Standard shots cost only 1 AP and gain both +5 penetration and +1 damage for each instance of damage their target took this turn.',
    icon: heavyBulletswarmIcon,
  },
  [ABILITY_ID.LOCK_N_LOAD]: {
    id: ABILITY_ID.LOCK_N_LOAD,
    name: 'Lock n\' Load',
    description: 'Reloading any weapon costs only 1 AP and dashing automatically reloads the active weapon.',
    icon: supportDeeppocketsIcon,
  },
  [ABILITY_ID.LONE_WOLF]: {
    id: ABILITY_ID.LONE_WOLF,
    name: 'Lone Wolf',
    description: 'Grants 10 aim, crit, def and crit resist if not within 6 tiles of an allied unit.',
    icon: councilMedalOfHonor2Eu2012Icon,
  },
  [ABILITY_ID.LOW_PROFILE]: {
    id: ABILITY_ID.LOW_PROFILE,
    name: 'Low Profile',
    description: 'Partial cover grants the defense and DR bonus of full cover.',
    icon: sniperLowprofileIcon,
  },
  [ABILITY_ID.MAGNUM]: {
    id: ABILITY_ID.MAGNUM,
    name: 'Magnum',
    description: 'Sniper rifles, strike rifles and pistols gain +50% weapon damage. Standard and Precision shots pass through to enemy units behind the target (up to 24 tiles, non-reaction shots only, not amplified by target modifiers).',
    icon: heavyMayhemIcon,
  },
  [ABILITY_ID.MASTER_MECHANIC]: {
    id: ABILITY_ID.MASTER_MECHANIC,
    name: 'Master Mechanic',
    description: 'Increases the healing of repair by +4 HP and grants an additional use. Explosive shots that hit friendly SHIVs do not damage this soldier. When in partial cover adjacent to a SHIV: Both this unit and the SHIV gain 20% DR.',
    icon: alienRepairIcon,
  },
  [ABILITY_ID.MAYHEM]: {
    id: ABILITY_ID.MAYHEM,
    name: 'Mayhem',
    description: 'Suppression damages enemies immediately with a round of suppressive fire and has its cooldown reduced by 1. Suppressive Fire can cause bleeding.',
    icon: heavyMayhemIcon,
  },
  [ABILITY_ID.MECHANIC]: {
    id: ABILITY_ID.MECHANIC,
    name: 'Mechanic',
    description: 'Grants 2 uses of Repair. Removes corrosion from all adjacent allies after each action. When in partial cover adjacent to a SHIV: Gain Low Profile and when that SHIV takes damage heal the SHIV for 25% of the damage taken (heal only occurs if engineer is idle, steadied, or on overwatch).',
    icon: sentinelModuleIconIcon,
    grants: [ABILITY_ID.REPAIR, ABILITY_ID.LOW_PROFILE],
  },
  [ABILITY_ID.ON_THE_READY]: {
    id: ABILITY_ID.ON_THE_READY,
    name: 'On The Ready',
    description: 'Shots gain +35% base weapon damage if this unit is Steadying or Combat Ready. Non-reaction shots grant Combat Readiness. If this unit\'s last action was a shot or a manual activation of combat readiness, overwatch activates at the end of the turn (except when at risk of triggering reaction fire).',
    icon: mecAdvancedFireControlIcon,
  },
  [ABILITY_ID.OPPORTUNIST]: {
    id: ABILITY_ID.OPPORTUNIST,
    name: 'Opportunist',
    description: 'Reaction shots gain +10 aim and can critically hit.',
    icon: sniperOpportunistIcon,
  },
  [ABILITY_ID.PATHFINDER]: {
    id: ABILITY_ID.PATHFINDER,
    name: 'Pathfinder',
    description: 'Grants +1 battlescanner, +25% crit damage, and +0.6 mobility. If this unit activates enemies while moving, they regain up to 2 AP. Does not apply to covert operatives. Max one activation per turn. Fails if another allied unit acts before the pod finished activating.',
    icon: supportSprinterIcon,
  },
  [ABILITY_ID.PAYLOAD]: {
    id: ABILITY_ID.PAYLOAD,
    name: 'Payload',
    description: 'Grants +30% throw range and +50% weapon damage to explosive grenades.',
    icon: heavyMayhemIcon,
  },
  [ABILITY_ID.PENETRATOR]: {
    id: ABILITY_ID.PENETRATOR,
    name: 'Penetrator',
    description: 'The primary weapon gains +15 penetration.',
    icon: heavyHeatAmmoIcon,
  },
  [ABILITY_ID.PISTOLERO]: {
    id: ABILITY_ID.PISTOLERO,
    name: 'Pistolero',
    description: 'Reaction shots from pistols gain +50% weapon damage, +30 aim, and the ability to crit. If idle at end of turn, draws their pistol. If wielding a pistol, fire a reaction shot at any enemy within 4 tiles that acts. [Pistolero reaction shots bypass half of cover DR/def and require hit chance >30]',
    icon: assaultClosecombatIcon,
  },
  [ABILITY_ID.PRECISION_SHOT]: {
    id: ABILITY_ID.PRECISION_SHOT,
    name: 'Precision Shot',
    description: 'Fire a shot that has no squadsight penalties, +30 aim, and +30 crit. The shot will never graze. 3 turn cooldown. Only for Strike/Sniper Rifles.',
    icon: sniperHeadshotIcon,
  },
  [ABILITY_ID.RAKING_FIRE]: {
    id: ABILITY_ID.RAKING_FIRE,
    name: 'Raking Fire',
    description: 'Fire 2 additional reaction shots during overwatch.',
    icon: supportSentinelIcon,
  },
  [ABILITY_ID.RANGER]: {
    id: ABILITY_ID.RANGER,
    name: 'Ranger',
    description: 'Grants +1 damage to all weapons and equipment, +0.6 mobility, and +10% throw/rocket range. Sidearms additionally gain +50% base weapon damage, +20 aim, and 1 AP reloads.',
    icon: sniperGunslingerIcon,
  },
  [ABILITY_ID.RAPID_FIRE]: {
    id: ABILITY_ID.RAPID_FIRE,
    name: 'Rapid Fire',
    description: 'Fire twice with your primary weapon; accuracy gains above 40% hit chance only contribute half to final hit chance.',
    icon: assaultRapidfireIcon,
  },
  [ABILITY_ID.RAPID_PINCERS]: {
    id: ABILITY_ID.RAPID_PINCERS,
    name: 'Rapid Pincers',
    description: 'Grants Rapid Fire and +0.6 mobility. The first Rapid Fire against a pincered enemy will leave this unit with 1 AP but reduces mobility to 3.3 until out of AP.',
    icon: assaultClosepersonalIcon,
    grants: [ABILITY_ID.RAPID_FIRE],
  },
  [ABILITY_ID.READY_FOR_ANYTHING]: {
    id: ABILITY_ID.READY_FOR_ANYTHING,
    name: 'Ready For Anything',
    description: 'At the end of each turn, if this unit did not move and is not at risk of triggering reaction fire, overwatch activates.',
    icon: mecAdvancedFireControlIcon,
  },
  [ABILITY_ID.RECONNAISSANCE]: {
    id: ABILITY_ID.RECONNAISSANCE,
    name: 'Reconnaissance',
    description: 'Displays information on the nearest aliens that are not hiding after each non-dash move. Provides additional information on sneaking aliens. The first battle scanner used each turn costs 0 AP. Grants a free battle scanner. Grants Low Profile.',
    icon: reconLwrIcon,
    grants: [ABILITY_ID.LOW_PROFILE],
  },
  [ABILITY_ID.REPAIR]: {
    id: ABILITY_ID.REPAIR,
    name: 'Repair',
    description: 'Heal a mechanical unit for 5 HP and remove corrosion.',
    icon: alienRepairIcon,
  },
  [ABILITY_ID.REVIVE]: {
    id: ABILITY_ID.REVIVE,
    name: 'Revive',
    description: 'Bring a stabilized soldier back into action at 33% of their max HP for the cost of 1 medikit and 0 AP.',
    icon: supportReviveIcon,
  },
  [ABILITY_ID.RUN_AND_GUN]: {
    id: ABILITY_ID.RUN_AND_GUN,
    name: 'Run and Gun',
    description: 'Activate to allow shooting or overwatching at 0 AP if the last AP was spent moving. When active: gain +25 crit, +25% crit damage, and immunity to reaction fire, but the AP discount from Close Encounters is disabled. 2 turn cooldown. Cannot activate if out of ammo and does not work with the stun rifle.',
    icon: assaultRungunIcon,
  },
  [ABILITY_ID.SAPPER]: {
    id: ABILITY_ID.SAPPER,
    name: 'Sapper',
    description: 'Explosives deal +1 damage, gain +20 penetration, and double environmental damage.',
    icon: aceHoleIcon,
  },
  [ABILITY_ID.SAVIOR]: {
    id: ABILITY_ID.SAVIOR,
    name: 'Savior',
    description: 'Medikits heal an additional 35% of the target\'s missing HP. Grants +1 small equipment slots. Grants Revive.',
    icon: supportReviveIcon,
    grants: [ABILITY_ID.REVIVE],
  },
  [ABILITY_ID.SENTINEL]: {
    id: ABILITY_ID.SENTINEL,
    name: 'Sentinel',
    description: 'Fire an additional reaction shot and gain +20 defense during overwatch. Grants Opportunist.',
    icon: supportSentinelIcon,
    grants: [ABILITY_ID.OPPORTUNIST],
  },
  [ABILITY_ID.SHADOWSTEP]: {
    id: ABILITY_ID.SHADOWSTEP,
    name: 'Shadowstep',
    description: 'This unit gains +0.6 mobility and does not trigger reaction shots or pursuit when walking (not dashing). After repositioning, shots gain +25% crit damage until next turn.',
    icon: assaultLightningreflexesIcon,
  },
  [ABILITY_ID.SHARPSHOOTER]: {
    id: ABILITY_ID.SHARPSHOOTER,
    name: 'Sharpshooter',
    description: 'All shots gain +15 aim against biological targets. Rapid Fire shots gain +30 aim instead.',
    icon: urbanCombatBadge2Eu2012Icon,
  },
  [ABILITY_ID.SHOCK_AND_AWE]: {
    id: ABILITY_ID.SHOCK_AND_AWE,
    name: 'Shock and Awe',
    description: 'Equipped Javelin rockets gain an additional use. Rockets gain +35% damage. Grants +1 small equipment slots.',
    icon: heavyRocketeerIcon,
  },
  [ABILITY_ID.SMOKE_AND_MIRRORS]: {
    id: ABILITY_ID.SMOKE_AND_MIRRORS,
    name: 'Smoke and Mirrors',
    description: 'Using a support grenade costs only 1 AP and does not trigger reaction shots. Equipped support grenades receive an additional use.',
    icon: supportSmokemirrorsIcon,
  },
  [ABILITY_ID.SNAPSHOT]: {
    id: ABILITY_ID.SNAPSHOT,
    name: 'Snapshot',
    description: 'Shots do not trigger reaction fire.',
    icon: sniperSnapshotIcon,
  },
  [ABILITY_ID.SPRINTER]: {
    id: ABILITY_ID.SPRINTER,
    name: 'Sprinter',
    description: 'Grants +1.3 mobility and +10 defense. Doubles damage from Ram.',
    icon: supportSprinterIcon,
  },
  [ABILITY_ID.SQUADSIGHT]: {
    id: ABILITY_ID.SQUADSIGHT,
    name: 'Squadsight',
    description: 'Allows firing with long-range weapons around some obstacles and beyond 18 tiles at targets with a spotter (an ally at 0 AP that can see the target). Grants +2 aim per ally (+8 per scout) can see the target and -5 aim for each tile beyond 18. Overwatch and reaction shots are still limited to 18 tiles. Other abilities that consider the number of enemies in sight will also include any enemies in squadsight.',
    icon: sniperSquadsightIcon,
  },
  [ABILITY_ID.STEADFAST]: {
    id: ABILITY_ID.STEADFAST,
    name: 'Steadfast',
    description: 'Provides +3 armor HP, immunity to panic, and reduces injury times by 30%.',
    icon: defendersMedal1Eu2012Icon,
  },
  [ABILITY_ID.SUPPRESSION]: {
    id: ABILITY_ID.SUPPRESSION,
    name: 'Suppression',
    description: 'Suppress [Pinned if protected by cover, suppressive fire if not, no reaction fire, -35 aim, -35% mobility/ability range] targets. Breaks with suppressive fire if the target acts. Requires 2 ammo, and uses the 2nd ammo if the suppression breaks with suppressive fire. 2 turn cooldown. [Suppressive Fire deals 40% standard shot damage]',
    icon: heavySuppressionIcon,
  },
  [ABILITY_ID.SURGICAL_TARGETING]: {
    id: ABILITY_ID.SURGICAL_TARGETING,
    name: 'Surgical Targeting',
    description: 'Shots against autopsied targets affected by red fog double the bleed chance and deal 50% more damage.',
    icon: heavyMayhemIcon,
  },
  [ABILITY_ID.SUSTAIN]: {
    id: ABILITY_ID.SUSTAIN,
    name: 'Sustain',
    description: 'Self-applied medikits cost 0 AP. Grants +2 armor HP. If idle: when taking 3 or more damage passively heal for 1 HP.',
    icon: mecExpandedStorageIcon,
  },
  [ABILITY_ID.TANDEM_WARHEADS]: {
    id: ABILITY_ID.TANDEM_WARHEADS,
    name: 'Tandem Warheads',
    description: 'Explosives employed by this soldier do full damage at the extent of their area of effect (instead of 50%).',
    icon: alienOverloadIcon,
  },
  [ABILITY_ID.TENACIOUS_DEFENSE]: {
    id: ABILITY_ID.TENACIOUS_DEFENSE,
    name: 'Tenacious Defense',
    description: 'Grants +2 armor HP. Grants +20 crit resistance when protected by cover.',
    icon: assaultKillerinstinctIcon,
  },
  [ABILITY_ID.TINKER]: {
    id: ABILITY_ID.TINKER,
    name: 'Tinker',
    description: 'Concussion and psi grenades add 10 shred to their targets. On detonation, smoke grenades repair all shred.',
    icon: bombardTgaIcon,
  },
  [ABILITY_ID.VITAL_POINT_TARGETING]: {
    id: ABILITY_ID.VITAL_POINT_TARGETING,
    name: 'Vital Point Targeting',
    description: 'When hitting humans or autopsied biological aliens: steadied shots, reaction shots, or shots at targets not protected by cover deal 30% more damage.',
    icon: mecVitalPointTargetingIcon,
  },
  [ABILITY_ID.WILL_TO_SURVIVE]: {
    id: ABILITY_ID.WILL_TO_SURVIVE,
    name: 'Will To Survive',
    description: 'Increases DR of all cover to 60% but grants 10 less defense. Grants Steadfast.',
    icon: heavyWilltosurviveIcon,
    grants: [ABILITY_ID.STEADFAST],
  },
};
