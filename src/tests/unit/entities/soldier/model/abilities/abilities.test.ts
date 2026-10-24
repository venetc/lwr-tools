import { describe, expect, it, vi } from 'vitest';

import { treeAbility } from '@entities/soldier/model/abilities';
import type { AbilityId } from '@entities/soldier/model/abilities';

import { PARENT_ICON } from './abilities.mock';

vi.mock('@entities/soldier/config/constants/ability-content', async () => ({
  ABILITY_CONTENT: (await import('./abilities.mock')).ABILITY_CONTENT_MOCK,
}));

vi.mock('@entities/soldier/config/constants/ability-icons', async () => ({
  ABILITY_ICON: (await import('./abilities.mock')).ABILITY_ICON_MOCK,
}));

describe('treeAbility', () => {
  it('gives the ability with its name', () => {
    const ability = treeAbility('parent' as AbilityId);

    expect(ability.name).toBe('Parent');
  });

  it('gives the ability with its icon', () => {
    const ability = treeAbility('parent' as AbilityId);

    expect(ability.icon).toEqual(PARENT_ICON);
  });

  it('gives the known abilities it grants and skips unknown ones', () => {
    const ability = treeAbility('parent' as AbilityId);

    expect(ability.grants.map(granted => granted.id)).toEqual(['child']);
  });

  it('gives the abilities a granted ability grants', () => {
    const ability = treeAbility('parent' as AbilityId);

    expect(ability.grants[0]?.grants.map(granted => granted.id)).toEqual(['grandchild']);
  });

  it('skips a grant back into the chain', () => {
    const ability = treeAbility('loop-start' as AbilityId);

    expect(ability.grants[0]?.grants).toEqual([]);
  });
});
