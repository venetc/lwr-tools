import { describe, expect, it, vi } from 'vitest';

import { shivBuildCodes, shivBuildFromCodes } from '@entities/shiv';
import { decodeShivBuild, encodeShivBuild } from '@features/share-build/model/shiv-build-code';
import { encodeBinaryCode } from '@shared/lib/binary-code';

import {
  BIOSOLDIER_CODE_RESULT,
  BIOSOLDIER_FORMAT,
  BROKEN_NAME_SECTION,
  BUILD_NAME,
  BUILD_STUB,
  DECODED_RESULT,
  DEFAULT_NAME_CODES,
  GARBAGE_CODE,
  INVALID_RESULT,
  MEC_CODE_RESULT,
  MEC_FORMAT,
  NAMED_CODES,
  nameSection,
  perksSection,
  SHIV_FORMAT,
  UNKNOWN_SECTION,
} from './shiv-build-code.mock';

vi.mock('@entities/shiv', () => ({ shivBuildCodes: vi.fn(), shivBuildFromCodes: vi.fn() }));

describe('encodeShivBuild', () => {
  it('writes the perks section without the name section for the default name', () => {
    vi.mocked(shivBuildCodes).mockReturnValue(DEFAULT_NAME_CODES);

    const code = encodeShivBuild(BUILD_STUB);

    expect(code).toBe(encodeBinaryCode(SHIV_FORMAT, [perksSection(DEFAULT_NAME_CODES.perks)]));
  });

  it('writes the name section for its own name', () => {
    vi.mocked(shivBuildCodes).mockReturnValue(NAMED_CODES);

    const code = encodeShivBuild(BUILD_STUB);

    expect(code).toBe(encodeBinaryCode(SHIV_FORMAT, [perksSection(NAMED_CODES.perks), nameSection(BUILD_NAME)]));
  });

  it('gives null for a build without codes', () => {
    vi.mocked(shivBuildCodes).mockReturnValue(null);

    const code = encodeShivBuild(BUILD_STUB);

    expect(code).toBeNull();
  });
});

describe('decodeShivBuild', () => {
  it('gives the build of the codes', () => {
    vi.mocked(shivBuildFromCodes).mockReturnValue(BUILD_STUB);
    const code = encodeBinaryCode(SHIV_FORMAT, [perksSection(DEFAULT_NAME_CODES.perks)]) ?? '';

    const result = decodeShivBuild(code);

    expect(result).toEqual(DECODED_RESULT);
  });

  it('reads the perk codes and no name without the name section', () => {
    const code = encodeBinaryCode(SHIV_FORMAT, [perksSection(DEFAULT_NAME_CODES.perks)]) ?? '';

    decodeShivBuild(code);

    expect(shivBuildFromCodes).toHaveBeenLastCalledWith(DEFAULT_NAME_CODES);
  });

  it('reads the name of the name section', () => {
    const code = encodeBinaryCode(SHIV_FORMAT, [perksSection(NAMED_CODES.perks), nameSection(BUILD_NAME)]) ?? '';

    decodeShivBuild(code);

    expect(shivBuildFromCodes).toHaveBeenLastCalledWith(NAMED_CODES);
  });

  it('skips unknown sections', () => {
    const code = encodeBinaryCode(SHIV_FORMAT, [perksSection(DEFAULT_NAME_CODES.perks), UNKNOWN_SECTION]) ?? '';

    decodeShivBuild(code);

    expect(shivBuildFromCodes).toHaveBeenLastCalledWith(DEFAULT_NAME_CODES);
  });

  it('rejects codes that make no build', () => {
    vi.mocked(shivBuildFromCodes).mockReturnValue(null);
    const code = encodeBinaryCode(SHIV_FORMAT, [perksSection(DEFAULT_NAME_CODES.perks)]) ?? '';

    const result = decodeShivBuild(code);

    expect(result).toEqual(INVALID_RESULT);
  });

  it('rejects a perks section with unread bits', () => {
    vi.mocked(shivBuildFromCodes).mockReturnValue(BUILD_STUB);
    const code = encodeBinaryCode(SHIV_FORMAT, [perksSection([1], 1)]) ?? '';

    const result = decodeShivBuild(code);

    expect(result).toEqual(INVALID_RESULT);
  });

  it('rejects a broken name section', () => {
    vi.mocked(shivBuildFromCodes).mockReturnValue(BUILD_STUB);
    const code = encodeBinaryCode(SHIV_FORMAT, [perksSection([1]), BROKEN_NAME_SECTION]) ?? '';

    const result = decodeShivBuild(code);

    expect(result).toEqual(INVALID_RESULT);
  });

  it('rejects a code without the perks section', () => {
    vi.mocked(shivBuildFromCodes).mockReturnValue(BUILD_STUB);
    const code = encodeBinaryCode(SHIV_FORMAT, [UNKNOWN_SECTION]) ?? '';

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
