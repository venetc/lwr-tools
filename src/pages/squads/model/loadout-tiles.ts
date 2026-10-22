import type { Loadout, LoadoutItemId, LoadoutSlot, LoadoutWearer, UtilitySlotKind } from '@entities/loadout';
import { ARMOR_BY_ID, EQUIPMENT_BY_ID, loadoutSlots, SHIV_TYPE_BY_ID, WEAPON_BY_ID } from '@entities/loadout';

import {
  ARMOR_SLOT_CAPTION,
  EMPTY_SLOT_NAME,
  MODULE_SLOT_CAPTION,
  PRIMARY_SLOT_CAPTION,
  SECONDARY_SLOT_CAPTION,
  UTILITY_SLOT_CAPTION,
} from '../config/constants';

/**
 * Item shown on a Loadout tile.
 */
export interface LoadoutTileItem {
  /** Item name. */
  name: string
  /** Item image URL. */
  icon: string
}

/**
 * Tile of one slot of a Unit card.
 */
export interface LoadoutTile {
  /** Tile id, unique in the card. */
  id: string
  /** Slot the tile shows. */
  slot: LoadoutSlot
  /** Slot caption. */
  caption: string
  /** Accessible name of the tile: the caption and the item name, such as `Armor: Tactical Vest`. */
  label: string
  /** Item in the slot; null for an empty slot. */
  item: LoadoutTileItem | null
  /** Whether the tile is a large one: armor and weapon slots. */
  isLarge: boolean
  /** Kind of the slot for its colour: a Gear Slot, a Psi Slot, or regular for any other slot. */
  tone: UtilitySlotKind
}

/**
 * Item of a slot as a tile shows it; null for an empty slot or an item missing from the catalog of the slot.
 *
 * @param catalog items of the catalog of the slot by id.
 * @param id item id, or null for an empty slot.
 */
const tileItem = (catalog: ReadonlyMap<LoadoutItemId, LoadoutTileItem>, id: LoadoutItemId | null): LoadoutTileItem | null => {
  const item = id ? catalog.get(id) : null;

  if (!item) return null;

  return { name: item.name, icon: item.icon };
};

/**
 * Tile of the slot with the item in it.
 *
 * @param id tile id.
 * @param slot slot the tile shows.
 * @param caption slot caption.
 * @param item item in the slot; null for an empty slot.
 * @param tone kind of the slot for its colour.
 */
const createTile = (id: string, slot: LoadoutSlot, caption: string, item: LoadoutTileItem | null, tone: UtilitySlotKind = 'regular'): LoadoutTile => {
  return {
    id,
    slot,
    caption,
    label: `${caption}: ${item?.name ?? EMPTY_SLOT_NAME}`,
    item,
    isLarge: slot.kind === 'armor' || slot.kind === 'primary' || slot.kind === 'secondary',
    tone,
  };
};

/**
 * Tiles of the Loadout of a Unit card in inventory order: armor (MEC exoskeleton, SHIV type), primary weapon,
 * secondary weapon if the Unit has the slot, Module slots, utility slots with their Gear Slots and Psi Slots last.
 *
 * @param loadout Loadout of the Unit.
 * @param wearer Unit that carries the Loadout.
 */
export const loadoutTiles = (loadout: Readonly<Loadout>, wearer: LoadoutWearer): LoadoutTile[] => {
  const slots = loadoutSlots(loadout, wearer);
  const armorCatalog = wearer.unit === 'shiv' ? SHIV_TYPE_BY_ID : ARMOR_BY_ID;

  const tiles = [
    createTile('armor', { kind: 'armor' }, ARMOR_SLOT_CAPTION[wearer.unit], tileItem(armorCatalog, loadout.armor)),
    createTile('primary', { kind: 'primary' }, PRIMARY_SLOT_CAPTION, tileItem(WEAPON_BY_ID, loadout.primary)),
  ];

  if (slots.hasSecondary) {
    tiles.push(createTile('secondary', { kind: 'secondary' }, SECONDARY_SLOT_CAPTION, tileItem(WEAPON_BY_ID, loadout.secondary)));
  }

  for (let index = 0; index < slots.moduleCount; index++) {
    tiles.push(createTile(`module-${index}`, { kind: 'module', index }, MODULE_SLOT_CAPTION, tileItem(EQUIPMENT_BY_ID, loadout.modules[index] ?? null)));
  }

  slots.utility.forEach((kind, index) => {
    const item = tileItem(EQUIPMENT_BY_ID, loadout.utility[index] ?? null);

    tiles.push(createTile(`utility-${index}`, { kind: 'utility', index }, UTILITY_SLOT_CAPTION[kind], item, kind));
  });

  return tiles;
};
