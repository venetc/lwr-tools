import type { BiosoldierBranch, BiosoldierBuildGroup } from './biosoldier-build-groups';

/**
 * Colours of the biosoldier branches: the tab counter, grey for an empty branch, and the described ability name.
 *
 * @param style CSS module of the build tree.
 */
export const useBiosoldierBranchClasses = (style: Record<string, string>) => {
  const branchClasses: Record<BiosoldierBranch, { counter: string | undefined, name: string | null }> = {
    'class-tree': { counter: style.counterClassTree, name: null },
    'gene-mods': { counter: style.counterGeneMods, name: style.geneModName },
    'psionic': { counter: style.counterPsionic, name: style.psionicName },
  };

  /**
   * Classes of a branch: the tab counter, grey for an empty branch, and the described ability name.
   *
   * @param group tier group of the branch.
   */
  const getBranchClasses = (group: BiosoldierBuildGroup) => ({
    counter: [style.counter, group.isEmpty ? style.counterEmpty : branchClasses[group.id].counter],
    name: branchClasses[group.id].name,
  });

  return { getBranchClasses };
};
