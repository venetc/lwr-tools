import type {
  Armor,
  Equipment,
  EquipmentStat,
  Loadout,
  LoadoutAbility,
  LoadoutBlockReason,
  LoadoutItemId,
  LoadoutSlot,
  LoadoutWearer,
  ShivType,
  UtilitySlotKind,
  Weapon,
} from '@entities/loadout';
import { ARMORS, blockReasons, EQUIPMENT, EQUIPMENT_BY_ID, itemCarriers, SHIV_TYPES, utilitySlotSources, WEAPONS } from '@entities/loadout';
import type { DeepReadonly } from '@shared/lib/object';

import {
  ALTERNATIVE_SEPARATOR,
  ARMOR_CATEGORY_NAME,
  ARMOR_SLOT_CAPTION,
  BLOCK_REASON_LABEL,
  DETAIL_SEPARATOR,
  EQUIPPED_LABEL,
  ITEM_RULE_TEXT,
  LAST_SLOTS_WORDS,
  LIST_SEPARATOR,
  MODULE_SLOT_CAPTION,
  NEEDS_WORD,
  NUMBER_WORDS,
  STAT_NAME,
  UPGRADE_WORD,
  UTILITY_ITEM_TYPE,
  UTILITY_SLOT_CAPTION,
  UTILITY_SLOTS_NAME,
  WEAPON_TIER_NAME,
  WEAPON_TYPE_NAME,
} from '../config/constants';
import type { LoadoutCatalogItem } from './loadout-items';
import { findLoadoutItem } from './loadout-items';

/**
 * Item of the Locker of a slot.
 */
export interface LockerItem {
  /** Item id. */
  id: LoadoutItemId
  /** Item name. */
  name: string
  /** Item image URL. */
  icon: string
  /** Stats of the item in one line. */
  summary: string
  /** Why the item does not fit the slot, in rule order; empty if it fits. */
  reasons: LoadoutBlockReason[]
  /** Label of the first reason; null if the item fits. */
  reasonLabel: string | null
  /** Whether the item is the one in the slot. */
  isEquipped: boolean
  /** Mark shown by the item: the equipped mark or the label of the first reason; null for an item that fits and is not equipped. */
  mark: string | null
  /** Accessible name: the name with the equipped mark or the first reason, such as `Ghost Armor, Needs Gene mod`. */
  label: string
}

/**
 * What the details under the Locker tell about an item.
 */
export interface ItemDetails {
  /** Item id. */
  id: LoadoutItemId
  /** Item name. */
  name: string
  /** Item image URL. */
  icon: string
  /** Item type, such as `Light Armor` or `Assault Rifle · Laser`. */
  type: string
  /** Stat line. */
  stats: EquipmentStat[]
  /** Who may carry the item, as the game words it: `Biosoldier except Sniper/Gunner`. */
  carriers: string
  /** Tactical info text; null if the game gives none. */
  info: string | null
  /** Non-perk abilities the item grants. */
  grants: DeepReadonly<LoadoutAbility[]>
  /** Rules of the item itself: what it does not stack with, what it needs, which utility slots take it. */
  rules: string[]
  /** Labels of every reason the item does not fit the slot. */
  reasons: string[]
}

/**
 * Item of any catalog with what the Locker and the details show of it.
 */
interface ItemDescription {
  /** Item name. */
  name: string
  /** Item image URL. */
  icon: string
  /** Item type. */
  type: string
  /** Stat line. */
  stats: EquipmentStat[]
  /** Who may carry the item. */
  carriers: string
  /** Tactical info text; null if none. */
  info: string | null
  /** Non-perk abilities the item grants. */
  grants: DeepReadonly<LoadoutAbility[]>
}

/**
 * Number as a bonus: with a plus sign when positive.
 *
 * @param value stat value.
 */
const signed = (value: number) => (value > 0 ? `+${value}` : `${value}`);

/**
 * Stat value with its Foundry upgrade: `4 (+1 upg)`.
 *
 * @param value base value.
 * @param upgrade extra value from a Foundry project; 0 if none.
 */
const upgraded = (value: number, upgrade: number) => (upgrade ? `${value} (${signed(upgrade)} ${UPGRADE_WORD})` : `${value}`);

/**
 * Stats of the line: those always shown and the others unless their value is zero.
 *
 * @param stats stat name, its number, its text, and whether the stat is shown even at zero.
 */
const statLine = (stats: [name: string, value: number, text: string, isAlwaysShown: boolean][]): EquipmentStat[] => (
  stats.filter(([, value, , isAlwaysShown]) => isAlwaysShown || value !== 0).map(([name, , value]) => ({ name, value }))
);

/**
 * Phrase about the last utility slots of a kind: `last two are Gear Slots`, `last one is a Psi Slot`.
 *
 * @param count number of the slots.
 * @param kind Gear Slot or Psi Slot.
 * @returns the phrase; null if there are no such slots.
 */
export const lastSlotsPhrase = (count: number, kind: Exclude<UtilitySlotKind, 'regular'>) => {
  if (!count) return null;

  const caption = UTILITY_SLOT_CAPTION[kind];

  if (count === 1) return `${LAST_SLOTS_WORDS.last} ${NUMBER_WORDS[count]} ${LAST_SLOTS_WORDS.one} ${caption}`;

  return `${LAST_SLOTS_WORDS.last} ${NUMBER_WORDS[count] ?? count} ${LAST_SLOTS_WORDS.many} ${caption}s`;
};

/**
 * Rules of armor: its Gear Slots and Psi Slots, and whether Tactical Rigging adds a slot to it.
 *
 * @param armor armor.
 * @param loadout Loadout of the unit, for the slots its primary weapon takes away.
 */
const armorRules = (armor: DeepReadonly<Armor>, loadout: Loadout) => {
  const sources = utilitySlotSources({ armor: armor.id, primary: loadout.primary });
  const lastSlots = [lastSlotsPhrase(armor.gearSlots, 'gear-slot'), lastSlotsPhrase(armor.psiSlots, 'psi-slot')].filter(phrase => phrase !== null);
  const rules = lastSlots.map(phrase => `${UTILITY_SLOTS_NAME}: ${phrase}.`);

  if (armor.unit === 'biosoldier' && !sources.rigging) rules.push(ITEM_RULE_TEXT.noRigging);

  return rules;
};

/**
 * Description of armor or a MEC exoskeleton.
 *
 * @param armor armor.
 */
const describeArmor = (armor: DeepReadonly<Armor>): ItemDescription => {
  return {
    name: armor.name,
    icon: armor.icon,
    type: `${ARMOR_CATEGORY_NAME[armor.category]} ${ARMOR_SLOT_CAPTION[armor.unit]}`,
    stats: statLine([
      [STAT_NAME.hp, armor.hp, signed(armor.hp), true],
      [STAT_NAME.damageReduction, armor.damageReduction, signed(armor.damageReduction), false],
      [STAT_NAME.defense, armor.defense, signed(armor.defense), false],
      [STAT_NAME.mobility, armor.mobility, signed(armor.mobility), false],
      [STAT_NAME.will, armor.will, signed(armor.will), false],
      [STAT_NAME.critResist, armor.critResist, signed(armor.critResist), false],
      [STAT_NAME.fullHpAim, armor.fullHpAim, signed(armor.fullHpAim), false],
      [STAT_NAME.utilitySlots, armor.utilitySlots, `${armor.utilitySlots}`, true],
      [STAT_NAME.moduleSlots, armor.moduleSlots, `${armor.moduleSlots}`, false],
      [STAT_NAME.fuel, armor.fuel, `${armor.fuel}`, false],
    ]),
    carriers: itemCarriers(armor),
    info: armor.info,
    grants: armor.grants,
  };
};

/**
 * Description of a SHIV type.
 *
 * @param shivType SHIV type.
 */
const describeShivType = (shivType: DeepReadonly<ShivType>): ItemDescription => ({
  name: shivType.name,
  icon: shivType.icon,
  type: ARMOR_SLOT_CAPTION.shiv,
  stats: statLine([
    [STAT_NAME.hp, shivType.hp, `${shivType.hp}`, true],
    [STAT_NAME.damageReduction, shivType.damageReduction, `${shivType.damageReduction}`, false],
    [STAT_NAME.critResist, shivType.critResist, `${shivType.critResist}`, false],
    [STAT_NAME.defense, shivType.defense, `${shivType.defense}`, true],
    [STAT_NAME.mobility, shivType.mobility, `${shivType.mobility}`, true],
    [STAT_NAME.aim, shivType.aim, `${shivType.aim}`, true],
    [STAT_NAME.utilitySlots, shivType.utilitySlots, `${shivType.utilitySlots}`, true],
    [STAT_NAME.fuel, shivType.fuel, `${shivType.fuel}`, false],
  ]),
  carriers: itemCarriers({ unit: 'shiv', classes: null }),
  info: shivType.info,
  grants: shivType.grants,
});

/**
 * Description of a weapon.
 *
 * @param weapon weapon.
 */
const describeWeapon = (weapon: DeepReadonly<Weapon>): ItemDescription => ({
  name: weapon.name,
  icon: weapon.icon,
  type: [WEAPON_TYPE_NAME[weapon.type], WEAPON_TIER_NAME[weapon.tier]].join(DETAIL_SEPARATOR),
  stats: statLine([
    [STAT_NAME.damage, weapon.damage, upgraded(weapon.damage, weapon.damageUpgrade), true],
    [STAT_NAME.penetration, weapon.penetration, `${weapon.penetration}`, false],
    [STAT_NAME.crit, weapon.crit, signed(weapon.crit), false],
    [STAT_NAME.critDamage, weapon.critDamage, `${signed(weapon.critDamage)}%`, false],
    [STAT_NAME.aim, weapon.aim, signed(weapon.aim), false],
    [STAT_NAME.ammo, weapon.ammo, upgraded(weapon.ammo, weapon.ammoUpgrade), true],
    [STAT_NAME.mobility, weapon.mobility, signed(weapon.mobility), false],
    [STAT_NAME.range, weapon.range, `${weapon.range}`, true],
    [STAT_NAME.environmentDamage, weapon.environmentDamage, `${weapon.environmentDamage}`, false],
    [STAT_NAME.radius, weapon.radius, `${weapon.radius}`, false],
  ]),
  carriers: itemCarriers(weapon),
  info: weapon.info,
  grants: weapon.grants,
});

/**
 * Rules of equipment: items it does not stack with, the primary weapons it works with, the Module it needs and the utility
 * slots that take it.
 *
 * @param equipment equipment or Module.
 * @param wearer unit that carries the Loadout; only items of its unit type are named.
 */
const equipmentRules = (equipment: DeepReadonly<Equipment>, wearer: LoadoutWearer) => {
  const rules: string[] = [];
  const stackingItems = EQUIPMENT.filter(item => item.stackGroup !== null && item.stackGroup === equipment.stackGroup && item.id !== equipment.id && item.units.includes(wearer.unit));
  const weaponParts = [
    equipment.primaryTiers?.map(tier => WEAPON_TIER_NAME[tier]).join(ALTERNATIVE_SEPARATOR),
    equipment.primaryTypes?.map(type => WEAPON_TYPE_NAME[type]).join(ALTERNATIVE_SEPARATOR),
  ].filter(part => part !== undefined);
  const requiredModule = equipment.requiredModule ? EQUIPMENT_BY_ID.get(equipment.requiredModule) : null;

  if (stackingItems.length) rules.push(`${ITEM_RULE_TEXT.cantStack} ${stackingItems.map(item => item.name).join(LIST_SEPARATOR)}.`);

  if (weaponParts.length) rules.push(`${ITEM_RULE_TEXT.primaryWeapon} ${weaponParts.join(DETAIL_SEPARATOR)}.`);

  if (requiredModule) rules.push(`${NEEDS_WORD} ${requiredModule.name}.`);

  if (equipment.slot !== 'utility') return rules;

  if (!equipment.isPassive) {
    rules.push(ITEM_RULE_TEXT.notForGearSlots);
    return rules;
  }

  rules.push(equipment.requires === 'psionic' ? ITEM_RULE_TEXT.fitsGearOrPsiSlot : ITEM_RULE_TEXT.fitsGearSlot);

  return rules;
};

/**
 * Type of equipment: a Module, passive gear or another utility item.
 *
 * @param equipment equipment or Module.
 */
const equipmentType = (equipment: DeepReadonly<Equipment>) => {
  if (equipment.slot === 'module') return MODULE_SLOT_CAPTION;

  return equipment.isPassive ? UTILITY_ITEM_TYPE.passive : UTILITY_ITEM_TYPE.active;
};

/**
 * Description of equipment or a Module.
 *
 * @param equipment equipment or Module.
 */
const describeEquipment = (equipment: DeepReadonly<Equipment>): ItemDescription => ({
  name: equipment.name,
  icon: equipment.icon,
  type: equipmentType(equipment),
  stats: equipment.stats.map(stat => ({ name: stat.name, value: stat.value })),
  carriers: itemCarriers(equipment),
  info: equipment.info,
  grants: equipment.grants,
});

/**
 * Description of an item of any catalog.
 *
 * @param found item with its catalog.
 */
const describeItem = (found: LoadoutCatalogItem): ItemDescription => {
  if (found.kind === 'armor') return describeArmor(found.item);

  if (found.kind === 'shiv-type') return describeShivType(found.item);

  if (found.kind === 'weapon') return describeWeapon(found.item);

  return describeEquipment(found.item);
};

/**
 * Rules of an item of any catalog, as its details list them.
 *
 * @param found item with its catalog.
 * @param loadout Loadout of the unit.
 * @param wearer unit that carries the Loadout.
 */
const itemRules = (found: LoadoutCatalogItem, loadout: Loadout, wearer: LoadoutWearer): string[] => {
  if (found.kind === 'armor') return armorRules(found.item, loadout);

  if (found.kind === 'weapon') return found.item.utilitySlots < 0 ? [ITEM_RULE_TEXT.takesUtilitySlot] : [];

  if (found.kind === 'equipment') return equipmentRules(found.item, wearer);

  return [];
};

/**
 * Label of a reason an item does not fit: the Module it needs is named.
 *
 * @param reason reason code.
 * @param id item id.
 */
const blockReasonLabel = (reason: LoadoutBlockReason, id: LoadoutItemId) => {
  const requiredModule = reason === 'needs-module' ? EQUIPMENT_BY_ID.get(id)?.requiredModule : null;
  const moduleName = requiredModule ? EQUIPMENT_BY_ID.get(requiredModule)?.name : null;

  if (moduleName) return `${NEEDS_WORD} ${moduleName}`;

  return BLOCK_REASON_LABEL[reason];
};

/**
 * Id of the item in a slot of the Loadout.
 *
 * @param loadout Loadout of the unit.
 * @param slot slot of the Loadout.
 * @returns the item id; null for an empty slot.
 */
export const slotItemId = (loadout: Readonly<Loadout>, slot: LoadoutSlot): LoadoutItemId | null => {
  if (slot.kind === 'utility') return loadout.utility[slot.index] ?? null;

  if (slot.kind === 'module') return loadout.modules[slot.index] ?? null;

  return loadout[slot.kind];
};

/**
 * Items of the catalog the slot takes from: armor or SHIV types, weapons, or equipment and Modules.
 *
 * @param slot slot of the Loadout.
 * @param wearer unit that carries the Loadout.
 */
const slotCatalog = (slot: LoadoutSlot, wearer: LoadoutWearer): DeepReadonly<{ id: LoadoutItemId }[]> => {
  if (slot.kind === 'armor') return wearer.unit === 'shiv' ? SHIV_TYPES : ARMORS;

  if (slot.kind === 'primary' || slot.kind === 'secondary') return WEAPONS;

  return EQUIPMENT;
};

/**
 * Locker of a slot: items that fit first, then those that do not, each group in catalog order; items of other unit
 * types or slots are left out.
 *
 * @param slot slot of the Loadout.
 * @param loadout Loadout of the unit.
 * @param wearer unit that carries the Loadout.
 */
export const lockerItems = (slot: LoadoutSlot, loadout: Loadout, wearer: LoadoutWearer): LockerItem[] => {
  const equippedId = slotItemId(loadout, slot);

  const items = slotCatalog(slot, wearer).flatMap((item): LockerItem[] => {
    const reasons = blockReasons(item.id, slot, loadout, wearer);
    const found = reasons.includes('wrong-unit') ? null : findLoadoutItem(item.id);

    if (!found) return [];

    const description = describeItem(found);
    const [firstReason] = reasons;
    const reasonLabel = firstReason ? blockReasonLabel(firstReason, item.id) : null;
    const isEquipped = item.id === equippedId;
    const mark = isEquipped ? EQUIPPED_LABEL : reasonLabel;

    return [{
      id: item.id,
      name: description.name,
      icon: description.icon,
      summary: description.stats.map(stat => (stat.value ? `${stat.name} ${stat.value}` : stat.name)).join(DETAIL_SEPARATOR),
      reasons,
      reasonLabel,
      isEquipped,
      mark,
      label: mark ? `${description.name}${LIST_SEPARATOR}${mark}` : description.name,
    }];
  });

  return [...items.filter(item => item.reasons.length === 0), ...items.filter(item => item.reasons.length > 0)];
};

/**
 * Details of an item for a slot of the Loadout.
 *
 * @param id item id.
 * @param slot slot the item would go to.
 * @param loadout Loadout of the unit.
 * @param wearer unit that carries the Loadout.
 * @returns the details; null for an id missing from every catalog.
 */
export const itemDetails = (id: LoadoutItemId, slot: LoadoutSlot, loadout: Loadout, wearer: LoadoutWearer): ItemDetails | null => {
  const found = findLoadoutItem(id);

  if (!found) return null;

  return {
    ...describeItem(found),
    id,
    rules: itemRules(found, loadout, wearer),
    reasons: blockReasons(id, slot, loadout, wearer).map(reason => blockReasonLabel(reason, id)),
  };
};
