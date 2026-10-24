import type { ShivOutdatedSelection } from '@entities/shiv';
import { shivPerkById } from '@entities/shiv';
import type { SoldierOutdatedSelection } from '@entities/soldier';
import { treeAbility } from '@entities/soldier';
import type { TieredPickerItem, TieredPickerOption, TieredPickerTier } from '@shared/ui/tiered-picker';

import { SOLDIER_STEP_GROUP_ID, TECHNOLOGY_LEVEL_PICKER_ITEMS } from '../config/constants';
import { treeAbilityPickerItem } from './ability-picker-item';
import { shivPerkPickerItem } from './shiv-perk-picker-item';

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
 * Cells of SHIV Outdated selections: each perk of a collision in the cell of its variant on the technology level they
 * share. A perk gone from the SHIV tree has no cell: the plate under the tree lists it.
 *
 * @param selections Outdated selections of a SHIV build; empty for a build without them.
 */
export const shivOutdatedCells = (selections: readonly ShivOutdatedSelection[]) => selections.flatMap((selection): OutdatedCell[] => {
  if (selection.reason !== 'collision') return [];

  const levelItems = TECHNOLOGY_LEVEL_PICKER_ITEMS[selection.levelIndex] ?? [];
  const variantIndex = levelItems.findIndex(item => item.id === selection.perkId);
  const item = levelItems[variantIndex];

  if (!item) return [];

  return [{ tierIndex: selection.levelIndex, variantIndex, item }];
});

/**
 * Picker items of the perks of a SHIV build gone from the SHIV tree, for the plate under the tree.
 *
 * @param selections Outdated selections of a SHIV build; empty for a build without them.
 */
export const shivRemovedPerks = (selections: readonly ShivOutdatedSelection[]) => selections.flatMap(selection => (
  selection.reason === 'removed' ? [shivPerkPickerItem(shivPerkById(selection.perkId))] : []
));

/**
 * Description note of an outdated cell: what the current tree has at its place, or, for cells of the code that share
 * a tier, that the tier takes only one of them now.
 *
 * @param tier tier of the cell.
 * @param current option the current tree has in the cell.
 * @param tierCells outdated cells of the tier.
 */
const outdatedNote = (tier: TieredPickerTier, current: TieredPickerOption, tierCells: readonly OutdatedCell[]) => {
  if (tierCells.length < 2) return `Outdated selection: in this mod version ${tier.name} has ${current.item.name} here.`;

  const names = tierCells.map(cell => cell.item.name);
  const lastName = names.pop();

  return `Outdated selection: in this mod version ${names.join(', ')} and ${lastName} are ${tierCells.length > 2 ? 'all' : 'both'} on ${tier.name}.`;
};

/**
 * Option of an outdated cell: the ability of the code, selected and not selectable, with the note about what the
 * current tree has there.
 *
 * @param cell outdated cell.
 * @param tier tier of the cell.
 * @param current option the current tree has in the cell.
 * @param tierCells outdated cells of the tier.
 */
const outdatedOption = (cell: OutdatedCell, tier: TieredPickerTier, current: TieredPickerOption, tierCells: readonly OutdatedCell[]): TieredPickerOption => ({
  item: cell.item,
  appearance: 'selected',
  isDisabled: true,
  note: outdatedNote(tier, current, tierCells),
});

/**
 * Tiers of the saved tree of an Outdated build: on a tier with Outdated selections the abilities of the code stand in
 * the cells of their variants, selected and marked, such as both perks of a SHIV collision; the other variants are
 * current.
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

        return cell ? outdatedOption(cell, tier, option, tierCells) : option;
      }),
    };
  });
};
