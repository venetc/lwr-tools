import type { ArmorContent } from '@entities/loadout/model/armors';
import type { EquipmentContent } from '@entities/loadout/model/equipment';
import type { ShivTypeContent } from '@entities/loadout/model/shiv-types';
import type { WeaponContent } from '@entities/loadout/model/weapons';
import type { SelectedGeneMods, SelectedOfficerPerks, SelectedPsionicAbilities, SoldierClass } from '@entities/soldier';
import type { SquadUnit, UnitLoadout } from '@features/manage-squads';
import type { SquadBuild } from '@pages/squads/model/squad-build';

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

export const ARMOR_CONTENT_MOCK: Record<string, ArmorContent> = {
  'tactical-vest': armorMock({ code: 1, unit: 'biosoldier', name: 'Vest', utilitySlots: 2 }),
  'seraph-armor': armorMock({ code: 20, unit: 'biosoldier', name: 'Seraph', utilitySlots: 2, requires: 'officer' }),
  'mec1-paladin': armorMock({ code: 15, unit: 'mec', name: 'Paladin', category: 'standard', utilitySlots: 1, moduleSlots: 1 }),
};

export const WEAPON_CONTENT_MOCK: Record<string, WeaponContent> = {
  'assault-rifle': weaponMock({ code: 1, unit: 'biosoldier', name: 'Rifle', type: 'assault-rifle', slot: 'primary' }),
  'minigun': weaponMock({ code: 10, unit: 'mec', name: 'Minigun', type: 'mec-weapon', slot: 'primary' }),
  'autocannon': weaponMock({ code: 11, unit: 'shiv', name: 'Autocannon', type: 'autocannon', slot: 'primary' }),
};

export const EQUIPMENT_CONTENT_MOCK: Record<string, EquipmentContent> = {
  'psi-grenade': { code: 1, units: ['biosoldier'], slot: 'utility', name: 'Grenade', requires: 'psionic', stats: [] },
};

export const SHIV_TYPE_CONTENT_MOCK: Record<string, ShivTypeContent> = {
  shiv: { code: 1, name: 'SHIV', hp: 0, damageReduction: 0, critResist: 0, defense: 0, mobility: 0, aim: 0, utilitySlots: 2, fuel: 0, info: '' },
};

/**
 * Class with only the fields the Squad planner reads.
 *
 * @param id class id.
 * @param name class name.
 */
const soldierClassMock = (id: SoldierClass['id'], name: string) => ({ id, name } as SoldierClass);

/**
 * Biosoldier build of the Sniper class.
 *
 * @param build fields that differ from a build without gene mods, psionic abilities and officer perks.
 * @param build.geneMods gene mods by body part.
 * @param build.psionicAbilities psionic abilities by psi level.
 * @param build.officerPerks officer perks by officer rank.
 */
export const createBiosoldierBuildMock = (
  build: { geneMods?: SelectedGeneMods, psionicAbilities?: SelectedPsionicAbilities, officerPerks?: SelectedOfficerPerks } = {},
): SquadBuild => ({
  kind: 'biosoldier',
  build: {
    id: 'sniper-build',
    name: 'Overwatch Sniper',
    readonly: false,
    soldierClass: soldierClassMock('sniper', 'Sniper'),
    perks: [],
    geneMods: build.geneMods ?? [null, null, null, null, null],
    psionicAbilities: build.psionicAbilities ?? [],
    officerPerks: build.officerPerks ?? [],
  },
});

export const MEC_BUILD: SquadBuild = {
  kind: 'mec',
  build: { id: 'mec-build', name: 'Goliath Wall', readonly: false, soldierClass: soldierClassMock('goliath', 'Goliath'), perks: [] },
};

export const SHIV_BUILD: SquadBuild = {
  kind: 'shiv',
  build: { id: 'shiv-build', name: 'Alloy Support', readonly: false, perks: [] },
};

export const GENE_MODS: SelectedGeneMods = [null, 'ram', null, null, null];

export const PSIONIC_ABILITIES: SelectedPsionicAbilities = ['mind-fray'];

export const OFFICER_PERKS: SelectedOfficerPerks = ['stay-frosty'];

export const SNIPER_WEARER = { unit: 'biosoldier', classId: 'sniper', hasGeneMod: false, hasPsionicAbility: false, isOfficer: false };

export const MEC_WEARER = { unit: 'mec', classId: 'goliath', hasGeneMod: false, hasPsionicAbility: false, isOfficer: false };

export const SHIV_WEARER = { unit: 'shiv', classId: null, hasGeneMod: false, hasPsionicAbility: false, isOfficer: false };

export const SNIPER_DEFAULT_LOADOUT = { armor: 'tactical-vest', primary: 'assault-rifle', secondary: null, utility: [null, null, null], modules: [] };

export const MEC_DEFAULT_LOADOUT = { armor: 'mec1-paladin', primary: 'minigun', secondary: null, utility: [null], modules: [null] };

export const SHIV_DEFAULT_LOADOUT = { armor: 'shiv', primary: 'autocannon', secondary: null, utility: [null, null], modules: [] };

export const UNKNOWN_CODES_LOADOUT: UnitLoadout = { armor: null, primary: null, secondary: null, utility: [null, null, null], modules: [] };

export const SERAPH_LOADOUT: UnitLoadout = { armor: 'seraph-armor', primary: 'assault-rifle', secondary: null, utility: [null, null, null], modules: [] };

export const SERAPH_REPLACED = [{ kind: 'replaced', slot: 'armor', item: 'seraph-armor', by: 'tactical-vest', reason: 'needs-officer' }];

export const SNIPER_UNIT: SquadUnit = { id: 'unit-1', build: { kind: 'biosoldier', id: 'sniper-build' }, loadout: SERAPH_LOADOUT };

export const LOST_UNIT: SquadUnit = { id: 'unit-2', build: { kind: 'mec', id: 'deleted-build' }, loadout: SERAPH_LOADOUT };

export const SQUAD_BUILDS: ReadonlyMap<string, SquadBuild> = new Map([
  ['biosoldier/sniper-build', createBiosoldierBuildMock()],
  ['mec/mec-build', MEC_BUILD],
]);

export const FIT_UNIT: SquadUnit = {
  id: 'unit-3',
  build: { kind: 'biosoldier', id: 'sniper-build' },
  loadout: { armor: 'tactical-vest', primary: 'assault-rifle', secondary: null, utility: [null, null, null], modules: [] },
};

export const SECOND_SNIPER_UNIT: SquadUnit = { id: 'unit-4', build: { kind: 'biosoldier', id: 'sniper-build' }, loadout: SERAPH_LOADOUT };

export const GRENADE_UNIT: SquadUnit = {
  id: 'unit-5',
  build: { kind: 'biosoldier', id: 'sniper-build' },
  loadout: { armor: 'seraph-armor', primary: 'assault-rifle', secondary: null, utility: ['psi-grenade', null, null], modules: [] },
};

export const MEC_UNIT: SquadUnit = {
  id: 'unit-6',
  build: { kind: 'mec', id: 'mec-build' },
  loadout: { armor: 'mec1-paladin', primary: 'minigun', secondary: null, utility: ['psi-grenade'], modules: [null] },
};

export const UNKNOWN_CODES_UNIT: SquadUnit = { id: 'unit-7', build: { kind: 'biosoldier', id: 'sniper-build' }, loadout: UNKNOWN_CODES_LOADOUT };

export const SECOND_LOST_UNIT: SquadUnit = { id: 'unit-8', build: { kind: 'shiv', id: 'deleted-build' }, loadout: SERAPH_LOADOUT };

export const TOAST_TITLE = 'Loadouts updated';

export const SNIPER_BUILD_KEY = 'biosoldier/sniper-build';

export const LOST_BUILD_KEY = 'mec/deleted-build';

export const SNIPER_LINE = 'Overwatch Sniper — Seraph replaced with Vest: needs officer.';

export const TWO_SNIPERS_LINE = 'Overwatch Sniper (2 Units) — Seraph replaced with Vest: needs officer.';

export const SNIPERS_IN_ORDER_LINE = 'Overwatch Sniper (2 Units) — Seraph replaced with Vest: needs officer. Grenade removed: needs Psionic ability.';

export const MEC_LINE = 'Goliath Wall — Grenade removed: wrong unit.';

export const ONE_REMOVED_LINE = '1 Unit removed: Build not found';

export const TWO_REMOVED_LINE = '2 Units removed: Build not found';
