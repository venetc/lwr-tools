export interface ListNavItem {
  /** Item id, unique in the list. */
  id: string
  /** Visible label. */
  label: string
  /** Short text after the label, such as a count; null for none. */
  detail: string | null
  /** Whether the item can be removed. */
  isRemovable: boolean
  /** Whether the item is the current one. */
  isCurrent: boolean
}

export interface ListNavSlots {
  /** Icon of an item. */
  icon?: unknown
}

/**
 * Items of the list: whether they show an icon, their details and accessible names, which is current and which
 * cannot be removed.
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

  /**
   * Checks whether the item shows a detail.
   *
   * @param item listed item.
   */
  const hasDetail = (item: ListNavItem) => item.detail !== null;

  /**
   * Accessible name of the item: the label, then the detail.
   *
   * @param item listed item.
   */
  const itemName = (item: ListNavItem) => (item.detail ? `${item.label}, ${item.detail}` : item.label);

  return { hasIcon, isRemoveDisabled, hasDetail, itemName };
};
