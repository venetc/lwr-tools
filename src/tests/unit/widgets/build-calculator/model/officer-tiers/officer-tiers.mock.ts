import type { AbilityId, OfficerRank, TreeAbility } from '@entities/soldier';
import type { OfficerTreeBuild } from '@widgets/build-calculator/model/officer-tiers';

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

export const OFFICER_RANKS_MOCK = [
  { id: 'alpha', name: 'Alpha', requiredRankName: 'Second', perks: ['alpha-left', 'alpha-right'] },
  { id: 'beta', name: 'Beta', requiredRankName: 'Third', perks: ['beta-left', 'beta-right'] },
  { id: 'gamma', name: 'Gamma', requiredRankName: 'Third', perks: ['gamma-left', 'gamma-right'] },
] as unknown as OfficerRank[];

/**
 * Build with the officer perks.
 *
 * @param officerPerks officer perks by officer rank; null for an empty officer rank.
 * @param readonly whether the build is readonly.
 */
export const createBuildMock = (officerPerks: (string | null)[], readonly = false): OfficerTreeBuild => ({
  officerPerks: officerPerks as OfficerTreeBuild['officerPerks'],
  readonly,
});

export const NO_OFFICER_PERKS = [null, null, null];

export const ALPHA_OFFICER_PERKS = ['alpha-left', null, null];

export const ALPHA_AND_BETA_OFFICER_PERKS = ['alpha-left', 'beta-right', null];

export const ALPHA_BUILD = createBuildMock(ALPHA_OFFICER_PERKS);

/** Arguments of the rank state of each officer rank of `ALPHA_OFFICER_PERKS` in a readonly build. */
export const READONLY_ALPHA_STATE_CALLS = [['alpha-left', true], [null, true], [null, true]];
