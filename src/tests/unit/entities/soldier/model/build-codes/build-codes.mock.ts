import type { AbilityContent } from '@entities/soldier/model/abilities';
import type { BodyPartContent } from '@entities/soldier/model/body-parts';
import type { BiosoldierBuildData, SoldierBuildData } from '@entities/soldier/model/build';
import type { BiosoldierBuildCodes, SoldierBuildCodes } from '@entities/soldier/model/build-codes';
import type { SoldierClass, SoldierClassContent } from '@entities/soldier/model/classes';
import type { OfficerRankContent } from '@entities/soldier/model/officer-ranks';
import type { PsiLevelContent } from '@entities/soldier/model/psi-levels';
import type { SoldierRankContent } from '@entities/soldier/model/ranks';

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
  'alpha-left': { code: 40, name: 'Alpha Left', description: 'Left officer perk of Alpha.' },
  'alpha-right': { code: 41, name: 'Alpha Right', description: 'Right officer perk of Alpha.' },
  'beta-left': { code: 42, name: 'Beta Left', description: 'Left officer perk of Beta.' },
  'beta-right': { code: 43, name: 'Beta Right', description: 'Right officer perk of Beta.' },
};

export const BODY_PART_CONTENT_MOCK: Record<string, BodyPartContent> = {
  head: { name: 'Head', geneMods: ['neural-damping', 'head-second'] },
  feet: { name: 'Feet', geneMods: ['feet-first', 'feet-second'] },
};

export const PSI_LEVEL_CONTENT_MOCK: Record<string, PsiLevelContent> = {
  low: { name: 'Low', abilities: ['low-left', 'low-right'] },
  high: { name: 'High', abilities: ['high'] },
};

export const OFFICER_RANK_CONTENT_MOCK: Record<string, OfficerRankContent> = {
  alpha: { name: 'Alpha', abbreviation: 'A', requiredRank: 'second', perks: ['alpha-left', 'alpha-right'] },
  beta: { name: 'Beta', abbreviation: 'B', requiredRank: 'third', perks: ['beta-left', 'beta-right'] },
};

export const SOLDIER_RANK_CONTENT_MOCK: Record<string, SoldierRankContent> = {
  first: { name: 'First' },
  second: { name: 'Second' },
  third: { name: 'Third' },
};

const CLASS_PERKS = { first: ['granted'], second: ['left', 'right'], third: ['top'] };

export const BIOSOLDIER_CLASS_CONTENT_MOCK: Record<string, SoldierClassContent> = {
  tester: { code: 3, name: 'Tester', perks: CLASS_PERKS as unknown as SoldierClassContent['perks'] },
};

export const MEC_CLASS_CONTENT_MOCK: Record<string, SoldierClassContent> = {
  walker: { code: 5, name: 'Walker', perks: CLASS_PERKS as unknown as SoldierClassContent['perks'] },
};

const BIOSOLDIER_CLASS_MOCK = { id: 'tester', code: 3, name: 'Tester', perks: CLASS_PERKS, basePerk: 'granted' } as unknown as SoldierClass;

const MEC_CLASS_MOCK = { id: 'walker', code: 5, name: 'Walker', perks: CLASS_PERKS, basePerk: 'granted' } as unknown as SoldierClass;

export const UNKNOWN_CLASS_CODE = 30;

export const UNKNOWN_ABILITY_CODE = 99;

const PLAIN_BUILD: BiosoldierBuildData = {
  soldierClass: BIOSOLDIER_CLASS_MOCK,
  perks: ['granted', 'right', 'top'],
  name: 'Tester',
  geneMods: [null, null],
  psionicAbilities: [],
  officerPerks: [],
};

export const SUPER_SOLDIER_BUILD = {
  ...PLAIN_BUILD,
  geneMods: ['head-second', 'feet-first'],
  psionicAbilities: ['low-right', 'high'],
  officerPerks: ['alpha-right', 'beta-left'],
} as unknown as BiosoldierBuildData;

export const SUPER_SOLDIER_CODES: BiosoldierBuildCodes = {
  classCode: 3,
  perks: [12, 13],
  name: null,
  geneMods: [21, 22],
  psionicAbilities: [31, 32],
  officerPerks: [41, 42],
};

export const NAMED_BUILD = { ...PLAIN_BUILD, name: 'Overwatch' };

export const BLANK_NAME_BUILD = { ...PLAIN_BUILD, name: ' ' };

export const NAMED_CODES: BiosoldierBuildCodes = { ...SUPER_SOLDIER_CODES, geneMods: [], psionicAbilities: [], officerPerks: [], name: 'Overwatch' };

export const BLANK_NAME_CODES: BiosoldierBuildCodes = { ...NAMED_CODES, name: '  ' };

export const FEET_GENE_MOD_BUILD = { ...PLAIN_BUILD, geneMods: [null, 'feet-second'] } as unknown as BiosoldierBuildData;

export const FEET_GENE_MOD_CODES: BiosoldierBuildCodes = { ...NAMED_CODES, name: null, geneMods: [23] };

export const NEURAL_DAMPING_BUILD = { ...PLAIN_BUILD, geneMods: ['neural-damping', 'feet-first'] } as unknown as BiosoldierBuildData;

export const NEURAL_DAMPING_CODES: BiosoldierBuildCodes = { ...FEET_GENE_MOD_CODES, geneMods: [20, 22] };

export const MEC_BUILD: SoldierBuildData = { soldierClass: MEC_CLASS_MOCK, perks: ['granted', 'left'], name: 'Walker' };

export const MEC_CODES: SoldierBuildCodes = { classCode: 5, perks: [11], name: null };

export const NAMED_MEC_BUILD: SoldierBuildData = { ...MEC_BUILD, name: 'Juggernaut' };

export const NAMED_MEC_CODES: SoldierBuildCodes = { ...MEC_CODES, name: 'Juggernaut' };

export const MEC_CLASS_BIOSOLDIER_BUILD = { ...PLAIN_BUILD, soldierClass: MEC_CLASS_MOCK };

export const MEC_CLASS_BIOSOLDIER_CODES: BiosoldierBuildCodes = { ...NAMED_CODES, name: null, classCode: 5 };

export const BIOSOLDIER_CLASS_MEC_BUILD: SoldierBuildData = { ...MEC_BUILD, soldierClass: BIOSOLDIER_CLASS_MOCK };

export const BIOSOLDIER_CLASS_MEC_CODES: SoldierBuildCodes = { ...MEC_CODES, classCode: 3 };

/**
 * Biosoldier build of the mock class with the given choices, the rest as in a plain build.
 *
 * @param choices choices that differ from the plain build.
 */
export const createBuildMock = (choices: Partial<Record<'perks' | 'geneMods' | 'psionicAbilities' | 'officerPerks', (string | null)[]>>) => (
  { ...PLAIN_BUILD, ...choices } as unknown as BiosoldierBuildData
);

/**
 * Biosoldier codes of the mock class with the given codes, the rest without any choice.
 *
 * @param codes codes that differ from a build without choices.
 */
export const createCodesMock = (codes: Partial<BiosoldierBuildCodes>): BiosoldierBuildCodes => (
  { ...NAMED_CODES, name: null, ...codes }
);
