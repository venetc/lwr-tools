import { describe, expect, it, vi } from 'vitest';

import { decodeBiosoldierBuild, encodeBiosoldierBuild } from '@features/share-build/model/biosoldier-build-code';
import { encodeBinaryCode, openBinaryCode } from '@shared/lib/binary-code';

import {
  BROKEN_NAME_SECTION,
  DEFAULT_NAME_BUILD,
  FORMAT,
  NAME_SECTION_ID,
  NAMED_BUILD,
  OTHER_FORMAT,
  perksSection,
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

    const build = decodeBiosoldierBuild(code);

    expect(build).toEqual(DEFAULT_NAME_BUILD);
  });

  it('restores a build with its own name', () => {
    const code = encodeBiosoldierBuild(NAMED_BUILD) ?? '';

    const build = decodeBiosoldierBuild(code);

    expect(build).toEqual(NAMED_BUILD);
  });

  it('gives the default name when the name part is not requested', () => {
    const code = encodeBiosoldierBuild(NAMED_BUILD) ?? '';

    const build = decodeBiosoldierBuild(code, []);

    expect(build?.name).toBe(DEFAULT_NAME_BUILD.name);
  });

  it('skips unknown sections', () => {
    const code = encodeBinaryCode(FORMAT, [VALID_PERKS_SECTION, UNKNOWN_SECTION]) ?? '';

    const build = decodeBiosoldierBuild(code);

    expect(build).toEqual(DEFAULT_NAME_BUILD);
  });

  it('rejects a code of another format', () => {
    const code = encodeBinaryCode(OTHER_FORMAT, [VALID_PERKS_SECTION]) ?? '';

    const build = decodeBiosoldierBuild(code);

    expect(build).toBeNull();
  });

  it('rejects a code without the perks section', () => {
    const code = encodeBinaryCode(FORMAT, [UNKNOWN_SECTION]) ?? '';

    const build = decodeBiosoldierBuild(code);

    expect(build).toBeNull();
  });

  it('rejects an unknown class', () => {
    const code = encodeBinaryCode(FORMAT, [perksSection(30, [12])]) ?? '';

    const build = decodeBiosoldierBuild(code);

    expect(build).toBeNull();
  });

  it('rejects an unknown ability', () => {
    const code = encodeBinaryCode(FORMAT, [perksSection(3, [99])]) ?? '';

    const build = decodeBiosoldierBuild(code);

    expect(build).toBeNull();
  });

  it('rejects more perks than ranks', () => {
    const code = encodeBinaryCode(FORMAT, [perksSection(3, [11, 12, 13])]) ?? '';

    const build = decodeBiosoldierBuild(code);

    expect(build).toBeNull();
  });

  it('rejects a perks section with unread bits', () => {
    const code = encodeBinaryCode(FORMAT, [perksSection(3, [12], 1)]) ?? '';

    const build = decodeBiosoldierBuild(code);

    expect(build).toBeNull();
  });

  it('rejects a broken name section when the name is requested', () => {
    const code = encodeBinaryCode(FORMAT, [VALID_PERKS_SECTION, BROKEN_NAME_SECTION]) ?? '';

    const build = decodeBiosoldierBuild(code);

    expect(build).toBeNull();
  });
});
