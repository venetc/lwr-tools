export interface TieredPickerIcon {
  /** Original icon, shown for a selected item. */
  original: string
  /** Icon tinted for an item of the available tier. */
  available: string
  /** Icon tinted for an item that is locked or not selected. */
  disabled: string
}

export interface TieredPickerItem {
  /** Item id, unique within its tier. */
  id: string
  /** Item name. */
  name: string
  /** Item description. */
  description: string
  /** Item icon variants. */
  icon: TieredPickerIcon
  /** Items described together with this one, below its description. */
  related: TieredPickerItem[]
}

/**
 * Tier look: completed, available for selection, or locked.
 */
export type TieredPickerTierState = 'completed' | 'available' | 'locked';

export interface TieredPickerTier {
  /** Tier id, unique within the picker. */
  id: string
  /** Accessible name of the tier. */
  name: string
  /** Tier look. */
  state: TieredPickerTierState
  /** Whether the tier selection cannot be changed. */
  isDisabled: boolean
  /** Id of the selected item, or null. */
  selectedId: string | null
  /** Items to choose from, one to three. */
  items: TieredPickerItem[]
}

/**
 * Look of an item cell: selected, available to pick, or disabled.
 */
export type TieredPickerAppearance = 'selected' | 'available' | 'disabled';

/**
 * Variant of an item icon.
 */
export type TieredPickerIconVariant = keyof TieredPickerIcon;
