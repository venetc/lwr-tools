import { describe, expect, it, vi } from 'vitest';

import { decodeBiosoldierBuild, decodeMecBuild, encodeBiosoldierBuild, encodeMecBuild, SOLDIER_BUILD_EXTENSION, soldierBuildCodec } from '@features/share-build/model/soldier-build-code';
import { encodeBinaryCode, openBinaryCode } from '@shared/lib/binary-code';

import {
  BIOSOLDIER_CLASS_CODE,
  BIOSOLDIER_CODE_RESULT,
  BIOSOLDIER_FORMAT,
  BOUND_CLASS_BY_CODE,
  BROKEN_NAME_SECTION,
  DEFAULT_NAME_BUILD,
  EXCESS_PSIONIC_ABILITIES_BUILD,
  GARBAGE_CODE,
  GENE_MODS_BUILD,
  GENE_MODS_SECTION_ID,
  geneModsSection,
  INVALID_RESULT,
  MEC_CLASS_CODE,
  MEC_CODE_RESULT,
  MEC_DEFAULT_NAME_BUILD,
  MEC_FORMAT,
  MEC_NAMED_BUILD,
  MISPLACED_GENE_MOD_BUILD,
  MISPLACED_PSIONIC_ABILITY_BUILD,
  NAME_SECTION_ID,
  NAMED_BUILD,
  NEURAL_DAMPING_BUILD,
  NEURAL_DAMPING_PSIONIC_BUILD,
  OTHER_CLASS_BUILD,
  OTHER_CLASS_CODE,
  perksSection,
  PSIONIC_BUILD,
  PSIONIC_SECTION_ID,
  psionicSection,
  SHIV_CODE_RESULT,
  SHIV_FORMAT,
  UNKNOWN_FORMAT,
  UNKNOWN_PERK_BUILD,
  UNKNOWN_SECTION,
  VALID_PERKS_SECTION,
} from './soldier-build-code.mock';

vi.mock('@entities/soldier/config/constants/ability-content', async () => ({
  ABILITY_CONTENT: (await import('./soldier-build-code.mock')).ABILITY_CONTENT_MOCK,
}));

vi.mock('@entities/soldier/config/constants/biosoldier-class-content', async () => ({
  BIOSOLDIER_CLASS_CONTENT: (await import('./soldier-build-code.mock')).BIOSOLDIER_CLASS_CONTENT_MOCK,
}));

vi.mock('@entities/soldier/config/constants/soldier-rank-content', async () => ({
  SOLDIER_RANK_CONTENT: (await import('./soldier-build-code.mock')).SOLDIER_RANK_CONTENT_MOCK,
}));

vi.mock('@entities/soldier/config/constants/ability-icons', () => ({ ABILITY_ICON: {} }));

vi.mock('@entities/soldier/config/constants/body-part-content', async () => ({
  BODY_PART_CONTENT: (await import('./soldier-build-code.mock')).BODY_PART_CONTENT_MOCK,
}));

vi.mock('@entities/soldier/config/constants/psi-level-content', async () => ({
  PSI_LEVEL_CONTENT: (await import('./soldier-build-code.mock')).PSI_LEVEL_CONTENT_MOCK,
}));

vi.mock('@entities/soldier/config/constants/biosoldier-class-icons', () => ({ BIOSOLDIER_CLASS_ICON: {} }));

vi.mock('@entities/soldier/config/constants/mec-class-content', async () => ({
  MEC_CLASS_CONTENT: (await import('./soldier-build-code.mock')).MEC_CLASS_CONTENT_MOCK,
}));

vi.mock('@entities/soldier/config/constants/mec-class-icons', () => ({ MEC_CLASS_ICON: {} }));

vi.mock('@entities/soldier/config/constants/soldier-rank-icons', () => ({ SOLDIER_RANK_ICON: {} }));

describe('encodeBiosoldierBuild', () => {
  it('leaves out the gene mods section for a build without gene mods', () => {
    const code = encodeBiosoldierBuild(DEFAULT_NAME_BUILD) ?? '';

    const binaryCode = openBinaryCode(code);

    expect(binaryCode?.sections.has(GENE_MODS_SECTION_ID)).toBe(false);
  });

  it('leaves out the psionic section for a build without psionic abilities', () => {
    const code = encodeBiosoldierBuild(GENE_MODS_BUILD) ?? '';

    const binaryCode = openBinaryCode(code);

    expect(binaryCode?.sections.has(PSIONIC_SECTION_ID)).toBe(false);
  });

  it('leaves out the name section for the default name', () => {
    const code = encodeBiosoldierBuild(DEFAULT_NAME_BUILD) ?? '';

    const binaryCode = openBinaryCode(code);

    expect(binaryCode?.sections.has(NAME_SECTION_ID)).toBe(false);
  });

  it('gives null for a build with a gene mod outside its body part', () => {
    const code = encodeBiosoldierBuild(MISPLACED_GENE_MOD_BUILD);

    expect(code).toBeNull();
  });

  it('gives null for a build with a psionic ability outside its psi level', () => {
    const code = encodeBiosoldierBuild(MISPLACED_PSIONIC_ABILITY_BUILD);

    expect(code).toBeNull();
  });

  it('gives null for a build with more psionic abilities than psi levels', () => {
    const code = encodeBiosoldierBuild(EXCESS_PSIONIC_ABILITIES_BUILD);

    expect(code).toBeNull();
  });

  it('gives null for a build with Neural Damping and psionic abilities', () => {
    const code = encodeBiosoldierBuild(NEURAL_DAMPING_PSIONIC_BUILD);

    expect(code).toBeNull();
  });

  it('gives null for a build with an unknown perk', () => {
    const code = encodeBiosoldierBuild(UNKNOWN_PERK_BUILD);

    expect(code).toBeNull();
  });
});

describe('decodeBiosoldierBuild', () => {
  it('restores a build with gene mods', () => {
    const code = encodeBiosoldierBuild(GENE_MODS_BUILD) ?? '';

    const result = decodeBiosoldierBuild(code);

    expect(result).toEqual({ status: 'decoded', build: GENE_MODS_BUILD });
  });

  it('restores a build with gene mods and psionic abilities', () => {
    const code = encodeBiosoldierBuild(PSIONIC_BUILD) ?? '';

    const result = decodeBiosoldierBuild(code);

    expect(result).toEqual({ status: 'decoded', build: PSIONIC_BUILD });
  });

  it('gives no gene mods when the gene mods part is not requested', () => {
    const code = encodeBiosoldierBuild(GENE_MODS_BUILD) ?? '';

    const result = decodeBiosoldierBuild(code, ['name']);

    expect(result).toEqual({ status: 'decoded', build: DEFAULT_NAME_BUILD });
  });

  it('gives no gene mods for a code without the gene mods section', () => {
    const code = encodeBinaryCode(BIOSOLDIER_FORMAT, [VALID_PERKS_SECTION]) ?? '';

    const result = decodeBiosoldierBuild(code);

    expect(result).toEqual({ status: 'decoded', build: DEFAULT_NAME_BUILD });
  });

  it('skips a broken gene mods section when gene mods are not requested', () => {
    const code = encodeBinaryCode(BIOSOLDIER_FORMAT, [VALID_PERKS_SECTION, geneModsSection([20], 1)]) ?? '';

    const result = decodeBiosoldierBuild(code, ['name']);

    expect(result).toEqual({ status: 'decoded', build: DEFAULT_NAME_BUILD });
  });

  it('rejects a gene mods section with an ability that is not a gene mod', () => {
    const code = encodeBinaryCode(BIOSOLDIER_FORMAT, [VALID_PERKS_SECTION, geneModsSection([12])]) ?? '';

    const result = decodeBiosoldierBuild(code);

    expect(result).toEqual(INVALID_RESULT);
  });

  it('rejects a gene mods section with an unknown ability', () => {
    const code = encodeBinaryCode(BIOSOLDIER_FORMAT, [VALID_PERKS_SECTION, geneModsSection([99])]) ?? '';

    const result = decodeBiosoldierBuild(code);

    expect(result).toEqual(INVALID_RESULT);
  });

  it('rejects two gene mods of one body part', () => {
    const code = encodeBinaryCode(BIOSOLDIER_FORMAT, [VALID_PERKS_SECTION, geneModsSection([20, 21])]) ?? '';

    const result = decodeBiosoldierBuild(code);

    expect(result).toEqual(INVALID_RESULT);
  });

  it('rejects gene mods out of body part order', () => {
    const code = encodeBinaryCode(BIOSOLDIER_FORMAT, [VALID_PERKS_SECTION, geneModsSection([22, 20])]) ?? '';

    const result = decodeBiosoldierBuild(code);

    expect(result).toEqual(INVALID_RESULT);
  });

  it('rejects a gene mods section with unread bits', () => {
    const code = encodeBinaryCode(BIOSOLDIER_FORMAT, [VALID_PERKS_SECTION, geneModsSection([20], 1)]) ?? '';

    const result = decodeBiosoldierBuild(code);

    expect(result).toEqual(INVALID_RESULT);
  });

  it('gives no psionic abilities for a code without the psionic section', () => {
    const code = encodeBinaryCode(BIOSOLDIER_FORMAT, [VALID_PERKS_SECTION, geneModsSection([21, 22])]) ?? '';

    const result = decodeBiosoldierBuild(code);

    expect(result).toEqual({ status: 'decoded', build: GENE_MODS_BUILD });
  });

  it('rejects a psionic ability that is not offered on its psi level', () => {
    const code = encodeBinaryCode(BIOSOLDIER_FORMAT, [VALID_PERKS_SECTION, psionicSection([32])]) ?? '';

    const result = decodeBiosoldierBuild(code);

    expect(result).toEqual(INVALID_RESULT);
  });

  it('rejects a psionic section with an unknown ability', () => {
    const code = encodeBinaryCode(BIOSOLDIER_FORMAT, [VALID_PERKS_SECTION, psionicSection([99])]) ?? '';

    const result = decodeBiosoldierBuild(code);

    expect(result).toEqual(INVALID_RESULT);
  });

  it('rejects more psionic abilities than psi levels', () => {
    const code = encodeBinaryCode(BIOSOLDIER_FORMAT, [VALID_PERKS_SECTION, psionicSection([30, 32, 32])]) ?? '';

    const result = decodeBiosoldierBuild(code);

    expect(result).toEqual(INVALID_RESULT);
  });

  it('rejects a psionic section with unread bits', () => {
    const code = encodeBinaryCode(BIOSOLDIER_FORMAT, [VALID_PERKS_SECTION, psionicSection([30], 1)]) ?? '';

    const result = decodeBiosoldierBuild(code);

    expect(result).toEqual(INVALID_RESULT);
  });

  it('rejects Neural Damping with psionic abilities', () => {
    const code = encodeBinaryCode(BIOSOLDIER_FORMAT, [VALID_PERKS_SECTION, geneModsSection([20]), psionicSection([30])]) ?? '';

    const result = decodeBiosoldierBuild(code);

    expect(result).toEqual(INVALID_RESULT);
  });

  it('keeps Neural Damping with psionic abilities when psionic abilities are not requested', () => {
    const code = encodeBinaryCode(BIOSOLDIER_FORMAT, [VALID_PERKS_SECTION, geneModsSection([20]), psionicSection([30])]) ?? '';

    const result = decodeBiosoldierBuild(code, ['name', 'geneMods']);

    expect(result).toEqual({ status: 'decoded', build: NEURAL_DAMPING_BUILD });
  });

  it('restores a build with the default name', () => {
    const code = encodeBiosoldierBuild(DEFAULT_NAME_BUILD) ?? '';

    const result = decodeBiosoldierBuild(code);

    expect(result).toEqual({ status: 'decoded', build: DEFAULT_NAME_BUILD });
  });

  it('restores a build with its own name', () => {
    const code = encodeBiosoldierBuild(NAMED_BUILD) ?? '';

    const result = decodeBiosoldierBuild(code);

    expect(result).toEqual({ status: 'decoded', build: NAMED_BUILD });
  });

  it('gives the default name when the name part is not requested', () => {
    const code = encodeBiosoldierBuild(NAMED_BUILD) ?? '';

    const result = decodeBiosoldierBuild(code, []);

    expect(result).toEqual({ status: 'decoded', build: DEFAULT_NAME_BUILD });
  });

  it('skips unknown sections', () => {
    const code = encodeBinaryCode(BIOSOLDIER_FORMAT, [VALID_PERKS_SECTION, UNKNOWN_SECTION]) ?? '';

    const result = decodeBiosoldierBuild(code);

    expect(result).toEqual({ status: 'decoded', build: DEFAULT_NAME_BUILD });
  });

  it('recognises a code of another unit', () => {
    const code = encodeBinaryCode(SHIV_FORMAT, [VALID_PERKS_SECTION]) ?? '';

    const result = decodeBiosoldierBuild(code);

    expect(result).toEqual(SHIV_CODE_RESULT);
  });

  it('rejects a code of an unknown format', () => {
    const code = encodeBinaryCode(UNKNOWN_FORMAT, [VALID_PERKS_SECTION]) ?? '';

    const result = decodeBiosoldierBuild(code);

    expect(result).toEqual(INVALID_RESULT);
  });

  it('rejects a string that is not a code', () => {
    const result = decodeBiosoldierBuild(GARBAGE_CODE);

    expect(result).toEqual(INVALID_RESULT);
  });

  it('rejects a code without the perks section', () => {
    const code = encodeBinaryCode(BIOSOLDIER_FORMAT, [UNKNOWN_SECTION]) ?? '';

    const result = decodeBiosoldierBuild(code);

    expect(result).toEqual(INVALID_RESULT);
  });

  it('rejects an unknown class', () => {
    const code = encodeBinaryCode(BIOSOLDIER_FORMAT, [perksSection(30, [12])]) ?? '';

    const result = decodeBiosoldierBuild(code);

    expect(result).toEqual(INVALID_RESULT);
  });

  it('rejects an unknown ability', () => {
    const code = encodeBinaryCode(BIOSOLDIER_FORMAT, [perksSection(BIOSOLDIER_CLASS_CODE, [99])]) ?? '';

    const result = decodeBiosoldierBuild(code);

    expect(result).toEqual(INVALID_RESULT);
  });

  it('rejects a known ability outside the class rank', () => {
    const code = encodeBinaryCode(BIOSOLDIER_FORMAT, [perksSection(BIOSOLDIER_CLASS_CODE, [13])]) ?? '';

    const result = decodeBiosoldierBuild(code);

    expect(result).toEqual(INVALID_RESULT);
  });

  it('rejects more perks than ranks', () => {
    const code = encodeBinaryCode(BIOSOLDIER_FORMAT, [perksSection(BIOSOLDIER_CLASS_CODE, [11, 12, 13])]) ?? '';

    const result = decodeBiosoldierBuild(code);

    expect(result).toEqual(INVALID_RESULT);
  });

  it('rejects a perks section with unread bits', () => {
    const code = encodeBinaryCode(BIOSOLDIER_FORMAT, [perksSection(BIOSOLDIER_CLASS_CODE, [12], 1)]) ?? '';

    const result = decodeBiosoldierBuild(code);

    expect(result).toEqual(INVALID_RESULT);
  });

  it('rejects a broken name section when the name is requested', () => {
    const code = encodeBinaryCode(BIOSOLDIER_FORMAT, [VALID_PERKS_SECTION, BROKEN_NAME_SECTION]) ?? '';

    const result = decodeBiosoldierBuild(code);

    expect(result).toEqual(INVALID_RESULT);
  });
});

describe('soldierBuildCodec', () => {
  it('rejects a code with a class outside its class list', () => {
    const code = encodeBinaryCode(BIOSOLDIER_FORMAT, [perksSection(OTHER_CLASS_CODE, [12])]) ?? '';

    const result = soldierBuildCodec(BIOSOLDIER_FORMAT, BOUND_CLASS_BY_CODE, SOLDIER_BUILD_EXTENSION).decode(code);

    expect(result).toEqual(INVALID_RESULT);
  });

  it('gives null for a build with a class outside its class list', () => {
    const code = soldierBuildCodec(BIOSOLDIER_FORMAT, BOUND_CLASS_BY_CODE, SOLDIER_BUILD_EXTENSION).encode(OTHER_CLASS_BUILD);

    expect(code).toBeNull();
  });
});

describe('encodeMecBuild', () => {
  it('leaves out the name section for the default name', () => {
    const code = encodeMecBuild(MEC_DEFAULT_NAME_BUILD) ?? '';

    const binaryCode = openBinaryCode(code);

    expect(binaryCode?.sections.has(NAME_SECTION_ID)).toBe(false);
  });

  it('gives null for a biosoldier build', () => {
    const code = encodeMecBuild(DEFAULT_NAME_BUILD);

    expect(code).toBeNull();
  });
});

describe('decodeMecBuild', () => {
  it('skips a gene mods section', () => {
    const code = encodeBinaryCode(MEC_FORMAT, [perksSection(MEC_CLASS_CODE, [12, 13]), geneModsSection([20])]) ?? '';

    const result = decodeMecBuild(code);

    expect(result).toEqual({ status: 'decoded', build: MEC_DEFAULT_NAME_BUILD });
  });

  it('skips a psionic section', () => {
    const code = encodeBinaryCode(MEC_FORMAT, [perksSection(MEC_CLASS_CODE, [12, 13]), psionicSection([30])]) ?? '';

    const result = decodeMecBuild(code);

    expect(result).toEqual({ status: 'decoded', build: MEC_DEFAULT_NAME_BUILD });
  });

  it('restores a build with the default name', () => {
    const code = encodeMecBuild(MEC_DEFAULT_NAME_BUILD) ?? '';

    const result = decodeMecBuild(code);

    expect(result).toEqual({ status: 'decoded', build: MEC_DEFAULT_NAME_BUILD });
  });

  it('restores a build with its own name', () => {
    const code = encodeMecBuild(MEC_NAMED_BUILD) ?? '';

    const result = decodeMecBuild(code);

    expect(result).toEqual({ status: 'decoded', build: MEC_NAMED_BUILD });
  });

  it('rejects a biosoldier class', () => {
    const code = encodeBinaryCode(MEC_FORMAT, [perksSection(BIOSOLDIER_CLASS_CODE, [12])]) ?? '';

    const result = decodeMecBuild(code);

    expect(result).toEqual(INVALID_RESULT);
  });

  it('recognises a biosoldier build code', () => {
    const code = encodeBinaryCode(BIOSOLDIER_FORMAT, [perksSection(BIOSOLDIER_CLASS_CODE, [12])]) ?? '';

    const result = decodeMecBuild(code);

    expect(result).toEqual(BIOSOLDIER_CODE_RESULT);
  });
});

describe('decodeBiosoldierBuild with MEC codes', () => {
  it('rejects a MEC class', () => {
    const code = encodeBinaryCode(BIOSOLDIER_FORMAT, [perksSection(MEC_CLASS_CODE, [12])]) ?? '';

    const result = decodeBiosoldierBuild(code);

    expect(result).toEqual(INVALID_RESULT);
  });

  it('recognises a MEC build code', () => {
    const code = encodeBinaryCode(MEC_FORMAT, [perksSection(MEC_CLASS_CODE, [12])]) ?? '';

    const result = decodeBiosoldierBuild(code);

    expect(result).toEqual(MEC_CODE_RESULT);
  });
});
