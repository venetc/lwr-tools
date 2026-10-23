import { describe, expect, it, vi } from 'vitest';

import { shivBuildCodes, shivBuildFromCodes } from '@entities/shiv';
import { encodeBuild } from '@features/share-build/model/build-code';
import { readShareCode } from '@features/share-build/model/share-code';
import { encodeBinaryCode } from '@shared/lib/binary-code';

import {
  BROKEN_NAME_SECTION,
  BUILD_NAME,
  BUILD_STUB,
  DECODED_RESULT,
  DEFAULT_NAME_CODES,
  GARBAGE_CODE,
  INVALID_RESULT,
  NAMED_CODES,
  nameSection,
  perksSection,
  SHIV_FORMAT,
  UNKNOWN_SECTION,
} from './shiv-build-code.mock';

vi.mock('@entities/shiv', () => ({ shivBuildCodes: vi.fn(), shivBuildFromCodes: vi.fn() }));

describe('encodeBuild of a SHIV build', () => {
  it('writes the perks section without the name section for the default name', () => {
    vi.mocked(shivBuildCodes).mockReturnValue(DEFAULT_NAME_CODES);

    const code = encodeBuild('shiv', BUILD_STUB);

    expect(code).toBe(encodeBinaryCode(SHIV_FORMAT, [perksSection(DEFAULT_NAME_CODES.perks)]));
  });

  it('writes the name section for its own name', () => {
    vi.mocked(shivBuildCodes).mockReturnValue(NAMED_CODES);

    const code = encodeBuild('shiv', BUILD_STUB);

    expect(code).toBe(encodeBinaryCode(SHIV_FORMAT, [perksSection(NAMED_CODES.perks), nameSection(BUILD_NAME)]));
  });

  it('gives null for a build without codes', () => {
    vi.mocked(shivBuildCodes).mockReturnValue(null);

    const code = encodeBuild('shiv', BUILD_STUB);

    expect(code).toBeNull();
  });
});

describe('readShareCode of a SHIV build code', () => {
  it('gives the build of the codes', () => {
    vi.mocked(shivBuildFromCodes).mockReturnValue(BUILD_STUB);
    const code = encodeBinaryCode(SHIV_FORMAT, [perksSection(DEFAULT_NAME_CODES.perks)]) ?? '';

    const result = readShareCode(code);

    expect(result).toEqual(DECODED_RESULT);
  });

  it('reads the perk codes and no name without the name section', () => {
    const code = encodeBinaryCode(SHIV_FORMAT, [perksSection(DEFAULT_NAME_CODES.perks)]) ?? '';

    readShareCode(code);

    expect(shivBuildFromCodes).toHaveBeenLastCalledWith(DEFAULT_NAME_CODES);
  });

  it('reads the name of the name section', () => {
    const code = encodeBinaryCode(SHIV_FORMAT, [perksSection(NAMED_CODES.perks), nameSection(BUILD_NAME)]) ?? '';

    readShareCode(code);

    expect(shivBuildFromCodes).toHaveBeenLastCalledWith(NAMED_CODES);
  });

  it('skips unknown sections', () => {
    const code = encodeBinaryCode(SHIV_FORMAT, [perksSection(DEFAULT_NAME_CODES.perks), UNKNOWN_SECTION]) ?? '';

    readShareCode(code);

    expect(shivBuildFromCodes).toHaveBeenLastCalledWith(DEFAULT_NAME_CODES);
  });

  it('rejects codes that make no build', () => {
    vi.mocked(shivBuildFromCodes).mockReturnValue(null);
    const code = encodeBinaryCode(SHIV_FORMAT, [perksSection(DEFAULT_NAME_CODES.perks)]) ?? '';

    const result = readShareCode(code);

    expect(result).toEqual(INVALID_RESULT);
  });

  it('rejects a perks section with unread bits', () => {
    vi.mocked(shivBuildFromCodes).mockReturnValue(BUILD_STUB);
    const code = encodeBinaryCode(SHIV_FORMAT, [perksSection([1], 1)]) ?? '';

    const result = readShareCode(code);

    expect(result).toEqual(INVALID_RESULT);
  });

  it('rejects a broken name section', () => {
    vi.mocked(shivBuildFromCodes).mockReturnValue(BUILD_STUB);
    const code = encodeBinaryCode(SHIV_FORMAT, [perksSection([1]), BROKEN_NAME_SECTION]) ?? '';

    const result = readShareCode(code);

    expect(result).toEqual(INVALID_RESULT);
  });

  it('rejects a code without the perks section', () => {
    vi.mocked(shivBuildFromCodes).mockReturnValue(BUILD_STUB);
    const code = encodeBinaryCode(SHIV_FORMAT, [UNKNOWN_SECTION]) ?? '';

    const result = readShareCode(code);

    expect(result).toEqual(INVALID_RESULT);
  });

  it('rejects a string that is not a code', () => {
    const result = readShareCode(GARBAGE_CODE);

    expect(result).toEqual(INVALID_RESULT);
  });
});
