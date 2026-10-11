import { typedEntries } from '@shared/lib/object';

import type { ShivPerkId } from '../../model/perks';
import { SHIV_PERK_CONTENT } from './perk-content';

/** SHIV perk ids by their share code number. */
export const SHIV_PERK_ID_BY_CODE: ReadonlyMap<number, ShivPerkId> = new Map(typedEntries(SHIV_PERK_CONTENT)
  .map(([id, content]) => [content.code, id]));
