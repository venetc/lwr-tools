import { BODY_PARTS } from '../config/constants/body-parts';
import type { SelectedGeneMods } from './body-parts';
import type { SelectedPerks } from './class-tree';
import type { SoldierClass } from './classes';

/**
 * Soldier build: class, selected perks and name, without editor state.
 */
export interface SoldierBuildData {
  /** Soldier class of the build. */
  soldierClass: SoldierClass
  /** Selected perks by rank, including the base perk. */
  perks: SelectedPerks
  /** Build name shown in the heading. */
  name: string
}

/**
 * Biosoldier build: a soldier build with gene mods.
 */
export interface BiosoldierBuildData extends SoldierBuildData {
  /** Gene mods by body part; null for a body part without one. */
  geneMods: SelectedGeneMods
}

/**
 * Selects a perk on the rank of the build, keeping higher ranks; clearing a rank clears all higher ranks too.
 * Leaves ranks after the available one and the first rank, which holds the base perk, untouched.
 *
 * @param build soldier build; its perks are mutated in place.
 * @param rankIndex rank index in the tree.
 * @param perkId selected perk id, or null to clear the rank selection.
 */
export const selectSoldierBuildPerk = (build: SoldierBuildData, rankIndex: number, perkId: string | null): void => {
  if (rankIndex < 1) return;
  if (rankIndex > build.perks.length) return;
  if (perkId === null) {
    build.perks.length = rankIndex;
    return;
  }
  build.perks[rankIndex] = perkId;
};

/**
 * Selects a gene mod of the body part, replacing the other one, or clears the body part. Body parts are independent;
 * a body part outside the build or a gene mod of another body part is ignored.
 *
 * @param build biosoldier build; its gene mods are mutated in place.
 * @param bodyPartIndex body part index.
 * @param geneModId selected gene mod id, or null to clear the body part.
 */
export const selectBiosoldierBuildGeneMod = (build: BiosoldierBuildData, bodyPartIndex: number, geneModId: string | null): void => {
  const bodyPart = BODY_PARTS[bodyPartIndex] ?? null;

  if (!bodyPart) return;

  if (geneModId === null) {
    build.geneMods[bodyPartIndex] = null;
    return;
  }

  const geneMod = bodyPart.geneMods.find(id => id === geneModId) ?? null;

  if (!geneMod) return;

  build.geneMods[bodyPartIndex] = geneMod;
};
