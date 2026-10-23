import type { Component } from 'vue';
import { markRaw } from 'vue';

import type { LoadoutUnitId, LoadoutWearer } from '@entities/loadout';
import type { SoldierClass } from '@entities/soldier';
import { BIOSOLDIER_CLASSES, biosoldierBuildBranchSet, isOfficerBuild, MEC_CLASSES } from '@entities/soldier';
import type { BuildDataByKind } from '@features/share-build';
import type { DeepReadonly } from '@shared/lib/object';
import type { SvgIcon } from '@shared/ui/svg-icon';
import {
  BiosoldierBuildTree,
  BiosoldierClassIcon,
  BiosoldierMiniTree,
  MecBuildTree,
  MecMiniTree,
  OfficerRankBadge,
  ShivBuildTree,
  ShivMiniTree,
  useBiosoldierBuildsStore,
  useMecBuildsStore,
  useShivBuildsStore,
} from '@widgets/build-calculator';

import type { BuildByKind } from './squad-build';

/**
 * What the Squad planner does differently for the builds of one kind: where they are kept, how they are named, what
 * the Loadout rules know of them and how a Unit card shows them.
 */
export interface SquadBuildKind<Build, Data> {
  /** Saved builds of the Build calculator of the kind, in its order. */
  builds: () => readonly Build[]
  /** Adds a Default build of the class, or of the kind if it has no classes, to its Build calculator; returns the id of the new build, or null if the kind needs a class and none is given. */
  addDefaultBuild: (soldierClass: DeepReadonly<SoldierClass> | null) => string | null
  /** Adds a build of the data, such as an imported one, to its Build calculator, which takes the data over; returns the id of the new build. */
  importBuild: (data: Data) => string
  /** Classes the New build tab offers a Default build of; null for a kind without classes: it offers a single one. */
  classes: DeepReadonly<SoldierClass[]> | null
  /** Class name of the build, saved or not; null for a kind without classes. */
  className: (build: Readonly<Data>) => string | null
  /** What the Loadout rules need to know about a Unit of the build. */
  wearer: (build: Readonly<Data>) => LoadoutWearer
  /** Mini-tree of the build on a Unit card. */
  miniTree: Component
  /** Tree of the build in the Build dialog; tells of an edit with `change`. */
  buildTree: Component
  /** Class icon drawn from the build itself; null if the kind has none. */
  buildIcon: Component | null
  /** Plain class icon of the build, saved or not; null if it has none. */
  classIcon: (build: Readonly<Data>) => SvgIcon | null
  /** Badge of the senior officer rank of the build; null for a kind without officers. */
  officerRankBadge: Component | null
}

/**
 * Builds of each kind as the Squad planner treats them: biosoldiers, MECs and SHIVs.
 */
export const SQUAD_BUILD_KINDS: { readonly [Kind in LoadoutUnitId]: Readonly<SquadBuildKind<BuildByKind[Kind], BuildDataByKind[Kind]>> } = {
  biosoldier: {
    builds: () => useBiosoldierBuildsStore().builds,
    addDefaultBuild: soldierClass => (soldierClass ? useBiosoldierBuildsStore().addBuild(soldierClass) : null),
    importBuild: data => useBiosoldierBuildsStore().importBuild(data),
    classes: BIOSOLDIER_CLASSES,
    className: build => build.soldierClass.name,
    wearer: (build) => {
      const branchSet = biosoldierBuildBranchSet(build);

      return {
        unit: 'biosoldier',
        classId: build.soldierClass.id,
        hasGeneMod: branchSet === 'gene-mods' || branchSet === 'both',
        hasPsionicAbility: branchSet === 'psionic' || branchSet === 'both',
        isOfficer: isOfficerBuild(build),
      };
    },
    miniTree: markRaw(BiosoldierMiniTree),
    buildTree: markRaw(BiosoldierBuildTree),
    buildIcon: markRaw(BiosoldierClassIcon),
    classIcon: () => null,
    officerRankBadge: markRaw(OfficerRankBadge),
  },
  mec: {
    builds: () => useMecBuildsStore().builds,
    addDefaultBuild: soldierClass => (soldierClass ? useMecBuildsStore().addBuild(soldierClass) : null),
    importBuild: data => useMecBuildsStore().importBuild(data),
    classes: MEC_CLASSES,
    className: build => build.soldierClass.name,
    wearer: build => ({ unit: 'mec', classId: build.soldierClass.id, hasGeneMod: false, hasPsionicAbility: false, isOfficer: false }),
    miniTree: markRaw(MecMiniTree),
    buildTree: markRaw(MecBuildTree),
    buildIcon: null,
    classIcon: build => build.soldierClass.icon,
    officerRankBadge: null,
  },
  shiv: {
    builds: () => useShivBuildsStore().builds,
    addDefaultBuild: () => useShivBuildsStore().addBuild(),
    importBuild: data => useShivBuildsStore().importBuild(data),
    classes: null,
    className: () => null,
    wearer: () => ({ unit: 'shiv', classId: null, hasGeneMod: false, hasPsionicAbility: false, isOfficer: false }),
    miniTree: markRaw(ShivMiniTree),
    buildTree: markRaw(ShivBuildTree),
    buildIcon: null,
    classIcon: () => null,
    officerRankBadge: null,
  },
};
