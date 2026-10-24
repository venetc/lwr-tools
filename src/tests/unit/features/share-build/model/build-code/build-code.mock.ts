import type { ShivBuildData, ShivPerkId } from '@entities/shiv';
import { defaultShivBuild } from '@entities/shiv';
import type { AbilityId, BiosoldierBuildData, SoldierBuildData, SoldierClass } from '@entities/soldier';
import { BIOSOLDIER_CLASSES, defaultBiosoldierBuild, defaultSoldierBuild, MEC_CLASSES } from '@entities/soldier';
import type { DeepReadonly } from '@shared/lib/object';

export const BUILD_NAME = 'Overwatch';

/** Last perk of each rank from Lance Corporal, by class id. */
const LAST_PERKS_BY_CLASS = new Map<string, readonly AbilityId[]>([
  ['sniper', ['in-the-zone', 'disabling-shot', 'executioner', 'precision-shot', 'bring-em-on', 'lone-wolf']],
  ['scout', ['smoke-and-mirrors', 'disabling-shot', 'tinker', 'pathfinder', 'kitted', 'extra-conditioning']],
  ['infantry', ['grenadier', 'payload', 'kitted', 'ace', 'tandem-warheads', 'aggression']],
  ['assault', ['breacher', 'fragmentation', 'killer-instinct', 'rapid-fire', 'heat-warheads', 'lock-n-load']],
  ['gunner', ['mayhem', 'holo-rounds', 'penetrator', 'grit', 'impact', 'lock-n-load']],
  ['rocketeer', ['smoke-and-mirrors', 'kitted', 'acid-tech', 'shock-and-awe', 'tandem-warheads', 'extra-conditioning']],
  ['medic', ['smoke-and-mirrors', 'combat-drugs', 'ranger', 'savior', 'holo-rounds', 'sharpshooter']],
  ['engineer', ['smoke-and-mirrors', 'firebase', 'dense-smoke', 'master-mechanic', 'acid-tech', 'extra-conditioning']],
  ['jaeger', ['pyro', 'jetboot-module', 'bring-em-on', 'killer-instinct', 'repulsor', 'sprinter']],
  ['marauder', ['dash-and-bash', 'grit', 'repulsor', 'sprinter', 'repair-servos', 'shadowstep']],
  ['goliath', ['grenadier', 'fortified', 'blast', 'dampening-shield', 'tandem-warheads', 'executioner']],
  ['shogun', ['grenadier', 'jetboot-module', 'sapper', 'arsenal', 'fragmentation', 'extra-conditioning']],
]);

/** First gene mod of every body part: Neural Damping in the Brain. */
const FIRST_GENE_MODS: AbilityId[] = ['neural-damping', 'advanced-perception', 'dual-heart', 'enhanced-metabolism', 'muscle-amp'];

/** Second gene mod of every body part: no Neural Damping. */
const SECOND_GENE_MODS: AbilityId[] = ['smart-macrophages', 'predictive-tracking', 'adrenal-neurosympathy', 'iron-skin', 'regenesis'];

/** Last psionic ability of every psi level. */
const LAST_PSIONIC_ABILITIES: AbilityId[] = ['mind-fray', 'psi-inspire', 'fervor', 'telekinetic-field', 'psi-mastery'];

/** First officer perk of every officer rank. */
const FIRST_OFFICER_PERKS: AbilityId[] = ['strength-in-numbers', 'cover-tactics', 'show-em-the-ropes', 'clutch-leadership', 'camaraderie'];

/** Last perk of every technology level. */
const LAST_SHIV_PERKS: ShivPerkId[] = ['platform-stability', 'damage-control', 'close-combat-specialist', 'absorption-fields', 'smart-macrophages'];

/**
 * Build of the class with the last perk of every rank; a class without its perks in `LAST_PERKS_BY_CLASS` gets only
 * the base perk, which makes no share code.
 *
 * @param build default build of the class.
 */
const withFullTree = <Build extends SoldierBuildData>(build: Build): Build => ({
  ...build,
  perks: [build.soldierClass.basePerk, ...(LAST_PERKS_BY_CLASS.get(build.soldierClass.id) ?? [])],
});

/**
 * Biosoldier build of the class with the last perk of every rank.
 *
 * @param soldierClass biosoldier class.
 */
const fullTreeBiosoldierBuild = (soldierClass: DeepReadonly<SoldierClass>): BiosoldierBuildData => withFullTree(defaultBiosoldierBuild(soldierClass));

/**
 * MEC build of the class with the last perk of every rank.
 *
 * @param soldierClass MEC class.
 */
const fullTreeMecBuild = (soldierClass: DeepReadonly<SoldierClass>): SoldierBuildData => withFullTree(defaultSoldierBuild(soldierClass));

const [FIRST_BIOSOLDIER_CLASS] = BIOSOLDIER_CLASSES;

const [FIRST_MEC_CLASS] = MEC_CLASSES;

/** Sniper build with a full class tree. */
const FULL_TREE_SNIPER_BUILD = fullTreeBiosoldierBuild(FIRST_BIOSOLDIER_CLASS);

/** Sniper build with empty steps between selections: Lone Wolf, Predictive Tracking, Psi Mastery and Combined Arms. */
const GAPPED_BUILD: BiosoldierBuildData = {
  ...defaultBiosoldierBuild(FIRST_BIOSOLDIER_CLASS),
  perks: ['squadsight', null, null, null, null, null, 'lone-wolf'],
  geneMods: [null, 'predictive-tracking', null, null, null],
  psionicAbilities: [null, null, null, null, 'psi-mastery'],
  officerPerks: [null, null, null, null, 'combined-arms'],
};

/** Jaeger build with only Sprinter, the last perk of the last rank. */
const GAPPED_MEC_BUILD: SoldierBuildData = {
  ...defaultSoldierBuild(FIRST_MEC_CLASS),
  perks: ['hunter', null, null, null, null, null, 'sprinter'],
};

/**
 * SHIV build with the last perk of every technology level.
 *
 * @param name build name.
 */
const fullShivBuild = (name: string): ShivBuildData => ({ ...defaultShivBuild(), perks: [...LAST_SHIV_PERKS], name });

export const FULL_TREE_BIOSOLDIER_BUILDS = BIOSOLDIER_CLASSES.map(soldierClass => [soldierClass.name, fullTreeBiosoldierBuild(soldierClass)] as const);

export const FULL_TREE_MEC_BUILDS = MEC_CLASSES.map(soldierClass => [soldierClass.name, fullTreeMecBuild(soldierClass)] as const);

export const BIOSOLDIER_BUILDS: [string, BiosoldierBuildData][] = [
  ['default', defaultBiosoldierBuild(FIRST_BIOSOLDIER_CLASS)],
  ['gene mods with Neural Damping', { ...FULL_TREE_SNIPER_BUILD, geneMods: [...FIRST_GENE_MODS] }],
  ['every psi level', { ...FULL_TREE_SNIPER_BUILD, psionicAbilities: [...LAST_PSIONIC_ABILITIES] }],
  ['every officer rank', { ...FULL_TREE_SNIPER_BUILD, officerPerks: [...FIRST_OFFICER_PERKS] }],
  ['super soldier with its own name', {
    ...FULL_TREE_SNIPER_BUILD,
    geneMods: [...SECOND_GENE_MODS],
    psionicAbilities: [...LAST_PSIONIC_ABILITIES],
    officerPerks: [...FIRST_OFFICER_PERKS],
    name: BUILD_NAME,
  }],
  ['empty steps between selections', GAPPED_BUILD],
  ['every officer rank with only the base perk', { ...defaultBiosoldierBuild(FIRST_BIOSOLDIER_CLASS), officerPerks: [...FIRST_OFFICER_PERKS] }],
];

export const MEC_BUILDS: [string, SoldierBuildData][] = [
  ['default', defaultSoldierBuild(FIRST_MEC_CLASS)],
  ['with its own name', { ...fullTreeMecBuild(FIRST_MEC_CLASS), name: BUILD_NAME }],
  ['empty ranks below a selection', GAPPED_MEC_BUILD],
];

export const SHIV_BUILDS: [string, ShivBuildData][] = [
  ['default', defaultShivBuild()],
  ['every technology level', fullShivBuild('SHIV')],
  ['every technology level with its own name', fullShivBuild(BUILD_NAME)],
];
