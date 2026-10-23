import type { DecodedLoadout } from '@entities/loadout';
import { encodeBinaryCode, openBinaryCode } from '@shared/lib/binary-code';

import { INVALID_SHARE_CODE, SHARE_CODE_FORMAT, SQUAD_CODE_SEPARATOR, SQUAD_SECTION } from '../config/constants';
import type { BuildCodeKind, BuildDataByKind } from './build-codecs';
import { BUILD_CODECS } from './build-codecs';
import { nameSection, readNameSection } from './share-code';
import type { DecodedUnit, DecodedUnitOf, UnitCodeData } from './unit-code';
import { decodeUnit, encodeUnit } from './unit-code';

/**
 * Squad to share: its name and its Units in Squad order.
 */
export interface SquadCodeData {
  /** Squad name. */
  name: string
  /** Units in Squad order. */
  units: readonly UnitCodeData<BuildCodeKind>[]
}

/**
 * Build of a Squad code of one kind.
 */
export interface DecodedSquadBuildOf<Kind extends BuildCodeKind> {
  /** Kind of the build: the Build calculator it belongs to. */
  kind: Kind
  /** Build data. */
  build: BuildDataByKind[Kind]
}

/**
 * Build of a Squad code of any kind.
 */
export type DecodedSquadBuild = { [Kind in BuildCodeKind]: DecodedSquadBuildOf<Kind> }[BuildCodeKind];

/**
 * Unit of a Squad code: its build among the builds of the code and its Loadout.
 */
export interface DecodedSquadUnit {
  /** Index of the build of the Unit in the builds of the Squad. */
  buildIndex: number
  /** Loadout of the Unit; null for a part that is a build code, which has none. */
  loadout: DecodedLoadout | null
}

/**
 * Squad of a Squad code.
 */
export interface DecodedSquad {
  /** Squad name. */
  name: string
  /** Builds of the Units, each once: Units whose build sections are the same share one build. */
  builds: DecodedSquadBuild[]
  /** Units in Squad order. */
  units: DecodedSquadUnit[]
}

/**
 * Result of decoding a Squad code: the Squad; `unit-code` for a Unit code or a build code; `invalid` for anything else.
 */
export type SquadCodeDecodeResult = { status: 'decoded', squad: DecodedSquad } | { status: 'unit-code' } | { status: 'invalid' };

/**
 * Key of the build sections of the Unit: Units with equal keys have the same build, name and officer perks included;
 * null for a build without codes, which shares its build with no other Unit.
 *
 * @param unit Unit of a Squad code.
 */
const buildSectionsKey = <Kind extends BuildCodeKind>(unit: DecodedUnitOf<Kind>) => BUILD_CODECS[unit.kind].encode(unit.build);

/**
 * Build of the Unit without its Loadout.
 *
 * @param unit Unit of a Squad code.
 */
const squadBuildOf = (unit: DecodedUnit): DecodedSquadBuild => {
  const { loadout: _loadout, ...squadBuild } = unit;

  return squadBuild;
};

/**
 * Squad of the name and the Units of its code: Units with the same build sections share one build.
 *
 * @param name Squad name.
 * @param units Units of the code in Squad order.
 */
const squadOfUnits = (name: string, units: readonly DecodedUnit[]): DecodedSquad => {
  const buildIndexByKey = new Map<string, number>();

  return units.reduce<DecodedSquad>((squad, unit) => {
    const key = buildSectionsKey(unit);
    const knownIndex = key === null ? null : buildIndexByKey.get(key) ?? null;
    const buildIndex = knownIndex ?? squad.builds.length;

    if (knownIndex === null) {
      squad.builds.push(squadBuildOf(unit));

      if (key !== null) buildIndexByKey.set(key, buildIndex);
    }

    squad.units.push({ buildIndex, loadout: unit.loadout });

    return squad;
  }, { name, builds: [], units: [] });
};

/**
 * Share code of the Squad: the Squad header of format 4 with the `NAME` section, then the Unit code of each Unit,
 * joined with dots.
 *
 * @param squad Squad to share.
 * @returns the code; null if the code of a Unit cannot be written.
 */
export const encodeSquad = (squad: SquadCodeData) => {
  const header = encodeBinaryCode(SHARE_CODE_FORMAT.SQUAD, [nameSection(SQUAD_SECTION.NAME, squad.name)]);
  const parts = [header, ...squad.units.map(unit => encodeUnit(unit))];

  if (!parts.every(part => part !== null)) return null;

  return parts.join(SQUAD_CODE_SEPARATOR);
};

/**
 * Squad of a Squad code. Every part has its own CRC, and any broken part makes the whole code invalid. A Unit code or
 * a build code of any kind is told apart as `unit-code`.
 *
 * @param code share code.
 */
export const decodeSquad = (code: string): SquadCodeDecodeResult => {
  const [header = '', ...unitParts] = code.trim().split(SQUAD_CODE_SEPARATOR);
  const binaryCode = openBinaryCode(header);

  if (binaryCode?.format !== SHARE_CODE_FORMAT.SQUAD) {
    return decodeUnit(code).status === 'decoded' ? { status: 'unit-code' } : INVALID_SHARE_CODE;
  }

  const nameField = readNameSection(binaryCode.sections.get(SQUAD_SECTION.NAME) ?? null);
  const units = unitParts.map(decodeUnit);

  if (typeof nameField?.name !== 'string') return INVALID_SHARE_CODE;

  const decodedUnits = units.flatMap(result => (result.status === 'decoded' ? [result.unit] : []));

  if (decodedUnits.length !== units.length) return INVALID_SHARE_CODE;

  return { status: 'decoded', squad: squadOfUnits(nameField.name, decodedUnits) };
};
