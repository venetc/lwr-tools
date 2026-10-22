import type { Loadout, LoadoutChange, LoadoutItemId, LoadoutSlot, LoadoutWearer } from '@entities/loadout';
import { findLoadoutItem, fitLoadout, setSlotItem, utilitySlotSources } from '@entities/loadout';

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
 * Sentence about one change of `fitLoadout`: `Ceramic Plating moved to Utility.`, `Reaper Ammo removed: unsupported weapon.`
 *
 * @param change moved, removed, replaced or added item.
 */
export const changeNote = (change: LoadoutChange) => {
  const name = loadoutItemName(change.item);

  if (change.kind === 'moved') return `${name} ${CHANGE_WORD.moved} ${UTILITY_SLOT_CAPTION.regular}.`;

  if (change.kind === 'added') return `${name} ${CHANGE_WORD.added} ${SECONDARY_SLOT_CAPTION}.`;

  if (change.kind === 'replaced') return `${name} ${CHANGE_WORD.replaced} ${loadoutItemName(change.by)}: ${CHANGE_REASON_TEXT[change.reason]}.`;

  return `${name} ${CHANGE_WORD.removed}: ${CHANGE_REASON_TEXT[change.reason]}.`;
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

  setSlotItem(placed, slot, id);

  return fitEdit(loadout, placed, wearer);
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

  setSlotItem(removed, slot, null);

  return fitEdit(loadout, removed, wearer);
};

/**
 * Line that explains the number of utility slots: `Archangel Armor 3 + Tactical Rigging 1 = 4 Utility slots, last two are Gear Slots.`
 * An LMG or a Stun Rifle subtracts its slot, and a sum above the maximum names it: `= 4 Utility slots (max 4)`.
 *
 * @param loadout Loadout of the unit.
 */
export const utilitySlotFormula = (loadout: Loadout) => {
  const sources = utilitySlotSources(loadout);
  const terms = [`${loadoutItemName(loadout.armor)} ${sources.armor}`];

  if (sources.rigging) terms.push(`+ ${TACTICAL_RIGGING_NAME} ${sources.rigging}`);

  if (sources.weapon) terms.push(`− ${loadoutItemName(loadout.primary)} ${-sources.weapon}`);

  const total = `${sources.count} ${sources.count === 1 ? UTILITY_SLOT_NAME : UTILITY_SLOTS_NAME}`;
  const max = sources.isCapped ? ` (${MAX_WORD} ${sources.count})` : '';
  const lastSlots = [lastSlotsPhrase(sources.gearSlots, 'gear-slot'), lastSlotsPhrase(sources.psiSlots, 'psi-slot')]
    .filter(phrase => phrase !== null)
    .map(phrase => `, ${phrase}`)
    .join('');

  return `${terms.join(' ')} = ${total}${max}${lastSlots}.`;
};
