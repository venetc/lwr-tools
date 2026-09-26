import type { TalentTree } from '../types';

import bringEmOnIcon from '@shared/assets/images/ASSAULT BRINGTHEMON.png';
import extraConditioningIcon from '@shared/assets/images/ASSAULT EXTRACONDITIONING.png';
import shadowstepIcon from '@shared/assets/images/ASSAULT LIGHTNINGREFLEXES.png';
import classSniper from '@shared/assets/images/CLASS SNIPER.png';
import loneWolfIcon from '@shared/assets/images/Council Medal of Honor 2 (EU2012).png';
import magnumIcon from '@shared/assets/images/HEAVY MAYHEM.png';
import inTheZoneIcon from '@shared/assets/images/ITZ Icon.png';
import onTheReadyIcon from '@shared/assets/images/MEC ADVANCED FIRE CONTROL.png';
import vitalPointTargetingIcon from '@shared/assets/images/MEC VITAL POINT TARGETING.png';
import rankCaptain from '@shared/assets/images/ranks/RANK_CAPTAIN.png';
import rankColonel from '@shared/assets/images/ranks/RANK_COLONEL.png';
import rankCorporal from '@shared/assets/images/ranks/RANK_CORPORAL.png';
import rankLieutenant from '@shared/assets/images/ranks/RANK_LIEUTENANT.png';
import rankMajor from '@shared/assets/images/ranks/RANK_MAJOR.png';
import rankSergeant from '@shared/assets/images/ranks/RANK_SERGEANT.png';
import rankSquaddie from '@shared/assets/images/ranks/RANK_SQUADDIE.png';
import impactIcon from '@shared/assets/images/SNIPER DGG.png';
import disablingShotIcon from '@shared/assets/images/SNIPER DISABLINGSHOT.png';
import executionerIcon from '@shared/assets/images/SNIPER EXECUTIONER.png';
import rangerIcon from '@shared/assets/images/SNIPER GUNSLINGER.png';
import precisionShotIcon from '@shared/assets/images/SNIPER HEADSHOT.png';
import opportunistIcon from '@shared/assets/images/SNIPER OPPORTUNIST.png';
import squadsightIcon from '@shared/assets/images/SNIPER SQUADSIGHT.png';
import sharpshooterIcon from '@shared/assets/images/Urban Combat Badge 2 (EU2012).png';

export const sniperTree: TalentTree = {
  title: 'Sniper abilities',
  icon: classSniper,
  ranks: [
    {
      title: 'Specialist',
      icon: rankSquaddie,
      talents: [
        {
          id: 'squadsight',
          name: 'Squadsight',
          description: 'Allows firing with long-range weapons around some obstacles and beyond 18 tiles at targets with a spotter (an ally at 0 AP that can see the target). Grants +2 aim per ally (+8 per scout) can see the target and -5 aim for each tile beyond 18. Overwatch and reaction shots are still limited to 18 tiles. Other abilities that consider the number of enemies in sight will also include any enemies in squadsight.',
          icon: squadsightIcon,
        },
      ],
    },
    {
      title: 'Lance Corporal',
      icon: rankCorporal,
      talents: [
        {
          id: 'magnum',
          name: 'Magnum',
          description: 'Sniper rifles, strike rifles and pistols gain +50% weapon damage. Standard and Precision shots pass through to enemy units behind the target (up to 24 tiles, non-reaction shots only, not amplified by target modifiers).',
          icon: magnumIcon,
        },
        {
          id: 'on-the-ready',
          name: 'On The Ready',
          description: 'Shots gain +35% base weapon damage if this unit is Steadying or Combat Ready. Non-reaction shots grant Combat Readiness. If this unit\'s last action was a shot or a manual activation of combat readiness, overwatch activates at the end of the turn (except when at risk of triggering reaction fire).',
          icon: onTheReadyIcon,
        },
        {
          id: 'in-the-zone',
          name: 'In The Zone',
          description: 'Shots gain aim equal to the percent of HP the target is missing. Shooting with a steadied weapon allows this unit to fire chain shots (with a stacking -10 max hit chance) until they run out of ammo or targets. Standard shots (outside an ITZ chain) trigger a free reload.',
          icon: inTheZoneIcon,
        },
      ],
    },
    {
      title: 'Corporal',
      icon: rankSergeant,
      talents: [
        {
          id: 'sharpshooter',
          name: 'Sharpshooter',
          description: 'All shots gain +15 aim against biological targets. Rapid Fire shots gain +30 aim instead.',
          icon: sharpshooterIcon,
        },
        {
          id: 'opportunist',
          name: 'Opportunist',
          description: 'Reaction shots gain +10 aim and can critically hit.',
          icon: opportunistIcon,
        },
        {
          id: 'disabling-shot',
          name: 'Disabling Shot',
          description: 'Fire a 0 AP 1 damage shot that disables the target\'s main weapon. Grants +1 ammo to primary weapons. Does not work against mechanical targets (except SHIVs). Cannot be used after activating In The Zone. 3 turn cooldown. Only for Sniper/Strike Rifles.',
          icon: disablingShotIcon,
        },
      ],
    },
    {
      title: 'Sergeant',
      icon: rankLieutenant,
      talents: [
        {
          id: 'ranger',
          name: 'Ranger',
          description: 'Grants +1 damage to all weapons and equipment, +0.6 mobility, and +10% throw/rocket range. Sidearms additionally gain +50% base weapon damage, +20 aim, and 1 AP reloads.',
          icon: rangerIcon,
        },
        {
          id: 'shadowstep',
          name: 'Shadowstep',
          description: 'This unit gains +0.6 mobility and does not trigger reaction shots or pursuit when walking (not dashing). After repositioning, shots gain +25% crit damage until next turn.',
          icon: shadowstepIcon,
        },
        {
          id: 'executioner',
          name: 'Executioner',
          description: 'Grants +1 damage and +20 aim against targets at or below half HP. Double the effects if using a sidearm.',
          icon: executionerIcon,
        },
      ],
    },
    {
      title: 'Tech Sergeant',
      icon: rankCaptain,
      talents: [
        {
          id: 'precision-shot',
          name: 'Precision Shot',
          description: 'Fire a shot that has no squadsight penalties, +30 aim, and +30 crit. The shot will never graze. 3 turn cooldown. Only for Strike/Sniper Rifles.',
          icon: precisionShotIcon,
        },
      ],
    },
    {
      title: 'Gunnery Sergeant',
      icon: rankMajor,
      talents: [
        {
          id: 'impact',
          name: 'Impact',
          description: 'Shots gain +10 penetration. Non-reaction shots disable their target\'s Overwatch and Reactive Targeting Sensors.',
          icon: impactIcon,
        },
        {
          id: 'vital-point-targeting',
          name: 'Vital Point Targeting',
          description: 'When hitting humans or autopsied biological aliens: steadied shots, reaction shots, or shots at targets not protected by cover deal 30% more damage.',
          icon: vitalPointTargetingIcon,
        },
        {
          id: 'bring-em-on',
          name: 'Bring \'Em On',
          description: 'This unit gains +0.5 damage on standard shots and incoming non-psionic attacks have a +5% graze chance for each enemy in sight.',
          icon: bringEmOnIcon,
        },
      ],
    },
    {
      title: 'Master Sergeant',
      icon: rankColonel,
      talents: [
        {
          id: 'extra-conditioning',
          name: 'Extra Conditioning',
          description: 'Grants +2 armor HP and +0.6 mobility, and a 10% chance for all end-in-idle actions to cost 0 AP.',
          icon: extraConditioningIcon,
        },
        {
          id: 'lone-wolf',
          name: 'Lone Wolf',
          description: 'Grants 10 aim, crit, def and crit resist if not within 6 tiles of an allied unit.',
          icon: loneWolfIcon,
        },
      ],
    },
  ],
};
