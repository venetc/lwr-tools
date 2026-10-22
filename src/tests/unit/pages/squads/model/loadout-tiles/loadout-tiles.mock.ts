import type { Armor, Equipment, Loadout, LoadoutCatalogItem, LoadoutItemId, LoadoutSlots, LoadoutWearer, Weapon } from '@entities/loadout';

/**
 * Biosoldier armor with zero stats besides the given fields.
 *
 * @param armor fields that differ from the empty armor.
 */
const armorMock = (armor: Pick<Armor, 'id' | 'name'> & Partial<Armor>): Armor => ({
  code: 1,
  unit: 'biosoldier',
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
  requires: null,
  info: '',
  icon: '',
  grants: [],
  ...armor,
});

/**
 * Biosoldier weapon with zero stats besides the given fields.
 *
 * @param weapon fields that differ from the empty weapon.
 */
const weaponMock = (weapon: Pick<Weapon, 'id' | 'name' | 'type' | 'slot'> & Partial<Weapon>): Weapon => ({
  code: 1,
  unit: 'biosoldier',
  tier: 'ballistic',
  classes: null,
  damage: 0,
  penetration: 0,
  crit: 0,
  aim: 0,
  ammo: 0,
  mobility: 0,
  range: 0,
  utilitySlots: 0,
  ammoUpgrade: 0,
  damageUpgrade: 0,
  critDamage: 0,
  environmentDamage: 0,
  radius: 0,
  canCrit: true,
  vsMechanical: null,
  info: '',
  icon: '',
  grants: [],
  ...weapon,
});

/**
 * Biosoldier utility equipment without stats besides the given fields.
 *
 * @param equipment fields that differ from the empty item.
 */
const equipmentMock = (equipment: Pick<Equipment, 'id' | 'name'> & Partial<Equipment>): Equipment => ({
  code: 1,
  units: ['biosoldier'],
  slot: 'utility',
  classes: null,
  requires: null,
  isPassive: false,
  stackGroup: null,
  primaryTiers: null,
  primaryTypes: null,
  requiredModule: null,
  stats: [],
  info: null,
  icon: '',
  grants: [],
  ...equipment,
});

const LOADOUT_ITEMS_MOCK: ReadonlyMap<LoadoutItemId, LoadoutCatalogItem> = new Map<LoadoutItemId, LoadoutCatalogItem>([
  ['tactical-vest', { kind: 'armor', item: armorMock({ id: 'tactical-vest', name: 'Vest', icon: 'vest.png' }) }],
  ['rocket-launcher', { kind: 'weapon', item: weaponMock({ id: 'rocket-launcher', name: 'Launcher', type: 'rocket-launcher', slot: 'secondary' }) }],
  ['medikit', { kind: 'equipment', item: equipmentMock({ id: 'medikit', name: 'Medikit' }) }],
]);

/**
 * Stub of `findLoadoutItem` over the items of the mock.
 *
 * @param id item id.
 */
export const findLoadoutItemStub = (id: LoadoutItemId) => LOADOUT_ITEMS_MOCK.get(id) ?? null;

export const ASSAULT: LoadoutWearer = { unit: 'biosoldier', classId: 'assault', hasGeneMod: false, hasPsionicAbility: false, isOfficer: false };

export const MEC: LoadoutWearer = { unit: 'mec', classId: 'goliath', hasGeneMod: false, hasPsionicAbility: false, isOfficer: false };

export const SHIV: LoadoutWearer = { unit: 'shiv', classId: null, hasGeneMod: false, hasPsionicAbility: false, isOfficer: false };

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

export const BIOSOLDIER_SLOTS: LoadoutSlots = { hasSecondary: true, isSecondaryRequired: false, utility: ['regular', 'regular', 'regular'], moduleCount: 0 };

export const BIOSOLDIER_CAPTIONS = ['Armor', 'Primary', 'Secondary', 'Utility', 'Utility', 'Utility'];

export const NO_SECONDARY_SLOTS: LoadoutSlots = { ...BIOSOLDIER_SLOTS, hasSecondary: false };

export const NO_SECONDARY_CAPTIONS = ['Armor', 'Primary', 'Utility', 'Utility', 'Utility'];

export const MEC_LOADOUT = createLoadoutMock({ armor: 'mec1-paladin', primary: 'minigun', utility: [null, null], modules: ['flamethrower'] });

export const MEC_SLOTS: LoadoutSlots = { hasSecondary: false, isSecondaryRequired: false, utility: ['regular', 'regular'], moduleCount: 1 };

export const MEC_CAPTIONS = ['MEC exoskeleton', 'Primary', 'Module', 'Utility', 'Utility'];

export const MEC_TILE_SIZES = [true, true, false, false, false];

export const SHIV_LOADOUT = createLoadoutMock({ armor: 'shiv', primary: 'autocannon', utility: [null, null] });

export const SHIV_SLOTS: LoadoutSlots = { hasSecondary: false, isSecondaryRequired: false, utility: ['regular', 'regular'], moduleCount: 0 };

export const SHIV_CAPTIONS = ['SHIV type', 'Primary', 'Utility', 'Utility'];

export const AEGIS_SLOTS: LoadoutSlots = { ...BIOSOLDIER_SLOTS, utility: ['regular', 'regular', 'gear-slot', 'gear-slot'] };

export const AEGIS_TONES = ['regular', 'regular', 'regular', 'regular', 'regular', 'gear-slot', 'gear-slot'];

export const AURORA_SLOTS: LoadoutSlots = { ...BIOSOLDIER_SLOTS, utility: ['regular', 'regular', 'regular', 'psi-slot'] };

export const AURORA_CAPTIONS = ['Armor', 'Primary', 'Secondary', 'Utility', 'Utility', 'Utility', 'Psi Slot'];

export const ROCKETEER_LOADOUT = createLoadoutMock({ secondary: 'rocket-launcher' });

export const MEDIKIT_LOADOUT = createLoadoutMock({ utility: ['medikit', null, null] });

export const VEST_TILE_ITEM = { name: 'Vest', icon: 'vest.png' };
