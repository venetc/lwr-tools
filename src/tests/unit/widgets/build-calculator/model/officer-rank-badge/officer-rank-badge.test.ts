import { describe, expect, it } from 'vitest';

import { seniorOfficerRank } from '@widgets/build-calculator/model/officer-rank-badge';

import { ALL_OFFICER_PERKS, GAPPED_OFFICER_PERKS, NO_OFFICER_PERKS, OFFICER_RANKS_MOCK, ONE_OFFICER_PERK } from './officer-rank-badge.mock';

describe('seniorOfficerRank', () => {
  it('is the first officer rank with one officer perk', () => {
    const officerRank = seniorOfficerRank(OFFICER_RANKS_MOCK, ONE_OFFICER_PERK);

    expect(officerRank).toBe('first');
  });

  it('is the highest officer rank with an officer perk above an empty one', () => {
    const officerRank = seniorOfficerRank(OFFICER_RANKS_MOCK, GAPPED_OFFICER_PERKS);

    expect(officerRank).toBe('second');
  });

  it('is the last officer rank with an officer perk on every officer rank', () => {
    const officerRank = seniorOfficerRank(OFFICER_RANKS_MOCK, ALL_OFFICER_PERKS);

    expect(officerRank).toBe('third');
  });

  it('is null without officer perks', () => {
    const officerRank = seniorOfficerRank(OFFICER_RANKS_MOCK, NO_OFFICER_PERKS);

    expect(officerRank).toBeNull();
  });
});
