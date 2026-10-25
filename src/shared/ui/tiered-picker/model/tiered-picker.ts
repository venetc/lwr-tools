import type { ImagePlaceholder } from '@shared/ui/loading-image';

/**
 * Look of an item cell: selected, available to pick, or disabled.
 */
export type TieredPickerAppearance = 'selected' | 'available' | 'disabled';

/**
 * Image of a tier label, such as a medal, with its placeholder colours.
 */
export interface TieredPickerTierImage {
  /** Image URL. */
  src: string
  /** Placeholder colours shown until the image loads. */
  placeholder: ImagePlaceholder
}

export interface TieredPickerIcon {
  /** Icon of a selected item. */
  selected: string
  /** Icon of an item available to select. */
  available: string
  /** Icon of an item that is locked, not selected or blocked. */
  disabled: string
  /** Colours of each variant for the placeholder shown until the image loads. */
  placeholder: Record<TieredPickerAppearance, ImagePlaceholder>
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
  related: readonly TieredPickerItem[]
}

/**
 * Item of a tier in the current build state; the item itself is shared and never copied per state.
 */
export interface TieredPickerOption {
  /** Item of the cell. */
  item: TieredPickerItem
  /** Look of the cell. */
  appearance: TieredPickerAppearance
  /** Whether the item cannot be selected, cleared or replaced, while it can still be described. */
  isDisabled: boolean
  /** Short remark shown under the name in the description, such as why the item cannot be selected; null for none. */
  note: string | null
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
  /** Items to choose from with their cells. */
  options: readonly TieredPickerOption[]
}

/**
 * Look of an item on a tier where one item is chosen in turn: every item of the available tier is available,
 * the selected item of a completed tier is selected, and the rest are disabled.
 *
 * @param tierState state of the item tier.
 * @param isSelected whether the item is selected on its tier.
 */
const tierItemAppearance = (tierState: TieredPickerTierState, isSelected: boolean): TieredPickerAppearance => {
  if (tierState === 'available') return 'available';
  if (tierState === 'completed' && isSelected) return 'selected';
  return 'disabled';
};

/**
 * Option of an item on a tier where one item is chosen in turn, with the look of `tierItemAppearance`;
 * any item of an editable tier replaces the selection, and there is no note.
 *
 * @param item tier item.
 * @param tierState state of the item tier.
 * @param selectedId id of the item selected on the tier, or null.
 */
export const tierOption = (item: TieredPickerItem, tierState: TieredPickerTierState, selectedId: string | null): TieredPickerOption => ({
  item,
  appearance: tierItemAppearance(tierState, item.id === selectedId),
  isDisabled: false,
  note: null,
});

/**
 * Named group of tiers with its own description default; several groups are shown behind tabs.
 */
export interface TieredPickerGroup<Tier extends TieredPickerTier = TieredPickerTier> {
  /** Group id, unique within the picker. */
  id: string
  /** Accessible name of the group tab. */
  name: string
  /** Tiers from lowest to highest. */
  tiers: readonly Tier[]
  /** Item described while the user inspects none in the group. */
  defaultItem: TieredPickerItem | null
}
