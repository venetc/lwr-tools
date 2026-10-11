import type { DeepReadonly } from '@shared/lib/object';
import { typedEntries } from '@shared/lib/object';

import { isShivPerkId, shivPerkById } from '../../model/perks';
import type { TechnologyLevel } from '../../model/technology-levels';
import { TECHNOLOGY_LEVEL_CONTENT } from './technology-level-content';

/** The SHIV tree: technology levels in game order with their perks; unknown perk ids are skipped. */
export const TECHNOLOGY_LEVELS: DeepReadonly<TechnologyLevel[]> = typedEntries(TECHNOLOGY_LEVEL_CONTENT)
  .map(([id, content]) => ({ id, name: content.name, perks: content.perks.filter(isShivPerkId).map(shivPerkById) }));
