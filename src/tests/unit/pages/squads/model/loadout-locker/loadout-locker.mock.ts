import type { ArmorContent } from '@entities/loadout/model/armors';
import type { EquipmentContent } from '@entities/loadout/model/equipment';
import type { Loadout, LoadoutWearer } from '@entities/loadout/model/loadout';
import type { ShivTypeContent } from '@entities/loadout/model/shiv-types';
import type { WeaponContent } from '@entities/loadout/model/weapons';

/**
 * Armor record with zero stats and no slots besides the given fields.
 *
 * @param content fields that differ from the empty record.
 */
const armorMock = (content: Pick<ArmorContent, 'code' | 'unit' | 'name'> & Partial<ArmorContent>): ArmorContent => ({
  category: 'light',
  hp: 0,
  damageReduction: 0,
  defense: 0,
  mobility: 0,
  will: 0,
  critResist: 0,
  fullHpAim: 0,
  utilitySlots: 0,
  moduleSlots: 0,
  gearSlots: 0,
  psiSlots: 0,
  fuel: 0,
  info: '',
  ...content,
});

/**
 * Weapon record with zero stats besides the given fields.
 *
 * @param content fields that differ from the empty record.
 */
const weaponMock = (content: Pick<WeaponContent, 'code' | 'unit' | 'name' | 'tier' | 'type' | 'slot'> & Partial<WeaponContent>): WeaponContent => ({
  damage: 0,
  penetration: 0,
  crit: 0,
  aim: 0,
  ammo: 0,
  mobility: 0,
  range: 0,
  utilitySlots: 0,
  info: '',
  ...content,
});

/**
 * Equipment record without stats besides the given fields.
 *
 * @param content fields that differ from the empty record.
 */
const equipmentMock = (content: Pick<EquipmentContent, 'code' | 'units' | 'slot' | 'name'> & Partial<EquipmentContent>): EquipmentContent => ({
  stats: [],
  ...content,
});

export const ARMOR_CONTENT_MOCK: Record<string, ArmorContent> = {
  'tactical-vest': armorMock({ code: 1, unit: 'biosoldier', name: 'Vest', hp: 3, defense: 5, utilitySlots: 2 }),
  'phalanx-armor': armorMock({ code: 3, unit: 'biosoldier', name: 'Phalanx', utilitySlots: 3 }),
  'aegis-armor': armorMock({ code: 6, unit: 'biosoldier', name: 'Aegis', utilitySlots: 3, gearSlots: 2 }),
  'ghost-armor': armorMock({ code: 12, unit: 'biosoldier', name: 'Ghost', utilitySlots: 2, gearSlots: 1, requires: 'gene-mod' }),
  'mec1-paladin': armorMock({ code: 15, unit: 'mec', name: 'Paladin', category: 'standard', utilitySlots: 2, moduleSlots: 1 }),
};

export const WEAPON_CONTENT_MOCK: Record<string, WeaponContent> = {
  'assault-rifle': weaponMock({ code: 1, unit: 'biosoldier', name: 'Rifle', tier: 'ballistic', type: 'assault-rifle', slot: 'primary', damage: 4, ammoUpgrade: 1, ammo: 4, crit: 20, range: 18 }),
  'lmg': weaponMock({ code: 7, unit: 'biosoldier', name: 'LMG', tier: 'ballistic', type: 'lmg', slot: 'primary', utilitySlots: -1, classes: ['gunner'] }),
  'laser-rifle': weaponMock({ code: 17, unit: 'biosoldier', name: 'Laser', tier: 'laser', type: 'assault-rifle', slot: 'primary' }),
};

export const EQUIPMENT_CONTENT_MOCK: Record<string, EquipmentContent> = {
  'he-grenade': equipmentMock({ code: 1, units: ['biosoldier'], slot: 'utility', name: 'Grenade' }),
  'battle-scanner': equipmentMock({ code: 5, units: ['biosoldier'], slot: 'utility', name: 'Scanner', classes: ['scout'] }),
  'chitin-plating': equipmentMock({ code: 13, units: ['biosoldier'], slot: 'utility', name: 'Chitin', requires: 'gene-mod', isPassive: true, stackGroup: 'plating' }),
  'alloy-plating': equipmentMock({ code: 14, units: ['biosoldier'], slot: 'utility', name: 'Alloy', isPassive: true, stackGroup: 'plating', stats: [{ name: 'HP', value: '+4' }, { name: 'Weightless', value: '' }] }),
  'psi-frayer': equipmentMock({ code: 15, units: ['biosoldier'], slot: 'utility', name: 'Frayer', requires: 'psionic', isPassive: true }),
  'ceramic-plating': equipmentMock({ code: 23, units: ['biosoldier'], slot: 'utility', name: 'Ceramic', isPassive: true, stackGroup: 'plating' }),
  'reaper-ammo': equipmentMock({ code: 48, units: ['biosoldier'], slot: 'utility', name: 'Reaper', isPassive: true, stackGroup: 'ammo-type', primaryTiers: ['laser', 'pulse'] }),
  'motion-tracker': equipmentMock({ code: 40, units: ['shiv'], slot: 'utility', name: 'Tracker' }),
  'the-thumper': equipmentMock({ code: 37, units: ['mec'], slot: 'utility', name: 'Thumper', isPassive: true, requiredModule: 'kinetic-strike-module' }),
  'kinetic-strike-module': equipmentMock({ code: 57, units: ['mec'], slot: 'module', name: 'Kinetic' }),
};

export const SHIV_TYPE_CONTENT_MOCK: Record<string, ShivTypeContent> = {};

export const ASSAULT: LoadoutWearer = { unit: 'biosoldier', classId: 'assault', hasGeneMod: false, hasPsionicAbility: false, isOfficer: false };

export const MEC: LoadoutWearer = { unit: 'mec', classId: 'marauder', hasGeneMod: false, hasPsionicAbility: false, isOfficer: false };

/**
 * Fresh biosoldier Loadout with its own slot arrays.
 *
 * @param loadout fields that differ from a Vest, a rifle and three empty utility slots.
 */
export const createLoadoutMock = (loadout: Partial<Loadout> = {}): Loadout => ({
  armor: 'tactical-vest',
  primary: 'assault-rifle',
  secondary: null,
  utility: [null, null, null],
  modules: [],
  ...loadout,
});

export const ARMOR_LOCKER_IDS = ['tactical-vest', 'phalanx-armor', 'aegis-armor', 'ghost-armor'];

export const UTILITY_LOCKER_IDS = ['he-grenade', 'alloy-plating', 'ceramic-plating', 'battle-scanner', 'chitin-plating', 'psi-frayer', 'reaper-ammo'];

export const ALLOY_ON = createLoadoutMock({ utility: ['alloy-plating', null, null] });

export const GHOST_LABEL = 'Ghost, Needs Gene mod';

export const VEST_LABEL = 'Vest, Equipped';

export const SCANNER_REASON = 'CLASS-LIMITED ITEM';

export const CERAMIC_REASON = 'CAN\'T STACK';

export const THUMPER_REASON = 'Needs Kinetic';

export const MEC_LOADOUT = createLoadoutMock({ armor: 'mec1-paladin', primary: 'assault-rifle', utility: [null, null], modules: [null] });

export const CHITIN_REASONS = ['Needs Gene mod', 'CAN\'T STACK'];

export const CHITIN_RULES = ['Can\'t stack with Alloy, Ceramic.', 'Fits a Gear Slot.'];

export const REAPER_RULES = ['Primary weapon: Laser/Pulse.', 'Fits a Gear Slot.'];

export const GRENADE_RULES = ['Not for Gear Slots or Psi Slots.'];

export const FRAYER_RULES = ['Fits a Gear Slot or a Psi Slot.'];

export const SCANNER_CARRIERS = 'Scout';

export const ALLOY_SUMMARY = 'HP +4 · Weightless';

export const RIFLE_STATS = [
  { name: 'Dmg', value: '4' },
  { name: 'Crit', value: '+20' },
  { name: 'Ammo', value: '4 (+1 upg)' },
  { name: 'Range', value: '18' },
];

export const VEST_STATS = [
  { name: 'HP', value: '+3' },
  { name: 'Def', value: '+5' },
  { name: 'Utility slots', value: '2' },
];

export const RIFLE_TYPE = 'Assault Rifle · Ballistic';

export const AEGIS_RULES = ['Utility slots: last two are Gear Slots.'];

export const PHALANX_RULES = ['Tactical Rigging adds no slot.'];

export const LMG_RULES = ['Takes a Utility slot.'];
