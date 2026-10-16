export interface BuildDataMock {
  /** Build name. */
  name: string
}

export const BUILD_ID = 'build-1';

export const VALID_CODE = 'valid-code';

export const INVALID_CODE = 'invalid-code';

export const UNENCODABLE_NAME = 'Unencodable';

export const BUILD_DATA_MOCK: BuildDataMock = { name: 'Overwatch' };

export const BUILD_MOCK = { ...BUILD_DATA_MOCK, id: BUILD_ID, readonly: false };

export const UNENCODABLE_BUILD_MOCK = { ...BUILD_MOCK, name: UNENCODABLE_NAME };

/**
 * Fake share code encoder: the code of the build name, or null for the unencodable name.
 *
 * @param data build data.
 */
export const encodeMock = (data: BuildDataMock) => {
  if (data.name === UNENCODABLE_NAME) return null;

  return `code-${data.name}`;
};

/**
 * Fake share code decoder: the mock build for the valid code, an invalid result for any other.
 *
 * @param code share code.
 */
export const decodeMock = (code: string) => {
  if (code !== VALID_CODE) return { status: 'invalid' } as const;

  return { status: 'decoded', build: BUILD_DATA_MOCK } as const;
};
