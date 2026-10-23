import type { LockableItem } from '@shared/lib/stored-list';

import { STORED_BUILD_SCHEMA } from '../config/constants';
import type { ShareCodeDecodeResult } from './share-code';

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
  const serialize = (build: Readonly<LockableItem<Data>>) => {
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
  const parse = (id: string, record: unknown): LockableItem<Data> | null => {
    const storedBuild = STORED_BUILD_SCHEMA.safeParse(record);

    if (!storedBuild.success) return null;

    const result = decode(storedBuild.data.code);

    if (result.status !== 'decoded') return null;

    return { ...result.build, id, readonly: storedBuild.data.readonly };
  };

  return { serialize, parse };
};
