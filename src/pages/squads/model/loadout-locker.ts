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
  WeaponTier,
  WeaponType,
} from '@entities/loadout';
import { blockReasons, findLoadoutItem, itemCarriers, itemRules, slotItemId, slotItems, WEAPON_TIERS } from '@entities/loadout';
import type { DeepReadonly } from '@shared/lib/object';
import type { ImagePlaceholder } from '@shared/ui/loading-image';

import {
  ALTERNATIVE_SEPARATOR,
  ARMOR_CATEGORY_NAME,
  ARMOR_GROUP_WORD,
  ARMOR_SLOT_CAPTION,
  BLOCK_REASON_LABEL,
  DETAIL_SEPARATOR,
  EQUIPPED_LABEL,
  ITEM_RULE_TEXT,
  LAST_SLOTS_WORDS,
  LIST_SEPARATOR,
  MODULE_SLOT_CAPTION,
  NEEDS_WORD,
  NO_TIER_GROUP_NAME,
  NUMBER_WORDS,
  STAT_NAME,
  UNAVAILABLE_GROUP_NAME,
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
  /** Placeholder colours shown until the image loads. */
  iconPlaceholder: ImagePlaceholder
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
 * Row of the weapon matrix: a weapon type with its weapons by tier.
 */
export interface LockerRow {
  /** Weapon type name. */
  name: string
  /** Label of the first reason of the first weapon when no weapon of the type fits; null for a row that fits. */
  reason: string | null
  /** Weapon of the type in each column of the matrix; null where the type has no weapon of the tier. */
  cells: (LockerItem | null)[]
}

/**
 * Group of the Locker of a slot.
 */
export interface LockerGroup {
  /** Group name; null for the items that fit a Locker listed without groups, and for the matrix rows that fit. */
  title: string | null
  /** Rows of the weapon matrix, shown before the items; empty in a Locker listed. */
  rows: LockerRow[]
  /** Items of the group, in catalog order. */
  items: LockerItem[]
}

/**
 * What the Locker of a slot shows.
 */
export interface LockerContents {
  /** Names of the Weapon tiers of the matrix columns, in tier order; empty for a Locker listed without a matrix. */
  tiers: string[]
  /** Groups in their order. */
  groups: LockerGroup[]
}

/**
 * Group of the items that fit, with its place among the other groups.
 */
interface FitGroup {
  /** Group name; null for a Locker listed without groups. */
  title: string | null
  /** Place of the group: groups go up by it, and groups of one place keep the order of their first items. */
  rank: number
  /** Items of the group, in catalog order. */
  items: LockerItem[]
}

/**
 * Name and place of the group an item that fits goes to.
 */
type FitGroupPlace = Omit<FitGroup, 'items'>;

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
  /** Placeholder colours shown until the image loads. */
  iconPlaceholder: ImagePlaceholder
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
  /** Placeholder colours shown until the image loads. */
  iconPlaceholder: ImagePlaceholder
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
    iconPlaceholder: armor.iconPlaceholder,
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
  iconPlaceholder: shivType.iconPlaceholder,
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
 * Type of a weapon with its tier, or the type alone for an Arc weapon, which has no tier.
 *
 * @param weapon weapon.
 */
const weaponTypeText = (weapon: DeepReadonly<Weapon>) => {
  const typeName = WEAPON_TYPE_NAME[weapon.type];

  if (!weapon.tier) return typeName;

  return [typeName, WEAPON_TIER_NAME[weapon.tier]].join(DETAIL_SEPARATOR);
};

/**
 * Description of a weapon.
 *
 * @param weapon weapon.
 */
const describeWeapon = (weapon: DeepReadonly<Weapon>): ItemDescription => ({
  name: weapon.name,
  icon: weapon.icon,
  iconPlaceholder: weapon.iconPlaceholder,
  type: weaponTypeText(weapon),
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
  iconPlaceholder: equipment.iconPlaceholder,
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
 * Item of the Locker with what tells it fits the slot and its mark.
 *
 * @param found item with its catalog.
 * @param reasons why the item does not fit the slot.
 * @param isEquipped whether the item is the one in the slot.
 * @param unit unit type that carries the Loadout.
 */
const lockerItem = (found: LoadoutCatalogItem, reasons: LoadoutBlockReason[], isEquipped: boolean, unit: LoadoutUnitId): LockerItem => {
  const description = describeItem(found);
  const [firstReason] = reasons;
  const reasonLabel = firstReason ? blockReasonLabel(firstReason, found.item.id, unit) : null;
  const mark = isEquipped ? EQUIPPED_LABEL : reasonLabel;

  return {
    id: found.item.id,
    name: description.name,
    icon: description.icon,
    iconPlaceholder: description.iconPlaceholder,
    summary: description.stats.map(stat => (stat.value ? `${stat.name} ${stat.value}` : stat.name)).join(DETAIL_SEPARATOR),
    reasons,
    reasonLabel,
    isEquipped,
    mark,
    label: mark ? `${description.name}${LIST_SEPARATOR}${mark}` : description.name,
  };
};

/**
 * Group a weapon that fits goes to: that of its tier, or `No tier` after every tier for an Arc weapon.
 *
 * @param tier tier of the weapon; null for an Arc weapon.
 */
const weaponGroupOf = (tier: WeaponTier | null): FitGroupPlace => {
  if (!tier) return { title: NO_TIER_GROUP_NAME, rank: WEAPON_TIERS.length };

  return { title: WEAPON_TIER_NAME[tier], rank: WEAPON_TIERS.indexOf(tier) };
};

/**
 * Group an item that fits goes to: a weapon by its tier, after every tier if it has none; armor by its
 * category; utility equipment by whether it is passive; SHIV types and Modules in one group without a name.
 *
 * @param found item with its catalog.
 */
const fitGroupOf = (found: LoadoutCatalogItem): FitGroupPlace => {
  if (found.kind === 'weapon') return weaponGroupOf(found.item.tier);

  if (found.kind === 'armor') return { title: `${ARMOR_CATEGORY_NAME[found.item.category]} ${ARMOR_GROUP_WORD}`, rank: 0 };

  if (found.kind === 'equipment' && found.item.slot === 'utility') return { title: equipmentType(found.item), rank: 0 };

  return { title: null, rank: 0 };
};

/**
 * Item of the Locker with the catalog item it shows.
 */
interface LockerEntry {
  /** Catalog item. */
  found: LoadoutCatalogItem
  /** What the Locker shows of it. */
  item: LockerItem
}

/**
 * Items of the Locker of a slot in catalog order; items of other unit types are left out.
 *
 * @param slot slot of the Loadout.
 * @param loadout Loadout of the unit.
 * @param wearer unit that carries the Loadout.
 */
const lockerEntries = (slot: LoadoutSlot, loadout: Loadout, wearer: LoadoutWearer) => {
  const equippedId = slotItemId(loadout, slot);
  const entries: LockerEntry[] = [];

  slotItems(slot, wearer.unit).forEach((found) => {
    const reasons = blockReasons(found.item.id, slot, loadout, wearer);

    if (reasons.includes('wrong-unit')) return;

    entries.push({ found, item: lockerItem(found, reasons, found.item.id === equippedId, wearer.unit) });
  });

  return entries;
};

/**
 * Groups of a Locker listed: those of the items that fit, then `Unavailable` with the rest; every group keeps the catalog
 * order.
 *
 * @param entries items of the Locker.
 */
const listGroups = (entries: LockerEntry[]): LockerGroup[] => {
  const fitGroups = new Map<string | null, FitGroup>();
  const unavailable: LockerItem[] = [];

  entries.forEach(({ found, item }) => {
    if (item.reasons.length) {
      unavailable.push(item);

      return;
    }

    const { title, rank } = fitGroupOf(found);
    const group = fitGroups.get(title);

    if (group) {
      group.items.push(item);

      return;
    }

    fitGroups.set(title, { title, rank, items: [item] });
  });

  const groups: LockerGroup[] = [...fitGroups.values()]
    .sort((left, right) => left.rank - right.rank)
    .map(group => ({ title: group.title, rows: [], items: group.items }));

  if (unavailable.length) groups.push({ title: UNAVAILABLE_GROUP_NAME, rows: [], items: unavailable });

  return groups;
};

/**
 * Weapon tiers of the matrix columns: those of the items of the Locker, in tier order.
 *
 * @param entries items of the Locker.
 * @returns the tiers; empty when the items have fewer than two tiers, and the Locker is listed.
 */
const matrixTiers = (entries: LockerEntry[]) => {
  const tiers = WEAPON_TIERS.filter(tier => entries.some(({ found }) => found.kind === 'weapon' && found.item.tier === tier));

  if (tiers.length < 2) return [];

  return tiers;
};

/**
 * Weapon of a type with what the Locker shows of it.
 */
interface TypeWeapon {
  /** Weapon. */
  weapon: DeepReadonly<Weapon>
  /** What the Locker shows of it. */
  item: LockerItem
}

/**
 * Row of the weapon matrix of a weapon type.
 *
 * @param type weapon type.
 * @param weapons weapons of the type, in catalog order.
 * @param tiers Weapon tiers of the matrix columns.
 * @param reason label of the first reason of the first weapon when no weapon of the type fits; null if one fits.
 */
const matrixRow = (type: WeaponType, weapons: TypeWeapon[], tiers: WeaponTier[], reason: string | null): LockerRow => ({
  name: WEAPON_TYPE_NAME[type],
  reason,
  cells: tiers.map(tier => weapons.find(({ weapon }) => weapon.tier === tier)?.item ?? null),
});

/**
 * Groups of a weapon Locker shown as a matrix: the rows of the types that fit, then `No tier` with the Arc weapons that fit,
 * then `Unavailable` with the rows of the other types and the other Arc weapons; a group without rows or items is left out.
 *
 * @param entries items of the Locker.
 * @param tiers Weapon tiers of the matrix columns.
 */
const matrixGroups = (entries: LockerEntry[], tiers: WeaponTier[]): LockerGroup[] => {
  const types = new Map<WeaponType, TypeWeapon[]>();
  const fitArcItems: LockerItem[] = [];
  const blockedArcItems: LockerItem[] = [];

  entries.forEach(({ found, item }) => {
    if (found.kind !== 'weapon') return;

    if (!found.item.tier) {
      const arcItems = item.reasons.length ? blockedArcItems : fitArcItems;

      arcItems.push(item);

      return;
    }

    const weapons = types.get(found.item.type);

    if (weapons) {
      weapons.push({ weapon: found.item, item });

      return;
    }

    types.set(found.item.type, [{ weapon: found.item, item }]);
  });

  const fitRows: LockerRow[] = [];
  const blockedRows: LockerRow[] = [];

  types.forEach((weapons, type) => {
    if (weapons.some(({ item }) => !item.reasons.length)) {
      fitRows.push(matrixRow(type, weapons, tiers, null));

      return;
    }

    blockedRows.push(matrixRow(type, weapons, tiers, weapons[0]?.item.reasonLabel ?? null));
  });

  const groups: LockerGroup[] = [
    { title: null, rows: fitRows, items: [] },
    { title: NO_TIER_GROUP_NAME, rows: [], items: fitArcItems },
    { title: UNAVAILABLE_GROUP_NAME, rows: blockedRows, items: blockedArcItems },
  ];

  return groups.filter(group => group.rows.length || group.items.length);
};

/**
 * Contents of the Locker of a slot: a weapon matrix when the weapons have two tiers or more, and the groups.
 *
 * @param slot slot of the Loadout.
 * @param loadout Loadout of the unit.
 * @param wearer unit that carries the Loadout.
 */
export const lockerContents = (slot: LoadoutSlot, loadout: Loadout, wearer: LoadoutWearer): LockerContents => {
  const entries = lockerEntries(slot, loadout, wearer);
  const tiers = matrixTiers(entries);
  const groups = tiers.length ? matrixGroups(entries, tiers) : listGroups(entries);

  return { tiers: tiers.map(tier => WEAPON_TIER_NAME[tier]), groups };
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
