import type { DecodedLoadout, LoadoutCodes } from '@entities/loadout';
import { loadoutCodes, loadoutFromCodes } from '@entities/loadout';
import type { BinaryCodeSection, BitReader, BitWriter } from '@shared/lib/binary-code';
import { encodeBinaryCode, openBinaryCode } from '@shared/lib/binary-code';

import {
  BUILD_CODE_KIND_BY_FORMAT,
  EMPTY_ITEM_CODE,
  INVALID_SHARE_CODE,
  LOADOUT_ITEM_CODE_BITS,
  MODULE_COUNT_BITS,
  UTILITY_COUNT_BITS,
} from '../config/constants';
import type { BuildCodeKind, BuildDataByKind } from './build-codecs';
import { BUILD_CODE_LAYOUTS } from './build-codecs';
import { readCodeList, readWholeSection, writeCodeList } from './section-fields';

/**
 * Unit to share: its build of the kind and its Loadout.
 */
export interface UnitCodeData<Kind extends BuildCodeKind> {
  /** Kind of the build: the Build calculator it belongs to. */
  kind: Kind
  /** Build of the Unit. */
  build: BuildDataByKind[Kind]
  /** Loadout of the Unit. */
  loadout: Readonly<DecodedLoadout>
}

/**
 * Unit of a share code of one kind.
 */
export interface DecodedUnitOf<Kind extends BuildCodeKind> {
  /** Kind of the build: the Build calculator it belongs to. */
  kind: Kind
  /** Build of the Unit. */
  build: BuildDataByKind[Kind]
  /** Loadout of the Unit; null for a build code, which has none. */
  loadout: DecodedLoadout | null
}

/**
 * Unit of a share code of any of the kinds, all of them by default.
 */
export type DecodedUnit<Kinds extends BuildCodeKind = BuildCodeKind> = { [Kind in Kinds]: DecodedUnitOf<Kind> }[Kinds];

/**
 * Result of decoding a Unit code: the Unit, or `invalid` for a broken code.
 */
export type UnitCodeDecodeResult = { status: 'decoded', unit: DecodedUnit } | { status: 'invalid' };

/**
 * Code of an item in the `LOADOUT` section: the catalog code, `0` for an empty slot.
 *
 * @param code catalog code; null for an empty slot.
 */
const sectionItemCode = (code: number | null) => code ?? EMPTY_ITEM_CODE;

/**
 * Catalog code of an item of the `LOADOUT` section: null for an empty slot.
 *
 * @param code item code of the section.
 */
const catalogItemCode = (code: number) => (code === EMPTY_ITEM_CODE ? null : code);

/**
 * Writes the fields of the `LOADOUT` section: armor or SHIV type, primary and secondary weapon, then the counted
 * utility slots and Module slots, each item as its catalog code or `0` for an empty slot.
 *
 * @param writer section writer.
 * @param codes Loadout as catalog codes.
 */
const writeLoadoutFields = (writer: BitWriter, codes: LoadoutCodes) => {
  writer.writeUint(sectionItemCode(codes.armor), LOADOUT_ITEM_CODE_BITS);
  writer.writeUint(sectionItemCode(codes.primary), LOADOUT_ITEM_CODE_BITS);
  writer.writeUint(sectionItemCode(codes.secondary), LOADOUT_ITEM_CODE_BITS);
  writeCodeList(writer, codes.utility.map(sectionItemCode), UTILITY_COUNT_BITS, LOADOUT_ITEM_CODE_BITS);
  writeCodeList(writer, codes.modules.map(sectionItemCode), MODULE_COUNT_BITS, LOADOUT_ITEM_CODE_BITS);
};

/**
 * Reads the fields written by `writeLoadoutFields`.
 *
 * @param reader section reader.
 */
const readLoadoutFields = (reader: BitReader): LoadoutCodes => ({
  armor: catalogItemCode(reader.readUint(LOADOUT_ITEM_CODE_BITS)),
  primary: catalogItemCode(reader.readUint(LOADOUT_ITEM_CODE_BITS)),
  secondary: catalogItemCode(reader.readUint(LOADOUT_ITEM_CODE_BITS)),
  utility: readCodeList(reader, UTILITY_COUNT_BITS, LOADOUT_ITEM_CODE_BITS).map(catalogItemCode),
  modules: readCodeList(reader, MODULE_COUNT_BITS, LOADOUT_ITEM_CODE_BITS).map(catalogItemCode),
});

/**
 * Share code of the Unit: the build code of its kind with the `LOADOUT` section added.
 *
 * @param unit Unit to share.
 * @returns the code; null if the build has no codes, or the Loadout has more utility or Module slots than the section
 * counts.
 */
export const encodeUnit = <Kind extends BuildCodeKind>(unit: UnitCodeData<Kind>) => {
  const layout = BUILD_CODE_LAYOUTS[unit.kind];
  const buildSections = layout.writeBuild(unit.build);
  const codes = loadoutCodes(unit.loadout, unit.kind);
  const isCountable = codes.utility.length < 2 ** UTILITY_COUNT_BITS && codes.modules.length < 2 ** MODULE_COUNT_BITS;

  if (!buildSections || !isCountable) return null;

  const loadoutSection: BinaryCodeSection = { id: layout.loadoutSection, write: writer => writeLoadoutFields(writer, codes) };

  return encodeBinaryCode(layout.format, [...buildSections, loadoutSection]);
};

/**
 * Unit of the code sections of the kind: the build, and the Loadout of the `LOADOUT` section.
 *
 * @param kind kind of the build.
 * @param sections code sections by id.
 * @returns the Unit, with a null Loadout without the `LOADOUT` section; null if the build cannot be read or the
 * `LOADOUT` section is broken.
 */
const readUnit = <Kind extends BuildCodeKind>(kind: Kind, sections: ReadonlyMap<number, BitReader>): DecodedUnit<Kind> | null => {
  const layout = BUILD_CODE_LAYOUTS[kind];
  const build = layout.readBuild(sections);
  const loadoutReader = sections.get(layout.loadoutSection) ?? null;
  const codes = loadoutReader && readWholeSection(loadoutReader, readLoadoutFields);

  if (!build || (loadoutReader && !codes)) return null;

  return { kind, build, loadout: codes && loadoutFromCodes(codes, kind) };
};

/**
 * Unit of a share code of any kind: a Unit code brings its Loadout, a build code none. Items of unknown codes leave
 * their slots empty, and the Loadout is not checked against the build: the Unit check brings it to the rules.
 *
 * @param code share code.
 * @returns the Unit; `invalid` if the code is broken, of no build format, or its build or `LOADOUT` section is broken.
 */
export const decodeUnit = (code: string): UnitCodeDecodeResult => {
  const binaryCode = openBinaryCode(code);

  if (!binaryCode) return INVALID_SHARE_CODE;

  const kind = BUILD_CODE_KIND_BY_FORMAT.get(binaryCode.format) ?? null;
  const unit = kind && readUnit(kind, binaryCode.sections);

  if (!unit) return INVALID_SHARE_CODE;

  return { status: 'decoded', unit };
};
