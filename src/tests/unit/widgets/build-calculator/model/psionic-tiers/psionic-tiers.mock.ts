import type { AbilityId, PsiLevel, TreeAbility } from '@entities/soldier';
import type { PsionicTreeBuild } from '@widgets/build-calculator/model/psionic-tiers';

/**
 * Stub of `treeAbility`: a tree ability with placeholder texts and icons, without grants.
 *
 * @param id ability id.
 */
export const treeAbilityStub = (id: AbilityId): TreeAbility => ({
  id,
  name: id,
  description: `${id} description`,
  icon: { selected: `${id}.png`, available: `${id}_available.png`, disabled: `${id}_disabled.png` },
  grants: [],
});

export const PSI_LEVELS_MOCK = [
  { id: 'low', name: 'Low', abilities: ['low-left', 'low-right'] },
  { id: 'middle', name: 'Middle', abilities: ['middle'] },
  { id: 'high', name: 'High', abilities: ['high-left', 'high-right'] },
] as unknown as PsiLevel[];

/**
 * Build with the psionic abilities and without gene mods.
 *
 * @param psionicAbilities psionic abilities by psi level; null for an empty psi level.
 * @param readonly whether the build is readonly.
 */
export const createBuildMock = (psionicAbilities: (string | null)[], readonly = false): PsionicTreeBuild => ({
  geneMods: [],
  psionicAbilities: psionicAbilities as PsionicTreeBuild['psionicAbilities'],
  readonly,
});

export const NO_PSIONICS = [null, null, null];

export const LOW_PSIONICS = ['low-right', null, null];

export const LOW_AND_HIGH_PSIONICS = ['low-right', null, 'high-left'];

export const LOW_BUILD = createBuildMock(LOW_PSIONICS);

/** Arguments of the Build rule for each psi level of `LOW_BUILD` itself. */
export const LOW_BLOCK_CALLS = [[LOW_BUILD, 0, null], [LOW_BUILD, 1, null], [LOW_BUILD, 2, null]];

/** Arguments of the psi level state of each psi level of `LOW_PSIONICS` in a readonly build, with the first psi level blocked. */
export const READONLY_LOW_STATE_CALLS = [['low-right', true, true], [null, true, false], [null, true, false]];

const UNAVAILABLE_NOTE = 'Unavailable with Neural Damping';

/** Appearance, block and note of the two options of a psi level blocked by Neural Damping. */
export const NEURAL_DAMPING_BLOCKED_OPTIONS = [['disabled', true, UNAVAILABLE_NOTE], ['disabled', true, UNAVAILABLE_NOTE]];
