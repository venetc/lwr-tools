import type { LoadoutUnitId } from '@entities/loadout';
import type { SquadUnitBuild } from '@features/manage-squads';
import type { BiosoldierBuild, MecBuild, ShivBuild } from '@widgets/build-calculator';

import { BUILD_LIST_WORD, CAPTION_SEPARATOR, UNIT_NAME_BY_KIND } from '../config/constants';

/**
 * Saved build a Unit refers to, with the kind of its Build calculator.
 */
export type SquadBuild = { kind: 'biosoldier', build: BiosoldierBuild } | { kind: 'mec', build: MecBuild } | { kind: 'shiv', build: ShivBuild };

/**
 * Class name of the build: the class of a biosoldier or the MEC class of a MEC; a SHIV shows its unit type name.
 *
 * @param squadBuild build of the Unit.
 */
export const squadBuildClassName = (squadBuild: SquadBuild) => {
  if (squadBuild.kind === 'shiv') return UNIT_NAME_BY_KIND.get(squadBuild.kind) ?? '';

  return squadBuild.build.soldierClass.name;
};

/**
 * Caption of the build: the unit type and the class, such as `Biosoldier · Sniper`; a SHIV shows its unit type alone.
 *
 * @param squadBuild build of the Unit.
 */
export const squadBuildCaption = (squadBuild: SquadBuild) => {
  if (squadBuild.kind === 'shiv') return squadBuildClassName(squadBuild);

  return [UNIT_NAME_BY_KIND.get(squadBuild.kind), squadBuildClassName(squadBuild)].join(CAPTION_SEPARATOR);
};

/**
 * Key of the build a Unit refers to, unique across the Build calculators.
 *
 * @param build kind and id of the build.
 */
export const squadBuildKey = (build: Readonly<SquadUnitBuild>) => `${build.kind}/${build.id}`;

/**
 * Name of the Build calculator of the unit type, as the Squad planner tells where a build is: `Biosoldier builds`.
 *
 * @param kind unit type of the Build calculator.
 */
export const buildListName = (kind: LoadoutUnitId) => `${UNIT_NAME_BY_KIND.get(kind)} ${BUILD_LIST_WORD}`;
