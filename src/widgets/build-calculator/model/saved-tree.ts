import type { SoldierOutdatedSelection } from '@entities/soldier';
import { treeAbility } from '@entities/soldier';
import type { TieredPickerItem, TieredPickerOption, TieredPickerTier } from '@shared/ui/tiered-picker';

import { SOLDIER_STEP_GROUP_ID } from '../config/constants';
import { treeAbilityPickerItem } from './ability-picker-item';

/**
 * Picker tier of a build tree, which an Outdated build can show with abilities of its code.
 */
export interface BuildTreeTier extends TieredPickerTier {
  /** Ids of the abilities an Outdated build shows on the tier in place of the current ones; empty for a current tier. */
  outdatedItemIds: readonly string[]
}

/**
 * Cell of an Outdated selection in the saved tree: the ability of the code in the cell of its variant.
 */
export interface OutdatedCell {
  /** Index of the tier in its group. */
  tierIndex: number
  /** Index of the variant on the tier. */
  variantIndex: number
  /** Picker item of the ability of the code. */
  item: TieredPickerItem
}

/**
 * Build shown in a tree: an Outdated build is frozen until the update and is shown as a readonly one.
 *
 * @param build build with its lock and Outdated build record.
 * @returns the build itself, or a readonly copy of an Outdated build.
 */
export const shownTreeBuild = <Build extends { readonly: boolean, outdated: object | null }>(build: Build): Build => {
  if (!build.outdated || build.readonly) return build;

  return { ...build, readonly: true };
};

/**
 * Cells of soldier Outdated selections by the group of their steps: a rank in the class tree, a body part in the gene
 * mods, a psi level in the psionic tree, an officer rank in the officer tree.
 *
 * @param selections Outdated selections of a soldier build; empty for a build without them.
 */
export const soldierOutdatedCells = (selections: readonly SoldierOutdatedSelection[]) => selections.reduce((cellsByGroup, selection) => {
  const groupId = SOLDIER_STEP_GROUP_ID[selection.stepKind];
  const cell: OutdatedCell = {
    tierIndex: selection.stepIndex,
    variantIndex: selection.variantIndex,
    item: treeAbilityPickerItem(treeAbility(selection.abilityId)),
  };
  const cells = cellsByGroup.get(groupId);

  if (cells) cells.push(cell);
  else cellsByGroup.set(groupId, [cell]);

  return cellsByGroup;
}, new Map<string, OutdatedCell[]>());

/**
 * Description note of an outdated cell: what the current tree has at its place.
 *
 * @param tierName name of the tier of the cell.
 * @param currentName name of the ability the current tree has in the cell.
 */
const outdatedNote = (tierName: string, currentName: string) => `Outdated selection: in this mod version ${tierName} has ${currentName} here.`;

/**
 * Option of an outdated cell: the ability of the code, selected and not selectable, with the note about the ability
 * the current tree has there.
 *
 * @param cell outdated cell.
 * @param tier tier of the cell.
 * @param current option the current tree has in the cell.
 */
const outdatedOption = (cell: OutdatedCell, tier: TieredPickerTier, current: TieredPickerOption): TieredPickerOption => ({
  item: cell.item,
  appearance: 'selected',
  isDisabled: true,
  note: outdatedNote(tier.name, current.item.name),
});

/**
 * Tiers of the saved tree of an Outdated build: on a tier with Outdated selections the abilities of the code stand in
 * the cells of their variants, selected and marked; the other variants are current.
 *
 * @param tiers tiers of the current tree, shown readonly.
 * @param cells outdated cells of the tiers; empty for a build without Outdated selections.
 * @returns the tiers; the same tiers without cells.
 */
export const savedTreeTiers = <Tier extends BuildTreeTier>(tiers: readonly Tier[], cells: readonly OutdatedCell[]): readonly Tier[] => {
  if (!cells.length) return tiers;

  return tiers.map((tier, tierIndex): Tier => {
    const tierCells = cells.filter(cell => cell.tierIndex === tierIndex);
    const [firstCell] = tierCells;

    if (!firstCell) return tier;

    return {
      ...tier,
      state: 'completed',
      selectedId: firstCell.item.id,
      outdatedItemIds: tierCells.map(cell => cell.item.id),
      options: tier.options.map((option, optionIndex) => {
        const cell = tierCells.find(({ variantIndex }) => variantIndex === optionIndex);

        return cell ? outdatedOption(cell, tier, option) : option;
      }),
    };
  });
};
