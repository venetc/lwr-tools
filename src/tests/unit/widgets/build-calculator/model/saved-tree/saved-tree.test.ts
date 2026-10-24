import { beforeEach, describe, expect, it, vi } from 'vitest';

import { featuredShivPerk, technologyLevelState } from '@entities/shiv';
import { savedTreeTiers, shivOutdatedCells, shivRemovedPerks } from '@widgets/build-calculator/model/saved-tree';
import { useShivBuildTiers } from '@widgets/build-calculator/model/shiv-build-tiers';

import { COLLISION_NOTE, OUTDATED_SHIV_BUILD } from './saved-tree.mock';

vi.mock('@entities/shiv', async () => {
  const { shivPerkByIdStub, TECHNOLOGY_LEVELS_MOCK } = await import('./saved-tree.mock');

  return {
    TECHNOLOGY_LEVELS: TECHNOLOGY_LEVELS_MOCK,
    featuredShivPerk: vi.fn(),
    shivPerkById: shivPerkByIdStub,
    technologyLevelState: vi.fn(),
  };
});

vi.mock('@entities/soldier', () => ({ BODY_PARTS: [], OFFICER_RANKS: [], PSI_LEVELS: [] }));

beforeEach(() => {
  vi.mocked(featuredShivPerk).mockReset().mockReturnValue(null);
  vi.mocked(technologyLevelState).mockReset().mockReturnValue('locked');
});

/**
 * Tiers of the saved SHIV tree of `OUTDATED_SHIV_BUILD`.
 */
const savedShivTiers = () => savedTreeTiers(useShivBuildTiers(OUTDATED_SHIV_BUILD).tiers.value, shivOutdatedCells(OUTDATED_SHIV_BUILD.outdated?.selections ?? []));

describe('saved SHIV tree', () => {
  it('shows both colliding perks selected on their technology level', () => {
    const [firstTier] = savedShivTiers();

    expect(firstTier?.options.map(option => option.appearance)).toEqual(['selected', 'disabled', 'selected']);
  });

  it('completes the technology level of the collision', () => {
    const [firstTier] = savedShivTiers();

    expect(firstTier?.state).toBe('completed');
  });

  it('marks both colliding perks as outdated', () => {
    const [firstTier] = savedShivTiers();

    expect(firstTier?.outdatedItemIds).toEqual(['left', 'right']);
  });

  it('notes the collision in the description of a colliding perk', () => {
    const [firstTier] = savedShivTiers();

    expect(firstTier?.options[2]?.note).toBe(COLLISION_NOTE);
  });

  it('keeps a level without a collision as it is', () => {
    const [, secondTier] = savedShivTiers();

    expect(secondTier?.outdatedItemIds).toEqual([]);
  });

  it('gives the same tiers without outdated cells', () => {
    const { tiers } = useShivBuildTiers(OUTDATED_SHIV_BUILD);

    const savedTiers = savedTreeTiers(tiers.value, []);

    expect(savedTiers).toBe(tiers.value);
  });

  it('lists a perk gone from the SHIV tree for the plate under the tree', () => {
    const perks = shivRemovedPerks(OUTDATED_SHIV_BUILD.outdated?.selections ?? []);

    expect(perks.map(perk => perk.name)).toEqual(['gone']);
  });
});
