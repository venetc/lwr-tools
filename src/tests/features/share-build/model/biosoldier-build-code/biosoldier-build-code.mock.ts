import type { AbilityContent } from '@entities/biosoldier/model/abilities';
import type { BiosoldierBuildData } from '@entities/biosoldier/model/build';
import type { BiosoldierClass, BiosoldierClassContent } from '@entities/biosoldier/model/classes';
import type { SoldierRankContent } from '@entities/biosoldier/model/ranks';
import type { BinaryCodeSection, BitWriter } from '@shared/lib/binary-code';

export const ABILITY_CONTENT_MOCK: Record<string, AbilityContent> = {
  granted: { code: 10, name: 'Granted', description: 'Granted by the class.' },
  left: { code: 11, name: 'Left', description: 'Left choice.' },
  right: { code: 12, name: 'Right', description: 'Right choice.' },
  top: { code: 13, name: 'Top', description: 'Top choice.' },
};

export const SOLDIER_RANK_CONTENT_MOCK: Record<string, SoldierRankContent> = {
  first: { name: 'First' },
  second: { name: 'Second' },
  third: { name: 'Third' },
};

export const BIOSOLDIER_CLASS_CONTENT_MOCK: Record<string, BiosoldierClassContent> = {
  tester: {
    code: 3,
    name: 'Tester',
    abilities: { first: ['granted'], second: ['left', 'right'], third: ['top'] } as unknown as BiosoldierClassContent['abilities'],
  },
};

export const BIOSOLDIER_CLASS_MOCK = {
  id: 'tester',
  code: 3,
  name: 'Tester',
  abilities: { first: ['granted'], second: ['left', 'right'], third: ['top'] },
  baseBuild: ['granted'],
} as unknown as BiosoldierClass;

export const DEFAULT_NAME_BUILD = {
  biosoldierClass: BIOSOLDIER_CLASS_MOCK,
  talents: ['granted', 'right', 'top'],
  name: 'Tester',
} as BiosoldierBuildData;

export const NAMED_BUILD = { ...DEFAULT_NAME_BUILD, name: 'Overwatch' };

export const UNKNOWN_TALENT_BUILD = { ...DEFAULT_NAME_BUILD, talents: ['granted', 'missing'] };

export const FORMAT = 1;

export const TALENTS_SECTION_ID = 1;

export const NAME_SECTION_ID = 2;

export const UNKNOWN_SECTION_ID = 20;

export const OTHER_FORMAT = 5;

/**
 * `TALENTS` section with raw numbers: class 5 bits, talent count 3 bits, ability numbers 8 bits each.
 *
 * @param classCode class number.
 * @param abilityCodes selected ability numbers.
 * @param extraBits number of zero bits written after the fields.
 */
export const talentsSection = (classCode: number, abilityCodes: number[], extraBits = 0): BinaryCodeSection => ({
  id: TALENTS_SECTION_ID,
  write: (writer: BitWriter) => {
    writer.writeUint(classCode, 5);
    writer.writeUint(abilityCodes.length, 3);
    abilityCodes.forEach(abilityCode => writer.writeUint(abilityCode, 8));
    writer.writeUint(0, extraBits);
  },
});

export const VALID_TALENTS_SECTION = talentsSection(3, [12, 13]);

export const UNKNOWN_SECTION: BinaryCodeSection = { id: UNKNOWN_SECTION_ID, write: writer => writer.writeUint(0b11, 2) };

export const BROKEN_NAME_SECTION: BinaryCodeSection = { id: NAME_SECTION_ID, write: writer => writer.writeUint(31, 5) };
