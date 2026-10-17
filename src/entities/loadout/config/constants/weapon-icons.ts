import type { DeepReadonly } from '@shared/lib/object';

import type { WeaponId } from '../../model/weapons';
import alloyCannonIcon from '../icons/weapons/alloy_cannon_long_war.png';
import alloyStrikeRifleIcon from '../icons/weapons/alloy_strike_rifle_long_war.png';
import arcRifleIcon from '../icons/weapons/arc_rifle_long_war.png';
import arcThrowerIcon from '../icons/weapons/arc_thrower_long_war.png';
import assaultCarbineIcon from '../icons/weapons/assault_carbine_long_war.png';
import assaultRifleIcon from '../icons/weapons/assault_rifle_long_war.png';
import autocannonIcon from '../icons/weapons/autocannon_long_war.png';
import autolaserIcon from '../icons/weapons/autolaser_long_war.png';
import battleRifleIcon from '../icons/weapons/battle_rifle_long_war.png';
import blasterLauncherIcon from '../icons/weapons/blaster_launcher_long_war.png';
import blasterIcon from '../icons/weapons/blaster_long_war.png';
import blasterRifleIcon from '../icons/weapons/blaster_rifle_long_war.png';
import gatlingLaserIcon from '../icons/weapons/gatling_laser_long_war.png';
import gatlingPulserIcon from '../icons/weapons/gatling_pulser_long_war.png';
import gaussAutopistolIcon from '../icons/weapons/gauss_autopistol_long_war.png';
import gaussAutorifleIcon from '../icons/weapons/gauss_autorifle_long_war.png';
import gaussCarbineIcon from '../icons/weapons/gauss_carbine_long_war.png';
import gaussLongRifleIcon from '../icons/weapons/gauss_long_rifle_long_war.png';
import gaussMachineGunIcon from '../icons/weapons/gauss_machine_gun_long_war.png';
import gaussRifleIcon from '../icons/weapons/gauss_rifle_long_war.png';
import gaussStuttergunIcon from '../icons/weapons/gauss_stuttergun_long_war.png';
import heaterIcon from '../icons/weapons/heater_long_war.png';
import heavyGaussRifleIcon from '../icons/weapons/heavy_gauss_rifle_long_war.png';
import heavyLaserRifleIcon from '../icons/weapons/heavy_laser_rifle_long_war.png';
import heavyPlasmaRifleIcon from '../icons/weapons/heavy_plasma_rifle_long_war.png';
import heavyPulseRifleIcon from '../icons/weapons/heavy_pulse_rifle_long_war.png';
import laserCarbineIcon from '../icons/weapons/laser_carbine_long_war.png';
import laserLanceIcon from '../icons/weapons/laser_lance_long_war.png';
import laserPistolIcon from '../icons/weapons/laser_pistol_long_war.png';
import laserRifleIcon from '../icons/weapons/laser_rifle_long_war.png';
import laserShatterrayIcon from '../icons/weapons/laser_shatterray_long_war.png';
import laserSniperRifleIcon from '../icons/weapons/laser_sniper_rifle_long_war.png';
import laserStrikeRifleIcon from '../icons/weapons/laser_strike_rifle_long_war.png';
import lmgIcon from '../icons/weapons/lmg_long_war.png';
import machinePistolIcon from '../icons/weapons/machine_pistol_long_war.png';
import marksmanRifleIcon from '../icons/weapons/marksman_rifle_long_war.png';
import minigunIcon from '../icons/weapons/minigun_long_war.png';
import particleCannonIcon from '../icons/weapons/particle_cannon_long_war.png';
import pistolIcon from '../icons/weapons/pistol_long_war.png';
import plasmaCarbineIcon from '../icons/weapons/plasma_carbine_long_war.png';
import plasmaDragonIcon from '../icons/weapons/plasma_dragon_long_war.png';
import plasmaMaulerIcon from '../icons/weapons/plasma_mauler_long_war.png';
import plasmaNovagunIcon from '../icons/weapons/plasma_novagun_long_war.png';
import plasmaPistolIcon from '../icons/weapons/plasma_pistol_long_war.png';
import plasmaRifleIcon from '../icons/weapons/plasma_rifle_long_war.png';
import plasmaSniperRifleIcon from '../icons/weapons/plasma_sniper_rifle_long_war.png';
import plasmaStormgunIcon from '../icons/weapons/plasma_stormgun_long_war.png';
import pulseAutoblasterIcon from '../icons/weapons/pulse_autoblaster_long_war.png';
import pulseCarbineIcon from '../icons/weapons/pulse_carbine_long_war.png';
import pulseLanceIcon from '../icons/weapons/pulse_lance_long_war.png';
import pulseRifleIcon from '../icons/weapons/pulse_rifle_long_war.png';
import pulseSniperRifleIcon from '../icons/weapons/pulse_sniper_rifle_long_war.png';
import pulseStengunIcon from '../icons/weapons/pulse_stengun_long_war.png';
import railgunIcon from '../icons/weapons/railgun_long_war.png';
import recoillessRifleIcon from '../icons/weapons/recoilless_rifle_long_war.png';
import reflexCannonIcon from '../icons/weapons/reflex_cannon_long_war.png';
import reflexRifleIcon from '../icons/weapons/reflex_rifle_long_war.png';
import rocketLauncherIcon from '../icons/weapons/rocket_launcher_long_war.png';
import sawIcon from '../icons/weapons/saw_long_war.png';
import sawedOffShotgunIcon from '../icons/weapons/sawed_off_shotgun_long_war.png';
import scatterBlasterIcon from '../icons/weapons/scatter_blaster_long_war.png';
import scatterLaserIcon from '../icons/weapons/scatter_laser_long_war.png';
import sentryGunIcon from '../icons/weapons/sentry_gun_long_war.png';
import shotgunIcon from '../icons/weapons/shotgun_long_war.png';
import smgIcon from '../icons/weapons/smg_long_war.png';
import sniperRifleIcon from '../icons/weapons/sniper_rifle_long_war.png';
import superheavyLaserIcon from '../icons/weapons/superheavy_laser_long_war.png';
import superheavyPlasmaIcon from '../icons/weapons/superheavy_plasma_long_war.png';
import superheavyPulserIcon from '../icons/weapons/superheavy_pulser_long_war.png';

/** Weapon images from the game (256×128) by weapon id; Vulcan cannons share the image of the autocannon of their tier. */
export const WEAPON_ICON: DeepReadonly<Record<WeaponId, string>> = {
  'assault-rifle': assaultRifleIcon,
  'battle-rifle': battleRifleIcon,
  'assault-carbine': assaultCarbineIcon,
  'smg': smgIcon,
  'shotgun': shotgunIcon,
  'saw': sawIcon,
  'lmg': lmgIcon,
  'strike-rifle': marksmanRifleIcon,
  'sniper-rifle': sniperRifleIcon,
  'minigun': minigunIcon,
  'autocannon': autocannonIcon,
  'vulcan-cannon': autocannonIcon,
  'pistol': pistolIcon,
  'machine-autopistol': machinePistolIcon,
  'sawed-off-shotgun': sawedOffShotgunIcon,
  'rocket-launcher': rocketLauncherIcon,
  'laser-rifle': laserRifleIcon,
  'laser-battle-rifle': heavyLaserRifleIcon,
  'laser-carbine': laserCarbineIcon,
  'laser-smg': laserShatterrayIcon,
  'laser-scattershot': scatterLaserIcon,
  'laser-autorifle': autolaserIcon,
  'laser-gattler': gatlingLaserIcon,
  'laser-strike-rifle': laserStrikeRifleIcon,
  'laser-sniper-rifle': laserSniperRifleIcon,
  'laser-lance': laserLanceIcon,
  'laser-autocannon': superheavyLaserIcon,
  'laser-vulcan': superheavyLaserIcon,
  'laser-pistol': laserPistolIcon,
  'arc-rifle': arcRifleIcon,
  'stun-rifle': arcThrowerIcon,
  'arc-pistol': heaterIcon,
  'gauss-assault-rifle': gaussRifleIcon,
  'gauss-battle-rifle': heavyGaussRifleIcon,
  'gauss-carbine': gaussCarbineIcon,
  'gauss-smg': gaussStuttergunIcon,
  'gauss-alloy-cannon': alloyCannonIcon,
  'gauss-autorifle': gaussAutorifleIcon,
  'gauss-machine-gun': gaussMachineGunIcon,
  'gauss-strike-rifle': alloyStrikeRifleIcon,
  'gauss-long-rifle': gaussLongRifleIcon,
  'gauss-railgun': railgunIcon,
  'gauss-sentry-gun': sentryGunIcon,
  'gauss-vulcan': sentryGunIcon,
  'gauss-autopistol': gaussAutopistolIcon,
  'recoilless-launcher': recoillessRifleIcon,
  'pulse-rifle': pulseRifleIcon,
  'pulse-battle-rifle': heavyPulseRifleIcon,
  'pulse-carbine': pulseCarbineIcon,
  'pulse-smg': pulseStengunIcon,
  'pulse-scattershot': scatterBlasterIcon,
  'pulse-autoblaster': pulseAutoblasterIcon,
  'pulse-gattler': gatlingPulserIcon,
  'pulse-strike-rifle': blasterRifleIcon,
  'pulse-sniper-rifle': pulseSniperRifleIcon,
  'pulse-lance': pulseLanceIcon,
  'pulse-autocannon': superheavyPulserIcon,
  'pulse-vulcan': superheavyPulserIcon,
  'pulse-pistol': blasterIcon,
  'plasma-rifle': plasmaRifleIcon,
  'plasma-battle-rifle': heavyPlasmaRifleIcon,
  'plasma-carbine': plasmaCarbineIcon,
  'plasma-smg': plasmaStormgunIcon,
  'plasma-reflex-cannon': reflexCannonIcon,
  'plasma-novagun': plasmaNovagunIcon,
  'plasma-dragon': plasmaDragonIcon,
  'plasma-strike-rifle': reflexRifleIcon,
  'plasma-sniper-rifle': plasmaSniperRifleIcon,
  'plasma-particle-cannon': particleCannonIcon,
  'plasma-autocannon': superheavyPlasmaIcon,
  'plasma-vulcan': superheavyPlasmaIcon,
  'plasma-pistol': plasmaPistolIcon,
  'plasma-autopistol': plasmaMaulerIcon,
  'blaster-launcher': blasterLauncherIcon,
};
