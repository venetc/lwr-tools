import type { DecodedLoadout } from '@entities/loadout';
import { BIOSOLDIER_CLASSES, MEC_CLASSES } from '@entities/soldier';
import {
  defaultBiosoldierBuild,
  defaultSoldierBuild,
  selectBiosoldierBuildGeneMod,
  selectBiosoldierBuildOfficerPerk,
  selectBiosoldierBuildPsionicAbility,
  selectSoldierBuildPerk,
} from '@entities/soldier/model/build';
import type { BinaryCodeSection, BitWriter } from '@shared/lib/binary-code';

const [FIRST_BIOSOLDIER_CLASS] = BIOSOLDIER_CLASSES;

const [FIRST_MEC_CLASS] = MEC_CLASSES;

export const BIOSOLDIER_BUILD = { ...defaultBiosoldierBuild(FIRST_BIOSOLDIER_CLASS), name: 'Overwatch' };

export const MEC_BUILD = { ...defaultSoldierBuild(FIRST_MEC_CLASS), name: 'Walker' };

export const SHIV_BUILD = { perks: [null, null, null, null, null], name: 'SHIV' };

/** SHIV tree records without Smart Macrophages, as after a mod update that removes it. */
export const TECHNOLOGY_LEVEL_CONTENT_MOCK = {
  'base-configuration': { name: 'Basic Config', perks: ['lock-n-load', 'repair-servos', 'platform-stability'] },
  'advancements-1': { name: 'Advancements I', perks: ['holo-rounds', 'shredder', 'damage-control'] },
  'advancements-2': { name: 'Advancements II', perks: ['reactive-targeting-sensors', 'light-em-up', 'close-combat-specialist'] },
  'advancements-3a': { name: 'Advancements IIIa', perks: ['critical-system-targeting', 'fortified', 'absorption-fields'] },
  'advancements-3b': { name: 'Advancements IIIb', perks: ['vital-point-targeting', 'bring-em-on'] },
};

/**
 * SHIV `PERKS` section with raw numbers: perk count 3 bits, then the perk numbers 6 bits each.
 *
 * @param perkCodes perk numbers in any order.
 */
export const rawShivPerksSection = (perkCodes: readonly number[]): BinaryCodeSection => ({
  id: 1,
  write: (writer) => {
    writer.writeUint(perkCodes.length, 3);
    perkCodes.forEach(perkCode => writer.writeUint(perkCode, 6));
  },
});

/** Holo Rounds, then Smart Macrophages, which the mocked SHIV tree no longer has. */
export const REMOVED_PERK_CODES = [4, 15];

/** SHIV build of `REMOVED_PERK_CODES` without Smart Macrophages. */
export const HOLO_ROUNDS_BUILD = { perks: [null, 'holo-rounds', null, null, null], name: 'SHIV' };

/** Lock N' Load and Repair Servos, both of Basic Config. */
export const COLLISION_CODES = [1, 2];

/** Outdated selections of `COLLISION_CODES`. */
export const COLLISION_OUTDATED = [
  { perkId: 'lock-n-load', reason: 'collision', levelIndex: 0 },
  { perkId: 'repair-servos', reason: 'collision', levelIndex: 0 },
];

/** Repair Servos, Holo Rounds, Smart Macrophages and Lock N' Load. */
export const MIXED_CODES = [2, 4, 15, 1];

/** Outdated selections of `MIXED_CODES`, in code order. */
export const MIXED_OUTDATED = [
  { perkId: 'repair-servos', reason: 'collision', levelIndex: 0 },
  { perkId: 'smart-macrophages', reason: 'removed' },
  { perkId: 'lock-n-load', reason: 'collision', levelIndex: 0 },
];

/** Holo Rounds and a perk number of no perk. */
export const UNKNOWN_PERK_CODES = [4, 40];

/**
 * Sniper build with empty steps between selections: Lone Wolf on Master Sergeant, Iron Skin, Psi Mastery on Master and
 * Cover Tenacity on Captain.
 */
const createGappedBiosoldierBuild = () => {
  const build = { ...defaultBiosoldierBuild(FIRST_BIOSOLDIER_CLASS), name: 'Gaps' };

  selectSoldierBuildPerk(build, 6, 'lone-wolf');
  selectBiosoldierBuildGeneMod(build, 3, 'iron-skin');
  selectBiosoldierBuildPsionicAbility(build, 4, 'psi-mastery');
  selectBiosoldierBuildOfficerPerk(build, 1, 'cover-tenacity');

  return build;
};

export const GAPPED_BIOSOLDIER_BUILD = createGappedBiosoldierBuild();

/**
 * MEC build with only the last rank selected.
 */
const createGappedMecBuild = () => {
  const build = { ...defaultSoldierBuild(FIRST_MEC_CLASS), name: 'Walker' };

  selectSoldierBuildPerk(build, 6, FIRST_MEC_CLASS.perks['master-sergeant'][0] ?? null);

  return build;
};

export const GAPPED_MEC_BUILD = createGappedMecBuild();

/**
 * Selection of a raw step: its variant index and its ability number; null for an empty step.
 */
type RawStep = readonly [variantIndex: number, code: number] | null;

/**
 * Writes raw steps: count 3 bits, then per step a bit for a selection and, for a selection, its variant index and its
 * ability number 8 bits.
 *
 * @param writer section writer.
 * @param steps raw steps.
 * @param variantBits width of the variant index.
 */
const writeRawSteps = (writer: BitWriter, steps: readonly RawStep[], variantBits: number) => {
  writer.writeUint(steps.length, 3);
  steps.forEach((step) => {
    writer.writeUint(step ? 1 : 0, 1);

    if (!step) return;

    writer.writeUint(step[0], variantBits);
    writer.writeUint(step[1], 8);
  });
};

/**
 * Biosoldier `PERKS` section with raw numbers: class 5 bits, then the ranks from the second one with variant indexes
 * of 2 bits.
 *
 * @param classCode class number.
 * @param steps raw steps by rank.
 */
const rawPerksSection = (classCode: number, steps: readonly RawStep[]): BinaryCodeSection => ({
  id: 1,
  write: (writer) => {
    writer.writeUint(classCode, 5);
    writeRawSteps(writer, steps, 2);
  },
});

/**
 * Section of raw steps of a branch beyond the class tree.
 *
 * @param id section id: 3 for gene mods, 4 for psionic, 5 for officer.
 * @param steps raw steps.
 * @param variantBits width of the variant index: 1 for gene mods and officer, 2 for psionic.
 */
const rawBranchSection = (id: number, steps: readonly RawStep[], variantBits: number): BinaryCodeSection => ({
  id,
  write: writer => writeRawSteps(writer, steps, variantBits),
});

/** Sniper class number. */
const SNIPER_CODE = 1;

/** Sniper ranks from Lance Corporal with only Lone Wolf, the second perk of Master Sergeant. */
const LONE_WOLF_STEPS: RawStep[] = [null, null, null, null, null, [1, 33]];

/** `PERKS` section of a Sniper with only Lone Wolf. */
const LONE_WOLF_PERKS_SECTION = rawPerksSection(SNIPER_CODE, LONE_WOLF_STEPS);

/** Sections of a Sniper with Lone Wolf and Cover Tenacity, the second officer perk of Captain. */
export const ROOKIE_GAP_SECTIONS = [LONE_WOLF_PERKS_SECTION, rawBranchSection(5, [null, [1, 117], null, null, null], 1)];

/** Sniper build of `ROOKIE_GAP_SECTIONS`. */
export const ROOKIE_GAP_BUILD = {
  ...defaultBiosoldierBuild(FIRST_BIOSOLDIER_CLASS),
  perks: ['squadsight', null, null, null, null, null, 'lone-wolf'],
  officerPerks: [null, 'cover-tenacity', null, null, null],
};

/** Sniper with Sharpshooter, a perk of Corporal, on Lance Corporal. */
export const OTHER_RANK_PERK_SECTIONS = [rawPerksSection(SNIPER_CODE, [[0, 59], null, null, null, null, null])];

/** Sniper build of the default build, as a build code without selections gives it. */
export const SNIPER_BUILD = { ...defaultBiosoldierBuild(FIRST_BIOSOLDIER_CLASS), name: 'Sniper' };

/** Outdated selection of `OTHER_RANK_PERK_SECTIONS`. */
export const OTHER_RANK_PERK_OUTDATED = [
  { stepKind: 'rank', stepIndex: 1, variantIndex: 0, abilityId: 'sharpshooter', currentAbilityId: 'magnum' },
];

/** Sniper with Squadsight, its Base perk, on Lance Corporal. */
export const BASE_PERK_ON_RANK_SECTIONS = [rawPerksSection(SNIPER_CODE, [[0, 64], null, null, null, null, null])];

/** Outdated selection of `BASE_PERK_ON_RANK_SECTIONS`. */
export const BASE_PERK_ON_RANK_OUTDATED = [
  { stepKind: 'rank', stepIndex: 1, variantIndex: 0, abilityId: 'squadsight', currentAbilityId: 'magnum' },
];

/** Sniper with Magnum, the first perk of Lance Corporal, under the second variant index. */
export const SWAPPED_PERK_SECTIONS = [rawPerksSection(SNIPER_CODE, [[1, 35], null, null, null, null, null])];

/** Sniper build of `SWAPPED_PERK_SECTIONS`. */
export const MAGNUM_BUILD = { ...SNIPER_BUILD, perks: ['squadsight', 'magnum', null, null, null, null, null] };

/** Sniper with Smart Macrophages, the second Brain gene mod, under the first variant index. */
export const SWAPPED_GENE_MOD_SECTIONS = [
  rawPerksSection(SNIPER_CODE, [null, null, null, null, null, null]),
  rawBranchSection(3, [[0, 94], null, null, null, null], 1),
];

/** Sniper build of `SWAPPED_GENE_MOD_SECTIONS`. */
export const SMART_MACROPHAGES_BUILD = { ...SNIPER_BUILD, geneMods: ['smart-macrophages', null, null, null, null] };

/** Outdated selections of a code with one selection on a step of each branch that no longer offers it. */
export const OUTDATED_BRANCH_CASES: [string, BinaryCodeSection[], unknown[]][] = [
  [
    'a gene mod of another body part',
    [rawPerksSection(SNIPER_CODE, [null, null, null, null, null, null]), rawBranchSection(3, [[0, 95], null, null, null, null], 1)],
    [{ stepKind: 'body-part', stepIndex: 0, variantIndex: 0, abilityId: 'advanced-perception', currentAbilityId: 'neural-damping' }],
  ],
  [
    'a psionic ability of another psi level',
    [rawPerksSection(SNIPER_CODE, [null, null, null, null, null, null]), rawBranchSection(4, [[1, 111], null, null, null, null], 2)],
    [{ stepKind: 'psi-level', stepIndex: 0, variantIndex: 1, abilityId: 'psi-mastery', currentAbilityId: 'mind-fray' }],
  ],
  [
    'an officer perk of another officer rank',
    [rawPerksSection(SNIPER_CODE, [null, null, null, null, null, null]), rawBranchSection(5, [[0, 116], null, null, null, null], 1)],
    [{ stepKind: 'officer-rank', stepIndex: 0, variantIndex: 0, abilityId: 'cover-tactics', currentAbilityId: 'strength-in-numbers' }],
  ],
];

/**
 * Sniper with kept and outdated selections between empty steps: Sharpshooter on Lance Corporal (outdated), Executioner
 * on Sergeant, Lone Wolf on Master Sergeant; Iron Skin on Skin; Psi Mastery on Psion (outdated); Cover Tenacity on
 * Lieutenant (outdated) and Camaraderie on Field Commander.
 */
export const MIXED_SOLDIER_SECTIONS = [
  rawPerksSection(SNIPER_CODE, [[0, 59], null, [2, 15], null, null, [1, 33]]),
  rawBranchSection(3, [null, null, null, [1, 100], null], 1),
  rawBranchSection(4, [null, null, null, [0, 111], null], 2),
  rawBranchSection(5, [[1, 117], null, null, null, [0, 122]], 1),
];

/** Sniper build of `MIXED_SOLDIER_SECTIONS`. */
export const MIXED_SOLDIER_BUILD = {
  ...SNIPER_BUILD,
  perks: ['squadsight', null, null, 'executioner', null, null, 'lone-wolf'],
  geneMods: [null, null, null, 'iron-skin', null],
  officerPerks: [null, null, null, null, 'camaraderie'],
};

/** Outdated selections of `MIXED_SOLDIER_SECTIONS`, in tree order. */
export const MIXED_SOLDIER_OUTDATED = [
  { stepKind: 'rank', stepIndex: 1, variantIndex: 0, abilityId: 'sharpshooter', currentAbilityId: 'magnum' },
  { stepKind: 'psi-level', stepIndex: 3, variantIndex: 0, abilityId: 'psi-mastery', currentAbilityId: 'inner-fire' },
  { stepKind: 'officer-rank', stepIndex: 0, variantIndex: 1, abilityId: 'cover-tenacity', currentAbilityId: 'stay-frosty' },
];

/** Jaeger class number. */
const JAEGER_CODE = 9;

/** Jaeger with Sharpshooter, a perk of Corporal, on Lance Corporal, and Lone Wolf on Gunnery Sergeant. */
export const OTHER_RANK_MEC_PERKS_SECTION = rawPerksSection(JAEGER_CODE, [[0, 59], null, null, null, [0, 33], null]);

/** Jaeger build of `OTHER_RANK_MEC_PERKS_SECTION`. */
export const LONE_WOLF_MEC_BUILD = {
  ...defaultSoldierBuild(FIRST_MEC_CLASS),
  name: 'Jaeger',
  perks: ['hunter', null, null, null, null, 'lone-wolf', null],
};

/** Outdated selection of `OTHER_RANK_MEC_PERKS_SECTION`. */
export const OTHER_RANK_MEC_OUTDATED = [
  { stepKind: 'rank', stepIndex: 1, variantIndex: 0, abilityId: 'sharpshooter', currentAbilityId: 'rapid-fire' },
];

/** Soldier `LOADOUT` section with every slot empty: three empty item numbers, no utility and no Module slots. */
export const EMPTY_SOLDIER_LOADOUT_SECTION: BinaryCodeSection = {
  id: 6,
  write: (writer) => {
    writer.writeUint(0, 8);
    writer.writeUint(0, 8);
    writer.writeUint(0, 8);
    writer.writeUint(0, 3);
    writer.writeUint(0, 2);
  },
};

/** Invalid biosoldier build codes by what breaks them, as code sections. */
export const INVALID_BIOSOLDIER_SECTIONS: [string, BinaryCodeSection[]][] = [
  ['an unknown ability code', [rawPerksSection(SNIPER_CODE, [[0, 200], null, null, null, null, null])]],
  ['an unknown class', [rawPerksSection(30, LONE_WOLF_STEPS)]],
  ['fewer ranks than the class tree has', [rawPerksSection(SNIPER_CODE, [null, null, null, null, [1, 33]])]],
  ['a variant index outside its rank', [rawPerksSection(SNIPER_CODE, [null, null, null, [1, 45], null, null])]],
  ['fewer body parts than the build has', [LONE_WOLF_PERKS_SECTION, rawBranchSection(3, [[1, 94], null, null, null], 1)]],
  ['Neural Damping with a psionic ability', [
    LONE_WOLF_PERKS_SECTION,
    rawBranchSection(3, [[0, 93], null, null, null, null], 1),
    rawBranchSection(4, [null, null, null, null, [0, 111]], 2),
  ]],
];

export const SERAPH_LOADOUT: DecodedLoadout = {
  armor: 'seraph-armor',
  primary: 'assault-rifle',
  secondary: 'pistol',
  utility: ['he-grenade', null, 'medikit'],
  modules: [],
};

export const MEC_LOADOUT: DecodedLoadout = {
  armor: 'lmec3-vindicator',
  primary: 'minigun',
  secondary: null,
  utility: ['heavy-mags'],
  modules: ['flamethrower', null, 'restorative-mist'],
};

export const SHIV_LOADOUT: DecodedLoadout = {
  armor: 'hover-shiv',
  primary: 'autocannon',
  secondary: null,
  utility: [null, 'motion-tracker'],
  modules: [],
};

export const SQUAD_NAME = 'Alpha';

export const UNKNOWN_FORMAT = 5;

export const SEPARATOR = '.';

export const INVALID_RESULT = { status: 'invalid' };

export const GARBAGE_CODE = 'not a code';

export const UNKNOWN_SECTION: BinaryCodeSection = { id: 20, write: writer => writer.writeUint(0b11, 2) };

/** SHIV `LOADOUT` section with every slot empty: three empty item numbers, no utility and no Module slots. */
export const EMPTY_SHIV_LOADOUT_SECTION: BinaryCodeSection = {
  id: 3,
  write: (writer) => {
    writer.writeUint(0, 8);
    writer.writeUint(0, 8);
    writer.writeUint(0, 8);
    writer.writeUint(0, 3);
    writer.writeUint(0, 2);
  },
};

export const EMPTY_LOADOUT: DecodedLoadout = { armor: null, primary: null, secondary: null, utility: [], modules: [] };

/** Squad header with the name `SQUAD_NAME`: the `NAME` section, byte length 5 bits, then the bytes. */
export const SQUAD_HEADER_SECTION: BinaryCodeSection = { id: 1, write: writer => writer.writeString(SQUAD_NAME, 5) };

/** Lock N' Load, Holo Rounds and Repair Servos: Holo Rounds is all that is left after the collision. */
export const COLLISION_WITH_HOLO_ROUNDS_CODES = [1, 4, 2];

/** Holo Rounds alone. */
export const HOLO_ROUNDS_CODES = [4];
