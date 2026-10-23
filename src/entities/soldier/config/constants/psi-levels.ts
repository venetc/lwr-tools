import type { DeepReadonly } from '@shared/lib/object';
import { typedEntries } from '@shared/lib/object';

import type { PsiLevel } from '../../model/psi-levels';
import { createPsiLevel } from '../../model/psi-levels';
import { PSI_LEVEL_CONTENT } from './psi-level-content';

/** Psi levels from Awakened to Master with their psionic abilities; unknown ability ids are skipped. */
export const PSI_LEVELS: DeepReadonly<PsiLevel[]> = typedEntries(PSI_LEVEL_CONTENT).map(([id, content]) => createPsiLevel(id, content));
