import type { LoadoutUnitId } from '@entities/loadout';
import { LOADOUT_UNITS } from '@entities/loadout';
import type { SquadUnit } from '@features/manage-squads';

import { ALL_BUILDS_FILTER_NAME } from '../config/constants';
import type { SquadBuild } from './squad-build';
import { buildListName, squadBuildClassName, squadBuildKey } from './squad-build';

/** Unit type the saved builds are filtered by, or all of them. */
export type SavedBuildKind = LoadoutUnitId | 'all';

/**
 * Filter of saved builds by unit type.
 */
export interface SavedBuildFilter {
  /** Unit type the filter keeps, or all of them. */
  id: SavedBuildKind
  /** Filter name. */
  name: string
  /** Number of builds the filter keeps. */
  count: number
}

/**
 * Saved build in the list of the Add Unit dialog.
 */
export interface SavedBuildRow {
  /** Row id: the key of the build. */
  id: string
  /** Build of the row. */
  squadBuild: SquadBuild
  /** Class name of the build. */
  className: string
  /** Number of Units of the build in the Squad. */
  inSquadCount: number
  /** Whether the build is an Outdated build: no Unit of it can be added until the update. */
  isOutdated: boolean
}

/**
 * Saved builds of one Build calculator.
 */
export interface SavedBuildGroup {
  /** Unit type of the Build calculator. */
  id: LoadoutUnitId
  /** Name of the Build calculator: `Biosoldier builds`. */
  title: string
  /** Builds in calculator order. */
  rows: SavedBuildRow[]
}

/**
 * Builds whose name or class contains the query, in any case; a blank query keeps every build.
 *
 * @param builds saved builds.
 * @param query search query.
 */
export const matchingBuilds = (builds: readonly SquadBuild[], query: string) => {
  const text = query.trim().toLowerCase();

  if (!text) return builds;

  return builds.filter(squadBuild => (
    squadBuild.build.name.toLowerCase().includes(text) || squadBuildClassName(squadBuild).toLowerCase().includes(text)
  ));
};

/**
 * Filters of the builds: all of them, then each unit type, with the number of builds each keeps.
 *
 * @param builds builds to filter.
 */
export const savedBuildFilters = (builds: readonly SquadBuild[]): SavedBuildFilter[] => {
  const countByKind = builds.reduce((acc, squadBuild) => {
    acc.set(squadBuild.kind, (acc.get(squadBuild.kind) ?? 0) + 1);

    return acc;
  }, new Map<LoadoutUnitId, number>());

  return [
    { id: 'all', name: ALL_BUILDS_FILTER_NAME, count: builds.length },
    ...LOADOUT_UNITS.map(unit => ({ id: unit.id, name: unit.name, count: countByKind.get(unit.id) ?? 0 })),
  ];
};

/**
 * Builds of the chosen unit type grouped by Build calculator in unit type order, without empty groups; each build
 * counts its Units in the Squad and tells whether it is an Outdated build.
 *
 * @param builds builds to group.
 * @param kind unit type to keep, or all.
 * @param units Units of the Squad.
 */
export const savedBuildGroups = (builds: readonly SquadBuild[], kind: SavedBuildKind, units: readonly Readonly<SquadUnit>[]) => {
  const unitCountByBuild = units.reduce((acc, unit) => {
    const key = squadBuildKey(unit.build);

    acc.set(key, (acc.get(key) ?? 0) + 1);

    return acc;
  }, new Map<string, number>());

  return LOADOUT_UNITS.reduce<SavedBuildGroup[]>((groups, unit) => {
    if (kind !== 'all' && kind !== unit.id) return groups;

    const rows = builds.filter(squadBuild => squadBuild.kind === unit.id).map((squadBuild): SavedBuildRow => {
      const id = squadBuildKey({ kind: squadBuild.kind, id: squadBuild.build.id });

      return {
        id,
        squadBuild,
        className: squadBuildClassName(squadBuild),
        inSquadCount: unitCountByBuild.get(id) ?? 0,
        isOutdated: squadBuild.build.outdated !== null,
      };
    });

    if (rows.length) groups.push({ id: unit.id, title: buildListName(unit.id), rows });

    return groups;
  }, []);
};
