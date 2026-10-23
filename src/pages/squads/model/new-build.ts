import type { LoadoutUnit, LoadoutUnitId } from '@entities/loadout';
import type { SoldierClass } from '@entities/soldier';
import type { DeepReadonly } from '@shared/lib/object';
import type { SvgIcon } from '@shared/ui/svg-icon';

import { SQUAD_BUILD_KINDS } from './squad-build-kinds';

/**
 * Default build the New build tab of the Add Unit dialog offers: a class of a biosoldier or MEC, or a SHIV.
 */
export interface NewBuildOption {
  /** Option id: the class id, or the unit type id for a unit type without classes. */
  id: string
  /** Build calculator of the new build. */
  kind: LoadoutUnitId
  /** Class name, or the unit type name for a unit type without classes. */
  name: string
  /** Class icon; null for a unit type without classes. */
  icon: SvgIcon | null
  /** Class of the new build; null for a unit type without classes. */
  soldierClass: DeepReadonly<SoldierClass> | null
}

/**
 * Default builds of one Build calculator in the New build tab.
 */
export interface NewBuildGroup {
  /** Unit type of the Build calculator. */
  id: LoadoutUnitId
  /** Unit type name. */
  title: string
  /** Default builds the group offers. */
  options: NewBuildOption[]
}

/**
 * Default build of the class.
 *
 * @param kind Build calculator of the class.
 * @param soldierClass biosoldier class or MEC class.
 */
const classBuildOption = (kind: LoadoutUnitId, soldierClass: DeepReadonly<SoldierClass>): NewBuildOption => ({
  id: soldierClass.id,
  kind,
  name: soldierClass.name,
  icon: soldierClass.icon,
  soldierClass,
});

/**
 * Default builds of the unit type: one per class of a biosoldier or MEC, a single one for a SHIV.
 *
 * @param unit unit type of the Build calculator.
 */
export const newBuildGroup = (unit: DeepReadonly<LoadoutUnit>): NewBuildGroup => {
  const classes = SQUAD_BUILD_KINDS[unit.id].classes;

  if (!classes) return { id: unit.id, title: unit.name, options: [{ id: unit.id, kind: unit.id, name: unit.name, icon: null, soldierClass: null }] };

  return { id: unit.id, title: unit.name, options: classes.map(soldierClass => classBuildOption(unit.id, soldierClass)) };
};
