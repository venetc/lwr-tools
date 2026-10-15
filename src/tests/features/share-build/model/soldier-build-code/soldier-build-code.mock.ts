import type { AbilityContent } from '@entities/soldier/model/abilities';
import type { BodyPartContent } from '@entities/soldier/model/body-parts';
import type { BiosoldierBuildData, SoldierBuildData } from '@entities/soldier/model/build';
import type { SoldierClass, SoldierClassContent } from '@entities/soldier/model/classes';
import type { SoldierRankContent } from '@entities/soldier/model/ranks';
import type { BinaryCodeSection, BitWriter } from '@shared/lib/binary-code';

export const ABILITY_CONTENT_MOCK: Record<string, AbilityContent> = {
  granted: { code: 10, name: 'Granted', description: 'Granted by the class.' },
  left: { code: 11, name: 'Left', description: 'Left choice.' },
  right: { code: 12, name: 'Right', description: 'Right choice.' },
  top: { code: 13, name: 'Top', description: 'Top choice.' },
};

export const BODY_PART_CONTENT_MOCK: Record<string, BodyPartContent> = {
  head: { name: 'Head', geneMods: [] },
  feet: { name: 'Feet', geneMods: [] },
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

export const DEFAULT_NAME_BUILD: BiosoldierBuildData = { ...SOLDIER_BUILD, geneMods: [null, null] };

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

export const UNKNOWN_PERK_BUILD = { ...DEFAULT_NAME_BUILD, perks: ['granted', 'missing'] };

export const BIOSOLDIER_FORMAT = 1;

export const PERKS_SECTION_ID = 1;

export const NAME_SECTION_ID = 2;

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
