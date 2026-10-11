import { z } from 'zod';

import { SHIV_PERK_ICON } from '@entities/shiv/config/constants/perk-icons';
import type { ShivPerkContent } from '@entities/shiv/model/perks';
import { isShivPerkId } from '@entities/shiv/model/perks';
import type { TechnologyLevelContent } from '@entities/shiv/model/technology-levels';
import { SHIV_PERK_CODE_BITS } from '@features/share-build/config/constants';

/** Technology levels of the SHIV tree in the game. */
const LEVEL_COUNT = 5;

/** Perks offered on each technology level in the game. */
const PERKS_PER_LEVEL = 3;

const perkIdSchema = z.string().refine(isShivPerkId, { error: 'Unknown SHIV perk id' });

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
 * Reports perks that sit on more than one technology level: share codes place each perk on its only level.
 *
 * @param levels technology level records by id.
 * @param context refinement context that collects issues.
 */
const checkPerksOnOneLevel = (levels: Record<string, TechnologyLevelContent>, context: z.RefinementCtx) => {
  const levelByPerk = new Map<string, string>();

  Object.entries(levels).forEach(([levelId, level]) => {
    level.perks.forEach((perkId) => {
      const otherLevelId = levelByPerk.get(perkId) ?? null;

      if (otherLevelId) {
        context.addIssue({ code: 'custom', message: `Perk "${perkId}" is already on level "${otherLevelId}"`, path: [levelId, 'perks'] });
      }

      levelByPerk.set(perkId, levelId);
    });
  });
};

/**
 * Reports perks without an icon entry or with a blank variant: every perk needs the original and both tinted ones.
 *
 * @param perks perk records by id.
 * @param context refinement context that collects issues.
 */
const checkPerkIcons = (perks: Record<string, ShivPerkContent>, context: z.RefinementCtx) => {
  Object.keys(perks).forEach((perkId) => {
    const icon = isShivPerkId(perkId) && Object.hasOwn(SHIV_PERK_ICON, perkId) ? SHIV_PERK_ICON[perkId] : null;
    const hasAllVariants = icon !== null && [icon.original, icon.available, icon.disabled].every(variant => variant !== '');

    if (hasAllVariants) return;

    context.addIssue({ code: 'custom', message: `Perk "${perkId}" lacks icon variants`, path: [perkId] });
  });
};

const perkContentSchema: z.ZodType<ShivPerkContent> = z.strictObject({
  code: z.int().min(1).max(2 ** SHIV_PERK_CODE_BITS - 1),
  name: z.string().min(1),
  description: z.string().min(1),
});

const levelContentSchema: z.ZodType<TechnologyLevelContent> = z.strictObject({
  name: z.string().min(1),
  perks: z.array(perkIdSchema).length(PERKS_PER_LEVEL),
});

/**
 * Schema of all SHIV content JSON: record shapes, code ranges and uniqueness, icons, five levels of three known perks,
 * each perk on one level only.
 */
export const shivContentSchema = z.strictObject({
  perks: z.record(z.string(), perkContentSchema).superRefine(checkUniqueCodes).superRefine(checkPerkIcons),
  levels: z.record(z.string(), levelContentSchema)
    .refine(levels => Object.keys(levels).length === LEVEL_COUNT, { error: `The SHIV tree has ${LEVEL_COUNT} levels` })
    .superRefine(checkPerksOnOneLevel),
});
