import type { Loadout, LoadoutChange, LoadoutItemId, LoadoutSlot, LoadoutWearer } from '@entities/loadout';
import { defaultLoadout, fitLoadout, loadoutSlots, utilitySlotSources } from '@entities/loadout';
import type { UnitLoadout } from '@features/manage-squads';

import {
  CHANGE_REASON_TEXT,
  CHANGE_WORD,
  MAX_WORD,
  SECONDARY_SLOT_CAPTION,
  TACTICAL_RIGGING_NAME,
  UTILITY_SLOT_CAPTION,
  UTILITY_SLOT_NAME,
  UTILITY_SLOTS_NAME,
} from '../config/constants';
import { findLoadoutItem } from './loadout-items';
import { lastSlotsPhrase } from './loadout-locker';

/**
 * Loadout after an item was put on or taken off, with what the rules changed besides.
 */
export interface LoadoutEdit {
  /** New Loadout. */
  loadout: Loadout
  /** Sentences about the slots counted again and the items moved, removed, replaced or added; empty if nothing else changed. */
  notes: string[]
}

/**
 * Name of an item of any catalog.
 *
 * @param id item id.
 * @returns the name; empty for an id missing from every catalog.
 */
const loadoutItemName = (id: LoadoutItemId) => findLoadoutItem(id)?.item.name ?? '';

/**
 * Loadout of a Unit with every slot that is never empty filled: armor or a primary weapon of an unknown code is
 * replaced with the default one, and the Loadout is brought to the rules for it, until the check of the Unit.
 *
 * @param loadout Loadout of the Unit as the Squad keeps it.
 * @param wearer Unit that carries the Loadout.
 * @returns the Loadout; null if no armor or primary weapon fits the Unit.
 */
export const completeLoadout = (loadout: Readonly<UnitLoadout>, wearer: LoadoutWearer): Loadout | null => {
  if (loadout.armor && loadout.primary) return { ...loadout, armor: loadout.armor, primary: loadout.primary };

  const defaults = defaultLoadout(wearer);

  if (!defaults) return null;

  return fitLoadout({ ...loadout, armor: loadout.armor ?? defaults.armor, primary: loadout.primary ?? defaults.primary }, wearer).loadout;
};

/**
 * Sentence about one change of `fitLoadout`: `Ceramic Plating moved to Utility.`, `Reaper Ammo removed: unsupported weapon.`
 *
 * @param change moved, removed, replaced or added item.
 */
const changeNote = (change: LoadoutChange) => {
  const name = loadoutItemName(change.item);

  if (change.kind === 'moved') return `${name} ${CHANGE_WORD.moved} ${UTILITY_SLOT_CAPTION.regular}.`;

  if (change.kind === 'added') return `${name} ${CHANGE_WORD.added} ${SECONDARY_SLOT_CAPTION}.`;

  if (change.kind === 'replaced') return `${name} ${CHANGE_WORD.replaced} ${loadoutItemName(change.by)}: ${CHANGE_REASON_TEXT[change.reason]}.`;

  return `${name} ${CHANGE_WORD.removed}: ${CHANGE_REASON_TEXT[change.reason]}.`;
};

/**
 * Puts the item in the slot of the Loadout in place; an item of another catalog than the slot's is ignored.
 *
 * @param loadout Loadout to change.
 * @param slot slot of the Loadout.
 * @param id item id.
 */
const placeItem = (loadout: Loadout, slot: LoadoutSlot, id: LoadoutItemId) => {
  const found = findLoadoutItem(id);

  if (!found) return;

  if (slot.kind === 'armor' && (found.kind === 'armor' || found.kind === 'shiv-type')) loadout.armor = found.item.id;

  if (found.kind === 'weapon' && (slot.kind === 'primary' || slot.kind === 'secondary')) loadout[slot.kind] = found.item.id;

  if (slot.kind === 'utility' && found.kind === 'equipment') loadout.utility[slot.index] = found.item.id;

  if (slot.kind === 'module' && found.kind === 'equipment') loadout.modules[slot.index] = found.item.id;
};

/**
 * Brings a changed Loadout to the rules with `fitLoadout`: a new armor, SHIV type or primary weapon counts the slots
 * again, and a removed Module takes off the items that need it.
 *
 * @param before Loadout before the change.
 * @param changed Loadout after the change.
 * @param wearer unit that carries the Loadout.
 */
const fitEdit = (before: Loadout, changed: Loadout, wearer: LoadoutWearer): LoadoutEdit => {
  const fit = fitLoadout(changed, wearer);
  const notes = fit.changes.map(changeNote);
  const beforeCount = before.utility.length;
  const afterCount = fit.loadout.utility.length;

  if (beforeCount !== afterCount) notes.unshift(`${UTILITY_SLOTS_NAME}: ${beforeCount} → ${afterCount}.`);

  return { loadout: fit.loadout, notes };
};

/**
 * Puts the item in the slot and brings the Loadout to the rules; the notes tell what else that changed.
 *
 * @param loadout Loadout of the unit; it is left untouched.
 * @param slot slot of the Loadout.
 * @param id item id; it should fit the slot.
 * @param wearer unit that carries the Loadout.
 */
export const equipLoadoutItem = (loadout: Loadout, slot: LoadoutSlot, id: LoadoutItemId, wearer: LoadoutWearer): LoadoutEdit => {
  const placed: Loadout = { ...loadout, utility: [...loadout.utility], modules: [...loadout.modules] };

  placeItem(placed, slot, id);

  return fitEdit(loadout, placed, wearer);
};

/**
 * Whether the item of the slot can be taken off: never armor and the primary weapon, nor the secondary weapon of a slot
 * that is never empty (the rocket launcher of a Rocketeer).
 *
 * @param slot slot of the Loadout.
 * @param loadout Loadout of the unit.
 * @param wearer unit that carries the Loadout.
 */
export const isSlotRemovable = (slot: LoadoutSlot, loadout: Loadout, wearer: LoadoutWearer) => {
  if (slot.kind === 'armor' || slot.kind === 'primary') return false;

  if (slot.kind === 'secondary') return !loadoutSlots(loadout, wearer).isSecondaryRequired;

  return true;
};

/**
 * Empties the slot and brings the Loadout to the rules; armor and the primary weapon stay. The notes tell what else
 * that changed, such as an item that needed the removed Module.
 *
 * @param loadout Loadout of the unit; it is left untouched.
 * @param slot slot of the Loadout.
 * @param wearer unit that carries the Loadout.
 */
export const removeLoadoutItem = (loadout: Loadout, slot: LoadoutSlot, wearer: LoadoutWearer): LoadoutEdit => {
  const removed: Loadout = { ...loadout, utility: [...loadout.utility], modules: [...loadout.modules] };

  if (slot.kind === 'secondary') removed.secondary = null;

  if (slot.kind === 'utility') removed.utility[slot.index] = null;

  if (slot.kind === 'module') removed.modules[slot.index] = null;

  return fitEdit(loadout, removed, wearer);
};

/**
 * Line that explains the number of utility slots: `Archangel Armor 3 + Tactical Rigging 1 = 4 Utility slots, last two are Gear Slots.`
 * An LMG or a Stun Rifle subtracts its slot, and a sum above the maximum names it: `= 4 Utility slots (max 4)`.
 *
 * @param loadout Loadout of the unit.
 * @param wearer unit that carries the Loadout.
 */
export const utilitySlotFormula = (loadout: Loadout, wearer: LoadoutWearer) => {
  const sources = utilitySlotSources(loadout);
  const count = loadoutSlots(loadout, wearer).utility.length;
  const terms = [`${loadoutItemName(loadout.armor)} ${sources.armor}`];

  if (sources.rigging) terms.push(`+ ${TACTICAL_RIGGING_NAME} ${sources.rigging}`);

  if (sources.weapon) terms.push(`− ${loadoutItemName(loadout.primary)} ${-sources.weapon}`);

  const total = `${count} ${count === 1 ? UTILITY_SLOT_NAME : UTILITY_SLOTS_NAME}`;
  const max = sources.armor + sources.rigging + sources.weapon > count ? ` (${MAX_WORD} ${count})` : '';
  const lastSlots = [lastSlotsPhrase(sources.gearSlots, 'gear-slot'), lastSlotsPhrase(sources.psiSlots, 'psi-slot')]
    .filter(phrase => phrase !== null)
    .map(phrase => `, ${phrase}`)
    .join('');

  return `${terms.join(' ')} = ${total}${max}${lastSlots}.`;
};
