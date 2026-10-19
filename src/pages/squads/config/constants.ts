import type { LoadoutUnitId, UtilitySlotKind } from '@entities/loadout';
import { LOADOUT_UNITS } from '@entities/loadout';
import type { DeepReadonly } from '@shared/lib/object';
import type { TabsItem } from '@shared/ui/tabs';

import type { NewBuildGroup } from '../model/new-build';
import { newBuildGroup } from '../model/new-build';

/** Word for one Unit in the Squad summary. */
export const UNIT_WORD = 'Unit';

/** Word for any other number of Units in the Squad summary. */
export const UNITS_WORD = 'Units';

/** Separator of the parts of the Squad summary. */
export const SUMMARY_SEPARATOR = ' · ';

/** Caption of the armor slot tile by unit type: Armor, the MEC exoskeleton of a MEC, the SHIV type of a SHIV. */
export const ARMOR_SLOT_CAPTION = {
  biosoldier: 'Armor',
  mec: 'MEC exoskeleton',
  shiv: 'SHIV type',
} as const satisfies Record<LoadoutUnitId, string>;

/** Caption of the primary weapon slot tile. */
export const PRIMARY_SLOT_CAPTION = 'Primary';

/** Caption of the secondary weapon slot tile. */
export const SECONDARY_SLOT_CAPTION = 'Secondary';

/** Caption of a Module slot tile. */
export const MODULE_SLOT_CAPTION = 'Module';

/** Name a tile of an empty slot gives in place of an item name. */
export const EMPTY_SLOT_NAME = 'Empty';

/** Caption of a utility slot tile by its kind: Gear Slots and Psi Slots have their own. */
export const UTILITY_SLOT_CAPTION = {
  'regular': 'Utility',
  'gear-slot': 'Gear Slot',
  'psi-slot': 'Psi Slot',
} as const satisfies Record<UtilitySlotKind, string>;

/** Unit type names by unit type id: the name of each Build calculator and the class shown for a SHIV build. */
export const UNIT_NAME_BY_KIND: ReadonlyMap<LoadoutUnitId, string> = new Map(LOADOUT_UNITS.map(unit => [unit.id, unit.name]));

/** Word after the unit type name that names its Build calculator: `Biosoldier builds`. */
export const BUILD_LIST_WORD = 'builds';

/** Name of the filter of saved builds that keeps every unit type. */
export const ALL_BUILDS_FILTER_NAME = 'All';

/** Tabs of the Add Unit dialog: where the build of the new Unit comes from. */
export const ADD_UNIT_TABS = [
  { id: 'saved', name: 'Saved builds' },
  { id: 'new', name: 'New build' },
] as const satisfies readonly TabsItem[];

/** Default builds of the New build tab by Build calculator, in unit type order. */
export const NEW_BUILD_GROUPS: DeepReadonly<NewBuildGroup[]> = LOADOUT_UNITS.map(newBuildGroup);

/** Separator of the unit type and the class in the caption of a Unit card: `Biosoldier · Sniper`. */
export const CAPTION_SEPARATOR = ' · ';
