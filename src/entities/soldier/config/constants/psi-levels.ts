import type { DeepReadonly } from '@shared/lib/object';
import { typedEntries } from '@shared/lib/object';

import type { AbilityId } from '../../model/abilities';
import type { PsiLevel, SelectedPsionicAbilities } from '../../model/psi-levels';
import { createPsiLevel } from '../../model/psi-levels';
import { PSI_LEVEL_CONTENT } from './psi-level-content';

/** Psi levels from Awakened to Master with their psionic abilities; unknown ability ids are skipped. */
export const PSI_LEVELS: DeepReadonly<PsiLevel[]> = typedEntries(PSI_LEVEL_CONTENT).map(([id, content]) => createPsiLevel(id, content));

/** Psionic abilities of a build without any: null for every psi level. A build takes a copy. */
export const EMPTY_PSIONIC_ABILITIES: DeepReadonly<SelectedPsionicAbilities> = PSI_LEVELS.map(() => null);

/** Psionic abilities offered on each psi level, in psi level order: the variants of the steps of Psionic. */
export const PSIONIC_ABILITIES_BY_PSI_LEVEL: DeepReadonly<AbilityId[][]> = PSI_LEVELS.map(psiLevel => psiLevel.abilities);
