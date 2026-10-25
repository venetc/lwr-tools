import type {
  BodyPart,
  classTree,
  ClassTreeRank,
  OfficerRank,
  PsiLevel,
  SoldierClass,
  SoldierOutdatedSelection,
  TreeAbility,
} from '@entities/soldier';
import type { AbilityIconPlaceholder } from '@entities/soldier/model/abilities';
import type { BiosoldierBuild } from '@widgets/build-calculator/model/biosoldier-builds';

const PLACEHOLDER: AbilityIconPlaceholder = {
  selected: { backdrop: '#000000', glyph: '#ffffff' },
  available: { backdrop: '#000000', glyph: '#888888' },
  disabled: { backdrop: '#222222', glyph: '#444444' },
};

/**
 * Stub of `treeAbility`: a tree ability with placeholder texts and icons, without grants.
 *
 * @param id ability id.
 */
export const treeAbilityStub = (id: string): TreeAbility => ({
  id,
  name: id,
  description: `${id} description`,
  icon: { selected: `${id}.png`, available: `${id}_available.png`, disabled: `${id}_disabled.png`, placeholder: PLACEHOLDER },
  grants: [],
});

/**
 * Rank of the class tree with only the fields the tiers read.
 *
 * @param id rank id.
 * @param name rank name.
 * @param perkIds perk ids of the rank.
 */
const rankMock = (id: string, name: string, perkIds: string[]) => ({ id, name, perks: perkIds.map(treeAbilityStub) } as unknown as ClassTreeRank);

export const RIGHT_PERK = treeAbilityStub('right');

export const CLASS_TREE_MOCK: ReturnType<typeof classTree> = {
  name: 'Tester',
  ranks: [
    rankMock('first', 'First', ['granted']),
    rankMock('second', 'Second', ['left', 'right']),
  ],
};

export const BODY_PARTS_MOCK = [
  { id: 'head', name: 'Head', geneMods: ['head-left', 'head-right'] },
  { id: 'feet', name: 'Feet', geneMods: ['feet-first', 'feet-second'] },
] as unknown as BodyPart[];

export const PSI_LEVELS_MOCK = [
  { id: 'low', name: 'Low', abilities: ['low-left', 'low-right'] },
] as unknown as PsiLevel[];

export const OFFICER_RANKS_MOCK = [
  { id: 'alpha', name: 'Alpha', requiredRankName: 'Second', perks: ['alpha-left', 'alpha-right'] },
] as unknown as OfficerRank[];

const SOLDIER_CLASS_MOCK = { id: 'tester', name: 'Tester' } as unknown as SoldierClass;

/**
 * Biosoldier build of the mock class.
 *
 * @param fields fields of the build that differ from an empty editable one.
 */
const createBuildMock = (fields: Partial<Record<'perks' | 'geneMods' | 'psionicAbilities' | 'officerPerks', (string | null)[]> & Pick<BiosoldierBuild, 'readonly' | 'outdated'>>) => ({
  id: 'build',
  soldierClass: SOLDIER_CLASS_MOCK,
  perks: ['granted', null],
  geneMods: [null, null],
  psionicAbilities: [null],
  officerPerks: [null],
  name: 'Tester',
  readonly: false,
  outdated: null,
  ...fields,
} as BiosoldierBuild);

export const EMPTY_BUILD = createBuildMock({});

export const FILLED_BUILD = createBuildMock({
  perks: ['granted', 'right'],
  geneMods: [null, 'feet-second'],
  psionicAbilities: ['low-right'],
  officerPerks: ['alpha-right'],
});

export const READONLY_FILLED_BUILD = { ...FILLED_BUILD, readonly: true };

/** Outdated selection of the code: Feet Old in the cell of the first gene mod of Feet. */
const FEET_OUTDATED_SELECTION = {
  stepKind: 'body-part',
  stepIndex: 1,
  variantIndex: 0,
  abilityId: 'feet-old',
  currentAbilityId: 'feet-first',
} as unknown as SoldierOutdatedSelection;

/** Editable Outdated build with Feet Old in its code. */
export const OUTDATED_BUILD = createBuildMock({ outdated: { code: 'code', selections: [FEET_OUTDATED_SELECTION] } });

/** Lock of every tier of the branches of a frozen build: two ranks, two body parts, a psi level and an officer rank. */
export const FROZEN_TIERS = [true, true, true, true, true, true];

/** Outdated ability ids of `OUTDATED_BUILD` by branch and tier: Feet Old on Feet. */
export const OUTDATED_ITEM_IDS = [[[], []], [[], ['feet-old']], [[]], [[]]];
