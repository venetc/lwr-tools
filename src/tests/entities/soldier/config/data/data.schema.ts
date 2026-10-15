import { z } from 'zod';

import { NEURAL_DAMPING_ID } from '@entities/soldier/config/constants/body-parts';
import { SOLDIER_RANK_CONTENT } from '@entities/soldier/config/constants/soldier-rank-content';
import type { AbilityContent } from '@entities/soldier/model/abilities';
import { isAbilityId } from '@entities/soldier/model/abilities';
import type { BodyPartContent } from '@entities/soldier/model/body-parts';
import type { SoldierClassContent } from '@entities/soldier/model/classes';
import type { SoldierRankContent } from '@entities/soldier/model/ranks';
import { ABILITY_CODE_BITS, CLASS_CODE_BITS } from '@features/share-build/config/constants';
import { typedEntries } from '@shared/lib/object';

/**
 * Schema of a share code number: an integer from 1 to the maximum that fits the field.
 *
 * @param codeBits width of the number field in share codes.
 */
const codeSchema = (codeBits: number) => z.int().min(1).max(2 ** codeBits - 1);

const abilityIdSchema = z.string().refine(isAbilityId, { error: 'Unknown ability id' });

const rankIdSchema = z.enum(typedEntries(SOLDIER_RANK_CONTENT).map(([id]) => id));

/**
 * Reports records whose `code` repeats the code of an earlier record.
 *
 * @param records records by id.
 * @param context refinement context that collects issues.
 */
const checkUniqueCodes = (records: Record<string, { code: number }>, context: z.RefinementCtx) => {
  const idByCode = new Map<number, string>();

  Object.entries(records).forEach(([id, record]) => {
    const sameCodeId = idByCode.get(record.code) ?? null;

    if (sameCodeId) {
      context.addIssue({ code: 'custom', message: `Code ${record.code} is already used by "${sameCodeId}"`, path: [id, 'code'] });
    }

    idByCode.set(record.code, id);
  });
};

/**
 * Known ability ids granted by the ability.
 *
 * @param abilities ability records by id.
 * @param abilityId ability id.
 */
const grantedAbilityIds = (abilities: Record<string, AbilityContent>, abilityId: string) => {
  if (!Object.hasOwn(abilities, abilityId)) return [];

  return (abilities[abilityId].grants ?? []).filter(grantedId => Object.hasOwn(abilities, grantedId));
};

/**
 * Grant chain that leads from the first ability of the path back to it, or null if there is none.
 *
 * @param abilities ability records by id.
 * @param path grant chain being explored, starting with the checked ability; restored after the call.
 */
const grantCycle = (abilities: Record<string, AbilityContent>, path: string[]): string[] | null => {
  for (const grantedId of grantedAbilityIds(abilities, path[path.length - 1])) {
    if (grantedId === path[0]) return [...path, grantedId];

    if (path.includes(grantedId)) continue;

    path.push(grantedId);

    const cycle = grantCycle(abilities, path);

    path.pop();

    if (cycle) return cycle;
  }

  return null;
};

/**
 * Reports grant cycles, each once: from its alphabetically first ability.
 *
 * @param abilities ability records by id.
 * @param context refinement context that collects issues.
 */
const checkGrantCycles = (abilities: Record<string, AbilityContent>, context: z.RefinementCtx) => {
  Object.keys(abilities).forEach((id) => {
    const cycle = grantCycle(abilities, [id]);

    if (!cycle || cycle.some(cycleId => cycleId < id)) return;

    context.addIssue({ code: 'custom', message: `Grants form a cycle ${cycle.join(' → ')}`, path: [id, 'grants'] });
  });
};

/**
 * Reports a class id or class code that repeats across the biosoldier and MEC class lists; the path names the list.
 *
 * @param content soldier content with both class lists.
 * @param content.biosoldierClasses biosoldier class records by id.
 * @param content.mecClasses MEC class records by id.
 * @param context refinement context that collects issues.
 */
const checkSoldierClassLists = (
  content: { biosoldierClasses: Record<string, { code: number }>, mecClasses: Record<string, { code: number }> },
  context: z.RefinementCtx,
) => {
  const pathById = new Map<string, string>();
  const pathByCode = new Map<number, string>();

  (['biosoldierClasses', 'mecClasses'] as const).forEach((listKey) => {
    Object.entries(content[listKey]).forEach(([id, record]) => {
      const path = `${listKey}.${id}`;
      const sameIdPath = pathById.get(id) ?? null;
      const sameCodePath = pathByCode.get(record.code) ?? null;

      if (sameIdPath) context.addIssue({ code: 'custom', message: `Class id is already used by "${sameIdPath}"`, path: [listKey, id] });

      if (sameCodePath) context.addIssue({ code: 'custom', message: `Code ${record.code} is already used by "${sameCodePath}"`, path: [listKey, id, 'code'] });

      pathById.set(id, path);
      pathByCode.set(record.code, path);
    });
  });
};

/**
 * Reports a gene mod offered in more than one body part.
 *
 * @param bodyParts body part records by id.
 * @param context refinement context that collects issues.
 */
const checkUniqueGeneMods = (bodyParts: Record<string, BodyPartContent>, context: z.RefinementCtx) => {
  const bodyPartByGeneMod = new Map<string, string>();

  Object.entries(bodyParts).forEach(([id, bodyPart]) => {
    bodyPart.geneMods.forEach((geneModId) => {
      const sameGeneModPart = bodyPartByGeneMod.get(geneModId) ?? null;

      if (sameGeneModPart) {
        context.addIssue({ code: 'custom', message: `Gene mod "${geneModId}" is already offered in "${sameGeneModPart}"`, path: [id, 'geneMods'] });
      }

      bodyPartByGeneMod.set(geneModId, id);
    });
  });
};

/**
 * Reports a Neural Damping id that is not a Brain gene mod: the rule against psionic abilities relies on it.
 *
 * @param bodyParts body part records by id.
 * @param context refinement context that collects issues.
 */
const checkNeuralDamping = (bodyParts: Record<string, BodyPartContent>, context: z.RefinementCtx) => {
  if (bodyParts.brain?.geneMods.includes(NEURAL_DAMPING_ID)) return;

  context.addIssue({ code: 'custom', message: `"${NEURAL_DAMPING_ID}" is not a Brain gene mod`, path: ['brain', 'geneMods'] });
};

const abilityContentSchema: z.ZodType<AbilityContent> = z.strictObject({
  code: codeSchema(ABILITY_CODE_BITS),
  name: z.string().min(1),
  description: z.string().min(1),
  grants: z.array(abilityIdSchema).optional(),
});

const soldierClassContentSchema: z.ZodType<SoldierClassContent> = z.strictObject({
  code: codeSchema(CLASS_CODE_BITS),
  name: z.string().min(1),
  perks: z.record(rankIdSchema, z.array(abilityIdSchema).min(1)),
});

const soldierRankContentSchema: z.ZodType<SoldierRankContent> = z.strictObject({
  name: z.string().min(1),
});

const bodyPartContentSchema: z.ZodType<BodyPartContent> = z.strictObject({
  name: z.string().min(1),
  geneMods: z.tuple([abilityIdSchema, abilityIdSchema]),
});

/**
 * Schema of all soldier content JSON: record shapes, code ranges, ability codes and class codes unique across both class lists,
 * ability references and grant cycles; five body parts with two gene mods each, every gene mod in one body part,
 * and Neural Damping in Brain.
 */
export const soldierContentSchema = z.strictObject({
  abilities: z.record(z.string(), abilityContentSchema).superRefine(checkUniqueCodes).superRefine(checkGrantCycles),
  biosoldierClasses: z.record(z.string(), soldierClassContentSchema),
  mecClasses: z.record(z.string(), soldierClassContentSchema),
  ranks: z.record(z.string(), soldierRankContentSchema),
  bodyParts: z.record(z.string(), bodyPartContentSchema)
    .refine(bodyParts => Object.keys(bodyParts).length === 5, { error: 'Expected five body parts' })
    .superRefine(checkUniqueGeneMods)
    .superRefine(checkNeuralDamping),
}).superRefine(checkSoldierClassLists);
