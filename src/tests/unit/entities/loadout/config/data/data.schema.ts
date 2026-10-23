import { z } from 'zod';

import type { ArmorContent } from '@entities/loadout/model/armors';
import type { EquipmentContent } from '@entities/loadout/model/equipment';
import type { LoadoutAbilityContent } from '@entities/loadout/model/loadout-abilities';
import { isLoadoutAbilityId } from '@entities/loadout/model/loadout-abilities';
import type { LoadoutUnitContent } from '@entities/loadout/model/loadout-units';
import { isLoadoutUnitId } from '@entities/loadout/model/loadout-units';
import type { ShivTypeContent } from '@entities/loadout/model/shiv-types';
import type { WeaponContent } from '@entities/loadout/model/weapons';
import { BIOSOLDIER_CLASS_CONTENT } from '@entities/soldier/config/constants/biosoldier-class-content';
import { typedEntries } from '@shared/lib/object';

/**
 * Reports records whose `code` is not greater than the code of the record before: catalogs are sorted by code, so codes are unique.
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
 * Reports weapons limited to biosoldier classes although their unit type has no classes.
 *
 * @param records weapon records by id.
 * @param context refinement context that collects issues.
 */
const checkClassUnits = (records: Record<string, WeaponContent>, context: z.RefinementCtx) => {
  Object.entries(records).forEach(([id, record]) => {
    if (!record.classes || record.unit === 'biosoldier') return;

    context.addIssue({ code: 'custom', message: `Unit "${record.unit}" has no biosoldier classes`, path: [id, 'classes'] });
  });
};

/**
 * Reports biosoldier secondary weapons whose classes break the slot rules: a Gunner has no secondary weapon,
 * a Rocketeer carries only a rocket launcher there, so every such weapon lists its classes.
 *
 * @param records weapon records by id.
 * @param context refinement context that collects issues.
 */
const checkSecondaryClasses = (records: Record<string, WeaponContent>, context: z.RefinementCtx) => {
  Object.entries(records).forEach(([id, record]) => {
    if (record.unit !== 'biosoldier' || record.slot !== 'secondary') return;

    const classes = record.classes ?? [];
    const isRocketLauncher = record.type === 'rocket-launcher';

    if (classes.length === 0) {
      context.addIssue({ code: 'custom', message: 'A biosoldier secondary weapon must list its classes', path: [id, 'classes'] });
    }

    if (classes.includes('gunner')) {
      context.addIssue({ code: 'custom', message: 'A Gunner has no secondary weapon', path: [id, 'classes'] });
    }

    if (classes.includes('rocketeer') !== isRocketLauncher) {
      context.addIssue({ code: 'custom', message: 'A Rocketeer carries only a rocket launcher as a secondary weapon', path: [id, 'classes'] });
    }
  });
};

/**
 * Reports equipment limited to biosoldier classes although it is not made for biosoldiers alone.
 *
 * @param records equipment records by id.
 * @param context refinement context that collects issues.
 */
const checkEquipmentClassUnits = (records: Record<string, EquipmentContent>, context: z.RefinementCtx) => {
  Object.entries(records).forEach(([id, record]) => {
    if (!record.classes || (record.units.length === 1 && record.units[0] === 'biosoldier')) return;

    context.addIssue({ code: 'custom', message: 'Only biosoldier equipment may list classes', path: [id, 'classes'] });
  });
};

/**
 * Reports Modules made for any unit but a MEC, and equipment whose required Module is not a Module of the catalog
 * or that a unit without Module slots may carry.
 *
 * @param records equipment records by id.
 * @param context refinement context that collects issues.
 */
const checkModules = (records: Record<string, EquipmentContent>, context: z.RefinementCtx) => {
  Object.entries(records).forEach(([id, record]) => {
    if (record.slot === 'module' && (record.units.length !== 1 || record.units[0] !== 'mec')) {
      context.addIssue({ code: 'custom', message: 'A Module is MEC equipment only', path: [id, 'units'] });
    }

    if (!record.requiredModule) return;

    if (records[record.requiredModule]?.slot !== 'module') {
      context.addIssue({ code: 'custom', message: `Required Module "${record.requiredModule}" is not a Module`, path: [id, 'requiredModule'] });
    }

    if (record.units.length !== 1 || record.units[0] !== 'mec') {
      context.addIssue({ code: 'custom', message: 'Only MEC equipment may require a Module', path: [id, 'units'] });
    }
  });
};

/**
 * Gear Slots and Psi Slots that each slot ability of armor stands for.
 */
const slotsByGrant = new Map([
  ['gear-slot', { gear: 1, psi: 0 }],
  ['psi-slot', { gear: 0, psi: 1 }],
]);

/**
 * Reports armor that breaks the rules of its unit: biosoldier armor is light or heavy and has no Module slots;
 * a MEC exoskeleton has Module slots and no Gear Slots, Psi Slots or requirements.
 *
 * @param records armor records by id.
 * @param context refinement context that collects issues.
 */
const checkUnitArmor = (records: Record<string, ArmorContent>, context: z.RefinementCtx) => {
  Object.entries(records).forEach(([id, record]) => {
    if (record.unit === 'biosoldier' && record.moduleSlots !== 0) {
      context.addIssue({ code: 'custom', message: 'Biosoldier armor must have 0 Module slots', path: [id, 'moduleSlots'] });
    }

    if (record.unit === 'biosoldier' && record.category !== 'light' && record.category !== 'heavy') {
      context.addIssue({ code: 'custom', message: 'Biosoldier armor must be light or heavy', path: [id, 'category'] });
    }

    if (record.unit !== 'mec') return;

    if (record.moduleSlots === 0) {
      context.addIssue({ code: 'custom', message: 'A MEC exoskeleton must have Module slots', path: [id, 'moduleSlots'] });
    }

    if (record.gearSlots + record.psiSlots > 0 || record.requires) {
      context.addIssue({ code: 'custom', message: 'A MEC exoskeleton has no Gear Slots, Psi Slots or requirements', path: [id] });
    }
  });
};

/**
 * Reports armor whose Gear Slots and Psi Slots do not fit in its utility slots or differ from its slot abilities.
 *
 * @param records armor records by id.
 * @param context refinement context that collects issues.
 */
const checkGearAndPsiSlots = (records: Record<string, ArmorContent>, context: z.RefinementCtx) => {
  Object.entries(records).forEach(([id, record]) => {
    const granted = (record.grants ?? []).reduce((slots, abilityId) => {
      const abilitySlots = slotsByGrant.get(abilityId) ?? null;

      if (!abilitySlots) return slots;

      slots.gear += abilitySlots.gear;
      slots.psi += abilitySlots.psi;

      return slots;
    }, { gear: 0, psi: 0 });

    if (record.gearSlots + record.psiSlots > record.utilitySlots) {
      context.addIssue({ code: 'custom', message: 'Gear Slots and Psi Slots must fit in the utility slots', path: [id, 'gearSlots'] });
    }

    if (record.gearSlots !== granted.gear || record.psiSlots !== granted.psi) {
      context.addIssue({ code: 'custom', message: 'Gear Slots and Psi Slots must match the slot abilities in grants', path: [id, 'grants'] });
    }
  });
};

/**
 * Schema of a non-empty list without repeated items.
 *
 * @param item schema of one item.
 */
const uniqueListSchema = <Item extends z.ZodType<string>>(item: Item) => z.array(item).min(1).refine(items => new Set(items).size === items.length, { error: 'Repeated item' });

const unitIdSchema = z.string().refine(isLoadoutUnitId, { error: 'Unknown unit id' });

const abilityIdSchema = z.string().refine(isLoadoutAbilityId, { error: 'Unknown non-perk ability id' });

const biosoldierClassIdSchema = z.enum(typedEntries(BIOSOLDIER_CLASS_CONTENT).map(([id]) => id));

const requirementSchema = z.enum(['psionic', 'gene-mod', 'officer']);

const loadoutAbilityContentSchema: z.ZodType<LoadoutAbilityContent> = z.strictObject({
  name: z.string().min(1),
  description: z.string().min(1),
});

const loadoutUnitContentSchema: z.ZodType<LoadoutUnitContent> = z.strictObject({
  code: z.int().min(1),
  name: z.string().min(1),
});

const armorContentSchema: z.ZodType<ArmorContent> = z.strictObject({
  code: z.int().min(1),
  unit: unitIdSchema,
  name: z.string().min(1),
  category: z.enum(['light', 'heavy', 'ultra-light', 'ultra-heavy', 'standard']),
  hp: z.int().min(0),
  damageReduction: z.int().min(0).max(100),
  defense: z.int().min(0),
  mobility: z.number(),
  will: z.int().min(0),
  critResist: z.int().min(0),
  fullHpAim: z.int().min(0),
  utilitySlots: z.int().min(0),
  moduleSlots: z.int().min(0),
  gearSlots: z.int().min(0),
  psiSlots: z.int().min(0),
  fuel: z.int().min(0),
  requires: requirementSchema.optional(),
  info: z.string().min(1),
  grants: uniqueListSchema(abilityIdSchema).optional(),
});

const shivTypeContentSchema: z.ZodType<ShivTypeContent> = z.strictObject({
  code: z.int().min(1),
  name: z.string().min(1),
  hp: z.int().min(1),
  damageReduction: z.int().min(0).max(100),
  critResist: z.int().min(0),
  defense: z.int().min(0),
  mobility: z.number().positive(),
  aim: z.int().min(0),
  utilitySlots: z.int().min(0),
  fuel: z.int().min(0),
  info: z.string().min(1),
  grants: uniqueListSchema(abilityIdSchema).optional(),
});

const weaponTierSchema = z.enum(['ballistic', 'laser', 'arc', 'gauss', 'pulse', 'plasma']);

const primaryWeaponTypeSchema = z.enum([
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
]);

const equipmentContentSchema: z.ZodType<EquipmentContent> = z.strictObject({
  code: z.int().min(1),
  units: uniqueListSchema(unitIdSchema),
  slot: z.enum(['utility', 'module']),
  name: z.string().min(1),
  classes: uniqueListSchema(biosoldierClassIdSchema).optional(),
  requires: requirementSchema.optional(),
  isPassive: z.literal(true).optional(),
  stackGroup: z.enum(['plating', 'scope', 'ammo-capacity', 'ammo-type', 'launcher', 'alien-grenade', 'disorient-grenade']).optional(),
  primaryTiers: uniqueListSchema(weaponTierSchema).optional(),
  primaryTypes: uniqueListSchema(primaryWeaponTypeSchema).optional(),
  requiredModule: z.string().min(1).optional(),
  stats: z.array(z.strictObject({
    name: z.string().min(1),
    value: z.string(),
  })).min(1),
  info: z.string().min(1).optional(),
  grants: uniqueListSchema(abilityIdSchema).optional(),
});

const weaponContentSchema: z.ZodType<WeaponContent> = z.strictObject({
  code: z.int().min(1),
  unit: unitIdSchema,
  name: z.string().min(1),
  tier: weaponTierSchema,
  type: z.enum([...primaryWeaponTypeSchema.options, 'pistol', 'autopistol', 'arc-pistol', 'sawed-off-shotgun', 'rocket-launcher']),
  slot: z.enum(['primary', 'secondary']),
  classes: z.array(biosoldierClassIdSchema).min(1).refine(ids => new Set(ids).size === ids.length, { error: 'Repeated class id' }).optional(),
  damage: z.int().min(0),
  penetration: z.int().min(0),
  crit: z.int(),
  aim: z.int(),
  ammo: z.int().min(1),
  mobility: z.number(),
  range: z.int().min(1),
  utilitySlots: z.int().max(0),
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
  grants: uniqueListSchema(abilityIdSchema).optional(),
});

/**
 * Schema of all Loadout content JSON: record shapes, unit, ability, class and Module references, categories, slots, code ranges, uniqueness and order.
 */
export const loadoutContentSchema = z.strictObject({
  units: z.record(z.string(), loadoutUnitContentSchema).superRefine(checkOrderedCodes),
  abilities: z.record(z.string(), loadoutAbilityContentSchema),
  armors: z.record(z.string(), armorContentSchema).superRefine(checkOrderedCodes).superRefine(checkUnitArmor).superRefine(checkGearAndPsiSlots),
  shivTypes: z.record(z.string(), shivTypeContentSchema).superRefine(checkOrderedCodes),
  weapons: z.record(z.string(), weaponContentSchema).superRefine(checkOrderedCodes).superRefine(checkClassUnits).superRefine(checkSecondaryClasses),
  equipment: z.record(z.string(), equipmentContentSchema).superRefine(checkOrderedCodes).superRefine(checkEquipmentClassUnits).superRefine(checkModules),
});
