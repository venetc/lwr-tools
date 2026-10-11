import type { BiosoldierBuildData } from '@entities/biosoldier/model/build';
import type { BiosoldierClass } from '@entities/biosoldier/model/classes';
import type { BiosoldierBuild } from '@pages/biosoldier-builds/model/biosoldier-builds';

export const BUILD_ID = 'build-1';

export const VALID_CODE = 'valid-code';

export const INVALID_CODE = 'invalid-code';

export const UNENCODABLE_NAME = 'Unencodable';

export const BUILD_DATA_MOCK = {
  biosoldierClass: { id: 'tester', name: 'Tester', basePerk: 'granted' } as unknown as BiosoldierClass,
  perks: ['granted', 'left'],
  name: 'Overwatch',
} as BiosoldierBuildData;

export const BUILD_MOCK: BiosoldierBuild = { ...BUILD_DATA_MOCK, id: BUILD_ID, readonly: false };

export const UNENCODABLE_BUILD_MOCK: BiosoldierBuild = { ...BUILD_MOCK, name: UNENCODABLE_NAME };

/**
 * Fake share code encoder: the code of the build name, or null for the unencodable name.
 *
 * @param build biosoldier build.
 */
export const encodeBiosoldierBuildMock = (build: BiosoldierBuildData) => {
  if (build.name === UNENCODABLE_NAME) return null;

  return `code-${build.name}`;
};

/**
 * Fake share code decoder: the mock build for the valid code, an invalid result for any other.
 *
 * @param code share code.
 */
export const decodeBiosoldierBuildMock = (code: string) => {
  if (code !== VALID_CODE) return { status: 'invalid' };

  return { status: 'decoded', build: BUILD_DATA_MOCK };
};
