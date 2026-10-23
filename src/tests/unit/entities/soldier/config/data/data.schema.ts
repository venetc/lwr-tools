import { z } from 'zod';

import { NEURAL_DAMPING_ID } from '@entities/soldier/config/constants/body-parts';
import { SOLDIER_RANK_CONTENT } from '@entities/soldier/config/constants/soldier-rank-content';
import type { AbilityContent } from '@entities/soldier/model/abilities';
import { isAbilityId } from '@entities/soldier/model/abilities';
import type { BodyPartContent } from '@entities/soldier/model/body-parts';
import type { SoldierClassContent } from '@entities/soldier/model/classes';
import type { OfficerRankContent } from '@entities/soldier/model/officer-ranks';
import type { PsiLevelContent } from '@entities/soldier/model/psi-levels';
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

const rankIds = typedEntries(SOLDIER_RANK_CONTENT).map(([id]) => id);

const rankIdSchema = z.enum(rankIds);

/**
 * Reports records whose `code` is not greater than the code of the record before: abilities are sorted by code,
 * so codes are unique.
 *
 * @param records records by id.
 * @param context refinement context that collects issues.
 */
const checkOrderedCodes = (records: Record<string, { code: number }>, context: z.RefinementCtx) => {
  Object.entries(records).reduce((previousCode, [id, record]) => {
    if (record.code <= previousCode) {
      context.addIssue({ code: 'custom', message: `Code ${record.code} must be greater than the previous code ${previousCode}`, path: [id, 'code'] });
    }

    return record.code;
  }, 0);
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
 * Abilities of a branch together with everything they grant, directly or through a chain of grants.
 *
 * @description `Set.prototype.forEach` also visits ids added during the iteration, so granted abilities are expanded
 * in turn.
 *
 * @param abilities ability records by id.
 * @param abilityIds ability ids offered in the branch.
 */
const branchAbilityIds = (abilities: Record<string, AbilityContent>, abilityIds: readonly string[]) => {
  const ids = new Set(abilityIds);

  ids.forEach(abilityId => grantedAbilityIds(abilities, abilityId).forEach(grantedId => ids.add(grantedId)));

  return ids;
};

/**
 * Reports an ability that belongs to more than one kind of branch: class trees (perks of every class and their grants),
 * gene mods or psionic abilities. An ability may repeat only within one kind, such as a perk shared by two classes.
 *
 * @param content soldier content with the abilities and every branch.
 * @param content.abilities ability records by id.
 * @param content.biosoldierClasses biosoldier class records by id.
 * @param content.mecClasses MEC class records by id.
 * @param content.bodyParts body part records by id.
 * @param content.psiLevels psi level records by id.
 * @param context refinement context that collects issues.
 */
const checkBranchKinds = (
  content: {
    abilities: Record<string, AbilityContent>
    biosoldierClasses: Record<string, SoldierClassContent>
    mecClasses: Record<string, SoldierClassContent>
    bodyParts: Record<string, BodyPartContent>
    psiLevels: Record<string, PsiLevelContent>
  },
  context: z.RefinementCtx,
) => {
  const classes = [...Object.values(content.biosoldierClasses), ...Object.values(content.mecClasses)];
  const offeredIdsByKind = {
    'class trees': classes.flatMap(soldierClass => Object.values(soldierClass.perks).flat()),
    'gene mods': Object.values(content.bodyParts).flatMap(bodyPart => bodyPart.geneMods),
    'psionic abilities': Object.values(content.psiLevels).flatMap(psiLevel => psiLevel.abilities),
  };
  const kindByAbility = new Map<string, string>();

  Object.entries(offeredIdsByKind).forEach(([kind, offeredIds]) => {
    branchAbilityIds(content.abilities, offeredIds).forEach((abilityId) => {
      const otherKind = kindByAbility.get(abilityId) ?? null;

      if (otherKind) context.addIssue({ code: 'custom', message: `Ability "${abilityId}" is in both ${otherKind} and ${kind}`, path: ['abilities', abilityId] });

      kindByAbility.set(abilityId, kind);
    });
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
 * Reports a psionic ability offered on more than one psi level.
 *
 * @param psiLevels psi level records by id.
 * @param context refinement context that collects issues.
 */
const checkUniquePsionicAbilities = (psiLevels: Record<string, PsiLevelContent>, context: z.RefinementCtx) => {
  const psiLevelByAbility = new Map<string, string>();

  Object.entries(psiLevels).forEach(([id, psiLevel]) => {
    psiLevel.abilities.forEach((abilityId) => {
      const sameAbilityLevel = psiLevelByAbility.get(abilityId) ?? null;

      if (sameAbilityLevel) {
        context.addIssue({ code: 'custom', message: `Psionic ability "${abilityId}" is already offered on "${sameAbilityLevel}"`, path: [id, 'abilities'] });
      }

      psiLevelByAbility.set(abilityId, id);
    });
  });
};

/**
 * Reports required ranks that do not rise strictly from one officer rank to the next.
 *
 * @param officerRanks officer rank records by id.
 * @param context refinement context that collects issues.
 */
const checkRequiredRankOrder = (officerRanks: Record<string, OfficerRankContent>, context: z.RefinementCtx) => {
  Object.entries(officerRanks).reduce((previousRankIndex, [id, officerRank]) => {
    const rankIndex = rankIds.findIndex(rankId => rankId === officerRank.requiredRank);

    if (rankIndex <= previousRankIndex) {
      context.addIssue({ code: 'custom', message: `Required rank "${officerRank.requiredRank}" must be higher than the previous one`, path: [id, 'requiredRank'] });
    }

    return rankIndex;
  }, -1);
};

/**
 * Reports an officer perk offered twice in the officer tree, on one officer rank or on two.
 *
 * @param officerRanks officer rank records by id.
 * @param context refinement context that collects issues.
 */
const checkUniqueOfficerPerks = (officerRanks: Record<string, OfficerRankContent>, context: z.RefinementCtx) => {
  const officerRankByPerk = new Map<string, string>();

  Object.entries(officerRanks).forEach(([id, officerRank]) => {
    officerRank.perks.forEach((perkId) => {
      const samePerkRank = officerRankByPerk.get(perkId) ?? null;

      if (samePerkRank) {
        context.addIssue({ code: 'custom', message: `Officer perk "${perkId}" is already offered on "${samePerkRank}"`, path: [id, 'perks'] });
      }

      officerRankByPerk.set(perkId, id);
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
  geneMods: z.array(abilityIdSchema).min(1),
});

const psiLevelContentSchema: z.ZodType<PsiLevelContent> = z.strictObject({
  name: z.string().min(1),
  abilities: z.array(abilityIdSchema).min(1),
});

const officerRankContentSchema: z.ZodType<OfficerRankContent> = z.strictObject({
  name: z.string().min(1),
  abbreviation: z.string().min(1),
  requiredRank: rankIdSchema,
  perks: z.array(abilityIdSchema).min(1),
});

/**
 * Schema of all soldier content JSON: record shapes, code ranges, ability codes in ascending order, class codes unique across both class lists,
 * ability references and grant cycles; every gene mod in one body part, and Neural Damping in Brain; every psionic
 * ability on one psi level; strictly rising required ranks of officer ranks, every officer perk on one officer rank;
 * no ability, granted ones included, in two kinds of branches. Steps and the number of variants on each step are
 * checked by the data test.
 */
export const soldierContentSchema = z.strictObject({
  abilities: z.record(z.string(), abilityContentSchema).superRefine(checkOrderedCodes).superRefine(checkGrantCycles),
  biosoldierClasses: z.record(z.string(), soldierClassContentSchema),
  mecClasses: z.record(z.string(), soldierClassContentSchema),
  ranks: z.record(z.string(), soldierRankContentSchema),
  bodyParts: z.record(z.string(), bodyPartContentSchema)
    .superRefine(checkUniqueGeneMods)
    .superRefine(checkNeuralDamping),
  psiLevels: z.record(z.string(), psiLevelContentSchema).superRefine(checkUniquePsionicAbilities),
  officerRanks: z.record(z.string(), officerRankContentSchema)
    .superRefine(checkRequiredRankOrder)
    .superRefine(checkUniqueOfficerPerks),
}).superRefine(checkSoldierClassLists).superRefine(checkBranchKinds);
