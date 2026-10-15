import { describe, expect, it, vi } from 'vitest';

import { useShivBuildTiers } from '@pages/shiv-builds/model/shiv-build-tiers';

import { createBuildMock, FIRST_FILLED_PERKS } from './shiv-build-tiers.mock';

vi.mock('@entities/shiv/config/constants/perk-content', async () => ({
  SHIV_PERK_CONTENT: (await import('./shiv-build-tiers.mock')).SHIV_PERK_CONTENT_MOCK,
}));

vi.mock('@entities/shiv/config/constants/technology-level-content', async () => ({
  TECHNOLOGY_LEVEL_CONTENT: (await import('./shiv-build-tiers.mock')).TECHNOLOGY_LEVEL_CONTENT_MOCK,
}));

vi.mock('@entities/shiv/config/constants/perk-icons', () => ({ SHIV_PERK_ICON: {} }));

vi.mock('@entities/shiv/config/constants/technology-level-icons', () => ({ TECHNOLOGY_LEVEL_ICON: {} }));

describe('useShivBuildTiers', () => {
  it('completes a level with a selection', () => {
    const { tiers } = useShivBuildTiers(createBuildMock(FIRST_FILLED_PERKS));

    expect(tiers.value[0].state).toBe('completed');
  });

  it('opens an empty level of an editable build', () => {
    const { tiers } = useShivBuildTiers(createBuildMock(FIRST_FILLED_PERKS));

    expect(tiers.value[1].state).toBe('available');
  });

  it('keeps a level with a selection completed in a readonly build', () => {
    const { tiers } = useShivBuildTiers(createBuildMock(FIRST_FILLED_PERKS, true));

    expect(tiers.value[0].state).toBe('completed');
  });

  it('locks an empty level of a readonly build', () => {
    const { tiers } = useShivBuildTiers(createBuildMock(FIRST_FILLED_PERKS, true));

    expect(tiers.value[1].state).toBe('locked');
  });

  it('keeps every level of an editable build enabled', () => {
    const { tiers } = useShivBuildTiers(createBuildMock(FIRST_FILLED_PERKS));

    expect(tiers.value.map(tier => tier.isDisabled)).toEqual([false, false]);
  });

  it('disables every level of a readonly build', () => {
    const { tiers } = useShivBuildTiers(createBuildMock(FIRST_FILLED_PERKS, true));

    expect(tiers.value.map(tier => tier.isDisabled)).toEqual([true, true]);
  });

  it('shows the perk selected on a level as selected', () => {
    const { tiers } = useShivBuildTiers(createBuildMock(FIRST_FILLED_PERKS));

    expect(tiers.value[0].options[1].appearance).toBe('selected');
  });

  it('shows the neighbour of the selected perk as disabled', () => {
    const { tiers } = useShivBuildTiers(createBuildMock(FIRST_FILLED_PERKS));

    expect(tiers.value[0].options[0].appearance).toBe('disabled');
  });

  it('shows a perk of an empty level as available', () => {
    const { tiers } = useShivBuildTiers(createBuildMock(FIRST_FILLED_PERKS));

    expect(tiers.value[1].options[0].appearance).toBe('available');
  });

  it('shows a perk of an empty level of a readonly build as disabled', () => {
    const { tiers } = useShivBuildTiers(createBuildMock(FIRST_FILLED_PERKS, true));

    expect(tiers.value[1].options[0].appearance).toBe('disabled');
  });

  it('keeps the selected perk of a readonly build selected', () => {
    const { tiers } = useShivBuildTiers(createBuildMock(FIRST_FILLED_PERKS, true));

    expect(tiers.value[0].options[1].appearance).toBe('selected');
  });

  it('leaves the neighbour of the selected perk free to replace it', () => {
    const { tiers } = useShivBuildTiers(createBuildMock(FIRST_FILLED_PERKS));

    expect(tiers.value[0].options[0].isDisabled).toBe(false);
  });

  it('features the perk selected on the highest filled level', () => {
    const { featuredItem } = useShivBuildTiers(createBuildMock(FIRST_FILLED_PERKS));

    expect(featuredItem.value?.id).toBe('right');
  });
});
