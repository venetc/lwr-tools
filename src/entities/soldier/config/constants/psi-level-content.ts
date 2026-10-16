import type { DeepReadonly } from '@shared/lib/object';

import type { PsiLevelContent } from '../../model/psi-levels';
import psiLevelsJson from '../data/psi-levels.json';

/** Psi level records by psi level id, from Awakened to Master. */
export const PSI_LEVEL_CONTENT: DeepReadonly<typeof psiLevelsJson> = psiLevelsJson satisfies Record<string, PsiLevelContent>;
