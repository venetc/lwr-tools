import type { AbilityId, BodyPart, TreeAbility } from '@entities/soldier';
import type { AbilityIconPlaceholder } from '@entities/soldier/model/abilities';
import type { GeneModTreeBuild } from '@widgets/build-calculator/model/gene-mod-tiers';

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
export const treeAbilityStub = (id: AbilityId): TreeAbility => ({
  id,
  name: id,
  description: `${id} description`,
  icon: { selected: `${id}.png`, available: `${id}_available.png`, disabled: `${id}_disabled.png`, placeholder: PLACEHOLDER },
  grants: [],
});

export const BODY_PARTS_MOCK = [
  { id: 'head', name: 'Head', geneMods: ['head-left', 'head-right'] },
  { id: 'chest', name: 'Chest', geneMods: ['chest-left', 'chest-right'] },
  { id: 'feet', name: 'Feet', geneMods: ['feet-left', 'feet-right'] },
] as unknown as BodyPart[];

/**
 * Build with the gene mods and without psionic abilities.
 *
 * @param geneMods gene mods by body part; null for an empty body part.
 * @param readonly whether the build is readonly.
 */
export const createBuildMock = (geneMods: (string | null)[], readonly = false): GeneModTreeBuild => ({
  geneMods: geneMods as GeneModTreeBuild['geneMods'],
  psionicAbilities: [],
  readonly,
});

export const NO_GENE_MODS = [null, null, null];

export const HEAD_AND_CHEST_GENE_MODS = ['head-right', 'chest-left', null];

export const HEAD_AND_CHEST_BUILD = createBuildMock(HEAD_AND_CHEST_GENE_MODS);

/** Arguments of the Build rule for each gene mod of `HEAD_AND_CHEST_BUILD`. */
export const HEAD_AND_CHEST_BLOCK_CALLS = [
  [HEAD_AND_CHEST_BUILD, 0, 'head-left'],
  [HEAD_AND_CHEST_BUILD, 0, 'head-right'],
  [HEAD_AND_CHEST_BUILD, 1, 'chest-left'],
  [HEAD_AND_CHEST_BUILD, 1, 'chest-right'],
  [HEAD_AND_CHEST_BUILD, 2, 'feet-left'],
  [HEAD_AND_CHEST_BUILD, 2, 'feet-right'],
];

/** Arguments of the body part state of each body part of `HEAD_AND_CHEST_GENE_MODS` in a readonly build. */
export const READONLY_HEAD_AND_CHEST_STATE_CALLS = [['head-right', true], ['chest-left', true], [null, true]];

/** Option of a gene mod the Build rule blocks for psionic abilities. */
export const PSIONIC_BLOCKED_OPTION = { appearance: 'disabled', isDisabled: true, note: 'Unavailable with Psionic abilities' };
