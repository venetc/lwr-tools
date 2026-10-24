import { describe, expect, it, vi } from 'vitest';

import { shivBuildCodes, shivBuildFromCodes } from '@entities/shiv/model/build-codes';

import {
  BLANK_NAME_BUILD,
  BLANK_NAME_CODES,
  DUPLICATE_PERK_CODES,
  EXTRA_EMPTY_LEVEL_BUILD,
  FULL_BUILD,
  FULL_CODES,
  MISPLACED_PERK_BUILD,
  MIXED_OUTDATED_CODES,
  MIXED_OUTDATED_RESULT,
  PARTLY_FILLED_BUILD,
  PARTLY_FILLED_CODES,
  REVERSED_CODES,
  SAME_LEVEL_CODES,
  SAME_LEVEL_RESULT,
  STRAY_PERK_CODES,
  STRAY_PERK_RESULT,
  UNKNOWN_PERK_BUILD,
  UNKNOWN_PERK_CODES,
} from './build-codes.mock';

vi.mock('@entities/shiv/config/constants/perk-content', async () => ({
  SHIV_PERK_CONTENT: (await import('./build-codes.mock')).SHIV_PERK_CONTENT_MOCK,
}));

vi.mock('@entities/shiv/config/constants/technology-level-content', async () => ({
  TECHNOLOGY_LEVEL_CONTENT: (await import('./build-codes.mock')).TECHNOLOGY_LEVEL_CONTENT_MOCK,
}));

vi.mock('@entities/shiv/config/constants/perk-icons', () => ({ SHIV_PERK_ICON: {} }));

vi.mock('@entities/shiv/config/constants/technology-level-icons', () => ({ TECHNOLOGY_LEVEL_ICON: {} }));

describe('shivBuildCodes', () => {
  it('gives the codes of a build with every level and the default name', () => {
    const codes = shivBuildCodes(FULL_BUILD);

    expect(codes).toEqual(FULL_CODES);
  });

  it('leaves empty levels out and keeps its own name', () => {
    const codes = shivBuildCodes(PARTLY_FILLED_BUILD);

    expect(codes).toEqual(PARTLY_FILLED_CODES);
  });

  it('gives no name for a blank name', () => {
    const codes = shivBuildCodes(BLANK_NAME_BUILD);

    expect(codes?.name).toBeNull();
  });

  it('skips an empty level outside the SHIV tree', () => {
    const codes = shivBuildCodes(EXTRA_EMPTY_LEVEL_BUILD);

    expect(codes).toEqual(FULL_CODES);
  });

  it('gives null for a perk of another level', () => {
    const codes = shivBuildCodes(MISPLACED_PERK_BUILD);

    expect(codes).toBeNull();
  });

  it('gives null for an unknown perk', () => {
    const codes = shivBuildCodes(UNKNOWN_PERK_BUILD);

    expect(codes).toBeNull();
  });
});

describe('shivBuildFromCodes', () => {
  it('restores a build with every level and the default name', () => {
    const result = shivBuildFromCodes(FULL_CODES);

    expect(result).toEqual({ build: FULL_BUILD, outdated: [] });
  });

  it('restores a build with empty levels and its own name', () => {
    const result = shivBuildFromCodes(PARTLY_FILLED_CODES);

    expect(result).toEqual({ build: PARTLY_FILLED_BUILD, outdated: [] });
  });

  it('places each perk on its level whatever the code order', () => {
    const result = shivBuildFromCodes(REVERSED_CODES);

    expect(result).toEqual({ build: FULL_BUILD, outdated: [] });
  });

  it('gives the default name for a blank name', () => {
    const result = shivBuildFromCodes(BLANK_NAME_CODES);

    expect(result?.build.name).toBe('SHIV');
  });

  it('gives null for an unknown perk', () => {
    const result = shivBuildFromCodes(UNKNOWN_PERK_CODES);

    expect(result).toBeNull();
  });

  it('gives null for a perk given twice', () => {
    const result = shivBuildFromCodes(DUPLICATE_PERK_CODES);

    expect(result).toBeNull();
  });

  it('leaves a perk outside the SHIV tree out as removed', () => {
    const result = shivBuildFromCodes(STRAY_PERK_CODES);

    expect(result).toEqual(STRAY_PERK_RESULT);
  });

  it('leaves two perks of one level out as a collision on the level', () => {
    const result = shivBuildFromCodes(SAME_LEVEL_CODES);

    expect(result).toEqual(SAME_LEVEL_RESULT);
  });

  it('gives removed and colliding perks as Outdated selections in code order', () => {
    const result = shivBuildFromCodes(MIXED_OUTDATED_CODES);

    expect(result).toEqual(MIXED_OUTDATED_RESULT);
  });
});
