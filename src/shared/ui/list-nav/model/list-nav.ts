export interface ListNavItem {
  /** Item id, unique in the list. */
  id: string
  /** Visible label. */
  label: string
  /** Whether the item can be removed. */
  isRemovable: boolean
}
