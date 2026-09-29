import { z } from 'zod';

import { SOLDIER_RANK_CONTENT } from '@entities/soldier/config/constants/soldier-rank-content';
import type { AbilityContent } from '@entities/soldier/model/abilities';
import { isAbilityId } from '@entities/soldier/model/abilities';
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

const abilityContentSchema: z.ZodType<AbilityContent> = z.strictObject({
  code: codeSchema(ABILITY_CODE_BITS),
  name: z.string().min(1),
  description: z.string().min(1),
  grants: z.array(abilityIdSchema).optional(),
});

const soldierClassContentSchema: z.ZodType<SoldierClassContent> = z.strictObject({
  code: codeSchema(CLASS_CODE_BITS),
  name: z.string().min(1),
  abilities: z.record(rankIdSchema, z.array(abilityIdSchema).min(1)),
});

const soldierRankContentSchema: z.ZodType<SoldierRankContent> = z.strictObject({
  name: z.string().min(1),
});

/**
 * Schema of all soldier content JSON: record shapes, code ranges and uniqueness, ability references and grant cycles.
 */
export const soldierContentSchema = z.strictObject({
  abilities: z.record(z.string(), abilityContentSchema).superRefine(checkUniqueCodes).superRefine(checkGrantCycles),
  classes: z.record(z.string(), soldierClassContentSchema).superRefine(checkUniqueCodes),
  ranks: z.record(z.string(), soldierRankContentSchema),
});
