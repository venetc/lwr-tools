import type { BiosoldierBuildCodes, BiosoldierBuildData, SelectionCode, SoldierBuildCodes, SoldierBuildData, StepCodes } from '@entities/soldier';
import type { BinaryCodeSection, BitWriter } from '@shared/lib/binary-code';

export const BIOSOLDIER_BUILD_STUB = { name: 'Tester' } as BiosoldierBuildData;

export const MEC_BUILD_STUB = { name: 'Walker' } as SoldierBuildData;

export const BIOSOLDIER_CLASS_CODE = 3;

export const MEC_CLASS_CODE = 5;

export const BUILD_NAME = 'Overwatch';

/**
 * Selection code of a step.
 *
 * @param variantIndex index of the variant on the step.
 * @param code ability code.
 */
const selection = (variantIndex: number, code: number): SelectionCode => ({ variantIndex, code });

export const PLAIN_CODES: BiosoldierBuildCodes = {
  classCode: BIOSOLDIER_CLASS_CODE,
  perks: [selection(1, 12), selection(2, 13), null],
  name: null,
  geneMods: [],
  psionicAbilities: [],
  officerPerks: [],
};

export const FULL_CODES: BiosoldierBuildCodes = {
  ...PLAIN_CODES,
  geneMods: [selection(1, 21), selection(0, 22)],
  psionicAbilities: [selection(3, 31), selection(0, 32)],
  officerPerks: [selection(1, 41), selection(0, 42)],
};

export const GAPPED_CODES: BiosoldierBuildCodes = {
  ...PLAIN_CODES,
  perks: [null, null, selection(1, 14)],
  geneMods: [null, selection(1, 23), null],
  psionicAbilities: [null, null, selection(1, 33)],
  officerPerks: [null, selection(1, 43)],
};

export const NAMED_CODES: BiosoldierBuildCodes = { ...PLAIN_CODES, name: BUILD_NAME };

export const NO_GENE_MODS_CODES: BiosoldierBuildCodes = { ...FULL_CODES, geneMods: [] };

export const NO_PSIONIC_CODES: BiosoldierBuildCodes = { ...FULL_CODES, psionicAbilities: [] };

export const NO_OFFICER_CODES: BiosoldierBuildCodes = { ...FULL_CODES, officerPerks: [] };

export const MEC_CODES: SoldierBuildCodes = { classCode: MEC_CLASS_CODE, perks: [null, selection(0, 11)], name: null };

export const NAMED_MEC_CODES: SoldierBuildCodes = { ...MEC_CODES, name: BUILD_NAME };

export const BIOSOLDIER_FORMAT = 1;

export const MEC_FORMAT = 3;

export const UNKNOWN_FORMAT = 5;

export const PERKS_SECTION_ID = 1;

export const NAME_SECTION_ID = 2;

export const GENE_MODS_SECTION_ID = 3;

export const PSIONIC_SECTION_ID = 4;

export const OFFICER_SECTION_ID = 5;

export const UNKNOWN_SECTION_ID = 20;

export const INVALID_RESULT = { status: 'invalid' };

export const BIOSOLDIER_DECODED_RESULT = { status: 'unit', unit: { kind: 'biosoldier', build: BIOSOLDIER_BUILD_STUB, loadout: null } };

export const MEC_DECODED_RESULT = { status: 'unit', unit: { kind: 'mec', build: MEC_BUILD_STUB, loadout: null } };

export const GARBAGE_CODE = 'not a code';

/**
 * Writes steps with raw numbers: count 3 bits, then per step a bit for a selection and, for a selection, its variant
 * index and its ability number 8 bits.
 *
 * @param writer section writer.
 * @param steps selections by step; null for an empty step.
 * @param variantBits width of the variant index.
 */
const writeSteps = (writer: BitWriter, steps: Readonly<StepCodes>, variantBits: number) => {
  writer.writeUint(steps.length, 3);
  steps.forEach((step) => {
    writer.writeUint(step ? 1 : 0, 1);

    if (!step) return;

    writer.writeUint(step.variantIndex, variantBits);
    writer.writeUint(step.code, 8);
  });
};

/**
 * `PERKS` section with raw numbers: class 5 bits, then the ranks with variant indexes of 2 bits.
 *
 * @param classCode class number.
 * @param steps selections by rank, from the second rank.
 * @param extraBits number of zero bits written after the fields.
 */
export const perksSection = (classCode: number, steps: Readonly<StepCodes>, extraBits = 0): BinaryCodeSection => ({
  id: PERKS_SECTION_ID,
  write: (writer: BitWriter) => {
    writer.writeUint(classCode, 5);
    writeSteps(writer, steps, 2);
    writer.writeUint(0, extraBits);
  },
});

/**
 * Section of steps with raw numbers.
 *
 * @param id section id.
 * @param steps selections by step.
 * @param variantBits width of the variant index.
 * @param extraBits number of zero bits written after the fields.
 */
const stepsSection = (id: number, steps: Readonly<StepCodes>, variantBits: number, extraBits: number): BinaryCodeSection => ({
  id,
  write: (writer: BitWriter) => {
    writeSteps(writer, steps, variantBits);
    writer.writeUint(0, extraBits);
  },
});

/**
 * `GENE_MODS` section with raw numbers: variant indexes of 1 bit.
 *
 * @param steps selections by body part.
 * @param extraBits number of zero bits written after the fields.
 */
export const geneModsSection = (steps: Readonly<StepCodes>, extraBits = 0) => stepsSection(GENE_MODS_SECTION_ID, steps, 1, extraBits);

/**
 * `PSIONIC` section with raw numbers: variant indexes of 2 bits.
 *
 * @param steps selections by psi level.
 * @param extraBits number of zero bits written after the fields.
 */
export const psionicSection = (steps: Readonly<StepCodes>, extraBits = 0) => stepsSection(PSIONIC_SECTION_ID, steps, 2, extraBits);

/**
 * `OFFICER` section with raw numbers: variant indexes of 1 bit.
 *
 * @param steps selections by officer rank.
 * @param extraBits number of zero bits written after the fields.
 */
export const officerSection = (steps: Readonly<StepCodes>, extraBits = 0) => stepsSection(OFFICER_SECTION_ID, steps, 1, extraBits);

export const SINGLE_GENE_MOD_STEPS = [selection(0, 21)];

export const SINGLE_PSIONIC_STEPS = [selection(0, 31)];

export const SINGLE_OFFICER_STEPS = [selection(0, 41)];

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
