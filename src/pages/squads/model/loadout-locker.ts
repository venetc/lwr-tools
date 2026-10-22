import type {
  Armor,
  ArmorRules,
  Equipment,
  EquipmentRules,
  EquipmentStat,
  Loadout,
  LoadoutAbility,
  LoadoutBlockReason,
  LoadoutCatalogItem,
  LoadoutItemId,
  LoadoutSlot,
  LoadoutUnitId,
  LoadoutWearer,
  ShivType,
  UtilitySlotKind,
  Weapon,
} from '@entities/loadout';
import { blockReasons, findLoadoutItem, itemCarriers, itemRules, slotItemId, slotItems } from '@entities/loadout';
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
 * Texts of the rules of armor: its Gear Slots and Psi Slots, and that Tactical Rigging adds no slot to it.
 *
 * @param rules rules of the armor.
 */
const armorRuleTexts = (rules: ArmorRules) => {
  const lastSlots = [lastSlotsPhrase(rules.gearSlots, 'gear-slot'), lastSlotsPhrase(rules.psiSlots, 'psi-slot')].filter(phrase => phrase !== null);
  const texts = lastSlots.map(phrase => `${UTILITY_SLOTS_NAME}: ${phrase}.`);

  if (rules.isRiggingIgnored) texts.push(ITEM_RULE_TEXT.noRigging);

  return texts;
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
 * Text of the utility slots that take equipment: Gear Slots and Psi Slots, Gear Slots only, or neither.
 *
 * @param kinds kinds of the utility slots that take the item.
 * @returns the text; null for a Module, which no utility slot takes.
 */
const slotKindsText = (kinds: readonly UtilitySlotKind[]) => {
  if (!kinds.length) return null;

  if (kinds.includes('psi-slot')) return ITEM_RULE_TEXT.fitsGearOrPsiSlot;

  if (kinds.includes('gear-slot')) return ITEM_RULE_TEXT.fitsGearSlot;

  return ITEM_RULE_TEXT.notForGearSlots;
};

/**
 * Texts of the rules of equipment: items it does not stack with, the primary weapons it works with, the Module it needs
 * and the utility slots that take it.
 *
 * @param rules rules of the equipment or Module.
 */
const equipmentRuleTexts = (rules: EquipmentRules) => {
  const texts: string[] = [];
  const weaponParts = [
    rules.primaryTiers?.map(tier => WEAPON_TIER_NAME[tier]).join(ALTERNATIVE_SEPARATOR),
    rules.primaryTypes?.map(type => WEAPON_TYPE_NAME[type]).join(ALTERNATIVE_SEPARATOR),
  ].filter(part => part !== undefined);
  const slotText = slotKindsText(rules.slotKinds);

  if (rules.cantStackWith.length) texts.push(`${ITEM_RULE_TEXT.cantStack} ${rules.cantStackWith.map(item => item.name).join(LIST_SEPARATOR)}.`);

  if (weaponParts.length) texts.push(`${ITEM_RULE_TEXT.primaryWeapon} ${weaponParts.join(DETAIL_SEPARATOR)}.`);

  if (rules.requiredModule) texts.push(`${NEEDS_WORD} ${rules.requiredModule.name}.`);

  if (slotText) texts.push(slotText);

  return texts;
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
 * Texts of the rules of an item of any catalog, as its details list them.
 *
 * @param id item id.
 * @param unit unit type that carries the item.
 */
const itemRuleTexts = (id: LoadoutItemId, unit: LoadoutUnitId): string[] => {
  const rules = itemRules(id, unit);

  if (rules?.kind === 'armor') return armorRuleTexts(rules);

  if (rules?.kind === 'weapon') return rules.takenUtilitySlots ? [ITEM_RULE_TEXT.takesUtilitySlot] : [];

  if (rules?.kind === 'equipment') return equipmentRuleTexts(rules);

  return [];
};

/**
 * Label of a reason an item does not fit: the Module it needs is named.
 *
 * @param reason reason code.
 * @param id item id.
 * @param unit unit type that carries the item.
 */
const blockReasonLabel = (reason: LoadoutBlockReason, id: LoadoutItemId, unit: LoadoutUnitId) => {
  const rules = reason === 'needs-module' ? itemRules(id, unit) : null;

  if (rules?.kind === 'equipment' && rules.requiredModule) return `${NEEDS_WORD} ${rules.requiredModule.name}`;

  return BLOCK_REASON_LABEL[reason];
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

  const items = slotItems(slot, wearer.unit).flatMap((found): LockerItem[] => {
    const id = found.item.id;
    const reasons = blockReasons(id, slot, loadout, wearer);

    if (reasons.includes('wrong-unit')) return [];

    const description = describeItem(found);
    const [firstReason] = reasons;
    const reasonLabel = firstReason ? blockReasonLabel(firstReason, id, wearer.unit) : null;
    const isEquipped = id === equippedId;
    const mark = isEquipped ? EQUIPPED_LABEL : reasonLabel;

    return [{
      id,
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
    rules: itemRuleTexts(id, wearer.unit),
    reasons: blockReasons(id, slot, loadout, wearer).map(reason => blockReasonLabel(reason, id, wearer.unit)),
  };
};
