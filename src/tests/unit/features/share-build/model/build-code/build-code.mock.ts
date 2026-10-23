import type { ShivBuildData } from '@entities/shiv';
import { selectShivBuildPerk, TECHNOLOGY_LEVELS } from '@entities/shiv';
import { defaultShivBuild } from '@entities/shiv/model/build';
import type { BiosoldierBuildData, SoldierBuildData, SoldierClass } from '@entities/soldier';
import {
  BIOSOLDIER_CLASSES,
  MEC_CLASSES,
  OFFICER_RANKS,
  selectBiosoldierBuildGeneMod,
  selectBiosoldierBuildOfficerPerk,
  selectBiosoldierBuildPsionicAbility,
  selectSoldierBuildPerk,
} from '@entities/soldier';
import { BODY_PART_INDEX_BY_GENE_MOD, BODY_PARTS, NEURAL_DAMPING_ID } from '@entities/soldier/config/constants/body-parts';
import { PSI_LEVELS } from '@entities/soldier/config/constants/psi-levels';
import { SOLDIER_RANKS } from '@entities/soldier/config/constants/soldier-ranks';
import { defaultBiosoldierBuild, defaultSoldierBuild } from '@entities/soldier/model/build';
import type { DeepReadonly } from '@shared/lib/object';

export const BUILD_NAME = 'Overwatch';

/**
 * Last perk of each rank after the first one, in rank order.
 *
 * @param soldierClass biosoldier class or MEC class.
 */
const lastPerksByRank = (soldierClass: DeepReadonly<SoldierClass>) => (
  SOLDIER_RANKS.slice(1).map(rank => soldierClass.perks[rank.id].at(-1) ?? null)
);

/**
 * Biosoldier build of the class with the last perk of every rank, selected with the mutators.
 *
 * @param soldierClass biosoldier class.
 */
const fullTreeBiosoldierBuild = (soldierClass: DeepReadonly<SoldierClass>): BiosoldierBuildData => {
  const build = defaultBiosoldierBuild(soldierClass);

  lastPerksByRank(soldierClass).forEach((perkId, index) => selectSoldierBuildPerk(build, index + 1, perkId));

  return build;
};

/**
 * MEC build of the class with the last perk of every rank, selected with the mutators.
 *
 * @param soldierClass MEC class.
 */
const fullTreeMecBuild = (soldierClass: DeepReadonly<SoldierClass>): SoldierBuildData => {
  const build = defaultSoldierBuild(soldierClass);

  lastPerksByRank(soldierClass).forEach((perkId, index) => selectSoldierBuildPerk(build, index + 1, perkId));

  return build;
};

/**
 * Selects a gene mod in every body part with the mutator.
 *
 * @param build biosoldier build; mutated in place.
 * @param variantIndex gene mod variant of each body part: 0 or 1.
 */
const selectEveryGeneMod = (build: BiosoldierBuildData, variantIndex: number) => {
  BODY_PARTS.forEach((bodyPart, bodyPartIndex) => selectBiosoldierBuildGeneMod(build, bodyPartIndex, bodyPart.geneMods[variantIndex] ?? null));
};

/**
 * Selects the last psionic ability of every psi level with the mutator.
 *
 * @param build biosoldier build; mutated in place.
 */
const selectEveryPsionicAbility = (build: BiosoldierBuildData) => {
  PSI_LEVELS.forEach((psiLevel, levelIndex) => selectBiosoldierBuildPsionicAbility(build, levelIndex, psiLevel.abilities.at(-1) ?? null));
};

/**
 * Selects the first officer perk of every officer rank with the mutator.
 *
 * @param build biosoldier build; mutated in place.
 */
const selectEveryOfficerPerk = (build: BiosoldierBuildData) => {
  OFFICER_RANKS.forEach((officerRank, officerRankIndex) => selectBiosoldierBuildOfficerPerk(build, officerRankIndex, officerRank.perks[0] ?? null));
};

const [FIRST_BIOSOLDIER_CLASS] = BIOSOLDIER_CLASSES;

const [FIRST_MEC_CLASS] = MEC_CLASSES;

/**
 * Biosoldier build with gene mods in every body part, Neural Damping in its own.
 */
const createGeneModsBuild = () => {
  const build = fullTreeBiosoldierBuild(FIRST_BIOSOLDIER_CLASS);

  selectEveryGeneMod(build, 0);
  selectBiosoldierBuildGeneMod(build, BODY_PART_INDEX_BY_GENE_MOD.get(NEURAL_DAMPING_ID) ?? -1, NEURAL_DAMPING_ID);

  return build;
};

/**
 * Biosoldier build with a psionic ability on every psi level.
 */
const createPsionicBuild = () => {
  const build = fullTreeBiosoldierBuild(FIRST_BIOSOLDIER_CLASS);

  selectEveryPsionicAbility(build);

  return build;
};

/**
 * Biosoldier build with an officer perk on every officer rank.
 */
const createOfficerBuild = () => {
  const build = fullTreeBiosoldierBuild(FIRST_BIOSOLDIER_CLASS);

  selectEveryOfficerPerk(build);

  return build;
};

/**
 * Super soldier with its own name: gene mods without Neural Damping, every psi level and every officer rank.
 */
const createSuperSoldierBuild = () => {
  const build = fullTreeBiosoldierBuild(FIRST_BIOSOLDIER_CLASS);

  selectEveryGeneMod(build, 1);
  selectEveryPsionicAbility(build);
  selectEveryOfficerPerk(build);
  build.name = BUILD_NAME;

  return build;
};

/**
 * SHIV build with the last perk of every technology level, selected with the mutator.
 *
 * @param name build name.
 */
const createFullShivBuild = (name: string | null): ShivBuildData => {
  const build = defaultShivBuild();

  TECHNOLOGY_LEVELS.forEach((level, levelIndex) => selectShivBuildPerk(build, levelIndex, level.perks.at(-1)?.id ?? null));

  if (name) build.name = name;

  return build;
};

/**
 * Biosoldier build with empty steps between selections: the last rank, a body part, the last psi level and the last
 * officer rank selected, the rest empty.
 */
const createGappedBuild = () => {
  const build = defaultBiosoldierBuild(FIRST_BIOSOLDIER_CLASS);
  const lastRankIndex = SOLDIER_RANKS.length - 1;
  const lastLevelIndex = PSI_LEVELS.length - 1;
  const lastOfficerRankIndex = OFFICER_RANKS.length - 1;

  selectSoldierBuildPerk(build, lastRankIndex, lastPerksByRank(FIRST_BIOSOLDIER_CLASS).at(-1) ?? null);
  selectBiosoldierBuildGeneMod(build, 1, BODY_PARTS[1]?.geneMods[1] ?? null);
  selectBiosoldierBuildPsionicAbility(build, lastLevelIndex, PSI_LEVELS[lastLevelIndex]?.abilities[0] ?? null);
  selectBiosoldierBuildOfficerPerk(build, lastOfficerRankIndex, OFFICER_RANKS[lastOfficerRankIndex]?.perks[1] ?? null);

  return build;
};

/**
 * Biosoldier build with an officer perk on every officer rank and only the base perk in the class tree.
 */
const createRookieOfficerBuild = () => {
  const build = defaultBiosoldierBuild(FIRST_BIOSOLDIER_CLASS);

  selectEveryOfficerPerk(build);

  return build;
};

/**
 * MEC build with only the last rank selected.
 */
const createGappedMecBuild = () => {
  const build = defaultSoldierBuild(FIRST_MEC_CLASS);

  selectSoldierBuildPerk(build, SOLDIER_RANKS.length - 1, lastPerksByRank(FIRST_MEC_CLASS).at(-1) ?? null);

  return build;
};

export const FULL_TREE_BIOSOLDIER_BUILDS = BIOSOLDIER_CLASSES.map(soldierClass => [soldierClass.name, fullTreeBiosoldierBuild(soldierClass)] as const);

export const FULL_TREE_MEC_BUILDS = MEC_CLASSES.map(soldierClass => [soldierClass.name, fullTreeMecBuild(soldierClass)] as const);

export const BIOSOLDIER_BUILDS = [
  ['default', defaultBiosoldierBuild(FIRST_BIOSOLDIER_CLASS)],
  ['gene mods with Neural Damping', createGeneModsBuild()],
  ['every psi level', createPsionicBuild()],
  ['every officer rank', createOfficerBuild()],
  ['super soldier with its own name', createSuperSoldierBuild()],
  ['empty steps between selections', createGappedBuild()],
  ['every officer rank with only the base perk', createRookieOfficerBuild()],
] as const;

export const MEC_BUILDS = [
  ['default', defaultSoldierBuild(FIRST_MEC_CLASS)],
  ['with its own name', { ...fullTreeMecBuild(FIRST_MEC_CLASS), name: BUILD_NAME }],
  ['empty ranks below a selection', createGappedMecBuild()],
] as const;

export const SHIV_BUILDS = [
  ['default', defaultShivBuild()],
  ['every technology level', createFullShivBuild(null)],
  ['every technology level with its own name', createFullShivBuild(BUILD_NAME)],
] as const;
