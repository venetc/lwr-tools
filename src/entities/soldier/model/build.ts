import type { TalentBuild } from '@shared/lib/talent-tree';

import { SOLDIER_RANKS } from './ranks';
import type { SoldierClass } from './types';

/**
 * Build name to keep: a blank name falls back to the class name.
 *
 * @param soldierClass soldier class of the build.
 * @param name entered or decoded name.
 */
export const soldierBuildName = (soldierClass: SoldierClass, name: string) => {
  if (name.trim() === '') return soldierClass.name;

  return name;
};

/**
 * Talents granted with the class without selection: the only talent of the first rank.
 *
 * @param soldierClass soldier class.
 */
export const soldierClassBaseBuild = (soldierClass: SoldierClass): TalentBuild => {
  return soldierClass.abilities[SOLDIER_RANKS[0].id].slice(0, 1);
};
