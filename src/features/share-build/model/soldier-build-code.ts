import type { BiosoldierBuildCodes, BiosoldierBuildData, SoldierBuildCodes, SoldierBuildData, StepCodes } from '@entities/soldier';
import { biosoldierBuildCodes, biosoldierBuildFromCodes, mecBuildCodes, mecBuildFromCodes } from '@entities/soldier';
import type { BinaryCodeSection, BitReader } from '@shared/lib/binary-code';

import {
  BODY_PART_STEP_BITS,
  CLASS_CODE_BITS,
  OFFICER_RANK_STEP_BITS,
  PSI_LEVEL_STEP_BITS,
  RANK_STEP_BITS,
  SHARE_CODE_FORMAT,
  SOLDIER_BUILD_SECTION,
} from '../config/constants';
import type { BuildCodeLayout } from './build-code';
import type { StepListBits } from './section-fields';
import { nameSection, readNameSection, readStepList, readWholeSection, writeStepList } from './section-fields';

/**
 * Parts a soldier format carries beyond the class, perks and name: their sections and how they are read.
 */
interface SoldierBuildExtension<Codes extends SoldierBuildCodes> {
  /** Sections of the extra parts the codes have, by ascending id. */
  write: (codes: Codes) => BinaryCodeSection[]
  /** Codes of the soldier build with the extra parts read from the code sections; null if a section is broken. */
  read: (codes: SoldierBuildCodes, sections: ReadonlyMap<number, BitReader>) => Codes | null
}

/**
 * Layout of soldier build codes of one format: the `PERKS` and `NAME` sections of every soldier, plus the parts of the
 * format extension, over the build codes of the entity.
 *
 * @param format share code format number.
 * @param buildCodes build codes of a build; null if it cannot be encoded.
 * @param buildFromCodes build of the codes; null if they make no build.
 * @param extension parts of the format beyond the soldier ones.
 */
const soldierBuildLayout = <Build, Codes extends SoldierBuildCodes>(
  format: number,
  buildCodes: (build: Build) => Codes | null,
  buildFromCodes: (codes: Codes) => Build | null,
  extension: SoldierBuildExtension<Codes>,
): BuildCodeLayout<Build> => {
  /**
   * Sections of the build: the `PERKS` section with the class and perks, the `NAME` section if the build has its own
   * name, then the extension sections.
   *
   * @param build soldier build of the format.
   * @returns the sections; null if the build has no codes.
   */
  const writeBuild = (build: Build) => {
    const codes = buildCodes(build);

    if (!codes) return null;

    const sections: BinaryCodeSection[] = [{
      id: SOLDIER_BUILD_SECTION.PERKS,
      write: (writer) => {
        writer.writeUint(codes.classCode, CLASS_CODE_BITS);
        writeStepList(writer, codes.perks, RANK_STEP_BITS);
      },
    }];

    if (codes.name !== null) sections.push(nameSection(SOLDIER_BUILD_SECTION.NAME, codes.name));

    sections.push(...extension.write(codes));

    return sections;
  };

  /**
   * Build of the code sections. Absent sections of the extra parts give empty parts; unknown sections are skipped.
   *
   * @param sections code sections by id.
   * @returns the build; null if there is no `PERKS` section, a section is broken, or the codes make no build.
   */
  const readBuild = (sections: ReadonlyMap<number, BitReader>) => {
    const perksReader = sections.get(SOLDIER_BUILD_SECTION.PERKS) ?? null;
    const perks = perksReader && readWholeSection(perksReader, reader => ({
      classCode: reader.readUint(CLASS_CODE_BITS),
      perks: readStepList(reader, RANK_STEP_BITS),
    }));
    const nameField = readNameSection(sections.get(SOLDIER_BUILD_SECTION.NAME) ?? null);

    if (!perks || !nameField) return null;

    const codes = extension.read({ ...perks, name: nameField.name }, sections);

    return codes && buildFromCodes(codes);
  };

  return { format, loadoutSection: SOLDIER_BUILD_SECTION.LOADOUT, writeBuild, readBuild };
};

/**
 * Section of the steps of a branch; none for a branch without selections, whose steps are empty.
 *
 * @param id section id.
 * @param steps selections by step; empty for a branch without any.
 * @param bits widths of the step list fields.
 */
const branchSections = (id: number, steps: Readonly<StepCodes>, bits: StepListBits): BinaryCodeSection[] => {
  if (steps.length === 0) return [];

  return [{ id, write: writer => writeStepList(writer, steps, bits) }];
};

/**
 * Steps of a branch section read in whole.
 *
 * @param sections code sections by id.
 * @param id section id.
 * @param bits widths of the step list fields.
 * @returns the selections by step; an empty list without the section; null if the section is broken or has no steps.
 */
const readBranchSection = (sections: ReadonlyMap<number, BitReader>, id: number, bits: StepListBits) => {
  const reader = sections.get(id) ?? null;

  if (!reader) return [];

  const steps = readWholeSection(reader, sectionReader => readStepList(sectionReader, bits));

  if (!steps?.length) return null;

  return steps;
};

/** Soldier format without extra parts: the codes are the soldier codes. */
const SOLDIER_BUILD_EXTENSION: SoldierBuildExtension<SoldierBuildCodes> = {
  write: () => [],
  read: codes => codes,
};

/**
 * Biosoldier format: the soldier codes with the body parts in the `GENE_MODS` section, the psi levels in the `PSIONIC`
 * section and the officer ranks in the `OFFICER` section, each written only when the build has a selection there.
 */
const BIOSOLDIER_BUILD_EXTENSION: SoldierBuildExtension<BiosoldierBuildCodes> = {
  write: codes => [
    ...branchSections(SOLDIER_BUILD_SECTION.GENE_MODS, codes.geneMods, BODY_PART_STEP_BITS),
    ...branchSections(SOLDIER_BUILD_SECTION.PSIONIC, codes.psionicAbilities, PSI_LEVEL_STEP_BITS),
    ...branchSections(SOLDIER_BUILD_SECTION.OFFICER, codes.officerPerks, OFFICER_RANK_STEP_BITS),
  ],
  read: (codes, sections) => {
    const geneMods = readBranchSection(sections, SOLDIER_BUILD_SECTION.GENE_MODS, BODY_PART_STEP_BITS);
    const psionicAbilities = readBranchSection(sections, SOLDIER_BUILD_SECTION.PSIONIC, PSI_LEVEL_STEP_BITS);
    const officerPerks = readBranchSection(sections, SOLDIER_BUILD_SECTION.OFFICER, OFFICER_RANK_STEP_BITS);

    if (!geneMods || !psionicAbilities || !officerPerks) return null;

    return { ...codes, geneMods, psionicAbilities, officerPerks };
  },
};

/** Layout of biosoldier build codes: format 1 with the biosoldier codes, gene mods, psionic abilities and officer perks included. */
export const BIOSOLDIER_BUILD_LAYOUT = soldierBuildLayout<BiosoldierBuildData, BiosoldierBuildCodes>(
  SHARE_CODE_FORMAT.BIOSOLDIER_BUILD,
  biosoldierBuildCodes,
  biosoldierBuildFromCodes,
  BIOSOLDIER_BUILD_EXTENSION,
);

/** Layout of MEC build codes: format 3 with the MEC codes. */
export const MEC_BUILD_LAYOUT = soldierBuildLayout<SoldierBuildData, SoldierBuildCodes>(
  SHARE_CODE_FORMAT.MEC_BUILD,
  mecBuildCodes,
  mecBuildFromCodes,
  SOLDIER_BUILD_EXTENSION,
);
