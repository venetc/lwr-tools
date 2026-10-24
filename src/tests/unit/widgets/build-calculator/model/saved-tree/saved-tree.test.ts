import { describe, expect, it, vi } from 'vitest';

import { savedTreeTiers, shivOutdatedCells, shivRemovedPerks } from '@widgets/build-calculator/model/saved-tree';
import { useShivBuildTiers } from '@widgets/build-calculator/model/shiv-build-tiers';

import { COLLISION_NOTE, OUTDATED_SHIV_BUILD } from './saved-tree.mock';

vi.mock('@entities/shiv/config/constants/perk-content', async () => ({
  SHIV_PERK_CONTENT: (await import('./saved-tree.mock')).SHIV_PERK_CONTENT_MOCK,
}));

vi.mock('@entities/shiv/config/constants/technology-level-content', async () => ({
  TECHNOLOGY_LEVEL_CONTENT: (await import('./saved-tree.mock')).TECHNOLOGY_LEVEL_CONTENT_MOCK,
}));

vi.mock('@entities/shiv/config/constants/perk-icons', () => ({ SHIV_PERK_ICON: {} }));

vi.mock('@entities/shiv/config/constants/technology-level-icons', () => ({ TECHNOLOGY_LEVEL_ICON: {} }));

/**
 * Tiers of the saved SHIV tree of `OUTDATED_SHIV_BUILD`.
 */
const savedShivTiers = () => savedTreeTiers(useShivBuildTiers(OUTDATED_SHIV_BUILD).tiers.value, shivOutdatedCells(OUTDATED_SHIV_BUILD.outdated?.selections ?? []));

describe('saved SHIV tree', () => {
  it('shows both colliding perks selected on their technology level', () => {
    const [firstTier] = savedShivTiers();

    expect(firstTier?.options.map(option => option.appearance)).toEqual(['selected', 'disabled', 'selected']);
  });

  it('marks both colliding perks as outdated', () => {
    const [firstTier] = savedShivTiers();

    expect(firstTier?.outdatedItemIds).toEqual(['lock-n-load', 'platform-stability']);
  });

  it('notes the collision in the description of a colliding perk', () => {
    const [firstTier] = savedShivTiers();

    expect(firstTier?.options[2]?.note).toBe(COLLISION_NOTE);
  });

  it('keeps a level without a collision as it is', () => {
    const [, secondTier] = savedShivTiers();

    expect(secondTier?.outdatedItemIds).toEqual([]);
  });

  it('lists a perk gone from the SHIV tree for the plate under the tree', () => {
    const perks = shivRemovedPerks(OUTDATED_SHIV_BUILD.outdated?.selections ?? []);

    expect(perks.map(perk => perk.name)).toEqual(['Gone']);
  });
});
