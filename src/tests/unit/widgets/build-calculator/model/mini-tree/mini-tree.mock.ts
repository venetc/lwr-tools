import type { TieredPickerItem, TieredPickerTier, TieredPickerTierState } from '@shared/ui/tiered-picker/model/tiered-picker';

export const LEFT_ITEM: TieredPickerItem = {
  id: 'left',
  name: 'Left',
  description: 'Left choice.',
  icon: { selected: 'left-selected.png', available: 'left-available.png', disabled: 'left-disabled.png' },
  related: [],
};

export const RIGHT_ITEM: TieredPickerItem = {
  id: 'right',
  name: 'Right',
  description: 'Right choice.',
  icon: { selected: 'right-selected.png', available: 'right-available.png', disabled: 'right-disabled.png' },
  related: [],
};

/**
 * Tier named `First step` with two items.
 *
 * @param state tier state.
 * @param selectedId id of the selected item, or null.
 */
export const createTierMock = (state: TieredPickerTierState, selectedId: string | null): TieredPickerTier => ({
  id: 'first',
  name: 'First step',
  state,
  isDisabled: false,
  selectedId,
  options: [LEFT_ITEM, RIGHT_ITEM].map(item => ({ item, appearance: 'available', isDisabled: false, note: null })),
});

export const CAPTION = 'FST';
