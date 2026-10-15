import { describe, expect, it, vi } from 'vitest';

import { decodeBiosoldierBuild, decodeMecBuild, encodeBiosoldierBuild, encodeMecBuild, soldierBuildCodec } from '@features/share-build/model/soldier-build-code';
import { encodeBinaryCode, openBinaryCode } from '@shared/lib/binary-code';

import {
  BIOSOLDIER_CLASS_CODE,
  BIOSOLDIER_CODE_RESULT,
  BIOSOLDIER_FORMAT,
  BOUND_CLASS_BY_CODE,
  BROKEN_NAME_SECTION,
  DEFAULT_NAME_BUILD,
  GARBAGE_CODE,
  INVALID_RESULT,
  MEC_CLASS_CODE,
  MEC_CODE_RESULT,
  MEC_DEFAULT_NAME_BUILD,
  MEC_FORMAT,
  MEC_NAMED_BUILD,
  NAME_SECTION_ID,
  NAMED_BUILD,
  OTHER_CLASS_BUILD,
  OTHER_CLASS_CODE,
  perksSection,
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

vi.mock('@entities/soldier/config/constants/biosoldier-class-icons', () => ({ BIOSOLDIER_CLASS_ICON: {} }));

vi.mock('@entities/soldier/config/constants/mec-class-content', async () => ({
  MEC_CLASS_CONTENT: (await import('./soldier-build-code.mock')).MEC_CLASS_CONTENT_MOCK,
}));

vi.mock('@entities/soldier/config/constants/mec-class-icons', () => ({ MEC_CLASS_ICON: {} }));

vi.mock('@entities/soldier/config/constants/soldier-rank-icons', () => ({ SOLDIER_RANK_ICON: {} }));

describe('encodeBiosoldierBuild', () => {
  it('leaves out the name section for the default name', () => {
    const code = encodeBiosoldierBuild(DEFAULT_NAME_BUILD) ?? '';

    const binaryCode = openBinaryCode(code);

    expect(binaryCode?.sections.has(NAME_SECTION_ID)).toBe(false);
  });

  it('gives null for a build with an unknown perk', () => {
    const code = encodeBiosoldierBuild(UNKNOWN_PERK_BUILD);

    expect(code).toBeNull();
  });
});

describe('decodeBiosoldierBuild', () => {
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

    const result = soldierBuildCodec(BIOSOLDIER_FORMAT, BOUND_CLASS_BY_CODE).decode(code);

    expect(result).toEqual(INVALID_RESULT);
  });

  it('gives null for a build with a class outside its class list', () => {
    const code = soldierBuildCodec(BIOSOLDIER_FORMAT, BOUND_CLASS_BY_CODE).encode(OTHER_CLASS_BUILD);

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
