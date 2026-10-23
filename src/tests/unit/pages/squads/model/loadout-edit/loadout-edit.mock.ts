import type { Armor, Equipment, Loadout, LoadoutCatalogItem, LoadoutFit, LoadoutItemId, LoadoutWearer, UtilitySlotSources, Weapon } from '@entities/loadout';

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
  ['tactical-vest', { kind: 'armor', item: armorMock({ id: 'tactical-vest', name: 'Vest' }) }],
  ['aegis-armor', { kind: 'armor', item: armorMock({ id: 'aegis-armor', name: 'Aegis' }) }],
  ['aurora-armor', { kind: 'armor', item: armorMock({ id: 'aurora-armor', name: 'Aurora' }) }],
  ['titan-armor', { kind: 'armor', item: armorMock({ id: 'titan-armor', name: 'Titan' }) }],
  ['assault-rifle', { kind: 'weapon', item: weaponMock({ id: 'assault-rifle', name: 'Rifle', type: 'assault-rifle', slot: 'primary' }) }],
  ['laser-rifle', { kind: 'weapon', item: weaponMock({ id: 'laser-rifle', name: 'Laser', type: 'assault-rifle', slot: 'primary' }) }],
  ['lmg', { kind: 'weapon', item: weaponMock({ id: 'lmg', name: 'LMG', type: 'lmg', slot: 'primary' }) }],
  ['rocket-launcher', { kind: 'weapon', item: weaponMock({ id: 'rocket-launcher', name: 'Launcher', type: 'rocket-launcher', slot: 'secondary' }) }],
  ['he-grenade', { kind: 'equipment', item: equipmentMock({ id: 'he-grenade', name: 'Grenade' }) }],
  ['ceramic-plating', { kind: 'equipment', item: equipmentMock({ id: 'ceramic-plating', name: 'Ceramic' }) }],
  ['reaper-ammo', { kind: 'equipment', item: equipmentMock({ id: 'reaper-ammo', name: 'Reaper' }) }],
  ['the-thumper', { kind: 'equipment', item: equipmentMock({ id: 'the-thumper', name: 'Thumper', units: ['mec'], requiredModule: 'kinetic-strike-module' }) }],
  ['kinetic-strike-module', { kind: 'equipment', item: equipmentMock({ id: 'kinetic-strike-module', name: 'Kinetic', units: ['mec'], slot: 'module' }) }],
]);

/**
 * Stub of `findLoadoutItem` over the items of the mock.
 *
 * @param id item id.
 */
export const findLoadoutItemStub = (id: LoadoutItemId) => LOADOUT_ITEMS_MOCK.get(id) ?? null;

export const ASSAULT: LoadoutWearer = { unit: 'biosoldier', classId: 'assault', hasGeneMod: false, hasPsionicAbility: false, isOfficer: false };

export const JAEGER: LoadoutWearer = { unit: 'mec', classId: 'jaeger', hasGeneMod: false, hasPsionicAbility: false, isOfficer: false };

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

export const AEGIS_SOURCES: UtilitySlotSources = { armor: 3, rigging: 1, weapon: 0, gearSlots: 2, psiSlots: 0, count: 4, isCapped: false };

export const AEGIS_FORMULA = 'Aegis 3 + Tactical Rigging 1 = 4 Utility slots, last two are Gear Slots.';

export const AURORA_SOURCES: UtilitySlotSources = { armor: 3, rigging: 1, weapon: 0, gearSlots: 0, psiSlots: 1, count: 4, isCapped: false };

export const AURORA_FORMULA = 'Aurora 3 + Tactical Rigging 1 = 4 Utility slots, last one is a Psi Slot.';

export const LMG_SOURCES: UtilitySlotSources = { armor: 2, rigging: 1, weapon: -1, gearSlots: 0, psiSlots: 0, count: 2, isCapped: false };

export const LMG_FORMULA = 'Vest 2 + Tactical Rigging 1 − LMG 1 = 2 Utility slots.';

export const ONE_SLOT_SOURCES: UtilitySlotSources = { armor: 2, rigging: 0, weapon: -1, gearSlots: 0, psiSlots: 0, count: 1, isCapped: false };

export const ONE_SLOT_FORMULA = 'Vest 2 − LMG 1 = 1 Utility slot.';

export const TITAN_SOURCES: UtilitySlotSources = { armor: 4, rigging: 1, weapon: 0, gearSlots: 0, psiSlots: 0, count: 4, isCapped: true };

export const TITAN_FORMULA = 'Titan 4 + Tactical Rigging 1 = 4 Utility slots (max 4).';

export const UNCHANGED_FIT: LoadoutFit = { loadout: createLoadoutMock({ utility: [null, 'he-grenade', null] }), changes: [] };

export const GRENADE_MOVED_FIT: LoadoutFit = {
  loadout: createLoadoutMock({ armor: 'aegis-armor', utility: ['he-grenade', null, null, null] }),
  changes: [{ kind: 'moved', item: 'he-grenade', from: 2, to: 0 }],
};

export const GRENADE_MOVED_NOTES = ['Utility slots: 3 → 4.', 'Grenade moved to Utility.'];

export const SHRUNK_FIT: LoadoutFit = {
  loadout: createLoadoutMock({ primary: 'lmg', utility: [null, 'he-grenade'] }),
  changes: [{ kind: 'removed', slot: 'utility', item: 'ceramic-plating', reason: 'slot-removed' }],
};

export const SHRUNK_NOTES = ['Utility slots: 3 → 2.', 'Ceramic removed: slot removed.'];

export const REAPER_REMOVED_FIT: LoadoutFit = {
  loadout: createLoadoutMock(),
  changes: [{ kind: 'removed', slot: 'utility', item: 'reaper-ammo', reason: 'unsupported-weapon' }],
};

export const REAPER_REMOVED_NOTES = ['Reaper removed: unsupported weapon.'];

export const LASER_REPLACED_FIT: LoadoutFit = {
  loadout: createLoadoutMock(),
  changes: [{ kind: 'replaced', slot: 'primary', item: 'laser-rifle', by: 'assault-rifle', reason: 'class-limited' }],
};

export const LASER_REPLACED_NOTES = ['Laser replaced with Rifle: class-limited item.'];

export const LAUNCHER_ADDED_FIT: LoadoutFit = {
  loadout: createLoadoutMock({ secondary: 'rocket-launcher' }),
  changes: [{ kind: 'added', slot: 'secondary', item: 'rocket-launcher' }],
};

export const LAUNCHER_ADDED_NOTES = ['Launcher added to Secondary.'];

export const THUMPER_REMOVED_FIT: LoadoutFit = {
  loadout: createLoadoutMock({ modules: [null] }),
  changes: [{ kind: 'removed', slot: 'utility', item: 'the-thumper', reason: 'needs-module' }],
};

export const THUMPER_REMOVED_NOTES = ['Thumper removed: needs Kinetic.'];

export const PALADIN_LOADOUT = createLoadoutMock({ armor: 'mec1-paladin', primary: 'minigun', utility: [null, null], modules: [null] });

export const DAUNTLESS_FIT: LoadoutFit = {
  loadout: createLoadoutMock({ armor: 'hmec3-dauntless', primary: 'minigun', utility: [null, null, null], modules: [null, null, null] }),
  changes: [],
};

export const DAUNTLESS_NOTES = ['Module slots: 1 → 3.', 'Utility slots: 2 → 3.'];

export const DEFENDER_FIT: LoadoutFit = {
  loadout: createLoadoutMock({ armor: 'hmec2-defender', primary: 'minigun', utility: [null, null], modules: [null, null] }),
  changes: [],
};

export const DEFENDER_NOTES = ['Module slots: 1 → 2.'];
