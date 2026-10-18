export interface ListNavItem {
  /** Item id, unique in the list. */
  id: string
  /** Visible label. */
  label: string
  /** Whether the item can be removed. */
  isRemovable: boolean
}

export interface ListNavSlots {
  /** Icon of an item. */
  icon?: unknown
}

/**
 * Items of the list: whether they show an icon and which cannot be removed.
 *
 * @param slots slots of the list.
 */
export const useListNav = (slots: ListNavSlots) => {
  const hasIcon = Boolean(slots.icon);

  /**
   * Whether the item cannot be removed.
   *
   * @param item listed item.
   */
  const isRemoveDisabled = (item: ListNavItem) => !item.isRemovable;

  return { hasIcon, isRemoveDisabled };
};
