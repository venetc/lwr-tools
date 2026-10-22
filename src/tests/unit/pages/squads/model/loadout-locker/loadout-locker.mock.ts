import type {
  Armor,
  Equipment,
  ItemRules,
  Loadout,
  LoadoutBlockReason,
  LoadoutCatalogItem,
  LoadoutItemId,
  LoadoutWearer,
  Weapon,
} from '@entities/loadout';

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

const VEST: LoadoutCatalogItem = { kind: 'armor', item: armorMock({ id: 'tactical-vest', name: 'Vest', hp: 3, defense: 5, utilitySlots: 2 }) };

const PHALANX: LoadoutCatalogItem = { kind: 'armor', item: armorMock({ id: 'phalanx-armor', name: 'Phalanx' }) };

const AEGIS: LoadoutCatalogItem = { kind: 'armor', item: armorMock({ id: 'aegis-armor', name: 'Aegis' }) };

const GHOST: LoadoutCatalogItem = { kind: 'armor', item: armorMock({ id: 'ghost-armor', name: 'Ghost' }) };

const PALADIN: LoadoutCatalogItem = { kind: 'armor', item: armorMock({ id: 'mec1-paladin', name: 'Paladin', unit: 'mec' }) };

const RIFLE: LoadoutCatalogItem = {
  kind: 'weapon',
  item: weaponMock({ id: 'assault-rifle', name: 'Rifle', type: 'assault-rifle', slot: 'primary', damage: 4, crit: 20, ammo: 4, ammoUpgrade: 1, range: 18 }),
};

const LMG: LoadoutCatalogItem = { kind: 'weapon', item: weaponMock({ id: 'lmg', name: 'LMG', type: 'lmg', slot: 'primary' }) };

const GRENADE: LoadoutCatalogItem = { kind: 'equipment', item: equipmentMock({ id: 'he-grenade', name: 'Grenade' }) };

const SCANNER: LoadoutCatalogItem = { kind: 'equipment', item: equipmentMock({ id: 'battle-scanner', name: 'Scanner' }) };

const ALLOY_PLATING = equipmentMock({ id: 'alloy-plating', name: 'Alloy', isPassive: true, stats: [{ name: 'HP', value: '+4' }, { name: 'Weightless', value: '' }] });

const ALLOY: LoadoutCatalogItem = { kind: 'equipment', item: ALLOY_PLATING };

const CERAMIC_PLATING = equipmentMock({ id: 'ceramic-plating', name: 'Ceramic', isPassive: true });

const CERAMIC: LoadoutCatalogItem = { kind: 'equipment', item: CERAMIC_PLATING };

const CHITIN: LoadoutCatalogItem = { kind: 'equipment', item: equipmentMock({ id: 'chitin-plating', name: 'Chitin', isPassive: true }) };

const FRAYER: LoadoutCatalogItem = { kind: 'equipment', item: equipmentMock({ id: 'psi-frayer', name: 'Frayer', isPassive: true }) };

const REAPER: LoadoutCatalogItem = { kind: 'equipment', item: equipmentMock({ id: 'reaper-ammo', name: 'Reaper', isPassive: true }) };

const THUMPER: LoadoutCatalogItem = { kind: 'equipment', item: equipmentMock({ id: 'the-thumper', name: 'Thumper', units: ['mec'], isPassive: true }) };

const KINETIC_MODULE = equipmentMock({ id: 'kinetic-strike-module', name: 'Kinetic', units: ['mec'], slot: 'module' });

const KINETIC: LoadoutCatalogItem = { kind: 'equipment', item: KINETIC_MODULE };

const LOADOUT_ITEMS_MOCK: ReadonlyMap<LoadoutItemId, LoadoutCatalogItem> = new Map(
  [VEST, PHALANX, AEGIS, GHOST, PALADIN, RIFLE, LMG, GRENADE, SCANNER, ALLOY, CERAMIC, CHITIN, FRAYER, REAPER, THUMPER, KINETIC].map(found => [found.item.id, found]),
);

const BLOCK_REASONS_MOCK: ReadonlyMap<LoadoutItemId, LoadoutBlockReason[]> = new Map<LoadoutItemId, LoadoutBlockReason[]>([
  ['ghost-armor', ['needs-gene-mod']],
  ['mec1-paladin', ['wrong-unit']],
  ['battle-scanner', ['class-limited']],
  ['ceramic-plating', ['cant-stack']],
  ['chitin-plating', ['needs-gene-mod', 'cant-stack']],
  ['the-thumper', ['needs-module']],
]);

const ITEM_RULES_MOCK: ReadonlyMap<LoadoutItemId, ItemRules> = new Map<LoadoutItemId, ItemRules>([
  ['tactical-vest', { kind: 'armor', gearSlots: 0, psiSlots: 0, isRiggingIgnored: false }],
  ['phalanx-armor', { kind: 'armor', gearSlots: 0, psiSlots: 0, isRiggingIgnored: true }],
  ['aegis-armor', { kind: 'armor', gearSlots: 2, psiSlots: 0, isRiggingIgnored: false }],
  ['assault-rifle', { kind: 'weapon', takenUtilitySlots: 0 }],
  ['lmg', { kind: 'weapon', takenUtilitySlots: 1 }],
  ['he-grenade', { kind: 'equipment', cantStackWith: [], primaryTiers: null, primaryTypes: null, requiredModule: null, slotKinds: ['regular'] }],
  ['chitin-plating', {
    kind: 'equipment',
    cantStackWith: [ALLOY_PLATING, CERAMIC_PLATING],
    primaryTiers: null,
    primaryTypes: null,
    requiredModule: null,
    slotKinds: ['regular', 'gear-slot'],
  }],
  ['psi-frayer', { kind: 'equipment', cantStackWith: [], primaryTiers: null, primaryTypes: null, requiredModule: null, slotKinds: ['regular', 'gear-slot', 'psi-slot'] }],
  ['reaper-ammo', { kind: 'equipment', cantStackWith: [], primaryTiers: ['laser', 'pulse'], primaryTypes: ['assault-rifle'], requiredModule: null, slotKinds: ['regular', 'gear-slot'] }],
  ['the-thumper', { kind: 'equipment', cantStackWith: [], primaryTiers: null, primaryTypes: null, requiredModule: KINETIC_MODULE, slotKinds: ['regular', 'gear-slot'] }],
  ['kinetic-strike-module', { kind: 'equipment', cantStackWith: [], primaryTiers: null, primaryTypes: null, requiredModule: null, slotKinds: [] }],
]);

/**
 * Stub of `findLoadoutItem` over the items of the mock.
 *
 * @param id item id.
 */
export const findLoadoutItemStub = (id: LoadoutItemId) => LOADOUT_ITEMS_MOCK.get(id) ?? null;

/**
 * Stub of `blockReasons`: the reasons of the item in any slot; none for an item not listed.
 *
 * @param id item id.
 */
export const blockReasonsStub = (id: LoadoutItemId) => BLOCK_REASONS_MOCK.get(id) ?? [];

/**
 * Stub of `itemRules` over the rules of the mock.
 *
 * @param id item id.
 */
export const itemRulesStub = (id: LoadoutItemId) => ITEM_RULES_MOCK.get(id) ?? null;

export const ASSAULT: LoadoutWearer = { unit: 'biosoldier', classId: 'assault', hasGeneMod: false, hasPsionicAbility: false, isOfficer: false };

export const LOADOUT: Loadout = { armor: 'tactical-vest', primary: 'assault-rifle', secondary: null, utility: [null, null, null], modules: [] };

export const ARMOR_SLOT_ITEMS = [VEST, GHOST, PALADIN, PHALANX, AEGIS];

export const ARMOR_LOCKER_IDS = ['tactical-vest', 'phalanx-armor', 'aegis-armor', 'ghost-armor'];

export const UTILITY_SLOT_ITEMS = [GRENADE, SCANNER, ALLOY, CERAMIC, CHITIN, THUMPER];

export const UTILITY_LOCKER_IDS = ['he-grenade', 'alloy-plating', 'battle-scanner', 'ceramic-plating', 'chitin-plating', 'the-thumper'];

export const GHOST_LABEL = 'Ghost, Needs Gene mod';

export const VEST_LABEL = 'Vest, Equipped';

export const SCANNER_REASON = 'CLASS-LIMITED ITEM';

export const CERAMIC_REASON = 'CAN\'T STACK';

export const THUMPER_REASON = 'Needs Kinetic';

export const ALLOY_SUMMARY = 'HP +4 · Weightless';

export const CHITIN_REASONS = ['Needs Gene mod', 'CAN\'T STACK'];

export const CHITIN_RULES = ['Can\'t stack with Alloy, Ceramic.', 'Fits a Gear Slot.'];

export const REAPER_RULES = ['Primary weapon: Laser/Pulse · Assault Rifle.', 'Fits a Gear Slot.'];

export const THUMPER_RULES = ['Needs Kinetic.', 'Fits a Gear Slot.'];

export const GRENADE_RULES = ['Not for Gear Slots or Psi Slots.'];

export const FRAYER_RULES = ['Fits a Gear Slot or a Psi Slot.'];

export const RIFLE_STATS = [
  { name: 'Dmg', value: '4' },
  { name: 'Crit', value: '+20' },
  { name: 'Ammo', value: '4 (+1 upg)' },
  { name: 'Range', value: '18' },
];

export const RIFLE_TYPE = 'Assault Rifle · Ballistic';

export const VEST_STATS = [
  { name: 'HP', value: '+3' },
  { name: 'Def', value: '+5' },
  { name: 'Utility slots', value: '2' },
];

export const AEGIS_RULES = ['Utility slots: last two are Gear Slots.'];

export const PHALANX_RULES = ['Tactical Rigging adds no slot.'];

export const LMG_RULES = ['Takes a Utility slot.'];
