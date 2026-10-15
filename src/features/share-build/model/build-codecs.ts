import type { ShivBuildData } from '@entities/shiv';
import type { BiosoldierBuildData, SoldierBuildData } from '@entities/soldier';

import type { ShareCodeDecodeResult } from './share-code';
import { decodeShivBuild, encodeShivBuild } from './shiv-build-code';
import { decodeBiosoldierBuild, decodeMecBuild, encodeBiosoldierBuild, encodeMecBuild } from './soldier-build-code';

/**
 * Build data each kind of build code carries.
 */
export interface BuildDataByKind {
  /** Biosoldier build. */
  biosoldier: BiosoldierBuildData
  /** MEC build. */
  mec: SoldierBuildData
  /** SHIV build. */
  shiv: ShivBuildData
}

/**
 * Kind of build code: which Build calculator the code belongs to.
 */
export type BuildCodeKind = keyof BuildDataByKind;

/**
 * Share code encoder and decoder of one kind of build.
 */
export interface BuildCodec<Data> {
  /** Share code of the build; null if it cannot be shared. */
  encode: (data: Data) => string | null
  /** Build of the share code. */
  decode: (code: string) => ShareCodeDecodeResult<Data>
}

/** Share code encoder and decoder of each kind of build. */
export const BUILD_CODECS: { readonly [Kind in BuildCodeKind]: BuildCodec<BuildDataByKind[Kind]> } = {
  biosoldier: { encode: encodeBiosoldierBuild, decode: decodeBiosoldierBuild },
  mec: { encode: encodeMecBuild, decode: decodeMecBuild },
  shiv: { encode: encodeShivBuild, decode: decodeShivBuild },
};
