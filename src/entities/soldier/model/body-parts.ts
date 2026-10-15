import type bodyPartsJson from '../config/data/body-parts.json';
import type { AbilityId } from './abilities';
import { isAbilityId } from './abilities';

export type BodyPartId = keyof typeof bodyPartsJson;

/**
 * Body part record of `body-parts.json`.
 */
export interface BodyPartContent {
  /** Body part name. */
  name: string
  /** Gene mod ids of the body part: variant 1, then variant 2. */
  geneMods: readonly string[]
}

export interface BodyPart {
  /** Body part id. */
  id: BodyPartId
  /** Body part name. */
  name: string
  /** Gene mods to choose from: variant 1, then variant 2. */
  geneMods: AbilityId[]
}

/**
 * Gene mods of a build by body part, in body part order; null for a body part without a gene mod.
 */
export type SelectedGeneMods = (AbilityId | null)[];

/**
 * Body part state in a build: completed with a gene mod, available for selection, or locked.
 */
export type BodyPartState = 'completed' | 'available' | 'locked';

/**
 * Body part state in a build. Body parts are independent, so any body part is open in an editable build;
 * a body part with a gene mod is completed even in a readonly build, where empty body parts are locked.
 *
 * @param selectedId id of the gene mod of the body part, or null.
 * @param isReadonly whether the build is readonly.
 */
export const bodyPartState = (selectedId: string | null, isReadonly: boolean): BodyPartState => {
  if (selectedId !== null) return 'completed';
  if (isReadonly) return 'locked';
  return 'available';
};

/**
 * Body part of its record; unknown ability ids are skipped.
 *
 * @param id body part id.
 * @param content body part record.
 */
export const createBodyPart = (id: BodyPartId, content: BodyPartContent): BodyPart => ({
  id,
  name: content.name,
  geneMods: content.geneMods.filter(isAbilityId),
});
