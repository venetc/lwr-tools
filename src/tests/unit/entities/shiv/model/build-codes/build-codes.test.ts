import { describe, expect, it, vi } from 'vitest';

import { shivBuildCodes, shivBuildFromCodes } from '@entities/shiv/model/build-codes';

import {
  BLANK_NAME_BUILD,
  BLANK_NAME_CODES,
  EXTRA_EMPTY_LEVEL_BUILD,
  FULL_BUILD,
  FULL_CODES,
  MISPLACED_PERK_BUILD,
  PARTLY_FILLED_BUILD,
  PARTLY_FILLED_CODES,
  REVERSED_CODES,
  SAME_LEVEL_CODES,
  STRAY_PERK_CODES,
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
    const build = shivBuildFromCodes(FULL_CODES);

    expect(build).toEqual(FULL_BUILD);
  });

  it('restores a build with empty levels and its own name', () => {
    const build = shivBuildFromCodes(PARTLY_FILLED_CODES);

    expect(build).toEqual(PARTLY_FILLED_BUILD);
  });

  it('places each perk on its level whatever the code order', () => {
    const build = shivBuildFromCodes(REVERSED_CODES);

    expect(build).toEqual(FULL_BUILD);
  });

  it('gives the default name for a blank name', () => {
    const build = shivBuildFromCodes(BLANK_NAME_CODES);

    expect(build?.name).toBe('SHIV');
  });

  it('gives null for an unknown perk', () => {
    const build = shivBuildFromCodes(UNKNOWN_PERK_CODES);

    expect(build).toBeNull();
  });

  it('gives null for a perk outside the SHIV tree', () => {
    const build = shivBuildFromCodes(STRAY_PERK_CODES);

    expect(build).toBeNull();
  });

  it('gives null for two perks of one level', () => {
    const build = shivBuildFromCodes(SAME_LEVEL_CODES);

    expect(build).toBeNull();
  });
});
