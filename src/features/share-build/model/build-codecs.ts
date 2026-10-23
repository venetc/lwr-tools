import type { ShivBuildData } from '@entities/shiv';
import type { BiosoldierBuildData, SoldierBuildData } from '@entities/soldier';

import type { BuildCodeLayout, ShareCodeDecodeResult } from './share-code';
import { decodeShivBuild, encodeShivBuild, SHIV_BUILD_LAYOUT } from './shiv-build-code';
import { BIOSOLDIER_BUILD_LAYOUT, decodeBiosoldierBuild, decodeMecBuild, encodeBiosoldierBuild, encodeMecBuild, MEC_BUILD_LAYOUT } from './soldier-build-code';

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

/** Code layout of each kind of build: its format, sections and the `LOADOUT` section of its Unit codes. */
export const BUILD_CODE_LAYOUTS: { readonly [Kind in BuildCodeKind]: BuildCodeLayout<BuildDataByKind[Kind]> } = {
  biosoldier: BIOSOLDIER_BUILD_LAYOUT,
  mec: MEC_BUILD_LAYOUT,
  shiv: SHIV_BUILD_LAYOUT,
};
