import type { Loadout, LoadoutChange, LoadoutWearer } from '@entities/loadout';
import { defaultLoadout, fitLoadout } from '@entities/loadout';
import { biosoldierBuildBranchSet, isOfficerBuild } from '@entities/soldier';
import type { SquadUnit, UnitLoadout } from '@features/manage-squads';
import type { ToastContent } from '@shared/ui/toast';

import {
  BUILD_NOT_FOUND_TEXT,
  UNIT_CHECK_BUILD_SEPARATOR,
  UNIT_CHECK_LINE_BREAK,
  UNIT_CHECK_TOAST_TITLE,
  UNIT_WORD,
  UNITS_WORD,
} from '../config/constants';
import { changeNote } from './loadout-edit';
import type { SquadBuild } from './squad-build';
import { squadBuildKey } from './squad-build';

/**
 * Unit brought to the rules of its Build.
 */
export interface CheckedUnit {
  /** What the Loadout rules know about the Unit. */
  wearer: LoadoutWearer
  /** Loadout that fits the Build. */
  loadout: Loadout
  /** Items the check moved, removed, replaced or added; empty if the Loadout already fit. */
  changes: LoadoutChange[]
}

/**
 * Unit of a Squad brought to the rules of its Build.
 */
export interface CheckedSquadUnit extends CheckedUnit {
  /** Unit as the Squad keeps it. */
  unit: SquadUnit
  /** Build of the Unit. */
  squadBuild: SquadBuild
}

/**
 * Units of a Squad after the Unit check.
 */
export interface SquadCheck {
  /** Units that stay in the Squad, in Squad order, with their checked Loadouts. */
  units: CheckedSquadUnit[]
  /** Units whose Build is no longer saved: they leave the Squad. */
  removed: SquadUnit[]
  /** Whether the Squad should keep other Units or Loadouts than it does, silent replacements of unknown codes included; a Unit left out because nothing fits it changes nothing. */
  isChanged: boolean
}

/**
 * Changed Units of one Build, as a line of the Unit check toast tells them.
 */
interface BuildChanges {
  /** Build of the Units. */
  squadBuild: SquadBuild
  /** Number of the Units of the Build the check changed. */
  unitCount: number
  /** Sentences about the changes, without repeats, in the order they first appear. */
  notes: Set<string>
}

/**
 * What the Loadout rules need to know about a Unit of the build: the class of a biosoldier with its gene mods,
 * psionic abilities and whether it is an Officer; the MEC class of a MEC; nothing of a SHIV.
 *
 * @param squadBuild build of the Unit.
 */
const unitWearer = (squadBuild: SquadBuild): LoadoutWearer => {
  if (squadBuild.kind === 'biosoldier') {
    const branchSet = biosoldierBuildBranchSet(squadBuild.build);

    return {
      unit: 'biosoldier',
      classId: squadBuild.build.soldierClass.id,
      hasGeneMod: branchSet === 'gene-mods' || branchSet === 'both',
      hasPsionicAbility: branchSet === 'psionic' || branchSet === 'both',
      isOfficer: isOfficerBuild(squadBuild.build),
    };
  }

  const classId = squadBuild.kind === 'mec' ? squadBuild.build.soldierClass.id : null;

  return { unit: squadBuild.kind, classId, hasGeneMod: false, hasPsionicAbility: false, isOfficer: false };
};

/**
 * Unit check of one Unit: its Loadout brought to the rules of its Build. A new Unit gets the Default Loadout; armor
 * or a primary weapon of an unknown code silently becomes the default one, and anything else that no longer fits is
 * taken off or replaced with the default.
 *
 * @param loadout Loadout of the Unit as the Squad keeps it; null for a new Unit.
 * @param squadBuild build of the Unit.
 * @returns the checked Unit; null if no armor or primary weapon fits the Unit.
 */
export const checkUnit = (loadout: Readonly<UnitLoadout> | null, squadBuild: SquadBuild): CheckedUnit | null => {
  const wearer = unitWearer(squadBuild);
  const defaults = defaultLoadout(wearer);

  if (!defaults) return null;

  if (!loadout) return { wearer, loadout: defaults, changes: [] };

  const fit = fitLoadout({ ...loadout, armor: loadout.armor ?? defaults.armor, primary: loadout.primary ?? defaults.primary }, wearer);

  return { wearer, loadout: fit.loadout, changes: fit.changes };
};

/**
 * Whether the items of the slots are the same, position by position.
 *
 * @param kept items as the Squad keeps them.
 * @param checked items after the check.
 */
const isSameItems = <Item>(kept: readonly Item[], checked: readonly Item[]) => {
  return kept.length === checked.length && kept.every((item, index) => item === checked[index]);
};

/**
 * Whether the Loadout the Squad keeps is the checked one, item by item.
 *
 * @param kept Loadout as the Squad keeps it.
 * @param checked Loadout after the check.
 */
const isSameLoadout = (kept: Readonly<UnitLoadout>, checked: Loadout) => {
  return kept.armor === checked.armor
    && kept.primary === checked.primary
    && kept.secondary === checked.secondary
    && isSameItems(kept.utility, checked.utility)
    && isSameItems(kept.modules, checked.modules);
};

/**
 * Unit check of the Units of a Squad: each Loadout brought to the rules of its Build, and the Units whose Build is gone
 * leave. A Unit that no armor or primary weapon fits is left out without a report.
 *
 * @param units Units of the Squad in Squad order.
 * @param squadBuilds saved builds by `squadBuildKey`.
 */
export const checkSquad = (units: readonly SquadUnit[], squadBuilds: ReadonlyMap<string, SquadBuild>): SquadCheck => {
  return units.reduce<SquadCheck>((check, unit) => {
    const squadBuild = squadBuilds.get(squadBuildKey(unit.build));

    if (!squadBuild) {
      check.removed.push(unit);
      check.isChanged = true;
      return check;
    }

    const checked = checkUnit(unit.loadout, squadBuild);

    if (!checked) return check;

    check.units.push({ ...checked, unit, squadBuild });

    if (!isSameLoadout(unit.loadout, checked.loadout)) check.isChanged = true;

    return check;
  }, { units: [], removed: [], isChanged: false });
};

/**
 * Number of Units in words: `1 Unit`, `2 Units`.
 *
 * @param count number of Units.
 */
const unitCountText = (count: number) => `${count} ${count === 1 ? UNIT_WORD : UNITS_WORD}`;

/**
 * Line of the Unit check toast about one Build: its name, the number of its changed Units if more than one, and the
 * changes: `Assault Ace (2 Units) — Reaper Ammo removed: unsupported weapon.`
 *
 * @param buildChanges changed Units of the Build.
 */
const buildChangesLine = (buildChanges: BuildChanges) => {
  const count = buildChanges.unitCount > 1 ? ` (${unitCountText(buildChanges.unitCount)})` : '';

  return `${buildChanges.squadBuild.build.name}${count}${UNIT_CHECK_BUILD_SEPARATOR}${[...buildChanges.notes].join(' ')}`;
};

/**
 * Lines of the Unit check toast by Build: a line on each Build with changed Units, in Squad order. Silent replacements
 * of unknown codes are not told.
 *
 * @param check Units of the Squad after the Unit check.
 * @returns toast lines by `squadBuildKey`; a Build whose Units the check left as they were has no line.
 */
export const unitCheckBuildLines = (check: SquadCheck): ReadonlyMap<string, string> => {
  const changesByBuild = check.units.reduce((acc, checked) => {
    if (!checked.changes.length) return acc;

    const key = squadBuildKey(checked.unit.build);
    const buildChanges = acc.get(key) ?? { squadBuild: checked.squadBuild, unitCount: 0, notes: new Set<string>() };

    buildChanges.unitCount += 1;
    checked.changes.forEach(change => buildChanges.notes.add(changeNote(change)));
    acc.set(key, buildChanges);

    return acc;
  }, new Map<string, BuildChanges>());

  return [...changesByBuild].reduce((acc, [key, buildChanges]) => acc.set(key, buildChangesLine(buildChanges)), new Map<string, string>());
};

/**
 * Toast of a Unit check: a line on each Build with changed Units, in Squad order, and the number of Units whose Build
 * is gone on the last line. Silent replacements of unknown codes are not told.
 *
 * @param check Units of the Squad after the Unit check.
 * @returns title and text of the toast; null if the check took nothing off.
 */
export const unitCheckToast = (check: SquadCheck): ToastContent | null => {
  const lines = [...unitCheckBuildLines(check).values()];

  if (check.removed.length) lines.push(`${unitCountText(check.removed.length)} ${BUILD_NOT_FOUND_TEXT}`);

  if (!lines.length) return null;

  return { title: UNIT_CHECK_TOAST_TITLE, description: lines.join(UNIT_CHECK_LINE_BREAK) };
};
