import { describe, expect, it } from 'vitest';

import { SHIV_PERK_CONTENT } from '@entities/shiv/config/constants/perk-content';
import { TECHNOLOGY_LEVEL_CONTENT } from '@entities/shiv/config/constants/technology-level-content';

import { shivContentSchema } from './data.schema';

describe('shiv content data', () => {
  it('matches the content schema', () => {
    const content = {
      perks: SHIV_PERK_CONTENT,
      levels: TECHNOLOGY_LEVEL_CONTENT,
    };

    const result = shivContentSchema.safeParse(content);

    expect(result.error?.issues ?? []).toEqual([]);
  });
});
