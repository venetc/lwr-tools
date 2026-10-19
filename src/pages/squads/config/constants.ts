import type { ArmorCategory, LoadoutBlockReason, LoadoutChange, LoadoutChangeReason, LoadoutUnitId, UtilitySlotKind, WeaponTier, WeaponType } from '@entities/loadout';
import { LOADOUT_UNITS } from '@entities/loadout';
import type { DeepReadonly } from '@shared/lib/object';
import type { TabsItem } from '@shared/ui/tabs';

import type { NewBuildGroup } from '../model/new-build';
import { newBuildGroup } from '../model/new-build';

/** Word for one Unit in the Squad summary. */
export const UNIT_WORD = 'Unit';

/** Word for any other number of Units in the Squad summary. */
export const UNITS_WORD = 'Units';

/** Separator of the parts of the Squad summary. */
export const SUMMARY_SEPARATOR = ' · ';

/** Caption of the armor slot tile by unit type: Armor, the MEC exoskeleton of a MEC, the SHIV type of a SHIV. */
export const ARMOR_SLOT_CAPTION = {
  biosoldier: 'Armor',
  mec: 'MEC exoskeleton',
  shiv: 'SHIV type',
} as const satisfies Record<LoadoutUnitId, string>;

/** Caption of the primary weapon slot tile. */
export const PRIMARY_SLOT_CAPTION = 'Primary';

/** Caption of the secondary weapon slot tile. */
export const SECONDARY_SLOT_CAPTION = 'Secondary';

/** Caption of a Module slot tile. */
export const MODULE_SLOT_CAPTION = 'Module';

/** Name a tile of an empty slot gives in place of an item name. */
export const EMPTY_SLOT_NAME = 'Empty';

/** Caption of a utility slot tile by its kind: Gear Slots and Psi Slots have their own. */
export const UTILITY_SLOT_CAPTION = {
  'regular': 'Utility',
  'gear-slot': 'Gear Slot',
  'psi-slot': 'Psi Slot',
} as const satisfies Record<UtilitySlotKind, string>;

/** Unit type names by unit type id: the name of each Build calculator and the class shown for a SHIV build. */
export const UNIT_NAME_BY_KIND: ReadonlyMap<LoadoutUnitId, string> = new Map(LOADOUT_UNITS.map(unit => [unit.id, unit.name]));

/** Word after the unit type name that names its Build calculator: `Biosoldier builds`. */
export const BUILD_LIST_WORD = 'builds';

/** Name of the filter of saved builds that keeps every unit type. */
export const ALL_BUILDS_FILTER_NAME = 'All';

/** Tabs of the Add Unit dialog: where the build of the new Unit comes from. */
export const ADD_UNIT_TABS = [
  { id: 'saved', name: 'Saved builds' },
  { id: 'new', name: 'New build' },
] as const satisfies readonly TabsItem[];

/** Default builds of the New build tab by Build calculator, in unit type order. */
export const NEW_BUILD_GROUPS: DeepReadonly<NewBuildGroup[]> = LOADOUT_UNITS.map(newBuildGroup);

/** Separator of the unit type and the class in the caption of a Unit card: `Biosoldier · Sniper`. */
export const CAPTION_SEPARATOR = ' · ';

/** Labels of the reasons an item does not fit a slot, as the Locker and the item details show them: the game's own in capitals, the rest in its style. */
export const BLOCK_REASON_LABEL = {
  'wrong-unit': 'WRONG UNIT',
  'class-limited': 'CLASS-LIMITED ITEM',
  'needs-gene-mod': 'Needs Gene mod',
  'needs-psionic': 'Needs Psionic ability',
  'needs-officer': 'Needs officer',
  'max-one': 'MAX 1 PER SOLDIER',
  'cant-stack': 'CAN\'T STACK',
  'unsupported-weapon': 'UNSUPPORTED WEAPON',
  'needs-module': 'Needs Module',
  'gear-slot-passive-only': 'Gear Slot: passive gear only',
  'psi-slot-psi-only': 'Psi Slot: passive psi only',
} as const satisfies Record<LoadoutBlockReason, string>;

/** Mark of the item in the slot, in the Locker. */
export const EQUIPPED_LABEL = 'Equipped';

/** Word before what an item needs: `Needs Kinetic Strike Module`. */
export const NEEDS_WORD = 'Needs';

/** Why a Loadout change took an item off, as the toast tells it after the item name: `Reaper Ammo removed: unsupported weapon.` */
export const CHANGE_REASON_TEXT = {
  'wrong-unit': 'wrong unit',
  'class-limited': 'class-limited item',
  'needs-gene-mod': 'needs Gene mod',
  'needs-psionic': 'needs Psionic ability',
  'needs-officer': 'needs officer',
  'max-one': 'max 1 per soldier',
  'cant-stack': 'can\'t stack',
  'unsupported-weapon': 'unsupported weapon',
  'needs-module': 'needs Module',
  'gear-slot-passive-only': 'Gear Slot takes passive gear only',
  'psi-slot-psi-only': 'Psi Slot takes passive psi only',
  'slot-removed': 'slot removed',
} as const satisfies Record<LoadoutChangeReason, string>;

/** Words of a Loadout change between the item names in the toast: `Ceramic Plating moved to Utility.` */
export const CHANGE_WORD = {
  moved: 'moved to',
  removed: 'removed',
  replaced: 'replaced with',
  added: 'added to',
} as const satisfies Record<LoadoutChange['kind'], string>;

/** Name of the utility slots in the slot count line and the toast. */
export const UTILITY_SLOTS_NAME = 'Utility slots';

/** Name of one utility slot in the slot count line. */
export const UTILITY_SLOT_NAME = 'Utility slot';

/** Name of Tactical Rigging in the slot count line. */
export const TACTICAL_RIGGING_NAME = 'Tactical Rigging';

/** Small numbers in words, by number, for the slot count line: `last two are Gear Slots`. */
export const NUMBER_WORDS = ['zero', 'one', 'two', 'three', 'four'] as const;

/** Words of the last Gear Slots or Psi Slots in the slot count line: `last two are Gear Slots`, `last one is a Psi Slot`. */
export const LAST_SLOTS_WORDS = {
  last: 'last',
  one: 'is a',
  many: 'are',
} as const;

/** Word before the maximum number of utility slots when the count reaches it: `= 4 Utility slots (max 4)`. */
export const MAX_WORD = 'max';

/** Armor weight category names, before the slot name in the item type: `Light Armor`. */
export const ARMOR_CATEGORY_NAME = {
  'light': 'Light',
  'heavy': 'Heavy',
  'ultra-light': 'Ultra-Light',
  'ultra-heavy': 'Ultra-Heavy',
  'standard': 'Standard',
} as const satisfies Record<ArmorCategory, string>;

/** Weapon technology tier names. */
export const WEAPON_TIER_NAME = {
  ballistic: 'Ballistic',
  laser: 'Laser',
  arc: 'Arc',
  gauss: 'Gauss',
  pulse: 'Pulse',
  plasma: 'Plasma',
} as const satisfies Record<WeaponTier, string>;

/** Weapon type names. */
export const WEAPON_TYPE_NAME = {
  'assault-rifle': 'Assault Rifle',
  'battle-rifle': 'Battle Rifle',
  'carbine': 'Carbine',
  'smg': 'SMG',
  'shotgun': 'Shotgun',
  'saw': 'SAW',
  'lmg': 'LMG',
  'strike-rifle': 'Strike Rifle',
  'sniper-rifle': 'Sniper Rifle',
  'mec-weapon': 'MEC Weapon',
  'autocannon': 'Autocannon',
  'vulcan-cannon': 'Vulcan Cannon',
  'arc-rifle': 'Arc Rifle',
  'stun-rifle': 'Stun Rifle',
  'pistol': 'Pistol',
  'autopistol': 'Autopistol',
  'arc-pistol': 'Arc Pistol',
  'sawed-off-shotgun': 'Sawed-off Shotgun',
  'rocket-launcher': 'Rocket Launcher',
} as const satisfies Record<WeaponType, string>;

/** Item type of utility equipment by whether it is passive gear. */
export const UTILITY_ITEM_TYPE = {
  active: 'Utility item',
  passive: 'Passive gear',
} as const;

/** Separator of the parts of a Locker summary and an item type: `Assault Rifle · Laser`. */
export const DETAIL_SEPARATOR = ' · ';

/** Separator of alternatives in an item rule: `Laser/Pulse`. */
export const ALTERNATIVE_SEPARATOR = '/';

/** Separator of item names in a list. */
export const LIST_SEPARATOR = ', ';

/** Stat names of armor, SHIV types and weapons, in the style of the equipment stat lines. */
export const STAT_NAME = {
  hp: 'HP',
  damageReduction: 'Base DR',
  defense: 'Def',
  mobility: 'Mob',
  will: 'Will',
  critResist: 'Crit Resist',
  fullHpAim: 'Aim (full HP)',
  aim: 'Aim',
  utilitySlots: 'Utility slots',
  moduleSlots: 'Module slots',
  fuel: 'Fuel',
  damage: 'Dmg',
  penetration: 'Pen',
  crit: 'Crit',
  critDamage: 'Crit Dmg',
  ammo: 'Ammo',
  range: 'Range',
  environmentDamage: 'Env Dmg',
  radius: 'Radius',
} as const;

/** Word of a Foundry upgrade after a stat value: `4 (+1 upg)`. */
export const UPGRADE_WORD = 'upg';

/** Rules of an item as its details list them; the rest of each rule follows the words. */
export const ITEM_RULE_TEXT = {
  cantStack: 'Can\'t stack with',
  primaryWeapon: 'Primary weapon:',
  fitsGearSlot: 'Fits a Gear Slot.',
  fitsGearOrPsiSlot: 'Fits a Gear Slot or a Psi Slot.',
  notForGearSlots: 'Not for Gear Slots or Psi Slots.',
  takesUtilitySlot: 'Takes a Utility slot.',
  noRigging: 'Tactical Rigging adds no slot.',
} as const;
