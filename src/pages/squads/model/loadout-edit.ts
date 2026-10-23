import type { Loadout, LoadoutChange, LoadoutItemId, LoadoutRemoval, LoadoutSlot, LoadoutWearer } from '@entities/loadout';
import { findLoadoutItem, fitLoadout, setSlotItem, utilitySlotSources } from '@entities/loadout';

import {
  CHANGE_NEEDS_WORD,
  CHANGE_REASON_TEXT,
  CHANGE_WORD,
  MAX_WORD,
  MODULE_SLOTS_NAME,
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
 * Why a change took an item off, as the toast tells it: the Module the item needs is named.
 *
 * @param change removed item.
 */
const removalReasonText = (change: LoadoutRemoval) => {
  const found = change.reason === 'needs-module' ? findLoadoutItem(change.item) : null;

  if (found?.kind === 'equipment' && found.item.requiredModule) return `${CHANGE_NEEDS_WORD} ${loadoutItemName(found.item.requiredModule)}`;

  return CHANGE_REASON_TEXT[change.reason];
};

/**
 * Sentence about one change of `fitLoadout`: `Ceramic Plating moved to Utility.`, `Reaper Ammo removed: unsupported weapon.`,
 * `The Thumper removed: needs Kinetic Strike Module.`
 *
 * @param change moved, removed, replaced or added item.
 */
export const changeNote = (change: LoadoutChange) => {
  const name = loadoutItemName(change.item);

  if (change.kind === 'moved') return `${name} ${CHANGE_WORD.moved} ${UTILITY_SLOT_CAPTION.regular}.`;

  if (change.kind === 'added') return `${name} ${CHANGE_WORD.added} ${SECONDARY_SLOT_CAPTION}.`;

  if (change.kind === 'replaced') return `${name} ${CHANGE_WORD.replaced} ${loadoutItemName(change.by)}: ${CHANGE_REASON_TEXT[change.reason]}.`;

  return `${name} ${CHANGE_WORD.removed}: ${removalReasonText(change)}.`;
};

/**
 * Sentence about a new number of slots: `Utility slots: 3 → 2.`
 *
 * @param name name of the slots.
 * @param before number of the slots before the change.
 * @param after number of the slots after the change.
 * @returns the sentence; null if the number stayed.
 */
const slotCountNote = (name: string, before: number, after: number) => (before === after ? null : `${name}: ${before} → ${after}.`);

/**
 * Brings a changed Loadout to the rules with `fitLoadout`: a new armor, MEC exoskeleton, SHIV type or primary weapon
 * counts the Module and utility slots again, in INVENTORY order, and a removed Module takes off the items that need it.
 *
 * @param before Loadout before the change.
 * @param changed Loadout after the change.
 * @param wearer unit that carries the Loadout.
 */
const fitEdit = (before: Loadout, changed: Loadout, wearer: LoadoutWearer): LoadoutEdit => {
  const fit = fitLoadout(changed, wearer);
  const countNotes = [
    slotCountNote(MODULE_SLOTS_NAME, before.modules.length, fit.loadout.modules.length),
    slotCountNote(UTILITY_SLOTS_NAME, before.utility.length, fit.loadout.utility.length),
  ].filter(note => note !== null);

  return { loadout: fit.loadout, notes: [...countNotes, ...fit.changes.map(changeNote)] };
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
