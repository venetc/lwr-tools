import type { AbilityContent, AbilityIcon } from '@entities/soldier/model/abilities';

export const ABILITY_CONTENT_MOCK: Record<string, AbilityContent> = {
  'parent': { code: 1, name: 'Parent', description: 'Grants a child.', grants: ['child', 'unknown'] },
  'child': { code: 2, name: 'Child', description: 'Grants a grandchild.', grants: ['grandchild'] },
  'grandchild': { code: 3, name: 'Grandchild', description: 'Grants nothing.' },
  'loop-start': { code: 4, name: 'Loop Start', description: 'Grants the loop end.', grants: ['loop-end'] },
  'loop-end': { code: 5, name: 'Loop End', description: 'Grants the loop start back.', grants: ['loop-start'] },
};

export const PARENT_ICON: AbilityIcon = { selected: 'parent.png', available: 'parent_available.png', disabled: 'parent_disabled.png' };

export const ABILITY_ICON_MOCK: Record<string, AbilityIcon> = {
  parent: PARENT_ICON,
};
