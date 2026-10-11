import { typedEntries } from '@shared/lib/object';

import type { AbilityId } from '../../model/abilities';
import { ABILITY_CONTENT } from './ability-content';

/** Ability ids by their share code number. */
export const ABILITY_ID_BY_CODE: ReadonlyMap<number, AbilityId> = new Map(typedEntries(ABILITY_CONTENT)
  .map(([id, content]) => [content.code, id]));
