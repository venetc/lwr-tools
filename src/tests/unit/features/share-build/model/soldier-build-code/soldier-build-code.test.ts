import { describe, expect, it, vi } from 'vitest';

import { biosoldierBuildCodes, biosoldierBuildFromCodes, mecBuildCodes, mecBuildFromCodes } from '@entities/soldier';
import { encodeBuild } from '@features/share-build/model/build-code';
import { readShareCode } from '@features/share-build/model/share-code';
import { encodeBinaryCode } from '@shared/lib/binary-code';

import {
  BIOSOLDIER_BUILD_STUB,
  BIOSOLDIER_DECODED_RESULT,
  BIOSOLDIER_FORMAT,
  BROKEN_NAME_SECTION,
  BUILD_NAME,
  FULL_CODES,
  GARBAGE_CODE,
  geneModsSection,
  INVALID_RESULT,
  MEC_BUILD_STUB,
  MEC_CODES,
  MEC_DECODED_RESULT,
  MEC_FORMAT,
  MEC_PERKS_SECTION,
  NAMED_CODES,
  NAMED_MEC_CODES,
  nameSection,
  NO_GENE_MODS_CODES,
  NO_OFFICER_CODES,
  NO_PSIONIC_CODES,
  officerSection,
  perksSection,
  PLAIN_CODES,
  PLAIN_PERKS_SECTION,
  psionicSection,
  UNKNOWN_FORMAT,
  UNKNOWN_SECTION,
} from './soldier-build-code.mock';

vi.mock('@entities/soldier', () => ({
  biosoldierBuildCodes: vi.fn(),
  biosoldierBuildFromCodes: vi.fn(),
  mecBuildCodes: vi.fn(),
  mecBuildFromCodes: vi.fn(),
}));

const FULL_SECTIONS = [
  PLAIN_PERKS_SECTION,
  geneModsSection(FULL_CODES.geneMods),
  psionicSection(FULL_CODES.psionicAbilities),
  officerSection(FULL_CODES.officerPerks),
];

describe('encodeBuild of a biosoldier build', () => {
  it('writes only the perks section for a build without parts and with the default name', () => {
    vi.mocked(biosoldierBuildCodes).mockReturnValue(PLAIN_CODES);

    const code = encodeBuild('biosoldier', BIOSOLDIER_BUILD_STUB);

    expect(code).toBe(encodeBinaryCode(BIOSOLDIER_FORMAT, [PLAIN_PERKS_SECTION]));
  });

  it('writes the sections of every part', () => {
    vi.mocked(biosoldierBuildCodes).mockReturnValue(FULL_CODES);

    const code = encodeBuild('biosoldier', BIOSOLDIER_BUILD_STUB);

    expect(code).toBe(encodeBinaryCode(BIOSOLDIER_FORMAT, FULL_SECTIONS));
  });

  it('writes the name section for its own name', () => {
    vi.mocked(biosoldierBuildCodes).mockReturnValue(NAMED_CODES);

    const code = encodeBuild('biosoldier', BIOSOLDIER_BUILD_STUB);

    expect(code).toBe(encodeBinaryCode(BIOSOLDIER_FORMAT, [PLAIN_PERKS_SECTION, nameSection(BUILD_NAME)]));
  });

  it('leaves out the gene mods section without gene mods', () => {
    vi.mocked(biosoldierBuildCodes).mockReturnValue(NO_GENE_MODS_CODES);

    const code = encodeBuild('biosoldier', BIOSOLDIER_BUILD_STUB);

    expect(code).toBe(encodeBinaryCode(BIOSOLDIER_FORMAT, [FULL_SECTIONS[0], FULL_SECTIONS[2], FULL_SECTIONS[3]]));
  });

  it('leaves out the psionic section without psionic abilities', () => {
    vi.mocked(biosoldierBuildCodes).mockReturnValue(NO_PSIONIC_CODES);

    const code = encodeBuild('biosoldier', BIOSOLDIER_BUILD_STUB);

    expect(code).toBe(encodeBinaryCode(BIOSOLDIER_FORMAT, [FULL_SECTIONS[0], FULL_SECTIONS[1], FULL_SECTIONS[3]]));
  });

  it('leaves out the officer section without officer perks', () => {
    vi.mocked(biosoldierBuildCodes).mockReturnValue(NO_OFFICER_CODES);

    const code = encodeBuild('biosoldier', BIOSOLDIER_BUILD_STUB);

    expect(code).toBe(encodeBinaryCode(BIOSOLDIER_FORMAT, [FULL_SECTIONS[0], FULL_SECTIONS[1], FULL_SECTIONS[2]]));
  });

  it('gives null for a build without codes', () => {
    vi.mocked(biosoldierBuildCodes).mockReturnValue(null);

    const code = encodeBuild('biosoldier', BIOSOLDIER_BUILD_STUB);

    expect(code).toBeNull();
  });
});

describe('readShareCode of a biosoldier build code', () => {
  it('gives the build of the codes', () => {
    vi.mocked(biosoldierBuildFromCodes).mockReturnValue(BIOSOLDIER_BUILD_STUB);
    const code = encodeBinaryCode(BIOSOLDIER_FORMAT, FULL_SECTIONS) ?? '';

    const result = readShareCode(code);

    expect(result).toEqual(BIOSOLDIER_DECODED_RESULT);
  });

  it('reads the codes of every part', () => {
    const code = encodeBinaryCode(BIOSOLDIER_FORMAT, FULL_SECTIONS) ?? '';

    readShareCode(code);

    expect(biosoldierBuildFromCodes).toHaveBeenLastCalledWith(FULL_CODES);
  });

  it('reads empty parts and no name without their sections', () => {
    const code = encodeBinaryCode(BIOSOLDIER_FORMAT, [PLAIN_PERKS_SECTION]) ?? '';

    readShareCode(code);

    expect(biosoldierBuildFromCodes).toHaveBeenLastCalledWith(PLAIN_CODES);
  });

  it('reads the name of the name section', () => {
    const code = encodeBinaryCode(BIOSOLDIER_FORMAT, [PLAIN_PERKS_SECTION, nameSection(BUILD_NAME)]) ?? '';

    readShareCode(code);

    expect(biosoldierBuildFromCodes).toHaveBeenLastCalledWith(NAMED_CODES);
  });

  it('skips unknown sections', () => {
    const code = encodeBinaryCode(BIOSOLDIER_FORMAT, [PLAIN_PERKS_SECTION, UNKNOWN_SECTION]) ?? '';

    readShareCode(code);

    expect(biosoldierBuildFromCodes).toHaveBeenLastCalledWith(PLAIN_CODES);
  });

  it('rejects codes that make no build', () => {
    vi.mocked(biosoldierBuildFromCodes).mockReturnValue(null);
    const code = encodeBinaryCode(BIOSOLDIER_FORMAT, FULL_SECTIONS) ?? '';

    const result = readShareCode(code);

    expect(result).toEqual(INVALID_RESULT);
  });

  it.each([
    ['perks', [perksSection(PLAIN_CODES.classCode, PLAIN_CODES.perks, 1)]],
    ['name', [PLAIN_PERKS_SECTION, BROKEN_NAME_SECTION]],
    ['gene mods', [PLAIN_PERKS_SECTION, geneModsSection([21], 1)]],
    ['psionic', [PLAIN_PERKS_SECTION, psionicSection([31], 1)]],
    ['officer', [PLAIN_PERKS_SECTION, officerSection([41], 1)]],
  ])('rejects a broken %s section', (_, sections) => {
    vi.mocked(biosoldierBuildFromCodes).mockReturnValue(BIOSOLDIER_BUILD_STUB);
    const code = encodeBinaryCode(BIOSOLDIER_FORMAT, sections) ?? '';

    const result = readShareCode(code);

    expect(result).toEqual(INVALID_RESULT);
  });

  it('rejects a code without the perks section', () => {
    vi.mocked(biosoldierBuildFromCodes).mockReturnValue(BIOSOLDIER_BUILD_STUB);
    const code = encodeBinaryCode(BIOSOLDIER_FORMAT, [UNKNOWN_SECTION]) ?? '';

    const result = readShareCode(code);

    expect(result).toEqual(INVALID_RESULT);
  });

  it('rejects a string that is not a code', () => {
    const result = readShareCode(GARBAGE_CODE);

    expect(result).toEqual(INVALID_RESULT);
  });

  it('rejects a code of an unknown format', () => {
    const code = encodeBinaryCode(UNKNOWN_FORMAT, [PLAIN_PERKS_SECTION]) ?? '';

    const result = readShareCode(code);

    expect(result).toEqual(INVALID_RESULT);
  });
});

describe('encodeBuild of a MEC build', () => {
  it('writes the perks section and the name section for its own name', () => {
    vi.mocked(mecBuildCodes).mockReturnValue(NAMED_MEC_CODES);

    const code = encodeBuild('mec', MEC_BUILD_STUB);

    expect(code).toBe(encodeBinaryCode(MEC_FORMAT, [MEC_PERKS_SECTION, nameSection(BUILD_NAME)]));
  });

  it('gives null for a build without codes', () => {
    vi.mocked(mecBuildCodes).mockReturnValue(null);

    const code = encodeBuild('mec', MEC_BUILD_STUB);

    expect(code).toBeNull();
  });
});

describe('readShareCode of a MEC build code', () => {
  it('gives the build of the codes', () => {
    vi.mocked(mecBuildFromCodes).mockReturnValue(MEC_BUILD_STUB);
    const code = encodeBinaryCode(MEC_FORMAT, [MEC_PERKS_SECTION]) ?? '';

    const result = readShareCode(code);

    expect(result).toEqual(MEC_DECODED_RESULT);
  });

  it('skips the sections of biosoldier parts', () => {
    const code = encodeBinaryCode(MEC_FORMAT, [MEC_PERKS_SECTION, geneModsSection([20]), psionicSection([30]), officerSection([40])]) ?? '';

    readShareCode(code);

    expect(mecBuildFromCodes).toHaveBeenLastCalledWith(MEC_CODES);
  });

  it('rejects codes that make no build', () => {
    vi.mocked(mecBuildFromCodes).mockReturnValue(null);
    const code = encodeBinaryCode(MEC_FORMAT, [MEC_PERKS_SECTION]) ?? '';

    const result = readShareCode(code);

    expect(result).toEqual(INVALID_RESULT);
  });
});
