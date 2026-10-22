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
  'tactical-vest': armorMock({ code: 1, unit: 'biosoldier', name: 'Vest', utilitySlots: 2 }),
  'aegis-armor': armorMock({ code: 6, unit: 'biosoldier', name: 'Aegis', utilitySlots: 3, gearSlots: 2 }),
  'titan-armor': armorMock({ code: 9, unit: 'biosoldier', name: 'Titan', utilitySlots: 4 }),
  'ghost-armor': armorMock({ code: 12, unit: 'biosoldier', name: 'Ghost', utilitySlots: 2, gearSlots: 1 }),
  'aurora-armor': armorMock({ code: 13, unit: 'biosoldier', name: 'Aurora', utilitySlots: 3, psiSlots: 1 }),
  'mec1-paladin': armorMock({ code: 15, unit: 'mec', name: 'Paladin', category: 'standard', utilitySlots: 2, moduleSlots: 1 }),
};

export const WEAPON_CONTENT_MOCK: Record<string, WeaponContent> = {
  'assault-rifle': weaponMock({ code: 1, unit: 'biosoldier', name: 'Rifle', tier: 'ballistic', type: 'assault-rifle', slot: 'primary' }),
  'lmg': weaponMock({ code: 7, unit: 'biosoldier', name: 'LMG', tier: 'ballistic', type: 'lmg', slot: 'primary', utilitySlots: -1 }),
  'pistol': weaponMock({ code: 13, unit: 'biosoldier', name: 'Pistol', tier: 'ballistic', type: 'pistol', slot: 'secondary', classes: ['assault'] }),
  'rocket-launcher': weaponMock({ code: 16, unit: 'biosoldier', name: 'Launcher', tier: 'ballistic', type: 'rocket-launcher', slot: 'secondary', classes: ['rocketeer'] }),
  'laser-rifle': weaponMock({ code: 17, unit: 'biosoldier', name: 'Laser', tier: 'laser', type: 'assault-rifle', slot: 'primary' }),
  'minigun': weaponMock({ code: 10, unit: 'mec', name: 'Minigun', tier: 'ballistic', type: 'mec-weapon', slot: 'primary' }),
};

export const EQUIPMENT_CONTENT_MOCK: Record<string, EquipmentContent> = {
  'he-grenade': equipmentMock({ code: 1, units: ['biosoldier'], slot: 'utility', name: 'Grenade' }),
  'ceramic-plating': equipmentMock({ code: 23, units: ['biosoldier'], slot: 'utility', name: 'Ceramic', isPassive: true, stackGroup: 'plating' }),
  'reaper-ammo': equipmentMock({ code: 48, units: ['biosoldier'], slot: 'utility', name: 'Reaper', isPassive: true, stackGroup: 'ammo-type', primaryTiers: ['laser'] }),
  'the-thumper': equipmentMock({ code: 37, units: ['mec'], slot: 'utility', name: 'Thumper', isPassive: true, requiredModule: 'kinetic-strike-module' }),
  'kinetic-strike-module': equipmentMock({ code: 57, units: ['mec'], slot: 'module', name: 'Kinetic' }),
};

export const SHIV_TYPE_CONTENT_MOCK: Record<string, ShivTypeContent> = {};

export const ASSAULT: LoadoutWearer = { unit: 'biosoldier', classId: 'assault', hasGeneMod: false, hasPsionicAbility: false, isOfficer: false };

export const ROCKETEER: LoadoutWearer = { ...ASSAULT, classId: 'rocketeer' };

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

export const AEGIS_FORMULA = 'Aegis 3 + Tactical Rigging 1 = 4 Utility slots, last two are Gear Slots.';

export const AURORA_FORMULA = 'Aurora 3 + Tactical Rigging 1 = 4 Utility slots, last one is a Psi Slot.';

export const LMG_FORMULA = 'Vest 2 + Tactical Rigging 1 − LMG 1 = 2 Utility slots.';

export const TITAN_FORMULA = 'Titan 4 + Tactical Rigging 1 = 4 Utility slots (max 4).';

export const CERAMIC_IN_LAST_SLOT = createLoadoutMock({ utility: [null, 'he-grenade', 'ceramic-plating'] });

export const GRENADE_IN_LAST_SLOT = createLoadoutMock({ utility: [null, null, 'he-grenade'] });

export const GRENADE_MOVED_NOTES = ['Utility slots: 3 → 4.', 'Grenade moved to Utility.'];

export const SHRUNK_NOTES = ['Utility slots: 3 → 2.', 'Ceramic removed: slot removed.'];

export const REAPER_ON_LASER = createLoadoutMock({ primary: 'laser-rifle', utility: ['reaper-ammo', null, null] });

export const REAPER_REMOVED_NOTES = ['Reaper removed: unsupported weapon.'];

export const THUMPER_MEC = createLoadoutMock({ armor: 'mec1-paladin', primary: 'minigun', utility: ['the-thumper', null], modules: ['kinetic-strike-module'] });

export const THUMPER_REMOVED_NOTES = ['Thumper removed: needs Module.'];
