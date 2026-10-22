import type { BiosoldierBuildCodes, BiosoldierBuildData, SoldierBuildCodes, SoldierBuildData } from '@entities/soldier';
import type { BinaryCodeSection, BitWriter } from '@shared/lib/binary-code';

export const BIOSOLDIER_BUILD_STUB = { name: 'Tester' } as BiosoldierBuildData;

export const MEC_BUILD_STUB = { name: 'Walker' } as SoldierBuildData;

export const BIOSOLDIER_CLASS_CODE = 3;

export const MEC_CLASS_CODE = 5;

export const BUILD_NAME = 'Overwatch';

export const PLAIN_CODES: BiosoldierBuildCodes = {
  classCode: BIOSOLDIER_CLASS_CODE,
  perks: [12, 13],
  name: null,
  geneMods: [],
  psionicAbilities: [],
  officerPerks: [],
};

export const FULL_CODES: BiosoldierBuildCodes = {
  ...PLAIN_CODES,
  geneMods: [21, 22],
  psionicAbilities: [31, 32],
  officerPerks: [41, 42],
};

export const NAMED_CODES: BiosoldierBuildCodes = { ...PLAIN_CODES, name: BUILD_NAME };

export const NO_GENE_MODS_CODES: BiosoldierBuildCodes = { ...FULL_CODES, geneMods: [] };

export const NO_PSIONIC_CODES: BiosoldierBuildCodes = { ...FULL_CODES, psionicAbilities: [] };

export const NO_OFFICER_CODES: BiosoldierBuildCodes = { ...FULL_CODES, officerPerks: [] };

export const MEC_CODES: SoldierBuildCodes = { classCode: MEC_CLASS_CODE, perks: [11], name: null };

export const NAMED_MEC_CODES: SoldierBuildCodes = { ...MEC_CODES, name: BUILD_NAME };

export const BIOSOLDIER_FORMAT = 1;

export const SHIV_FORMAT = 2;

export const MEC_FORMAT = 3;

export const UNKNOWN_FORMAT = 5;

export const PERKS_SECTION_ID = 1;

export const NAME_SECTION_ID = 2;

export const GENE_MODS_SECTION_ID = 3;

export const PSIONIC_SECTION_ID = 4;

export const OFFICER_SECTION_ID = 5;

export const UNKNOWN_SECTION_ID = 20;

export const INVALID_RESULT = { status: 'invalid' };

export const BIOSOLDIER_DECODED_RESULT = { status: 'decoded', build: BIOSOLDIER_BUILD_STUB };

export const MEC_DECODED_RESULT = { status: 'decoded', build: MEC_BUILD_STUB };

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

/**
 * Section of an ability list with raw numbers: count 3 bits, ability numbers 8 bits each.
 *
 * @param id section id.
 * @param abilityCodes ability numbers in section order.
 * @param extraBits number of zero bits written after the fields.
 */
const abilityListSection = (id: number, abilityCodes: number[], extraBits: number): BinaryCodeSection => ({
  id,
  write: (writer: BitWriter) => {
    writer.writeUint(abilityCodes.length, 3);
    abilityCodes.forEach(abilityCode => writer.writeUint(abilityCode, 8));
    writer.writeUint(0, extraBits);
  },
});

/**
 * `GENE_MODS` section with raw numbers.
 *
 * @param abilityCodes gene mod numbers in section order.
 * @param extraBits number of zero bits written after the fields.
 */
export const geneModsSection = (abilityCodes: number[], extraBits = 0) => abilityListSection(GENE_MODS_SECTION_ID, abilityCodes, extraBits);

/**
 * `PSIONIC` section with raw numbers.
 *
 * @param abilityCodes psionic ability numbers in section order.
 * @param extraBits number of zero bits written after the fields.
 */
export const psionicSection = (abilityCodes: number[], extraBits = 0) => abilityListSection(PSIONIC_SECTION_ID, abilityCodes, extraBits);

/**
 * `OFFICER` section with raw numbers.
 *
 * @param abilityCodes officer perk numbers in section order.
 * @param extraBits number of zero bits written after the fields.
 */
export const officerSection = (abilityCodes: number[], extraBits = 0) => abilityListSection(OFFICER_SECTION_ID, abilityCodes, extraBits);

/**
 * `NAME` section: UTF-8 byte length 5 bits, then the bytes.
 *
 * @param name build name.
 */
export const nameSection = (name: string): BinaryCodeSection => ({ id: NAME_SECTION_ID, write: writer => writer.writeString(name, 5) });

export const PLAIN_PERKS_SECTION = perksSection(BIOSOLDIER_CLASS_CODE, PLAIN_CODES.perks);

export const MEC_PERKS_SECTION = perksSection(MEC_CLASS_CODE, MEC_CODES.perks);

export const UNKNOWN_SECTION: BinaryCodeSection = { id: UNKNOWN_SECTION_ID, write: writer => writer.writeUint(0b11, 2) };

export const BROKEN_NAME_SECTION: BinaryCodeSection = { id: NAME_SECTION_ID, write: writer => writer.writeUint(31, 5) };
