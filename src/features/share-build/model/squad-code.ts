import type { DecodedLoadout, LoadoutUnitId } from '@entities/loadout';
import type { BitReader, OpenedBinaryCode } from '@shared/lib/binary-code';
import { encodeBinaryCode } from '@shared/lib/binary-code';

import { SHARE_CODE_FORMAT, SQUAD_CODE_SEPARATOR, SQUAD_SECTION } from '../config/constants';
import type { BuildDataByKind, OutdatedSelectionByKind } from './build-code';
import { encodeBuild } from './build-code';
import { nameSection, readNameSection } from './section-fields';
import type { DecodedUnit, DecodedUnitOf, UnitCodeData } from './unit-code';
import { encodeUnit, readUnit } from './unit-code';

/**
 * Squad to share: its name and its Units in Squad order.
 */
export interface SquadCodeData {
  /** Squad name. */
  name: string
  /** Units in Squad order. */
  units: readonly UnitCodeData<LoadoutUnitId>[]
}

/**
 * Build of a Squad code of one kind.
 */
export interface DecodedSquadBuildOf<Kind extends LoadoutUnitId> {
  /** Kind of the build: the Build calculator it belongs to. */
  kind: Kind
  /** Build data, without the Outdated selections. */
  build: BuildDataByKind[Kind]
  /** Selections of the code left out of the build; empty if the code fits the current trees. */
  outdated: OutdatedSelectionByKind[Kind][]
}

/**
 * Build of a Squad code of any kind.
 */
export type DecodedSquadBuild = { [Kind in LoadoutUnitId]: DecodedSquadBuildOf<Kind> }[LoadoutUnitId];

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
 * Key of the build sections of the Unit: Units with equal keys have the same build, name, officer perks and Signature
 * skill included, and the same Outdated selections, which the build no longer shows; null for a build without codes, which shares its
 * build with no other Unit.
 *
 * @param unit Unit of a Squad code.
 */
const buildSectionsKey = <Kind extends LoadoutUnitId>(unit: DecodedUnitOf<Kind>) => {
  const code = encodeBuild(unit.kind, unit.build);

  return code && [code, ...unit.outdated.map(selection => JSON.stringify(selection))].join(' ');
};

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
 * Squad of an opened Squad code: the Squad header and the Unit parts after it. Every part has its own CRC, and any
 * broken part makes the whole code invalid.
 *
 * @param headerSections sections of the Squad header by id.
 * @param unitParts opened Unit parts in Squad order; null for a part that does not open.
 * @returns the Squad; null if the `NAME` section is absent or broken, or a part is no Unit.
 */
export const readSquad = (headerSections: ReadonlyMap<number, BitReader>, unitParts: readonly (OpenedBinaryCode | null)[]) => {
  const nameField = readNameSection(headerSections.get(SQUAD_SECTION.NAME) ?? null);
  const units = unitParts.flatMap((part) => {
    const unit = part && readUnit(part);

    return unit ? [unit] : [];
  });

  if (typeof nameField?.name !== 'string' || units.length !== unitParts.length) return null;

  return squadOfUnits(nameField.name, units);
};
