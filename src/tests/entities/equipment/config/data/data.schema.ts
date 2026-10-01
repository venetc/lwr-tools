import { z } from 'zod';

import type { ArmorContent } from '@entities/equipment/model/armors';
import type { EquipmentUnitContent } from '@entities/equipment/model/equipment-units';
import { isEquipmentUnitId } from '@entities/equipment/model/equipment-units';

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

const unitIdSchema = z.string().refine(isEquipmentUnitId, { error: 'Unknown unit id' });

const equipmentUnitContentSchema: z.ZodType<EquipmentUnitContent> = z.strictObject({
  code: z.int().min(1),
  name: z.string().min(1),
});

const armorContentSchema: z.ZodType<ArmorContent> = z.strictObject({
  code: z.int().min(1),
  unit: unitIdSchema,
  name: z.string().min(1),
  category: z.enum(['light', 'heavy']),
  hp: z.int().min(0),
  damageReduction: z.int().min(0).max(100),
  defense: z.int().min(0),
  mobility: z.number(),
  will: z.int().min(0),
  critResist: z.int().min(0),
  fullHpAim: z.int().min(0),
  smallSlots: z.int().min(0),
  largeSlots: z.int().min(0),
  fuel: z.int().min(0),
  info: z.string().min(1),
});

/**
 * Schema of all equipment content JSON: record shapes, unit references and categories, code ranges and uniqueness.
 */
export const equipmentContentSchema = z.strictObject({
  units: z.record(z.string(), equipmentUnitContentSchema).superRefine(checkUniqueCodes),
  armors: z.record(z.string(), armorContentSchema).superRefine(checkUniqueCodes),
});
