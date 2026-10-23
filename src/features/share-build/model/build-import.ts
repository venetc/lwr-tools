import type { BuildCodeKind, BuildDataByKind } from './build-codecs';
import { BUILD_CODECS } from './build-codecs';
import type { ShareCodeDecodeResult } from './share-code';
import { decodeSquad } from './squad-code';

/**
 * Result of a code imported in a Build calculator: the build, why it failed, or `squad-code` for a whole Squad code.
 */
export type BuildImportResult<Build> = ShareCodeDecodeResult<Build> | { status: 'squad-code' };

/**
 * Build of a code imported in the Build calculator of the kind: a build code or a Unit code of the kind gives its
 * build, one of another unit is reported as `other-unit`, and a valid Squad code is told apart as `squad-code`.
 *
 * @param kind kind of build code the Build calculator accepts.
 * @param code share code.
 */
export const decodeBuildImport = <Kind extends BuildCodeKind>(kind: Kind, code: string): BuildImportResult<BuildDataByKind[Kind]> => {
  const result = BUILD_CODECS[kind].decode(code);

  if (result.status !== 'invalid') return result;

  if (decodeSquad(code).status === 'decoded') return { status: 'squad-code' };

  return result;
};
