/**
 * Branch with the given number of tiers and selected abilities.
 *
 * @param id branch id.
 * @param tierCount number of tiers.
 * @param selectedCount abilities selected in the branch.
 */
const createBranchMock = (id: string, tierCount: number, selectedCount: number) => ({
  id,
  tiers: Array.from({ length: tierCount }, (_, index) => ({ id: `${id}-${index}` })),
  selectedCount,
  featuredPickerItem: null,
});

export const BRANCHES_MOCK = [
  createBranchMock('class-tree', 7, 3),
  createBranchMock('gene-mods', 5, 0),
  createBranchMock('psionic', 6, 2),
  createBranchMock('officer', 5, 1),
];

/**
 * Branches with the field of the build a selection in each one changes and the field after selecting `picked` on the
 * first tier.
 */
export const BRANCH_SELECTIONS = [
  { branch: 'class-tree', field: 'perks', selected: ['picked'] },
  { branch: 'gene-mods', field: 'geneMods', selected: ['picked', null] },
  { branch: 'psionic', field: 'psionicAbilities', selected: ['picked'] },
  { branch: 'officer', field: 'officerPerks', selected: ['picked'] },
] as const;
