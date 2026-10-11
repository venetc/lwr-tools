import { decodeBiosoldierBuild, encodeBiosoldierBuild } from '@features/share-build';

import { STORED_BUILD_SCHEMA } from '../config/constants';
import type { BiosoldierBuild, BiosoldierBuildId } from './biosoldier-builds';

/**
 * Stored record of the build: its share code and lock; null if the build has no share code.
 *
 * @param build biosoldier build.
 */
export const serializeBuild = (build: Readonly<BiosoldierBuild>) => {
  const code = encodeBiosoldierBuild(build);

  if (code === null) return null;

  return { code, readonly: build.readonly };
};

/**
 * Build of the stored record; null if the record does not match the schema or its code does not decode to a biosoldier build.
 *
 * @param buildId build id.
 * @param record stored record.
 */
export const parseBuild = (buildId: BiosoldierBuildId, record: unknown): BiosoldierBuild | null => {
  const storedBuild = STORED_BUILD_SCHEMA.safeParse(record);

  if (!storedBuild.success) return null;

  const result = decodeBiosoldierBuild(storedBuild.data.code);

  if (result.status !== 'decoded') return null;

  return { ...result.build, id: buildId, readonly: storedBuild.data.readonly };
};
