import { describe, expect, it, vi } from 'vitest';

import { decodeShivBuild, encodeShivBuild } from '@features/share-build/model/shiv-build-code';
import { encodeBinaryCode, openBinaryCode } from '@shared/lib/binary-code';

import {
  BIOSOLDIER_CODE_RESULT,
  BIOSOLDIER_FORMAT,
  DEFAULT_NAME_BUILD,
  GARBAGE_CODE,
  INVALID_RESULT,
  MEC_CODE_RESULT,
  MEC_FORMAT,
  NAME_SECTION_ID,
  NAMED_BUILD,
  perksSection,
  REVERSED_PERKS_BUILD,
  SHIV_FORMAT,
  UNKNOWN_PERK_BUILD,
} from './shiv-build-code.mock';

vi.mock('@entities/shiv/config/constants/perk-content', async () => ({
  SHIV_PERK_CONTENT: (await import('./shiv-build-code.mock')).SHIV_PERK_CONTENT_MOCK,
}));

vi.mock('@entities/shiv/config/constants/technology-level-content', async () => ({
  TECHNOLOGY_LEVEL_CONTENT: (await import('./shiv-build-code.mock')).TECHNOLOGY_LEVEL_CONTENT_MOCK,
}));

vi.mock('@entities/shiv/config/constants/perk-icons', () => ({ SHIV_PERK_ICON: {} }));

vi.mock('@entities/shiv/config/constants/technology-level-icons', () => ({ TECHNOLOGY_LEVEL_ICON: {} }));

describe('encodeShivBuild', () => {
  it('leaves out the name section for the default name', () => {
    const code = encodeShivBuild(DEFAULT_NAME_BUILD) ?? '';

    const binaryCode = openBinaryCode(code);

    expect(binaryCode?.sections.has(NAME_SECTION_ID)).toBe(false);
  });

  it('gives null for a build with an unknown perk', () => {
    const code = encodeShivBuild(UNKNOWN_PERK_BUILD);

    expect(code).toBeNull();
  });
});

describe('decodeShivBuild', () => {
  it('restores a build with the default name', () => {
    const code = encodeShivBuild(DEFAULT_NAME_BUILD) ?? '';

    const result = decodeShivBuild(code);

    expect(result).toEqual({ status: 'decoded', build: DEFAULT_NAME_BUILD });
  });

  it('restores a build with its own name', () => {
    const code = encodeShivBuild(NAMED_BUILD) ?? '';

    const result = decodeShivBuild(code);

    expect(result).toEqual({ status: 'decoded', build: NAMED_BUILD });
  });

  it('places each perk on its level whatever the order in the code', () => {
    const code = encodeBinaryCode(SHIV_FORMAT, [perksSection([5, 3, 1])]) ?? '';

    const result = decodeShivBuild(code);

    expect(result).toEqual({ status: 'decoded', build: REVERSED_PERKS_BUILD });
  });

  it('rejects an unknown perk', () => {
    const code = encodeBinaryCode(SHIV_FORMAT, [perksSection([1, 40])]) ?? '';

    const result = decodeShivBuild(code);

    expect(result).toEqual(INVALID_RESULT);
  });

  it('rejects two perks of one level', () => {
    const code = encodeBinaryCode(SHIV_FORMAT, [perksSection([1, 2])]) ?? '';

    const result = decodeShivBuild(code);

    expect(result).toEqual(INVALID_RESULT);
  });

  it('rejects more perks than levels', () => {
    const code = encodeBinaryCode(SHIV_FORMAT, [perksSection([1, 3, 5, 4])]) ?? '';

    const result = decodeShivBuild(code);

    expect(result).toEqual(INVALID_RESULT);
  });

  it('rejects a perks section with unread bits', () => {
    const code = encodeBinaryCode(SHIV_FORMAT, [perksSection([1], 1)]) ?? '';

    const result = decodeShivBuild(code);

    expect(result).toEqual(INVALID_RESULT);
  });

  it('rejects a string that is not a code', () => {
    const result = decodeShivBuild(GARBAGE_CODE);

    expect(result).toEqual(INVALID_RESULT);
  });

  it('recognises a biosoldier build code', () => {
    const code = encodeBinaryCode(BIOSOLDIER_FORMAT, [perksSection([1])]) ?? '';

    const result = decodeShivBuild(code);

    expect(result).toEqual(BIOSOLDIER_CODE_RESULT);
  });

  it('recognises a MEC build code', () => {
    const code = encodeBinaryCode(MEC_FORMAT, [perksSection([1])]) ?? '';

    const result = decodeShivBuild(code);

    expect(result).toEqual(MEC_CODE_RESULT);
  });
});
