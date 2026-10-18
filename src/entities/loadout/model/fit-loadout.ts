import { EQUIPMENT_BY_ID } from '../config/constants/equipment';
import type { EquipmentId } from './equipment';
import type { Loadout, LoadoutBlockReason, LoadoutItemId, LoadoutSlotKind, LoadoutWearer, UtilitySlotKind } from './loadout';
import { blockReasons, defaultLoadout, isMountHolding, loadoutSlots } from './loadout';

export type LoadoutChangeReason = LoadoutBlockReason | 'slot-removed';

/**
 * Item moved out of a Mount that does not hold it to a free regular utility slot.
 */
export interface LoadoutMove {
  /** Change kind. */
  kind: 'moved'
  /** Moved equipment id. */
  item: EquipmentId
  /** Utility slot position the item left. */
  from: number
  /** Utility slot position the item took. */
  to: number
}

/**
 * Item taken off the Loadout.
 */
export interface LoadoutRemoval {
  /** Change kind. */
  kind: 'removed'
  /** Kind of the slot the item left. */
  slot: LoadoutSlotKind
  /** Removed item id. */
  item: LoadoutItemId
  /** Why the item was removed: it no longer fits, or its slot is gone (`slot-removed`). */
  reason: LoadoutChangeReason
}

/**
 * Item of a slot that is never empty, replaced with the default one.
 */
export interface LoadoutReplacement {
  /** Change kind. */
  kind: 'replaced'
  /** Kind of the slot. */
  slot: 'armor' | 'primary' | 'secondary'
  /** Replaced item id. */
  item: LoadoutItemId
  /** Id of the default item that took its place. */
  by: LoadoutItemId
  /** Why the item no longer fits. */
  reason: LoadoutBlockReason
}

/**
 * Default item put in an empty slot that is never empty.
 */
export interface LoadoutAddition {
  /** Change kind. */
  kind: 'added'
  /** Kind of the slot. */
  slot: 'secondary'
  /** Id of the added default item. */
  item: LoadoutItemId
}

export type LoadoutChange = LoadoutMove | LoadoutRemoval | LoadoutReplacement | LoadoutAddition;

/**
 * Loadout brought to the rules, with what was changed.
 */
export interface LoadoutFit {
  /** Loadout that fits the unit. */
  loadout: Loadout
  /** Moved, removed, replaced and added items in the order of the changes. */
  changes: LoadoutChange[]
}

/**
 * Loadout brought to the rules for the unit, as after a change of armor, SHIV type, primary weapon or Build.
 *
 * @description Steps in order: armor and primary weapon that no longer fit become the default ones; a secondary weapon
 * that no longer fits is removed, or replaced with the default one in a slot that is never empty, which an empty one
 * also gets; utility and Module slots are counted again: the last positions stay the Mounts of the armor, and extra
 * regular and Module slots are cut from the end; an item a Mount does not hold moves to the first free regular slot;
 * then Modules and utility items that do not fit are removed in slot order, so of two items that clash the first one stays.
 *
 * @param loadout Loadout to check; it is left untouched.
 * @param wearer unit that carries the Loadout.
 */
export const fitLoadout = (loadout: Loadout, wearer: LoadoutWearer): LoadoutFit => {
  const fitted: Loadout = { ...loadout, utility: [...loadout.utility], modules: [...loadout.modules] };
  const changes: LoadoutChange[] = [];

  /**
   * Puts the default item in an armor or primary slot whose item no longer fits.
   *
   * @param slot armor or primary slot.
   */
  const fitRequiredSlot = (slot: 'armor' | 'primary') => {
    const [reason] = blockReasons(fitted[slot], { kind: slot }, fitted, wearer);

    if (!reason) return;

    const defaults = defaultLoadout(wearer);

    if (!defaults) return;

    changes.push({ kind: 'replaced', slot, item: fitted[slot], by: defaults[slot], reason });

    if (slot === 'armor') {
      fitted.armor = defaults.armor;
      return;
    }

    fitted.primary = defaults.primary;
  };

  /**
   * Takes off a secondary weapon that no longer fits; a slot that is never empty gets the default one instead.
   *
   * @param isRequired whether the secondary slot is never empty.
   */
  const fitSecondarySlot = (isRequired: boolean) => {
    const item = fitted.secondary;
    const [reason] = item === null ? [] : blockReasons(item, { kind: 'secondary' }, fitted, wearer);

    if (item === null || !reason) return;

    const replacement = isRequired ? defaultLoadout(wearer)?.secondary ?? null : null;

    changes.push(replacement === null
      ? { kind: 'removed', slot: 'secondary', item, reason }
      : { kind: 'replaced', slot: 'secondary', item, by: replacement, reason });
    fitted.secondary = replacement;
  };

  /**
   * Puts the default secondary weapon in an empty slot that is never empty.
   *
   * @param isRequired whether the secondary slot is never empty.
   */
  const fillSecondarySlot = (isRequired: boolean) => {
    if (fitted.secondary !== null || !isRequired) return;

    const item = defaultLoadout(wearer)?.secondary;

    if (!item) return;

    changes.push({ kind: 'added', slot: 'secondary', item });
    fitted.secondary = item;
  };

  /**
   * Sets the number of slots in place: extra slots are cut from the end, missing ones are added empty.
   *
   * @param items items of the slots, changed in place.
   * @param count number of slots the unit has.
   * @param slot kind of the slots, for the changes.
   */
  const resizeSlots = (items: (EquipmentId | null)[], count: number, slot: 'utility' | 'module') => {
    const cut = items.splice(count);

    items.push(...Array.from<EquipmentId | null>({ length: count - items.length }).fill(null));
    cut.forEach((item) => {
      if (item !== null) changes.push({ kind: 'removed', slot, item, reason: 'slot-removed' });
    });
  };

  /**
   * Sets the utility slots to their kinds: the last positions stay Mounts, the regular slots before them are resized.
   *
   * @param kinds kinds of the utility slots the unit has.
   */
  const resizeUtilitySlots = (kinds: UtilitySlotKind[]) => {
    const mountCount = kinds.filter(kind => kind !== 'regular').length;
    const mounts = fitted.utility.splice(Math.max(0, fitted.utility.length - mountCount));

    resizeSlots(fitted.utility, kinds.length - mountCount, 'utility');
    resizeSlots(mounts, mountCount, 'utility');
    fitted.utility.push(...mounts);
  };

  /**
   * Moves items the Mounts do not hold to free regular utility slots, while there are any.
   */
  const moveOutOfMounts = () => {
    const kinds = loadoutSlots(fitted, wearer).utility;

    kinds.forEach((kind, from) => {
      const item = fitted.utility[from];

      if (!item) return;

      const equipment = EQUIPMENT_BY_ID.get(item);
      const to = kinds.findIndex((other, index) => other === 'regular' && fitted.utility[index] === null);

      if (!equipment || isMountHolding(kind, equipment) || to === -1) return;

      fitted.utility[to] = item;
      fitted.utility[from] = null;
      changes.push({ kind: 'moved', item, from, to });
    });
  };

  /**
   * Removes Modules and utility items that do not fit, checking each against the items kept before it.
   */
  const removeMisfits = () => {
    const kept: Loadout = { ...fitted, utility: fitted.utility.map(() => null), modules: fitted.modules.map(() => null) };

    (['module', 'utility'] as const).forEach((slot) => {
      const items = slot === 'utility' ? fitted.utility : fitted.modules;
      const keptItems = slot === 'utility' ? kept.utility : kept.modules;

      items.forEach((item, index) => {
        if (item === null) return;

        const [reason] = blockReasons(item, { kind: slot, index }, kept, wearer);

        if (reason) {
          changes.push({ kind: 'removed', slot, item, reason });
          return;
        }

        keptItems[index] = item;
      });
    });

    fitted.utility = kept.utility;
    fitted.modules = kept.modules;
  };

  fitRequiredSlot('armor');
  fitRequiredSlot('primary');

  const slots = loadoutSlots(fitted, wearer);

  fitSecondarySlot(slots.isSecondaryRequired);
  fillSecondarySlot(slots.isSecondaryRequired);
  resizeUtilitySlots(slots.utility);
  resizeSlots(fitted.modules, slots.moduleCount, 'module');
  moveOutOfMounts();
  removeMisfits();

  return { loadout: fitted, changes };
};
