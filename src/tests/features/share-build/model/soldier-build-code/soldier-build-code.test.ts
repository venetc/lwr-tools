import { describe, expect, it, vi } from 'vitest';

import { decodeSoldierBuild, encodeSoldierBuild } from '@features/share-build/model/soldier-build-code';
import { encodeBinaryCode, openBinaryCode } from '@shared/lib/binary-code';

import {
  BROKEN_NAME_SECTION,
  DEFAULT_NAME_BUILD,
  FORMAT,
  NAME_SECTION_ID,
  NAMED_BUILD,
  OTHER_FORMAT,
  talentsSection,
  UNKNOWN_SECTION,
  UNKNOWN_TALENT_BUILD,
  VALID_TALENTS_SECTION,
} from './soldier-build-code.mock';

vi.mock('@entities/soldier/config/constants/ability-content', async () => ({
  ABILITY_CONTENT: (await import('./soldier-build-code.mock')).ABILITY_CONTENT_MOCK,
}));

vi.mock('@entities/soldier/config/constants/soldier-class-content', async () => ({
  SOLDIER_CLASS_CONTENT: (await import('./soldier-build-code.mock')).SOLDIER_CLASS_CONTENT_MOCK,
}));

vi.mock('@entities/soldier/config/constants/soldier-rank-content', async () => ({
  SOLDIER_RANK_CONTENT: (await import('./soldier-build-code.mock')).SOLDIER_RANK_CONTENT_MOCK,
}));

vi.mock('@entities/soldier/config/constants/ability-icons', () => ({ ABILITY_ICON: {} }));

vi.mock('@entities/soldier/config/constants/soldier-class-icons', () => ({ SOLDIER_CLASS_ICON: {} }));

vi.mock('@entities/soldier/config/constants/soldier-rank-icons', () => ({ SOLDIER_RANK_ICON: {} }));

describe('encodeSoldierBuild', () => {
  it('leaves out the name section for the default name', () => {
    const code = encodeSoldierBuild(DEFAULT_NAME_BUILD) ?? '';

    const binaryCode = openBinaryCode(code);

    expect(binaryCode?.sections.has(NAME_SECTION_ID)).toBe(false);
  });

  it('gives null for a build with an unknown talent', () => {
    const code = encodeSoldierBuild(UNKNOWN_TALENT_BUILD);

    expect(code).toBeNull();
  });
});

describe('decodeSoldierBuild', () => {
  it('restores a build with the default name', () => {
    const code = encodeSoldierBuild(DEFAULT_NAME_BUILD) ?? '';

    const build = decodeSoldierBuild(code);

    expect(build).toEqual(DEFAULT_NAME_BUILD);
  });

  it('restores a build with its own name', () => {
    const code = encodeSoldierBuild(NAMED_BUILD) ?? '';

    const build = decodeSoldierBuild(code);

    expect(build).toEqual(NAMED_BUILD);
  });

  it('gives the default name when the name part is not requested', () => {
    const code = encodeSoldierBuild(NAMED_BUILD) ?? '';

    const build = decodeSoldierBuild(code, []);

    expect(build?.name).toBe(DEFAULT_NAME_BUILD.name);
  });

  it('skips unknown sections', () => {
    const code = encodeBinaryCode(FORMAT, [VALID_TALENTS_SECTION, UNKNOWN_SECTION]) ?? '';

    const build = decodeSoldierBuild(code);

    expect(build).toEqual(DEFAULT_NAME_BUILD);
  });

  it('rejects a code of another format', () => {
    const code = encodeBinaryCode(OTHER_FORMAT, [VALID_TALENTS_SECTION]) ?? '';

    const build = decodeSoldierBuild(code);

    expect(build).toBeNull();
  });

  it('rejects a code without the talents section', () => {
    const code = encodeBinaryCode(FORMAT, [UNKNOWN_SECTION]) ?? '';

    const build = decodeSoldierBuild(code);

    expect(build).toBeNull();
  });

  it('rejects an unknown class', () => {
    const code = encodeBinaryCode(FORMAT, [talentsSection(30, [12])]) ?? '';

    const build = decodeSoldierBuild(code);

    expect(build).toBeNull();
  });

  it('rejects an unknown ability', () => {
    const code = encodeBinaryCode(FORMAT, [talentsSection(3, [99])]) ?? '';

    const build = decodeSoldierBuild(code);

    expect(build).toBeNull();
  });

  it('rejects more talents than ranks', () => {
    const code = encodeBinaryCode(FORMAT, [talentsSection(3, [11, 12, 13])]) ?? '';

    const build = decodeSoldierBuild(code);

    expect(build).toBeNull();
  });

  it('rejects a talents section with unread bits', () => {
    const code = encodeBinaryCode(FORMAT, [talentsSection(3, [12], 1)]) ?? '';

    const build = decodeSoldierBuild(code);

    expect(build).toBeNull();
  });

  it('rejects a broken name section when the name is requested', () => {
    const code = encodeBinaryCode(FORMAT, [VALID_TALENTS_SECTION, BROKEN_NAME_SECTION]) ?? '';

    const build = decodeSoldierBuild(code);

    expect(build).toBeNull();
  });
});
