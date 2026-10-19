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
  info: '',
  ...content,
});

/**
 * SHIV type record with zero stats besides the given fields.
 *
 * @param content fields that differ from the empty record.
 */
const shivTypeMock = (content: Pick<ShivTypeContent, 'code' | 'name' | 'utilitySlots'>): ShivTypeContent => ({
  hp: 0,
  damageReduction: 0,
  critResist: 0,
  defense: 0,
  mobility: 0,
  aim: 0,
  fuel: 0,
  info: '',
  ...content,
});

export const ARMOR_CONTENT_MOCK: Record<string, ArmorContent> = {
  'tactical-vest': armorMock({ code: 1, unit: 'biosoldier', name: 'Vest', utilitySlots: 2 }),
  'phalanx-armor': armorMock({ code: 3, unit: 'biosoldier', name: 'Phalanx', utilitySlots: 3 }),
  'aegis-armor': armorMock({ code: 6, unit: 'biosoldier', name: 'Aegis', utilitySlots: 3, gearSlots: 2 }),
  'titan-armor': armorMock({ code: 9, unit: 'biosoldier', name: 'Titan', utilitySlots: 4 }),
  'seraph-armor': armorMock({ code: 10, unit: 'biosoldier', name: 'Seraph', utilitySlots: 3, gearSlots: 1, requires: 'officer' }),
  'ghost-armor': armorMock({ code: 12, unit: 'biosoldier', name: 'Ghost', utilitySlots: 2, gearSlots: 1, requires: 'gene-mod' }),
  'aurora-armor': armorMock({ code: 13, unit: 'biosoldier', name: 'Aurora', utilitySlots: 3, psiSlots: 1, requires: 'psionic' }),
  'mec1-paladin': armorMock({ code: 15, unit: 'mec', name: 'Paladin', category: 'standard', utilitySlots: 2, moduleSlots: 1 }),
  'lmec3-vindicator': armorMock({ code: 21, unit: 'mec', name: 'Vindicator', utilitySlots: 3, moduleSlots: 3 }),
};

export const WEAPON_CONTENT_MOCK: Record<string, WeaponContent> = {
  'assault-rifle': weaponMock({ code: 1, unit: 'biosoldier', name: 'Rifle', tier: 'ballistic', type: 'assault-rifle', slot: 'primary' }),
  'lmg': weaponMock({ code: 7, unit: 'biosoldier', name: 'LMG', tier: 'ballistic', type: 'lmg', slot: 'primary', utilitySlots: -1, classes: ['gunner'] }),
  'strike-rifle': weaponMock({ code: 8, unit: 'biosoldier', name: 'Strike', tier: 'ballistic', type: 'strike-rifle', slot: 'primary', classes: ['sniper', 'scout'] }),
  'minigun': weaponMock({ code: 10, unit: 'mec', name: 'Minigun', tier: 'ballistic', type: 'mec-weapon', slot: 'primary' }),
  'autocannon': weaponMock({ code: 11, unit: 'shiv', name: 'Autocannon', tier: 'ballistic', type: 'autocannon', slot: 'primary' }),
  'pistol': weaponMock({ code: 13, unit: 'biosoldier', name: 'Pistol', tier: 'ballistic', type: 'pistol', slot: 'secondary', classes: ['sniper', 'scout', 'assault'] }),
  'rocket-launcher': weaponMock({ code: 16, unit: 'biosoldier', name: 'Launcher', tier: 'ballistic', type: 'rocket-launcher', slot: 'secondary', classes: ['rocketeer'] }),
  'laser-rifle': weaponMock({ code: 17, unit: 'biosoldier', name: 'Laser', tier: 'laser', type: 'assault-rifle', slot: 'primary' }),
  'stun-rifle': weaponMock({ code: 31, unit: 'biosoldier', name: 'Stun', tier: 'arc', type: 'stun-rifle', slot: 'primary', utilitySlots: -1 }),
};

export const EQUIPMENT_CONTENT_MOCK: Record<string, EquipmentContent> = {
  'he-grenade': equipmentMock({ code: 1, units: ['biosoldier'], slot: 'utility', name: 'Grenade' }),
  'concussion-grenade': equipmentMock({ code: 3, units: ['biosoldier'], slot: 'utility', name: 'Concussion', stackGroup: 'disorient-grenade' }),
  'battle-scanner': equipmentMock({ code: 5, units: ['biosoldier'], slot: 'utility', name: 'Scanner', classes: ['scout'] }),
  'psi-grenade': equipmentMock({ code: 10, units: ['biosoldier'], slot: 'utility', name: 'Psi Grenade', requires: 'psionic', stackGroup: 'disorient-grenade' }),
  'medikit': equipmentMock({ code: 11, units: ['biosoldier'], slot: 'utility', name: 'Medikit' }),
  'chitin-plating': equipmentMock({ code: 13, units: ['biosoldier'], slot: 'utility', name: 'Chitin', requires: 'gene-mod', isPassive: true, stackGroup: 'plating' }),
  'alloy-plating': equipmentMock({ code: 14, units: ['biosoldier'], slot: 'utility', name: 'Alloy', isPassive: true, stackGroup: 'plating' }),
  'psi-frayer': equipmentMock({ code: 15, units: ['biosoldier'], slot: 'utility', name: 'Frayer', requires: 'psionic', isPassive: true }),
  'ceramic-plating': equipmentMock({ code: 23, units: ['biosoldier'], slot: 'utility', name: 'Ceramic', isPassive: true, stackGroup: 'plating' }),
  'drum-mags': equipmentMock({ code: 24, units: ['biosoldier'], slot: 'utility', name: 'Drum', isPassive: true, stackGroup: 'ammo-capacity', primaryTypes: ['assault-rifle'] }),
  'the-thumper': equipmentMock({ code: 37, units: ['mec'], slot: 'utility', name: 'Thumper', isPassive: true, requiredModule: 'kinetic-strike-module' }),
  'motion-tracker': equipmentMock({ code: 40, units: ['shiv'], slot: 'utility', name: 'Tracker' }),
  'scope': equipmentMock({ code: 47, units: ['biosoldier', 'mec', 'shiv'], slot: 'utility', name: 'Scope', isPassive: true, stackGroup: 'scope' }),
  'reaper-ammo': equipmentMock({ code: 48, units: ['biosoldier', 'mec', 'shiv'], slot: 'utility', name: 'Reaper', isPassive: true, stackGroup: 'ammo-type', primaryTiers: ['laser'] }),
  'flamethrower': equipmentMock({ code: 56, units: ['mec'], slot: 'module', name: 'Flamethrower' }),
  'kinetic-strike-module': equipmentMock({ code: 57, units: ['mec'], slot: 'module', name: 'Kinetic' }),
};

export const SHIV_TYPE_CONTENT_MOCK: Record<string, ShivTypeContent> = {
  'shiv': shivTypeMock({ code: 1, name: 'SHIV', utilitySlots: 2 }),
  'alloy-shiv': shivTypeMock({ code: 2, name: 'Alloy SHIV', utilitySlots: 4 }),
};

export const ASSAULT: LoadoutWearer = { unit: 'biosoldier', classId: 'assault', hasGeneMod: false, hasPsionicAbility: false, isOfficer: false };

export const SCOUT: LoadoutWearer = { ...ASSAULT, classId: 'scout' };

export const GUNNER: LoadoutWearer = { ...ASSAULT, classId: 'gunner' };

export const ROCKETEER: LoadoutWearer = { ...ASSAULT, classId: 'rocketeer' };

export const OFFICER: LoadoutWearer = { ...ASSAULT, isOfficer: true };

export const GENE_MODDED: LoadoutWearer = { ...ASSAULT, hasGeneMod: true };

export const PSIONIC: LoadoutWearer = { ...ASSAULT, hasPsionicAbility: true };

export const MEC: LoadoutWearer = { unit: 'mec', classId: 'marauder', hasGeneMod: false, hasPsionicAbility: false, isOfficer: false };

export const SHIV: LoadoutWearer = { unit: 'shiv', classId: null, hasGeneMod: false, hasPsionicAbility: false, isOfficer: false };

/**
 * Fresh biosoldier loadout with its own slot arrays.
 *
 * @param loadout fields that differ from a Vest, a rifle and two empty utility slots.
 */
export const createLoadoutMock = (loadout: Partial<Loadout> = {}): Loadout => ({
  armor: 'tactical-vest',
  primary: 'assault-rifle',
  secondary: null,
  utility: [null, null],
  modules: [],
  ...loadout,
});
