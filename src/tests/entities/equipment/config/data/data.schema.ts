import { z } from 'zod';

import type { ArmorContent } from '@entities/equipment/model/armors';
import type { EquipmentAbilityContent } from '@entities/equipment/model/equipment-abilities';
import { isEquipmentAbilityId } from '@entities/equipment/model/equipment-abilities';
import type { EquipmentUnitContent } from '@entities/equipment/model/equipment-units';
import { isEquipmentUnitId } from '@entities/equipment/model/equipment-units';
import type { WeaponContent } from '@entities/equipment/model/weapons';
import { SOLDIER_CLASS_CONTENT } from '@entities/soldier/config/constants/soldier-class-content';
import { typedEntries } from '@shared/lib/object';

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
 * Reports weapons limited to soldier classes although their unit type has no classes.
 *
 * @param records weapon records by id.
 * @param context refinement context that collects issues.
 */
const checkClassUnits = (records: Record<string, WeaponContent>, context: z.RefinementCtx) => {
  Object.entries(records).forEach(([id, record]) => {
    if (!record.classes || record.unit === 'biosoldier') return;

    context.addIssue({ code: 'custom', message: `Unit "${record.unit}" has no soldier classes`, path: [id, 'classes'] });
  });
};

const unitIdSchema = z.string().refine(isEquipmentUnitId, { error: 'Unknown unit id' });

const abilityIdSchema = z.string().refine(isEquipmentAbilityId, { error: 'Unknown equipment ability id' });

const soldierClassIdSchema = z.enum(typedEntries(SOLDIER_CLASS_CONTENT).map(([id]) => id));

const equipmentAbilityContentSchema: z.ZodType<EquipmentAbilityContent> = z.strictObject({
  name: z.string().min(1),
  description: z.string().min(1),
});

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
  grants: z.array(abilityIdSchema).min(1).optional(),
});

const weaponContentSchema: z.ZodType<WeaponContent> = z.strictObject({
  code: z.int().min(1),
  unit: unitIdSchema,
  name: z.string().min(1),
  tier: z.enum(['ballistic', 'laser', 'arc', 'gauss', 'pulse', 'plasma']),
  type: z.enum([
    'assault-rifle',
    'battle-rifle',
    'carbine',
    'smg',
    'shotgun',
    'saw',
    'lmg',
    'strike-rifle',
    'sniper-rifle',
    'mec-weapon',
    'autocannon',
    'vulcan-cannon',
    'arc-rifle',
    'stun-rifle',
    'pistol',
    'autopistol',
    'arc-pistol',
    'sawed-off-shotgun',
    'rocket-launcher',
  ]),
  slot: z.enum(['primary', 'secondary']),
  classes: z.array(soldierClassIdSchema).min(1).refine(ids => new Set(ids).size === ids.length, { error: 'Repeated class id' }).optional(),
  damage: z.int().min(0),
  penetration: z.int().min(0),
  crit: z.int(),
  aim: z.int(),
  ammo: z.int().min(1),
  mobility: z.number(),
  range: z.int().min(1),
  smallSlots: z.int().max(0),
  ammoUpgrade: z.int().min(1).optional(),
  damageUpgrade: z.int().min(1).optional(),
  critDamage: z.int().min(1).optional(),
  environmentDamage: z.int().min(1).optional(),
  radius: z.number().positive().optional(),
  canCrit: z.literal(false).optional(),
  vsMechanical: z.strictObject({
    damage: z.int().min(0),
    penetration: z.int().min(0),
    aim: z.int().min(0),
  }).optional(),
  info: z.string().min(1),
  grants: z.array(abilityIdSchema).min(1).optional(),
});

/**
 * Schema of all equipment content JSON: record shapes, unit, ability and class references, categories, code ranges and uniqueness.
 */
export const equipmentContentSchema = z.strictObject({
  units: z.record(z.string(), equipmentUnitContentSchema).superRefine(checkUniqueCodes),
  abilities: z.record(z.string(), equipmentAbilityContentSchema),
  armors: z.record(z.string(), armorContentSchema).superRefine(checkUniqueCodes),
  weapons: z.record(z.string(), weaponContentSchema).superRefine(checkUniqueCodes).superRefine(checkClassUnits),
});
