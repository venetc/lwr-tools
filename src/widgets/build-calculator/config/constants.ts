import type { TechnologyLevel } from '@entities/shiv';
import { TECHNOLOGY_LEVELS } from '@entities/shiv';
import type { ClassTreeRank, SoldierStepKind } from '@entities/soldier';
import { BODY_PARTS, OFFICER_RANKS, PSI_LEVELS } from '@entities/soldier';
import type { DeepReadonly } from '@shared/lib/object';
import type { TieredPickerItem } from '@shared/ui/tiered-picker';

import { abilityPickerItems } from '../model/ability-picker-item';
import { shivPerkPickerItem } from '../model/shiv-perk-picker-item';

/**
 * Prefix of all stored keys of Biosoldier builds. Keys are never changed: a new shape of stored records
 * gets a new version (`v2`), and loading reads the old one.
 */
export const BIOSOLDIER_BUILD_STORAGE_PREFIX = 'lwr-tools.biosoldier-builds.v1.';

/** Key of the stored order of Biosoldier builds: a JSON array of build ids; its absence means nothing has been saved yet. */
export const BIOSOLDIER_BUILD_ORDER_KEY = `${BIOSOLDIER_BUILD_STORAGE_PREFIX}order`;

/** Key prefix of a stored Biosoldier build, followed by the build id; the value is JSON `{ code, readonly }`. */
export const BIOSOLDIER_BUILD_KEY_PREFIX = `${BIOSOLDIER_BUILD_STORAGE_PREFIX}build.`;

/**
 * Prefix of all stored keys of MEC builds. Keys are never changed: a new shape of stored records
 * gets a new version (`v2`), and loading reads the old one.
 */
export const MEC_BUILD_STORAGE_PREFIX = 'lwr-tools.mec-builds.v1.';

/** Key of the stored order of MEC builds: a JSON array of build ids; its absence means nothing has been saved yet. */
export const MEC_BUILD_ORDER_KEY = `${MEC_BUILD_STORAGE_PREFIX}order`;

/** Key prefix of a stored MEC build, followed by the build id; the value is JSON `{ code, readonly }`. */
export const MEC_BUILD_KEY_PREFIX = `${MEC_BUILD_STORAGE_PREFIX}build.`;

/**
 * Prefix of all stored keys of SHIV builds. Keys are never changed: a new shape of stored records
 * gets a new version (`v2`), and loading reads the old one.
 */
export const SHIV_BUILD_STORAGE_PREFIX = 'lwr-tools.shiv-builds.v1.';

/** Key of the stored order of SHIV builds: a JSON array of build ids; its absence means nothing has been saved yet. */
export const SHIV_BUILD_ORDER_KEY = `${SHIV_BUILD_STORAGE_PREFIX}order`;

/** Key prefix of a stored SHIV build, followed by the build id; the value is JSON `{ code, readonly }`. */
export const SHIV_BUILD_KEY_PREFIX = `${SHIV_BUILD_STORAGE_PREFIX}build.`;

/**
 * Id prefix of default Biosoldier and MEC builds, followed by the class id. Fixed ids let tabs opened for the first
 * time at once save the same records instead of doubling the list.
 */
export const DEFAULT_BUILD_ID_PREFIX = 'default-';

/**
 * Id of the default SHIV build. A fixed id lets tabs opened for the first time at once save the same record
 * instead of doubling the list.
 */
export const DEFAULT_SHIV_BUILD_ID = 'default-shiv';

/** Tab titles of the branches of a Biosoldier build panel, in tab order. */
export const BIOSOLDIER_BRANCH_TITLE = {
  'class-tree': 'Class tree',
  'gene-mods': 'Gene mods',
  'psionic': 'Psionic',
  'officer': 'Officer',
} as const;

/** Tier group of a soldier build panel with the steps of each kind: the branch of a biosoldier, the class tree of a MEC. */
export const SOLDIER_STEP_GROUP_ID = {
  'rank': 'class-tree',
  'body-part': 'gene-mods',
  'psi-level': 'psionic',
  'officer-rank': 'officer',
} as const satisfies Record<SoldierStepKind, keyof typeof BIOSOLDIER_BRANCH_TITLE>;

/** Id of the only tier group of a MEC build panel: the class tree. */
export const MEC_TREE_GROUP_ID = 'class-tree';

/** Id of the only tier group of a SHIV build panel: the SHIV tree. */
export const SHIV_TREE_GROUP_ID = 'shiv-tree';

/** Picker items of the SHIV tree by technology level, built once: the tree is static. */
export const TECHNOLOGY_LEVEL_PICKER_ITEMS: DeepReadonly<TieredPickerItem[][]> = TECHNOLOGY_LEVELS.map(level => level.perks.map(shivPerkPickerItem));

/** Picker items of SHIV perks by perk id. */
export const SHIV_PERK_PICKER_ITEM_BY_ID: ReadonlyMap<string, DeepReadonly<TieredPickerItem>> = new Map(
  TECHNOLOGY_LEVEL_PICKER_ITEMS.flat().map(item => [item.id, item]),
);

/** Picker items of the gene mods by body part, built once: the body parts are static. */
export const BODY_PART_PICKER_ITEMS: DeepReadonly<TieredPickerItem[][]> = BODY_PARTS.map(bodyPart => abilityPickerItems(bodyPart.geneMods));

/** Picker items of the psionic abilities by psi level, built once: the psi levels are static. */
export const PSI_LEVEL_PICKER_ITEMS: DeepReadonly<TieredPickerItem[][]> = PSI_LEVELS.map(psiLevel => abilityPickerItems(psiLevel.abilities));

/** Picker items of the officer perks by officer rank, built once: the officer ranks are static. */
export const OFFICER_RANK_PICKER_ITEMS: DeepReadonly<TieredPickerItem[][]> = OFFICER_RANKS.map(officerRank => abilityPickerItems(officerRank.perks));

/** Note of Neural Damping blocked by psionic abilities. */
export const PSIONIC_BLOCK_NOTE = 'Unavailable with Psionic abilities';

/** Note of a psionic ability blocked by Neural Damping. */
export const NEURAL_DAMPING_BLOCK_NOTE = 'Unavailable with Neural Damping';

/** Note after the name of a perk gone from the SHIV tree, on the plate under the tree. */
export const REMOVED_SHIV_PERK_NOTE = '— removed from the SHIV tree';

/** Title of the row of the SHIV tree in a mini-tree. */
export const SHIV_MINI_TREE_TITLE = 'SHIV tree';

/** Short rank captions under the steps of a mini-tree: full rank names do not fit under a step. */
export const MINI_TREE_RANK_CAPTION = {
  'specialist': 'SPC',
  'lance-corporal': 'LCPL',
  'corporal': 'CPL',
  'sergeant': 'SGT',
  'tech-sergeant': 'TSGT',
  'gunnery-sergeant': 'GSGT',
  'master-sergeant': 'MSGT',
} as const satisfies Record<ClassTreeRank['id'], string>;

/** Short technology level captions under the steps of a SHIV mini-tree: full level names do not fit under a step. */
export const MINI_TREE_TECHNOLOGY_LEVEL_CAPTION = {
  'base-configuration': 'Basic',
  'advancements-1': 'Adv I',
  'advancements-2': 'Adv II',
  'advancements-3a': 'Adv IIIa',
  'advancements-3b': 'Adv IIIb',
} as const satisfies Record<TechnologyLevel['id'], string>;

/** Name a mini-tree gives an empty step open for selection, in place of an ability name. */
export const MINI_TREE_OPEN_STEP_NAME = 'Empty';

/** Words for Outdated selections after their count or names: the chip of an Outdated build and its mini-tree steps. */
export const OUTDATED_SELECTION_WORDS = {
  one: 'outdated selection',
  many: 'outdated selections',
} as const;

/** Name a mini-tree gives an empty locked step, in place of an ability name. */
export const MINI_TREE_LOCKED_STEP_NAME = 'Locked';
