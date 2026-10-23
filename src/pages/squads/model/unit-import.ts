import type { Loadout, LoadoutChange } from '@entities/loadout';
import { LOADOUT_UNITS } from '@entities/loadout';
import type { SquadUnitBuild } from '@features/manage-squads';
import type { DecodedSquad } from '@features/share-build';
import type { ToastContent } from '@shared/ui/toast';

import { LIST_SEPARATOR, UNIT_CHECK_LINE_BREAK } from '../config/constants';
import type { SquadBuildData } from './squad-build';
import { buildListName, squadBuildKey } from './squad-build';
import { buildChangeLines, checkUnit } from './unit-check';

/**
 * Unit of a Share code, its build saved and its Loadout checked.
 */
export interface ImportedUnit {
  /** Saved build of the Unit. */
  build: SquadUnitBuild
  /** Build name. */
  buildName: string
  /** Loadout that fits the build. */
  loadout: Loadout
  /** Items the Unit check moved, removed, replaced or added. */
  changes: LoadoutChange[]
}

/**
 * Units of a Share code checked against their builds, each build saved once and only if a Unit of it stays. A Unit
 * that no armor or primary weapon fits is left out.
 *
 * @param squad builds and Units of a Squad code, or of a single Unit.
 * @param saveBuild saves the build to its Build calculator and gives its kind and id.
 * @returns the Units that stay, in Squad order.
 */
export const importUnits = (
  squad: Readonly<Pick<DecodedSquad, 'builds' | 'units'>>,
  saveBuild: (squadBuild: SquadBuildData) => SquadUnitBuild,
) => {
  const buildsByIndex = new Map<number, SquadUnitBuild>();

  return squad.units.reduce<ImportedUnit[]>((units, unit) => {
    const squadBuild = squad.builds[unit.buildIndex] ?? null;
    const checked = squadBuild && checkUnit(unit.loadout, squadBuild);

    if (!squadBuild || !checked) return units;

    const build = buildsByIndex.get(unit.buildIndex) ?? saveBuild(squadBuild);

    buildsByIndex.set(unit.buildIndex, build);
    units.push({ build, buildName: squadBuild.build.name, loadout: checked.loadout, changes: checked.changes });

    return units;
  }, []);
};

/**
 * Toast of an imported Squad: how many new builds went to each Build calculator, then a line on each build whose
 * Units the Unit check changed: `Alpha opened with new Builds: 2 in Biosoldier builds, 1 in SHIV builds.`
 *
 * @param name Squad name.
 * @param units Units of the Squad.
 */
export const squadImportToast = (name: string, units: readonly ImportedUnit[]): ToastContent => {
  const buildKinds = [...new Map(units.map(unit => [squadBuildKey(unit.build), unit.build.kind])).values()];
  const buildCounts = LOADOUT_UNITS.reduce<string[]>((acc, unit) => {
    const count = buildKinds.filter(kind => kind === unit.id).length;

    if (count) acc.push(`${count} in ${buildListName(unit.id)}`);

    return acc;
  }, []);
  const lines = [buildCounts.length ? `${name} opened with new Builds: ${buildCounts.join(LIST_SEPARATOR)}.` : `${name} opened.`];

  lines.push(...buildChangeLines(units.map(unit => ({ buildKey: squadBuildKey(unit.build), buildName: unit.buildName, changes: unit.changes }))).values());

  return { title: 'Squad imported', description: lines.join(UNIT_CHECK_LINE_BREAK) };
};
