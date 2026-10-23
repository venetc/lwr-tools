import { BUILD_SQUADS_LEAD, ONE_UNIT_REMOVAL_TEXT, UNIT_WORD, UNITS_REMOVAL_LEAD, UNITS_REMOVAL_TEXT, UNITS_WORD } from '../config/constants';
import type { Squad, SquadUnitBuild } from './squad';
import { isUnitOfBuild } from './squad';

/**
 * Squad a build stands in.
 */
export interface BuildSquad {
  /** Squad id. */
  id: string
  /** Squad name. */
  name: string
  /** Number of the Units of the build in the Squad. */
  unitCount: number
}

/**
 * Squads the build stands in, in Squad order, with the number of its Units in each.
 *
 * @param squads Squads in list order.
 * @param build build to look for.
 */
export const buildSquads = (squads: readonly Squad[], build: Readonly<SquadUnitBuild>) => squads.reduce<BuildSquad[]>((acc, squad) => {
  const unitCount = squad.units.filter(unit => isUnitOfBuild(unit, build)).length;

  if (unitCount) acc.push({ id: squad.id, name: squad.name, unitCount });

  return acc;
}, []);

/**
 * Number of Units in words: `1 Unit`, `2 Units`.
 *
 * @param count number of Units.
 */
const unitCountText = (count: number) => `${count} ${count === 1 ? UNIT_WORD : UNITS_WORD}`;

/**
 * Text of the build removal dialog: the Squads the build stands in with the number of its Units, and how many Units
 * go with it: `It is in Squads: Alpha (2 Units), Bravo (1 Unit). These 3 Units and their Loadouts will be removed.`
 *
 * @param squads Squads the build stands in.
 */
export const buildRemovalNote = (squads: readonly BuildSquad[]) => {
  const squadList = squads.map(squad => `${squad.name} (${unitCountText(squad.unitCount)})`).join(', ');
  const unitCount = squads.reduce((sum, squad) => sum + squad.unitCount, 0);
  const lead = `${BUILD_SQUADS_LEAD} ${squadList}.`;

  if (unitCount === 1) return `${lead} ${ONE_UNIT_REMOVAL_TEXT}`;

  return `${lead} ${UNITS_REMOVAL_LEAD} ${unitCountText(unitCount)} ${UNITS_REMOVAL_TEXT}`;
};
