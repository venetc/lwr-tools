import type { LoadoutUnit, LoadoutUnitId } from '@entities/loadout';
import type { SoldierClass } from '@entities/soldier';
import { BIOSOLDIER_CLASSES, MEC_CLASSES } from '@entities/soldier';
import type { DeepReadonly } from '@shared/lib/object';
import type { SvgIcon } from '@shared/ui/svg-icon';

/**
 * Default build the New build tab of the Add Unit dialog offers: a class of a biosoldier or MEC, or a SHIV.
 */
export type NewBuildOption = {
  /** Option id: the class id. */
  id: string
  /** Build calculator of the new build. */
  kind: 'biosoldier' | 'mec'
  /** Class name, also the name of the new build. */
  name: string
  /** Class icon. */
  icon: SvgIcon
  /** Class of the new build. */
  soldierClass: DeepReadonly<SoldierClass>
} | {
  /** Option id: the unit type id. */
  id: string
  /** Build calculator of the new build. */
  kind: 'shiv'
  /** Unit type name. */
  name: string
  /** A SHIV has no class icon. */
  icon: null
};

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
const classBuildOption = (kind: 'biosoldier' | 'mec', soldierClass: DeepReadonly<SoldierClass>): NewBuildOption => ({
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
  if (unit.id === 'biosoldier') return { id: unit.id, title: unit.name, options: BIOSOLDIER_CLASSES.map(soldierClass => classBuildOption('biosoldier', soldierClass)) };

  if (unit.id === 'mec') return { id: unit.id, title: unit.name, options: MEC_CLASSES.map(soldierClass => classBuildOption('mec', soldierClass)) };

  return { id: unit.id, title: unit.name, options: [{ id: unit.id, kind: 'shiv', name: unit.name, icon: null }] };
};
