import { describe, expect, it, vi } from 'vitest';

import { decodeBiosoldierBuild, encodeBiosoldierBuild } from '@features/share-build/model/biosoldier-build-code';
import { encodeBinaryCode, openBinaryCode } from '@shared/lib/binary-code';

import {
  BROKEN_NAME_SECTION,
  DEFAULT_NAME_BUILD,
  FORMAT,
  GARBAGE_CODE,
  INVALID_RESULT,
  NAME_SECTION_ID,
  NAMED_BUILD,
  perksSection,
  SHIV_CODE_RESULT,
  SHIV_FORMAT,
  UNKNOWN_FORMAT,
  UNKNOWN_PERK_BUILD,
  UNKNOWN_SECTION,
  VALID_PERKS_SECTION,
} from './biosoldier-build-code.mock';

vi.mock('@entities/biosoldier/config/constants/ability-content', async () => ({
  ABILITY_CONTENT: (await import('./biosoldier-build-code.mock')).ABILITY_CONTENT_MOCK,
}));

vi.mock('@entities/biosoldier/config/constants/biosoldier-class-content', async () => ({
  BIOSOLDIER_CLASS_CONTENT: (await import('./biosoldier-build-code.mock')).BIOSOLDIER_CLASS_CONTENT_MOCK,
}));

vi.mock('@entities/biosoldier/config/constants/soldier-rank-content', async () => ({
  SOLDIER_RANK_CONTENT: (await import('./biosoldier-build-code.mock')).SOLDIER_RANK_CONTENT_MOCK,
}));

vi.mock('@entities/biosoldier/config/constants/ability-icons', () => ({ ABILITY_ICON: {} }));

vi.mock('@entities/biosoldier/config/constants/biosoldier-class-icons', () => ({ BIOSOLDIER_CLASS_ICON: {} }));

vi.mock('@entities/biosoldier/config/constants/soldier-rank-icons', () => ({ SOLDIER_RANK_ICON: {} }));

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
    const code = encodeBinaryCode(FORMAT, [VALID_PERKS_SECTION, UNKNOWN_SECTION]) ?? '';

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
    const code = encodeBinaryCode(FORMAT, [UNKNOWN_SECTION]) ?? '';

    const result = decodeBiosoldierBuild(code);

    expect(result).toEqual(INVALID_RESULT);
  });

  it('rejects an unknown class', () => {
    const code = encodeBinaryCode(FORMAT, [perksSection(30, [12])]) ?? '';

    const result = decodeBiosoldierBuild(code);

    expect(result).toEqual(INVALID_RESULT);
  });

  it('rejects an unknown ability', () => {
    const code = encodeBinaryCode(FORMAT, [perksSection(3, [99])]) ?? '';

    const result = decodeBiosoldierBuild(code);

    expect(result).toEqual(INVALID_RESULT);
  });

  it('rejects more perks than ranks', () => {
    const code = encodeBinaryCode(FORMAT, [perksSection(3, [11, 12, 13])]) ?? '';

    const result = decodeBiosoldierBuild(code);

    expect(result).toEqual(INVALID_RESULT);
  });

  it('rejects a perks section with unread bits', () => {
    const code = encodeBinaryCode(FORMAT, [perksSection(3, [12], 1)]) ?? '';

    const result = decodeBiosoldierBuild(code);

    expect(result).toEqual(INVALID_RESULT);
  });

  it('rejects a broken name section when the name is requested', () => {
    const code = encodeBinaryCode(FORMAT, [VALID_PERKS_SECTION, BROKEN_NAME_SECTION]) ?? '';

    const result = decodeBiosoldierBuild(code);

    expect(result).toEqual(INVALID_RESULT);
  });
});
