import type { AbilityContent } from '@entities/soldier/model/abilities';
import type { BodyPartContent } from '@entities/soldier/model/body-parts';
import type { BiosoldierBuildData, SoldierBuildData } from '@entities/soldier/model/build';
import type { SoldierClass, SoldierClassContent } from '@entities/soldier/model/classes';
import type { PsiLevelContent } from '@entities/soldier/model/psi-levels';
import type { SoldierRankContent } from '@entities/soldier/model/ranks';
import type { BinaryCodeSection, BitWriter } from '@shared/lib/binary-code';

export const ABILITY_CONTENT_MOCK: Record<string, AbilityContent> = {
  'granted': { code: 10, name: 'Granted', description: 'Granted by the class.' },
  'left': { code: 11, name: 'Left', description: 'Left choice.' },
  'right': { code: 12, name: 'Right', description: 'Right choice.' },
  'top': { code: 13, name: 'Top', description: 'Top choice.' },
  'neural-damping': { code: 20, name: 'Neural Damping', description: 'First head option that excludes psionics.' },
  'head-second': { code: 21, name: 'Head Second', description: 'Second head option.' },
  'feet-first': { code: 22, name: 'Feet First', description: 'First feet option.' },
  'feet-second': { code: 23, name: 'Feet Second', description: 'Second feet option.' },
  'low-left': { code: 30, name: 'Low Left', description: 'Left low psionic ability.' },
  'low-right': { code: 31, name: 'Low Right', description: 'Right low psionic ability.' },
  'high': { code: 32, name: 'High', description: 'High psionic ability.' },
};

export const BODY_PART_CONTENT_MOCK: Record<string, BodyPartContent> = {
  head: { name: 'Head', geneMods: ['neural-damping', 'head-second'] },
  feet: { name: 'Feet', geneMods: ['feet-first', 'feet-second'] },
};

export const PSI_LEVEL_CONTENT_MOCK: Record<string, PsiLevelContent> = {
  low: { name: 'Low', abilities: ['low-left', 'low-right'] },
  high: { name: 'High', abilities: ['high'] },
};

export const SOLDIER_RANK_CONTENT_MOCK: Record<string, SoldierRankContent> = {
  first: { name: 'First' },
  second: { name: 'Second' },
  third: { name: 'Third' },
};

export const BIOSOLDIER_CLASS_CONTENT_MOCK: Record<string, SoldierClassContent> = {
  tester: {
    code: 3,
    name: 'Tester',
    perks: { first: ['granted'], second: ['left', 'right'], third: ['top'] } as unknown as SoldierClassContent['perks'],
  },
};

export const MEC_CLASS_CONTENT_MOCK: Record<string, SoldierClassContent> = {
  walker: {
    code: 5,
    name: 'Walker',
    perks: { first: ['granted'], second: ['left', 'right'], third: ['top'] } as unknown as SoldierClassContent['perks'],
  },
};

export const BIOSOLDIER_CLASS_MOCK = {
  id: 'tester',
  code: 3,
  name: 'Tester',
  perks: { first: ['granted'], second: ['left', 'right'], third: ['top'] },
  basePerk: 'granted',
} as unknown as SoldierClass;

const SOLDIER_BUILD = {
  soldierClass: BIOSOLDIER_CLASS_MOCK,
  perks: ['granted', 'right', 'top'],
  name: 'Tester',
} as SoldierBuildData;

export const DEFAULT_NAME_BUILD: BiosoldierBuildData = { ...SOLDIER_BUILD, geneMods: [null, null], psionicAbilities: [], officerPerks: [] };

export const OTHER_CLASS_MOCK = {
  id: 'other',
  code: 4,
  name: 'Other',
  perks: { first: ['granted'], second: ['left', 'right'], third: ['top'] },
  basePerk: 'granted',
} as unknown as SoldierClass;

export const BOUND_CLASS_BY_CODE = new Map([[3, BIOSOLDIER_CLASS_MOCK]]);

export const OTHER_CLASS_CODE = 4;

export const OTHER_CLASS_BUILD = { ...DEFAULT_NAME_BUILD, soldierClass: OTHER_CLASS_MOCK, name: 'Other' };

export const MEC_CLASS_MOCK = {
  id: 'walker',
  code: 5,
  name: 'Walker',
  perks: { first: ['granted'], second: ['left', 'right'], third: ['top'] },
  basePerk: 'granted',
} as unknown as SoldierClass;

export const MEC_DEFAULT_NAME_BUILD = { ...SOLDIER_BUILD, soldierClass: MEC_CLASS_MOCK, name: 'Walker' };

export const MEC_NAMED_BUILD = { ...MEC_DEFAULT_NAME_BUILD, name: 'Juggernaut' };

export const MEC_CLASS_CODE = MEC_CLASS_MOCK.code;

export const BIOSOLDIER_CLASS_CODE = BIOSOLDIER_CLASS_MOCK.code;

export const NAMED_BUILD = { ...DEFAULT_NAME_BUILD, name: 'Overwatch' };

export const MISPLACED_GENE_MOD_BUILD = { ...DEFAULT_NAME_BUILD, geneMods: ['feet-first', null] } as unknown as BiosoldierBuildData;

export const GENE_MODS_BUILD = { ...DEFAULT_NAME_BUILD, geneMods: ['head-second', 'feet-first'] } as unknown as BiosoldierBuildData;

export const PSIONIC_BUILD = {
  ...DEFAULT_NAME_BUILD,
  geneMods: ['head-second', 'feet-first'],
  psionicAbilities: ['low-right', 'high'],
} as unknown as BiosoldierBuildData;

export const MISPLACED_PSIONIC_ABILITY_BUILD = { ...DEFAULT_NAME_BUILD, psionicAbilities: ['high'] } as unknown as BiosoldierBuildData;

export const EXCESS_PSIONIC_ABILITIES_BUILD = {
  ...DEFAULT_NAME_BUILD,
  psionicAbilities: ['low-left', 'high', 'high'],
} as unknown as BiosoldierBuildData;

export const NEURAL_DAMPING_BUILD = { ...DEFAULT_NAME_BUILD, geneMods: ['neural-damping', null] } as unknown as BiosoldierBuildData;

export const NEURAL_DAMPING_PSIONIC_BUILD = { ...NEURAL_DAMPING_BUILD, psionicAbilities: ['low-left'] } as unknown as BiosoldierBuildData;

export const UNKNOWN_PERK_BUILD = { ...DEFAULT_NAME_BUILD, perks: ['granted', 'missing'] };

export const BIOSOLDIER_FORMAT = 1;

export const PERKS_SECTION_ID = 1;

export const NAME_SECTION_ID = 2;

export const GENE_MODS_SECTION_ID = 3;

export const PSIONIC_SECTION_ID = 4;

export const UNKNOWN_SECTION_ID = 20;

export const UNKNOWN_FORMAT = 5;

export const SHIV_FORMAT = 2;

export const MEC_FORMAT = 3;

export const INVALID_RESULT = { status: 'invalid' };

export const SHIV_CODE_RESULT = { status: 'other-unit', unit: 'SHIV' };

export const MEC_CODE_RESULT = { status: 'other-unit', unit: 'MEC' };

export const BIOSOLDIER_CODE_RESULT = { status: 'other-unit', unit: 'Biosoldier' };

export const GARBAGE_CODE = 'not a code';

/**
 * `PERKS` section with raw numbers: class 5 bits, perk count 3 bits, ability numbers 8 bits each.
 *
 * @param classCode class number.
 * @param abilityCodes selected ability numbers.
 * @param extraBits number of zero bits written after the fields.
 */
export const perksSection = (classCode: number, abilityCodes: number[], extraBits = 0): BinaryCodeSection => ({
  id: PERKS_SECTION_ID,
  write: (writer: BitWriter) => {
    writer.writeUint(classCode, 5);
    writer.writeUint(abilityCodes.length, 3);
    abilityCodes.forEach(abilityCode => writer.writeUint(abilityCode, 8));
    writer.writeUint(0, extraBits);
  },
});

export const VALID_PERKS_SECTION = perksSection(BIOSOLDIER_CLASS_CODE, [12, 13]);

export const UNKNOWN_SECTION: BinaryCodeSection = { id: UNKNOWN_SECTION_ID, write: writer => writer.writeUint(0b11, 2) };

export const BROKEN_NAME_SECTION: BinaryCodeSection = { id: NAME_SECTION_ID, write: writer => writer.writeUint(31, 5) };

/**
 * `GENE_MODS` section with raw numbers: gene mod count 3 bits, ability numbers 8 bits each.
 *
 * @param abilityCodes gene mod numbers in section order.
 * @param extraBits number of zero bits written after the fields.
 */
export const geneModsSection = (abilityCodes: number[], extraBits = 0): BinaryCodeSection => ({
  id: GENE_MODS_SECTION_ID,
  write: (writer: BitWriter) => {
    writer.writeUint(abilityCodes.length, 3);
    abilityCodes.forEach(abilityCode => writer.writeUint(abilityCode, 8));
    writer.writeUint(0, extraBits);
  },
});

/**
 * `PSIONIC` section with raw numbers: psionic ability count 3 bits, ability numbers 8 bits each.
 *
 * @param abilityCodes psionic ability numbers in section order.
 * @param extraBits number of zero bits written after the fields.
 */
export const psionicSection = (abilityCodes: number[], extraBits = 0): BinaryCodeSection => ({
  id: PSIONIC_SECTION_ID,
  write: (writer: BitWriter) => {
    writer.writeUint(abilityCodes.length, 3);
    abilityCodes.forEach(abilityCode => writer.writeUint(abilityCode, 8));
    writer.writeUint(0, extraBits);
  },
});
