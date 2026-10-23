import type { LoadoutUnitId } from '@entities/loadout';
import type { LockableItem } from '@shared/lib/stored-list';

import { STORED_BUILD_SCHEMA } from '../config/constants';
import type { BuildDataByKind } from './build-code';
import { encodeBuild } from './build-code';
import { readShareCode } from './share-code';
import { isUnitOf } from './unit-code';

/**
 * Stored records of builds of the kind through their share codes: `{ code, readonly }`. The code format already keeps
 * old codes readable, so the record only adds the lock.
 *
 * @param kind unit type of the builds.
 */
export const storedBuildCodec = <Kind extends LoadoutUnitId>(kind: Kind) => {
  /**
   * Stored record of the build; null if the build has no share code.
   *
   * @param build stored build.
   */
  const serialize = (build: Readonly<LockableItem<BuildDataByKind[Kind]>>) => {
    const code = encodeBuild(kind, build);

    if (code === null) return null;

    return { code, readonly: build.readonly };
  };

  /**
   * Build of the stored record; null if the record does not match the schema, its code is no Build of the kind, or the
   * code has Outdated selections.
   *
   * @param id build id.
   * @param record stored record.
   */
  const parse = (id: string, record: unknown) => {
    const storedBuild = STORED_BUILD_SCHEMA.safeParse(record);

    if (!storedBuild.success) return null;

    const result = readShareCode(storedBuild.data.code);

    if (result.status !== 'unit' || !isUnitOf(result.unit, kind) || result.unit.outdated.length) return null;

    return { ...result.unit.build, id, readonly: storedBuild.data.readonly };
  };

  return { serialize, parse };
};
