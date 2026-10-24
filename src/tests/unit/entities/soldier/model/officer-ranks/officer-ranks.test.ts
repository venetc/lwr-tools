import { describe, expect, it, vi } from 'vitest';

import { createOfficerRank } from '@entities/soldier/model/officer-ranks';
import type { OfficerRankId } from '@entities/soldier/model/officer-ranks';

import { ALPHA_CONTENT, STRANGER_CONTENT } from './officer-ranks.mock';

vi.mock('@entities/soldier/config/constants/ability-content', async () => ({
  ABILITY_CONTENT: (await import('./officer-ranks.mock')).ABILITY_CONTENT_MOCK,
}));

vi.mock('@entities/soldier/config/constants/ability-icons', () => ({ ABILITY_ICON: {} }));

vi.mock('@entities/soldier/config/constants/soldier-rank-content', async () => ({
  SOLDIER_RANK_CONTENT: (await import('./officer-ranks.mock')).SOLDIER_RANK_CONTENT_MOCK,
}));

vi.mock('@entities/soldier/config/constants/soldier-rank-icons', () => ({ SOLDIER_RANK_ICON: {} }));

vi.mock('@entities/soldier/config/constants/officer-rank-medals', () => ({ OFFICER_RANK_MEDAL: {} }));

describe('createOfficerRank', () => {
  it('names the rank the game requires for the officer rank', () => {
    const officerRank = createOfficerRank('alpha' as OfficerRankId, ALPHA_CONTENT);

    expect(officerRank.requiredRankName).toBe('Second');
  });

  it('names an unknown required rank by its id', () => {
    const officerRank = createOfficerRank('stranger' as OfficerRankId, STRANGER_CONTENT);

    expect(officerRank.requiredRankName).toBe('missing');
  });

  it('gives the known officer perks and skips unknown ones', () => {
    const officerRank = createOfficerRank('alpha' as OfficerRankId, ALPHA_CONTENT);

    expect(officerRank.perks).toEqual(['alpha-left', 'alpha-right']);
  });
});
