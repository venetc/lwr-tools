import type { SoldierBuildData } from '@entities/soldier/model/build';
import type { SoldierClass } from '@entities/soldier/model/classes';
import type { SoldierBuild } from '@pages/talents/model/talents';

export const BUILD_KEY_PREFIX = 'lwr-tools.talents.v1.build.';

export const ORDER_KEY = 'lwr-tools.talents.v1.order';

export const BUILD_ID = 'build-1';

export const VALID_CODE = 'valid-code';

export const INVALID_CODE = 'invalid-code';

export const UNENCODABLE_NAME = 'Unencodable';

export const BUILD_DATA_MOCK = {
  soldierClass: { id: 'tester', name: 'Tester', baseBuild: ['granted'] } as unknown as SoldierClass,
  talents: ['granted', 'left'],
  name: 'Overwatch',
} as SoldierBuildData;

export const BUILD_MOCK: SoldierBuild = { ...BUILD_DATA_MOCK, id: BUILD_ID, readonly: false };

export const UNENCODABLE_BUILD_MOCK: SoldierBuild = { ...BUILD_MOCK, name: UNENCODABLE_NAME };

/**
 * Fake share code encoder: the code of the build name, or null for the unencodable name.
 *
 * @param build soldier build.
 */
export const encodeSoldierBuildMock = (build: SoldierBuildData) => {
  if (build.name === UNENCODABLE_NAME) return null;

  return `code-${build.name}`;
};

/**
 * Fake share code decoder: the mock build for the valid code, null for any other.
 *
 * @param code share code.
 */
export const decodeSoldierBuildMock = (code: string) => {
  if (code !== VALID_CODE) return null;

  return BUILD_DATA_MOCK;
};
