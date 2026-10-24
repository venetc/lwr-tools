import type { LoadoutUnitId } from '@entities/loadout';
import type { ShivBuildData, ShivOutdatedSelection } from '@entities/shiv';
import type { BiosoldierBuildData, SoldierBuildData, SoldierOutdatedSelection } from '@entities/soldier';
import type { BinaryCodeSection, BitReader } from '@shared/lib/binary-code';
import { encodeBinaryCode } from '@shared/lib/binary-code';

import { SHIV_BUILD_LAYOUT } from './shiv-build-code';
import { BIOSOLDIER_BUILD_LAYOUT, MEC_BUILD_LAYOUT } from './soldier-build-code';

/**
 * Build data the build code of each unit type carries; every unit type of `units.json` has one.
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
 * Outdated selection of the build code of each unit type: a selection of the code that the current tree has no place
 * for, left out of the build.
 */
export interface OutdatedSelectionByKind {
  /** Biosoldier: an ability its rank, body part, psi level or officer rank no longer offers. */
  biosoldier: SoldierOutdatedSelection
  /** MEC: a perk its rank no longer offers. */
  mec: SoldierOutdatedSelection
  /** SHIV: a perk gone from the SHIV tree or sharing a technology level now. */
  shiv: ShivOutdatedSelection
}

/**
 * Stored record of an Outdated build of the kind: its share code, kept until the update, and its Outdated selections.
 */
export interface StoredOutdatedBuild<Kind extends LoadoutUnitId> {
  /** Share code of the stored record. */
  code: string
  /** Outdated selections of the code. */
  selections: readonly OutdatedSelectionByKind[Kind][]
}

/**
 * Build of a build code and the selections of the code left out of it.
 */
export interface DecodedBuild<Build, Outdated> {
  /** Build without the Outdated selections. */
  build: Build
  /** Outdated selections; empty if the code fits the current trees. */
  outdated: Outdated[]
}

/**
 * Build code format: its number, the sections a build is written to and how the build is read back. Unit codes add
 * their own sections to the same format.
 */
export interface BuildCodeLayout<Build, Outdated = never> {
  /** Share code format number. */
  format: number
  /** Id of the `LOADOUT` section a Unit code of the format adds to the build sections. */
  loadoutSection: number
  /** Sections of the build, by ascending id; null if the build has no codes. */
  writeBuild: (build: Readonly<Build>) => BinaryCodeSection[] | null
  /**
   * Build of the code sections and its Outdated selections; unknown sections are skipped; null if a section is broken
   * or the codes make no build.
   */
  readBuild: (sections: ReadonlyMap<number, BitReader>) => DecodedBuild<Build, Outdated> | null
}

/** Code layout of each unit type: its format, sections and the `LOADOUT` section of its Unit codes. */
export const BUILD_CODE_LAYOUTS: { readonly [Kind in LoadoutUnitId]: BuildCodeLayout<BuildDataByKind[Kind], OutdatedSelectionByKind[Kind]> } = {
  biosoldier: BIOSOLDIER_BUILD_LAYOUT,
  mec: MEC_BUILD_LAYOUT,
  shiv: SHIV_BUILD_LAYOUT,
};

/**
 * Build code of the build: the sections of the layout of its kind in the frame of its format.
 *
 * @param kind unit type of the build.
 * @param build build of the kind.
 * @returns the code; null if the build has no codes or a section outgrows its length limit.
 */
export const encodeBuild = <Kind extends LoadoutUnitId>(kind: Kind, build: Readonly<BuildDataByKind[Kind]>) => {
  const layout = BUILD_CODE_LAYOUTS[kind];
  const sections = layout.writeBuild(build);

  if (!sections) return null;

  return encodeBinaryCode(layout.format, sections);
};
