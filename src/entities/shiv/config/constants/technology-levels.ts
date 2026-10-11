import type { DeepReadonly } from '@shared/lib/object';
import { typedEntries } from '@shared/lib/object';

import { isShivPerkId, shivPerkById } from '../../model/perks';
import type { TechnologyLevel } from '../../model/technology-levels';
import { TECHNOLOGY_LEVEL_CONTENT } from './technology-level-content';
import { TECHNOLOGY_LEVEL_ICON } from './technology-level-icons';

/** The SHIV tree: technology levels in game order with their icons and perks; unknown perk ids are skipped. */
export const TECHNOLOGY_LEVELS: DeepReadonly<TechnologyLevel[]> = typedEntries(TECHNOLOGY_LEVEL_CONTENT)
  .map(([id, content]) => ({
    id,
    name: content.name,
    icon: TECHNOLOGY_LEVEL_ICON[id],
    perks: content.perks.filter(isShivPerkId).map(shivPerkById),
  }));
