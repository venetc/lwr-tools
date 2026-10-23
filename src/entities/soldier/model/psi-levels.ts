import type psiLevelsJson from '../config/data/psi-levels.json';
import type { AbilityId } from './abilities';
import { isAbilityId } from './abilities';
import type { RankState } from './ranks';
import { rankState } from './ranks';

export type PsiLevelId = keyof typeof psiLevelsJson;

/**
 * Psi level record of `psi-levels.json`.
 */
export interface PsiLevelContent {
  /** Psi level name. */
  name: string
  /** Psionic ability ids of the level, left to right. */
  abilities: readonly string[]
}

export interface PsiLevel {
  /** Psi level id. */
  id: PsiLevelId
  /** Psi level name. */
  name: string
  /** Psionic abilities to choose from, left to right. */
  abilities: AbilityId[]
}

/**
 * Psionic abilities of a build by psi level, from Awakened: one entry per psi level, null for an empty one.
 */
export type SelectedPsionicAbilities = (AbilityId | null)[];

/**
 * Psi level state in a build: like a rank, and a level a Build rule blocks is locked.
 *
 * @param selectedId id of the psionic ability of the psi level, or null.
 * @param isReadonly whether the build is readonly.
 * @param isBlocked whether a Build rule blocks the level, such as Neural Damping.
 */
export const psiLevelState = (selectedId: string | null, isReadonly: boolean, isBlocked: boolean): RankState => {
  if (isBlocked) return 'locked';
  return rankState(selectedId, isReadonly);
};

/**
 * Psi level of its record; unknown ability ids are skipped.
 *
 * @param id psi level id.
 * @param content psi level record.
 */
export const createPsiLevel = (id: PsiLevelId, content: PsiLevelContent): PsiLevel => ({
  id,
  name: content.name,
  abilities: content.abilities.filter(isAbilityId),
});
