import { ref } from 'vue';

import type { Loadout, LoadoutChange } from '@entities/loadout';
import { LOADOUT_UNITS } from '@entities/loadout';
import type { SquadUnitBuild } from '@features/manage-squads';
import { useSquadsStore } from '@features/manage-squads';
import type { DecodedSquad } from '@features/share-build';
import { decodeSquad } from '@features/share-build';
import type { ToastContent } from '@shared/ui/toast';
import { useToastQueue } from '@shared/ui/toast';

import { INVALID_SHARE_CODE_TEXT, LIST_SEPARATOR, UNIT_CHECK_LINE_BREAK, UNIT_CODE_IN_SQUAD_IMPORT_TEXT } from '../config/constants';
import { useShareCodeField } from './share-code-field';
import { buildListName, squadBuildKey } from './squad-build';
import { importSquadBuild } from './squad-builds';
import { buildChangeLines, checkUnit } from './unit-check';

/**
 * Unit of an imported Squad code, its build saved and its Loadout checked.
 */
interface ImportedUnit {
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
 * Units of the decoded Squad checked against their builds, each build saved to its Build calculator once and only if
 * a Unit of it stays. A Unit that no armor or primary weapon fits is left out.
 *
 * @param squad Squad of a Squad code.
 */
const importSquadUnits = (squad: DecodedSquad) => {
  const buildsByIndex = new Map<number, SquadUnitBuild>();

  return squad.units.reduce<ImportedUnit[]>((units, unit) => {
    const squadBuild = squad.builds[unit.buildIndex] ?? null;
    const checked = squadBuild && checkUnit(unit.loadout, squadBuild);

    if (!squadBuild || !checked) return units;

    const build = buildsByIndex.get(unit.buildIndex) ?? importSquadBuild(squadBuild);

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
const squadImportToast = (name: string, units: readonly ImportedUnit[]): ToastContent => {
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

/**
 * Squad import dialog of the toolbar: a Squad code becomes a new Squad with new builds in the Build calculators, which
 * opens; Units of one build share one new build, and their Loadouts are brought to the rules by the Unit check. A Unit
 * code or a build code is sent to an empty cell and an invalid code shows the error, both under the field.
 */
export const useSquadImport = () => {
  const squadsStore = useSquadsStore();

  const { showToast } = useToastQueue();

  const { code, error, isInvalid, errorId, errorDescribedBy, showError, clearError, reset } = useShareCodeField();

  const isOpen = ref(false);

  /**
   * Opens or closes the dialog; closing clears the code and the error.
   *
   * @param isNextOpen whether the dialog becomes open.
   */
  const setOpen = (isNextOpen: boolean) => {
    isOpen.value = isNextOpen;

    if (isNextOpen) return;

    reset();
  };

  /**
   * Imports the entered Squad code as a new Squad and opens it, closing the dialog; tells where the builds went and
   * what the Unit check took off.
   */
  const importSquadCode = () => {
    const result = decodeSquad(code.value);

    if (result.status !== 'decoded') {
      showError(result.status === 'unit-code' ? UNIT_CODE_IN_SQUAD_IMPORT_TEXT : INVALID_SHARE_CODE_TEXT);

      return;
    }

    const units = importSquadUnits(result.squad);

    squadsStore.importSquad(result.squad.name, units);
    setOpen(false);
    showToast(squadImportToast(squadsStore.openSquad?.name ?? result.squad.name, units));
  };

  return { isOpen, code, error, isInvalid, errorId, errorDescribedBy, clearError, setOpen, importSquadCode };
};
