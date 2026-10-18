import type { LoadoutUnitId } from '@entities/loadout';
import { LOADOUT_UNITS } from '@entities/loadout';
import type { SquadUnit } from '@features/manage-squads';

import { SUMMARY_SEPARATOR, UNIT_WORD, UNITS_WORD } from '../config/constants';

/**
 * Summary of a Squad: the number of Units, then the number of each unit type present, in unit type order,
 * such as `6 Units · Biosoldier 4 · MEC 1 · SHIV 1`.
 *
 * @param units Units of the Squad.
 */
export const squadSummary = (units: readonly Readonly<SquadUnit>[]) => {
  const countByKind = units.reduce((acc, unit) => {
    acc.set(unit.build.kind, (acc.get(unit.build.kind) ?? 0) + 1);

    return acc;
  }, new Map<LoadoutUnitId, number>());

  const kindParts = LOADOUT_UNITS.reduce<string[]>((parts, unitType) => {
    const count = countByKind.get(unitType.id);

    if (count) parts.push(`${unitType.name} ${count}`);

    return parts;
  }, []);

  return [`${units.length} ${units.length === 1 ? UNIT_WORD : UNITS_WORD}`, ...kindParts].join(SUMMARY_SEPARATOR);
};
