import { STORED_BUILD_SCHEMA } from '../config/constants';
import type { ShareCodeDecodeResult } from './share-code';

/**
 * Build with its list identity and lock, as kept in a stored list.
 */
export type StoredBuild<Data> = Data & {
  /** Stable build id. */
  id: string
  /** Whether the build is locked against editing. */
  readonly: boolean
};

/**
 * Stored records of builds through their share codes: `{ code, readonly }`. The code format already keeps old codes
 * readable, so the record only adds the lock.
 *
 * @param encode share code of the build data; null if it cannot be encoded.
 * @param decode build data of a share code.
 */
export const storedBuildCodec = <Data>(
  encode: (data: Data) => string | null,
  decode: (code: string) => ShareCodeDecodeResult<Data>,
) => {
  /**
   * Stored record of the build; null if the build has no share code.
   *
   * @param build stored build.
   */
  const serialize = (build: Readonly<StoredBuild<Data>>) => {
    const code = encode(build);

    if (code === null) return null;

    return { code, readonly: build.readonly };
  };

  /**
   * Build of the stored record; null if the record does not match the schema or its code does not decode to a build.
   *
   * @param id build id.
   * @param record stored record.
   */
  const parse = (id: string, record: unknown): StoredBuild<Data> | null => {
    const storedBuild = STORED_BUILD_SCHEMA.safeParse(record);

    if (!storedBuild.success) return null;

    const result = decode(storedBuild.data.code);

    if (result.status !== 'decoded') return null;

    return { ...result.build, id, readonly: storedBuild.data.readonly };
  };

  return { serialize, parse };
};
