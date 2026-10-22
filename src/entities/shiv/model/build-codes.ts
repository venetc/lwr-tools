import { SHIV_BUILD_NAME } from '../config/constants/build';
import { SHIV_PERK_CONTENT } from '../config/constants/perk-content';
import { SHIV_PERK_ID_BY_CODE } from '../config/constants/perks';
import { TECHNOLOGY_LEVELS } from '../config/constants/technology-levels';
import type { ShivBuildData } from './build';
import { defaultShivBuild, selectShivBuildPerk } from './build';
import { shivPerkBlockReason } from './build-rules';
import { isShivPerkId } from './perks';

/**
 * SHIV build as stable codes: what a share code of a SHIV carries.
 */
export interface ShivBuildCodes {
  /** Codes of the selected perks by technology level; empty levels are left out. */
  perks: number[]
  /** Build name; null for the default name, `SHIV`, or a blank one. */
  name: string | null
}

/**
 * SHIV build as stable codes.
 *
 * @param build SHIV build.
 * @returns the codes, with a null name for the default or a blank one; null for a build that breaks a Build rule or has
 * an unknown perk.
 */
export const shivBuildCodes = (build: Readonly<ShivBuildData>): ShivBuildCodes | null => {
  if (!build.perks.every((perkId, levelIndex) => perkId === null || !shivPerkBlockReason(levelIndex, perkId))) return null;

  const perks = build.perks
    .filter(perkId => perkId !== null)
    .map(perkId => (isShivPerkId(perkId) ? SHIV_PERK_CONTENT[perkId].code : null));

  if (!perks.every(code => code !== null)) return null;

  return { perks, name: build.name.trim() && build.name !== SHIV_BUILD_NAME ? build.name : null };
};

/**
 * SHIV build of stable codes: each perk goes to its technology level with the mutator, whatever the code order.
 *
 * @param codes SHIV build codes.
 * @returns the build; null for an unknown code, a perk outside the SHIV tree or two perks of one level.
 */
export const shivBuildFromCodes = (codes: Readonly<ShivBuildCodes>): ShivBuildData | null => {
  const build = { ...defaultShivBuild(), name: codes.name?.trim() ? codes.name : SHIV_BUILD_NAME };

  for (const code of codes.perks) {
    const perkId = SHIV_PERK_ID_BY_CODE.get(code) ?? null;
    const levelIndex = TECHNOLOGY_LEVELS.findIndex(level => level.perks.some(perk => perk.id === perkId));

    if (!perkId || shivPerkBlockReason(levelIndex, perkId) || build.perks[levelIndex]) return null;

    selectShivBuildPerk(build, levelIndex, perkId);
  }

  return build;
};
