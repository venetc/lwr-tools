import type { classTree, ClassTreeRank, SoldierClass, TreeAbility } from '@entities/soldier';
import type { AbilityIconPlaceholder } from '@entities/soldier/model/abilities';
import type { ClassTreeBuild } from '@widgets/build-calculator/model/class-tree-tiers';

const PLACEHOLDER: AbilityIconPlaceholder = {
  selected: { backdrop: '#000000', glyph: '#ffffff' },
  available: { backdrop: '#000000', glyph: '#888888' },
  disabled: { backdrop: '#222222', glyph: '#444444' },
};

/**
 * Tree ability with placeholder texts and icons.
 *
 * @param id ability id.
 * @param grants abilities it grants.
 */
const treeAbilityMock = (id: string, grants: TreeAbility[] = []): TreeAbility => ({
  id,
  name: id,
  description: `${id} description`,
  icon: { selected: `${id}.png`, available: `${id}_available.png`, disabled: `${id}_disabled.png`, placeholder: PLACEHOLDER },
  grants,
});

/**
 * Rank of the class tree with only the fields the tiers read.
 *
 * @param id rank id.
 * @param name rank name.
 * @param perks perks of the rank.
 */
const rankMock = (id: string, name: string, perks: TreeAbility[]) => ({ id, name, perks } as unknown as ClassTreeRank);

export const RIGHT_PERK = treeAbilityMock('right');

/** Class tree of the mock class: the base perk granting Bonus, Left and Right, then Top. */
export const CLASS_TREE_MOCK: ReturnType<typeof classTree> = {
  name: 'Tester',
  ranks: [
    rankMock('first', 'First', [treeAbilityMock('granted', [treeAbilityMock('bonus')])]),
    rankMock('second', 'Second', [treeAbilityMock('left'), RIGHT_PERK]),
    rankMock('third', 'Third', [treeAbilityMock('top')]),
  ],
};

/** Perk outside the class tree of the mock class. */
export const STRANGER_PERK = treeAbilityMock('stranger');

const SOLDIER_CLASS_MOCK = { id: 'tester', name: 'Tester' } as unknown as SoldierClass;

/**
 * Build of the mock class.
 *
 * @param perks selected perks by rank; null for an empty rank.
 * @param readonly whether the build is readonly.
 */
export const createBuildMock = (perks: (string | null)[], readonly = false): ClassTreeBuild => ({
  soldierClass: SOLDIER_CLASS_MOCK,
  perks,
  name: 'Tester',
  signatureSkill: null,
  readonly,
});

export const PARTIAL_PERKS = ['granted', 'right', null];

/** Arguments of the rank state of each rank of `PARTIAL_PERKS` in a readonly build. */
export const READONLY_PARTIAL_RANK_STATE_CALLS = [['granted', true], ['right', true], [null, true]];
