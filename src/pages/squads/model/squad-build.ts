import type { LoadoutUnitId } from '@entities/loadout';
import type { SquadUnitBuild } from '@features/manage-squads';
import type { BuildDataByKind } from '@features/share-build';
import type { BiosoldierBuild, MecBuild, ShivBuild } from '@widgets/build-calculator';

import { BUILD_LIST_WORD, CAPTION_SEPARATOR, UNIT_NAME_BY_KIND } from '../config/constants';
import { SQUAD_BUILD_KINDS } from './squad-build-kinds';

/**
 * Saved build of each kind, as its Build calculator keeps it.
 */
export interface BuildByKind {
  /** Biosoldier build. */
  biosoldier: BiosoldierBuild
  /** MEC build. */
  mec: MecBuild
  /** SHIV build. */
  shiv: ShivBuild
}

/**
 * Build of the kind, saved or not yet, such as one of a Share code, with the kind of its Build calculator.
 */
export interface SquadBuildDataOf<Kind extends LoadoutUnitId> {
  /** Kind of the build: the unit type of its Build calculator. */
  kind: Kind
  /** Build data. */
  build: BuildDataByKind[Kind]
}

/**
 * Build of any kind, saved or not yet, with the kind of its Build calculator.
 */
export type SquadBuildData = { [Kind in LoadoutUnitId]: SquadBuildDataOf<Kind> }[LoadoutUnitId];

/**
 * Saved build of the kind a Unit refers to, with the kind of its Build calculator.
 */
export interface SquadBuildOf<Kind extends LoadoutUnitId> extends SquadBuildDataOf<Kind> {
  /** Build as its Build calculator keeps it. */
  build: BuildByKind[Kind]
}

/**
 * Saved build a Unit refers to, with the kind of its Build calculator.
 */
export type SquadBuild = { [Kind in LoadoutUnitId]: SquadBuildOf<Kind> }[LoadoutUnitId];

/**
 * Class name of the build: the class of a biosoldier or the MEC class of a MEC; a SHIV shows its unit type name.
 *
 * @param squadBuild build of the Unit.
 */
export const squadBuildClassName = <Kind extends LoadoutUnitId>(squadBuild: SquadBuildDataOf<Kind>) => {
  return SQUAD_BUILD_KINDS[squadBuild.kind].className(squadBuild.build) ?? UNIT_NAME_BY_KIND.get(squadBuild.kind) ?? '';
};

/**
 * Caption of the build: the unit type and the class, such as `Biosoldier · Sniper`; a SHIV shows its unit type alone.
 *
 * @param squadBuild build of the Unit.
 */
export const squadBuildCaption = (squadBuild: SquadBuildData) => {
  if (!SQUAD_BUILD_KINDS[squadBuild.kind].classes) return squadBuildClassName(squadBuild);

  return [UNIT_NAME_BY_KIND.get(squadBuild.kind), squadBuildClassName(squadBuild)].join(CAPTION_SEPARATOR);
};

/**
 * What the Loadout rules need to know about a Unit of the build: the class of a biosoldier with its gene mods,
 * psionic abilities and whether it is an Officer; the MEC class of a MEC; nothing of a SHIV.
 *
 * @param squadBuild build of the Unit.
 */
export const squadBuildWearer = <Kind extends LoadoutUnitId>(squadBuild: SquadBuildDataOf<Kind>) => {
  return SQUAD_BUILD_KINDS[squadBuild.kind].wearer(squadBuild.build);
};

/**
 * Plain class icon of the build: the MEC class icon; null for a build whose icon is drawn from the build or that has none.
 *
 * @param squadBuild build of the icon.
 */
export const squadBuildClassIcon = <Kind extends LoadoutUnitId>(squadBuild: SquadBuildDataOf<Kind>) => {
  return SQUAD_BUILD_KINDS[squadBuild.kind].classIcon(squadBuild.build);
};

/**
 * Key of the build a Unit refers to, unique across the Build calculators.
 *
 * @param build kind and id of the build.
 */
export const squadBuildKey = (build: Readonly<SquadUnitBuild>) => `${build.kind}/${build.id}`;

/**
 * Name of the Build calculator of the unit type, as the Squad planner tells where a build is: `Biosoldier builds`.
 *
 * @param kind unit type of the Build calculator.
 */
export const buildListName = (kind: LoadoutUnitId) => `${UNIT_NAME_BY_KIND.get(kind)} ${BUILD_LIST_WORD}`;
