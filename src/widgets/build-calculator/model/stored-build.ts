import type { LoadoutUnitId } from '@entities/loadout';
import type { DecodedUnitOf } from '@features/share-build';
import { encodeBuild, isUnitOf, readShareCode } from '@features/share-build';

import { STORED_BUILD_SCHEMA } from '../config/constants';
import type { SavedBuild } from './build-list';

/**
 * Stored records of builds of the kind through their share codes: `{ code, readonly }`. The record of an Outdated
 * build stays as it was stored until the build is updated.
 *
 * @param kind unit type of the builds.
 */
export const storedBuildCodec = <Kind extends LoadoutUnitId>(kind: Kind) => {
  /**
   * Stored record of the build: the stored record of an Outdated build as it is, otherwise the share code of the build;
   * null if the build has no share code.
   *
   * @param build saved build.
   */
  const serialize = (build: Readonly<SavedBuild<Kind>>) => {
    if (build.outdated) return { code: build.outdated.code, readonly: build.readonly };

    const code = encodeBuild(kind, build);

    if (code === null) return null;

    return { code, readonly: build.readonly };
  };

  /**
   * Build of the stored record: an Outdated build, without its Outdated selections and with the record kept, if the
   * code has them; null if the record does not match the schema or its code is no Build of the kind.
   *
   * @param id build id.
   * @param record stored record.
   */
  const parse = (id: string, record: unknown) => {
    const storedBuild = STORED_BUILD_SCHEMA.safeParse(record);

    if (!storedBuild.success) return null;

    const { code, readonly } = storedBuild.data;
    const result = readShareCode(code);

    if (result.status !== 'unit' || !isUnitOf(result.unit, kind)) return null;

    const unit: DecodedUnitOf<Kind> = result.unit;

    return { ...unit.build, id, readonly, outdated: unit.outdated.length ? { code, selections: unit.outdated } : null };
  };

  return { serialize, parse };
};
