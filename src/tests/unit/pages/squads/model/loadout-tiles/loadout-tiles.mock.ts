import type { ArmorContent } from '@entities/loadout/model/armors';
import type { EquipmentContent } from '@entities/loadout/model/equipment';
import type { LoadoutWearer } from '@entities/loadout/model/loadout';
import type { ShivTypeContent } from '@entities/loadout/model/shiv-types';
import type { WeaponContent } from '@entities/loadout/model/weapons';
import type { UnitLoadout } from '@features/manage-squads/model/squad';

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
  gearMountSlots: 0,
  psiMountSlots: 0,
  fuel: 0,
  info: '',
  ...content,
});

/**
 * Weapon record with zero stats besides the given fields.
 *
 * @param content fields that differ from the empty record.
 */
const weaponMock = (content: Pick<WeaponContent, 'code' | 'unit' | 'name' | 'type' | 'slot'> & Partial<WeaponContent>): WeaponContent => ({
  tier: 'ballistic',
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

export const ARMOR_CONTENT_MOCK: Record<string, ArmorContent> = {
  'tactical-vest': armorMock({ code: 1, unit: 'biosoldier', name: 'Vest', utilitySlots: 2 }),
  'aegis-armor': armorMock({ code: 6, unit: 'biosoldier', name: 'Aegis', utilitySlots: 3, gearMountSlots: 2 }),
  'aurora-armor': armorMock({ code: 13, unit: 'biosoldier', name: 'Aurora', utilitySlots: 3, psiMountSlots: 1 }),
  'mec1-paladin': armorMock({ code: 15, unit: 'mec', name: 'Paladin', category: 'standard', utilitySlots: 2, moduleSlots: 1 }),
};

export const WEAPON_CONTENT_MOCK: Record<string, WeaponContent> = {
  'assault-rifle': weaponMock({ code: 1, unit: 'biosoldier', name: 'Rifle', type: 'assault-rifle', slot: 'primary' }),
  'minigun': weaponMock({ code: 10, unit: 'mec', name: 'Minigun', type: 'mec-weapon', slot: 'primary' }),
  'autocannon': weaponMock({ code: 11, unit: 'shiv', name: 'Autocannon', type: 'autocannon', slot: 'primary' }),
  'pistol': weaponMock({ code: 13, unit: 'biosoldier', name: 'Pistol', type: 'pistol', slot: 'secondary', classes: ['assault'] }),
  'rocket-launcher': weaponMock({ code: 16, unit: 'biosoldier', name: 'Launcher', type: 'rocket-launcher', slot: 'secondary', classes: ['rocketeer'] }),
};

export const EQUIPMENT_CONTENT_MOCK: Record<string, EquipmentContent> = {
  medikit: equipmentMock({ code: 11, units: ['biosoldier'], slot: 'utility', name: 'Medikit' }),
  flamethrower: equipmentMock({ code: 56, units: ['mec'], slot: 'module', name: 'Flamethrower' }),
};

export const SHIV_TYPE_CONTENT_MOCK: Record<string, ShivTypeContent> = {
  shiv: { code: 1, name: 'SHIV', hp: 0, damageReduction: 0, critResist: 0, defense: 0, mobility: 0, aim: 0, utilitySlots: 2, fuel: 0, info: '' },
};

export const ARMOR_ICON_MOCK = { 'tactical-vest': 'vest.png' };

export const ASSAULT: LoadoutWearer = { unit: 'biosoldier', classId: 'assault', hasGeneMod: false, hasPsionicAbility: false, isOfficer: false };

export const GUNNER: LoadoutWearer = { ...ASSAULT, classId: 'gunner' };

export const ROCKETEER: LoadoutWearer = { ...ASSAULT, classId: 'rocketeer' };

export const MEC: LoadoutWearer = { unit: 'mec', classId: 'goliath', hasGeneMod: false, hasPsionicAbility: false, isOfficer: false };

export const SHIV: LoadoutWearer = { unit: 'shiv', classId: null, hasGeneMod: false, hasPsionicAbility: false, isOfficer: false };

/**
 * Fresh biosoldier Loadout with its own slot arrays.
 *
 * @param loadout fields that differ from a Vest, a rifle and three empty utility slots.
 */
export const createLoadoutMock = (loadout: Partial<UnitLoadout> = {}): UnitLoadout => ({
  armor: 'tactical-vest',
  primary: 'assault-rifle',
  secondary: null,
  utility: [null, null, null],
  modules: [],
  ...loadout,
});

export const BIOSOLDIER_CAPTIONS = ['Armor', 'Primary', 'Secondary', 'Utility', 'Utility', 'Utility'];

export const GUNNER_CAPTIONS = ['Armor', 'Primary', 'Utility', 'Utility', 'Utility'];

export const MEC_LOADOUT = createLoadoutMock({ armor: 'mec1-paladin', primary: 'minigun', utility: [null, null], modules: ['flamethrower'] });

export const MEC_CAPTIONS = ['MEC exoskeleton', 'Primary', 'Module', 'Utility', 'Utility'];

export const SHIV_LOADOUT = createLoadoutMock({ armor: 'shiv', primary: 'autocannon', utility: [null, null] });

export const SHIV_CAPTIONS = ['SHIV type', 'Primary', 'Utility', 'Utility'];

export const AEGIS_LOADOUT = createLoadoutMock({ armor: 'aegis-armor', utility: [null, null, null, null] });

export const AEGIS_TONES = ['regular', 'regular', 'regular', 'regular', 'regular', 'gear-mount', 'gear-mount'];

export const AURORA_LOADOUT = createLoadoutMock({ armor: 'aurora-armor', utility: [null, null, null, null] });

export const AURORA_CAPTIONS = ['Armor', 'Primary', 'Secondary', 'Utility', 'Utility', 'Utility', 'Psi Mount'];

export const ROCKETEER_LOADOUT = createLoadoutMock({ secondary: 'rocket-launcher' });

export const MEDIKIT_LOADOUT = createLoadoutMock({ utility: ['medikit', null, null] });

export const VEST_TILE_ITEM = { name: 'Vest', icon: 'vest.png' };

export const MEC_TILE_SIZES = [true, true, false, false, false];

export const UNKNOWN_ARMOR_LOADOUT = createLoadoutMock({ armor: null, utility: [null, null] });

export const UNKNOWN_ARMOR_CAPTIONS = ['Armor', 'Primary', 'Utility', 'Utility'];
