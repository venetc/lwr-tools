import type { DeepReadonly } from '@shared/lib/object';
import { typedEntries } from '@shared/lib/object';

import type { AbilityId } from '../../model/abilities';
import type { BodyPart, SelectedGeneMods } from '../../model/body-parts';
import { createBodyPart } from '../../model/body-parts';
import { BODY_PART_CONTENT } from './body-part-content';

/** Body parts in Genetics Lab order with their gene mods; unknown ability ids are skipped. */
export const BODY_PARTS: DeepReadonly<BodyPart[]> = typedEntries(BODY_PART_CONTENT).map(([id, content]) => createBodyPart(id, content));

/** Body part index of each gene mod. */
export const BODY_PART_INDEX_BY_GENE_MOD: ReadonlyMap<AbilityId, number> = new Map(
  BODY_PARTS.flatMap((bodyPart, bodyPartIndex) => bodyPart.geneMods.map(geneModId => [geneModId, bodyPartIndex] as const)),
);

/** Gene mods of a build without any: null for every body part. A build takes a copy. */
export const EMPTY_GENE_MODS: DeepReadonly<SelectedGeneMods> = BODY_PARTS.map(() => null);

/** Neural Damping: the Brain gene mod that excludes psionic abilities. */
export const NEURAL_DAMPING_ID: AbilityId = 'neural-damping';

/** Note of Neural Damping blocked by psionic abilities. */
export const PSIONIC_BLOCK_NOTE = 'Unavailable with Psionic abilities';
