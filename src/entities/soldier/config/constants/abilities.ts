import { typedEntries } from '@shared/lib/object';

import { ABILITY_CONTENT } from './ability-content';

/** Ability ids by their share code number. */
export const ABILITY_ID_BY_CODE = new Map(typedEntries(ABILITY_CONTENT).map(([id, content]) => [content.code, id]));
