import { SHIV_BUILD_NAME } from '../config/constants/build';
import { SHIV_PERK_CONTENT } from '../config/constants/perk-content';
import { SHIV_PERK_ID_BY_CODE } from '../config/constants/perks';
import { TECHNOLOGY_LEVELS } from '../config/constants/technology-levels';
import type { ShivBuildData } from './build';
import { defaultShivBuild, selectShivBuildPerk } from './build';
import { shivPerkBlockReason } from './build-rules';
import type { ShivPerkId } from './perks';
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
 * Outdated selection of a SHIV build code: a perk of the code left out of the build, `removed` when the SHIV tree no
 * longer has it, `collision` when another perk of the code is on the same technology level now.
 */
export type ShivOutdatedSelection = {
  /** Perk of the code. */
  perkId: ShivPerkId
  /** The SHIV tree no longer has the perk. */
  reason: 'removed'
} | {
  /** Perk of the code. */
  perkId: ShivPerkId
  /** Another perk of the code is on the same technology level now. */
  reason: 'collision'
  /** Technology level index of the perks in the tree. */
  levelIndex: number
};

/**
 * SHIV build of stable codes and the perks of the codes left out of it.
 */
export interface ShivBuildOfCodes {
  /** Build without the Outdated selections. */
  build: ShivBuildData
  /** Outdated selections in code order; empty if every perk has its own technology level. */
  outdated: ShivOutdatedSelection[]
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
 * SHIV build of stable codes: each perk goes to its technology level with the mutator, whatever the code order. A perk
 * gone from the SHIV tree and the perks that share a technology level now are Outdated selections and stay out of the
 * build.
 *
 * @param codes SHIV build codes.
 * @returns the build and its Outdated selections; null for an unknown code or a code given twice.
 */
export const shivBuildFromCodes = (codes: Readonly<ShivBuildCodes>): ShivBuildOfCodes | null => {
  const perkIds = codes.perks.map(code => SHIV_PERK_ID_BY_CODE.get(code) ?? null);

  if (!perkIds.every(perkId => perkId !== null) || new Set(perkIds).size < perkIds.length) return null;

  const placedPerks = perkIds.map(perkId => ({ perkId, levelIndex: TECHNOLOGY_LEVELS.findIndex(level => level.perks.some(perk => perk.id === perkId)) }));
  const perkCountByLevel = placedPerks.reduce((counts, { levelIndex }) => counts.set(levelIndex, (counts.get(levelIndex) ?? 0) + 1), new Map<number, number>());
  const result: ShivBuildOfCodes = { build: { ...defaultShivBuild(), name: codes.name?.trim() ? codes.name : SHIV_BUILD_NAME }, outdated: [] };

  for (const { perkId, levelIndex } of placedPerks) {
    if (levelIndex < 0) {
      result.outdated.push({ perkId, reason: 'removed' });

      continue;
    }

    if ((perkCountByLevel.get(levelIndex) ?? 0) > 1) {
      result.outdated.push({ perkId, reason: 'collision', levelIndex });

      continue;
    }

    selectShivBuildPerk(result.build, levelIndex, perkId);
  }

  return result;
};
