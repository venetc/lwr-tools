import type { DeepReadonly } from '@shared/lib/object';

import type { TechnologyLevelContent } from '../../model/technology-levels';
import technologyLevelsJson from '../data/technology-levels.json';

/** Technology level records by level id, in game order. */
export const TECHNOLOGY_LEVEL_CONTENT: DeepReadonly<typeof technologyLevelsJson> = technologyLevelsJson satisfies Record<string, TechnologyLevelContent>;
